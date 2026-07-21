import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { useApp } from '../store/AppContext';
import {
  Download, Globe, Linkedin, FileText,
  ChevronDown, MapPin, Briefcase, Building2, Clock, X, AlertTriangle,
  Calendar, PenLine, CheckCircle2, XCircle
} from 'lucide-react';

const brandStatusStyles: Record<string, string> = {
  'Under Review': 'bg-[#F4F5FA] text-primary border-primary/20',
  'Interview in Progress': 'bg-[#F4F5FA] text-primary border-primary/20',
  'Decision Made': 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]',
  'Offer Made': 'bg-primary text-white border-primary',
  'Rejected': 'bg-gray-100 text-gray-400 border-gray-200',
  'Draft': 'bg-[#F4F5FA] text-primary border border-primary/20',
  'Submitted': 'bg-[#F4F5FA] text-primary border-primary/20',
};

// Signature-state badge on the document row. The status pill that used to sit in
// the offer-card header was dropped when it became the collapsible "Offer Summary"
// section — the page header already carries the application status.
const signaturePill: Record<string, string> = {
  pending:  'bg-[#FFF4E5] text-[#D97706] border-[#FFD89A]',
  signed:   'bg-[#ECFDF3] text-[#059669] border-[#A7F3D0]',
  declined: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
};

