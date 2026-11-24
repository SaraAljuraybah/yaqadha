// ============================================================================
// Central demo data — the single source of every mock fact shown in the platform.
// Documents, people, counts, notifications, delegation and legal references all
// live here so every page tells the same story. Every user-facing text field is
// given as { ar, en }; IDs, codes, hashes, IPs and numbers stay language-neutral.
// ============================================================================

import { DocumentDossier } from '../types';
import { Lang, Localizable, LocalizedText, localize } from '../i18n/localize';
import { CURRENT_USER } from './currentUser';

/** Joins localized fragments per language (used to build sentences around shared references). */
const join = (...parts: (LocalizedText | string)[]): LocalizedText => ({
  ar: parts.map((p) => (typeof p === 'string' ? p : p.ar)).join(''),
  en: parts.map((p) => (typeof p === 'string' ? p : p.en)).join(''),
});

// ----------------------------------------------------------------------------
// 1. Demo clock — "today" in the demo story (Sunday 8 November 2026, 10:42 AM)
// ----------------------------------------------------------------------------
export const DEMO_NOW = {
  isoDate: '2026-11-08',
  isoDateTime: '2026-11-08T10:42:00',
  time: '10:42',
  dateLabel: { ar: 'الأحد 8 نوفمبر 2026', en: 'Sunday, 8 November 2026' },
};

// ----------------------------------------------------------------------------
// 2. Legal references — every regulation/policy cited anywhere in the platform.
//    These are demo references and must be verified before any real use.
//    Risk model v1.1 (Yaqadha-Procurement-IF-v1.1, configuration 2.0), checked on 2026-11-19: its responses carry
//    no legal-basis field and cite no article or regulation. Its 8 governance rules (PROC_SPLIT, PROC_PRICE,
//    PROC_CONCENTRATION, PROC_COMPETITION, PROC_NEW_VENDOR, PROC_AMENDMENT, PROC_RUSHED, PROC_DIRECT_AWARD)
//    return titles and observed values only. The old v1.0 returned a legal_basis per triggered rule.
// ----------------------------------------------------------------------------
export const LEGAL_REFERENCES = {
  /**
   * VERIFY: attribution changed in the UI redesign. Before it, the platform cited article 43 as
   * "المادة (43) من لائحة المنافسات والمشتريات" (document data) and as
   * "المادة (43) من لائحة المنافسات والمشتريات والاعتمادات الإدارية" (indicators screen).
   * It is now attributed everywhere to "لائحة الحوكمة والاعتمادات الإدارية". See LEGAL_REFERENCE_NOTES.
   */
  governanceArt43: {
    ar: 'المادة 43 من لائحة الحوكمة والاعتمادات الإدارية',
    en: 'Article 43 of the Governance & Administrative Approvals Regulation',
  },
  internalGovernancePolicy: {
    ar: 'سياسة الحوكمة الداخلية',
    en: 'the Internal Governance Policy',
  },
  infoSecPolicy: {
    ar: 'سياسة أمن المعلومات الداخلية',
    en: 'the Internal Information Security Policy',
  },
  /** National law (no article number cited). Used in the escalation approval window. */
  nazahaLaw: {
    ar: 'نظام هيئة الرقابة ومكافحة الفساد',
    en: 'the Oversight and Anti-Corruption Authority Law',
  },
} satisfies Record<string, LocalizedText>;

export type LegalReferenceId = keyof typeof LEGAL_REFERENCES;

/**
 * Verification notes (not shown in the UI).
 * governanceArt43, internalGovernancePolicy and infoSecPolicy are INTERNAL policies of the demo entity,
 * not national laws or regulations. Only nazahaLaw refers to a national law.
 */
export const LEGAL_REFERENCE_NOTES: Record<LegalReferenceId, string> = {
  governanceArt43:
    'Internal policy of the demo entity ("لائحة الحوكمة والاعتمادات الإدارية" is the entity\'s own regulation, not a national law). ' +
    'Attribution changed from "لائحة المنافسات والمشتريات" — needs verification.',
  internalGovernancePolicy:
    'Internal policy of the demo entity. Used as the basis of violation 2 with no article number, pending a verified reference.',
  infoSecPolicy: 'Internal policy of the demo entity. Used as the basis of violation 3 with no article number.',
  nazahaLaw:
    'National law, cited by name only with no article number. Replaced "المادة (16) من نظام مكافحة الفساد وتعارض المصالح", which is not an actual law.',
};

export const legalRef = (id: LegalReferenceId, lang: Lang): string => LEGAL_REFERENCES[id][lang];

// ----------------------------------------------------------------------------
// 3. People
// ----------------------------------------------------------------------------
export const PEOPLE = {
  fahad: { name: CURRENT_USER.name, initials: CURRENT_USER.initials },
  ahmed: { name: { ar: 'أ. أحمد الخالد', en: 'Mr. Ahmed Al-Khaled' } },
  tariq: { name: { ar: 'د. طارق المنصور', en: 'Dr. Tariq Al-Mansour' } },
  salman: { name: { ar: 'أ. سلمان العتيبي', en: 'Mr. Salman Al-Otaibi' } },
  reem: { name: { ar: 'أ. ريم الدوسري', en: 'Ms. Reem Al-Dosari' } },
  noura: { name: { ar: 'أ. نورة الشمري', en: 'Ms. Noura Al-Shammari' } },
  abdullah: { name: { ar: 'د. عبدالله الغامدي', en: 'Dr. Abdullah Al-Ghamdi' } },
  khalid: { name: { ar: 'أ. خالد السليمان', en: 'Mr. Khalid Al-Sulaiman' } },
  adel: { name: { ar: 'أ. عادل الرشيدي', en: 'Mr. Adel Al-Rashidi' } },
  nouraDosari: { name: { ar: 'أ. نورة الدوسري', en: 'Ms. Noura Al-Dosari' } },
} as const;

/** "Dr. Tariq Al-Mansour (delegated to: Mr. Salman Al-Otaibi)" — finance stage of YQ-8841. */
export const FINANCE_STAGE_DELEGATED = join(PEOPLE.tariq.name, { ar: ' (بالتفويض: ', en: ' (delegated to: ' }, PEOPLE.salman.name, ')');

export { CURRENT_USER };

// ----------------------------------------------------------------------------
// 4. Departments (the 5 monitored departments) and integrity index
// ----------------------------------------------------------------------------
export const DEPARTMENTS = {
  legal: { ar: 'الإدارة القانونية', en: 'Legal Department' },
  finance: { ar: 'الشؤون المالية', en: 'Financial Affairs' },
  executive: { ar: 'الإدارة العليا', en: 'Executive Management' },
  procurement: { ar: 'المشتريات', en: 'Procurement' },
  it: { ar: 'إدارة تقنية المعلومات', en: 'Information Technology Department' },
} satisfies Record<string, LocalizedText>;

export type DepartmentId = keyof typeof DEPARTMENTS;

/** Integrity score per department over the last 90 days (highest first). */
export const DEPARTMENT_INTEGRITY: { department: DepartmentId; score: number }[] = [
  { department: 'legal', score: 97 },
  { department: 'finance', score: 91 },
  { department: 'executive', score: 89 },
  { department: 'procurement', score: 78 },
  { department: 'it', score: 61 },
];

// ----------------------------------------------------------------------------
// 5. Items awaiting the current user's decision (overview list, sidebar and bell counts)
// ----------------------------------------------------------------------------
export type PendingDecisionKind = 'urgent_approval' | 'exception_request' | 'suspension';

export interface PendingDecision {
  code: string;
  kind: PendingDecisionKind;
  /** Person shown next to the code (for YQ-8841: the delegated finance stage) */
  person: string;
  /** When the item reached the current user */
  receivedAt: string;
}

const localizedPendingDecisions: Localizable<PendingDecision>[] = [
  // Routed yesterday 02:35 PM, right after the delegated 12-second signature
  { code: 'YQ-8841', kind: 'urgent_approval', person: FINANCE_STAGE_DELEGATED, receivedAt: '2026-11-07T14:35:12' },
  { code: 'PO-3310', kind: 'exception_request', person: PEOPLE.khalid.name, receivedAt: '2026-11-08T08:05:00' },
  { code: 'DOC-2026-01', kind: 'suspension', person: PEOPLE.ahmed.name, receivedAt: '2026-11-08T05:42:19' },
];

export const getPendingDecisions = (lang: Lang): PendingDecision[] =>
  localize<PendingDecision[]>(localizedPendingDecisions, lang);

/** Whole hours the oldest of the given pending items has been waiting at the demo "now" (null when none). */
export const oldestPendingHours = (items: { receivedAt: string }[]): number | null => {
  if (items.length === 0) return null;
  const now = new Date(DEMO_NOW.isoDateTime).getTime();
  const oldest = Math.min(...items.map((d) => new Date(d.receivedAt).getTime()));
  return Math.floor((now - oldest) / 3_600_000);
};

// ----------------------------------------------------------------------------
// 6. Latest alerts (overview)
// ----------------------------------------------------------------------------
export interface LatestAlert {
  id: string;
  tone: 'red' | 'amber' | 'green';
  title: string;
  detail: string;
  timeLabel: string;
  code: string;
}

const localizedLatestAlerts: Localizable<LatestAlert>[] = [
  {
    id: 'a-1',
    tone: 'red',
    title: { ar: 'توقيع منفرد', en: 'Single signature' },
    detail: join('DOC-2026-01 · ', DEPARTMENTS.it),
    timeLabel: { ar: '05:42 ص', en: '05:42 AM' },
    code: 'DOC-2026-01',
  },
  {
    id: 'a-2',
    tone: 'amber',
    title: { ar: 'اطلاع خارج وقت الدوام', en: 'After-hours access' },
    detail: join(PEOPLE.ahmed.name, { ar: ' · كراسة التوسع التقني', en: ' · Technical Expansion Booklet' }),
    timeLabel: { ar: '05:40 ص', en: '05:40 AM' },
    code: 'DOC-2026-01',
  },
  {
    id: 'a-3',
    tone: 'amber',
    title: { ar: 'اعتماد مستعجل', en: 'Urgent approval' },
    detail: { ar: 'YQ-8841 · 38 صفحة خلال 12 ثانية', en: 'YQ-8841 · 38 pages in 12 seconds' },
    timeLabel: { ar: 'أمس', en: 'Yesterday' },
    code: 'YQ-8841',
  },
  {
    id: 'a-4',
    tone: 'green',
    title: { ar: 'اكتملت سلسلة الاعتماد', en: 'Approval chain completed' },
    detail: { ar: 'BG-2026 · ميزانية التشغيل السنوية', en: 'BG-2026 · Annual Operating Budget' },
    timeLabel: { ar: 'أمس', en: 'Yesterday' },
    code: 'BG-2026',
  },
];

