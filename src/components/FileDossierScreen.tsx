import React from 'react';
import { DocumentDossier } from '../types';
import { PdfDocumentViewer } from './PdfDocumentViewer';
import { DigitalFootprintPanel } from './DigitalFootprintPanel';
import { ArrowRight } from 'lucide-react';

interface FileDossierScreenProps {
  document: DocumentDossier;
  onRequestPublish: () => void;
  onNavigateToRiskInspection: () => void;
  onBackToDashboard?: () => void;
}

export const FileDossierScreen: React.FC<FileDossierScreenProps> = ({
  document,
  onRequestPublish,
  onNavigateToRiskInspection,
  onBackToDashboard,
}) => {
  return (
    <div id="file-dossier-screen" className="space-y-4">
      
      {/* Dossier Screen Header with Back to Files Button and exact metadata match */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-4 md:p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-snug">
              {document.title}
            </h1>

            {/* Unified 4 metadata items in thin regular gray font without contrast */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-normal mt-2">
              <div className="flex items-center gap-1">
                <span className="text-slate-500 font-normal">الرقم المرجعي:</span>
                <span className="text-slate-500 font-normal">{document.code}</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-500 font-normal">الإدارة المسؤولة:</span>
                <span className="text-slate-500 font-normal">{document.department}</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-500 font-normal">المسؤول/المُعد:</span>
                <span className="text-slate-500 font-normal">{document.responsibleDeptHead.split('(')[0].trim()}</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-500 font-normal">تاريخ الإنشاء:</span>
                <span className="text-slate-500 font-normal">{document.creationDate.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          {/* Status Badge + Return Button together on the left in the exact same line */}
          <div className="shrink-0 flex items-center gap-2.5 self-start md:self-center">
            {document.riskLevel === 'blocked' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-red-900 border border-red-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                <span>محظور (توقيع منفرد)</span>
              </span>
            )}
            {document.riskLevel === 'review' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>قيد المراجعة (نقص في التواقيع)</span>
              </span>
            )}
            {document.riskLevel === 'safe' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>معتمد وجاهز للتنفيذ</span>
              </span>
            )}

            {onBackToDashboard && (
              <button
                id="back-to-files-list-btn"
                onClick={onBackToDashboard}
                className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#2C3E28] text-[#2C3E28] hover:text-white border border-[#2C3E28]/40 hover:border-[#2C3E28] shadow-2xs hover:shadow-md transition-all duration-200 font-bold text-xs shrink-0 cursor-pointer"
                title="العودة إلى سجل المستندات"
              >
                <ArrowRight className="w-4 h-4 text-[#2C3E28] group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" />
                <span>العودة لسجل المستندات</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Area Displays PDF Preview, Right Sidebar Displays Clean Digital Footprint */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-215px)] min-h-[620px]">
        
        {/* Left Area (approx 7.5 cols): PDF Document Preview */}
        <div className="lg:col-span-7 xl:col-span-8 h-full">
          <PdfDocumentViewer 
            document={document} 
            onInspectRisk={onNavigateToRiskInspection} 
          />
        </div>

        {/* Right Sidebar (approx 4.5 cols): Clean Digital Footprint Panel */}
        <div className="lg:col-span-5 xl:col-span-4 h-full">
          <DigitalFootprintPanel 
            document={document} 
            onOpenAuditReport={onNavigateToRiskInspection}
          />
        </div>

      </div>

    </div>
  );
};
