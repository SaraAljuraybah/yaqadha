export type RiskLevel = 'safe' | 'review' | 'blocked';

export interface ViewerRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  viewedAt: string;
  timeSpent: string;
  ip: string;
}

export interface SignatureStep {
  step: number;
  roleTitle: string; // e.g. "أخصائي المشتريات", "مدير الإدارة المالية", "المستشار القانوني", "نائب الرئيس التنفيذي"
  officerName: string;
  department: string;
  isSeniorExecutive: boolean; // رئيس كبير
  status: 'signed' | 'pending' | 'skipped' | 'bypassed';
  signedAt?: string;
  orderCompliant: boolean; // هل تم التوقيع بالترتيب الصحيح؟
  notes?: string;
}

export interface GovernancePath {
  passCount: number; // كم مرة مر على شخص (عدد مرات التداول الإداري)
  viewersCount: number; // كم شخص اطلع عليه
  signaturesCount: number; // كم شخص وقع عليه
  requiredSignaturesCount: number; // عدد التواقيع الإلزامية
  hasSeniorExecutiveSignature: boolean; // هل يوجد توقيع من رؤساء كبار؟
  isSequenceCompliant: boolean; // هل ترتيب التواقيع سليم وفق الحوكمة؟
  speedAnomaly: boolean; // هل يوجد تسريع غير منطقي أو تخطي لإجراءات الرقابة؟
  
  // قرار المنصة التلقائي للنشر
  platformApprovalStatus: 'auto_approved' | 'routed_to_dept_head' | 'precautionary_suspension';
  approvalDecisionText: string;
  assignedAuthority: string; // e.g. "معالي رئيس المنظومة (الرئيس التنفيذي)" أو "رئيس قسم المالية والميزانية"
  actionDetails: string[];
}

export interface AuditLogEntry {
  id: string;
  user: string;
  role: string;
  action: string;
  timestamp: string;
  ip: string;
  device: string;
  isFlagged?: boolean;
  flagReason?: string;
  hashVerified?: boolean;
}

export interface SignatureStatus {
  id: string;
  name: string;
  title: string;
  avatar: string;
  department: string;
  status: 'approved' | 'pending' | 'rejected' | 'blocked';
  timestamp?: string;
}

export interface FlaggedEvidence {
  id: string;
  timestamp: string;
  user: string;
  actionTitle: string;
  description: string;
  anomalyType: 'conflict_of_interest' | 'unauthorized_edit' | 'late_tampering' | 'security_breach' | 'bypassed_signatures';
  riskScore: number;
  ipAddress: string;
  location: string;
  hashBefore: string;
  hashAfter: string;
}

export interface DocumentDossier {
  id: string;
  code: string; // e.g. #YQ-9082
  title: string;
  category: string;
  department: string;
  responsibleDeptHead: string; // رئيس القسم المختص
  budget?: string;
  creationDate: string;
  lastModified: string;
  status: 'draft' | 'under_review' | 'blocked' | 'published';
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  tags: string[];
  
  // تفاصيل التتبع الدقيق ومسار التواقيع
  governance: GovernancePath;
  viewers: ViewerRecord[];
  signatureSteps: SignatureStep[];

  metrics: {
    views: number;
    downloads: number;
    edits: number;
    exportAttempts: number;
  };
  auditLogs: AuditLogEntry[];
  signatures: SignatureStatus[];
  evidences: FlaggedEvidence[];
  aiAnalysis?: {
    summary: string;
    detectedConflicts: string[];
    legalArticles: string[];
    recommendedAction: string;
  };

  // Input sent to the Yaqadha procurement risk model (language-neutral)
  riskInput?: RiskEvaluationInput;
}

// ---- Yaqadha Procurement Risk API v1.1 (proxied through the platform server) ----
// Model Yaqadha-Procurement-IF-v1.1, configuration 2.0. Contract taken from the model's /openapi.json and
// sample responses. The API rejects unknown fields with 422, so requests carry exactly these fields.

/** Fields the platform sends to POST /api/v1/risk/evaluate (all optional in the API; the form requires them). */
export interface RiskEvaluationInput {
  record_id: string;
  item_category: string;
  tender_value_sar: number;
  items_count: number;
  bids_count: number;
  competitors_count: number;
  prior_awards_count: number;
  winning_suppliers_count: number;
  documents_count: number;
  submission_period_days: number;
}

export interface RiskTopFactor {
  factor_ar: string;
  factor_en: string;
  points: number;
  compared_to_usual_ar: string;
  compared_to_usual_en: string;
  source: string;
  points_note_ar: string;
  points_note_en: string;
}

export interface RiskTriggeredRule {
  rule_id: string;
  indicator: string;
  title_ar: string;
  title_en: string;
  severity: string;
  impact_level: number;
  strength: number;
  observed_ar: string;
  observed_en: string;
  critical_override: boolean;
}

export interface RiskSimilarTenders {
  category: string;
  reference_count: number;
  share_below_percent: number;
  record_value_sar: number;
  distribution_sar: { p10: number; p25: number; median: number; p75: number; p90: number };
  summary_ar: string;
  summary_en: string;
}

export interface RiskEvaluationResult {
  record_id: string;
  model_version: string;
  configuration_version: string;
  /** "completed", or "insufficient_data" when required signals are missing (no score then) */
  assessment_status: string;
  risk_score: number | null;
  risk_color: 'Green' | 'Yellow' | 'Red' | null;
  review_required: boolean;
  recommended_action_ar: string;
  recommended_action_en: string;
  processing_time_ms: number;
  // Present when the assessment completed
  critical_override?: boolean;
  top_factors?: RiskTopFactor[];
  top_factors_points_total?: number;
  other_factors_points?: number;
  triggered_rules?: RiskTriggeredRule[];
  similar_tender_comparison?: RiskSimilarTenders | null;
  explanation_ar?: string;
  explanation_en?: string;
  disclaimer_ar?: string;
  disclaimer_en?: string;
  audit_components?: { impact_level?: number } & Record<string, unknown>;
  // Present when data is insufficient: signal name → reason (English text from the model)
  missing_signal_reasons?: Record<string, string>;
}

export type ActiveScreen =
  | 'overview'
  | 'approval_requests'
  | 'file_dossier' 
  | 'indicators_hub'
  | 'executive_dashboard'
  | 'access_management'
  | 'tender_risk_assessment';
