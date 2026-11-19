import { TenderField } from './tenderForm';

// Uploads a specifications PDF to the platform server, which extracts the tender fields with an external AI
// service (Gemini). The browser never calls that service directly.

export const MAX_PDF_BYTES = 4 * 1024 * 1024;

export type ExtractErrorCode = 'unsupported_file' | 'file_too_large' | 'not_configured' | 'extraction_failed' | 'unavailable';

export class TenderExtractError extends Error {
  constructor(public readonly code: ExtractErrorCode) {
    super(code);
  }
}

export interface ExtractionResult {
  /** Extracted fields only (fields not stated in the document are absent) */
  fields: Partial<Record<TenderField, { value: string; source: string }>>;
  pageCount: number | null;
  durationMs: number;
}

const KNOWN_CODES: ExtractErrorCode[] = ['unsupported_file', 'file_too_large', 'not_configured', 'extraction_failed', 'unavailable'];

/** Checked in the browser too, so a wrong or oversized file never leaves the device. */
export const checkPdfFile = (file: File): void => {
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) throw new TenderExtractError('unsupported_file');
  if (file.size > MAX_PDF_BYTES) throw new TenderExtractError('file_too_large');
};

export async function extractTenderFields(file: File): Promise<ExtractionResult> {
  checkPdfFile(file);
  const started = performance.now();
  let response: Response;
  try {
    response = await fetch('/api/tender/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/pdf' },
      body: file,
      signal: AbortSignal.timeout(90_000),
    });
  } catch {
    throw new TenderExtractError('unavailable');
  }
  const payload = await response.json().catch(() => null);
  if (response.ok && payload?.fields) {
    return { fields: payload.fields, pageCount: payload.pageCount ?? null, durationMs: Math.round(performance.now() - started) };
  }
  const code = payload?.error?.code;
  if (KNOWN_CODES.includes(code)) throw new TenderExtractError(code);
  if (response.status === 413) throw new TenderExtractError('file_too_large');
  throw new TenderExtractError(response.status >= 500 ? 'unavailable' : 'extraction_failed');
}
