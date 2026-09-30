import type { RiskEvaluationInput, RiskEvaluationResult } from '../types';

export type RiskErrorCode = 'not_configured' | 'unavailable' | 'configuration_error' | 'invalid_input' | 'upstream_error';

export class RiskApiError extends Error {
  constructor(public readonly code: RiskErrorCode) {
    super(code);
  }
}

const KNOWN_CODES: RiskErrorCode[] = ['not_configured', 'unavailable', 'configuration_error', 'invalid_input', 'upstream_error'];

// Slightly longer than the server's 60s upstream timeout, so the server's clearer error wins
const CLIENT_TIMEOUT_MS = 75_000;

/** Evaluates a document through the platform server (/api/risk/evaluate). The browser never calls the model API directly. */
export async function evaluateRisk(input: RiskEvaluationInput): Promise<RiskEvaluationResult> {
  let response: Response;
  try {
    response = await fetch('/api/risk/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS),
    });
  } catch {
    throw new RiskApiError('unavailable');
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload || typeof payload.risk_score !== 'number') {
    const code = payload?.error?.code;
    throw new RiskApiError(KNOWN_CODES.includes(code) ? code : 'upstream_error');
  }
  return payload as RiskEvaluationResult;
}

// One in-flight/completed evaluation per record, so switching tabs during a slow
// (cold-start) call does not lose the request or its result. Failed calls are dropped so Retry starts fresh.
const evaluations = new Map<string, Promise<RiskEvaluationResult>>();

export function getCachedEvaluation(recordId: string): Promise<RiskEvaluationResult> | undefined {
  return evaluations.get(recordId);
}

export function startEvaluation(input: RiskEvaluationInput): Promise<RiskEvaluationResult> {
  const request = evaluateRisk(input);
  evaluations.set(input.record_id, request);
  request.catch(() => {
    if (evaluations.get(input.record_id) === request) evaluations.delete(input.record_id);
  });
  return request;
}
