import { useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import { useApp } from '../../store/AppContext';
import { FileText, Download, ChevronDown, ShieldCheck, PenLine, CheckCircle2 } from 'lucide-react';

/**
 * Digital-sign flow — the destination of the offer email / portal "Review & Sign"
 * button. The candidate reviews the letter and signs here; on submit the offer is
 * accepted (status → Offer Accepted) and they're returned to the application view.
 */
export default function SignOfferPage() {
  const { slug, applicationId } = useParams();
  const navigate = useNavigate();
  const { applications, jobs, acceptOffer } = useApp();

  const [typedName, setTypedName] = useState('');
  const [consent, setConsent] = useState(false);

  const application = applications.find(a => a.id === applicationId);
  const offer = application?.offer;
  const job = jobs.find(j => j.id === application?.jobId);

  // Only a live, unsigned digital-sign offer can be signed. Anything else
  // (already accepted, declined, revoked, manual/verbal) has nothing to sign —
  // bounce back to the application view.
  const signable =
    !!application && !!offer && offer.mode === 'digital_sign' &&
    application.status === 'Offered' && offer.signature?.status === 'pending';

  if (!application || !offer || !signable) {
    return <Navigate to={`/portal/${slug}/application/${applicationId ?? ''}`} replace />;
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  const candidateName = offer.signature?.signatories.find(s => s.party === 'candidate')?.name ?? '';
  const nameMatches = typedName.trim().length > 1 &&
    (!candidateName || typedName.trim().toLowerCase() === candidateName.trim().toLowerCase());
  const canSign = nameMatches && consent;

  const handleSign = () => {
    if (!canSign) return;
    acceptOffer(application.id);
    navigate(`/portal/${slug}/application/${application.id}`);
  };

  return (
    <PortalLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Heading */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure Signing
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight mb-2">Review &amp; Sign Your Offer</h1>
          <p className="text-sm text-[#6B7280] font-medium">
            {job?.title}{job?.location ? ` · ${job.location}` : ''}
          </p>
        </div>

        {/* Offer letter document */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden mb-4">
          <div className="px-5 sm:px-6 py-4 border-b border-[#F3F4F6] flex items-center gap-3">
            <div className="w-0.5 h-4 bg-primary rounded-full" />
            <span className="text-xs font-black text-[#111827] uppercase tracking-widest">Offer Letter</span>
          </div>
          <div className="px-5 sm:px-6 py-5">
            {offer.document ? (
              <div className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
                <FileText className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm font-semibold text-[#111827] truncate min-w-0">{offer.document.fileName}</p>
                <a href={offer.document.fileUrl} title="Open the offer letter" aria-label="Open the offer letter"
                  className="shrink-0 ml-auto p-2 rounded-lg text-[#6B7280] hover:text-primary hover:bg-primary/5 transition-all">
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <p className="text-sm text-[#6B7280]">Your offer letter is attached to the invitation email.</p>
            )}
            {/* Key terms */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Role</p>
                <p className="text-sm font-semibold text-[#111827]">{job?.title ?? '—'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Expected Joining</p>
                <p className="text-sm font-semibold text-[#111827]">{formatDate(offer.joiningDate)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Offered By</p>
                <p className="text-sm font-semibold text-[#111827]">{offer.offeredByName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Signature block */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-[#F3F4F6] flex items-center gap-3">
            <div className="w-0.5 h-4 bg-primary rounded-full" />
            <span className="text-xs font-black text-[#111827] uppercase tracking-widest">Your Signature</span>
          </div>
          <div className="px-5 sm:px-6 py-5 space-y-5">
            <div>
              <label className="block text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">
                Type your full legal name to sign
              </label>
              <input
                value={typedName}
                onChange={e => setTypedName(e.target.value)}
                placeholder={candidateName || 'Your full name'}
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-lg font-semibold text-[#111827] placeholder:text-[#D1D5DB] placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                style={{ fontFamily: 'cursive' }}
              />
              {candidateName && typedName.trim() && !nameMatches && (
                <p className="text-xs font-medium text-red-500 mt-1.5">
                  Please type your name exactly as invited: <span className="font-bold">{candidateName}</span>
                </p>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-[#D1D5DB] text-primary focus:ring-primary" />
              <span className="text-xs text-[#6B7280] leading-relaxed">
                I have read and agree to the terms of this offer. I understand that typing my name and signing
                electronically constitutes my acceptance of the offer and is legally binding.
              </span>
            </label>

            <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-1">
              <button
                onClick={handleSign}
                disabled={!canSign}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-black rounded-2xl uppercase tracking-widest transition-all shadow-lg bg-primary text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <PenLine className="w-4 h-4" /> Sign &amp; Accept Offer
              </button>
              <button
                onClick={() => navigate(`/portal/${slug}/application/${application.id}`)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] text-xs font-black rounded-2xl uppercase tracking-widest transition-all"
              >
                <ChevronDown className="rotate-90 w-3.5 h-3.5" /> Back
              </button>
            </div>
            <p className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              On signing, the countersigned letter becomes available and the recruitment team is notified.
            </p>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
