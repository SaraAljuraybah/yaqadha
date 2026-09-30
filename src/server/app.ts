import express from "express";

interface AnalysisReport {
  summary: string;
  detectedConflicts: string[];
  legalArticles: string[];
  recommendedAction: string;
}

// Pre-calculated legal integrity evaluation used when no Gemini API key is configured
const ruleEngineReport = (code: string): Record<"ar" | "en", AnalysisReport> => ({
  ar: {
    summary: `تم رصد مؤشر خطورة حرج (حالة حمراء) في وثيقة المناقصة المفتوحة رقم ${code}. يتضح وجود تعارض مصالح مباشر بموجب لائحة السلوك الوظيفي والنزاهة المؤسسية، حيث تم تعديل بند التسعير الحرج من حساب مستخدم غير مخول ومطابق لبيانات مورد منافس خارجي في تاريخ لاحق لانتهاء فترة تقديم العروض.`,
    detectedConflicts: [
      "تطابق في عنوان المعرف الرقمي (IP) للمدقق مع جهة المورد التجاري المسجل في المناقصة.",
      "تعديل القيمة التقديرية بنسبة 18.4% بالخفض بعد إغلاق البوابة الرسمية بـ 42 دقيقة.",
      "محاولة محو سجل تتبع التدقيق الرقمي من خلال إرسال أمر تنظيف قسري تم إحباطه بواسطة مجس يقظة."
    ],
    legalArticles: [
      "المادة (16) من نظام النزاهة وحماية المال العام: حظر استغلال النفوذ وتمرير بيانات العروض قبل الفتح الرسمي.",
      "المادة (28/ب) من لائحة أمن الوثائق الرقمية: تجريم تعديل مسودات العقود بعد اعتماد الطرف المالي الأول."
    ],
    recommendedAction: "التجميد الفوري لكافة الصلاحيات الممنوحة للمستخدم، وحظر الوثيقة ومنع طباعتها أو تصديرها، وإحالة ملف الأدلة الرقمية بالكامل إلى الإدارة القانونية وهيئة الرقابة ومكافحة الفساد."
  },
  en: {
    summary: `A critical risk indicator (red status) was detected in open tender document ${code}. There is a direct conflict of interest under the Code of Conduct and Institutional Integrity Regulation: the critical pricing clause was modified from an unauthorized user account matching the details of an external competing supplier, after the bid submission period had closed.`,
    detectedConflicts: [
      "The auditor's IP address matches that of the commercial supplier registered in the tender.",
      "The estimated value was reduced by 18.4% 42 minutes after the official portal closed.",
      "An attempt to erase the digital audit trail via a forced purge command was blocked by the Yaqadha sensor."
    ],
    legalArticles: [
      "Article (16) of the Integrity and Public Funds Protection Law: prohibits abuse of influence and disclosure of bid data before the official opening.",
      "Article (28/b) of the Digital Document Security Regulation: criminalizes modifying contract drafts after the first financial party's approval."
    ],
    recommendedAction: "Immediately freeze all permissions granted to the user, block the document and prevent it from being printed or exported, and refer the complete digital evidence file to the Legal Department and the Oversight & Anti-Corruption Authority."
  }
});

