import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActiveScreen, DocumentDossier } from './types';
import { CASE_FILE, DemoNotification, getDocuments, getRegisterDocuments } from './data/demo';
import { useLanguage } from './i18n';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DemoBanner } from './components/DemoBanner';
import { PlaceholderScreen } from './components/PlaceholderScreen';
import { OverviewScreen } from './components/OverviewScreen';
import { FileDossierScreen } from './components/FileDossierScreen';
import { CaseDecision, CaseScreen, SessionNote } from './components/CaseScreen';
import { ExecutiveDashboardScreen } from './components/ExecutiveDashboardScreen';
import { AccessManagementScreen } from './components/AccessManagementScreen';
import { TenderRiskAssessmentScreen } from './components/TenderRiskAssessmentScreen';
import { PrePublishScanModal } from './components/PrePublishScanModal';
import { EscalationModal } from './components/EscalationModal';
import { StatementRequestModal } from './components/StatementRequestModal';
import { LiftSuspensionModal } from './components/LiftSuspensionModal';
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

/** Time label for a note saved now, e.g. "10:42 ص" / "10:42 AM". */
const nowLabel = (lang: 'ar' | 'en') =>
  new Date().toLocaleTimeString(lang === 'ar' ? 'ar-u-nu-latn' : 'en-US', { hour: '2-digit', minute: '2-digit' });

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('overview');
  const { lang, t } = useLanguage();
  const documents = useMemo<DocumentDossier[]>(() => getDocuments(lang), [lang]);

  // Dossier shown on the document page (doc-3 = BG-2026, doc-4 = CL-0915 are the approved ones)
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-3');

  // Shell state
  const [demoMode, setDemoMode] = useState<boolean>(readDemoMode);

  // Case (DOC-2026-01) state: the human decision and the append-only notes added this session
  const [caseDecision, setCaseDecision] = useState<CaseDecision>('pending');
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([]);

  // Modals state
  const [isPrePublishModalOpen, setIsPrePublishModalOpen] = useState(false);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [isLiftModalOpen, setIsLiftModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<ToastState | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const showToast = useCallback((toast: ToastState, durationMs = 4500) => {
    window.clearTimeout(toastTimer.current);
    setToastMessage(toast);
    toastTimer.current = window.setTimeout(() => setToastMessage(null), durationMs);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const currentDocument = documents.find((d) => d.id === selectedDocId) || documents[0];
  const caseDocument = documents.find((d) => d.id === CASE_FILE.dossierId) || documents[0];

  const navigate = useCallback((screen: ActiveScreen) => {
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
      setActiveScreen('indicators_hub');
    } else if (doc.status === 'under_review' || doc.status === 'pending_approval') {
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

  const addCaseNote = (note: Omit<SessionNote, 'id' | 'time'>) =>
    setSessionNotes((prev) => [...prev, { ...note, id: `session-note-${prev.length + 1}`, time: nowLabel(lang) }]);

  const handlePublishSuccess = (docTitle: string) => {
    showToast({ title: t('toasts.autoApprovalTitle'), desc: t('toasts.autoApprovalBody', { title: docTitle }), type: 'success' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0E1210] text-slate-900 flex font-['IBM_Plex_Sans_Arabic',sans-serif]">

      {/* Fixed sidebar (start side) */}
      <div className="print:hidden">
        <Sidebar activeScreen={activeScreen} onNavigate={navigate} />
      </div>

      {/* Main content shifted for the fixed sidebar */}
      <div className="ms-64 lg:ms-72 print:ms-0 flex-1 flex flex-col min-w-0">

        <div className="print:hidden sticky top-0 z-30">
          <TopHeader
            demoMode={demoMode}
            onToggleDemoMode={toggleDemoMode}
            onOpenNotification={handleOpenNotification}
            onViewAllNotifications={() => navigate('overview')}
          />
        </div>

        {demoMode && (
          <div className="print:hidden">
            <DemoBanner />
          </div>
        )}

        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

          {/* نظرة عامة (default page) */}
          {activeScreen === 'overview' && <OverviewScreen onOpenDocument={openDocumentByCode} />}

          {/* سجل المستندات */}
          {activeScreen === 'executive_dashboard' && (
            <ExecutiveDashboardScreen onOpenDocument={openDocumentByCode} />
          )}

          {/* صفحة المستند (approved documents) */}
          {activeScreen === 'file_dossier' && (
            <FileDossierScreen
              document={currentDocument}
              onBackToDashboard={() => navigate('executive_dashboard')}
              onRequestPublish={() => setIsPrePublishModalOpen(true)}
              onNavigateToRiskInspection={() =>
                navigate(currentDocument.riskLevel === 'blocked' ? 'indicators_hub' : 'approval_requests')
              }
            />
          )}

          {/* مؤشرات المستندات: case page of the precautionary suspension */}
          {activeScreen === 'indicators_hub' && (
            <CaseScreen
              document={caseDocument}
              decision={caseDecision}
              sessionNotes={sessionNotes}
              onAddNote={(text) => addCaseNote({ kind: 'user', text })}
              onRequestStatement={() => setIsStatementModalOpen(true)}
              onLiftSuspension={() => setIsLiftModalOpen(true)}
              onApproveEscalation={() => setIsEscalateModalOpen(true)}
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

      {/* Pre-publish verification for the document being viewed */}
      <PrePublishScanModal
        isOpen={isPrePublishModalOpen}
        onClose={() => setIsPrePublishModalOpen(false)}
        document={currentDocument}
        onProceedToRiskInspection={() => {
          setIsPrePublishModalOpen(false);
          navigate('indicators_hub');
        }}
        onProceedToYellowInspection={() => {
          setIsPrePublishModalOpen(false);
          navigate('approval_requests');
        }}
        onPublishSuccess={handlePublishSuccess}
      />

      {/* Case decisions */}
      <EscalationModal
        isOpen={isEscalateModalOpen}
        onClose={() => setIsEscalateModalOpen(false)}
        document={caseDocument}
        onConfirmEscalate={() => {
          setCaseDecision('escalated');
          addCaseNote({ kind: 'escalated' });
        }}
      />

      <StatementRequestModal
        isOpen={isStatementModalOpen}
        onClose={() => setIsStatementModalOpen(false)}
        document={caseDocument}
        onSent={() => addCaseNote({ kind: 'statement' })}
      />

      <LiftSuspensionModal
        isOpen={isLiftModalOpen}
        onClose={() => setIsLiftModalOpen(false)}
        onConfirm={(reason) => {
          setIsLiftModalOpen(false);
          setCaseDecision('lifted');
          addCaseNote({ kind: 'lifted', reason });
        }}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 start-6 z-50 animate-in slide-in-from-bottom-3 duration-300 print:hidden" role="status" aria-live="polite">
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
