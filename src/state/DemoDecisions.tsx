import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CaseOutcome, Delegation, DemoDecisions, INITIAL_DELEGATIONS, RequestOutcome, deriveStats, resolvedCodes } from '../data/demo';

// Decisions taken during this session (in memory only — a reload resets the demo).

/** A note added to the DOC-2026-01 case file. System notes are rendered from the dictionary so they follow the language. */
export interface CaseNote {
  id: string;
  kind: 'user' | 'lifted' | 'escalated' | 'statement';
  text?: string;
  reason?: string;
  /** Time label captured when the note was saved */
  time: string;
}

interface DemoDecisionsValue {
  decisions: DemoDecisions;
  stats: ReturnType<typeof deriveStats>;
  /** Codes whose pending decision has been taken (hidden from the bell and the overview list) */
  resolved: string[];
  caseNotes: CaseNote[];
  /** Comments recorded with the approval-request decisions */
  requestComments: { urgent?: string; exception?: string };
  decideCase: (outcome: CaseOutcome, note: Omit<CaseNote, 'id' | 'time' | 'kind'>) => void;
  addCaseNote: (note: Omit<CaseNote, 'id' | 'time'>) => void;
  decideRequest: (request: 'urgent' | 'exception', outcome: RequestOutcome, comment: string) => void;
  delegations: Delegation[];
  addDelegation: (delegation: Omit<Delegation, 'id'>) => void;
  cancelDelegation: (id: string) => void;
}

const DemoDecisionsContext = createContext<DemoDecisionsValue | null>(null);

/** Time label for something saved now, e.g. "10:42 ص" / "10:42 AM". */
const nowLabel = () => {
  const lang = document.documentElement.lang === 'en' ? 'en-US' : 'ar-u-nu-latn';
  return new Date().toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
};

export const DemoDecisionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [decisions, setDecisions] = useState<DemoDecisions>({});
  const [caseNotes, setCaseNotes] = useState<CaseNote[]>([]);
  const [requestComments, setRequestComments] = useState<{ urgent?: string; exception?: string }>({});
  const [delegations, setDelegations] = useState<Delegation[]>(INITIAL_DELEGATIONS);

  const addDelegation = useCallback((delegation: Omit<Delegation, 'id'>) => {
    setDelegations((prev) => [...prev, { ...delegation, id: `del-session-${prev.length + 1}` }]);
  }, []);

  const cancelDelegation = useCallback((id: string) => {
    setDelegations((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const addCaseNote = useCallback((note: Omit<CaseNote, 'id' | 'time'>) => {
    setCaseNotes((prev) => [...prev, { ...note, id: `case-note-${prev.length + 1}`, time: nowLabel() }]);
  }, []);

  const decideCase = useCallback(
    (outcome: CaseOutcome, note: Omit<CaseNote, 'id' | 'time' | 'kind'>) => {
      setDecisions((prev) => (prev.case ? prev : { ...prev, case: outcome }));
      addCaseNote({ kind: outcome, ...note });
    },
    [addCaseNote]
  );

  const decideRequest = useCallback((request: 'urgent' | 'exception', outcome: RequestOutcome, comment: string) => {
    setDecisions((prev) => (prev[request] ? prev : { ...prev, [request]: outcome }));
    setRequestComments((prev) => ({ ...prev, [request]: comment }));
  }, []);

  const value = useMemo<DemoDecisionsValue>(
    () => ({
      decisions,
      stats: deriveStats(decisions),
      resolved: resolvedCodes(decisions),
      caseNotes,
      requestComments,
      decideCase,
      addCaseNote,
      decideRequest,
      delegations,
      addDelegation,
      cancelDelegation,
    }),
    [decisions, caseNotes, requestComments, decideCase, addCaseNote, decideRequest, delegations, addDelegation, cancelDelegation]
  );

  return <DemoDecisionsContext.Provider value={value}>{children}</DemoDecisionsContext.Provider>;
};

export const useDemoDecisions = (): DemoDecisionsValue => {
  const context = useContext(DemoDecisionsContext);
  if (!context) throw new Error('useDemoDecisions must be used inside <DemoDecisionsProvider>');
  return context;
};