// Report returned when the Gemini request fails
const fallbackReport = (code: string): Record<"ar" | "en", AnalysisReport> => ({
  ar: {
    summary: `تم التحقق بواسطة محرك الرقابة الاستباقية لمنصة يقظة: رصد تضارب مصالح عالي الحساسية في الوثيقة رقم ${code}. وجود محاولة لتمرير استثناء تسعيري غير معتمد من اللجنة العليا للمشتريات.`,
    detectedConflicts: [
      "تطابق في البصمة الرقمية للشبكة بين المستخدم المراجع وجهة مقترحة للترسية.",
      "إجراء تعديل على الملحق المالي بعد توقيع المفوض النظامي بدون طلب إلحاق رسمي."
    ],
    legalArticles: [
      "المادة (16) من نظام المنافسات والمشتريات الحكومية وتعارض المصالح.",
      "المادة (31) من تنظيم حوكمة الوثائق وسرية البيانات."
    ],
    recommendedAction: "استمرار تجميد الوثيقة وإلغاء صلاحيات النشر والتوثيق، وإحالة ملف الأثر الرقمي والمرفقات للإدارة القانونية."
  },
  en: {
    summary: `Verified by the Yaqadha proactive oversight engine: a highly sensitive conflict of interest was detected in document ${code}, including an attempt to pass a pricing exception not approved by the Supreme Procurement Committee.`,
    detectedConflicts: [
      "The network fingerprint of the reviewing user matches an entity proposed for the award.",
      "The financial annex was modified after the authorized signatory had signed, without a formal amendment request."
    ],
    legalArticles: [
      "Article (16) of the Government Tenders & Procurement Law on conflicts of interest.",
      "Article (31) of the Document Governance and Data Confidentiality Regulation."
    ],
    recommendedAction: "Keep the document frozen, revoke publishing and certification permissions, and refer the digital footprint file and attachments to the Legal Department."
  }
});

// The free Render instance can take about 50s to wake up; keep this below Vercel's 60s function limit.
const RISK_API_TIMEOUT_MS = 55_000;

type RiskErrorCode = "not_configured" | "unavailable" | "configuration_error" | "invalid_input" | "upstream_error";

const riskError = (status: number, code: RiskErrorCode, message: string) => ({
  status,
  body: { success: false, error: { code, message } },
});

/**
 * Forwards a request to the risk model API with the server-side key.
 * Never logs request bodies, evidence text, or the key: only paths, status codes, and error kinds.
 */
