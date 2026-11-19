import type { Request, Response } from "express";

// Extracts tender fields from a specifications PDF with Gemini (server-side key only).
// Demo feature: the file is sent to an external AI service; the UI says so under the upload box.
// Never logs the document, its text, or the key — only error kinds.

export const MAX_PDF_BYTES = 4 * 1024 * 1024;
const ATTEMPT_TIMEOUT_MS = 25_000;
/** Primary model (fast during the demo), then a fallback used only when the primary is busy, rate-limited or too slow. */
const MODELS = ["gemini-2.5-flash", "gemini-3.8-flash"];

const NUMERIC_FIELDS = [
  "tender_value_sar",
  "items_count",
  "bids_count",
  "competitors_count",
  "prior_awards_count",
  "winning_suppliers_count",
  "documents_count",
  "submission_period_days",
] as const;

type ExtractErrorCode = "unsupported_file" | "file_too_large" | "not_configured" | "extraction_failed" | "unavailable";

/** Error response. `detail` carries the real technical reason (status / service message), never the key or document text. */
const fail = (res: Response, status: number, code: ExtractErrorCode, detail?: string) =>
  res.status(status).json({ success: false, error: { code, ...(detail ? { detail } : {}) } });

const describe = (model: string, err: any) =>
  `${model}: ${err?.status ? `HTTP ${err.status} ` : ""}${err?.name && err.name !== "Error" ? `${err.name} ` : ""}${String(err?.message ?? "")
    .replace(/\s+/g, " ")
    .slice(0, 220)}`.trim();

const fieldSchema = (valueType: "STRING" | "NUMBER", extra: Record<string, unknown> = {}) => ({
  type: "OBJECT",
  nullable: true,
  properties: {
    value: { type: valueType, nullable: true, ...extra },
    source: { type: "STRING", nullable: true },
  },
});

const responseSchema = {
  type: "OBJECT",
  properties: {
    page_count: { type: "INTEGER", nullable: true },
    record_id: fieldSchema("STRING"),
    item_category: fieldSchema("STRING"),
    ...Object.fromEntries(NUMERIC_FIELDS.map((f) => [f, fieldSchema("NUMBER")])),
  },
};

const PROMPT = `You read a government tender specifications document (usually Arabic) and extract tender data.
Return JSON only, following the schema. For every field return {"value", "source"}:
- "value": only if the document states it explicitly. Never guess, estimate or infer. If it is not stated, return null for the whole field.
- "source": the exact short quote from the document (max 200 characters, original language) that the value was read from.
Fields:
- record_id: the tender/competition reference number.
- item_category: the procurement category or sector exactly as written in the document (do not translate or normalize it).
- tender_value_sar: estimated tender value in Saudi riyals (number, no separators).
- items_count: number of items/lots in the bill of quantities.
- bids_count, competitors_count, prior_awards_count, winning_suppliers_count: only if the document states them (a specifications document published before bidding usually does not).
- documents_count: number of documents/attachments the bidder must submit, if listed.
- submission_period_days: the bid submission period in days, if stated.
- page_count: number of pages in the document.`;

const cleanText = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

/** Keeps only values that pass the same rules as the form; anything doubtful is dropped (the user fills it in). */
const sanitize = (raw: any) => {
  const fields: Record<string, { value: string; source: string }> = {};
  const take = (name: string, value: string) => {
    if (value) fields[name] = { value, source: cleanText(raw?.[name]?.source, 240) };
  };

  const recordId = cleanText(raw?.record_id?.value, 60);
  take("record_id", recordId);

  // The category is kept exactly as written in the file (free text)
  take("item_category", cleanText(raw?.item_category?.value, 80));

  for (const name of NUMERIC_FIELDS) {
    const n = raw?.[name]?.value;
    if (typeof n !== "number" || !Number.isFinite(n) || n < 0) continue;
    if (name === "tender_value_sar" ? n <= 0 : !Number.isInteger(n)) continue;
    take(name, String(n));
  }

  const pageCount = Number.isInteger(raw?.page_count) && raw.page_count > 0 ? raw.page_count : null;
  return { fields, pageCount };
};

export async function handleTenderExtract(req: Request, res: Response) {
  const body = req.body;
  if (!Buffer.isBuffer(body) || body.length === 0) return fail(res, 415, "unsupported_file");
  if (body.length > MAX_PDF_BYTES) return fail(res, 413, "file_too_large");
  if (body.subarray(0, 5).toString("latin1") !== "%PDF-") return fail(res, 415, "unsupported_file");

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.error("[extract] GEMINI_API_KEY is not set");
    return fail(res, 503, "not_configured");
  }

  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey });
  // Each attempt is capped so the whole request stays under Vercel's 60 s function limit
  const request = (model: string) =>
    ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [{ inlineData: { mimeType: "application/pdf", data: body.toString("base64") } }, { text: PROMPT }],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema as any,
        temperature: 0,
        abortSignal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
      },
    });
  // Busy, rate-limited or too slow: temporary, so try the fallback model, then report "unavailable" (not a file problem)
  const isTemporary = (err: any) =>
    err?.status === 503 || err?.status === 429 || err?.name === "AbortError" || err?.name === "TimeoutError";

  const details: string[] = [];
  let model = MODELS[0];
  try {
    let response;
    try {
      response = await request(model);
    } catch (err: any) {
      if (!isTemporary(err)) throw err;
      details.push(describe(model, err));
      console.error(`[extract] ${model} unavailable (${err?.status ?? err?.name}); trying ${MODELS[1]}`);
      model = MODELS[1];
      response = await request(model);
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(response.text ?? "null");
    } catch {
      parsed = null;
    }
    if (!parsed || typeof parsed !== "object") return fail(res, 502, "extraction_failed", `${model}: the response was not valid JSON`);
    return res.json({ success: true, model, ...sanitize(parsed) });
  } catch (err: any) {
    details.push(describe(model, err));
    console.error(`[extract] failed: ${err?.name ?? "error"}${err?.status ? ` (HTTP ${err.status})` : ""}`);
    return isTemporary(err) ? fail(res, 503, "unavailable", details.join(" | ")) : fail(res, 502, "extraction_failed", details.join(" | "));
  }
}
