import React, { useState } from 'react';
import { X, ShieldCheck, Download, Check, UserCheck, FileCheck } from 'lucide-react';

interface ApprovedCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish?: () => void;
  documentTitle?: string;
  documentNumber?: string;
  department?: string;
}

export const ApprovedCertificateModal: React.FC<ApprovedCertificateModalProps> = ({
  isOpen,
  onClose,
  onConfirmPublish,
  documentTitle = 'ميزانية التشغيل السنوية والخطة المالية',
  documentNumber = '#DOC-2026-03',
  department = 'إدارة الموارد المالية',
}) => {
  const [isPublished, setIsPublished] = useState(false);

  if (!isOpen) return null;

  const handleConfirmPublish = () => {
    setIsPublished(true);
    if (onConfirmPublish) {
      onConfirmPublish();
    }
  };

  const handleClose = () => {
    setIsPublished(false);
    onClose();
  };

  const approvedSigners = [
    {
      id: 's-1',
      name: 'د. عبد الله السالم',
      role: 'مدير إدارة الموارد المالية (الشؤون المالية)',
      signedAt: '2026-09-18 09:15 ص',
    },
    {
      id: 's-2',
      name: 'أ. سارة المنصور',
      role: 'المستشار القانوني العام (الشؤون القانونية)',
      signedAt: '2026-09-18 11:30 ص',
    },
    {
      id: 's-3',
      name: 'م. خالد التميمي',
      role: 'رئيس قسم تقنية المعلومات والمشاريع (الإدارة العليا)',
      signedAt: '2026-09-18 02:45 م',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-xl w-full p-6 text-right space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                تصريح النشر الرسمي للمستند
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                تمت مراجعة الأثر الرقمي واستيفاء كافة التواقيع الحوكمية بنجاح، المستند مصرح بالنشر الآن.
              </p>
            </div>
          </div>

          <button 
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isPublished ? (
          <div className="space-y-4">
            
            {/* 1. بيانات المستند المعتمد المطابقة تماماً لصفحة المعتمد */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-right">
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                {documentTitle}
              </div>
              <p className="text-xs text-slate-600 font-normal">
                القسم المختص: {department}
              </p>
              <p className="text-xs text-slate-500 font-normal">
                الرمز المرجعي: <span className="font-mono font-bold text-slate-700">{documentNumber}</span>
              </p>
            </div>

            {/* 2. إشارة الجاهزية للنشر وتأكيد الامتثال (بدون أي رموز تشفير معقدة HASH) */}
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-right space-y-1">
              <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>إشارة الجاهزية للنشر: مستوفٍ لكافة المعايير ومصرح بالنشر الرسمي</span>
              </div>
              <p className="text-xs text-emerald-900/80 leading-relaxed font-normal">
                تم التحقق من اكتمال الأثر الرقمي ومطابقة المادة (12) من لائحة الحوكمة والاعتماد الرقمي، المستند جاهز للإطلاق والنشر فوراً.
              </p>
            </div>

            {/* 3. عرض ملخص التواقيع المكتملة بنفس المسميات المعتمدة في سجل الاطلاع */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                ملخص التواقيع المكتملة:
              </label>
              <div className="space-y-2">
                {approvedSigners.map((signer, idx) => (
                  <div 
                    key={signer.id}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3 text-right"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span className="font-mono text-slate-400 text-[11px]">0{idx + 1}</span>
                        <span>{signer.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-normal">
                        {signer.role}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>تم الاطلاع والتوقيع</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                        {signer.signedAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions: Cancel & Main Action Button */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              
              <button
                type="button"
                onClick={handleConfirmPublish}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#2C3E28] hover:bg-[#233220] active:scale-95 text-white shadow-md shadow-[#2C3E28]/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>تأكيد وإطلاق النشر</span>
                <Check className="w-4 h-4 text-white" />
              </button>
            </div>

          </div>
        ) : (
          /* Published Success View */
          <div className="text-center py-6 space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <FileCheck className="w-8 h-8 text-emerald-700" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-black text-slate-900">
                تم إطلاق ونشر المستند رسمياً بنجاح
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                تم إصدار تصريح النشر النهائي وتعميم المستند في السجل الرسمي للمنظومة وفق أعلى معايير الحوكمة والامتثال.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-[#2C3E28] text-white text-xs font-bold hover:bg-[#233220] transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
