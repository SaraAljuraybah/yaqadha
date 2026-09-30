import React from 'react';
import { 
  ShieldAlert, 
  Fingerprint,
  ArrowLeft
} from 'lucide-react';
import { DocumentDossier } from '../types';
import { formatNodes, useLanguage } from '../i18n';

interface DigitalFootprintPanelProps {
  document: DocumentDossier;
  onOpenAuditReport: () => void;
}

export const DigitalFootprintPanel: React.FC<DigitalFootprintPanelProps> = ({
  document,
  onOpenAuditReport,
}) => {
  const { t } = useLanguage();

  // Render all audit logs for the document
  const topAuditLogs = document.auditLogs;

  // Derive signature path from the document's real steps
  const signaturePathItems = document.signatureSteps && document.signatureSteps.length > 0
    ? document.signatureSteps.map((step) => {
        const initials = step.officerName
          .replace(/^(أ\.|د\.|م\.|Mr\.|Ms\.|Dr\.|Eng\.)\s*/, '')
          .split(' ')
          .filter(Boolean)
          .map(w => w[0])
          .slice(0, 2)
          .join('');

        const isSigned = step.status === 'signed';
        const isBypassed = step.status === 'bypassed' || step.status === 'skipped';

        let badgeText = t('footprint.badgePending');
        let badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';

        if (isSigned) {
          badgeText = t('footprint.badgeSigned');
          badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        } else if (isBypassed) {
          badgeText = t('footprint.badgeBypassed');
          badgeColor = 'bg-red-50 text-red-700 border-red-200';
        }

        return {
          name: step.officerName,
          role: step.roleTitle,
          initials: initials || t('footprint.initialsFallback'),
          status: step.status,
          badgeText,
          badgeColor,
        };
      })
    : [];

  return (
    <aside 
      id="digital-footprint-panel" 
      className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden text-start"
    >
      
      {/* 1. Header without warning icon */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-slate-700" />
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
            {t('footprint.title')}
          </h3>
        </div>
        <span className="font-mono text-[11px] text-slate-400">
          {document.code}
        </span>
      </div>

      {/* Main Body - Only Signature Path and Activity Tracking Log */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 custom-scrollbar">
        
        {/* 1. Signature Path: Dynamic rows with unified neutral avatars */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span>{t('footprint.signaturePath')}</span>
            <span className="text-[10px] font-mono text-slate-400">
              {formatNodes(t('footprint.signaturesOf'), { signed: document.governance.signaturesCount, required: document.governance.requiredSignaturesCount })}
            </span>
          </div>

          <div className="space-y-2">
            {signaturePathItems.map((item, idx) => (
              <div 
                key={idx}
                className="px-3 py-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between text-xs transition-colors hover:bg-slate-50"
              >
                {/* Unified Avatar + Name */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {item.initials}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-xs leading-tight">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {item.role}
                    </div>
                  </div>
                </div>

                {/* Small Status Badge */}
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                  {item.badgeText}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Document Access & Activity Trail */}
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-bold text-slate-600">
            <span>{t('common.accessLog')}</span>
          </div>

          <div className="border border-slate-100 rounded-xl overflow-hidden text-start">
            <table className="w-full text-xs">
              <tbody className="divide-y divide-slate-100">
                {topAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-800 text-[11px]">{log.user}</div>
                      <div className="text-[10px] text-slate-400">{log.role}</div>
                    </td>
                    <td className="py-2.5 px-2 text-[10px] text-slate-600">
                      {log.action.toLowerCase().includes(t('footprint.signatureKeyword')) ? (
                        <span className="text-emerald-700 font-medium">{t('footprint.actionSignature')}</span>
                      ) : (
                        <span className="text-slate-600">{t('footprint.actionView')}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400 text-end">
                      {log.timestamp.replace(t('footprint.todayPrefix'), '')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Primary Action Button at Bottom */}
      <div className="p-4 border-t border-slate-100 bg-white">
        {document.riskLevel === 'blocked' ? (
          <button
            id="open-pre-publish-risk-btn"
            onClick={onOpenAuditReport}
            className="w-full py-2.5 px-4 rounded-xl bg-red-700 hover:bg-red-800 active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-sm shadow-red-700/20 transition-all flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{t('footprint.openBlockedReport')}</span>
            <ArrowLeft className="w-3.5 h-3.5 ltr:rotate-180" />
          </button>
        ) : document.riskLevel === 'review' ? (
          <button
            id="open-pre-publish-risk-btn"
            onClick={onOpenAuditReport}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-sm shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{t('footprint.openReviewReport')}</span>
            <ArrowLeft className="w-3.5 h-3.5 ltr:rotate-180" />
          </button>
        ) : (
          <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
            <span>{t('footprint.approvedComplete')}</span>
          </div>
        )}
      </div>

    </aside>
  );
};
