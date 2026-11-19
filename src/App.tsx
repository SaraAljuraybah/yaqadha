import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActiveScreen, DocumentDossier } from './types';
import { DemoNotification, getDocuments, getRegisterDocuments } from './data/demo';
import { useLanguage } from './i18n';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DemoBanner } from './components/DemoBanner';
import { PlaceholderScreen } from './components/PlaceholderScreen';
import { FileDossierScreen } from './components/FileDossierScreen';
import { UnifiedIndicatorsScreen } from './components/UnifiedIndicatorsScreen';
import { ExecutiveDashboardScreen } from './components/ExecutiveDashboardScreen';
import { AccessManagementScreen } from './components/AccessManagementScreen';
import { TenderRiskAssessmentScreen } from './components/TenderRiskAssessmentScreen';
import { PrePublishScanModal } from './components/PrePublishScanModal';
import { EscalationModal } from './components/EscalationModal';
import { StatementRequestModal } from './components/StatementRequestModal';
import { CheckCircle2, ShieldAlert, X } from 'lucide-react';

const DEMO_MODE_KEY = 'yaqadha_demo_mode';

const readDemoMode = (): boolean => {
  try {
    return localStorage.getItem(DEMO_MODE_KEY) !== 'off';
  } catch {
    return true;
  }
};

type ToastType = 'success' | 'alert';
interface ToastState {
  title: string;
  desc: string;
  type: ToastType;
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('executive_dashboard');
  const { lang, t } = useLanguage();
  const documents = useMemo<DocumentDossier[]>(() => getDocuments(lang), [lang]);
  const [searchQuery, setSearchQuery] = useState('');

  // Detailed dossiers: doc-1 = DOC-2026-01 (suspended), doc-2 = YQ-8841 (review), doc-3 = BG-2026 (approved)
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-1');
  const [selectedIndicatorTab, setSelectedIndicatorTab] = useState<'yellow' | 'red' | 'compliance'>('red');

  // Shell state
  const [demoMode, setDemoMode] = useState<boolean>(readDemoMode);

  // Modals state
  const [isPrePublishModalOpen, setIsPrePublishModalOpen] = useState(false);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [isRedEscalated, setIsRedEscalated] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<ToastState | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const showToast = useCallback((toast: ToastState, durationMs = 4500) => {
    window.clearTimeout(toastTimer.current);
    setToastMessage(toast);
    toastTimer.current = window.setTimeout(() => setToastMessage(null), durationMs);
  }, []);

  const currentDocument = documents.find(d => d.id === selectedDocId) || documents[0];
  const yellowDocument = currentDocument.riskLevel === 'review'
    ? currentDocument
    : (documents.find(d => d.riskLevel === 'review') || documents[1] || documents[0]);
  const redDocument = currentDocument.riskLevel === 'blocked'
    ? currentDocument
    : (documents.find(d => d.riskLevel === 'blocked') || documents[0]);

  const handleSelectDocument = (doc: DocumentDossier, targetScreen: ActiveScreen = 'file_dossier') => {
    setSelectedDocId(doc.id);
    if (doc.riskLevel === 'review') {
      setSelectedIndicatorTab('yellow');
    } else if (doc.riskLevel === 'blocked') {
      setSelectedIndicatorTab('red');
    }
    setActiveScreen(targetScreen);
  };

  const navigate = useCallback((screen: ActiveScreen) => {
    if (screen === 'indicators_hub') {
      setSelectedDocId('doc-1');
      setSelectedIndicatorTab('red');
    }
    setActiveScreen(screen);
    window.scrollTo({ top: 0 });
  }, []);

