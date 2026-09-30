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
  platformApprovalStatus: 'auto_approved' | 'routed_to_dept_head' | 'escalated_to_ceo_permanently_blocked';
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

// ---- Yaqadha procurement risk model API (proxied through server.ts) ----
// The API rejects unknown fields with 422, so these shapes match its contract exactly.

export type RiskRuleId = 'PROC_001' | 'DOC_001' | 'FIN_001' | 'COI_001' | 'CYB_001' | 'CAP_001';

export type RiskFindingStatus = 'none' | 'weak_signal' | 'observed' | 'corroborated' | 'confirmed';

export interface RiskFinding {
  rule_id: RiskRuleId;
  status: RiskFindingStatus;
  manifestation: string;
  evidence_references: string[];
}

export interface RiskEvaluationInput {
  record_id: string;
  tender_value_amount: number;
  tender_value_currency: string;
  lot_count: number;
  bid_count: number;
  tenderer_count: number;
  award_count: number;
  supplier_count: number;
  document_count: number;
  findings: RiskFinding[];
}

export interface RiskTriggeredRule {
  rule_id: string;
  domain: string;
  violation_type: string;
  status: string;
  evidence_confidence: number;
  impact_level: number;
  severity: string;
  critical_override: boolean;
  manifestation: string;
  evidence_references: string[];
  legal_basis: string;
}

export interface RiskEvaluationResult {
  record_id: string;
  model_version: string;
  configuration_version: string;
  anomaly_raw_score: number;
  anomaly_percentile: number;
  currency_normalization: string;
  governance_evidence: number;
  blended_likelihood: number;
  likelihood_score: number;
  impact_level: number;
  base_risk_score: number;
  applied_floor: number;
  risk_score: number;
  risk_color: 'Green' | 'Yellow' | 'Red';
  review_required: boolean;
  critical_override: boolean;
  triggered_rules: RiskTriggeredRule[];
  matrix_handling: string[];
  recommended_action: string;
  explanation: string;
  disclaimer: string;
}

export type ActiveScreen = 
  | 'file_dossier' 
  | 'indicators_hub'
  | 'yellow_risk_inspection' 
  | 'red_risk_inspection' 
  | 'executive_dashboard'
  | 'access_management'
  | 'tender_risk_assessment';