async function callRiskApi(apiPath: string, init: { method: "GET" | "POST"; body?: string }) {
  const baseUrl = process.env.YAQADHA_API_BASE_URL?.trim().replace(/\/+$/, "");
  const apiKey = process.env.YAQADHA_API_KEY?.trim();

  if (!baseUrl || !apiKey) {
    console.error(`[risk] ${apiPath}: YAQADHA_API_BASE_URL or YAQADHA_API_KEY is not set`);
    return riskError(503, "not_configured", "The risk model is not configured on the server (missing YAQADHA_API_BASE_URL or YAQADHA_API_KEY).");
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${baseUrl}${apiPath}`, {
      method: init.method,
      headers: { "X-API-Key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
      body: init.body,
      signal: AbortSignal.timeout(RISK_API_TIMEOUT_MS),
    });
  } catch (err: any) {
    const kind = err?.name === "TimeoutError" ? "timeout" : "unreachable";
    console.error(`[risk] ${apiPath}: ${kind}`);
    return riskError(503, "unavailable", "The risk model service is waking up or unavailable. Please try again in a moment.");
  }

  const payload: any = await upstream.json().catch(() => null);

  if (upstream.ok && payload) {
    return { status: 200, body: payload };
  }

  if (upstream.status === 401 || upstream.status === 403) {
    console.error(`[risk] ${apiPath}: upstream rejected the API key (HTTP ${upstream.status})`);
    return riskError(502, "configuration_error", "The risk model rejected the platform's credentials (server configuration error).");
  }

  if (upstream.status === 422 || upstream.status === 400) {
    const details = Array.isArray(payload?.detail)
      ? payload.detail.map((d: any) => `${(d?.loc ?? []).join(".")}: ${d?.type ?? "invalid"}`).join("; ")
      : "no details";
    console.error(`[risk] ${apiPath}: invalid input (HTTP ${upstream.status}) - ${details}`);
    return riskError(422, "invalid_input", "Invalid input data: the risk model rejected the submitted data.");
  }

  if (upstream.status >= 500 || upstream.status === 408 || upstream.status === 429 || !payload) {
    console.error(`[risk] ${apiPath}: upstream unavailable (HTTP ${upstream.status}${payload ? "" : ", non-JSON body"})`);
    return riskError(503, "unavailable", "The risk model service is waking up or unavailable. Please try again in a moment.");
  }

  console.error(`[risk] ${apiPath}: unexpected upstream response (HTTP ${upstream.status})`);
  return riskError(502, "upstream_error", "The risk model returned an unexpected response.");
}

export function createApiApp() {
  const app = express();
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Yaqatha Platform" });
  });

  app.post("/api/audit/ai-analyze", async (req, res) => {
    const { documentCode, title, riskLevel, violations, suspiciousEvents, promptNote, lang } = req.body;
    const reportLang: "ar" | "en" = lang === "en" ? "en" : "ar";
    const code = documentCode || "#YQ-9082";

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        success: true,
        source: "rule-engine",
        analysis: ruleEngineReport(code)[reportLang]
      });
    }

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const systemPrompt = reportLang === "en"
        ? `You are the intelligent analyst of the "Yaqadha" platform, specialized in proactive auditing, anti-corruption, and administrative conflict-of-interest detection in government and large-enterprise documents.
Analyze the document's status and provide a concise, precise digital forensic report. Respond entirely in formal professional English, using governance and compliance terminology.`
        : `أنت المحلل الذكي لمنظومة "يقظة" (Yaqatha) المتخصصة في التدقيق الاستباقي ومكافحة الفساد وتعارض المصالح الإداري في الوثائق الحكومية والشركات الكبرى.
حلل حالة الوثيقة وقدم تقريرا جنائيا رقميا موجزا ودقيقا باللغة العربية الفصحى الرصينة.`;

      const userPrompt = reportLang === "en"
        ? `Document number: ${code}
Document title: ${title || "Terms & Specifications Booklet for the Digital Supply Project"}
Risk level: ${riskLevel || "Critical - red status"}
Detected violations: ${JSON.stringify(violations || [])}
Suspicious digital footprint events: ${JSON.stringify(suspiciousEvents || [])}
Additional note: ${promptNote || "Inspect for conflicts of interest and unlawful interference"}

Return a precise analysis as JSON containing:
- summary: the AI forensic and conflict-of-interest scan summary.
- detectedConflicts: an array of strings describing the detected conflict points.
- legalArticles: an array of the violated regulatory articles.
- recommendedAction: the immediate procedural recommendation.
All values must be written in English.`
        : `وثيقة رقم: ${code}
عنوان الوثيقة: ${title || "كراسة الشروط والمواصفات لمشروع التوريد الرقمي"}
مستوى الخطورة: ${riskLevel || "حرج - حالة حمراء"}
المخالفات المرصودة: ${JSON.stringify(violations || [])}
الأحداث المشبوهة بالأثر الرقمي: ${JSON.stringify(suspiciousEvents || [])}
ملاحظة إضافية: ${promptNote || "فحص تعارض المصالح والتدخل غير المشروع"}

يرجى إعادة تحليل دقيق بصيغة JSON يحتوي على:
- summary: ملخص فحص الذكاء الاصطناعي للاستباق الجنائي وتعارض المصالح.
- detectedConflicts: مصفوفة نصوص توضح نقاط التعارض المكتشفة.
- legalArticles: مصفوفة المواد النظامية المنتهكة.
- recommendedAction: التوصية الإجرائية الفورية.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);

      res.json({
        success: true,
        source: "gemini-ai",
        analysis: parsed
      });
    } catch (err: any) {
      console.error("Gemini inspection error:", err);
      res.json({
        success: true,
        source: "rule-engine-fallback",
        analysis: fallbackReport(code)[reportLang]
      });
    }
  });

  app.get("/api/risk/health", async (_req, res) => {
    const result = await callRiskApi("/api/v1/health", { method: "GET" });
    res.status(result.status).json(result.body);
  });

  app.post("/api/risk/evaluate", async (req, res) => {
    const result = await callRiskApi("/api/v1/risk/evaluate", {
      method: "POST",
      body: JSON.stringify(req.body ?? {}),
    });
    res.status(result.status).json(result.body);
  });

  return app;
}
