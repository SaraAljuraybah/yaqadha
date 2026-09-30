import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  FileText, 
  ChevronRight, 
  ChevronLeft
} from 'lucide-react';
import { DocumentDossier } from '../types';

interface PdfDocumentViewerProps {
  document: DocumentDossier;
  onInspectRisk?: () => void;
}

export const PdfDocumentViewer: React.FC<PdfDocumentViewerProps> = ({
  document,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 14;

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(150, Math.max(75, prev + delta)));
  };

  return (
    <div id="pdf-viewer-container" className="flex flex-col h-full bg-slate-200/70 rounded-2xl border border-slate-300/80 overflow-hidden shadow-sm">
      
      {/* PDF Action Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 text-slate-200 text-xs border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 text-slate-300 font-mono text-[11px]">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>{document.code.replace('#', '').toLowerCase()}-specifications.pdf</span>
          </div>

          <span className="hidden sm:inline text-slate-500">|</span>

          {/* Page Navigation */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-slate-700 disabled:opacity-40 transition-colors"
              title="الصفحة السابقة"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px]">
              صفحة {currentPage} من {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-slate-700 disabled:opacity-40 transition-colors"
              title="الصفحة التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 rounded p-0.5">
            <button
              onClick={() => handleZoom(-10)}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
              title="تصغير"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-mono text-[11px] text-slate-300">
              {zoomLevel}%
            </span>
            <button
              onClick={() => handleZoom(10)}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
              title="تكبير"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* PDF Document Canvas / Preview Surface */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start bg-slate-300/60 custom-scrollbar">
        <div 
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="w-full max-w-2xl bg-white rounded-lg shadow-xl border border-slate-300 text-slate-800 p-8 md:p-12 relative select-text transition-transform duration-150"
        >
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
            <span className={`font-black text-5xl md:text-7xl rotate-[-30deg] tracking-widest uppercase opacity-10 ${
              document.riskLevel === 'blocked' ? 'text-red-700' : (document.riskLevel === 'review' ? 'text-amber-700' : 'text-emerald-700')
            }`}>
              {document.riskLevel === 'blocked' ? 'وثيقة محظورة' : (document.riskLevel === 'review' ? 'مسودة تدقيق' : 'معتمد رسمياً')}
            </span>
          </div>

          {/* Official Document Header */}
          <div className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-start">
            <div className="space-y-1">
              <div className="text-xs text-slate-500 font-semibold">المملكة العربية السعودية</div>
              <div className="text-xs text-slate-700 font-bold">{document.department}</div>
              <div className="text-xs font-mono text-slate-600 font-bold pt-1">الرقم المرجعي: {document.code}</div>
            </div>
            
            <div className="w-14 h-14 rounded-full border-2 border-slate-800 flex items-center justify-center font-bold text-slate-800 text-xs">
              شعار رسمي
            </div>
          </div>

          {/* Document Title on Paper */}
          <div className="text-center my-6">
            <h2 className="text-lg md:text-xl font-black text-slate-900 mb-2">
              {document.title}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 font-medium">
              <span>الرقم: {document.code}</span>
              <span>•</span>
              <span>تاريخ الإنشاء: {document.creationDate.split(' ')[0]}</span>
              <span>•</span>
              <span>المُعد: {document.responsibleDeptHead.split('(')[0].trim()}</span>
            </div>
          </div>

          {/* Document Body Clauses - Clean Read-Only Document */}
          <div className="space-y-6 text-sm leading-relaxed text-slate-800">
            
            {/* Clause 1 */}
            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1">
                المادة الأولى: النطاق العام للمشروع
              </h3>
              <p className="text-justify text-xs md:text-sm text-slate-700 leading-6">
                يهدف هذا المشروع إلى تأمين حلول رقمية وبنية سحابية سيادية متكاملة، وفق أعلى معايير الأمن السيبراني المعتمدة لدى الهيئة الوطنية للأمن السيبراني، مع التزام المقاول بتقديم خطة صيانة وضمان تشغيل مستمر لمدة 36 شهراً.
              </p>
            </section>

            {/* Clause 2: Clean Read-Only */}
            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1">
                المادة الرابعة: معايير التأهيل الفني والخبرة المسبقة
              </h3>
              <p className="text-justify text-xs md:text-sm text-slate-700 leading-6">
                يشترط للشركات المتقدمة أن تمتلك سابقة أعمال في تنفيذ مشاريع مماثلة لا تقل عن (7) سبع سنوات، مع تقديم شهادات التصنيف المعتمدة وشهادة ISO-27001 سارية المفعول لكافة المنشآت المتقدمة.
              </p>
            </section>

            {/* Clause 3: Clean Read-Only */}
            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1">
                المادة السادسة: الملحق المالي والتسعير التقديري للبند (4-2)
              </h3>
              <p className="text-justify text-xs md:text-sm text-slate-700 leading-6">
                حددت الموازنة التقديرية لوحدات المعالجة السحابية بمبلغ 48,500,000 ر.س، شاملة الصيانة الفنية والتراخيص السنوية وفق جداول الكميات المعتمدة.
              </p>
            </section>

          </div>

          {/* Document Footer Bar */}
          <div className="mt-12 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>البصمة المشفرة: SHA-256: 8f43...aa4</span>
            <span>نظام يقظة للرقابة الاستباقية • صفحة {currentPage} من {totalPages}</span>
            <span>سري للغاية وغير مصرح بالتداول الخارجي</span>
          </div>

        </div>
      </div>

    </div>
  );
};
