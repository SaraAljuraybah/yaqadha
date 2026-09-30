import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  FileText, 
  ChevronRight, 
  ChevronLeft
} from 'lucide-react';
import { DocumentDossier } from '../types';
import { formatNodes, useLanguage } from '../i18n';

interface PdfDocumentViewerProps {
  document: DocumentDossier;
  onInspectRisk?: () => void;
}

export const PdfDocumentViewer: React.FC<PdfDocumentViewerProps> = ({
  document,
}) => {
  const { t } = useLanguage();
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
              title={t('pdfViewer.previousPage')}
            >
              <ChevronRight className="w-4 h-4 ltr:rotate-180" />
            </button>
            <span className="font-mono text-[11px]">
              {formatNodes(t('pdfViewer.pageOf'), { current: currentPage, total: totalPages })}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-slate-700 disabled:opacity-40 transition-colors"
              title={t('pdfViewer.nextPage')}
            >
              <ChevronLeft className="w-4 h-4 ltr:rotate-180" />
            </button>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 rounded p-0.5">
            <button
              onClick={() => handleZoom(-10)}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
              title={t('pdfViewer.zoomOut')}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-mono text-[11px] text-slate-300">
              {zoomLevel}%
            </span>
            <button
              onClick={() => handleZoom(10)}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
              title={t('pdfViewer.zoomIn')}
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
              {document.riskLevel === 'blocked' ? t('pdfViewer.watermarkBlocked') : (document.riskLevel === 'review' ? t('pdfViewer.watermarkReview') : t('pdfViewer.watermarkApproved'))}
            </span>
          </div>

          {/* Official Document Header */}
          <div className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-start">
            <div className="space-y-1">
              <div className="text-xs text-slate-500 font-semibold">{t('pdfViewer.country')}</div>
              <div className="text-xs text-slate-700 font-bold">{document.department}</div>
              <div className="text-xs font-mono text-slate-600 font-bold pt-1">{formatNodes(t('pdfViewer.referenceNumber'), { code: document.code })}</div>
            </div>
            
            <div className="w-14 h-14 rounded-full border-2 border-slate-800 flex items-center justify-center font-bold text-slate-800 text-xs">
              {t('pdfViewer.officialSeal')}
            </div>
          </div>

          {/* Document Title on Paper */}
          <div className="text-center my-6">
            <h2 className="text-lg md:text-xl font-black text-slate-900 mb-2">
              {document.title}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 font-medium">
              <span>{formatNodes(t('pdfViewer.number'), { code: document.code })}</span>
              <span>•</span>
              <span>{formatNodes(t('pdfViewer.createdOn'), { date: document.creationDate.split(' ')[0] })}</span>
              <span>•</span>
              <span>{formatNodes(t('pdfViewer.preparedBy'), { name: document.responsibleDeptHead.split('(')[0].trim() })}</span>
            </div>
          </div>

          {/* Document Body Clauses - Clean Read-Only Document */}
          <div className="space-y-6 text-sm leading-relaxed text-slate-800">
            
            {/* Clause 1 */}
            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1">
                {t('pdfViewer.clause1Title')}
              </h3>
              <p className="text-justify text-xs md:text-sm text-slate-700 leading-6">
                {t('pdfViewer.clause1Body')}
              </p>
            </section>

            {/* Clause 2: Clean Read-Only */}
            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1">
                {t('pdfViewer.clause2Title')}
              </h3>
              <p className="text-justify text-xs md:text-sm text-slate-700 leading-6">
                {t('pdfViewer.clause2Body')}
              </p>
            </section>

            {/* Clause 3: Clean Read-Only */}
            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1">
                {t('pdfViewer.clause3Title')}
              </h3>
              <p className="text-justify text-xs md:text-sm text-slate-700 leading-6">
                {t('pdfViewer.clause3Body')}
              </p>
            </section>

          </div>

          {/* Document Footer Bar */}
          <div className="mt-12 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>{t('pdfViewer.footerHash')}</span>
            <span>{formatNodes(t('pdfViewer.footerPage'), { current: currentPage, total: totalPages })}</span>
            <span>{t('pdfViewer.footerConfidential')}</span>
          </div>

        </div>
      </div>

    </div>
  );
};