export const getLatestAlerts = (lang: Lang): LatestAlert[] => localize<LatestAlert[]>(localizedLatestAlerts, lang);

// ----------------------------------------------------------------------------
// 7. Headline counts — every page reads its numbers from here
// ----------------------------------------------------------------------------
export const DEMO_STATS = {
  totalDocuments: 60,
  approved: 49,
  underReview: 8, // includes documents pending final approval
  suspended: 3, // precautionary suspensions
  departments: 5,
  awaitingDecision: localizedPendingDecisions.length, // 3
  suspendedAwaitingDecision: localizedPendingDecisions.filter((d) => d.kind === 'suspension').length, // 1 (DOC-2026-01)
  activeAlerts: 2, // unresolved alerts: DOC-2026-01 single signature + YQ-8841 urgent approval
  approvedThisMonth: 27,
  integrityIndex: 86,
  integrityDelta: 4,
};

// ----------------------------------------------------------------------------
// 8. Documents registry — the 6 detailed rows shown out of the 60 documents
// ----------------------------------------------------------------------------
export type RegisterStatus = 'suspended' | 'under_review' | 'pending_approval' | 'approved';
export type Severity = 'high' | 'medium' | 'low';
/** Visual state of each approval stage: done (green), bypassed (red), requested/current (amber), pending (grey). */
export type StageState = 'done' | 'bypassed' | 'requested' | 'current' | 'pending';

export interface RegisterDocument {
  /** Code without the leading '#', e.g. "YQ-8841" */
  code: string;
  title: string;
  shortTitle: string;
  department: DepartmentId;
  status: RegisterStatus;
  currentStage: number;
  totalStages: number;
  /** Creation date (ISO, yyyy-mm-dd) — used by the date filter */
  createdIso: string;
  severity: Severity;
  /** Explicit per-stage states when the path is irregular (otherwise derived from currentStage) */
  stages?: StageState[];
  /** Id of the detailed dossier (only some documents have one) */
  dossierId?: string;
  /** Whether a detail page exists for "Preview" (the case page, the approvals page or a document page) */
  hasDetailPage: boolean;
}

const localizedRegister: Localizable<RegisterDocument>[] = [
  {
    code: 'DOC-2026-01',
    title: { ar: 'كراسة الشروط والمواصفات لمشروع التوسع التقني', en: 'Terms & Specifications Booklet for the Technical Expansion Project' },
    shortTitle: { ar: 'كراسة الشروط لمشروع التوسع التقني', en: 'Technical Expansion Project Booklet' },
    department: 'it',
    status: 'suspended',
    currentStage: 2,
    totalStages: 4,
    createdIso: '2026-11-08',
    severity: 'high',
    stages: ['done', 'bypassed', 'bypassed', 'requested'],
    dossierId: 'doc-1',
    hasDetailPage: true,
  },
  {
    code: 'YQ-8841',
    title: { ar: 'عقد توريد أجهزة ومعدات شبكات', en: 'Network Equipment Supply Contract' },
    shortTitle: { ar: 'عقد توريد أجهزة شبكات', en: 'Network Equipment Contract' },
    department: 'finance',
    status: 'under_review',
    currentStage: 3,
    totalStages: 4,
    createdIso: '2026-11-02',
    severity: 'medium',
    dossierId: 'doc-2',
    hasDetailPage: true,
  },
  {
    code: 'PO-3310',
    title: { ar: 'أمر شراء خوادم احتياطية', en: 'Purchase Order for Backup Servers' },
    shortTitle: { ar: 'أمر شراء خوادم احتياطية', en: 'Backup Servers PO' },
    department: 'it',
    status: 'under_review',
    currentStage: 2,
    totalStages: 3,
    createdIso: '2026-11-06',
    severity: 'medium',
    hasDetailPage: true, // its exception request is on the approvals page
  },
  {
    code: 'CT-2207',
    title: { ar: 'عقد صيانة المباني الإدارية', en: 'Administrative Buildings Maintenance Contract' },
    shortTitle: { ar: 'عقد صيانة المباني الإدارية', en: 'Buildings Maintenance Contract' },
    department: 'procurement',
    status: 'pending_approval',
    currentStage: 4,
    totalStages: 4,
    createdIso: '2026-10-20',
    severity: 'low',
    hasDetailPage: false, // waits for the final approver; no detail page in the demo
  },
  {
    code: 'BG-2026',
    title: { ar: 'ميزانية التشغيل السنوية والخطة المالية', en: 'Annual Operating Budget & Financial Plan' },
    shortTitle: { ar: 'ميزانية التشغيل السنوية', en: 'Annual Operating Budget' },
    department: 'finance',
    status: 'approved',
    currentStage: 4,
    totalStages: 4,
    createdIso: '2026-11-02',
    severity: 'low',
    dossierId: 'doc-3',
    hasDetailPage: true,
  },
  {
    code: 'CL-0915',
    title: { ar: 'كراسة خدمات الحوسبة السحابية', en: 'Cloud Computing Services Booklet' },
    shortTitle: { ar: 'كراسة الحوسبة السحابية', en: 'Cloud Services Booklet' },
    department: 'it',
    status: 'approved',
    currentStage: 4,
    totalStages: 4,
    createdIso: '2026-09-08',
    severity: 'low',
    dossierId: 'doc-4',
    hasDetailPage: true,
  },
];

export const getRegisterDocuments = (lang: Lang): RegisterDocument[] =>
  localize<RegisterDocument[]>(localizedRegister, lang);

/** Compliance rate (% of documents approved without violation) per month, oldest first. Ends at the current 82%. */
export const COMPLIANCE_TREND: { month: LocalizedText; value: number }[] = [
  { month: { ar: 'يونيو', en: 'Jun' }, value: 74 },
  { month: { ar: 'يوليو', en: 'Jul' }, value: 76 },
  { month: { ar: 'أغسطس', en: 'Aug' }, value: 75 },
  { month: { ar: 'سبتمبر', en: 'Sep' }, value: 78 },
  { month: { ar: 'أكتوبر', en: 'Oct' }, value: 80 },
  { month: { ar: 'نوفمبر', en: 'Nov' }, value: Math.round((49 / 60) * 100) },
];

// ----------------------------------------------------------------------------
// 9. Notifications (bell menu) — 3 need a decision, 2 are for information
// ----------------------------------------------------------------------------
export type NotificationKind = 'urgent_approval' | 'exception_request' | 'suspension' | 'after_hours' | 'chain_completed';

export interface DemoNotification {
  id: string;
  group: 'decision' | 'info';
  kind: NotificationKind;
  label: string;
  code: string;
  body: string;
}

const localizedNotifications: Localizable<DemoNotification>[] = [
  {
    id: 'n-1',
    group: 'decision',
    kind: 'urgent_approval',
    label: { ar: 'اعتماد مستعجل', en: 'Urgent approval' },
    code: 'YQ-8841',
    body: { ar: 'توقيع 38 صفحة خلال 12 ثانية · بانتظار موافقتك', en: '38 pages signed in 12 seconds · Awaiting your approval' },
  },
  {
    id: 'n-2',
    group: 'decision',
    kind: 'exception_request',
    label: { ar: 'طلب استثناء مبرّر', en: 'Justified exception request' },
    code: 'PO-3310',
    body: { ar: 'تجاوز مرحلة المراجعة المالية لظرف طارئ', en: 'Skip the financial review stage due to an emergency' },
  },
  {
    id: 'n-3',
    group: 'decision',
    kind: 'suspension',
    label: { ar: 'تعليق احترازي', en: 'Precautionary suspension' },
    code: 'DOC-2026-01',
    body: { ar: 'توقيع منفرد · بانتظار قرارك بشأن التصعيد', en: 'Single signature · Awaiting your escalation decision' },
  },
  {
    id: 'n-4',
    group: 'info',
    kind: 'after_hours',
    label: { ar: 'اطلاع خارج وقت الدوام', en: 'After-hours access' },
    code: 'DOC-2026-01',
    body: join(PEOPLE.ahmed.name, { ar: ' · 05:40 ص', en: ' · 05:40 AM' }),
  },
  {
    id: 'n-5',
    group: 'info',
    kind: 'chain_completed',
    label: { ar: 'اكتملت سلسلة الاعتماد', en: 'Approval chain completed' },
    code: 'BG-2026',
    body: { ar: 'ميزانية التشغيل السنوية والخطة المالية', en: 'Annual Operating Budget & Financial Plan' },
  },
];

export const getNotifications = (lang: Lang): DemoNotification[] =>
  localize<DemoNotification[]>(localizedNotifications, lang);

// ----------------------------------------------------------------------------
// 10. DOC-2026-01 case timeline (shown on the case page)
// ----------------------------------------------------------------------------
export interface CaseTimelineEvent {
  id: string;
  kind: 'created' | 'after_hours' | 'signed' | 'publish_attempt' | 'suspended';
  time: string;
  title: string;
  detail: string;
}

const localizedCaseTimeline: Localizable<CaseTimelineEvent>[] = [
  {
    id: 't-1',
    kind: 'created',
    time: { ar: '05:31 ص', en: '05:31 AM' },
    title: { ar: 'إنشاء المستند', en: 'Document created' },
    detail: join(PEOPLE.ahmed.name, ' · ', DEPARTMENTS.it),
  },
  {
    id: 't-2',
    kind: 'after_hours',
    time: { ar: '05:40 ص', en: '05:40 AM' },
    title: { ar: 'اطلاع خارج وقت الدوام', en: 'After-hours access' },
    detail: { ar: 'تنبيه سلوكي: أول اطلاع قبل بداية الدوام الرسمي', en: 'Behavioral alert: first access before official working hours' },
  },
  {
    id: 't-3',
    kind: 'signed',
    time: { ar: '05:42 ص', en: '05:42 AM' },
    title: { ar: 'توقيع المُعد', en: 'Preparer signature' },
    detail: { ar: 'بصمة النسخة: 7f3a…c91e', en: 'Version fingerprint: 7f3a…c91e' },
  },
  {
    id: 't-4',
    kind: 'publish_attempt',
    time: { ar: '05:42 ص', en: '05:42 AM' },
    title: { ar: 'محاولة نشر بتوقيع منفرد', en: 'Single-signature publishing attempt' },
    detail: { ar: 'تجاوز المراجعتين القانونية والمالية', en: 'Legal and financial reviews bypassed' },
  },
  {
    id: 't-5',
    kind: 'suspended',
    time: { ar: '05:42 ص', en: '05:42 AM' },
    title: { ar: 'تعليق احترازي تلقائي', en: 'Automatic precautionary suspension' },
    detail: {
      ar: 'عُلّق المستند وحساب المُعد احترازيًا إلى حين صدور قرار بشري',
      en: 'The document and the preparer’s account are suspended pending a human decision',
    },
  },
];

