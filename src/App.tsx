import React, { useMemo, useState } from 'react';
import { ActiveScreen, DocumentDossier } from './types';
import { getDocuments } from './data/documents';
import { useLanguage } from './i18n';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { FileDossierScreen } from './components/FileDossierScreen';
import { UnifiedIndicatorsScreen } from './components/UnifiedIndicatorsScreen';
import { ExecutiveDashboardScreen } from './components/ExecutiveDashboardScreen';
import { AccessManagementScreen } from './components/AccessManagementScreen';
import { TenderRiskAssessmentScreen } from './components/TenderRiskAssessmentScreen';
import { PrePublishScanModal } from './components/PrePublishScanModal';
import { EscalationModal } from './components/EscalationModal';
import { StatementRequestModal } from './components/StatementRequestModal';
import { CheckCircle2, ShieldAlert, X } from 'lucide-react';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('executive_dashboard');
  const { lang, t } = useLanguage();
  const documents = useMemo<DocumentDossier[]>(() => getDocuments(lang), [lang]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Default selected documents:
  // Red Alert doc: #YQ-9082 (doc-1)
  // Yellow Alert doc: #YQ-7821 (doc-2)
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-1');
  const [selectedIndicatorTab, setSelectedIndicatorTab] = useState<'yellow' | 'red' | 'compliance'>('red');
  
  // Modals state
  const [isPrePublishModalOpen, setIsPrePublishModalOpen] = useState(false);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [isRedEscalated, setIsRedEscalated] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'alert' } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'alert' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const currentDocument = documents.find(d => d.id === selectedDocId) || documents[0];
  const yellowDocument = currentDocument.riskLevel === 'review'
    ? currentDocument
    : (documents.find(d => d.riskLevel === 'review') || documents[1] || documents[0]);
  const redDocument = currentDocument.riskLevel === 'blocked'
    ? currentDocument
    : (documents.find(d => d.riskLevel === 'blocked') || documents[0]);

  const blockedCount = documents.filter(d => d.riskLevel === 'blocked').length;
  const reviewCount = documents.filter(d => d.riskLevel === 'review').length;
  const safeCount = documents.filter(d => d.riskLevel === 'safe').length;

  const handleSelectDocument = (doc: DocumentDossier, targetScreen: ActiveScreen = 'file_dossier') => {
    setSelectedDocId(doc.id);
    if (doc.riskLevel === 'review') {
      setSelectedIndicatorTab('yellow');
    } else if (doc.riskLevel === 'blocked') {
      setSelectedIndicatorTab('red');
    }
    setActiveScreen(targetScreen);
  };

  const handlePublishAfterCorrection = (_docTitle: string) => {
    // إلغاء الإشعار الفوري المباشر لصالح إجراء نافذة الاعتماد النظامية التفاعلية
  };

  const handlePublishSuccess = (docTitle: string) => {
    showToast(
      t('toasts.autoApprovalTitle'),
      t('toasts.autoApprovalBody', { title: docTitle }),
      'success'
    );
  };

  const handleExportForensicReport = () => {
    showToast(
      t('toasts.forensicTitle'),
      t('toasts.forensicBody'),
      'success'
    );
  };

  const handleNavigateToIndicators = () => {
    setSelectedIndicatorTab('red');
    setActiveScreen('indicators_hub');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0E1210] text-slate-900 flex font-['IBM_Plex_Sans_Arabic',sans-serif]">
      
      {/* 1. Fixed Right Sidebar */}
      <Sidebar
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        onNavigateToIndicators={handleNavigateToIndicators}
        blockedCount={blockedCount}
        reviewCount={reviewCount}
        totalDocsCount={documents.length}
      />

      {/* 2. Main Content Wrapper shifted for Fixed Right Sidebar */}
      <div className="ms-64 lg:ms-72 flex-1 flex flex-col min-w-0">
        
        {/* Top Header - User Profile & Notifications */}
        <TopHeader
          blockedCount={blockedCount}
        />

        {/* Expansive Main Content Area */}
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          
          {/* 1. سجل المستندات (المرحلة 1: قائمة المستندات) */}
          {activeScreen === 'executive_dashboard' && (
            <ExecutiveDashboardScreen
              documents={documents}
              onSelectDocument={handleSelectDocument}
              onPublishSuccess={handlePublishSuccess}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {/* 2. معاينة الوثيقة والأثر الرقمي (تظهر عند اختيار ملف) */}
          {activeScreen === 'file_dossier' && (
            <FileDossierScreen
              document={currentDocument}
              onBackToDashboard={() => setActiveScreen('executive_dashboard')}
              onRequestPublish={() => setIsPrePublishModalOpen(true)}
              onNavigateToRiskInspection={() => {
                if (currentDocument.riskLevel === 'review') {
                  setSelectedIndicatorTab('yellow');
                } else {
                  setSelectedIndicatorTab('red');
                }
                setActiveScreen('indicators_hub');
              }}
            />
          )}

          {/* 3. مؤشرات المستندات: نظام مؤشرات الرقابة (المؤشر الأصفر والأحمر) */}
          {(activeScreen === 'indicators_hub' || activeScreen === 'yellow_risk_inspection' || activeScreen === 'red_risk_inspection') && (
            <UnifiedIndicatorsScreen
              yellowDocument={yellowDocument}
              redDocument={redDocument}
              documents={documents}
              initialIndicator={activeScreen === 'red_risk_inspection' ? 'red' : (activeScreen === 'yellow_risk_inspection' ? 'yellow' : selectedIndicatorTab)}
              onBackToDashboard={() => setActiveScreen('executive_dashboard')}
              onBackToDossier={() => setActiveScreen('file_dossier')}
              onPublishAfterCorrection={handlePublishAfterCorrection}
              onOpenEscalateModal={() => setIsEscalateModalOpen(true)}
              onOpenStatementModal={() => setIsStatementModalOpen(true)}
              onExportForensicReport={handleExportForensicReport}
              isRedEscalated={isRedEscalated}
            />
          )}

          {/* 4. إدارة الحسابات والصلاحيات */}
          {activeScreen === 'access_management' && (
            <AccessManagementScreen />
          )}

          {/* 5. تقييم مخاطر منافسة (نموذج يقظة لمخاطر المشتريات) */}
          {activeScreen === 'tender_risk_assessment' && (
            <TenderRiskAssessmentScreen />
          )}

        </main>
      </div>

      {/* Interactive Verification Modal */}
      <PrePublishScanModal
        isOpen={isPrePublishModalOpen}
        onClose={() => setIsPrePublishModalOpen(false)}
        document={redDocument}
        onProceedToRiskInspection={() => {
          setIsPrePublishModalOpen(false);
          setSelectedIndicatorTab('red');
          setActiveScreen('indicators_hub');
        }}
        onProceedToYellowInspection={() => {
          setIsPrePublishModalOpen(false);
          setSelectedIndicatorTab('yellow');
          setActiveScreen('indicators_hub');
        }}
        onPublishSuccess={handlePublishSuccess}
      />

      {/* CEO Escalation Modal */}
      <EscalationModal
        isOpen={isEscalateModalOpen}
        onClose={() => setIsEscalateModalOpen(false)}
        document={redDocument}
        onConfirmEscalate={() => {
          setIsRedEscalated(true);
        }}
      />

      {/* Statement Request Modal */}
      <StatementRequestModal
        isOpen={isStatementModalOpen}
        onClose={() => setIsStatementModalOpen(false)}
        document={redDocument}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 start-6 z-50 animate-in slide-in-from-bottom-3 duration-300">
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-4 border border-slate-700 flex items-start gap-3 max-w-md">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-start">
              <h5 className="font-bold text-xs text-white">{toastMessage.title}</h5>
              <p className="text-[11px] text-slate-300 mt-0.5">{toastMessage.desc}</p>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
