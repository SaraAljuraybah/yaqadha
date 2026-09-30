import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Lock, 
  ArrowLeft,
  Loader2,
  FileSearch,
  Scale,
  Users,
  Check,
  ShieldCheck
} from 'lucide-react';
import { DocumentDossier } from '../types';

interface PrePublishScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentDossier;
  onProceedToRiskInspection: () => void;
  onProceedToYellowInspection?: () => void;
  onPublishSuccess?: (docTitle: string) => void;
}

export const PrePublishScanModal: React.FC<PrePublishScanModalProps> = ({
  isOpen,
  onClose,
  document,
  onProceedToRiskInspection,
  onProceedToYellowInspection,
  onPublishSuccess,
}) => {
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      const timer1 = setTimeout(() => setStep(1), 500);
      const timer2 = setTimeout(() => setStep(2), 1000);
      const timer3 = setTimeout(() => setStep(3), 1500);
      const timer4 = setTimeout(() => setStep(4), 2000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const gov = document.governance;
  const isSafe = document.riskLevel === 'safe';
  const isReview = document.riskLevel === 'review';
  const isBlocked = document.riskLevel === 'blocked';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 text-right space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
              isBlocked ? 'bg-red-100 text-red-700' : isReview ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                التحقق التلقائي الإلزامي من مسار التوقيعات للنشر
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                الوثيقة رقم {document.code} • {document.title}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Checks based on User Requirements */}
        <div className="space-y-3 py-1 text-xs">
          
          {/* 1. كم مرة مر على شخص */}
          <div className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
            step >= 1 ? 'bg-slate-50 border-slate-200' : 'opacity-40 border-slate-100'
          }`}>
            <div>
              <span className="font-bold text-slate-800 block">
                1. فحص دورة التداول (كم مرة مر على شخص)
              </span>
              <span className="text-[11px] text-slate-500">
                المسجل بالنظام: {gov.passCount} مرات تداول
              </span>
            </div>
            {step >= 1 ? (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                gov.passCount <= 3 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {gov.passCount <= 3 ? '⚠️ تداول محدود' : '✅ دورة مكتملة'}
              </span>
            ) : (
              <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
            )}
          </div>

          {/* 2. من اطلع عليه */}
          <div className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
            step >= 2 ? 'bg-slate-50 border-slate-200' : 'opacity-40 border-slate-100'
          }`}>
            <div>
              <span className="font-bold text-slate-800 block">
                2. حصر قائمة وسجل (من اطلع عليه)
              </span>
              <span className="text-[11px] text-slate-500">
                المسجل: {gov.viewersCount} أشخاص
              </span>
            </div>
            {step >= 2 ? (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                gov.viewersCount <= 1 ? 'bg-red-100 text-red-800' : gov.viewersCount <= 2 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {gov.viewersCount <= 1 ? '🔴 شخص واحد فقط (مريب)' : gov.viewersCount <= 2 ? '🟡 شخصان فقط (اشتباه)' : '🟢 مستوفٍ للأطراف المعنية'}
              </span>
            ) : (
              step === 1 ? <Loader2 className="w-4 h-4 text-slate-400 animate-spin" /> : null
            )}
          </div>

          {/* 3. كم شخص وقع عليه وتوقيع الرؤساء الكبار */}
          <div className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
            step >= 3 ? 'bg-slate-50 border-slate-200' : 'opacity-40 border-slate-100'
          }`}>
            <div>
              <span className="font-bold text-slate-800 block">
                3. فحص عدد الموقعين وتوقيع الرؤساء الكبار
              </span>
              <span className="text-[11px] text-slate-500">
                {gov.signaturesCount} من أصل {gov.requiredSignaturesCount} تواقيع
              </span>
            </div>
            {step >= 3 ? (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                gov.hasSeniorExecutiveSignature && gov.signaturesCount === gov.requiredSignaturesCount
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {gov.hasSeniorExecutiveSignature && gov.signaturesCount === gov.requiredSignaturesCount
                  ? '✅ توقيع كبار الرؤساء معتمد'
                  : '⚠️ نقص توقيع الرؤساء المعتمدين'}
              </span>
            ) : (
              step === 2 ? <Loader2 className="w-4 h-4 text-slate-400 animate-spin" /> : null
            )}
          </div>

          {/* 4. ترتيب التواقيع */}
          <div className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
            step >= 4 ? 'bg-slate-50 border-slate-200' : 'opacity-40 border-slate-100'
          }`}>
            <div>
              <span className="font-bold text-slate-800 block">
                4. مطابقة تسلسل وترتيب التواقيع الإلزامية
              </span>
              <span className="text-[11px] text-slate-500">
                فحص قفز الصلاحيات وتخطي المستويات الرقابية
              </span>
            </div>
            {step >= 4 ? (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                gov.isSequenceCompliant ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {gov.isSequenceCompliant ? '✅ تسلسل منضبط' : '🛑 تم القفز والتخطي'}
              </span>
            ) : (
              step === 3 ? <Loader2 className="w-4 h-4 text-slate-400 animate-spin" /> : null
            )}
          </div>

        </div>

        {/* Dynamic Result based on 3-Indicator System */}
        {step >= 4 && (
          <div className="animate-in fade-in slide-in-from-top-2">
            
            {/* Safe 🟢 */}
            {isSafe && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
                  <h4 className="font-black text-sm">
                    المؤشر الأخضر: الموافقة التلقائية للنشر ممنوحة فوراً
                  </h4>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  {gov.approvalDecisionText}
                </p>
              </div>
            )}

            {/* Review 🟡 */}
            {isReview && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 stroke-[2.5]" />
                  <h4 className="font-black text-sm">
                    المؤشر الأصفر: اشتباه وخلل إجرائي - محال لرئيس القسم للتحقيق
                  </h4>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  اطلع عليه شخصان فقط وطلب نشره، تم تقييد كل من اطلع ووقع، وتوجيه المستند لرئيس قسم {document.department} ومكتبه لعقد اجتماع استيضاح ولا يمكن النشر إلا بعد تصحيح الأخطاء.
                </p>
              </div>
            )}

            {/* Blocked 🔴 */}
            {isBlocked && (
              <div className="p-4 rounded-2xl bg-red-600 text-white space-y-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 stroke-[2.5]" />
                  <h4 className="font-black text-sm">
                    المؤشر الأحمر: خطر فساد وتسريع غير منطقي - مصعد لرئيس المنظومة وحظر أبدي
                  </h4>
                </div>
                <p className="text-xs text-red-100 leading-relaxed">
                  اطلع عليه شخص واحد فقط ووقع عليه منفرداً وتم رصد تعديل مشبوه. تم رفع كشف الأسماء فوراً لرئيس المنظومة وهيئة مكافحة الفساد، ويمنع منعاً باتاً نشر أو توثيق هذا المستند مستقبلاً.
                </p>
              </div>
            )}

          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            إغلاق
          </button>
          
          {isSafe && step >= 4 && (
            <button
              onClick={() => {
                if (onPublishSuccess) onPublishSuccess(document.title);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>إتمام النشر والتوثيق الرسمي (بموافقة المنصة)</span>
            </button>
          )}

          {isReview && step >= 4 && (
            <button
              onClick={() => {
                onClose();
                if (onProceedToYellowInspection) onProceedToYellowInspection();
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-700/20 transition-all flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>مراجعة ملف رئيس القسم وكشف الأسماء</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          {isBlocked && (
            <button
              disabled={step < 4}
              onClick={() => {
                onClose();
                onProceedToRiskInspection();
              }}
              className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-red-700/20 transition-all flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>عرض ملف تصعيد رئيس المنظومة ومحضر الحظر</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
