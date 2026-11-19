import React, { useEffect, useState } from 'react';
import { Unlock, X } from 'lucide-react';
import { useLanguage } from '../i18n';

interface LiftSuspensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Confirms the decision with the written reason (recorded in the case notes) */
  onConfirm: (reason: string) => void;
}

/** Human decision to lift a precautionary suspension; a written reason is mandatory. */
export const LiftSuspensionModal: React.FC<LiftSuspensionModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useLanguage();
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) setReason('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lift-suspension-title"
        className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-lg w-full p-6 text-start space-y-5"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl border bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center justify-center">
              <Unlock className="w-4 h-4" />
            </span>
            <h3 id="lift-suspension-title" className="font-bold text-slate-900 text-base">
              {t('casePage.liftModalTitle')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">{t('casePage.liftModalBody')}</p>

        <div className="space-y-2">
          <label htmlFor="lift-suspension-reason" className="block text-xs font-bold text-slate-700">
            {t('casePage.liftReasonLabel')}
          </label>
          <textarea
            id="lift-suspension-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder={t('casePage.liftReasonPlaceholder')}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2C3E28] resize-y"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            id="btn-confirm-lift-suspension"
            disabled={!reason.trim()}
            onClick={() => onConfirm(reason.trim())}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#2C3E28] hover:bg-[#233220] text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Unlock className="w-4 h-4" />
            {t('casePage.liftConfirm')}
          </button>
        </div>
      </div>
    </div>
  );
};
