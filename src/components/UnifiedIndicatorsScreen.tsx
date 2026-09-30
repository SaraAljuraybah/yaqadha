import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Lock, 
  ShieldAlert, 
  CheckCircle2, 
  Users, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Send, 
  FileText, 
  Fingerprint, 
  Scale, 
  UserCheck, 
  Check, 
  AlertOctagon, 
  Download, 
  Ban, 
  UserX, 
  X, 
  ShieldX
} from 'lucide-react';
import { DocumentDossier, FlaggedEvidence } from '../types';
import { ReviewApprovalModal } from './ReviewApprovalModal';
import { ApprovedCertificateModal } from './ApprovedCertificateModal';

interface UnifiedIndicatorsScreenProps {
  yellowDocument: DocumentDossier;
  redDocument: DocumentDossier;
  documents?: DocumentDossier[];
  initialIndicator?: 'yellow' | 'red' | 'compliance';
  onBackToDashboard: () => void;
  onBackToDossier: () => void;
  onPublishAfterCorrection?: (docTitle: string) => void;
  onOpenEscalateModal: () => void;
  onOpenStatementModal: () => void;
  onExportForensicReport: () => void;
  isRedEscalated?: boolean;
}

export const UnifiedIndicatorsScreen: React.FC<UnifiedIndicatorsScreenProps> = ({
  yellowDocument,
  redDocument,
  documents,
  initialIndicator = 'red',
  onBackToDashboard,
  onBackToDossier,
  onPublishAfterCorrection,
  onOpenEscalateModal,
  onOpenStatementModal,
  onExportForensicReport,
  isRedEscalated = false,
}) => {
  const [selectedIndicator, setSelectedIndicator] = useState<'yellow' | 'red' | 'compliance'>(initialIndicator);

  const allDocs = documents || [redDocument, yellowDocument];
  const blockedCount = allDocs.filter(d => d.riskLevel === 'blocked').length;
  const reviewCount = allDocs.filter(d => d.riskLevel === 'review').length;
  const safeCount = allDocs.filter(d => d.riskLevel === 'safe').length;

  useEffect(() => {
    if (initialIndicator) {
      setSelectedIndicator(initialIndicator);
    }
  }, [initialIndicator]);

  // --- Yellow State ---
  const [investigationMeetingNote, setInvestigationMeetingNote] = useState(
    'نقص في سجل الاطلاع الداخلي وعدم استكمال موافقة رئيس القسم المعني. الإجراء المعتمد: إعادة المستند للمُدخل لاستكمال التواقيع الإدارية وموافقة رئيس القسم تمهيداً للإذن بالنشر.'
  );
  const [isYellowResolved, setIsYellowResolved] = useState(false);

  const viewersAndSigners = yellowDocument.viewers.slice(0, 2).length === 2 
    ? yellowDocument.viewers.slice(0, 2)
    : [
        {
          id: 'v-1',
          name: 'سعد عبد الرحمن الخالدي',
          role: 'أخصائي مطابقة فواتير',
          department: 'قسم المالية والميزانية',
          viewedAt: '2026-09-21 01:10 م',
          timeSpent: '12 دقيقة',
          ip: '10.20.1.15'
        },
        {
          id: 'v-2',
          name: 'أمل مساعد المطيري',
          role: 'محاسب مدفوعات',
          department: 'قسم المالية والميزانية',
          viewedAt: '2026-09-21 02:25 م',
          timeSpent: '8 دقائق',
          ip: '10.20.1.22'
        }
      ];

  const [isReviewApprovalModalOpen, setIsReviewApprovalModalOpen] = useState(false);
  const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);
  const [isApprovedPublished, setIsApprovedPublished] = useState(false);
  const approvedDoc = allDocs.find(d => d.riskLevel === 'safe');

  const handleResolveAndPublish = () => {
    setIsReviewApprovalModalOpen(true);
  };

  // --- Red State ---
  const [showInvolvedPersonsModal, setShowInvolvedPersonsModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<FlaggedEvidence | null>(
    redDocument.evidences[0] || null
  );

  const redGov = redDocument.governance;

  const singleInvolvedUser = {
    name: 'أ. أحمد الخالد',
    role: 'مدير إدارة تقنية المعلومات (المُعد)',
    department: 'إدارة تقنية المعلومات',
    action: 'اطلع وطلب النشر فوراً بتوقيع منفرد (تجاوز سلسلة الاعتمادات الإلزامية)',
    timestamp: '2026-09-15 08:32:19',
    ipAddress: '192.168.10.45 (شبكة VPN)',
    violations: [
      'توقيع منفرد وتخطي 3 مستويات رقابية إلزامية (المالية والقانونية والقيادية)',
      'طلب نشر كراسة الشروط والمواصفات لمشروع التوسع التقني (#DOC-2026-01) دون اعتماد مالي وقانوني',
      'مخالفة المادة (43) من لائحة المنافسات والمشتريات والاعتمادات الإدارية'
    ]
  };

  return (
    <div id="unified-indicators-screen" className="space-y-8 pb-28 text-right">
      
      {/* 1. Header Title & Subtitle (مستقل تماماً ومطابق لصفحتي سجل المستندات وإدارة الحسابات) */}
      <div className="pt-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          مؤشرات المستندات
        </h1>
        <p className="text-xs sm:text-sm font-normal text-slate-600 mt-1">
          تحليل مؤشرات المستندات
        </p>
      </div>

      {/* 2. Interactive Metric Cards (محظور ، قيد المراجعة ، معتمد) على صف واحد */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
        
        {/* 1. كرت محظور (الأحمر) */}
        <button
          id="switch-to-red-indicator-btn"
          type="button"
          onClick={() => setSelectedIndicator('red')}
          className={`p-4 sm:p-5 rounded-3xl border text-right transition-all duration-200 cursor-pointer flex items-center gap-3 ${
            selectedIndicator === 'red'
              ? 'bg-red-50/70 border-red-500 ring-2 ring-red-400/30 shadow-xs'
              : 'bg-white border-slate-200 hover:border-red-300 hover:bg-slate-50/60 shadow-2xs'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0"></span>
          <span className="text-base sm:text-lg font-bold text-slate-900">محظور</span>
          <span className="text-xl sm:text-2xl font-bold text-red-700 font-mono">{blockedCount}</span>
        </button>

        {/* 2. كرت قيد المراجعة (الأصفر) */}
        <button
          id="switch-to-yellow-indicator-btn"
          type="button"
          onClick={() => setSelectedIndicator('yellow')}
          className={`p-4 sm:p-5 rounded-3xl border text-right transition-all duration-200 cursor-pointer flex items-center gap-3 ${
            selectedIndicator === 'yellow'
              ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-400/30 shadow-xs'
              : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-slate-50/60 shadow-2xs'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
          <span className="text-base sm:text-lg font-bold text-slate-900">قيد المراجعة</span>
          <span className="text-xl sm:text-2xl font-bold text-amber-800 font-mono">{reviewCount}</span>
        </button>

        {/* 3. كرت معتمد (الأخضر/الجامع) */}
        <button
          id="switch-to-compliance-indicator-btn"
          type="button"
          onClick={() => setSelectedIndicator('compliance')}
          className={`p-4 sm:p-5 rounded-3xl border text-right transition-all duration-200 cursor-pointer flex items-center gap-3 ${
            selectedIndicator === 'compliance'
              ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-400/30 shadow-xs'
              : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/60 shadow-2xs'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0"></span>
          <span className="text-base sm:text-lg font-bold text-slate-900">معتمد</span>
          <span className="text-xl sm:text-2xl font-bold text-emerald-700 font-mono">{safeCount}</span>
        </button>

      </div>

      {/* ========================================================= */}
      {/* VIEW A: YELLOW AMBER INDICATOR (المؤشر الأصفر) */}
      {/* ========================================================= */}
      {selectedIndicator === 'yellow' && (
        <div id="yellow-indicator-content" className="space-y-6 animate-in fade-in duration-200">
          
          {/* 1. Redesigned Clean Procedural Review Card */}
          <section className="bg-white rounded-3xl border border-slate-200 p-5 md:p-6 shadow-2xs space-y-5 text-right">
            
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    مستند قيد المراجعة
                  </h2>
                  <p className="text-xs text-slate-600 font-normal">
                    عقد توريد أجهزة ومعدات شبكات (#YQ-8841)
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0 flex items-center gap-2 self-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>بانتظار استكمال التواقيع الإدارية</span>
                </span>
              </div>
            </div>

            {/* 3 Focused Professional Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-start">
              
              {/* Part 1: Document Name & Number */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 flex flex-col justify-start h-full">
                <span className="text-[11px] font-bold text-amber-800 block">
                  اسم المستند
                </span>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  عقد توريد أجهزة ومعدات شبكات (#YQ-8841)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  معاملة توريد ومشتريات شبكات محالة لقسم المالية والميزانية والتدقيق الداخلي.
                </p>
              </div>

              {/* Part 2: Diagnosis */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 flex flex-col justify-start h-full">
                <span className="text-[11px] font-bold text-amber-800 block">
                  تشخيص المستند
                </span>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  نقص في سجل الاطلاع الداخلي
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  نقص في سجل الاطلاع الداخلي وعدم استكمال موافقة رئيس القسم المعني.
                </p>
              </div>

              {/* Part 3: Action */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 flex flex-col justify-start h-full">
                <span className="text-[11px] font-bold text-amber-800 block">
                  الإجراء المعتمد
                </span>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  إعادة المستند للمُدخل
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  إعادة المستند للمُدخل لاستكمال التواقيع الإدارية.
                </p>
              </div>

            </div>

          </section>

          {/* 2. سجل الاطلاع */}
          <section className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900">
                    سجل الاطلاع
                  </h3>
                  <p className="text-xs text-slate-600 font-normal">
                    سجل الاطلاع غير مكتمل • بانتظار استيفاء التواقيع المطلوبة
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/80 text-slate-700 font-bold text-xs">
                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                    <th className="py-3.5 px-4">اسم المستخدم</th>
                    <th className="py-3.5 px-4">المسمى الوظيفي</th>
                    <th className="py-3.5 px-4">حالة التوقيع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewersAndSigners.map((viewer, index) => (
                    <tr key={viewer.id}>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400 text-center text-xs">
                        0{index + 1}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 text-xs">
                        {viewer.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium text-[11px]">
                        {viewer.role} ({viewer.department})
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                            <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                            <span>تم الاطلاع والتوقيع</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {viewer.viewedAt}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. الإجراء الرقابي المتخذ */}
          <section className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900">
                    الإجراء الرقابي المتخذ
                  </h3>
                  <p className="text-xs text-slate-600 font-normal">
                    بانتظار قرار رئيس القسم • الإذن بالنشر المعتمد
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                مطلوب لاعتماد النشر
              </span>
            </div>

            <div>
              <textarea
                value={investigationMeetingNote}
                onChange={(e) => setInvestigationMeetingNote(e.target.value)}
                rows={3}
                className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
              />
            </div>
          </section>

          {/* 4. Fixed Resolution Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 p-4 shadow-2xl">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2C3E28] text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-snug">
                    صلاحية القرار: محال لرئيس قسم المالية والميزانية
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5 font-normal">
                    يمكن لرئيس القسم الإذن بنشر المستند بعد التحقق
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  id="btn-resolve-and-publish-yellow"
                  type="button"
                  disabled={isYellowResolved}
                  onClick={handleResolveAndPublish}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer ${
                    isYellowResolved 
                      ? 'bg-emerald-700 text-white shadow-emerald-700/20 ring-2 ring-emerald-400/40 cursor-default' 
                      : 'bg-[#2C3E28] hover:bg-[#1f2d1c] active:scale-95 text-white shadow-[#2C3E28]/20'
                  }`}
                >
                  {isYellowResolved ? (
                    <>
                      <span>تم إرسال توجيه الاستيفاء والتوقيع للأطراف المعنية</span>
                      <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>وجّه باستيفاء التواقيع وإعادة المراجعة</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW B: RED CRITICAL INDICATOR (المؤشر الأحمر) */}
      {/* ========================================================= */}
      {selectedIndicator === 'red' && (
        <div id="red-indicator-content" className="space-y-6 animate-in fade-in duration-200">
          
          {/* 1. Redesigned Clean Critical Block Card (مطابق لهيكلية المؤشر الأصفر) */}
          <section className="bg-white rounded-3xl border border-slate-200 p-5 md:p-6 shadow-2xs space-y-5 text-right">
            
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    مستند محظور
                  </h2>
                  <p className="text-xs text-slate-600 font-normal">
                    كراسة الشروط والمواصفات لمشروع التوسع التقني (#DOC-2026-01)
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0 flex items-center gap-2 self-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-red-50 text-red-900 border border-red-200">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span>حظر وتجميد المعاملة تلقائياً</span>
                </span>
              </div>
            </div>

            {/* 3 Focused Professional Diagnostic Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-start">
              
              {/* Part 1: Document Name & Number */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 flex flex-col justify-start h-full">
                <span className="text-[11px] font-bold text-red-700 block">
                  اسم المستند
                </span>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  كراسة الشروط والمواصفات لمشروع التوسع التقني (#DOC-2026-01)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  معاملة مناقصات ومشاريع تقنية كبرى صادرة عن إدارة تقنية المعلومات.
                </p>
              </div>

              {/* Part 2: Diagnosis */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 flex flex-col justify-start h-full">
                <span className="text-[11px] font-bold text-red-700 block">
                  تشخيص المستند
                </span>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  اعتماد بتوقيع منفرد غير مصرح
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  تم رصد اعتماد الوثيقة بتوقيع منفرد من قبل إدارة تقنية المعلومات دون استيفاء توقيع الشؤون القانونية والموارد المالية.
                </p>
              </div>

              {/* Part 3: Result */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 flex flex-col justify-start h-full">
                <span className="text-[11px] font-bold text-red-700 block">
                  الإجراء المعتمد
                </span>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  حظر وتجميد المعاملة تلقائياً
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  حظر وتجميد المعاملة تلقائياً مع إيقاف صلاحيات النشر وإحالة الملف لمعالي رئيس المنظومة وهيئة النزاهة.
                </p>
              </div>

            </div>

          </section>

          {/* 2. سجل الاطلاع في فلتر المحظور */}
          <section className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900">
                    سجل الاطلاع
                  </h3>
                  <p className="text-xs text-slate-600 font-normal">
                    سجل الاطلاع غير مكتمل • تم رصد توقيع منفرد وتخطي سلسلة الاعتمادات الإلزامية
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/80 text-slate-700 font-bold text-xs">
                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                    <th className="py-3.5 px-4">اسم المستخدم</th>
                    <th className="py-3.5 px-4">المسمى الوظيفي</th>
                    <th className="py-3.5 px-4">حالة التوقيع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400 text-center text-xs">
                      01
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-xs">
                      أحمد خالد
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-[11px]">
                      مدير إدارة تقنية المعلومات • إدارة تقنية المعلومات
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-900">
                          <UserX className="w-3.5 h-3.5 text-red-600" />
                          <span>اطلع ووقع منفردًا</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          2026-09-15 05:42 ص
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400 text-center text-xs">
                      02
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-xs">
                      المستشار القانوني العام
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-[11px]">
                      المستشار القانوني (الشؤون القانونية)
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-800">
                          <Clock className="w-3.5 h-3.5 text-red-500" />
                          <span>لم يتم الاطلاع</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          —
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400 text-center text-xs">
                      03
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-xs">
                      مدير إدارة الموارد المالية
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-[11px]">
                      مدير الموارد المالية (الشؤون المالية)
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-800">
                          <Clock className="w-3.5 h-3.5 text-red-500" />
                          <span>لم يتم الاطلاع</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          —
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. سجل صاحب طلب النشر الفردي وسلسلة المخالفات */}
          <section className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center shrink-0">
                  <UserX className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900">
                    صاحب التوقيع المنفرد (مُعد المستند)
                  </h3>
                  <p className="text-xs text-slate-600 font-normal">
                    المسؤول عن محاولة النشر واعتماد المستند بشكل منفرد دون استكمال التواقيع
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                حساب موقوف
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                    أخ
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">أحمد خالد</h4>
                      <span className="text-[10px] font-bold text-red-700 bg-red-100/70 px-2 py-0.5 rounded-full border border-red-200">
                        حساب موقوف
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-normal whitespace-nowrap">
                      مدير إدارة تقنية المعلومات • إدارة تقنية المعلومات
                    </p>
                    <p className="text-[11px] text-slate-500 font-normal">
                      وقت العملية: <span className="font-mono font-bold text-slate-700">2026-09-15 05:42 ص</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Forensic Violations Breakdown */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-slate-700 block">
                  بنود المخالفات المرصودة آلياً عبر محرك يقظة الرقابي:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {singleInvolvedUser.violations.map((v, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-right">
                      <div className="flex items-center gap-1.5 text-red-700 font-bold text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
                        <span>مخالفة رقم {i + 1}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
                        {v}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 3. الإجراء الرقابي المتخذ */}
          <section className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center shrink-0">
                  <Scale className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900">
                    الإجراء الرقابي المتخذ
                  </h3>
                  <p className="text-xs text-slate-600 font-normal">
                    حظر وتجميد دائم للوثيقة • تحويل الملف للمساءلة الرقابية
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-red-800 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                حظر غير قابل للتراجع
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-900">
                بيان التدقيق الجنائي المعتمد:
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                بموجب المادة 43 من لائحة الحوكمة والاعتمادات الإدارية، تم تطبيق الحظر وتجميد كراسة الشروط والمواصفات لمشروع التوسع التقني (#DOC-2026-01) مع إيقاف صلاحيات النشر التلقائي لحساب المُعد، وتجهيز ملف الإفادة الرسمية للعرض المباشر على معالي رئيس المنظومة وهيئة الرقابة ومكافحة الفساد.
              </p>
            </div>
          </section>

          {/* 4. Fixed Escalation Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 p-4 shadow-2xl">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2C3E28] text-white flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-snug">
                    صلاحية القرار: معالي رئيس الشركة وهيئة الرقابة
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5 font-normal">
                    الوثيقة محظورة ومجمدة بشكل دائم ولا يمكن نشرها
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onOpenStatementModal}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#2C3E28] text-[#2C3E28] hover:bg-[#2C3E28]/5 text-xs font-bold transition-colors cursor-pointer"
                >
                  طلب إفادة وتحقيق
                </button>

                <button
                  id="btn-escalate-red-ceo"
                  type="button"
                  disabled={isRedEscalated}
                  onClick={onOpenEscalateModal}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer ${
                    isRedEscalated
                      ? 'bg-emerald-700 text-white shadow-emerald-700/20 ring-2 ring-emerald-400/40 cursor-default'
                      : 'bg-[#2C3E28] hover:bg-[#1f2d1c] active:scale-95 text-white shadow-[#2C3E28]/20'
                  }`}
                >
                  {isRedEscalated ? (
                    <>
                      <span>تم تصعيد المخالفة لمعالي رئيس الشركة وهيئة النزاهة</span>
                      <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>صعّد المخالفة لرئيس الشركة وهيئة النزاهة</span>
                      <Ban className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW C: APPROVED CRITICAL INDICATOR (المؤشر الأخضر - معتمد) */}
      {/* ========================================================= */}
      {selectedIndicator === 'compliance' && (
        <div id="compliance-indicator-content" className="space-y-6 animate-in fade-in duration-200">
          
          {/* 1. Approved Document Diagnostic Card (مطابق لهيكلية كرت محظور وقيد المراجعة) */}
          <section className="bg-white rounded-3xl border border-slate-200 p-5 md:p-6 shadow-2xs space-y-5 text-right">
            
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    مستند معتمد
                  </h2>
                  <p className="text-xs text-slate-600 font-normal">
                    ميزانية التشغيل السنوية والخطة المالية (#DOC-2026-03)
                  </p>
                </div>
              </div>

              {/* Status Badge - Clickable interactive button */}
              <div className="shrink-0 flex items-center gap-2 self-start">
                <button
                  type="button"
                  onClick={() => setIsApprovedModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100/90 text-emerald-900 border border-emerald-200 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer active:scale-95"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>معتمد وجاهز للتنفيذ</span>
                </button>
              </div>
            </div>

            {/* 3 Focused Professional Diagnostic Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-start">
              
              {/* Part 1: Document Name & Number */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 flex flex-col justify-start h-full">
                <span className="text-[11px] font-bold text-emerald-800 block">
                  اسم المستند
                </span>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  ميزانية التشغيل السنوية والخطة المالية (#DOC-2026-03)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  معاملة الميزانيات والخطط المالية الصادرة عن إدارة الموارد المالية ومطابقة للوائح الحوكمة.
                </p>
              </div>

              {/* Part 2: Diagnosis / Approval Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 flex flex-col justify-start h-full">
                <span className="text-[11px] font-bold text-emerald-800 block">
                  تشخيص المستند
                </span>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  اكتمال مصفوفة التواقيع والتدقيق
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  تم اكتمال كافة التواقيع المطلوبة (إدارة الموارد المالية، الشؤون القانونية، وموافقة رئيس القسم) واستيفاء سجل الاطلاع الداخلي بنجاح.
                </p>
              </div>

              {/* Part 3: Final Status */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 flex flex-col justify-start h-full">
                <span className="text-[11px] font-bold text-emerald-800 block">
                  الإجراء المعتمد
                </span>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  معتمد وجاهز للتنفيذ
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  استيفاء معايير الرقابة بنسبة 100% وإصدار وثيقة التوثيق الرقمي والباركود المشفر تلقائياً.
                </p>
              </div>

            </div>

          </section>

          {/* 2. سجل الاطلاع */}
          <section className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900">
                    سجل الاطلاع
                  </h3>
                  <p className="text-xs text-slate-600 font-normal">
                    سجل الاطلاع مكتمل • تم توقيع واعتماد المستند من جميع الأطراف المعنية
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/80 text-slate-700 font-bold text-xs">
                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                    <th className="py-3.5 px-4">اسم المستخدم</th>
                    <th className="py-3.5 px-4">المسمى الوظيفي</th>
                    <th className="py-3.5 px-4">حالة التوقيع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400 text-center text-xs">
                      01
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-xs">
                      د. طارق المنصور
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-[11px]">
                      مدير إدارة الموارد المالية (إدارة الموارد المالية)
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>تم الاطلاع والتوقيع</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          2026-09-18 09:15 ص
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400 text-center text-xs">
                      02
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-xs">
                      أ. نورة الشمري
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-[11px]">
                      المستشار القانوني العام (الشؤون القانونية)
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>تم الاطلاع والتوقيع</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          2026-09-18 11:30 ص
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400 text-center text-xs">
                      03
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-xs">
                      د. عبد الله الغامدي
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-[11px]">
                      رئيس القسم ونائب الرئيس التنفيذي (الإدارة العليا)
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>تم الاطلاع والتوقيع</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          2026-09-18 02:45 م
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. الإجراء الرقابي المتخذ */}
          <section className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                  <Scale className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900">
                    الإجراء الرقابي المتخذ
                  </h3>
                  <p className="text-xs text-slate-600 font-normal">
                    مطابقة تامة لمتطلبات الحوكمة • إصدار الختم الرقمي والتصريح بالتنفيذ
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                اعتماد نهائي
              </span>
            </div>

            {/* بيان الاعتماد والتوثيق الرقمي المعتمد */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-xs">
                بيان الاعتماد والتوثيق الرقمي المعتمد:
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                بموجب المادة (12) من لائحة الحوكمة والاعتماد الرقمي، تم استيفاء كافة التواقيع الإلزامية لميزانية التشغيل السنوية والخطة المالية (#DOC-2026-03) بمشاركة إدارة الموارد المالية، والشؤون القانونية، وموافقة رئيس القسم المعني، مع اكتمال سجل الاطلاع الداخلي بنجاح. الوثيقة مصادق عليها وتعتبر سارية المفعول وجاهزة للتنفيذ الفوري.
              </p>
            </div>
          </section>

          {/* 4. Fixed Approved Action Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 p-4 shadow-2xl">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2C3E28] text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-snug">
                    صلاحية الاعتماد: اعتماد رقمي نهائي
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5 font-normal">
                    ميزانية التشغيل السنوية والخطة المالية (#DOC-2026-03) معتمدة وجاهزة للتنفيذ
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  id="approve-official-publish-btn"
                  type="button"
                  disabled={isApprovedPublished}
                  onClick={() => setIsApprovedModalOpen(true)}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer ${
                    isApprovedPublished
                      ? 'bg-emerald-700 text-white shadow-emerald-700/20 ring-2 ring-emerald-400/40 cursor-default'
                      : 'bg-[#2C3E28] hover:bg-[#1f2d1c] active:scale-95 text-white shadow-[#2C3E28]/20'
                  }`}
                >
                  {isApprovedPublished ? (
                    <>
                      <span>تم إصدار تصريح النشر وإطلاق المستند</span>
                      <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>إصدار تصريح النشر الرسمي</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Modal: اعتماد وتصحيح وثيقة قيد المراجعة */}
      <ReviewApprovalModal
        isOpen={isReviewApprovalModalOpen}
        onClose={() => setIsReviewApprovalModalOpen(false)}
        documentTitle={yellowDocument.title}
        documentNumber="#YQ-8841"
        department="قسم المالية والميزانية"
        onConfirmApproval={() => {
          setIsYellowResolved(true);
        }}
      />

      {/* Modal: شهادة الاعتماد والتصريح بالنشر */}
      <ApprovedCertificateModal
        isOpen={isApprovedModalOpen}
        onClose={() => setIsApprovedModalOpen(false)}
        onConfirmPublish={() => {
          setIsApprovedPublished(true);
        }}
        documentTitle={approvedDoc?.title || 'ميزانية التشغيل السنوية والخطة المالية'}
        documentNumber={approvedDoc?.code || '#DOC-2026-03'}
        department={approvedDoc?.department || 'إدارة الموارد المالية'}
      />

    </div>
  );
};
