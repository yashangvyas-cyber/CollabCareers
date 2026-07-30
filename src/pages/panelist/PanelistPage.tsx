import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, CheckCircle, AlertTriangle, ExternalLink, XCircle, Mail, Phone, Linkedin, Copy, MapPin, ChevronDown, Info, Lock, CalendarClock, Check, X, CalendarCheck, CalendarX, FlaskConical, PenLine } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { resolveBranding } from '../../lib/businessUnits';
import BuLogo from '../../components/panelist/BuLogo';
import InvalidLinkScreen from '../../components/panelist/InvalidLinkScreen';
import type { PanelSuggestion } from '../../store/types';

const SUGGESTION_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  'Should Hire':    { bg: 'rgb(240,253,244)', border: 'rgb(187,247,208)', text: 'rgb(22,101,52)'  },
  'Next Round':     { bg: 'rgb(239,246,255)', border: 'rgb(191,219,254)', text: 'rgb(30,64,175)'  },
  'Not Sure':       { bg: 'rgb(249,250,251)', border: 'rgb(209,213,219)', text: 'rgb(75,85,99)'   },
  'No Show/Cancel': { bg: 'rgb(255,251,235)', border: 'rgb(253,230,138)', text: 'rgb(146,64,14)'  },
  'Should Reject':  { bg: 'rgb(254,242,242)', border: 'rgb(254,202,202)', text: 'rgb(185,28,28)'  },
};

const SUGGESTIONS: PanelSuggestion[] = ['Next Round', 'No Show/Cancel', 'Not Sure', 'Should Hire', 'Should Reject'];

// Uppercase tiny gray label — matches the internal screen's `.label`
const RLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-semibold text-[#98A2B3] uppercase tracking-wide">{children}</p>
);

export default function PanelistPage() {
  const { token } = useParams();
  // Key by token: switching between invite links fully re-initialises the page state,
  // so one token's session state can never leak into another's.
  return <PanelistView key={token} token={token} />;
}

