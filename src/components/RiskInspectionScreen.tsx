import React, { useState } from 'react';
import { 
  Lock, 
  ShieldAlert, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Fingerprint, 
  Clock, 
  Download, 
  AlertOctagon, 
  Users, 
  Ban,
  UserX,
  X,
  ShieldX
} from 'lucide-react';
import { DocumentDossier, FlaggedEvidence } from '../types';

interface RiskInspectionScreenProps {
  document: DocumentDossier;
  onBackToDashboard: () => void;
  onBackToDossier: () => void;
  onOpenEscalateModal: () => void;
  onOpenStatementModal: () => void;
  onExportForensicReport: () => void;
}

export const RiskInspectionScreen: React.FC<RiskInspectionScreenProps> = ({
  document,
  onBackToDashboard,
  onBackToDossier,
  onOpenEscalateModal,
  onOpenStatementModal,
  onExportForensicReport,
}) => {
  const [showInvolvedPersonsModal, setShowInvolvedPersonsModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<FlaggedEvidence | null>(
    document.evidences[0] || null
  );

  const gov = document.governance;

  // Single user action for the Red Risk condition as explicitly requested
  const singleInvolvedUser = {
    name: 'فهد إبراهيم السبيعي',
    role: 'أخصائي مناقصات وتوريد',
    department: 'إدارة المشتريات والعقود',
    action: 'اطلع ووافق فوراً مع توقيع منفرد (تسريع غير معقول)',
    timestamp: 'اليوم 05:42:19 ص',
    ipAddress: '192.168.10.45 (VPN مشفر مجهول)',
    violations: [
      'توقيع منفرد وتخطي 3 مستويات رقابية إلزامية',
      'تعديل الملحق المالي بعد إقفال الميزانية',
      'تعارض مصالح صريح بموجب المادة (16) مع المورد المتنافس'
    ]
  };

  return (
    <div id="red-risk-inspection-screen" className="space-y-6 pb-28 text-right">
      
      {/* 1. Dominant Top Banner in Soft Crimson Red (#FEF2F2) with Critical Lock Icon & Exact Arabic Title */}
      <section 
        id="critical-red-top-banner"
        className="rounded-3xl bg-[#FEF2F2] border-2 border-red-300 p-6 md:p-8 shadow-xs text-red-950 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-start gap-4">
            {/* Critical Lock Icon */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-600/30 ring-4 ring-red-100">
              <Lock className="w-8 h-8 md:w-9 md:h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full bg-red-700 text-white tracking-wide">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>المؤشر الأحمر (خطر - فساد مؤكد)</span>
                </span>
                <span className="text-xs font-mono font-bold text-red-800 bg-red-100 px-2.5 py-0.5 rounded-md border border-red-300">
                  كود الوثيقة: {document.code}
                </span>
                <span className="text-xs font-bold text-red-800 bg-white/80 px-2.5 py-0.5 rounded-full border border-red-200">
                  محظور نهائياً ومجمد
                </span>
              </div>

              {/* Exact Arabic Title as mandated */}
              <h1 className="text-2xl md:text-3xl font-black text-red-950 tracking-tight">
                تم تجميد وحظر الملف نهائياً - فساد مؤكد (المؤشر الأحمر)
              </h1>

              <p className="text-xs md:text-sm text-red-900 leading-relaxed max-w-3xl font-medium">
                تم تفعيل الحظر الجنائي الصارم وتجميد الوثيقة بقوة النظام لمنع محاولة النشر أو التوثيق. تم رصد تسريع غير منطقي، وتوقيع منفرد تخطى كافة دورات المراجعة الداخلية والمالية. الملف محال رسمياً لمكتب رئيس المنظومة وهيئة مكافحة الفساد.
              </p>
            </div>
          </div>

          {/* Quick Permanent Freeze Badge */}
          <div className="shrink-0 flex flex-col gap-1.5 bg-white/90 p-4 rounded-2xl border border-red-200 text-xs">
            <span className="text-[11px] font-black text-red-800 block">الحالة النظامية:</span>
            <span className="text-sm font-black text-red-950 flex items-center gap-1.5">
              <Ban className="w-4 h-4 text-red-600" />
              <span>محظور من النشر نهائياً</span>
            </span>
            <span className="text-[10px] text-red-700 font-mono">
              PERMANENTLY BLOCKED • NO OVERRIDE
            </span>
          </div>

        </div>
      </section>

      {/* 2. Middle Section: AI Risk Analysis Box */}
      <section id="red-ai-analysis-box" className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 md:p-7 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-black text-slate-900">
              تقرير الفحص الاستباقي والذكاء الاصطناعي (AI Risk Analysis Box)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              محرك يقظة للرقابة الجنائية وتحليل الشبهات
            </p>
          </div>
        </div>

        {/* The Exact Text required by user prompt */}
        <div className="p-4 rounded-2xl bg-red-50/90 border border-red-300 text-red-950 text-sm md:text-base leading-relaxed font-black">
          "شخص واحد فقط اطلع عليه ووافق فوراً مع توقيع واحد - تسريع غير معقول"
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3.5 rounded-2xl bg-red-50/50 border border-red-200">
            <span className="text-red-700 block text-[11px] font-bold">تسريع غير منطقي:</span>
            <span className="font-black text-red-950 text-sm mt-0.5 block">دقيقتان و 7 ثوانٍ فقط</span>
            <span className="text-[10px] text-red-800 font-medium">من لحظة فتح الملف إلى طلب النشر الرسمي</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-red-50/50 border border-red-200">
            <span className="text-red-700 block text-[11px] font-bold">التواقيع المنفردة:</span>
            <span className="font-black text-red-950 text-sm mt-0.5 block">1 توقيع (غياب تام للرؤساء)</span>
            <span className="text-[10px] text-red-800 font-medium">تخطي متعمد للمدير المالي والمستشار القانوني</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-red-50/50 border border-red-200">
            <span className="text-red-700 block text-[11px] font-bold">قرار المنصة الآلي:</span>
            <span className="font-black text-red-950 text-sm mt-0.5 block">حظر وتجميد أبدي</span>
            <span className="text-[10px] text-red-800 font-medium">لا يمكن إعادة نشره أو توثيقه مستقبلاً</span>
          </div>
        </div>
      </section>

      {/* 3. Evidence Dossier table showing single user action with red badges and timestamp */}
      <section id="red-evidence-dossier-table" className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <Fingerprint className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-black text-slate-900">
                ملف الأدلة الرقمية الجنائية (Evidence Dossier Table - Single User Action)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                رصد دقيق لإجراءات المستخدم المنفرد بالبصمات والأختام الزمنية
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-red-800 bg-red-100 border border-red-200 px-3 py-1 rounded-xl">
            مستخدم منفرد واحد
          </span>
        </div>

        {/* Evidence Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
                <th className="py-3.5 px-4">اسم المستخدم</th>
                <th className="py-3.5 px-4">الصفة الوظيفية</th>
                <th className="py-3.5 px-4">الإجراء المرصود</th>
                <th className="py-3.5 px-4">التوقيت الدقيق (Timestamp)</th>
                <th className="py-3.5 px-4">مؤشر الخطورة</th>
                <th className="py-3.5 px-4">عنوان المعرف (IP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-red-50/20 hover:bg-red-50/40 transition-colors">
                
                {/* User Name */}
                <td className="py-4 px-4 font-black text-slate-900 text-sm whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <UserX className="w-4 h-4 text-red-600" />
                    <span>{singleInvolvedUser.name}</span>
                  </div>
                </td>

                {/* Role */}
                <td className="py-4 px-4 text-slate-600 font-medium whitespace-nowrap">
                  {singleInvolvedUser.role} ({singleInvolvedUser.department})
                </td>

                {/* Action with Red Badges as requested */}
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-lg bg-red-600 text-white shadow-2xs">
                      <span>{singleInvolvedUser.action}</span>
                    </span>
                    <div className="text-[10px] text-red-700 font-bold flex items-center gap-1">
                      <span>⚠️ تخطي المستشار القانوني والمدير المالي عمداً</span>
                    </div>
                  </div>
                </td>

                {/* Timestamp with Red Badge as requested */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 font-mono text-xs font-black px-2.5 py-1 rounded-md bg-red-700 text-white">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{singleInvolvedUser.timestamp}</span>
                  </span>
                </td>

                {/* Risk Score */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="font-mono font-black text-xs text-red-700 bg-red-100 border border-red-300 px-2 py-0.5 rounded">
                    94% حرج
                  </span>
                </td>

                {/* IP */}
                <td className="py-4 px-4 font-mono text-xs text-red-800 font-bold whitespace-nowrap">
                  {singleInvolvedUser.ipAddress}
                </td>

              </tr>
            </tbody>
          </table>
        </div>

        {/* Detailed Action Timeline for Single User */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs space-y-2">
          <span className="font-bold text-slate-700 block">سلسلة الأحداث المرصودة للمستخدم المنفرد:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-400 font-mono block">05:40:12 ص</span>
              <strong className="text-slate-900">فتح الوثيقة عبر VPN مجهول</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-400 font-mono block">05:41:03 ص</span>
              <strong className="text-red-700">تعديل ملحق الأسعار (خفض 18.4%)</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-red-200 bg-red-50/50">
              <span className="text-slate-400 font-mono block">05:42:19 ص</span>
              <strong className="text-red-800">توقيع منفرد وطلب النشر الفوري</strong>
            </div>
          </div>
        </div>

      </section>

      {/* 4. Bottom Fixed Bar exactly as specified:
          - logic text: "لا يمكن إعادة نشره أو توثيقه أبداً"
          - primary deep red button: "تصعيد فوري لرئيس المنظومة"
          - secondary button: "عرض الأسماء المتورطة"
      */}
      <div 
        id="red-fixed-bottom-bar"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-slate-300 p-4 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logic Text: "لا يمكن إعادة نشره أو توثيقه أبداً" */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <Ban className="w-5 h-5 text-red-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-red-950 text-sm sm:text-base">
                  لا يمكن إعادة نشره أو توثيقه أبداً
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-700 text-white">
                  حظر نهائي قطعي
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                قرار إلكتروني غير قابل للإلغاء صادر عن خوارزمية النزاهة الاستباقية لمنظومة يقظة
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            <button
              onClick={onBackToDashboard}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
            >
              لوحة التحكم
            </button>

            {/* Secondary Button: "عرض الأسماء المتورطة" */}
            <button
              id="view-involved-names-btn"
              onClick={() => setShowInvolvedPersonsModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Users className="w-4 h-4 text-slate-700" />
              <span>عرض الأسماء المتورطة</span>
            </button>

            {/* Primary Deep Red Button: "تصعيد فوري لرئيس المنظومة" */}
            <button
              id="escalate-to-ceo-btn"
              onClick={onOpenEscalateModal}
              className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 active:scale-95 text-white text-xs sm:text-sm font-black shadow-lg shadow-red-700/25 flex items-center gap-2 transition-all ring-2 ring-red-300"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>تصعيد فوري لرئيس المنظومة</span>
            </button>

          </div>

        </div>
      </div>

      {/* Modal: عرض الأسماء المتورطة */}
      {showInvolvedPersonsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 text-right space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                  <UserX className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    كشف الأسماء المتورطة المرفوع لرئيس المنظومة
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    الوثيقة: {document.code}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowInvolvedPersonsModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-black text-slate-900 text-sm">{singleInvolvedUser.name}</h4>
                  <span className="text-xs text-slate-600 block">{singleInvolvedUser.role} • {singleInvolvedUser.department}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-700 text-white">
                  المشتبه به الرئيسي
                </span>
              </div>

              <div className="pt-2 border-t border-red-100 text-xs space-y-1.5 text-slate-700">
                <div className="font-bold text-red-950">المخالفات المثبتة بالأدلة الرقمية:</div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-red-900">
                  {singleInvolvedUser.violations.map((violation, i) => (
                    <li key={i}>{violation}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-red-100 text-[11px] font-mono text-slate-600">
                عنوان الاتصال: {singleInvolvedUser.ipAddress} • وقت التنفيذ: {singleInvolvedUser.timestamp}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowInvolvedPersonsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