export const getCaseTimeline = (lang: Lang): CaseTimelineEvent[] =>
  localize<CaseTimelineEvent[]>(localizedCaseTimeline, lang);

/** Case file of DOC-2026-01 (the only suspension awaiting the current user's decision). */
export const CASE_FILE = {
  code: 'DOC-2026-01',
  dossierId: 'doc-1',
  dateLabel: { ar: '8 نوفمبر 2026', en: '8 November 2026' },
};

// ----------------------------------------------------------------------------
// 11. DOC-2026-01 detected violations (each with its legal basis)
// ----------------------------------------------------------------------------
export const CASE_VIOLATIONS: { text: LocalizedText; reference: LegalReferenceId }[] = [
  {
    text: {
      ar: 'توقيع منفرد وتجاوز مرحلتين رقابيتين إلزاميتين (القانونية والمالية)',
      en: 'Single signature bypassing two mandatory oversight stages (legal and financial)',
    },
    reference: 'governanceArt43',
  },
  {
    text: { ar: 'محاولة نشر الكراسة دون الاعتماد النهائي', en: 'Attempt to publish the booklet without the final approval' },
    reference: 'internalGovernancePolicy',
  },
  {
    text: { ar: 'اطلاع على مستند حساس خارج وقت الدوام', en: 'Access to a sensitive document outside working hours' },
    reference: 'infoSecPolicy',
  },
];

// ----------------------------------------------------------------------------
// 12. Temporary delegations (Tariq on leave → Salman) and the permissions that can be delegated
// ----------------------------------------------------------------------------
export interface DelegablePermission {
  id: string;
  /** Full scope, e.g. "Budget and disbursement approval up to SAR 500,000" */
  scope: LocalizedText;
  /** Short label used on the delegate's access-level pill, e.g. "Budget approval" */
  short: LocalizedText;
  /** Monetary cap of the delegated authority, in SAR (when it has one) */
  limitSar?: number;
}

export const DELEGABLE_PERMISSIONS: DelegablePermission[] = [
  {
    id: 'budget_500k',
    scope: { ar: 'اعتماد الميزانيات والصرف حتى 500 ألف ريال', en: 'Budget and disbursement approval up to SAR 500,000' },
    short: { ar: 'اعتماد الميزانيات', en: 'Budget approval' },
    limitSar: 500_000,
  },
  {
    id: 'legal_review',
    scope: { ar: 'المطابقة النظامية وفحص العقود', en: 'Regulatory compliance and contract review' },
    short: { ar: 'مطابقة نظامية', en: 'Regulatory compliance' },
  },
  {
    id: 'final_approval',
    scope: { ar: 'الاعتماد النهائي وإذن النشر', en: 'Final approval and publishing authorization' },
    short: { ar: 'اعتماد نهائي', en: 'Final approval' },
  },
  {
    id: 'technical_endorsement',
    scope: { ar: 'تأييد الاحتياج التقني', en: 'Endorsement of technical needs' },
    short: { ar: 'تأييد تقني', en: 'Technical endorsement' },
  },
];

export interface Delegation {
  id: string;
  fromUserId: string;
  toUserId: string;
  permissionId: string;
  startIso: string;
  endIso: string;
  /** Why the delegator delegated (shown under their name) */
  reason?: LocalizedText;
}

/** Delegations at the start of the demo. */
export const INITIAL_DELEGATIONS: Delegation[] = [
  {
    id: 'del-1',
    fromUserId: 'u-3', // Dr. Tariq Al-Mansour
    toUserId: 'u-8', // Mr. Salman Al-Otaibi
    permissionId: 'budget_500k',
    startIso: '2026-11-07',
    endIso: '2026-11-15',
    reason: { ar: 'في إجازة', en: 'On leave' },
  },
];

const MONTHS: Record<Lang, string[]> = {
  ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

const parseIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
};

/** "15 نوفمبر" / "15 November" */
export const formatDayMonth = (iso: string, lang: Lang): string => {
  const { m, d } = parseIso(iso);
  return `${d} ${MONTHS[lang][m - 1]}`;
};

/** "7 – 15 نوفمبر 2026", or full dates when the months differ. */
export const formatDateRange = (startIso: string, endIso: string, lang: Lang): string => {
  const a = parseIso(startIso);
  const b = parseIso(endIso);
  if (a.y === b.y && a.m === b.m) return `${a.d} – ${b.d} ${MONTHS[lang][b.m - 1]} ${b.y}`;
  return `${formatDayMonth(startIso, lang)} ${a.y} – ${formatDayMonth(endIso, lang)} ${b.y}`;
};

/** Whole days between two ISO dates (b − a). */
export const daysBetween = (aIso: string, bIso: string): number =>
  Math.round((new Date(bIso).getTime() - new Date(aIso).getTime()) / 86_400_000);

/** Active today (demo "now"), scheduled for later, or already ended. */
export const delegationPhase = (d: Delegation): 'active' | 'scheduled' | 'ended' =>
  d.startIso > DEMO_NOW.isoDate ? 'scheduled' : d.endIso < DEMO_NOW.isoDate ? 'ended' : 'active';

// ----------------------------------------------------------------------------
// 13. Accounts & permissions (10 users)
// ----------------------------------------------------------------------------
export interface UserAccount {
  id: string;
  name: string;
  role: string;
  department: string;
  accessLevel: 'full_audit' | 'executive_signature' | 'financial_approval' | 'legal_compliance' | 'internal_audit' | 'technical_spec';
  accessLevelLabel: string;
  twoFactor: boolean;
  status: 'active' | 'restricted' | 'pending';
}

const localizedUsers: Localizable<UserAccount>[] = [
  {
    id: 'u-1',
    name: PEOPLE.fahad.name,
    role: CURRENT_USER.role,
    department: CURRENT_USER.department,
    accessLevel: 'full_audit',
    accessLevelLabel: { ar: 'رقابة كاملة وتعليق احترازي للوثائق', en: 'Full oversight & precautionary document suspension' },
    twoFactor: true,
    status: 'active',
  },
  {
    id: 'u-2',
    name: PEOPLE.ahmed.name,
    role: { ar: 'مدير إدارة تقنية المعلومات', en: 'Director of Information Technology' },
    department: DEPARTMENTS.it,
    accessLevel: 'technical_spec',
    accessLevelLabel: { ar: 'إعداد كراسات ومشاريع', en: 'Booklet & project preparation' },
    twoFactor: true,
    status: 'restricted',
  },
  {
    id: 'u-3',
    name: PEOPLE.tariq.name,
    role: { ar: 'رئيس قسم المالية والميزانية', en: 'Head of Finance & Budget' },
    department: DEPARTMENTS.finance,
    accessLevel: 'financial_approval',
    accessLevelLabel: { ar: 'اعتماد الميزانيات والصرف', en: 'Budget & disbursement approval' },
    twoFactor: true,
    status: 'active',
  },
  {
    id: 'u-4',
    name: PEOPLE.noura.name,
    role: { ar: 'المستشار القانوني العام', en: 'General Legal Counsel' },
    department: DEPARTMENTS.legal,
    accessLevel: 'legal_compliance',
    accessLevelLabel: { ar: 'مطابقة نظامية وفحص عقود', en: 'Regulatory compliance & contract review' },
    twoFactor: true,
    status: 'active',
  },
  {
    id: 'u-5',
    name: PEOPLE.abdullah.name,
    role: { ar: 'نائب الرئيس التنفيذي للتشغيل', en: 'Deputy CEO for Operations' },
    department: DEPARTMENTS.executive,
    accessLevel: 'executive_signature',
    accessLevelLabel: { ar: 'اعتماد نهائي وإذن نشر', en: 'Final approval & publishing authorization' },
    twoFactor: true,
    status: 'active',
  },
  {
    id: 'u-6',
    name: PEOPLE.khalid.name,
    role: { ar: 'مدير عام تقنية المعلومات', en: 'General Manager of Information Technology' },
    department: DEPARTMENTS.it,
    accessLevel: 'executive_signature',
    accessLevelLabel: { ar: 'إشراف وتأييد الاحتياج التقني', en: 'Oversight & endorsement of technical needs' },
    twoFactor: true,
    status: 'active',
  },
  {
    id: 'u-7',
    name: PEOPLE.reem.name,
    role: { ar: 'أخصائية العقود والمشتريات', en: 'Contracts & Procurement Specialist' },
    department: DEPARTMENTS.finance,
    accessLevel: 'financial_approval',
    accessLevelLabel: { ar: 'إعداد العقود ومطابقة التوريد', en: 'Contract preparation & supply reconciliation' },
    twoFactor: true,
    status: 'active',
  },
  {
    id: 'u-8',
    name: PEOPLE.salman.name,
    role: { ar: 'نائب رئيس قسم المالية', en: 'Deputy Head of Finance' },
    department: DEPARTMENTS.finance,
    accessLevel: 'financial_approval',
    accessLevelLabel: { ar: 'مراجعة الميزانيات', en: 'Budget review' },
    twoFactor: true,
    status: 'active',
  },
  {
    id: 'u-9',
    name: PEOPLE.adel.name,
    role: { ar: 'مدير إدارة الشؤون الإدارية والأرشفة', en: 'Director of Administrative Affairs & Archiving' },
    department: { ar: 'الشؤون الإدارية', en: 'Administrative Affairs' },
    accessLevel: 'executive_signature',
    accessLevelLabel: { ar: 'إدارة السجلات ولجان الإتلاف', en: 'Records management & disposal committees' },
    twoFactor: true,
    status: 'active',
  },
  {
    id: 'u-10',
    name: PEOPLE.nouraDosari.name,
    role: { ar: 'أخصائي تدقيق داخلي', en: 'Internal Audit Specialist' },
    department: { ar: 'المراجعة والامتثال', en: 'Audit & Compliance' },
    accessLevel: 'internal_audit',
    accessLevelLabel: { ar: 'تدقيق الأثر الرقمي والمطابقة', en: 'Digital footprint audit & compliance' },
    twoFactor: true,
    status: 'active',
  },
];