// The Send Offer compose screen accepts DOCX & PDF, so the type is derived from
// the file name rather than assumed to be PDF.
const fileKind = (fileName: string) => (fileName.split('.').pop() || 'file').toUpperCase();

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function ViewApplicationPage() {
  const { slug, applicationId } = useParams();
  const navigate = useNavigate();
  const { applications, jobs, withdrawApplication, declineOffer } = useApp();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  // "Offer Summary" is a collapsible section like the others below; open by default.
  const [offerExpanded, setOfferExpanded] = useState(true);

  const application = applications.find(a => a.id === applicationId) || applications[0];
  const job = jobs.find(j => j.id === application.jobId) || jobs[0];

  const canWithdraw = job.status !== 'Close' &&
    !['Not Considered', 'Joined', 'Not Joined', 'Withdrawn', 'Offer Declined'].includes(application.status);

  // ── Offer ───────────────────────────────────────────────────────────────────
  // The card stays visible past 'Offered' so the candidate keeps access to the
  // document after accepting/declining. On 'Offer Revoked' the portal shows
  // "Offer On Hold" and the document + actions are withdrawn.
  const offer = application.offer;
  const offerStatuses = ['Offered', 'Offer Accepted', 'Offer Declined', 'Offer Revoked'];
  const showOfferCard = !!offer && offerStatuses.includes(application.status);
  const offerRevoked = application.status === 'Offer Revoked';
  const offerLive = application.status === 'Offered' && !offerRevoked;
  // Document is hidden once the offer is revoked, whatever the mode.
  const sig = offerRevoked ? undefined : offer?.signature;
  // In the digital-sign flow the candidate can only ever open the countersigned
  // letter, and only after signing — the sole route before that is "Review & Sign
  // Offer". So until it's signed there is nothing to show: we hide the document
  // row entirely rather than display a name the candidate can't view or download.
  // A manual attachment has no signing step, so it stays downloadable throughout.
  const signedDoc = sig?.status === 'signed' ? (sig.signedDocument ?? offer?.document) : undefined;
  const offerDoc = offerRevoked
    ? undefined
    : sig
      ? signedDoc                 // digital-sign: only once signed
      : offer?.document;          // manual attachment: always
  const canDownload = !sig || sig.status === 'signed';
  const canDecline = offerLive;
  // "Review & Sign / View Signed" is gone once the candidate declines — a declined
  // offer must not be signable — and while the offer is on hold.
  const showSignCta = !!offer?.signature && !offerRevoked && application.status !== 'Offer Declined';

  // The submitted snapshot saved by the application form. Every section below
  // renders from this (no hardcoded candidate data) so each application shows
  // exactly what was submitted.
  const fd: any = application.answers?._fullFormData || {};
  const personal = fd.personal || {};
  const professional = fd.professional || {};
  const salary = fd.salary || {};
  const address = fd.address || {};
  const experiences: any[] = professional.experiences || [];

  // Custom-question answers = everything in `answers` except the form snapshot.
  const customAnswers: Record<string, any> = Object.fromEntries(
    Object.entries(application.answers || {}).filter(([k]) => k !== '_fullFormData')
  );
  const customFields = job.customFields || [];

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  const formatDob = (d?: string) => {
    if (!d) return '';
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? d : dt.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const totalExperience = [
    professional.expYears ? `${professional.expYears} ${professional.expYears === '1' ? 'Year' : 'Years'}` : '',
    professional.expMonths && professional.expMonths !== '0' ? `${professional.expMonths} ${professional.expMonths === '1' ? 'Month' : 'Months'}` : '',
  ].filter(Boolean).join(' ');

  const noticePeriod = professional.noticePeriod
    ? `${professional.noticePeriod}${/^\d+$/.test(professional.noticePeriod) ? ' Days' : ''}`
    : '';

  const appData = {
    jobTitle: job?.title || 'React Developer',
    location: job?.location || 'Ahmedabad',
    employmentType: job?.employmentType || 'Full-time',
    jobType: job?.jobType || 'On-site',
    experience: job?.experience || '4+ Years',
    appliedAt: application?.appliedAt || '2026-03-18T10:00:00Z',
    status: application?.status || 'Applied',
    jobClosed: job?.status === 'Close',
    description: job?.description || 'Expert React developer needed for performance-critical web applications.',
  };

  return (
    <PortalLayout>
      {/* Top nav bar */}
      <div className="sticky top-[64px] z-30 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link 
            to={`/portal/${slug}/profile`} 
            className="flex items-center gap-1.5 text-xs font-black text-[#6B7280] hover:text-primary transition-all uppercase tracking-widest"
          >
            <ChevronDown className="rotate-90 w-3.5 h-3.5" />
            My Applications
          </Link>
          <span className={`px-3 py-1 text-[10px] font-black rounded-full border uppercase tracking-widest ${brandStatusStyles[appData.status] || 'bg-gray-100'}`}>
            {appData.status}
          </span>
        </div>
      </div>

      {appData.jobClosed && (
        <div className="bg-amber-50 border-b border-amber-100 py-2.5 px-6 text-center">
          <p className="text-xs font-bold text-amber-700">This position is no longer accepting applications.</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight mb-3">{appData.jobTitle}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-[#6B7280] font-medium">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#9CA3AF]" />{appData.location}</span>
              <span className="text-[#E5E7EB]">|</span>
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-[#9CA3AF]" />{appData.employmentType}</span>
              <span className="text-[#E5E7EB]">|</span>
              <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-[#9CA3AF]" />{appData.jobType}</span>
              <span className="text-[#E5E7EB]">|</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#9CA3AF]" />{appData.experience}</span>
            </div>
          </div>
          {canWithdraw && (
            <button 
              onClick={() => setIsWithdrawModalOpen(true)}
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 border-2 border-[#E5E7EB] text-[#6B7280] hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
            >
              <X className="w-3.5 h-3.5" /> Withdraw
            </button>
          )}
        </div>

        {/* Submitted label */}
        <div className="flex items-center gap-3 mb-4">
          <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest shrink-0">
            Submitted {formatDate(appData.appliedAt)}
          </p>
          <div className="h-px flex-1 bg-[#F3F4F6]" />
        </div>

        {/* Offer Summary — a collapsible section styled like the accordions below,
            kept at the top of the page as the most important thing to see. */}
        {showOfferCard && offer && (
          <div className="mb-6 bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 animate-in fade-in slide-in-from-top-2">
            <button
              type="button"
              onClick={() => setOfferExpanded(v => !v)}
              className="w-full flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-[#F9FAFB] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-0.5 h-4 bg-primary rounded-full" />
                <span className="text-xs font-black text-[#111827] uppercase tracking-widest">Offer Summary</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform duration-200 ${offerExpanded ? 'rotate-180' : ''}`} />
            </button>
            {offerExpanded && (
            <div className="border-t border-[#F3F4F6]">
            {/* Dates — "Tentative Joining Date" internally, "Expected" here */}
            <div className="px-5 sm:px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Expected Joining Date</p>
                <p className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                  {formatDate(offer.joiningDate)}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Offer Received On</p>
                <p className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#9CA3AF]" />
                  {formatDate(offer.offeredAt)}
                </p>
              </div>
            </div>

            {/* Mode-specific supporting line — shown when there's no document to
                look at, so the card never feels empty. Skipped for digital-sign,
                which instead leads with the prominent "Review & Sign" action. */}
            {!offerDoc && !offerRevoked && offer.mode !== 'digital_sign' && (
              <div className="px-5 sm:px-6 pb-5 -mt-1">
                <p className="text-xs font-medium text-[#6B7280] leading-relaxed">
                  {offer.mode === 'verbal'
                    ? 'Your offer has been shared with you directly by the recruitment team.'
                    : 'Your offer details have been sent to your registered email address.'}
                </p>
              </div>
            )}

            {offerRevoked && (
              <div className="px-5 sm:px-6 pb-5 -mt-1">
                <p className="text-xs font-medium text-[#6B7280] leading-relaxed">
                  This offer is currently on hold. The recruitment team will get in touch with you regarding the next steps.
                </p>
              </div>
            )}

            {/* Document row — digital_sign always, manual when attached */}
            {offerDoc && (
              <div className="px-5 sm:px-6 py-4 border-t border-[#F3F4F6] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F4F5FA] flex items-center justify-center text-primary border border-[#E5E7EB] shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#111827] truncate">{offerDoc.fileName}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[10px] text-[#9CA3AF] font-medium uppercase tracking-widest">
                      {fileKind(offerDoc.fileName)} · {formatFileSize(offerDoc.fileSize)}
                    </span>
                    {offer.signature && (
                      <span className={`px-2 py-0.5 text-[10px] font-black rounded-md border uppercase tracking-widest ${signaturePill[offer.signature.status]}`}>
                        {offer.signature.status === 'pending' && 'Awaiting your signature'}
                        {offer.signature.status === 'signed' && `Signed ${offer.signature.signedAt ? formatDate(offer.signature.signedAt) : ''}`}
                        {offer.signature.status === 'declined' && 'Declined'}
                      </span>
                    )}
                  </div>
                </div>
                {/* Manual attachment downloads freely. In the digital-sign flow
                    there is nothing to download until the letter is signed. */}
                {canDownload && (
                  <a
                    href={offerDoc.fileUrl}
                    className="shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs font-black text-[#6B7280] hover:text-primary hover:border-primary/30 transition-all uppercase tracking-widest shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> {sig ? 'Download Signed' : 'Download'}
                  </a>
                )}
              </div>
            )}

            {/* Actions — both buttons share the row equally (flex-1). */}
            {(showSignCta || canDecline) && (
              <div className="px-5 sm:px-6 py-4 bg-[#F9FAFB] border-t border-[#E5E7EB] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Same link that goes out in the offer email. Hidden once the
                    candidate declines — a declined offer can't be signed. */}
                {showSignCta && offer.signature && (
                  <a
                    href={offer.signature.signUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white text-xs font-black rounded-2xl hover:opacity-90 transition-all uppercase tracking-widest shadow-lg"
                  >
                    {offer.signature.status === 'signed' ? (
                      <><CheckCircle2 className="w-4 h-4" /> View Signed Offer</>
                    ) : (
                      <><PenLine className="w-4 h-4" /> Review &amp; Sign Offer</>
                    )}
                  </a>
                )}
                {canDecline && (
                  <button
                    onClick={() => setIsDeclineModalOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-[#E5E7EB] text-[#6B7280] hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs font-black rounded-2xl transition-all uppercase tracking-widest"
                  >
                    <XCircle className="w-4 h-4" /> Decline Offer
                  </button>
                )}
              </div>
            )}

            {/* Outcome footer once the candidate has responded */}
            {application.status === 'Offer Declined' && (
              <div className="px-5 sm:px-6 py-4 bg-[#FEF2F2] border-t border-[#FECACA]">
                <p className="text-xs font-bold text-[#DC2626]">
                  You declined this offer{offer.declinedAt ? ` on ${formatDate(offer.declinedAt)}` : ''}.
                </p>
                {offer.declineReason && (
                  <p className="text-xs font-medium text-[#B91C1C] mt-1">Reason: {offer.declineReason}</p>
                )}
              </div>
            )}
            {application.status === 'Offer Accepted' && (
              <div className="px-5 sm:px-6 py-4 bg-[#ECFDF3] border-t border-[#A7F3D0]">
                <p className="text-xs font-bold text-[#059669]">
                  You have accepted this offer. We look forward to having you on board!
                </p>
              </div>
            )}
            </div>
            )}
          </div>
        )}

        {/* Accordion sections */}
        <div className="space-y-3">

          <AccordionCard title="Job Summary" defaultExpanded={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">About the Role</p>
                <p className="text-sm text-[#4B5563] leading-relaxed">{appData.description}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">Key Skills Required</p>
                <div className="flex flex-wrap gap-1.5">
                  {job?.skills?.map(s => (
                    <span key={s} className="px-3 py-1 text-[11px] font-bold bg-primary/5 text-primary rounded-lg border border-primary/10">{s}</span>
                  )) || <span className="text-sm text-[#9CA3AF]">Not specified</span>}
                </div>
              </div>
            </div>
          </AccordionCard>

          <AccordionCard title="Personal Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              <InfoItem label="Full Name" value={[personal.firstName, personal.lastName].filter(Boolean).join(' ')} />
              <InfoItem label="Email Address" value={personal.email} />
              <InfoItem label="Contact Number" value={personal.contactNumber} />
              <InfoItem label="Highest Qualification" value={professional.highestQualification} />
              <div className="sm:col-span-2">
                <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1.5">LinkedIn Profile</p>
                {personal.linkedin ? (
                  <a href={`https://${String(personal.linkedin).replace('https://', '')}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline w-fit">
                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                    {personal.linkedin}
                  </a>
                ) : (
                  <span className="text-sm text-[#D1D5DB]">Not provided</span>
                )}
              </div>
              {/* Optional demographic details — mirrors the form's optional group */}
              <div className="sm:col-span-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4">
                <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-3">Additional Details (Optional)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                  <InfoItem label="Gender" value={personal.gender} />
                  <InfoItem label="Date of Birth" value={formatDob(personal.dob)} />
                  <InfoItem label="Marital Status" value={personal.maritalStatus} />
                </div>
              </div>
            </div>
          </AccordionCard>

          <AccordionCard title="Professional Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              {experiences.length > 0 && (
                <div className="sm:col-span-2 space-y-4">
                  <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">
                    Experience ({experiences.length})
                  </p>
                  {experiences.map((exp: any) => (
                    <div key={exp.id} className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                         <div>
                           <h4 className="text-sm font-black text-[#111827]">{exp.designation}</h4>
                           <p className="text-xs font-bold text-primary">{exp.company}</p>
                         </div>
                         <div className="flex items-center gap-2 shrink-0">
                           {exp.isCurrent && (
                             <span className="text-[10px] font-black uppercase tracking-widest text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-md">Current</span>
                           )}
                           <span className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] bg-white border border-[#E5E7EB] px-2.5 py-1 rounded-md">
                             {exp.from} - {exp.to}
                           </span>
                         </div>
                      </div>
                      {exp.description && <p className="text-xs font-medium text-[#4B5563] mt-3 leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              )}
              <InfoItem label="Total Experience" value={totalExperience} />
              <InfoItem label="Notice Period" value={noticePeriod} />
              <div className="sm:col-span-2 pt-1">
                <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {(professional.skills || []).length > 0 ? (professional.skills || []).map((s: string) => (
                    <span key={s} className="px-3 py-1 text-[11px] font-bold bg-primary/5 text-primary rounded-lg border border-primary/10 uppercase tracking-tight">{s}</span>
                  )) : <span className="text-sm text-[#D1D5DB]">Not provided</span>}
                </div>
              </div>
            </div>
          </AccordionCard>

          <AccordionCard title="Salary Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              <InfoItem label="CTC Type" value={salary.ctcType} />
              <InfoItem label="Currency" value={salary.currency} />
              <InfoItem label="Current CTC" value={salary.currentCtc} />
              <InfoItem label="Expected CTC" value={salary.expectedCtc} />
            </div>
          </AccordionCard>

          <AccordionCard title="Address Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              <div className="sm:col-span-2">
                <InfoItem label="Residential Address" value={address.street || address.address} />
              </div>
              <InfoItem label="Town / City" value={address.city} />
              <InfoItem label="State" value={address.state} />
              <InfoItem label="Country" value={address.country} />
              <InfoItem label="Zip / Postal Code" value={address.zip || address.zipCode} />
            </div>
          </AccordionCard>

          {customFields.length > 0 && (
            <AccordionCard title="Additional Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                {customFields.map((field: any) => {
                  const answer = customAnswers[field.id] ?? customAnswers[field.label];
                  const isUrl = typeof answer === 'string' && /^https?:\/\//.test(answer);
                  return (
                    <div key={field.id} className={field.type === 'Text' ? 'sm:col-span-2' : ''}>
                      <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1.5">{field.label}</p>
                      {isUrl ? (
                        <a href={answer} target="_blank" rel="noreferrer"
                          className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5 w-fit">
                          <Globe className="w-3.5 h-3.5" />
                          {answer}
                        </a>
                      ) : (
                        <div className="text-sm font-semibold text-[#111827] leading-relaxed">
                          {answer || <span className="text-[#D1D5DB] font-normal">Not provided</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </AccordionCard>
          )}

          <AccordionCard title="Resume">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F4F5FA] flex items-center justify-center text-primary border border-[#E5E7EB] shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#111827] truncate">{application.resumeUrl || 'Resume.pdf'}</p>
                <p className="text-[10px] text-[#9CA3AF] font-medium uppercase tracking-widest mt-0.5">PDF · 2.4 MB</p>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs font-black text-[#6B7280] hover:text-primary hover:border-primary/30 transition-all uppercase tracking-widest shadow-sm">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </AccordionCard>

        </div>
      </div>

      {/* Decline Offer Modal */}
      {isDeclineModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#111827]/60 backdrop-blur-sm" onClick={() => setIsDeclineModalOpen(false)} />
          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden border border-[#E5E7EB] animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                <XCircle className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-[#111827] tracking-tight mb-2">Decline this offer?</h3>
              <p className="text-[#6B7280] text-sm font-medium leading-relaxed mb-6">
                You're about to decline the offer for <span className="font-black text-[#111827]">{job.title}</span>.
                This cannot be undone and the recruitment team will be notified.
              </p>
              <div className="mb-7">
                <label className="block text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">
                  Reason <span className="text-[#D1D5DB]">(Optional)</span>
                </label>
                <textarea
                  value={declineReason}
                  onChange={e => setDeclineReason(e.target.value)}
                  rows={3}
                  placeholder="Let the team know why you're declining…"
                  className="w-full px-4 py-3 text-sm font-medium text-[#111827] bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl outline-none focus:border-primary/40 focus:bg-white transition-all resize-none placeholder:text-[#D1D5DB]"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeclineModalOpen(false)}
                  className="flex-1 px-6 py-3.5 bg-[#F9FAFB] text-[#111827] text-xs font-black rounded-2xl hover:bg-[#F3F4F6] transition-all uppercase tracking-widest border border-[#E5E7EB]"
                >
                  Keep Offer
                </button>
                <button
                  onClick={() => {
                    declineOffer(application.id, declineReason.trim() || undefined);
                    setIsDeclineModalOpen(false);
                    setDeclineReason('');
                  }}
                  className="flex-1 px-6 py-3.5 bg-red-600 text-white text-xs font-black rounded-2xl hover:bg-red-700 transition-all uppercase tracking-widest shadow-lg"
                >
                  Yes, Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#111827]/60 backdrop-blur-sm" onClick={() => setIsWithdrawModalOpen(false)} />
          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden border border-[#E5E7EB] animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-[#111827] tracking-tight mb-2">Withdraw Application?</h3>
              <p className="text-[#6B7280] text-sm font-medium leading-relaxed mb-7">
                Are you sure you want to withdraw your application for <span className="font-black text-[#111827]">{job.title}</span>?
                This action cannot be undone and the recruiter will be notified.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="flex-1 px-6 py-3.5 bg-[#F9FAFB] text-[#111827] text-xs font-black rounded-2xl hover:bg-[#F3F4F6] transition-all uppercase tracking-widest border border-[#E5E7EB]"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    withdrawApplication(application.id);
                    setIsWithdrawModalOpen(false);
                    navigate(`/portal/${slug}/profile`);
                  }}
                  className="flex-1 px-6 py-3.5 bg-red-600 text-white text-xs font-black rounded-2xl hover:bg-red-700 transition-all uppercase tracking-widest shadow-lg"
                >
                  Yes, Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}

function AccordionCard({ title, children, defaultExpanded = true }: { title: string; children: React.ReactNode; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-[#F9FAFB] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-0.5 h-4 bg-primary rounded-full" />
          <span className="text-xs font-black text-[#111827] uppercase tracking-widest">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="px-4 sm:px-6 pb-6 pt-4 border-t border-[#F3F4F6]">
          {children}
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">{label}</p>
      <div className="text-sm font-semibold text-[#111827] leading-relaxed">
        {value || <span className="text-[#D1D5DB] font-normal">Not provided</span>}
      </div>
    </div>
  );
}
