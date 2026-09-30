import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  X, 
  User, 
  Clock, 
  Send,
  AlertCircle
} from 'lucide-react';
import { DocumentDossier } from '../types';

interface StatementRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentDossier;
}

export const StatementRequestModal: React.FC<StatementRequestModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  const [isSent, setIsSent] = useState(false);
  const [questions] = useState([
    'بيان أسباب ومبررات توقيع كراسة الشروط والمواصفات (#DOC-2026-01) منفرداً دون استيفاء مصفوفة التواقيع الإلزامية.',
    'توضيح السند الإداري في تخطي توقيع الإدارة القانونية والإدارة المالية قبل طلب اعتماد ونشر المستند.',
    'الإفصاح عن المبرر الإجرائي لطلب نشر المستند خارج تسلسل الاعتماد المعتمد في لائحة الحوكمة.'
  ]);

  if (!isOpen) return null;

  const handleSendRequest = () => {
    setIsSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-xl w-full p-6 text-right space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                طلب إفادة رسمية
              </h3>
              <p className="text-xs text-slate-500">
                وفقاً لسياسة الحوكمة والامتثال الداخلي وقواعد التحقيق الإداري
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSent ? (
          <div className="space-y-4">
            
            {/* Recipient info */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-slate-500">الموظف المطلوب للإفادة:</span>
                <strong className="text-slate-900">أحمد خالد (مدير إدارة تقنية المعلومات)</strong>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">Emp #1042</span>
            </div>

            {/* Questions to answer */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                الأسئلة ومحاور الاستفسار الواجب الإجابة عليها كتابيًا:
              </label>
              <div className="space-y-2">
                {questions.map((q, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deadline selection */}
            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-red-50/70 border border-red-200 text-red-900">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                <span className="font-bold">المهلة النظامية للرد وتقديم الإفادة:</span>
              </div>
              <div className="flex items-center gap-2 font-bold">
                <span>يوم عمل واحد</span>
                <span className="text-[10px] text-red-700">(تنتهي غداً 05:40 ص)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                إلغاء
              </button>
              
              <button
                onClick={handleSendRequest}
                className="px-5 py-2.5 rounded-xl bg-[#2C3E28] hover:bg-[#233220] text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-white" />
                <span>إرسال طلب الإفادة</span>
              </button>
            </div>

          </div>
        ) : (
          /* Success State */
          <div className="text-center py-6 space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-black text-slate-900">
                تم إرسال طلب الإفادة الرسمية وإشعار الموظف
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                تم تجميد صلاحيات التعديل على المنظومة وتوجيه خطاب الاستيضاح إلى البريد الإلكتروني الرسمي وبوابة الموظف، مع ربط مهلة الرد بملف التدقيق الجنائي.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#2C3E28] hover:bg-[#233220] text-white text-xs font-bold transition-colors cursor-pointer"
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