export const getUsers = (lang: Lang): UserAccount[] => localize<UserAccount[]>(localizedUsers, lang);


// ----------------------------------------------------------------------------
// 13b. Approval requests (YQ-8841 urgent approval, PO-3310 justified exception)
// ----------------------------------------------------------------------------
export type ChecklistState = 'done' | 'waiting' | 'locked' | 'failed';

export interface ReadinessCheck {
  id: string;
  title: string;
  detail: string;
  state: ChecklistState;
}

/** Readiness checks for YQ-8841 before final approval (5 of 9 complete). */
const localizedReadiness: Localizable<ReadinessCheck>[] = [
  {
    id: 'order',
    title: { ar: 'ترتيب التوقيعات مكتمل', en: 'Signature order is complete' },
    detail: { ar: 'المُعد ثم المراجعة القانونية بالتسلسل الصحيح', en: 'Preparer, then legal review, in the correct order' },
    state: 'done',
  },
  {
    id: 'attachments',
    title: { ar: 'المرفقات الإلزامية موجودة', en: 'Mandatory attachments are present' },
    detail: { ar: 'مذكرة المراجعة القانونية وتأكيد توفر الميزانية', en: 'Legal review memo and budget availability confirmation' },
    state: 'done',
  },
  {
    id: 'conflict',
    title: { ar: 'لا يوجد تعارض مصالح', en: 'No conflict of interest' },
    detail: { ar: 'لا علاقة بين الموقّعين والمورد', en: 'No relationship between the signatories and the supplier' },
    state: 'done',
  },
  {
    id: 'watermark',
    title: { ar: 'العلامة المائية مفعّلة', en: 'Watermark is enabled' },
    detail: { ar: 'كل اطلاع موثّق باسم صاحبه ووقته', en: 'Every view is recorded with the viewer’s name and time' },
    state: 'done',
  },
  {
    id: 'reading_time',
    title: { ar: 'مدة الاطلاع غير كافية', en: 'Insufficient reading time' },
    detail: join(PEOPLE.salman.name, { ar: ' (بالتفويض) وقّع 38 صفحة خلال 12 ثانية', en: ' (delegated) signed 38 pages in 12 seconds' }),
    state: 'waiting',
  },
  {
    // Detail text is built on the page from URGENT_APPROVAL.contractValueSar and the delegation's limit
    id: 'delegation_limit',
    title: { ar: 'تجاوز حد التفويض', en: 'Delegation limit exceeded' },
    detail: '',
    state: 'failed',
  },
  {
    id: 'exception',
    title: { ar: 'طلب استثناء مبرّر', en: 'Justified exception request' },
    detail: { ar: 'لا يوجد طلب تجاوز لهذا المستند', en: 'No skip request for this document' },
    state: 'done',
  },
  {
    id: 'manager',
    title: { ar: 'موافقة المراقب العام', en: 'Chief auditor approval' },
    detail: { ar: 'بانتظار قرارك على تنبيه الاعتماد المستعجل', en: 'Awaiting your decision on the urgent-approval alert' },
    state: 'waiting',
  },
  {
    id: 'final_signature',
    title: { ar: 'التوقيع النهائي', en: 'Final signature' },
    detail: { ar: 'يتفعّل بعد اكتمال كل الفحوصات', en: 'Enabled once all checks are complete' },
    state: 'locked',
  },
];

export const getReadinessChecks = (lang: Lang): ReadinessCheck[] => localize<ReadinessCheck[]>(localizedReadiness, lang);

export const URGENT_APPROVAL = {
  code: 'YQ-8841',
  dossierId: 'doc-2',
  /** Contract value — same figure as the dossier budget (SAR 1,240,000) */
  contractValueSar: 1_240_000,
  /** The delegation under which the finance stage was signed */
  delegationId: 'del-1',
  pages: 38,
  readingSeconds: 12,
  /** About 30 seconds per page */
  expectedMinutes: 19,
  /** Watermark shown on the preview: viewer, time and device address */
  watermark: { viewer: PEOPLE.fahad.name, at: '2026-11-08 10:42', ip: '10.4.2.18' },
};

export const EXCEPTION_REQUEST = {
  code: 'PO-3310',
  title: { ar: 'أمر شراء خوادم احتياطية', en: 'Purchase Order for Backup Servers' },
  stageToSkip: { ar: 'المراجعة المالية', en: 'Financial review' },
  requester: PEOPLE.khalid.name,
  reason: {
    ar: 'عطل في الخادم الرئيسي يهدد استمرارية الخدمة، وتُستكمل المراجعة المالية لاحقًا خلال 48 ساعة.',
    en: 'A failure in the main server threatens service continuity; the financial review will be completed within 48 hours.',
  },
};

// ----------------------------------------------------------------------------
// 13c. Decisions taken in this session (in memory) and what they change
// ----------------------------------------------------------------------------
export type CaseOutcome = 'lifted' | 'escalated';
export type RequestOutcome = 'approved' | 'rejected';

export interface DemoDecisions {
  /** DOC-2026-01 */
  case?: CaseOutcome;
  /** YQ-8841 urgent approval */
  urgent?: RequestOutcome;
  /** PO-3310 justified exception */
  exception?: RequestOutcome;
}

/** Codes whose pending decision has been taken. */
export const resolvedCodes = (d: DemoDecisions): string[] => [
  ...(d.case ? [CASE_FILE.code] : []),
  ...(d.urgent ? [URGENT_APPROVAL.code] : []),
  ...(d.exception ? [EXCEPTION_REQUEST.code] : []),
];

/** Headline counts after the session's decisions. */
export const deriveStats = (d: DemoDecisions) => {
  const resolved = resolvedCodes(d);
  const lifted = d.case === 'lifted';
  return {
    ...DEMO_STATS,
    // A lifted suspension returns the document to review
    suspended: DEMO_STATS.suspended - (lifted ? 1 : 0),
    underReview: DEMO_STATS.underReview + (lifted ? 1 : 0),
    awaitingDecision: localizedPendingDecisions.filter((p) => !resolved.includes(p.code as string)).length,
    suspendedAwaitingDecision: d.case ? 0 : DEMO_STATS.suspendedAwaitingDecision,
    // The two active alerts are DOC-2026-01 (single signature) and YQ-8841 (urgent approval)
    activeAlerts: [CASE_FILE.code, URGENT_APPROVAL.code].filter((code) => !resolved.includes(code)).length,
  };
};

/** Registry rows after the session's decisions. */
export const applyDecisionsToRegister = (rows: RegisterDocument[], d: DemoDecisions): RegisterDocument[] =>
  rows.map((row) => {
    if (row.code === CASE_FILE.code && d.case === 'lifted') {
      // Back to the legal review stage
      return { ...row, status: 'under_review', currentStage: 2, stages: undefined };
    }
    if (row.code === URGENT_APPROVAL.code && d.urgent === 'rejected') {
      // Returned to the preparer. An approval keeps it at the financial stage: the delegation overrun still blocks it
      return { ...row, status: 'under_review', currentStage: 1 };
    }
    if (row.code === EXCEPTION_REQUEST.code && d.exception === 'approved') {
      // Financial review skipped as a recorded exception; moves to final approval
      return { ...row, status: 'pending_approval', currentStage: 3, stages: ['done', 'bypassed', 'current'] };
    }
    return row;
  });

// ----------------------------------------------------------------------------
// 14. Detailed document dossiers (DOC-2026-01, YQ-8841, BG-2026, CL-0915)
// ----------------------------------------------------------------------------
const ahmedRole = { ar: 'مدير إدارة تقنية المعلومات (المُعد)', en: 'Director of Information Technology (Preparer)' };
const tariqRole = { ar: 'رئيس قسم المالية والميزانية', en: 'Head of Finance & Budget' };
const nouraRole = { ar: 'المستشار القانوني العام', en: 'General Legal Counsel' };
const abdullahRole = { ar: 'نائب الرئيس التنفيذي للتشغيل', en: 'Deputy CEO for Operations' };
const reemRole = { ar: 'أخصائية العقود والمشتريات (المُعد)', en: 'Contracts & Procurement Specialist (Preparer)' };
const salmanRole = { ar: 'نائب رئيس قسم المالية', en: 'Deputy Head of Finance' };
const KHALID_ROLE = { ar: 'مدير عام تقنية المعلومات', en: 'General Manager of Information Technology' };

const stageTitles = {
  preparer: { ar: 'المُعد', en: 'Preparer' },
  legal: { ar: 'المراجعة القانونية', en: 'Legal review' },
  finance: { ar: 'المراجعة المالية', en: 'Financial review' },
  publish: { ar: 'الاعتماد والنشر', en: 'Approval & publishing' },
  final: { ar: 'الاعتماد النهائي', en: 'Final approval' },
};

const ref = LEGAL_REFERENCES;

