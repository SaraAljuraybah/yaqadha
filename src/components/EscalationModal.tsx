import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  Building, 
  Scale, 
  FileText, 
  Lock, 
  Send,
  Download
} from 'lucide-react';
import { DocumentDossier } from '../types';
import { useLanguage } from '../i18n';

interface EscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentDossier;
  onConfirmEscalate?: () => void;
}

export const EscalationModal: React.FC<EscalationModalProps> = ({
  isOpen,
  onClose,
  document,
  onConfirmEscalate,
}) => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState<'high' | 'critical'>('critical');
  const [escalationTarget, setEscalationTarget] = useState({
    legalDept: true,
    nazaha: true,
    internalAudit: true,
  });
  // null = untouched, so the default notes follow the current language
  const [auditorNotesDraft, setAuditorNotes] = useState<string | null>(null);
  const auditorNotes = auditorNotesDraft ?? t('modals.escalation.defaultNotes');

  if (!isOpen) return null;

  const handleEscalate = () => {
    setIsSubmitted(true);
    if (onConfirmEscalate) {
      onConfirmEscalate();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-xl w-full p-6 text-start space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                {t('modals.escalation.title')}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {t('modals.escalation.code')}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSubmitted ? (
          <div className="space-y-4">
            
            {/* Target Entities */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                {t('modals.escalation.targetsLabel')}
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={escalationTarget.legalDept}
                    onChange={(e) => setEscalationTarget({ ...escalationTarget, legalDept: e.target.checked })}
                    className="rounded text-[#2C3E28] focus:ring-[#2C3E28] w-4 h-4"
                  />
                  <span>{t('modals.escalation.targetLegal')}</span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={escalationTarget.nazaha}
                    onChange={(e) => setEscalationTarget({ ...escalationTarget, nazaha: e.target.checked })}
                    className="rounded text-[#2C3E28] focus:ring-[#2C3E28] w-4 h-4"
                  />
                  <span>{t('modals.escalation.targetNazaha')}</span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={escalationTarget.internalAudit}
                    onChange={(e) => setEscalationTarget({ ...escalationTarget, internalAudit: e.target.checked })}
                    className="rounded text-[#2C3E28] focus:ring-[#2C3E28] w-4 h-4"
                  />
                  <span>{t('modals.escalation.targetInternalAudit')}</span>
                </label>
              </div>
            </div>

            {/* Auditor Notes */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t('modals.escalation.notesLabel')}
              </label>
              <textarea
                value={auditorNotes}
                onChange={(e) => setAuditorNotes(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2C3E28]"
              />
            </div>

            {/* Evidence attachment note */}
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>{t('modals.escalation.attachment')}</span>
              </div>
              <span className="font-mono text-slate-800 font-bold">SHA-256 SEALED</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              
              <button
                onClick={handleEscalate}
                className="px-5 py-2.5 rounded-xl bg-[#2C3E28] hover:bg-[#233220] text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-white" />
                <span>{t('modals.escalation.confirm')}</span>
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
                {t('modals.escalation.successTitle')}
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {t('modals.escalation.successBody')}
              </p>
              <div className="font-mono text-xs font-bold bg-slate-100 text-slate-800 py-1.5 px-3 rounded-lg inline-block mt-2">
                REF: NZH-2026-9082-CRIM-019
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#2C3E28] text-white text-xs font-bold hover:bg-[#233220] transition-colors cursor-pointer"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
