import type { RiskEvaluationInput, RiskEvaluationResult } from '../types';
import { buildRiskRequest } from './tenderForm';

export type RiskErrorCode = 'not_configured' | 'unavailable' | 'configuration_error' | 'invalid_input' | 'upstream_error';

export class RiskApiError extends Error {
  /** `detail`: the real technical reason reported by the server (status, rejected fields), shown under the message */
  constructor(public readonly code: RiskErrorCode, public readonly detail?: string) {
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
 * Evaluates a record through the platform server (/api/risk/evaluate). Used by both the case page panel and
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
  } catch (err: any) {
    throw new RiskApiError('unavailable', err?.name === 'TimeoutError' ? 'timeout (browser)' : 'network error (browser)');
  }

  const payload = await response.json().catch(() => null);
  // A valid assessment always has a status; risk_score is null when the model reports insufficient data
  if (response.ok && payload && typeof payload.assessment_status === 'string') {
    return payload as RiskEvaluationResult;
  }
  const code = payload?.error?.code;
  const detail: string | undefined = typeof payload?.error?.detail === 'string' ? payload.error.detail : undefined;
  if (KNOWN_CODES.includes(code)) throw new RiskApiError(code, detail);
  // A 200 that is not a valid assessment is genuinely unexpected; anything else is classified by its status
  throw new RiskApiError(
    response.ok ? 'upstream_error' : codeFromStatus(response.status),
    detail ?? (response.ok ? 'HTTP 200 without assessment_status' : `HTTP ${response.status}`)
  );
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