const localizedDocuments: Localizable<DocumentDossier>[] = [
  // 1. DOC-2026-01 — precautionary suspension (single signature)
  {
    id: 'doc-1',
    code: '#DOC-2026-01',
    title: { ar: 'كراسة الشروط والمواصفات لمشروع التوسع التقني', en: 'Terms & Specifications Booklet for the Technical Expansion Project' },
    category: { ar: 'مناقصات ومشاريع تقنية', en: 'Technical Tenders & Projects' },
    department: DEPARTMENTS.it,
    responsibleDeptHead: join(PEOPLE.ahmed.name, { ar: ' (مدير إدارة تقنية المعلومات)', en: ' (Director of Information Technology)' }),
    budget: { ar: '14,500,000 ر.س', en: 'SAR 14,500,000' },
    creationDate: '2026-11-08 05:31:00',
    lastModified: '2026-11-08 05:42:19',
    status: 'blocked',
    riskLevel: 'blocked',
    riskScore: 94,
    tags: [
      { ar: 'توقيع منفرد', en: 'Single signature' },
      { ar: 'تسريع غير منطقي', en: 'Irregular acceleration' },
      { ar: 'تعليق احترازي بانتظار قرار بشري', en: 'Precautionary suspension pending a human decision' },
    ],

    governance: {
      passCount: 2,
      viewersCount: 1,
      signaturesCount: 1,
      requiredSignaturesCount: 4,
      hasSeniorExecutiveSignature: false,
      isSequenceCompliant: false,
      speedAnomaly: true,

      platformApprovalStatus: 'precautionary_suspension',
      approvalDecisionText: {
        ar: 'عُلّق المستند احترازيًا بعد رصد توقيع منفرد وتخطي مسار الحوكمة، بانتظار قرار المراقب العام. التعليق قابل للرفع، ولا يتم التصعيد إلا بعد اعتماد بشري.',
        en: 'The document was precautionarily suspended after a single signature and a bypassed governance path were detected, pending the chief auditor’s decision. The suspension can be lifted, and escalation happens only after human approval.',
      },
      assignedAuthority: join(PEOPLE.fahad.name, { ar: ' (المراقب العام التنفيذي)', en: ' (Executive Chief Auditor)' }),
      actionDetails: [
        join(
          { ar: 'رصد توقيع منفرد: طلب اعتماد ونشر فوري بواسطة شخص واحد (', en: 'Single signature detected: immediate approval and publishing requested by one person (' },
          PEOPLE.ahmed.name,
          { ar: ') دون استكمال التواقيع الإلزامية.', en: ') without completing the mandatory signatures.' }
        ),
        {
          ar: 'غياب التواقيع الإلزامية للمراجعة القانونية والمراجعة المالية والاعتماد النهائي.',
          en: 'The mandatory legal review, financial review and final approval signatures are missing.',
        },
        {
          ar: 'تعليق المستند وصلاحيات النشر لحساب المُعد احترازيًا إلى حين صدور قرار بشري.',
          en: 'The document and the preparer’s publishing permissions are precautionarily suspended pending a human decision.',
        },
        {
          ar: 'يملك المراقب العام رفع التعليق أو طلب إفادة أو اعتماد التصعيد إلى هيئة الرقابة ومكافحة الفساد.',
          en: 'The chief auditor may lift the suspension, request a statement, or approve escalation to the Oversight & Anti-Corruption Authority.',
        },
      ],
    },

    viewers: [
      {
        id: 'v-1',
        name: PEOPLE.ahmed.name,
        role: ahmedRole,
        department: DEPARTMENTS.it,
        viewedAt: { ar: '2026-11-08 05:40 ص', en: '2026-11-08 05:40 AM' },
        timeSpent: { ar: 'دقيقتان و19 ثانية (تسريع مريب)', en: '2 minutes 19 seconds (suspicious acceleration)' },
        ip: { ar: '192.168.10.45 (عبر VPN)', en: '192.168.10.45 (via VPN)' },
      },
    ],

    // Mandatory chain: preparer → legal → finance → approval & publishing
    signatureSteps: [
      {
        step: 1,
        roleTitle: stageTitles.preparer,
        officerName: PEOPLE.ahmed.name,
        department: DEPARTMENTS.it,
        isSeniorExecutive: false,
        status: 'signed',
        signedAt: '2026-11-08 05:42:10',
        orderCompliant: true,
        notes: { ar: 'توقيع منفرد تبعته محاولة نشر مباشرة', en: 'Single signature followed by a direct publishing attempt' },
      },
      {
        step: 2,
        roleTitle: stageTitles.legal,
        officerName: PEOPLE.noura.name,
        department: DEPARTMENTS.legal,
        isSeniorExecutive: true,
        status: 'bypassed',
        orderCompliant: false,
        notes: { ar: 'تم تجاوز المراجعة القانونية', en: 'Legal review bypassed' },
      },
      {
        step: 3,
        roleTitle: stageTitles.finance,
        officerName: PEOPLE.tariq.name,
        department: DEPARTMENTS.finance,
        isSeniorExecutive: true,
        status: 'bypassed',
        orderCompliant: false,
        notes: { ar: 'تم تجاوز المراجعة المالية', en: 'Financial review bypassed' },
      },
      {
        step: 4,
        roleTitle: stageTitles.publish,
        officerName: PEOPLE.abdullah.name,
        department: DEPARTMENTS.executive,
        isSeniorExecutive: true,
        status: 'pending',
        orderCompliant: false,
        notes: { ar: 'طُلب النشر مباشرة دون المرور بالمراجعتين', en: 'Publishing was requested directly without the two reviews' },
      },
    ],

    metrics: {
      views: 3,
      downloads: 1,
      edits: 2,
      exportAttempts: 1,
    },

    auditLogs: [
      {
        id: 'log-1',
        user: PEOPLE.ahmed.name,
        role: ahmedRole,
        action: { ar: 'إنشاء الكراسة ورفع النسخة الأولى', en: 'Created the booklet and uploaded the first version' },
        timestamp: '2026-11-08 05:31:00',
        ip: '192.168.10.45',
        device: { ar: 'محطة العمل 02 عبر VPN', en: 'Workstation 02 via VPN' },
        hashVerified: true,
      },
      {
        id: 'log-2',
        user: PEOPLE.ahmed.name,
        role: ahmedRole,
        action: { ar: 'اطلاع على الكراسة قبل بداية الدوام الرسمي', en: 'Viewed the booklet before official working hours' },
        timestamp: '2026-11-08 05:40:00',
        ip: '192.168.10.45',
        device: { ar: 'محطة العمل 02 عبر VPN', en: 'Workstation 02 via VPN' },
        isFlagged: true,
        flagReason: { ar: 'اطلاع خارج وقت الدوام', en: 'After-hours access' },
        hashVerified: true,
      },
      {
        id: 'log-3',
        user: PEOPLE.ahmed.name,
        role: ahmedRole,
        action: {
          ar: 'توقيع الكراسة وطلب نشرها مباشرة بتوقيع منفرد وتخطي المراجعتين القانونية والمالية',
          en: 'Signed the booklet and requested direct publishing with a single signature, bypassing the legal and financial reviews',
        },
        timestamp: '2026-11-08 05:42:19',
        ip: '192.168.10.45',
        device: { ar: 'محطة العمل 02 عبر VPN', en: 'Workstation 02 via VPN' },
        isFlagged: true,
        flagReason: {
          ar: 'توقيع منفرد وتجاوز مرحلتين رقابيتين إلزاميتين (القانونية والمالية)',
          en: 'Single signature bypassing two mandatory oversight stages (legal and financial)',
        },
        hashVerified: false,
      },
    ],

    signatures: [
      {
        id: 'sig-1',
        name: PEOPLE.ahmed.name,
        title: ahmedRole,
        avatar: 'AK',
        department: DEPARTMENTS.it,
        status: 'approved',
        timestamp: '2026-11-08 05:42',
      },
      {
        id: 'sig-2',
        name: PEOPLE.noura.name,
        title: nouraRole,
        avatar: 'NS',
        department: DEPARTMENTS.legal,
        status: 'blocked',
        timestamp: { ar: 'تم تجاوزها', en: 'Bypassed' },
      },
      {
        id: 'sig-3',
        name: PEOPLE.tariq.name,
        title: tariqRole,
        avatar: 'TM',
        department: DEPARTMENTS.finance,
        status: 'blocked',
        timestamp: { ar: 'تم تجاوزها', en: 'Bypassed' },
      },
      {
        id: 'sig-4',
        name: PEOPLE.abdullah.name,
        title: abdullahRole,
        avatar: 'AG',
        department: DEPARTMENTS.executive,
        status: 'pending',
        timestamp: { ar: 'طُلب النشر مباشرة', en: 'Publishing requested directly' },
      },
    ],

    evidences: [
      {
        id: 'ev-1',
        timestamp: { ar: '05:42:19 ص', en: '05:42:19 AM' },
        user: join(PEOPLE.ahmed.name, { ar: ' (المُعد)', en: ' (Preparer)' }),
        actionTitle: { ar: 'رصد توقيع منفرد وتخطي سلسلة الاعتمادات', en: 'Single signature detected and approval chain bypassed' },
        description: {
          ar: 'اطلع شخص واحد فقط على الكراسة (#DOC-2026-01) وطُلب نشرها بتوقيع منفرد متجاوزًا مستويات المراجعة الإلزامية.',
          en: 'Only one person viewed the booklet (#DOC-2026-01), and its publication was requested with a single signature, bypassing the mandatory review levels.',
        },
        anomalyType: 'bypassed_signatures',
        riskScore: 98,
        ipAddress: '192.168.10.45',
        location: { ar: 'الرياض (شبكة VPN)', en: 'Riyadh (VPN network)' },
        hashBefore: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        hashAfter: '7f3a8c1e5b2d94f06a7e3c81d9b4f2a05e6c7d18b3a9f4e2c0d5b7a1e8f6c91e',
      },
    ],

    aiAnalysis: {
      summary: join(
        {
          ar: 'رصد نظام يقظة تسريعًا غير مبرر ومحاولة نشر كراسة الشروط والمواصفات لمشروع التوسع التقني (#DOC-2026-01) بتوقيع منفرد من المُعد ',
          en: 'Yaqadha detected unjustified acceleration and an attempt to publish the Terms & Specifications Booklet for the Technical Expansion Project (#DOC-2026-01) with a single signature from the preparer, ',
        },
        PEOPLE.ahmed.name,
        { ar: '، متجاوزًا مرحلتي المراجعة القانونية والمالية الإلزاميتين.', en: ', bypassing the mandatory legal and financial reviews.' }
      ),
      detectedConflicts: [
        {
          ar: 'تسريع شاذ وتخطي التواقيع الإلزامية: طلب نشر الكراسة بتوقيع منفرد خلال دقيقتين من أول اطلاع.',
          en: 'Abnormal acceleration and bypassed mandatory signatures: publishing was requested with a single signature within two minutes of first access.',
        },
        { ar: 'غياب الاعتماد المالي والمراجعة القانونية المستقلة.', en: 'No financial approval or independent legal review.' },
        { ar: 'اطلاع على مستند حساس خارج وقت الدوام الرسمي.', en: 'A sensitive document was accessed outside official working hours.' },
      ],
      legalArticles: [
        join(ref.governanceArt43, { ar: ': اشتراط سلامة التدرج الرقابي والتواقيع المتسلسلة.', en: ': requires a sound oversight hierarchy and sequential signatures.' }),
        join(ref.nazahaLaw, '.'),
      ],
      recommendedAction: {
        ar: 'إبقاء التعليق الاحترازي وطلب إفادة من المُعد، ثم اتخاذ قرار بشري برفع التعليق أو اعتماد التصعيد إلى هيئة الرقابة ومكافحة الفساد.',
        en: 'Keep the precautionary suspension and request a statement from the preparer, then make a human decision to lift the suspension or approve escalation to the Oversight & Anti-Corruption Authority.',
      },
    },
    // Risk model v1.1 input. Value matches the dossier budget (SAR 14,500,000)
    riskInput: {
      record_id: 'DOC-2026-01',
      item_category: 'Information Technology',
      tender_value_sar: 14500000,
      items_count: 6,
      bids_count: 2,
      competitors_count: 2,
      prior_awards_count: 3,
      winning_suppliers_count: 1,
      documents_count: 4,
      submission_period_days: 7,
    },
  },

  // 2. YQ-8841 — under review: urgent (delegated) finance signature awaiting the manager
  {
    id: 'doc-2',
    code: '#YQ-8841',
    title: { ar: 'عقد توريد أجهزة ومعدات شبكات', en: 'Network Equipment Supply Contract' },
    category: { ar: 'عقود توريد ومشتريات', en: 'Supply & Procurement Contracts' },
    department: DEPARTMENTS.finance,
    responsibleDeptHead: join(PEOPLE.reem.name, { ar: ' (أخصائية العقود والمشتريات)', en: ' (Contracts & Procurement Specialist)' }),
    budget: { ar: '1,240,000 ر.س', en: 'SAR 1,240,000' },
    creationDate: '2026-11-02 09:10:00',
    lastModified: { ar: 'أمس 02:35 م', en: 'Yesterday 02:35 PM' },
    status: 'under_review',
    riskLevel: 'review',
    riskScore: 58,
    tags: [
      { ar: 'اعتماد مستعجل', en: 'Urgent approval' },
      { ar: '38 صفحة خلال 12 ثانية', en: '38 pages in 12 seconds' },
      { ar: 'توقيع بالتفويض', en: 'Delegated signature' },
      { ar: 'بانتظار موافقة المراقب العام', en: 'Awaiting chief auditor approval' },
    ],

    governance: {
      passCount: 3,
      viewersCount: 3,
      signaturesCount: 2,
      requiredSignaturesCount: 4,
      hasSeniorExecutiveSignature: false,
      isSequenceCompliant: true,
      speedAnomaly: true,

      platformApprovalStatus: 'routed_to_dept_head',
      approvalDecisionText: {
        ar: 'رُصد اعتماد مستعجل في مرحلة المراجعة المالية (38 صفحة خلال 12 ثانية)، وأُحيل الطلب تلقائيًا إلى المراقب العام للموافقة قبل متابعة المسار.',
        en: 'An urgent approval was detected at the financial review stage (38 pages in 12 seconds), and the request was automatically routed to the chief auditor for approval before the path continues.',
      },
      assignedAuthority: join(PEOPLE.fahad.name, { ar: ' (المراقب العام)', en: ' (Chief auditor)' }),
      actionDetails: [
        join(
          { ar: 'اكتملت مرحلتا الإعداد (', en: 'The preparation (' },
          PEOPLE.reem.name,
          { ar: ') والمراجعة القانونية (', en: ') and legal review (' },
          PEOPLE.noura.name,
          { ar: ') بالتسلسل الصحيح.', en: ') stages were completed in the correct order.' }
        ),
        join(
          { ar: 'وُقّعت المراجعة المالية بالتفويض من ', en: 'The financial review was signed under delegation by ' },
          PEOPLE.salman.name,
          { ar: ' على 38 صفحة خلال 12 ثانية، بينما يتطلب الاطلاع المتوقع نحو 19 دقيقة.', en: ' on 38 pages within 12 seconds, while the expected reading time is about 19 minutes.' }
        ),
        {
          ar: 'لا يتابع المستند مساره إلى الاعتماد النهائي إلا بعد موافقة المراقب العام.',
          en: 'The document does not proceed to final approval until the chief auditor approves.',
        },
      ],
    },

    viewers: [
      {
        id: 'v-201',
        name: PEOPLE.reem.name,
        role: reemRole,
        department: DEPARTMENTS.finance,
        viewedAt: { ar: '2026-11-03 10:05 ص', en: '2026-11-03 10:05 AM' },
        timeSpent: { ar: '42 دقيقة', en: '42 minutes' },
        ip: { ar: '10.20.1.15 (الشبكة الداخلية)', en: '10.20.1.15 (internal network)' },
      },
      {
        id: 'v-202',
        name: PEOPLE.noura.name,
        role: nouraRole,
        department: DEPARTMENTS.legal,
        viewedAt: { ar: '2026-11-05 12:20 م', en: '2026-11-05 12:20 PM' },
        timeSpent: { ar: '35 دقيقة', en: '35 minutes' },
        ip: { ar: '10.10.5.20 (الشبكة الداخلية)', en: '10.10.5.20 (internal network)' },
      },
      {
        id: 'v-203',
        name: PEOPLE.salman.name,
        role: join(salmanRole, { ar: ' (بالتفويض)', en: ' (delegated)' }),
        department: DEPARTMENTS.finance,
        viewedAt: { ar: '2026-11-07 02:35 م', en: '2026-11-07 02:35 PM' },
        timeSpent: { ar: '12 ثانية (38 صفحة)', en: '12 seconds (38 pages)' },
        ip: { ar: '10.20.1.22 (الشبكة الداخلية)', en: '10.20.1.22 (internal network)' },
      },
    ],

    signatureSteps: [
      {
        step: 1,
        roleTitle: stageTitles.preparer,
        officerName: PEOPLE.reem.name,
        department: DEPARTMENTS.finance,
        isSeniorExecutive: false,
        status: 'signed',
        signedAt: { ar: '2026-11-03 10:48 ص', en: '2026-11-03 10:48 AM' },
        orderCompliant: true,
        notes: { ar: 'إعداد العقد وإرفاق المستندات', en: 'Contract prepared and documents attached' },
      },
      {
        step: 2,
        roleTitle: stageTitles.legal,
        officerName: PEOPLE.noura.name,
        department: DEPARTMENTS.legal,
        isSeniorExecutive: true,
        status: 'signed',
        signedAt: { ar: '2026-11-05 12:55 م', en: '2026-11-05 12:55 PM' },
        orderCompliant: true,
        notes: { ar: 'مذكرة المراجعة القانونية مرفقة', en: 'Legal review memo attached' },
      },
      {
        step: 3,
        roleTitle: stageTitles.finance,
        officerName: FINANCE_STAGE_DELEGATED,
        department: DEPARTMENTS.finance,
        isSeniorExecutive: true,
        status: 'pending',
        orderCompliant: true,
        notes: {
          ar: 'وُقّعت 38 صفحة خلال 12 ثانية — بانتظار موافقة المراقب العام',
          en: '38 pages signed in 12 seconds — awaiting the chief auditor’s approval',
        },
      },
      {
        step: 4,
        roleTitle: stageTitles.final,
        officerName: PEOPLE.abdullah.name,
        department: DEPARTMENTS.executive,
        isSeniorExecutive: true,
        status: 'pending',
        orderCompliant: true,
        notes: { ar: 'لم تبدأ', en: 'Not started' },
      },
    ],

    metrics: {
      views: 8,
      downloads: 2,
      edits: 2,
      exportAttempts: 0,
    },

    auditLogs: [
      {
        id: 'log-201',
        user: PEOPLE.reem.name,
        role: reemRole,
        action: { ar: 'إنشاء العقد وإرفاق مذكرة توفر الميزانية', en: 'Created the contract and attached the budget availability memo' },
        timestamp: '2026-11-02 09:10:00',
        ip: '10.20.1.15',
        device: { ar: 'محطة العمل المكتبية 12', en: 'Office workstation 12' },
        hashVerified: true,
      },
      {
        id: 'log-202',
        user: PEOPLE.noura.name,
        role: nouraRole,
        action: { ar: 'توقيع المراجعة القانونية وإرفاق المذكرة', en: 'Signed the legal review and attached the memo' },
        timestamp: '2026-11-05 12:55:00',
        ip: '10.10.5.20',
        device: { ar: 'جهاز الإدارة القانونية', en: 'Legal Department computer' },
        hashVerified: true,
      },
      {
        id: 'log-203',
        user: PEOPLE.salman.name,
        role: join(salmanRole, { ar: ' (بالتفويض)', en: ' (delegated)' }),
        action: {
          ar: 'توقيع المراجعة المالية بالتفويض على 38 صفحة خلال 12 ثانية',
          en: 'Signed the financial review under delegation on 38 pages within 12 seconds',
        },
        timestamp: '2026-11-07 14:35:12',
        ip: '10.20.1.22',
        device: { ar: 'محطة العمل المكتبية 04', en: 'Office workstation 04' },
        isFlagged: true,
        flagReason: { ar: 'اعتماد مستعجل: مدة الاطلاع غير كافية', en: 'Urgent approval: insufficient reading time' },
        hashVerified: true,
      },
    ],

    signatures: [
      {
        id: 'sig-201',
        name: PEOPLE.reem.name,
        title: reemRole,
        avatar: 'RD',
        department: DEPARTMENTS.finance,
        status: 'approved',
        timestamp: { ar: '2026-11-03 10:48 ص', en: '2026-11-03 10:48 AM' },
      },
      {
        id: 'sig-202',
        name: PEOPLE.noura.name,
        title: nouraRole,
        avatar: 'NS',
        department: DEPARTMENTS.legal,
        status: 'approved',
        timestamp: { ar: '2026-11-05 12:55 م', en: '2026-11-05 12:55 PM' },
      },
      {
        id: 'sig-203',
        name: FINANCE_STAGE_DELEGATED,
        title: tariqRole,
        avatar: 'SO',
        department: DEPARTMENTS.finance,
        status: 'pending',
        timestamp: { ar: 'بانتظار موافقة المراقب العام', en: 'Awaiting chief auditor approval' },
      },
      {
        id: 'sig-204',
        name: PEOPLE.abdullah.name,
        title: abdullahRole,
        avatar: 'AG',
        department: DEPARTMENTS.executive,
        status: 'pending',
        timestamp: { ar: 'لم تبدأ', en: 'Not started' },
      },
    ],

    evidences: [
      {
        id: 'ev-201',
        timestamp: { ar: '02:35 م', en: '02:35 PM' },
        user: join(PEOPLE.salman.name, { ar: ' (بالتفويض)', en: ' (delegated)' }),
        actionTitle: { ar: 'اعتماد مستعجل بمدة اطلاع غير كافية', en: 'Urgent approval with insufficient reading time' },
        description: {
          ar: 'وُقّعت المراجعة المالية على 38 صفحة خلال 12 ثانية، بينما يُقدَّر الاطلاع المتوقع بنحو 19 دقيقة.',
          en: 'The financial review was signed on 38 pages within 12 seconds, while the expected reading time is about 19 minutes.',
        },
        anomalyType: 'bypassed_signatures',
        riskScore: 58,
        ipAddress: '10.20.1.22',
        location: { ar: 'المقر الرئيسي (الرياض)', en: 'Headquarters (Riyadh)' },
        hashBefore: 'a1b2c3d4e5f6789012345678abcdef0123456789abcdef0123456789abcdef01',
        hashAfter: 'a1b2c3d4e5f6789012345678abcdef0123456789abcdef0123456789abcdef01',
      },
    ],

    aiAnalysis: {
      summary: {
        ar: 'رصد النظام اعتمادًا مستعجلًا في مرحلة المراجعة المالية: وُقّعت 38 صفحة خلال 12 ثانية بالتفويض، فأُحيل الطلب إلى المراقب العام قبل متابعة المسار.',
        en: 'The system detected an urgent approval at the financial review stage: 38 pages were signed within 12 seconds under delegation, so the request was routed to the chief auditor before the path continues.',
      },
      detectedConflicts: [
        { ar: 'مدة الاطلاع غير كافية مقارنة بعدد الصفحات.', en: 'Reading time is insufficient for the number of pages.' },
        { ar: 'التوقيع تم بالتفويض خلال فترة إجازة المفوِّض.', en: 'The signature was made under delegation during the delegator’s leave.' },
        { ar: 'لا يوجد تعارض مصالح بين الموقّعين والمورد.', en: 'No conflict of interest between the signatories and the supplier.' },
      ],
      legalArticles: [],
      recommendedAction: {
        ar: 'مراجعة سبب الاعتماد المستعجل مع المفوَّض إليه قبل الموافقة على متابعة المسار.',
        en: 'Review the reason for the urgent approval with the delegate before approving the path to continue.',
      },
    },
    // Risk model v1.1 input. Value matches the contract (SAR 1,240,000)
    riskInput: {
      record_id: 'YQ-8841',
      item_category: 'Information Technology',
      tender_value_sar: 1240000,
      items_count: 4,
      bids_count: 3,
      competitors_count: 3,
      prior_awards_count: 1,
      winning_suppliers_count: 1,
      documents_count: 5,
      submission_period_days: 21,
    },
  },

  // 3. BG-2026 — approved, governance-compliant chain completed yesterday
  {
    id: 'doc-3',
    code: '#BG-2026',
    title: { ar: 'ميزانية التشغيل السنوية والخطة المالية', en: 'Annual Operating Budget & Financial Plan' },
    category: { ar: 'الميزانيات والخطط المالية', en: 'Budgets & Financial Plans' },
    department: DEPARTMENTS.finance,
    responsibleDeptHead: join(PEOPLE.salman.name, { ar: ' (نائب رئيس قسم المالية)', en: ' (Deputy Head of Finance)' }),
    budget: { ar: '28,000,000 ر.س', en: 'SAR 28,000,000' },
    creationDate: '2026-11-02 08:45:00',
    lastModified: { ar: 'أمس 02:45 م', en: 'Yesterday 02:45 PM' },
    status: 'published',
    riskLevel: 'safe',
    riskScore: 4,
    tags: [
      { ar: 'اعتماد مكتمل - مطابق للحوكمة', en: 'Approval complete — governance compliant' },
      { ar: 'تواقيع مكتملة بالتسلسل', en: 'Signatures completed in sequence' },
      { ar: 'معتمد وجاهز للتنفيذ', en: 'Approved & ready for execution' },
    ],

    governance: {
      passCount: 16,
      viewersCount: 4,
      signaturesCount: 4,
      requiredSignaturesCount: 4,
      hasSeniorExecutiveSignature: true,
      isSequenceCompliant: true,
      speedAnomaly: false,

      platformApprovalStatus: 'auto_approved',
      approvalDecisionText: {
        ar: 'منحت المنصة موافقة تلقائية على النشر والتوثيق الرسمي لاكتمال سلسلة الاعتماد ومطابقة الحوكمة.',
        en: 'The platform granted automatic approval for official publishing and certification because the approval chain is complete and governance compliant.',
      },
      assignedAuthority: { ar: 'منظومة يقظة للتوثيق الرقمي المعتمد', en: 'Yaqadha Certified Digital Authentication System' },
      actionDetails: [
        {
          ar: 'اكتمال كافة التواقيع المطلوبة بالتسلسل (الإعداد، المراجعة القانونية، المراجعة المالية، الاعتماد النهائي).',
          en: 'All required signatures completed in sequence (preparation, legal review, financial review, final approval).',
        },
        {
          ar: 'استيفاء سجل الاطلاع الداخلي والتأكد من مطابقة بنود الميزانية للوائح الحوكمة.',
          en: 'Internal access log completed and budget items verified against governance regulations.',
        },
        {
          ar: 'إصدار ختم التوثيق الرقمي والباركود المشفر تلقائيًا وتفعيل النشر في السجل الرسمي للمنظومة.',
          en: 'Digital certification seal and encrypted barcode issued automatically, and publishing activated in the platform’s official registry.',
        },
      ],
    },

    viewers: [
      {
        id: 'v-301',
        name: PEOPLE.noura.name,
        role: nouraRole,
        department: DEPARTMENTS.legal,
        viewedAt: { ar: '2026-11-04 10:30 ص', en: '2026-11-04 10:30 AM' },
        timeSpent: { ar: 'ساعة و45 دقيقة', en: '1 hour 45 minutes' },
        ip: '10.10.5.20',
      },
      {
        id: 'v-302',
        name: PEOPLE.tariq.name,
        role: tariqRole,
        department: DEPARTMENTS.finance,
        viewedAt: { ar: '2026-11-06 09:15 ص', en: '2026-11-06 09:15 AM' },
        timeSpent: { ar: 'ساعتان وتدقيق مالي شامل', en: '2 hours with a comprehensive financial audit' },
        ip: '10.10.2.14',
      },
      {
        id: 'v-303',
        name: PEOPLE.abdullah.name,
        role: abdullahRole,
        department: DEPARTMENTS.executive,
        viewedAt: { ar: '2026-11-07 02:00 م', en: '2026-11-07 02:00 PM' },
        timeSpent: { ar: '45 دقيقة واعتماد نهائي', en: '45 minutes with final approval' },
        ip: '10.10.1.2',
      },
    ],

    signatureSteps: [
      {
        step: 1,
        roleTitle: stageTitles.preparer,
        officerName: PEOPLE.salman.name,
        department: DEPARTMENTS.finance,
        isSeniorExecutive: false,
        status: 'signed',
        signedAt: { ar: '2026-11-02 12:30 م', en: '2026-11-02 12:30 PM' },
        orderCompliant: true,
        notes: { ar: 'إعداد الميزانية والخطة المالية', en: 'Budget and financial plan prepared' },
      },
      {
        step: 2,
        roleTitle: stageTitles.legal,
        officerName: PEOPLE.noura.name,
        department: DEPARTMENTS.legal,
        isSeniorExecutive: true,
        status: 'signed',
        signedAt: { ar: '2026-11-04 11:30 ص', en: '2026-11-04 11:30 AM' },
        orderCompliant: true,
        notes: { ar: 'سلامة الصياغة النظامية ومطابقة اللوائح', en: 'Sound regulatory drafting and compliance with regulations' },
      },
      {
        step: 3,
        roleTitle: stageTitles.finance,
        officerName: PEOPLE.tariq.name,
        department: DEPARTMENTS.finance,
        isSeniorExecutive: true,
        status: 'signed',
        signedAt: { ar: '2026-11-06 11:15 ص', en: '2026-11-06 11:15 AM' },
        orderCompliant: true,
        notes: { ar: 'اكتمال مخصصات الميزانية ومطابقة الخطة المالية', en: 'Budget allocations complete and financial plan reconciled' },
      },
      {
        step: 4,
        roleTitle: stageTitles.final,
        officerName: PEOPLE.abdullah.name,
        department: DEPARTMENTS.executive,
        isSeniorExecutive: true,
        status: 'signed',
        signedAt: { ar: '2026-11-07 02:45 م', en: '2026-11-07 02:45 PM' },
        orderCompliant: true,
        notes: { ar: 'الاعتماد النهائي وجاهز للتنفيذ', en: 'Final sign-off; ready for execution' },
      },
    ],

    metrics: {
      views: 34,
      downloads: 12,
      edits: 4,
      exportAttempts: 0,
    },

    auditLogs: [
      {
        id: 'log-301',
        user: PEOPLE.salman.name,
        role: salmanRole,
        action: { ar: 'رفع الميزانية والخطة المالية للمراجعة', en: 'Uploaded the budget and financial plan for review' },
        timestamp: '2026-11-02 12:30:00',
        ip: '10.10.2.18',
        device: { ar: 'محطة العمل 84', en: 'Workstation 84' },
        hashVerified: true,
      },
      {
        id: 'log-302',
        user: PEOPLE.noura.name,
        role: nouraRole,
        action: { ar: 'توقيع المراجعة القانونية', en: 'Signed the legal review' },
        timestamp: '2026-11-04 11:30:00',
        ip: '10.10.5.20',
        device: { ar: 'جهاز الإدارة القانونية', en: 'Legal Department computer' },
        hashVerified: true,
      },
      {
        id: 'log-303',
        user: PEOPLE.tariq.name,
        role: tariqRole,
        action: { ar: 'توقيع المراجعة المالية', en: 'Signed the financial review' },
        timestamp: '2026-11-06 11:15:00',
        ip: '10.10.2.14',
        device: { ar: 'جهاز الإدارة المالية', en: 'Finance office computer' },
        hashVerified: true,
      },
      {
        id: 'log-304',
        user: PEOPLE.abdullah.name,
        role: abdullahRole,
        action: { ar: 'التوقيع والاعتماد النهائي في السلسلة الإجرائية', en: 'Final signature and approval in the procedural chain' },
        timestamp: '2026-11-07 14:45:00',
        ip: '10.10.1.2',
        device: { ar: 'الجهاز اللوحي القيادي المشفر', en: 'Encrypted executive tablet' },
        hashVerified: true,
      },
      {
        id: 'log-305',
        user: { ar: 'نظام يقظة للحوكمة التلقائية', en: 'Yaqadha Automated Governance System' },
        role: { ar: 'محرك الرقابة الذكي', en: 'Smart Oversight Engine' },
        action: {
          ar: 'منح الموافقة التلقائية على النشر وإصدار وثيقة التوثيق الرقمي الرسمية',
          en: 'Granted automatic publishing approval and issued the official digital certification document',
        },
        timestamp: '2026-11-07 14:45:02',
        ip: '127.0.0.1',
        device: { ar: 'خادم الأمان المشفر', en: 'Encrypted security server' },
        hashVerified: true,
      },
    ],

    signatures: [
      {
        id: 'sig-301',
        name: PEOPLE.salman.name,
        title: salmanRole,
        avatar: 'SO',
        department: DEPARTMENTS.finance,
        status: 'approved',
        timestamp: { ar: '2026-11-02 12:30 م', en: '2026-11-02 12:30 PM' },
      },
      {
        id: 'sig-302',
        name: PEOPLE.noura.name,
        title: nouraRole,
        avatar: 'NS',
        department: DEPARTMENTS.legal,
        status: 'approved',
        timestamp: { ar: '2026-11-04 11:30 ص', en: '2026-11-04 11:30 AM' },
      },
      {
        id: 'sig-303',
        name: PEOPLE.tariq.name,
        title: tariqRole,
        avatar: 'TM',
        department: DEPARTMENTS.finance,
        status: 'approved',
        timestamp: { ar: '2026-11-06 11:15 ص', en: '2026-11-06 11:15 AM' },
      },
      {
        id: 'sig-304',
        name: PEOPLE.abdullah.name,
        title: abdullahRole,
        avatar: 'AG',
        department: DEPARTMENTS.executive,
        status: 'approved',
        timestamp: { ar: '2026-11-07 02:45 م', en: '2026-11-07 02:45 PM' },
      },
    ],

    evidences: [],

    aiAnalysis: {
      summary: {
        ar: 'أظهر الفحص الاستباقي سلامة تامة لمسار التوقيعات؛ إذ استوفت الوثيقة المراجعة القانونية والمالية بالتسلسل مع الاعتماد النهائي، وبتدرج زمني طبيعي دون أي تسريع غير مبرر.',
        en: 'The proactive scan showed a fully sound signature path: the document passed legal and financial review in sequence with final approval, on a normal timeline without any unjustified acceleration.',
      },
      detectedConflicts: [],
      legalArticles: [
        { ar: 'استيفاء معايير الرقابة الداخلية وإبراء الذمة الإدارية.', en: 'Internal control criteria met and administrative clearance granted.' },
      ],
      recommendedAction: {
        ar: 'تم النشر التلقائي واعتماد الوثيقة في السجل الرسمي للمنظومة.',
        en: 'The document was automatically published and approved in the platform’s official registry.',
      },
    },
  },

  // 4. CL-0915 — approved cloud services booklet (complete chain)
  {
    id: 'doc-4',
    code: '#CL-0915',
    title: { ar: 'كراسة خدمات الحوسبة السحابية', en: 'Cloud Computing Services Booklet' },
    category: { ar: 'مناقصات ومشاريع تقنية', en: 'Technical Tenders & Projects' },
    department: DEPARTMENTS.it,
    responsibleDeptHead: join(PEOPLE.khalid.name, { ar: ' (مدير عام تقنية المعلومات)', en: ' (General Manager of Information Technology)' }),
    budget: { ar: '6,200,000 ر.س', en: 'SAR 6,200,000' },
    creationDate: '2026-09-08 09:30:00',
    lastModified: { ar: '2026-09-15 01:20 م', en: '2026-09-15 01:20 PM' },
    status: 'published',
    riskLevel: 'safe',
    riskScore: 6,
    tags: [
      { ar: 'اعتماد مكتمل - مطابق للحوكمة', en: 'Approval complete — governance compliant' },
      { ar: 'تواقيع مكتملة بالتسلسل', en: 'Signatures completed in sequence' },
    ],

    governance: {
      passCount: 12,
      viewersCount: 4,
      signaturesCount: 4,
      requiredSignaturesCount: 4,
      hasSeniorExecutiveSignature: true,
      isSequenceCompliant: true,
      speedAnomaly: false,
      platformApprovalStatus: 'auto_approved',
      approvalDecisionText: {
        ar: 'منحت المنصة موافقة تلقائية على النشر لاكتمال سلسلة الاعتماد ومطابقة الحوكمة.',
        en: 'The platform granted automatic publishing approval because the approval chain is complete and governance compliant.',
      },
      assignedAuthority: { ar: 'منظومة يقظة للتوثيق الرقمي المعتمد', en: 'Yaqadha Certified Digital Authentication System' },
      actionDetails: [
        {
          ar: 'اكتمال كافة التواقيع المطلوبة بالتسلسل (الإعداد، المراجعة القانونية، المراجعة المالية، الاعتماد النهائي).',
          en: 'All required signatures completed in sequence (preparation, legal review, financial review, final approval).',
        },
      ],
    },

    viewers: [
      {
        id: 'v-401',
        name: PEOPLE.noura.name,
        role: nouraRole,
        department: DEPARTMENTS.legal,
        viewedAt: { ar: '2026-09-10 10:00 ص', en: '2026-09-10 10:00 AM' },
        timeSpent: { ar: 'ساعة و20 دقيقة', en: '1 hour 20 minutes' },
        ip: '10.10.5.20',
      },
      {
        id: 'v-402',
        name: PEOPLE.tariq.name,
        role: tariqRole,
        department: DEPARTMENTS.finance,
        viewedAt: { ar: '2026-09-13 09:40 ص', en: '2026-09-13 09:40 AM' },
        timeSpent: { ar: 'ساعة و5 دقائق', en: '1 hour 5 minutes' },
        ip: '10.10.2.14',
      },
      {
        id: 'v-403',
        name: PEOPLE.abdullah.name,
        role: abdullahRole,
        department: DEPARTMENTS.executive,
        viewedAt: { ar: '2026-09-15 12:30 م', en: '2026-09-15 12:30 PM' },
        timeSpent: { ar: '40 دقيقة', en: '40 minutes' },
        ip: '10.10.1.2',
      },
    ],

    signatureSteps: [
      {
        step: 1,
        roleTitle: stageTitles.preparer,
        officerName: PEOPLE.khalid.name,
        department: DEPARTMENTS.it,
        isSeniorExecutive: false,
        status: 'signed',
        signedAt: { ar: '2026-09-08 01:15 م', en: '2026-09-08 01:15 PM' },
        orderCompliant: true,
        notes: { ar: 'إعداد الكراسة الفنية', en: 'Technical booklet prepared' },
      },
      {
        step: 2,
        roleTitle: stageTitles.legal,
        officerName: PEOPLE.noura.name,
        department: DEPARTMENTS.legal,
        isSeniorExecutive: true,
        status: 'signed',
        signedAt: { ar: '2026-09-10 11:20 ص', en: '2026-09-10 11:20 AM' },
        orderCompliant: true,
        notes: { ar: 'مطابقة نظامية', en: 'Regulatory compliance confirmed' },
      },
      {
        step: 3,
        roleTitle: stageTitles.finance,
        officerName: PEOPLE.tariq.name,
        department: DEPARTMENTS.finance,
        isSeniorExecutive: true,
        status: 'signed',
        signedAt: { ar: '2026-09-13 10:45 ص', en: '2026-09-13 10:45 AM' },
        orderCompliant: true,
        notes: { ar: 'تأكيد توفر الميزانية', en: 'Budget availability confirmed' },
      },
      {
        step: 4,
        roleTitle: stageTitles.final,
        officerName: PEOPLE.abdullah.name,
        department: DEPARTMENTS.executive,
        isSeniorExecutive: true,
        status: 'signed',
        signedAt: { ar: '2026-09-15 01:10 م', en: '2026-09-15 01:10 PM' },
        orderCompliant: true,
        notes: { ar: 'الاعتماد النهائي', en: 'Final approval' },
      },
    ],

    metrics: { views: 21, downloads: 6, edits: 3, exportAttempts: 0 },

    auditLogs: [
      {
        id: 'log-401',
        user: PEOPLE.khalid.name,
        role: KHALID_ROLE,
        action: { ar: 'رفع الكراسة الفنية للمراجعة', en: 'Uploaded the technical booklet for review' },
        timestamp: '2026-09-08 13:15:00',
        ip: '10.10.1.5',
        device: { ar: 'جهاز الإدارة المكتبي', en: 'Management office computer' },
        hashVerified: true,
      },
      {
        id: 'log-402',
        user: PEOPLE.noura.name,
        role: nouraRole,
        action: { ar: 'توقيع المراجعة القانونية', en: 'Signed the legal review' },
        timestamp: '2026-09-10 11:20:00',
        ip: '10.10.5.20',
        device: { ar: 'جهاز الإدارة القانونية', en: 'Legal Department computer' },
        hashVerified: true,
      },
      {
        id: 'log-403',
        user: PEOPLE.tariq.name,
        role: tariqRole,
        action: { ar: 'توقيع المراجعة المالية', en: 'Signed the financial review' },
        timestamp: '2026-09-13 10:45:00',
        ip: '10.10.2.14',
        device: { ar: 'جهاز الإدارة المالية', en: 'Finance office computer' },
        hashVerified: true,
      },
      {
        id: 'log-404',
        user: PEOPLE.abdullah.name,
        role: abdullahRole,
        action: { ar: 'التوقيع والاعتماد النهائي', en: 'Final signature and approval' },
        timestamp: '2026-09-15 13:10:00',
        ip: '10.10.1.2',
        device: { ar: 'الجهاز اللوحي القيادي المشفر', en: 'Encrypted executive tablet' },
        hashVerified: true,
      },
    ],

    signatures: [
      { id: 'sig-401', name: PEOPLE.khalid.name, title: KHALID_ROLE, avatar: 'KS', department: DEPARTMENTS.it, status: 'approved', timestamp: { ar: '2026-09-08 01:15 م', en: '2026-09-08 01:15 PM' } },
      { id: 'sig-402', name: PEOPLE.noura.name, title: nouraRole, avatar: 'NS', department: DEPARTMENTS.legal, status: 'approved', timestamp: { ar: '2026-09-10 11:20 ص', en: '2026-09-10 11:20 AM' } },
      { id: 'sig-403', name: PEOPLE.tariq.name, title: tariqRole, avatar: 'TM', department: DEPARTMENTS.finance, status: 'approved', timestamp: { ar: '2026-09-13 10:45 ص', en: '2026-09-13 10:45 AM' } },
      { id: 'sig-404', name: PEOPLE.abdullah.name, title: abdullahRole, avatar: 'AG', department: DEPARTMENTS.executive, status: 'approved', timestamp: { ar: '2026-09-15 01:10 م', en: '2026-09-15 01:10 PM' } },
    ],

    evidences: [],
  },
];

/** Detailed demo dossiers resolved to the given language (same DocumentDossier shape the UI already uses). */
export const getDocuments = (lang: Lang): DocumentDossier[] =>
  localize<DocumentDossier[]>(localizedDocuments, lang);
