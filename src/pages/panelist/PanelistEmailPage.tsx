import { useParams, Link, useSearchParams } from 'react-router-dom';
import { CalendarCheck, PenLine, Eye } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { resolveBranding } from '../../lib/businessUnits';
import BuLogo from '../../components/panelist/BuLogo';
import InvalidLinkScreen from '../../components/panelist/InvalidLinkScreen';

/**
 * Simulated invite email — the external panelist's real entry point.
 * The CTA is the "magic link": a unique tokenised URL that bypasses login
 * and lands directly on the availability page.
 */
export default function PanelistEmailPage() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const { externalInvites } = useApp();

  const invite = externalInvites.find(inv => inv.accessToken === token);

  if (!invite) {
    return <InvalidLinkScreen message="This invitation link is invalid or has expired." />;
  }

  const ctx = invite.context;
  const brand = resolveBranding(ctx.businessUnit);
  const firstName = invite.firstName || invite.name?.split(' ')[0] || 'there';
  // The email shows the zone abbreviation only (e.g. "IST"), not the GMT offset —
  // the panelist page keeps the full explicit label for the login-free external view.
  const tz = ctx.timezoneLabel.replace(/\s*\([^)]*\)\s*/, '').trim();
  const modeLabel = ctx.mode === 'Online'
    ? `Online – ${ctx.meetingType ?? 'Meeting'}`
    : 'Offline';

  // Feedback Submitted gets its own follow-up email — a receipt, not another invitation.
  const isFeedbackEmail = invite.status === 'Feedback Submitted' && !!invite.feedback;
  // Cancelled gets a cancellation notice — takes precedence over every other variant.
  const isCancelledEmail = invite.status === 'Cancelled';
  // The invitation email adapts to what the panelist already answered.
  const isConfirmedState = invite.status === 'Availability Confirmed';
  const isDeclinedState = invite.status === 'Availability Declined';
  // Time-driven follow-up (demoed via ?type=): post-interview feedback nudge.
  const emailType = searchParams.get('type');
  const isNudgeEmail = emailType === 'nudge' && isConfirmedState && !invite.feedback;
  // Chases a panelist who never answered — sent once, 48h after the invite.
  const isResponseReminder = emailType === 'response-reminder' && invite.status === 'Invited';

  // Candidate + role lead the list — busy panelists need the "who" before the "when".
  const detailRows: [string, string][] = (isFeedbackEmail || isCancelledEmail || isNudgeEmail)
    ? [
        ['Candidate', ctx.candidateName],
        ['Role', ctx.jobTitle],
        ['Interview Round', ctx.roundName],
        ['Interview Date', `${ctx.interviewDate} · ${ctx.interviewTime} ${tz}`],
      ]
    : [
        ['Candidate', ctx.candidateName],
        ['Role', ctx.jobTitle],
        ['Interview Round', ctx.roundName],
        ['Proposed Date', ctx.interviewDate],
        ['Proposed Time', `${ctx.interviewTime} ${tz}`],
        ['Mode', modeLabel],
        ...(ctx.mode === 'Offline' ? [['Location', ctx.venueAddress ?? 'To be shared'] as [string, string]] : []),
      ];

  return (
    <div className="min-h-screen bg-[#F4F5FA] py-10 px-4">
      {/* Preview chrome — not part of the email */}
      <div className="max-w-xl mx-auto mb-3 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Email Preview · Simulated</p>
        <p className="text-[11px] text-[#9CA3AF]">To: <span className="font-semibold text-[#6B7280]">{invite.email}</span></p>
      </div>

      {/* The email */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        {/* Client meta header */}
        <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#FCFCFD]">
          <p className="text-xs text-[#6B7280]">From: <span className="font-semibold text-[#374151]">{brand.name} Talent Acquisition</span> &lt;no-reply@collabcrm.com&gt;</p>
          <p className="text-sm font-bold text-[#111827] mt-1">
            {isResponseReminder
              ? `Still able to join? ${ctx.candidateName} interview – ${ctx.interviewDate}`
              : isNudgeEmail
                ? `How did it go? Share your feedback – ${ctx.candidateName}`
                : isCancelledEmail
                  ? `Interview Canceled | ${ctx.jobTitle} Role | ${ctx.candidateName}`
                  : isFeedbackEmail
                    ? `Feedback Received: ${ctx.candidateName} – ${ctx.jobTitle}`
                    : `Interview Invitation: ${ctx.candidateName} – ${ctx.jobTitle} · ${ctx.interviewDate}`}
          </p>
        </div>

        {/* Brand banner */}
        <div className="px-6 py-4 flex items-center border-b border-[#F1F1F4]">
          <BuLogo brand={brand} />
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-[#374151]">{isCancelledEmail ? `Dear ${firstName},` : `Hi ${firstName},`}</p>
          {isResponseReminder ? (
            <>
              <p className="text-sm text-[#374151] leading-relaxed mt-3">
                Just checking in — we haven't heard from you about the interview below, and the recruiter is finalising the panel.
              </p>
              <p className="text-sm text-[#374151] leading-relaxed mt-2">
                It only takes a moment to respond — and if the time doesn't work, a quick decline with a note helps just as much.
              </p>
            </>
          ) : isNudgeEmail ? (
            <>
              <p className="text-sm text-[#374151] leading-relaxed mt-3">
                Thanks again for joining the interview for the <span className="font-semibold text-[#111827]">{ctx.jobTitle}</span> position.
              </p>
              <p className="text-sm text-[#374151] leading-relaxed mt-2">
                When you have a few minutes, please share your feedback — it helps the team decide quickly.
              </p>
            </>
          ) : isCancelledEmail ? (
            <>
              <p className="text-sm text-[#374151] leading-relaxed mt-3">
                This is to inform you that the interview for the <span className="font-semibold text-[#111827]">{ctx.jobTitle}</span> role, scheduled for <span className="font-semibold text-[#111827]">{ctx.interviewDate}, {ctx.interviewTime} {tz}</span>, has been canceled.
              </p>
              <p className="text-sm text-[#374151] leading-relaxed mt-2">
                Should there be any updates or a reschedule, we will inform you promptly. Thank you for your understanding.
              </p>
            </>
          ) : isFeedbackEmail ? (
            <>
              <p className="text-sm text-[#374151] leading-relaxed mt-3">
                {invite.feedback!.suggestion === 'No Show/Cancel'
                  // The candidate never showed — don't thank them "for interviewing" someone who wasn't there.
                  ? <>Thank you for making time for the <span className="font-semibold text-[#111827]">{ctx.jobTitle}</span> interview.</>
                  : <>Thank you for taking the time to interview <span className="font-semibold text-[#111827]">{ctx.candidateName}</span> for the <span className="font-semibold text-[#111827]">{ctx.jobTitle}</span> position.</>}
              </p>
              <p className="text-sm text-[#374151] leading-relaxed mt-2">
                We've shared your feedback with the recruitment team — here's a copy for your records.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-[#374151] leading-relaxed mt-3">
                We'd love to have you on the interview panel for the <span className="font-semibold text-[#111827]">{ctx.jobTitle}</span> position.
              </p>
              <p className="text-sm text-[#374151] leading-relaxed mt-2">
                {isConfirmedState
                  ? "You've confirmed you're available — here are the details for your reference."
                  : isDeclinedState
                    ? "You let us know you can't make it — the details are below in case anything changes."
                    : 'Here are the proposed details — please have a look and let us know if you can make it.'}
              </p>
            </>
          )}

          {/* Interview Details — omitted on the cancellation notice (the schedule is in the sentence) */}
          {!isCancelledEmail && (
            <>
              <p className="text-xs font-bold text-[#111827] mt-4 mb-1.5">Interview Details:</p>
              <div className="border border-[#E5E7EB] rounded-lg bg-[#FAFAFB] px-4 divide-y divide-[#F1F1F4]">
                {detailRows.map(([label, value]) => (
                  <div key={label} className="py-2 flex items-baseline gap-3">
                    <span className="w-32 shrink-0 text-[11px] font-semibold text-[#9CA3AF]">{label}</span>
                    <span className="text-xs font-medium text-[#374151]">{value}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {isNudgeEmail || isCancelledEmail ? null : isFeedbackEmail ? (
            <>
              {/* Feedback receipt — suggestion + remarks the panelist submitted */}
              <p className="text-xs font-bold text-[#111827] mt-4">Your Submission:</p>
              <div className="border border-[#E5E7EB] rounded-lg bg-[#F0FDF4] px-4 py-3 mt-1.5">
                <p className="text-xs text-[#374151]">
                  <span className="font-semibold text-[#9CA3AF]">Suggestion:</span>{' '}
                  <span className="font-bold text-[#059669]">{invite.feedback!.suggestion}</span>
                </p>
                {invite.feedback!.overallRemarks && (
                  <p className="text-xs text-[#374151] leading-relaxed mt-1.5 italic">“{invite.feedback!.overallRemarks}”</p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Gentle ask — adapts to the panelist's answer; never asks what's already answered */}
              <p className="text-xs font-bold text-[#111827] mt-4">
                {isConfirmedState ? "You're confirmed" : isDeclinedState ? 'Change of plans?' : 'Can you make it?'}
              </p>
              <p className="text-sm text-[#374151] leading-relaxed mt-1">
                {isConfirmedState
                  ? 'Keep this link handy — you can view the interview details or update your response anytime.'
                  : isDeclinedState
                    ? 'If your schedule frees up, you can update your response using the link below.'
                    : 'If the time works for you, just confirm below. If not, no problem — leave a note and the recruiter will find a better slot.'}
              </p>
            </>
          )}

          {/* Magic-link CTA — one tokenised URL for the whole journey. Cancelled → no button. */}
          {!isCancelledEmail && (
            <div className="text-center mt-6">
              <Link to={`/panel/${token}`}
                className="inline-block px-8 py-3 rounded-xl bg-[#3538CD] text-white text-sm font-bold shadow-sm hover:bg-[#2d30b0] transition-colors">
                View Interview Details
              </Link>
              {/* One-link explainer — a small 3-step journey instead of a wall of text */}
              {!isNudgeEmail && !isFeedbackEmail && (
                <div className="mt-5 rounded-xl border border-[#ECEDF3] bg-[#FAFBFF] overflow-hidden max-w-md mx-auto">
                  <p className="text-center text-[11px] text-[#6B7280] font-medium px-4 pt-3">
                    The same secure link takes you through every step
                  </p>
                  <div className="grid grid-cols-3 divide-x divide-[#ECEDF3] mt-2.5">
                    {[
                      { Icon: CalendarCheck, label: 'Confirm availability', when: 'Now' },
                      { Icon: PenLine, label: 'Add your feedback', when: 'After the interview' },
                      { Icon: Eye, label: 'View what you sent', when: 'Anytime after' },
                    ].map(({ Icon, label, when }) => (
                      <div key={label} className="px-2 py-3.5 flex flex-col items-center gap-1.5">
                        <span className="w-8 h-8 rounded-full bg-white border border-[#E0E7FF] flex items-center justify-center shadow-sm">
                          <Icon className="w-4 h-4 text-[#3538CD]" />
                        </span>
                        <span className="text-[11px] font-semibold text-[#374151] leading-tight text-center">{label}</span>
                        <span className="text-[10px] text-[#9CA3AF] leading-tight text-center">{when}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-[11px] text-[#9CA3AF] mt-3">This secure link is personal to you — no login required.</p>
            </div>
          )}

          {/* Sign-off — the recruiter who scheduled the interview: name · designation · business unit */}
          <div className="text-sm text-[#374151] leading-relaxed mt-6">
            <p>{isCancelledEmail ? 'Regards,' : 'Thank you,'}</p>
            <p className="font-semibold text-[#111827] mt-1">{ctx.scheduledByName ?? 'The Talent Acquisition Team'}</p>
            {ctx.scheduledByRole && <p className="text-[#6B7280]">{ctx.scheduledByRole}</p>}
            <p className="text-[#6B7280]">{brand.name}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F1F1F4] text-center">
          <p className="text-[10px] font-medium text-[#9CA3AF]">Powered by CollabCRM</p>
        </div>
      </div>
    </div>
  );
}
