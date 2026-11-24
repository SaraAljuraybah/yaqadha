import React, { useEffect, useState } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { DocumentDossier, RiskEvaluationResult, SignatureStep } from '../types';
import { TranslationKey, useLanguage } from '../i18n';
import { CASE_FILE, CASE_VIOLATIONS, CURRENT_USER, CaseOutcome, CaseTimelineEvent, legalRef } from '../data/demo';
import './caseReport.css';

// Printed case file for DOC-2026-01 ("تصدير ملف القضية PDF").
// A dedicated print layout (not a print of the screen): it is rendered next to the app root, hidden on
// screen, and replaces the whole app when printing (see caseReport.css). Always light, A4, branded.

/** Default file name offered by "Save as PDF" (browsers use the document title). */
export const caseReportFileName = (code: string) => `Yaqadha_Case_${code}`;

/** Status label of an approval stage (shared with the case screen). */
export const stageStatusKey = (step: SignatureStep): TranslationKey =>
  step.status === 'signed'
    ? 'casePage.stageCompleted'
    : step.status === 'bypassed' || step.status === 'skipped'
    ? 'casePage.stageBypassed'
    : 'common.publishRequested';

const stageTone = (step: SignatureStep) =>
  step.status === 'signed' ? 'cr-ok' : step.status === 'bypassed' || step.status === 'skipped' ? 'cr-bad' : 'cr-warn';

const RATING: Record<NonNullable<RiskEvaluationResult['risk_color']>, { label: TranslationKey; tone: string }> = {
  Green: { label: 'riskAssessment.colorGreen', tone: 'cr-ok' },
  Yellow: { label: 'riskAssessment.colorYellow', tone: 'cr-warn' },
  Red: { label: 'riskAssessment.colorRed', tone: 'cr-bad' },
};

export interface CaseReportNote {
  id: string;
  author: string;
  time: string;
  text: string;
}

interface CaseReportProps {
  document: DocumentDossier;
  title: string;
  department: string;
  statusLabel: string;
  decision: CaseOutcome | 'pending';
  timeline: CaseTimelineEvent[];
  notes: CaseReportNote[];
  /** Latest AI risk result from the case page, if one was run this session */
  riskResult: RiskEvaluationResult | null;
  /** The case page's "Critical Override" note for a non-red score, if it applies */
  overrideText: string | null;
}

/** A CSS string literal (for @page margin-box content). */
const cssString = (s: string) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/[\r\n]+/g, ' ')}"`;

/** Margin-box content for a template with {page}/{pages} placeholders, isolated in the page direction. */
const pageCounterContent = (template: string, rtl: boolean) => {
  const parts = template
    .split(/(\{page\}|\{pages\})/)
    .filter(Boolean)
    .map((p) => (p === '{page}' ? 'counter(page)' : p === '{pages}' ? 'counter(pages)' : cssString(p)));
  return [cssString(rtl ? '\u2067' : '\u2066'), ...parts, cssString('\u2069')].join(' ');
};
const isolated = (text: string, rtl: boolean) => cssString(`${rtl ? '\u2067' : '\u2066'}${text}\u2069`);