/** "23-Jun-2026, 07:18 PM" — matches the internal panel-feedback attribution format. */
function formatProvidedAt(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const mon = d.toLocaleString('en-US', { month: 'short' });
  let h = d.getHours();
  const min = String(d.getMinutes()).padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${day}-${mon}-${d.getFullYear()}, ${String(h).padStart(2, '0')}:${min} ${ap}`;
}

function PanelistView({ token }: { token?: string }) {
  const { externalInvites, submitExternalAvailability, submitExternalFeedback } = useApp();

  const invite = externalInvites.find(inv => inv.accessToken === token);

  // `committed` = the availability the panelist has actually saved & communicated to the
  // recruiter (null = not decided yet). `availAvailable` is the live toggle in edit mode.
  const [committed, setCommitted] = useState<boolean | null>(
    invite?.status === 'Availability Confirmed' || invite?.status === 'Feedback Submitted' ? true
      : invite?.status === 'Availability Declined' ? false
      : null
  );
  // Live toggle starts on the committed response so "change pending" is only
  // ever true when the panelist actually flips to the other option.
  const [availAvailable, setAvailAvailable] = useState(invite?.status !== 'Availability Declined');
  const [availNote, setAvailNote] = useState('');
  // Which response is awaiting the confirm dialog (null = none) — the double-confirm step.
  const [confirmChoice, setConfirmChoice] = useState<boolean | null>(null);
  const [changeMenuOpen, setChangeMenuOpen] = useState(false);
  const [showAvailModal, setShowAvailModal] = useState(false);
  const [toast, setToast] = useState('');

  const [fbOpen, setFbOpen] = useState(false);
  const [fbSuggestion, setFbSuggestion] = useState<PanelSuggestion>('Next Round');
  const [fbOverallRemarks, setFbOverallRemarks] = useState('');
  const [fbCriteriaRatings, setFbCriteriaRatings] = useState<Record<string, { score: number; remark: string }>>({});
  const [fbSubmitted, setFbSubmitted] = useState(false);
  // Editing an already-submitted feedback (author only) + collapse state of the read-only card.
  const [editing, setEditing] = useState(false);
  const [roDetailOpen, setRoDetailOpen] = useState(true);
  // Prototype-only: lets a reviewer fast-forward past the interview start time so the
  // time-gated feedback form can be walked through live, without waiting for the real clock.
  const [demoTimePassed, setDemoTimePassed] = useState(false);

  // ── Invalid / unknown token ──
  if (!invite) {
    return <InvalidLinkScreen message="This interview invitation link is invalid or has expired. Please contact the recruiter for a new link." />;
  }

  const ctx = invite.context;
  const brand = resolveBranding(ctx.businessUnit);

  // ── Cancelled / revoked ──
  if (invite.status === 'Cancelled') {
    return (
      <div className="min-h-screen bg-[#F4F5FA] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xl p-12 text-center max-w-md">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-6">
            <XCircle className="w-8 h-8 text-[#6B7280]" />
          </div>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mb-2">Invitation Revoked</h1>
          <p className="text-sm text-[#6B7280] leading-relaxed mb-4">We're sorry for the change of plans — this interview invitation has been cancelled. If you believe this is a mistake, please reach out to the recruiter who invited you.</p>
          {invite.feedback && (
            <div className="bg-[#F9FAFB] rounded-xl p-4 text-left border border-[#E5E7EB]">
              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-2">Your Previously Submitted Feedback</p>
              <p className="text-xs text-[#9CA3AF]">Suggestion: {invite.feedback.suggestion}</p>
              <p className="text-xs text-[#9CA3AF] mt-1 italic">{invite.feedback.overallRemarks}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  // Persist the chosen availability, notify the recruiter (simulated), and — when going
  // unavailable — discard any drafted feedback (it's about to be hidden).
  const commitAvailability = (available: boolean) => {
    setConfirmChoice(null);
    if (!token) return;
    submitExternalAvailability(token, { available, note: availNote.trim() || undefined });
    setAvailAvailable(available);
    setCommitted(available);
    setShowAvailModal(false);
    if (!available) {
      setFbOpen(false);
      setFbCriteriaRatings({});
      setFbOverallRemarks('');
      setFbSuggestion('Next Round');
    }
    showToast(`Response submitted — ${available ? 'Accepted' : 'Declined'}. The recruiter has been notified via email.`);
  };
  const handleFbSubmit = () => {
    if (!token) return;
    submitExternalFeedback(token, {
      suggestion: fbSuggestion,
      overallRemarks: fbOverallRemarks.trim(),
      criteriaRatings: Object.keys(fbCriteriaRatings).length > 0 ? fbCriteriaRatings : {},
    });
    setFbSubmitted(true);
    showToast('Feedback submitted. The recruiter has been notified via email.');
  };

  // Feedback is a single submission per interview round, shared across the whole panel:
  // whoever submits first is the author, and every other panelist sees it read-only,
  // attributed to that author (not as "your" feedback).
  const feedbackInvite = externalInvites.find(
    i => i.candidateId === invite.candidateId && i.roundId === invite.roundId && !!i.feedback
  );
  const roundFeedback = feedbackInvite?.feedback;
  const feedbackAuthor = roundFeedback?.submittedBy || feedbackInvite?.name || feedbackInvite?.email || 'a panel member';
  // Once feedback exists for the round, the page becomes a read-only record for everyone.
  const isReadOnly = !!roundFeedback;
  // The current viewer authored the round's feedback → they may edit it; peers see it read-only.
  const isAuthor = !!feedbackInvite && feedbackInvite.accessToken === invite.accessToken;

  // Enter edit mode with the submitted values pre-loaded into the form.
  const startEditing = () => {
    if (!roundFeedback) return;
    setFbSuggestion(roundFeedback.suggestion);
    setFbOverallRemarks(roundFeedback.overallRemarks);
    setFbCriteriaRatings({ ...roundFeedback.criteriaRatings });
    setEditing(true);
  };
  // Save an edit — keep the original author, notify the recruiter, drop back to read-only.
  const handleFbUpdate = () => {
    if (!token) return;
    submitExternalFeedback(token, {
      suggestion: fbSuggestion,
      overallRemarks: fbOverallRemarks.trim(),
      criteriaRatings: Object.keys(fbCriteriaRatings).length > 0 ? fbCriteriaRatings : {},
      submittedBy: roundFeedback?.submittedBy,
    });
    setEditing(false);
    showToast('Feedback updated. The recruiter has been notified via email.');
  };

  // Availability state derives entirely from the committed decision.
  const declined = committed === false;
  const confirmed = committed === true;
  // Feedback is locked until the panelist confirms they're available for the interview.
  // Feedback opens only once the interview has started — accepting a week early
  // must not let a panelist rate a candidate before the interview happens.
  const interviewStart = new Date(`${ctx.interviewDate.replace(/\//g, ' ')} ${ctx.interviewTime}`);
  const realInterviewStarted = isNaN(interviewStart.getTime()) || Date.now() >= interviewStart.getTime();
  // The demo toggle only stands in for the passage of time — every other rule still applies.
  const interviewStarted = realInterviewStarted || demoTimePassed;
  const feedbackUnlocked = confirmed && interviewStarted;
  // Has the panelist typed anything into the feedback form yet? (used to warn on discard)
  const hasDraftedFeedback =
    fbOverallRemarks.trim() !== '' ||
    Object.values(fbCriteriaRatings).some(c => c.score > 0 || c.remark.trim() !== '');

  const getCriterion = (c: string) => fbCriteriaRatings[c] ?? { score: 0, remark: '' };
  const updateCriterionScore = (c: string, score: number) =>
    setFbCriteriaRatings(prev => ({ ...prev, [c]: { ...(prev[c] ?? { remark: '' }), score } }));
  const updateCriterionRemark = (c: string, remark: string) =>
    setFbCriteriaRatings(prev => ({ ...prev, [c]: { ...(prev[c] ?? { score: 0 }), remark } }));

  // The feedback form and its read-only record share one renderer, so a submitted feedback
  // looks exactly like the form: all five suggestion pills (chosen one dark-filled), a star
  // rating + "N out of 10" readout per criterion, and remark boxes. These are plain functions
  // (not <Components>) so the textareas keep focus across re-renders while typing.
  const DARK_PILL = { backgroundColor: '#2E3444', borderColor: '#2E3444', color: '#FFFFFF' };
  const suggestionPills = (selected: PanelSuggestion, editable: boolean) => (
    <div className="flex flex-wrap gap-2">
      {SUGGESTIONS.map(s => {
        const sty = SUGGESTION_STYLE[s];
        const style = selected === s ? DARK_PILL : { backgroundColor: sty.bg, borderColor: sty.border, color: sty.text };
        return editable ? (
          <button key={s} type="button" onClick={() => setFbSuggestion(s)}
            className="px-4 py-2 rounded-lg text-xs font-bold border transition-all" style={style}>{s}</button>
        ) : (
          <span key={s} className="px-4 py-2 rounded-lg text-xs font-bold border" style={style}>{s}</span>
        );
      })}
    </div>
  );
  const criterionBlock = (name: string, score: number, remark: string, editable: boolean) => (
    <div key={name} className="border-t border-[#F1F1F4] pt-4 mt-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#111827] mb-2">{name} <span className="text-red-500">*</span></p>
          <div className="flex gap-0.5">
            {Array.from({ length: 10 }, (_, i) =>
              editable ? (
                <button key={i} type="button" onClick={() => updateCriterionScore(name, i + 1)}
                  className="text-xl leading-none transition-transform hover:scale-110"
                  style={{ color: i < score ? '#F4B400' : '#E5E7EB' }}>★</button>
              ) : (
                <span key={i} className="text-xl leading-none" style={{ color: i < score ? '#F4B400' : '#E5E7EB' }}>★</span>
              ),
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[11px] text-[#6B7280]">Rating</p>
          <p className="text-sm font-bold text-[#111827] mt-0.5">{score} out of 10</p>
        </div>
      </div>
      <p className="text-[11px] text-[#6B7280] mt-3 mb-1">Remark</p>
      {editable ? (
        <textarea value={remark} onChange={e => updateCriterionRemark(name, e.target.value)} rows={2}
          placeholder={`Remark for ${name}...`}
          className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] resize-none focus:outline-none focus:ring-2 focus:ring-[#3538CD]/30 focus:border-[#3538CD] bg-white" />
      ) : (
        <div className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] bg-white whitespace-pre-wrap min-h-[42px]">{remark || '—'}</div>
      )}
    </div>
  );
  const feedbackBody = (
    editable: boolean,
    source: { suggestion: PanelSuggestion; criteriaRatings: Record<string, { score: number; remark: string }>; overallRemarks: string },
  ) => (
    <div className="border border-[#E5E7EB] rounded-lg p-5">
      <div>
        <p className="text-xs font-medium text-[#6B7280] mb-2">Interview Panel Suggestion <span className="text-red-500">*</span></p>
        {suggestionPills(source.suggestion, editable)}
      </div>
      {ctx.evaluationCriteria.map(c => {
        const crit = editable ? getCriterion(c) : (source.criteriaRatings[c] ?? { score: 0, remark: '' });
        return criterionBlock(c, crit.score, crit.remark, editable);
      })}
      <div className="border-t border-[#F1F1F4] pt-4 mt-4">
        <p className="text-xs font-medium text-[#6B7280] mb-1">Overall Remarks <span className="text-red-500">*</span></p>
        {editable ? (
          <textarea value={fbOverallRemarks} onChange={e => setFbOverallRemarks(e.target.value)} rows={4}
            placeholder="Overall summary of the candidate's performance..."
            className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] resize-none focus:outline-none focus:ring-2 focus:ring-[#3538CD]/30 focus:border-[#3538CD] bg-white" />
        ) : (
          <div className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] bg-white whitespace-pre-wrap min-h-[64px]">{source.overallRemarks || '—'}</div>
        )}
      </div>
    </div>
  );

  const modeLabel = ctx.mode === 'Online'
    ? `Online${ctx.meetingType ? ` (${ctx.meetingType})` : ''}`
    : 'Offline';

  // External panelists invited to this round (cancelled invites excluded) —
  // this is the panel as the external viewer should see it.
  const roundPanel = externalInvites.filter(i => i.roundId === invite.roundId && i.status !== 'Cancelled');

  const SideRow = ({ label, value, isLink, href }: { label: string; value?: string; isLink?: boolean; href?: string }) => (
    <div className="px-4 py-3 border-b border-[#F1F1F4]">
      <p className="text-[11px] text-[#9CA3AF]">{label}</p>
      {isLink && (href || value) ? (
        <a href={href || value} target="_blank" rel="noreferrer" className="text-xs font-semibold mt-1 inline-flex items-center gap-1 text-[#3538CD] hover:underline">
          {label} Link <ExternalLink className="w-3 h-3" />
        </a>
      ) : (
        <p className="text-sm font-semibold text-[#374151] mt-1">{value || '-'}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F5FA] flex flex-col">
      {/* Header — business-unit branding only ("Powered by CollabCRM" lives in the footer) */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30">
        <div className="px-6 py-3 flex items-center">
          <BuLogo brand={brand} />
        </div>
      </header>

      <main className="flex-1 p-4">
        {/* ── Availability — sticky bar above the details, unlocks feedback ── */}
        {!isReadOnly && (
          <div className="sticky top-[64px] z-20 mb-4 bg-white rounded-lg border border-[#E5E7EB] shadow-sm">
            {committed === null ? (
              /* First response — two plain, stable buttons. Clicking opens the
                 confirmation dialog (double-confirm); the bar itself never changes. */
              <div className="px-4 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex items-center gap-2.5 flex-1 min-w-[220px]">
                  <CalendarClock className="w-5 h-5 text-[#3538CD] shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-[#111827] leading-tight">Interview Panel Invitation</p>
                    <p className="text-[11px] text-[#6B7280]">Can you join this interview? The recruiter is notified by email.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <button onClick={() => setConfirmChoice(true)}
                    className="flex items-center gap-1.5 rounded-lg px-5 py-2 text-xs font-semibold bg-[#059669] text-white hover:bg-[#047857] transition-colors duration-150">
                    <Check className="w-3.5 h-3.5" /> Accept
                  </button>
                  <button onClick={() => setConfirmChoice(false)}
                    className="flex items-center gap-1.5 rounded-lg px-5 py-2 text-xs font-semibold border border-[#D1D5DB] bg-white text-[#374151] hover:bg-[#F9FAFB] transition-colors duration-150">
                    <X className="w-3.5 h-3.5" /> Decline
                  </button>
                </div>
              </div>
            ) : (
              /* Responded — clear status line; actions: note + Change response menu */
              <>
              <div className="px-4 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex items-center gap-2.5 flex-1 min-w-[220px]">
                  {confirmed
                    ? <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0" />
                    : <XCircle className="w-5 h-5 text-[#6B7280] shrink-0" />}
                  <div>
                    <p className="text-sm font-bold text-[#111827] leading-tight">
                      {confirmed ? "You've accepted this interview invitation" : "You've declined this interview invitation"}
                    </p>
                    <p className="text-[11px] text-[#6B7280]">
                      The recruiter has been notified.
                      {availNote.trim() && <span className="italic"> · “{availNote.trim()}”</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                {/* Outlook/Calendar-style response menu — current choice check-marked,
                    picking the other option opens the confirmation flow */}
                <div className="relative">
                  <button onClick={() => setChangeMenuOpen(o => !o)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-[#374151] rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                    Change response
                    <ChevronDown className={`w-3.5 h-3.5 text-[#9CA3AF] transition-transform duration-150 ${changeMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {changeMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-30 py-1">
                      {[
                        { val: true, label: 'Accept' },
                        { val: false, label: 'Decline' },
                      ].map(opt => {
                        const isCurrent = committed === opt.val;
                        return (
                          <button key={opt.label} disabled={isCurrent}
                            onClick={() => { setChangeMenuOpen(false); setAvailAvailable(opt.val); setShowAvailModal(true); }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                              isCurrent ? 'text-[#9CA3AF] cursor-default' : 'text-[#374151] font-semibold hover:bg-[#F9FAFB]'
                            }`}>
                            {opt.label}
                            {isCurrent && <CheckCircle className="w-3.5 h-3.5 text-green-600" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                </div>
              </div>
              </>
            )}
          </div>
        )}

        {/* ── Interview Details — full-width, two-pane (mirrors internal panelist screen) ── */}
        <div className="bg-white w-full rounded-lg border border-[#E5E7EB] shadow-sm">
          <div className="w-full px-4 py-3 border-b border-[#E5E7EB]">
            <span className="text-base font-semibold text-[#111827]">Interview Details</span>
          </div>

          <div className="w-full flex flex-col lg:flex-row">
            {/* Candidate info sidebar */}
            <aside className="lg:w-[300px] lg:border-r border-b lg:border-b-0 border-[#E5E7EB] shrink-0">
              <div className="p-4 border-b border-[#F1F1F4]">
                <p className="text-lg font-bold text-[#111827] leading-tight">{ctx.candidateName}</p>
                <p className="text-sm font-semibold text-[#3538CD] mt-0.5">{ctx.jobTitle}</p>
              </div>
              {ctx.cvUrl && (
                <div className="p-4 border-b border-[#F1F1F4]">
                  <a href={ctx.cvUrl} target="_blank" rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 border border-[#E5E7EB] rounded-lg py-2.5 text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors">
                    <FileText className="w-4 h-4 text-[#3538CD]" /> View Resume
                  </a>
                </div>
              )}
              {ctx.candidateEmail && (
                <div className="px-4 py-3 border-b border-[#F1F1F4] bg-[#FCFCFD] flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                    <span className="text-sm text-[#374151] truncate">{ctx.candidateEmail}</span>
                  </div>
                  <button onClick={() => navigator.clipboard?.writeText(ctx.candidateEmail!)} title="Copy email" className="shrink-0">
                    <Copy className="w-3.5 h-3.5 text-[#9CA3AF] hover:text-[#374151]" />
                  </button>
                </div>
              )}
              {ctx.candidatePhone && (
                <div className="px-4 py-3 border-b border-[#F1F1F4] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                  <span className="text-sm text-[#374151]">{ctx.candidatePhone}</span>
                </div>
              )}
              {ctx.candidateLinkedIn && (
                <div className="px-4 py-3 border-b border-[#F1F1F4] flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                  <a href={ctx.candidateLinkedIn} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#3538CD] hover:underline inline-flex items-center gap-1">
                    Linkedin Profile Link <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              <SideRow label="Total Experience" value={ctx.totalExperience} />
              <div className="px-4 py-3 border-b border-[#F1F1F4]">
                <p className="text-[11px] text-[#9CA3AF]">Skills</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {(ctx.skills?.length ? ctx.skills : ['—']).map(s => (
                    <span key={s} className="inline-flex items-center rounded-md bg-[#EEF4FF] text-[#3538CD] px-2 py-0.5 text-[11px] font-medium">{s}</span>
                  ))}
                </div>
              </div>
              <SideRow label="Notice Period (Days)" value={ctx.noticePeriodDays != null ? String(ctx.noticePeriodDays) : '-'} />
              <SideRow label="Current Organization" value={ctx.currentOrganization} />
            </aside>

            {/* Round detail */}
            <div className="flex-1 min-w-0 px-4 py-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base font-semibold text-[#111827]">Interview Rounds</span>
                <span className="border border-[#3538CD] rounded-lg py-0.5 px-2 bg-[#EEF4FF] text-[#3538CD] text-xs font-medium">
                  {String(invite.roundNo).padStart(2, '0')}
                </span>
              </div>
              <div className="border border-[#E5E7EB] rounded-lg p-4 space-y-4">
                {/* Round header row */}
                <div className="flex flex-wrap items-start gap-4">
                  <div className="w-12 h-12 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-center text-sm font-semibold text-[#374151] shrink-0">
                    {String(invite.roundNo).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-[180px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold text-[#111827]">{ctx.roundName}</span>
                      <span className="inline-flex items-center border border-[#E5E7EB] bg-[#F9FAFB] text-[#374151] rounded-full text-xs font-medium py-0.5 px-2.5 capitalize">
                        {modeLabel}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#6B7280] mt-1">
                      {ctx.interviewDate} · {ctx.interviewTime} <span className="font-semibold">{ctx.timezoneLabel}</span>
                    </p>
                  </div>
                  <div className="flex gap-8 shrink-0">
                    <div>
                      <RLabel>Interview Status</RLabel>
                      <span className="inline-flex items-center rounded-2xl border font-medium text-xs py-0.5 px-2.5 mt-2 bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]">
                        {ctx.interviewStatus ?? 'Scheduled'}
                      </span>
                    </div>
                    <div>
                      <RLabel>Panel Suggestion</RLabel>
                      <span className="inline-flex items-center rounded-2xl border font-medium text-xs py-0.5 px-2.5 mt-2 bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]">
                        {ctx.panelSuggestion ?? 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metadata block */}
                <div className="border border-[#E5E7EB] rounded-lg bg-[#FAFAFB] p-4 flex flex-wrap">
                  <div className="w-full sm:w-[42%] px-2 mb-4">
                    <RLabel>Interview Panel</RLabel>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {roundPanel.map(p => {
                        const display = p.name || p.email;
                        return (
                          <span key={p.id} className="group relative inline-flex items-center border border-[#E5E7EB] rounded-lg bg-white py-1 px-2 text-xs font-medium text-[#374151] gap-1.5 cursor-default">
                            <span className="w-5 h-5 rounded-full bg-[#3538CD]/10 text-[#3538CD] text-[9px] font-black flex items-center justify-center shrink-0">
                              {display.split(/[\s@.]/).filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </span>
                            {display}
                            {p.accessToken === token && <span className="text-[10px] font-semibold text-[#3538CD]">(You)</span>}
                            {/* Email tooltip on hover */}
                            <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 whitespace-nowrap rounded-lg bg-[#111827] text-white text-[11px] px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg">
                              {p.email}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="w-1/2 sm:w-[30%] px-2 mb-4">
                    <RLabel>Scheduled By</RLabel>
                    <p className="text-xs font-medium text-[#374151] mt-2">{ctx.scheduledByName ?? '-'}</p>
                    {ctx.scheduledAt && <p className="text-[11px] text-[#9CA3AF] mt-0.5">{ctx.scheduledAt}</p>}
                  </div>
                  <div className="w-1/2 sm:w-[28%] px-2 mb-4">
                    <RLabel>Interview Duration</RLabel>
                    <p className="text-xs font-medium text-[#374151] mt-2">{ctx.durationMinutes} Minutes</p>
                  </div>
                  <div className="w-full px-2 mb-4">
                    <RLabel>{ctx.mode === 'Online' ? 'Join Link' : 'Location'}</RLabel>
                    <div className="mt-2">
                      {ctx.mode === 'Online' && ctx.meetingLink ? (
                        <a href={ctx.meetingLink} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#3538CD] inline-flex items-center gap-1.5 hover:underline">
                          Join {ctx.meetingType ?? 'Meeting'} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <p className="text-xs font-medium text-[#374151] flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#3538CD]" /> {ctx.venueAddress ?? 'TBD'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-full px-2">
                    <RLabel>Additional Information</RLabel>
                    <p className="text-xs text-[#6B7280] mt-2">{ctx.additionalInfo ?? '-'}</p>
                  </div>
                </div>

                {/* Interview Panel Feedback — collapsed, locked until availability confirmed */}
                {!isReadOnly && !declined && (
                  <div>
                    <button
                      onClick={() => { if (feedbackUnlocked) setFbOpen(o => !o); }}
                      disabled={!feedbackUnlocked}
                      className={`w-full flex items-center justify-between border border-[#E5E7EB] bg-[#F9FAFB] p-3 text-sm font-medium transition-colors ${fbOpen ? 'rounded-t-lg' : 'rounded-lg'} ${feedbackUnlocked ? 'text-[#374151] hover:bg-[#F3F4F6] cursor-pointer' : 'text-[#9CA3AF] cursor-not-allowed'}`}>
                      <span className="flex items-center gap-1.5">
                        {!feedbackUnlocked && <Lock className="w-3.5 h-3.5 text-[#9CA3AF]" />}
                        Interview Panel Feedback
                        <span className="text-[#9CA3AF] font-normal">
                          {feedbackUnlocked
                            ? '(Tap to add feedback)'
                            : !confirmed
                              ? '(Accept the invitation first)'
                              : `(Opens after the interview starts — ${ctx.interviewDate}, ${ctx.interviewTime} ${ctx.timezoneLabel})`}
                        </span>
                        <Info className="w-3.5 h-3.5 text-[#9CA3AF]" />
                      </span>
                      {feedbackUnlocked && <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform duration-200 ${fbOpen ? 'rotate-180' : ''}`} />}
                    </button>
                    {/* Prototype-only fast-forward — appears only when the sole thing keeping feedback
                        locked is that the real interview time hasn't passed yet. */}
                    {confirmed && !realInterviewStarted && (
                      <label className="mt-2 flex items-center gap-2.5 rounded-lg border border-dashed border-[#C7D2FE] bg-[#EEF2FF] px-3 py-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={demoTimePassed}
                          onChange={e => setDemoTimePassed(e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-[#A5B4FC] text-[#3538CD] focus:ring-[#3538CD]"
                        />
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#4338CA]">
                          <FlaskConical className="w-3.5 h-3.5 shrink-0" />
                          Prototype control — simulate that the interview time has passed to unlock feedback
                        </span>
                      </label>
                    )}
                    {feedbackUnlocked && fbOpen && (
                      <div className="border border-t-0 border-[#E5E7EB] rounded-b-lg p-4 bg-white">
                        {feedbackBody(true, { suggestion: fbSuggestion, criteriaRatings: fbCriteriaRatings, overallRemarks: fbOverallRemarks })}
                        <button onClick={handleFbSubmit}
                          className="mt-4 px-6 py-2.5 bg-[#3538CD] text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-[#2d30b0] transition-colors">
                          {fbSubmitted ? '✓ Submitted' : 'Submit Feedback'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Read-only feedback summary — one submission per interview, shown to the whole
                  panel and attributed to whoever entered it (matches the internal header). */}
              {isReadOnly && roundFeedback && (
                <div className="mt-4 border border-[#E5E7EB] rounded-xl overflow-hidden">
                  {/* Green attribution banner — one line, with collapse + author-only Edit */}
                  <div className="flex items-center gap-x-1 bg-[#E7F6EC] px-4 py-3 border-b border-[#CDEDD8]">
                    <span className="text-sm font-semibold text-[#111827]">Interview Panel Feedback</span>
                    <span className="text-sm text-[#374151]">
                      (Provided by <span className="font-semibold text-[#3538CD]">{feedbackAuthor}</span>
                      {roundFeedback.submittedAt && <> on {formatProvidedAt(roundFeedback.submittedAt)}</>})
                    </span>
                    <Info className="w-3.5 h-3.5 text-[#6B7280] shrink-0 ml-0.5" />
                    <div className="ml-auto flex items-center gap-1 shrink-0">
                      {isAuthor && !editing && (
                        <button onClick={startEditing}
                          className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-[#3538CD] hover:bg-white/70 transition-colors">
                          <PenLine className="w-3.5 h-3.5" /> Edit
                        </button>
                      )}
                      <button onClick={() => setRoDetailOpen(o => !o)} aria-label={roDetailOpen ? 'Collapse' : 'Expand'}
                        className="p-1 rounded-md hover:bg-white/70 transition-colors">
                        <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${roDetailOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                  {roDetailOpen && (
                    <div className="p-4 bg-white">
                      {editing && isAuthor ? (
                        <>
                          {feedbackBody(true, { suggestion: fbSuggestion, criteriaRatings: fbCriteriaRatings, overallRemarks: fbOverallRemarks })}
                          <div className="mt-4 flex items-center gap-2">
                            <button onClick={handleFbUpdate}
                              className="px-6 py-2.5 bg-[#3538CD] text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-[#2d30b0] transition-colors">
                              Update Feedback
                            </button>
                            <button onClick={() => setEditing(false)}
                              className="px-5 py-2.5 text-xs font-semibold text-[#6B7280] rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        feedbackBody(false, roundFeedback)
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── Change-availability confirmation (reversing a communicated decision) ── */}
      {/* ── Double-confirm dialog for the first response — choice-tinted, with the
             interview "ticket" so the panelist sees exactly what they're answering ── */}
      {confirmChoice !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-md overflow-hidden">
            {/* Choice-tinted top strip */}
            <div className={`h-1.5 ${confirmChoice ? 'bg-[#059669]' : 'bg-[#334155]'}`} />
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${confirmChoice ? 'bg-[#ECFDF5] border-[#A7F3D0]' : 'bg-[#F1F5F9] border-[#CBD5E1]'}`}>
                  {confirmChoice
                    ? <CalendarCheck className="w-5 h-5 text-[#059669]" />
                    : <CalendarX className="w-5 h-5 text-[#334155]" />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#111827]">
                    {confirmChoice ? 'Accept this invitation?' : 'Decline this invitation?'}
                  </h2>
                  <p className="text-sm text-[#6B7280] mt-1">
                    {confirmChoice
                      ? "You'll join the interview panel for this session."
                      : "You'll be marked unavailable for this session."}
                  </p>
                </div>
              </div>
              <input value={availNote} onChange={e => setAvailNote(e.target.value)}
                placeholder={confirmChoice ? 'Add a note for the recruiter (optional)…' : 'Propose an alternate time or leave a message (optional)…'}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] mb-4 focus:outline-none focus:ring-2 focus:ring-[#3538CD]/20 focus:border-[#3538CD]" />
              <p className="text-xs text-[#6B7280] leading-relaxed mb-5">The recruiter will be notified by email.</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setConfirmChoice(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#374151] rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                  Go back
                </button>
                <button onClick={() => commitAvailability(confirmChoice)}
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors ${confirmChoice ? 'bg-[#059669] hover:bg-[#047857]' : 'bg-[#334155] hover:bg-[#1E293B]'}`}>
                  {confirmChoice ? 'Yes, accept invitation' : 'Yes, decline invitation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAvailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-md p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#111827]">Update your response?</h2>
                <p className="text-sm text-[#6B7280] mt-1">
                  You are changing your response from{' '}
                  <span className="font-semibold text-[#111827]">{committed ? 'Accepted' : 'Declined'}</span> to{' '}
                  <span className="font-semibold text-[#111827]">{availAvailable ? 'Accepted' : 'Declined'}</span>.
                </p>
              </div>
            </div>
            {!availAvailable && hasDraftedFeedback && (
              <div className="flex items-start gap-2 rounded-lg bg-[#FEF2F2] border border-[#FECACA] p-3 mb-4">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-[#B91C1C] leading-relaxed">
                  This will hide the feedback section and <span className="font-semibold">discard the feedback you've drafted</span>. This can't be undone.
                </p>
              </div>
            )}
            <input value={availNote} onChange={e => setAvailNote(e.target.value)}
              placeholder="Add a note for the recruiter (optional)…"
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] mb-4 focus:outline-none focus:ring-2 focus:ring-[#3538CD]/20 focus:border-[#3538CD]" />
            <p className="text-xs text-[#6B7280] leading-relaxed mb-5">
              The recruiter will be notified of your updated availability by email.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowAvailModal(false); setAvailAvailable(committed ?? true); }}
                className="px-4 py-2 text-xs font-semibold text-[#374151] rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                Cancel
              </button>
              <button onClick={() => commitAvailability(availAvailable)}
                className="px-4 py-2 text-xs font-semibold text-white rounded-lg bg-[#3538CD] hover:bg-[#2d30b0] transition-colors">
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast — confirms the save + simulated recruiter notification ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-3 max-w-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
          {toast}
        </div>
      )}

      <footer className="bg-white border-t border-[#E5E7EB] py-4 text-center">
        <p className="text-[10px] font-medium text-[#9CA3AF]">Powered by CollabCRM</p>
      </footer>
    </div>
  );
}
