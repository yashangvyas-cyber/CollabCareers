import { useParams, Link } from 'react-router-dom';
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
  const { externalInvites } = useApp();

  const invite = externalInvites.find(inv => inv.accessToken === token);

  if (!invite) {
    return <InvalidLinkScreen message="This invitation link is invalid or has expired." />;
  }

  const ctx = invite.context;
  const brand = resolveBranding(ctx.businessUnit);
  const firstName = invite.firstName || invite.name?.split(' ')[0] || 'there';
  const modeLabel = ctx.mode === 'Online'
    ? `Online – ${ctx.meetingType ?? 'Meeting'}`
    : 'Offline';

  // Feedback Submitted gets its own follow-up email — a receipt, not another invitation.
  const isFeedbackEmail = invite.status === 'Feedback Submitted' && !!invite.feedback;

  // Candidate + role lead the list — busy panelists need the "who" before the "when".
  const detailRows: [string, string][] = isFeedbackEmail
    ? [
        ['Candidate', ctx.candidateName],
        ['Role', ctx.jobTitle],
        ['Interview Round', ctx.roundName],
        ['Interview Date', `${ctx.interviewDate} · ${ctx.interviewTime} ${ctx.timezoneLabel}`],
      ]
    : [
        ['Candidate', ctx.candidateName],
        ['Role', ctx.jobTitle],
        ['Interview Round', ctx.roundName],
        ['Proposed Date', ctx.interviewDate],
        ['Proposed Time', `${ctx.interviewTime} ${ctx.timezoneLabel}`],
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
            {isFeedbackEmail
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
          <p className="text-sm text-[#374151]">Hi {firstName},</p>
          {isFeedbackEmail ? (
            <>
              <p className="text-sm text-[#374151] leading-relaxed mt-3">
                Thank you for interviewing <span className="font-semibold text-[#111827]">{ctx.candidateName}</span> for the <span className="font-semibold text-[#111827]">{ctx.jobTitle}</span> position.
              </p>
              <p className="text-sm text-[#374151] leading-relaxed mt-2">
                Your feedback has been recorded and shared with the recruitment team.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-[#374151] leading-relaxed mt-3">
                You are invited to interview candidates for the <span className="font-semibold text-[#111827]">{ctx.jobTitle}</span> position.
              </p>
              <p className="text-sm text-[#374151] leading-relaxed mt-2">
                Please review the proposed interview details below and confirm whether you are available to attend.
              </p>
            </>
          )}

          {/* Interview Details */}
          <p className="text-xs font-bold text-[#111827] mt-4 mb-1.5">Interview Details:</p>
          <div className="border border-[#E5E7EB] rounded-lg bg-[#FAFAFB] px-4 divide-y divide-[#F1F1F4]">
            {detailRows.map(([label, value]) => (
              <div key={label} className="py-2 flex items-baseline gap-3">
                <span className="w-32 shrink-0 text-[11px] font-semibold text-[#9CA3AF]">{label}</span>
                <span className="text-xs font-medium text-[#374151]">{value}</span>
              </div>
            ))}
          </div>

          {isFeedbackEmail ? (
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
              {/* Action Required */}
              <p className="text-xs font-bold text-[#111827] mt-4">Action Required:</p>
              <p className="text-sm text-[#374151] leading-relaxed mt-1">
                Please let us know if this time works for you. If you are unavailable, you can leave a note for the recruiter to help reschedule.
              </p>
            </>
          )}

          {/* Magic-link CTA — tokenised URL, no login required */}
          <div className="text-center mt-6">
            <Link to={`/panel/${token}`}
              className="inline-block px-8 py-3 rounded-xl bg-[#3538CD] text-white text-sm font-bold shadow-sm hover:bg-[#2d30b0] transition-colors">
              {isFeedbackEmail ? 'View Your Feedback' : 'Confirm Availability'}
            </Link>
            <p className="text-[11px] text-[#9CA3AF] mt-3">This secure link is personal to you — no login required.</p>
          </div>

          {/* Sign-off */}
          <p className="text-sm text-[#374151] leading-relaxed mt-6">
            Thank you,<br />
            <span className="font-semibold">The Talent Acquisition Team</span>
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F1F1F4] text-center">
          <p className="text-[10px] font-medium text-[#9CA3AF]">Powered by CollabCRM</p>
        </div>
      </div>
    </div>
  );
}