export const CaseReport: React.FC<CaseReportProps> = ({
  document,
  title,
  department,
  statusLabel,
  decision,
  timeline,
  notes,
  riskResult,
  overrideText,
}) => {
  const { lang, t } = useLanguage();
  const rtl = lang === 'ar';
  const [exportedAt, setExportedAt] = useState(() => new Date());

  // Any print of the case page (the export button or Ctrl+P): stamp the export time and offer the file name
  useEffect(() => {
    let previousTitle: string | null = null;
    const before = () => {
      flushSync(() => setExportedAt(new Date()));
      previousTitle = window.document.title;
      window.document.title = caseReportFileName(CASE_FILE.code);
    };
    const after = () => {
      if (previousTitle !== null) window.document.title = previousTitle;
      previousTitle = null;
    };
    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);
    return () => {
      window.removeEventListener('beforeprint', before);
      window.removeEventListener('afterprint', after);
      after();
    };
  }, []);

  const exportedAtLabel = new Intl.DateTimeFormat(rtl ? 'ar-u-nu-latn' : 'en-GB', { dateStyle: 'long', timeStyle: 'short' }).format(exportedAt);
  const modelVersion = riskResult ? t('riskAssessment.modelVersion', { version: riskResult.model_version }) : null;
  const scored = riskResult && riskResult.risk_score !== null && riskResult.risk_color !== null && riskResult.assessment_status === 'completed';
  const rating = scored && riskResult.risk_color ? RATING[riskResult.risk_color] : undefined;
  const factors = riskResult?.top_factors ?? [];

  // Page box: A4, footer on every page (page X of Y · confidential · model version), start side = page number
  const font = rtl ? "'IBM Plex Sans Arabic', sans-serif" : "'IBM Plex Sans', 'IBM Plex Sans Arabic', sans-serif";
  const box = `font-family: ${font}; font-size: 8pt; color: #5B6660;`;
  const [startBox, endBox] = rtl ? ['@bottom-right', '@bottom-left'] : ['@bottom-left', '@bottom-right'];
  const pageCss = `
@page {
  size: A4;
  margin: 14mm 14mm 16mm 14mm;
  ${startBox} { content: ${pageCounterContent(t('caseReport.footerPage'), rtl)}; ${box} }
  @bottom-center { content: ${isolated(t('caseReport.footerConfidential'), rtl)}; ${box} font-weight: 700; color: #2C3E28; }
  ${endBox} { content: ${modelVersion ? isolated(modelVersion, rtl) : '""'}; ${box} }
}`;

  const decisionText =
    decision === 'lifted'
      ? `${t('casePage.decisionLiftedTitle')}. ${t('casePage.decisionLiftedBody')}`
      : decision === 'escalated'
      ? `${t('casePage.decisionEscalatedTitle')}. ${t('casePage.decisionEscalatedBody')}`
      : t('caseReport.decisionPending');
  const statusTone = decision === 'lifted' ? 'cr-ok' : 'cr-bad';

  return createPortal(
    <div className="case-report" dir={rtl ? 'rtl' : 'ltr'} lang={lang} aria-hidden="true">
      <style>{pageCss}</style>
      <table className="cr-layout">
        {/* Running header, repeated at the top of every printed page */}
        <thead>
          <tr>
            <td>
              <div className="cr-running-header">
                <img src="/yaqadha-logo.svg" alt={t('caseReport.logoAlt')} className="cr-logo" />
                <span className="cr-running-text">{t('caseReport.runningHeader', { code: CASE_FILE.code })}</span>
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {/* Title block (first page) */}
              <header className="cr-title-block">
                <div className="cr-report-title">{t('caseReport.reportTitle')}</div>
                <h1 className="cr-doc-title">{title}</h1>
                <p className="cr-muted">
                  <bdi className="cr-mono">#{CASE_FILE.code}</bdi> · {department}
                </p>
              </header>

              {/* 1. Case details */}
              <section className="cr-section cr-keep">
                <h2 className="cr-h2">{t('caseReport.infoTitle')}</h2>
                <dl className="cr-info">
                  <div>
                    <dt>{t('caseReport.documentNumber')}</dt>
                    <dd>
                      <bdi className="cr-mono">{CASE_FILE.code}</bdi>
                    </dd>
                  </div>
                  <div>
                    <dt>{t('caseReport.caseStatus')}</dt>
                    <dd className={`cr-strong ${statusTone}`}>{statusLabel}</dd>
                  </div>
                  <div className="cr-info-wide">
                    <dt>{t('caseReport.documentTitle')}</dt>
                    <dd>{title}</dd>
                  </div>
                  <div>
                    <dt>{t('caseReport.department')}</dt>
                    <dd>{department}</dd>
                  </div>
                  <div>
                    <dt>{t('caseReport.exportedAt')}</dt>
                    <dd>{exportedAtLabel}</dd>
                  </div>
                  <div className="cr-info-wide">
                    <dt>{t('caseReport.exportedBy')}</dt>
                    <dd>
                      {CURRENT_USER.name[lang]} · {CURRENT_USER.role[lang]} · {CURRENT_USER.department[lang]}
                    </dd>
                  </div>
                </dl>
              </section>

              {/* 2. Approval chain */}
              <section className="cr-section cr-keep">
                <h2 className="cr-h2">{t('casePage.chainTitle')}</h2>
                <p className="cr-muted cr-sub">{t('casePage.chainSubtitle')}</p>
                <table className="cr-table">
                  <thead>
                    <tr>
                      <th className="cr-col-num">{t('caseReport.colNumber')}</th>
                      <th>{t('caseReport.colStage')}</th>
                      <th>{t('caseReport.colOfficer')}</th>
                      <th>{t('caseReport.colStatus')}</th>
                      <th>{t('caseReport.colSignedAt')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {document.signatureSteps.map((step) => (
                      <tr key={step.step}>
                        <td className="cr-col-num">{step.step}</td>
                        <td className="cr-strong">{step.roleTitle}</td>
                        <td>{step.officerName}</td>
                        <td className={`cr-strong ${stageTone(step)}`}>{t(stageStatusKey(step))}</td>
                        <td>{step.signedAt ? <bdi className="cr-mono">{step.signedAt}</bdi> : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="cr-callout cr-callout-bad">{t('casePage.chainNote')}</p>
              </section>

              {/* 3. Violations and legal basis */}
              <section className="cr-section cr-keep">
                <h2 className="cr-h2">{t('casePage.violationsTitle')}</h2>
                <p className="cr-muted cr-sub">{t('casePage.violationsSubtitle')}</p>
                <table className="cr-table">
                  <thead>
                    <tr>
                      <th className="cr-col-num">{t('caseReport.colNumber')}</th>
                      <th>{t('caseReport.colViolation')}</th>
                      <th>{t('caseReport.colLegalBasis')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CASE_VIOLATIONS.map((violation, i) => (
                      <tr key={violation.reference}>
                        <td className="cr-col-num">{i + 1}</td>
                        <td className="cr-strong">{violation.text[lang]}</td>
                        {/* English references are written to follow "Legal basis:" ("the … Policy"); a table cell starts the phrase */}
                        <td>{legalRef(violation.reference, lang).replace(/^the /, 'The ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* 4. Timeline */}
              <section className="cr-section">
                <h2 className="cr-h2">{t('casePage.timelineTitle')}</h2>
                <p className="cr-muted cr-sub">{CASE_FILE.dateLabel[lang]}</p>
                <table className="cr-table">
                  <thead>
                    <tr>
                      <th className="cr-col-time">{t('caseReport.colTime')}</th>
                      <th>{t('caseReport.colEvent')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeline.map((event) => (
                      <tr key={event.id}>
                        <td className="cr-col-time">
                          <bdi>{event.time}</bdi>
                        </td>
                        <td>
                          <div className="cr-strong">{event.title}</div>
                          <div className="cr-muted">{event.detail}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* 5. Decisions and reviewer notes (this session) */}
              <section className="cr-section">
                <h2 className="cr-h2">{t('caseReport.decisionsTitle')}</h2>
                <p className="cr-muted cr-sub">{t('caseReport.sessionNote')}</p>
                <div className={`cr-callout cr-keep ${decision === 'lifted' ? 'cr-callout-ok' : decision === 'escalated' ? 'cr-callout-bad' : 'cr-callout-neutral'}`}>
                  <span className="cr-strong">{t('caseReport.decisionLabel')}: </span>
                  {decisionText}
                </div>
                <h3 className="cr-h3">{t('casePage.notesTitle')}</h3>
                {notes.length === 0 ? (
                  <p className="cr-muted">{t('casePage.notesEmpty')}</p>
                ) : (
                  <table className="cr-table">
                    <thead>
                      <tr>
                        <th className="cr-col-time">{t('caseReport.colTime')}</th>
                        <th className="cr-col-reviewer">{t('caseReport.colReviewer')}</th>
                        <th>{t('caseReport.colNote')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notes.map((note) => (
                        <tr key={note.id}>
                          <td className="cr-col-time">
                            <bdi>{note.time}</bdi>
                          </td>
                          <td className="cr-col-reviewer">{note.author}</td>
                          <td className="cr-pre">{note.text}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>

              {/* 6. AI risk result (only if one was run) */}
              {riskResult && (
                <section className="cr-section">
                  <h2 className="cr-h2">{t('riskAssessment.title')}</h2>
                  {scored && rating ? (
                    <>
                      <dl className="cr-info cr-keep">
                        <div>
                          <dt>{t('riskAssessment.riskScore')}</dt>
                          <dd className={`cr-score ${rating.tone}`}>
                            {riskResult.risk_score} <span className="cr-muted">/ 100</span>
                          </dd>
                        </div>
                        <div>
                          <dt>{t('caseReport.riskRating')}</dt>
                          <dd className={`cr-strong ${rating.tone}`}>{t(rating.label)}</dd>
                        </div>
                      </dl>
                      {riskResult.critical_override && <p className="cr-callout cr-callout-bad cr-keep">{t('riskAssessment.criticalOverride')}</p>}
                      {overrideText && (
                        <p className="cr-callout cr-callout-bad cr-keep">
                          <span className="cr-strong" dir="ltr">
                            Critical Override:{' '}
                          </span>
                          {overrideText}
                        </p>
                      )}
                      {factors.length > 0 && (
                        <table className="cr-table cr-keep">
                          <thead>
                            <tr>
                              <th>{t('caseReport.colFactor')}</th>
                              <th>{t('caseReport.colComparedToUsual')}</th>
                              <th className="cr-col-points">{t('caseReport.colPoints')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {factors.map((f) => (
                              <tr key={f.factor_en}>
                                <td className="cr-strong">{rtl ? f.factor_ar : f.factor_en}</td>
                                <td>{rtl ? f.compared_to_usual_ar : f.compared_to_usual_en}</td>
                                <td className="cr-col-points">{t('riskAssessment.points', { points: f.points })}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </>
                  ) : (
                    <p className="cr-callout cr-callout-warn cr-keep">{t('riskAssessment.insufficientTitle')}</p>
                  )}
                  <div className="cr-callout cr-callout-neutral cr-keep">
                    <span className="cr-strong">{t('riskAssessment.recommendedAction')}: </span>
                    {rtl ? riskResult.recommended_action_ar : riskResult.recommended_action_en}
                  </div>
                  {modelVersion && (
                    <p className="cr-muted cr-small">{modelVersion}</p>
                  )}
                </section>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>,
    window.document.body
  );
};
