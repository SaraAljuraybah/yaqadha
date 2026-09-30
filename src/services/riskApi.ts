import type { RiskEvaluationInput, RiskEvaluationResult } from '../types';
import { buildRiskRequest } from './tenderForm';

export type RiskErrorCode = 'not_configured' | 'unavailable' | 'configuration_error' | 'invalid_input' | 'upstream_error';

export class RiskApiError extends Error {
  constructor(public readonly code: RiskErrorCode) {
    super(code);
  }
}

const KNOWN_CODES: RiskErrorCode[] = ['not_configured', 'unavailable', 'configuration_error', 'invalid_input', 'upstream_error'];

// Slightly longer than the server's 60s upstream timeout, so the server's clearer error wins
const CLIENT_TIMEOUT_MS = 75_000;

/** Classifies a failed response when it carries no recognised error code (e.g. an HTML 404/5xx page). */
const codeFromStatus = (status: number): RiskErrorCode => {
  if (status === 400 || status === 422) return 'invalid_input';
  if (status === 404 || status === 405 || status === 408 || status === 429 || status >= 500) return 'unavailable';
  return 'upstream_error';
};

/**
 * Evaluates a record through the platform server (/api/risk/evaluate). Used by both the Indicators panel and
 * the Tender Risk Assessment page, so request building and response handling are identical for both.
 * The browser never calls the model API directly.
 */
export async function evaluateRisk(input: RiskEvaluationInput): Promise<RiskEvaluationResult> {
  let response: Response;
  try {
    response = await fetch('/api/risk/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildRiskRequest(input)),
      signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS),
    });
  } catch {
    throw new RiskApiError('unavailable');
  }

  const payload = await response.json().catch(() => null);
  if (response.ok && payload && typeof payload.risk_score === 'number') {
    return payload as RiskEvaluationResult;
  }
  const code = payload?.error?.code;
  if (KNOWN_CODES.includes(code)) throw new RiskApiError(code);
  // A 200 that is not a valid assessment is genuinely unexpected; anything else is classified by its status
  throw new RiskApiError(response.ok ? 'upstream_error' : codeFromStatus(response.status));
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