  /**
   * Opens a document by its code, routed by status:
   * suspended → case page, under review / pending approval → approval requests, approved → document page.
   */
  const openDocumentByCode = useCallback((code: string) => {
    const doc = getRegisterDocuments(lang).find((d) => d.code === code);
    if (!doc) return;
    if (doc.status === 'suspended') {
      setSelectedDocId(doc.dossierId ?? 'doc-1');
      setSelectedIndicatorTab('red');
      setActiveScreen('indicators_hub');
    } else if (doc.status === 'under_review' || doc.status === 'pending_approval') {
      if (doc.dossierId) setSelectedDocId(doc.dossierId);
      setActiveScreen('approval_requests');
    } else if (doc.dossierId) {
      setSelectedDocId(doc.dossierId);
      setActiveScreen('file_dossier');
    } else {
      setActiveScreen('executive_dashboard');
    }
    window.scrollTo({ top: 0 });
  }, [lang]);

  const handleOpenNotification = useCallback((notification: DemoNotification) => {
    openDocumentByCode(notification.code);
  }, [openDocumentByCode]);

  // Demo mode (only hides/shows the banner; the data stays the same)
  const toggleDemoMode = () => {
    setDemoMode((on) => {
      const next = !on;
      try {
        localStorage.setItem(DEMO_MODE_KEY, next ? 'on' : 'off');
      } catch {
        // Storage unavailable: the choice still applies for this session
      }
      return next;
    });
  };

  const handlePublishAfterCorrection = (_docTitle: string) => {
    // إلغاء الإشعار الفوري المباشر لصالح إجراء نافذة الاعتماد النظامية التفاعلية
  };

  const handlePublishSuccess = (docTitle: string) => {
    showToast({ title: t('toasts.autoApprovalTitle'), desc: t('toasts.autoApprovalBody', { title: docTitle }), type: 'success' });
  };

  const handleExportForensicReport = () => {
    showToast({ title: t('toasts.forensicTitle'), desc: t('toasts.forensicBody'), type: 'success' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0E1210] text-slate-900 flex font-['IBM_Plex_Sans_Arabic',sans-serif]">

      {/* Fixed sidebar (start side) */}
      <Sidebar activeScreen={activeScreen} onNavigate={navigate} />

      {/* Main content shifted for the fixed sidebar */}
      <div className="ms-64 lg:ms-72 flex-1 flex flex-col min-w-0">

        <TopHeader
          demoMode={demoMode}
          onToggleDemoMode={toggleDemoMode}
          onOpenNotification={handleOpenNotification}
          onViewAllNotifications={() => navigate('overview')}
        />

        {demoMode && <DemoBanner />}

        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

          {/* نظرة عامة — built in stage 2 */}
          {activeScreen === 'overview' && <PlaceholderScreen title={t('sidebar.overview')} stage={2} />}

          {/* سجل المستندات */}
          {activeScreen === 'executive_dashboard' && (
            <ExecutiveDashboardScreen
              documents={documents}
              onSelectDocument={handleSelectDocument}
              onPublishSuccess={handlePublishSuccess}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {/* معاينة الوثيقة والأثر الرقمي */}
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

          {/* مؤشرات المستندات */}
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

          {/* طلبات الاعتماد — built in stage 5 */}
          {activeScreen === 'approval_requests' && <PlaceholderScreen title={t('sidebar.approvals')} stage={5} />}

          {/* إدارة الحسابات والصلاحيات */}
          {activeScreen === 'access_management' && <AccessManagementScreen />}

          {/* تقييم مخاطر منافسة */}
          {activeScreen === 'tender_risk_assessment' && <TenderRiskAssessmentScreen />}

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

      {/* Escalation approval modal */}
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
        <div className="fixed bottom-6 start-6 z-50 animate-in slide-in-from-bottom-3 duration-300" role="status" aria-live="polite">
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-4 border border-slate-700 flex items-start gap-3 max-w-md">
            {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {toastMessage.type === 'alert' && <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
            <div className="flex-1 text-start">
              <h5 className="font-bold text-xs text-white">{toastMessage.title}</h5>
              <p className="text-[11px] text-slate-300 mt-0.5">{toastMessage.desc}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label={t('common.close')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
