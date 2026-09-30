import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  X, 
  Users, 
  FileCheck, 
  Clock, 
  ArrowRight, 
  Lock, 
  ShieldCheck, 
  Scale, 
  Send, 
  UserX, 
  Building2, 
  Calendar, 
  HelpCircle,
  Eye,
  Check,
  Ban,
  ArrowUpRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { DocumentDossier, SignatureStep } from '../types';

interface GovernanceAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentDossier;
  onNavigateToRiskInspection?: () => void;
  onNavigateToFileDossier?: () => void;
  onPublishSuccess?: (docTitle: string) => void;
}

export const GovernanceAuditModal: React.FC<GovernanceAuditModalProps> = ({
  isOpen,
  onClose,
  document,
  onNavigateToRiskInspection,
  onNavigateToFileDossier,
  onPublishSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'decision' | 'signature_chain' | 'viewers'>('decision');
  const [isDeptHeadApproved, setIsDeptHeadApproved] = useState(false);
  const [meetingNote, setMeetingNote] = useState(
    'تم عقد اجتماع استيضاحي من قبل رئيس قسم المالية والميزانية مع الأطراف المعنية، وتبين وجود استعجال غير مبرر بسبب انتهاء السنة المالية. تم تصحيح المستند وإحالة الملاحظات لمدقق الحسابات.'
  );

  if (!isOpen) return null;

  const gov = document.governance;
  const isSafe = document.riskLevel === 'safe';
  const isReview = document.riskLevel === 'review';
  const isBlocked = document.riskLevel === 'blocked';

  const handleDeptHeadApproveAndPublish = () => {
    setIsDeptHeadApproved(true);
    if (onPublishSuccess) {
      onPublishSuccess(document.title);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col text-right overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded bg-slate-900 text-white">
                {document.code}
              </span>

              {/* Indicator Pill */}
              {isSafe && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  المؤشر الأخضر (آمن - جاهز للنشر بموافقة تلقائية)
                </span>
              )}
              {isReview && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  المؤشر الأصفر (اشتباه - محال لرئيس القسم للتحقيق)
                </span>
              )}
              {isBlocked && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-0.5 rounded-full bg-red-100 text-red-900 border border-red-300">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  المؤشر الأحمر (خطر - مصعد لرئيس المنظومة وحظر أبدي)
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {document.title}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              الجهة المشرفة: <strong className="text-slate-700">{document.department}</strong> • رئيس القسم: <strong className="text-slate-700">{document.responsibleDeptHead}</strong>
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Core Tracking Metrics (الأثر الدقيق: كم مرة مر، من اطلع، كم وقع، والترتيب) */}
        <div className="p-5 border-b border-slate-100 bg-white grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Metric 1: Pass Count */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 block">كم مرة مر على شخص:</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black font-mono text-slate-900">{gov.passCount}</span>
              <span className="text-[11px] text-slate-400">مرات تداول</span>
            </div>
            <span className={`text-[10px] font-bold block mt-0.5 ${gov.passCount <= 3 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {gov.passCount <= 3 ? '⚠️ تداول محدود وغير كافٍ' : '✅ دورة تداول مستوفاة'}
            </span>
          </div>

          {/* Metric 2: Viewers Count */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 block">من اطلع عليه:</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black font-mono text-slate-900">{gov.viewersCount}</span>
              <span className="text-[11px] text-slate-400">أشخاص مسجلين</span>
            </div>
            <span className={`text-[10px] font-bold block mt-0.5 ${gov.viewersCount <= 2 ? 'text-red-600' : 'text-emerald-600'}`}>
              {gov.viewersCount === 1 ? '🔴 شخص واحد فقط (مريب)' : gov.viewersCount === 2 ? '🟡 شخصان فقط (اشتباه)' : '🟢 عدد كافٍ وموثق'}
            </span>
          </div>

          {/* Metric 3: Signatures Count */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 block">كم شخص وقع عليه:</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black font-mono text-slate-900">{gov.signaturesCount}</span>
              <span className="text-[11px] text-slate-400">من أصل {gov.requiredSignaturesCount} تواقيع</span>
            </div>
            <span className={`text-[10px] font-bold block mt-0.5 ${gov.signaturesCount === gov.requiredSignaturesCount ? 'text-emerald-600' : 'text-amber-600'}`}>
              {gov.signaturesCount === gov.requiredSignaturesCount ? '✅ التواقيع مكتملة' : '⚠️ تواقيع غير مكتملة'}
            </span>
          </div>

          {/* Metric 4: Hierarchy & Sequence */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 block">ترتيب التواقيع والرؤساء:</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-sm font-black text-slate-900">
                {gov.hasSeniorExecutiveSignature ? 'يوجد رئيس كبير' : 'لا يوجد رئيس كبير'}
              </span>
            </div>
            <span className={`text-[10px] font-bold block mt-0.5 ${gov.isSequenceCompliant ? 'text-emerald-600' : 'text-red-600'}`}>
              {gov.isSequenceCompliant ? '✅ تسلسل حوكمة منضبط' : '🔴 قفز فوق الترتيب الإجرائي'}
            </span>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-slate-200 bg-slate-50/50 flex items-center gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('decision')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'decision' 
                ? 'border-slate-900 text-slate-900' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            قرار المنصة التلقائي والإجراءات النظامية
          </button>
          <button
            onClick={() => setActiveTab('signature_chain')}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'signature_chain' 
                ? 'border-slate-900 text-slate-900' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>سلسلة وترتيب التواقيع</span>
            <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.2 rounded-full">
              {document.signatureSteps.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('viewers')}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'viewers' 
                ? 'border-slate-900 text-slate-900' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>سجل من اطلع عليه</span>
            <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.2 rounded-full">
              {document.viewers.length}
            </span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* TAB 1: Platform Decision & Mandatory Actions */}
          {activeTab === 'decision' && (
            <div className="space-y-5">
              
              {/* Green Safe State Box */}
              {isSafe && (
                <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-300 text-emerald-950 space-y-3">
                  <div className="flex items-center gap-2 font-black text-sm text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>المؤشر الأخضر: موافقة تلقائية على النشر والتوثيق الرسمي</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    {gov.approvalDecisionText}
                  </p>
                  <div className="pt-2 border-t border-emerald-200 text-xs space-y-1.5">
                    <div className="font-bold text-emerald-900">معايير السلامة المتحققة:</div>
                    <ul className="list-disc list-inside space-y-1 text-emerald-800 text-xs">
                      {gov.actionDetails.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-900">كود التحقق الرقمي المعتمد:</span>
                      <span className="font-mono font-bold text-emerald-700">AUTH-2026-YQ7520-VERIFIED</span>
                    </div>
                    <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      جاهز للنشر الفوري
                    </span>
                  </div>
                </div>
              )}

              {/* Amber Review State Box */}
              {isReview && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-300 text-amber-950 space-y-3">
                    <div className="flex items-center gap-2 font-black text-sm text-amber-900">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <span>المؤشر الأصفر: اشتباه وخلل إجرائي (اطلع عليه شخصان فقط وطلب نشره)</span>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                      {gov.approvalDecisionText}
                    </p>

                    {/* 5 Mandatory Rules for Amber */}
                    <div className="pt-2 border-t border-amber-200 text-xs space-y-2">
                      <div className="font-bold text-amber-900">الإجراءات النظامية الملزمة المطبقة آلياً:</div>
                      <ol className="list-decimal list-inside space-y-1.5 text-amber-900 text-xs">
                        <li><strong>تسجيل مسار الاطلاع:</strong> تم تقييد كل من اطلع (سعد الخالدي وأمل المطيري) ومن وقع بالتوقيت الدقيق.</li>
                        <li><strong>إعادة التوجيه التلقائي:</strong> تم إرسال الملف مباشرة إلى <strong>رئيس قسم المالية والميزانية ({document.responsibleDeptHead})</strong>.</li>
                        <li><strong>كشف الأسماء:</strong> تم تسليم كشف تفصيلي كامل بأسماء الموظفين المعنيين لمحطة عمل رئيس القسم.</li>
                        <li><strong>التحقيق الداخلي:</strong> إلزام رئيس القسم بعقد اجتماع رسمي لاستيضاح أسباب الاستعجال وتجاوز المراجعة الداخلية.</li>
                        <li><strong>النشر المشروط:</strong> لا يمكن نشر المستند إلا بعد تصحيح الأخطاء وموافقة رئيس القسم الرسمية.</li>
                      </ol>
                    </div>
                  </div>

                  {/* Dept Head Action Interface */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-slate-600" />
                        <span>محضر اجتماع رئيس القسم ({document.responsibleDeptHead})</span>
                      </span>
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        مطلوب الاعتماد لرفع الحظر
                      </span>
                    </div>

                    <textarea
                      value={meetingNote}
                      onChange={(e) => setMeetingNote(e.target.value)}
                      rows={3}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500">
                        تأكيدك بصفتك رئيس القسم يتيح استكمال المسار النظامي ونشر المستند.
                      </span>

                      {!isDeptHeadApproved ? (
                        <button
                          onClick={handleDeptHeadApproveAndPublish}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>تأكيد التحقيق وإتاحة النشر المشروط</span>
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>تم تصحيح الخلل واعتماد رئيس القسم للنشر</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Red Blocked State Box */}
              {isBlocked && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-red-50/80 border-2 border-red-300 text-red-950 space-y-3">
                    <div className="flex items-center gap-2 font-black text-sm text-red-900">
                      <Lock className="w-5 h-5 text-red-600 stroke-[2.5]" />
                      <span>المؤشر الأحمر: خطر فساد مؤكد وتسريع مريب (توقيع منفرد واطلاع شخص واحد)</span>
                    </div>
                    <p className="text-xs text-red-900 leading-relaxed font-bold">
                      {gov.approvalDecisionText}
                    </p>

                    {/* 4 Strict Rules for Red */}
                    <div className="pt-2 border-t border-red-200 text-xs space-y-2">
                      <div className="font-bold text-red-900">الإجراءات الرقابية الصارمة المطبقة بقوة النظام:</div>
                      <ol className="list-decimal list-inside space-y-1.5 text-red-900 text-xs font-medium">
                        <li><strong>التصعيد الفوري لرئيس المنظومة:</strong> تم تحويل ملف القضية بالكامل إلى معالي الرئيس التنفيذي.</li>
                        <li><strong>رفع كشف الأدلة والأسماء:</strong> تضمن الرفع أسماء جميع من وقع واطلع (فهد السبيعي) ومطابقة الـ IP المشبوه عبر VPN.</li>
                        <li><strong>المنع البات والنهائي:</strong> يُمنع منعاً باتاً إعادة نشر أو توثيق هذا المستند مستقبلاً تحت أي ظرف.</li>
                        <li><strong>الملف مقفل:</strong> الحفظ الدائم في خزانة التحقيقات الجنائية بمكتب رئيس المنظومة لاتخاذ الإجراءات النظامية.</li>
                      </ol>
                    </div>
                  </div>

                  {/* Actions for Red */}
                  <div className="p-4 rounded-2xl border border-red-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        ملف القضية محال رسمياً لرئيس المنظومة وهيئة مكافحة الفساد
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        رقم الإحالة: CEO-ESC-2026-9082 • الحالة: مجمد نهائياً
                      </span>
                    </div>

                    {onNavigateToRiskInspection && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToRiskInspection();
                        }}
                        className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>فتح محضر الضبط الجنائي والحظر</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: Signature Chain & Sequence */}
          {activeTab === 'signature_chain' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <span className="text-slate-600">
                  سلسلة الاعتماد الإلزامي: <strong>{document.signatureSteps.length} مستويات تدقيق</strong>
                </span>
                <span className="text-slate-500 font-medium">
                  {gov.isSequenceCompliant ? '✅ الترتيب متسلسل نظاماً' : '⚠️ تم رصد خرق لترتيب التواقيع'}
                </span>
              </div>

              <div className="space-y-3">
                {document.signatureSteps.map((step) => {
                  const isSigned = step.status === 'signed';
                  const isBypassed = step.status === 'bypassed';
                  const isPending = step.status === 'pending';

                  return (
                    <div 
                      key={step.step}
                      className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                        isSigned 
                          ? 'bg-emerald-50/50 border-emerald-200' 
                          : isBypassed 
                          ? 'bg-red-50/70 border-red-200'
                          : 'bg-slate-50/50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSigned 
                            ? 'bg-emerald-600 text-white' 
                            : isBypassed 
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {step.step}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-black text-slate-900 text-xs sm:text-sm">
                              {step.roleTitle}
                            </span>
                            {step.isSeniorExecutive && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                                رئيس كبير
                              </span>
                            )}
                            {isSigned && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                تم التوقيع ✅
                              </span>
                            )}
                            {isBypassed && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                                ⚠️ تم التخطي غير المصرح به
                              </span>
                            )}
                            {isPending && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                                قيد الانتظار ⏳
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 font-medium">
                            المسؤول: <strong>{step.officerName}</strong> ({step.department})
                          </p>

                          {step.notes && (
                            <p className={`text-[11px] font-medium mt-1 ${isBypassed ? 'text-red-700 font-bold' : 'text-slate-500'}`}>
                              {step.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {step.signedAt && (
                        <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap bg-white px-2 py-1 rounded-lg border border-slate-200">
                          {step.signedAt}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Viewers List */}
          {activeTab === 'viewers' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <span className="text-slate-600">
                  سجل الدخول والمشاهدة: <strong>{document.viewers.length} مستخدمين مسجلين</strong>
                </span>
                <span className="text-slate-500">
                  كافة الجلسات موثقة بالـ IP والمدة الزمنية
                </span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {document.viewers.map((viewer) => (
                  <div key={viewer.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 text-sm">{viewer.name}</strong>
                        <span className="text-slate-400 font-medium">({viewer.role})</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        القسم: {viewer.department} • الوقت المستغرق: <strong className="text-slate-700">{viewer.timeSpent}</strong>
                      </p>
                    </div>

                    <div className="text-left font-mono text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-200 shrink-0">
                      <div>وقت المشاهدة: {viewer.viewedAt}</div>
                      <div className="text-slate-400">العنوان: {viewer.ip}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-medium">
            قرار المنصة خاضع لقواعد الحوكمة الرقابية ومسار التواقيع المعتمد.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-xs text-slate-700 transition-colors"
            >
              إغلاق
            </button>

            {onNavigateToFileDossier && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToFileDossier();
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>معاينة ملف الوثيقة</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper icon
function ArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7"/>
      <path d="M19 12H5"/>
    </svg>
  );
}
