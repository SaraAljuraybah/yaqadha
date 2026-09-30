import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Users, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Send, 
  FileText, 
  Fingerprint, 
  Scale, 
  UserCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { DocumentDossier } from '../types';

interface YellowRiskInspectionScreenProps {
  document: DocumentDossier;
  onBackToDashboard: () => void;
  onBackToDossier: () => void;
  onPublishAfterCorrection?: (docTitle: string) => void;
}

export const YellowRiskInspectionScreen: React.FC<YellowRiskInspectionScreenProps> = ({
  document,
  onBackToDashboard,
  onBackToDossier,
  onPublishAfterCorrection,
}) => {
  const [investigationMeetingNote, setInvestigationMeetingNote] = useState(
    'عُقد اجتماع تدقيق من قِبل رئيس قسم المالية مع أخصائي المشتريات ومحاسب المدفوعات. تم تصحيح المستند الإجرائي، والتأكد من سلامة الأسعار، واستكمال التوقيعات النظامية المطلوبة.'
  );
  const [isResolved, setIsResolved] = useState(false);

  // The 2 viewers/signers for the Yellow condition as explicitly requested
  const viewersAndSigners = document.viewers.slice(0, 2).length === 2 
    ? document.viewers.slice(0, 2)
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

  const handleResolveAndPublish = () => {
    setIsResolved(true);
    if (onPublishAfterCorrection) {
      onPublishAfterCorrection(document.title);
    }
  };

  return (
    <div id="yellow-risk-screen" className="space-y-6 pb-28 text-right">
      
      {/* 1. Top Banner in Soft Amber Yellow (#FFFBEB) with Warning Icon & Arabic Title */}
      <section 
        id="yellow-top-banner"
        className="rounded-3xl bg-[#FFFBEB] border-2 border-amber-300 p-6 md:p-8 shadow-2xs text-amber-950 relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-start gap-4">
            {/* Warning Amber Icon */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/25 ring-4 ring-amber-100">
              <AlertTriangle className="w-8 h-8 md:w-9 md:h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full bg-amber-600 text-white tracking-wide">
                  <span>المؤشر الأصفر (اشتباه إجرائي)</span>
                </span>
                <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300">
                  كود الوثيقة: {document.code}
                </span>
                <span className="text-xs font-bold text-amber-800 bg-white/80 px-2.5 py-0.5 rounded-full border border-amber-200">
                  خلل إجرائي قابل للتصحيح
                </span>
              </div>

              {/* Title exactly as requested */}
              <h1 className="text-2xl md:text-3xl font-black text-amber-950 tracking-tight">
                تنبيه مراجعة - اشتباه إجرائي (المؤشر الأصفر)
              </h1>

              <p className="text-xs md:text-sm text-amber-900 leading-relaxed max-w-3xl font-medium">
                رصدت منصة <strong>يقظة</strong> طلباً مستعجلاً لنشر وتوثيق المستند قبل استيفاء دورة التدقيق اللازمة. تم تجميد إجراءات النشر التلقائي فوراً وتحويل الملف إلكترونياً إلى رئيس القسم المختص للتحقيق والاستيضاح واستكمال الشروط النظامية.
              </p>
            </div>
          </div>

          {/* Quick Routing Status Pill */}
          <div className="shrink-0 flex flex-col gap-2 bg-white/90 p-4 rounded-2xl border border-amber-200 text-xs">
            <span className="text-[11px] font-bold text-amber-800 block">الإجراء الآلي:</span>
            <span className="text-xs font-black text-slate-900">محال لرئيس قسم المالية</span>
            <span className="text-[10px] text-slate-500 font-medium">
              الوثيقة قابلة للنشر بعد المعالجة
            </span>
          </div>

        </div>
      </section>

      {/* 2. Middle Section: AI Risk Analysis Box */}
      <section id="yellow-ai-analysis-box" className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 md:p-7 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Scale className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-black text-slate-900">
              تشخيص الذكاء الاصطناعي والحوكمة (AI Risk Analysis Box)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              تحليل مسار التوقيعات وسرعة التداول
            </p>
          </div>
        </div>

        {/* The Exact Text required by user prompt */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-sm md:text-base leading-relaxed font-bold">
          "المستند اطلع عليه شخصان فقط وتم طلب نشره بشكل سريع، وهذا يمثل نسبة اشتباه"
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[11px]">مؤشر المشاهدة:</span>
            <span className="font-black text-amber-800 text-sm mt-0.5 block">2 مطلعين فقط</span>
            <span className="text-[10px] text-slate-500">دون النصاب المحدد للدورات المالية</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[11px]">الموقعون:</span>
            <span className="font-black text-amber-800 text-sm mt-0.5 block">2 من أصل 4 تواقيع</span>
            <span className="text-[10px] text-slate-500">نقص توقيع المدقق الداخلي ورئيس القسم</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[11px]">توصية المنصة:</span>
            <span className="font-black text-emerald-700 text-sm mt-0.5 block">إمكانية التصحيح والنشر</span>
            <span className="text-[10px] text-slate-500">بموافقة رئيس القسم بعد التحقيق</span>
          </div>
        </div>
      </section>

      {/* 3. Below it: Evidence Dossier table showing only 2 viewers/signers */}
      <section id="yellow-evidence-dossier-table" className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-black text-slate-900">
                ملف الأدلة وقائمة المطلعين والموقعين (Evidence Dossier - Only 2 Viewers/Signers)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                حصر دقيق للشخصين الوحيدين اللذين اطلعا على المستند وحاولا رفعه للنشر
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-200 px-3 py-1 rounded-xl">
            2 أشخاص فقط مسجلين
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">اسم المستخدم</th>
                <th className="py-3 px-4">الصفة الوظيفية</th>
                <th className="py-3 px-4">الإجراء المسجل</th>
                <th className="py-3 px-4">وقت الاطلاع والتوقيع</th>
                <th className="py-3 px-4">مدة الجلسة</th>
                <th className="py-3 px-4">المعرف (IP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {viewersAndSigners.map((viewer, index) => (
                <tr key={viewer.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-slate-400">
                    0{index + 1}
                  </td>
                  <td className="py-4 px-4 font-black text-slate-900 text-sm">
                    {viewer.name}
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">
                    {viewer.role} ({viewer.department})
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                      <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                      <span>اطلع ووقّع وطلب النشر</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-600">
                    {viewer.viewedAt}
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-700">
                    {viewer.timeSpent}
                  </td>
                  <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                    {viewer.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Automated Routing Logic Box & Dept Head Action */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-black text-slate-900">
              محطة إجراءات التحقيق لرئيس القسم (Department Head Review & Resolution)
            </h3>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            مطلوب لاعتماد النشر
          </span>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 block">
            محضر جلسة استيضاح رئيس القسم وقرار الحسم:
          </label>
          <textarea
            value={investigationMeetingNote}
            onChange={(e) => setInvestigationMeetingNote(e.target.value)}
            rows={3}
            className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
          />
        </div>
      </section>

      {/* 5. Footer showing automated routing logic and amber action button */}
      <div 
        id="yellow-fixed-bottom-bar"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 p-4 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Automated Routing Box with Names */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-black text-slate-900 text-xs sm:text-sm">
                  تم تحويل الملف تلقائياً إلى: رئيس قسم المالية (د. طارق المنصور)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  كشف الأسماء مرفق آلياً
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                الأسماء التي اطلعت على المستند: <strong>سعد عبد الرحمن الخالدي</strong>، <strong>أمل مساعد المطيري</strong>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
            >
              العودة للوحة التحكم
            </button>

            {!isResolved ? (
              <button
                id="yellow-dept-head-action-btn"
                onClick={handleResolveAndPublish}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs sm:text-sm font-black shadow-md shadow-amber-600/25 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>مراجعة وحسم من قبل رئيس القسم - يمكن التصحيح والنشر</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>تم تصحيح الخلل الإجرائي واعتماد النشر الرسمي بنجاح!</span>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
