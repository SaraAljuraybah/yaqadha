import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileCheck, 
  Send, 
  FileText,
  Users
} from 'lucide-react';

interface ReviewApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
  documentNumber?: string;
  department?: string;
  onConfirmApproval?: () => void;
}

export const ReviewApprovalModal: React.FC<ReviewApprovalModalProps> = ({
  isOpen,
  onClose,
  documentTitle = 'عقد توريد أجهزة ومعدات شبكات',
  documentNumber = '#YQ-8841',
  department = 'قسم المالية والميزانية',
  onConfirmApproval,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [approvalNotes, setApprovalNotes] = useState(
    'يرجى استيفاء التواقيع الإدارية الناقصة ومطابقة جداول التوريد المرفقة وإعادة المحضر للاعتماد النهائي.'
  );
  const [isSignaturesConfirmed, setIsSignaturesConfirmed] = useState(true);

  const [targetParties, setTargetParties] = useState({
    invoicesSpecialist: true,
    paymentsAccountant: true,
  });

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsSubmitted(true);
    if (onConfirmApproval) {
      onConfirmApproval();
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setUploadedFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-xl w-full p-6 text-right space-y-5">
        
        {/* Header - In-Progress Warm Neutral/Amber Theme */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <Send className="w-4.5 h-4.5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                توجيه إحالة لاستيفاء التواقيع والتصحيح
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                إرسال التوجيه والملاحظات للموظفين والأطراف المعنية لاستكمال التواقيع وإرفاق المحضر
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

        {!isSubmitted ? (
          <div className="space-y-4">
            
            {/* 1. بيانات المستند - مدمجة وبدون أي مربعات أو خلفيات زائدة للرمز */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-right">
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                {documentTitle}
              </div>
              <p className="text-xs text-slate-600 font-normal">
                الجهة المعنية: {department}
              </p>
              <p className="text-xs text-slate-500 font-normal">
                الرمز المرجعي: <span className="font-mono font-bold text-slate-700">{documentNumber}</span>
              </p>
            </div>

            {/* 2. خانة تحديد الأطراف والموظفين المعنيين بالتوقيع - حصراً المسميات المذكورة في سجل الاطلاع */}
            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                <Users className="w-3.5 h-3.5 text-amber-700" />
                <span>الأطراف والموظفون المعنيون بالتوقيع:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 text-xs font-medium cursor-pointer transition-colors select-none">
                  <input
                    type="checkbox"
                    checked={targetParties.invoicesSpecialist}
                    onChange={(e) => setTargetParties({ ...targetParties, invoicesSpecialist: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">أخصائي مطابقة فواتير</span>
                    <span className="text-[11px] text-slate-500 font-normal">سعد عبد الرحمن الخالدي</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 text-xs font-medium cursor-pointer transition-colors select-none">
                  <input
                    type="checkbox"
                    checked={targetParties.paymentsAccountant}
                    onChange={(e) => setTargetParties({ ...targetParties, paymentsAccountant: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">محاسب مدفوعات</span>
                    <span className="text-[11px] text-slate-500 font-normal">أمل مساعد المطيري</span>
                  </div>
                </label>
              </div>
            </div>

            {/* 3. خانة إرفاق محضر التصحيح والملاحظات (PDF) */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                إرفاق محضر التصحيح والملاحظات (PDF):
              </label>
              <div 
                onClick={() => setUploadedFile('محضر_استيفاء_التواقيع_والتدقيق_المالي_YQ8841.pdf')}
                className={`border-2 border-dashed rounded-xl p-3.5 transition-all text-center cursor-pointer select-none group ${
                  uploadedFile 
                    ? 'border-amber-400 bg-amber-50/40' 
                    : 'border-slate-200 hover:border-amber-400 bg-slate-50/70 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shadow-2xs ${
                    uploadedFile 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-white border border-slate-200 text-slate-600 group-hover:text-amber-700 group-hover:border-amber-300'
                  }`}>
                    {uploadedFile ? <FileCheck className="w-4 h-4 text-amber-700" /> : <UploadCloud className="w-4 h-4" />}
                  </div>
                  {uploadedFile ? (
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 flex items-center justify-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-amber-700" />
                        <span>{uploadedFile}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">حجم الملف: 1.4 MB • جاهز للإرفاق مع أمر الإحالة</p>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-700">
                        انقر لرفع محضر الملاحظات أو اسحب الملف هنا
                      </p>
                      <p className="text-[11px] text-slate-400">
                        صيغة PDF فقط • الحد الأقصى 10 ميجابايت
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4. ملاحظات وتوجيه رئيس قسم المالية والميزانية */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                توجيه وملاحظات رئيس قسم المالية والميزانية:
              </label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                placeholder="اكتب التوجيه والملاحظات الواجب استيفاؤها..."
              />
            </div>

            {/* 5. تأكيد التوجيه والإلزام */}
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-colors text-xs font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isSignaturesConfirmed}
                onChange={(e) => setIsSignaturesConfirmed(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
              />
              <span className="font-bold text-slate-800">
                تأكيد توجيه الإحالة وتكليف الأطراف المعنية باستكمال التواقيع وفق لائحة الحوكمة
              </span>
            </label>

            {/* Actions Buttons - The only green #2C3E28 element */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              
              <button
                type="button"
                disabled={!isSignaturesConfirmed || (!targetParties.invoicesSpecialist && !targetParties.paymentsAccountant)}
                onClick={handleConfirm}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer ${
                  isSignaturesConfirmed && (targetParties.invoicesSpecialist || targetParties.paymentsAccountant)
                    ? 'bg-[#2C3E28] hover:bg-[#233220] active:scale-95 text-white shadow-[#2C3E28]/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Send className="w-4 h-4 text-white" />
                <span>إرسال توجيه الاستيفاء والتوقيع</span>
              </button>
            </div>

          </div>
        ) : (
          /* Success State - In-Progress Referral Theme */
          <div className="text-center py-6 space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto ring-8 ring-amber-50">
              <Send className="w-8 h-8 text-amber-700" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-black text-slate-900">
                تم إرسال توجيه الاستيفاء والتوقيع بنجاح
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                تم إشعار الأطراف والموظفين المعنيين بتوجيه رئيس القسم لاستكمال التواقيع ومتابعة إرفاق المحضر إلكترونياً.
              </p>
              <div className="font-mono text-xs font-bold bg-slate-100 text-slate-800 py-1.5 px-3 rounded-lg inline-block mt-2">
                REF: REV-2026-8841-DISPATCH
              </div>
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
