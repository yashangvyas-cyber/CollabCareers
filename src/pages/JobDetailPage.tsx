import { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import AuthModal from '../components/AuthModal';
import {
  MapPin, Briefcase, Building2, Clock,
  ArrowRight, Bookmark, ChevronRight, ArrowLeft, Copy, CheckCheck, X, CheckCircle
} from 'lucide-react';
import { useApp } from '../store/AppContext';

const formatPostedDate = (dateStr?: string): string => {
  if (!dateStr) return 'Posted Recently';
  const date = new Date(dateStr);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffDays === 0) return 'Posted Today';
  if (diffDays === 1) return 'Posted Yesterday';
  if (diffDays < 7) return `Posted ${diffDays} days ago`;
  return `Posted ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
};

const jobCode = (id: string) => {
  const num = parseInt(id.replace(/\D/g, '')) || 0;
  return `JB-${String(num + 9000)}`;
};

function renderDescription(text: string) {
  const paragraphs = text.split('\n\n').filter(Boolean);
  return paragraphs.map((para, i) => {
    const lines = para.split('\n').filter(Boolean);
    const firstLine = lines[0]?.trim() ?? '';
    const isHeading = firstLine.endsWith(':') && lines.length > 1;
    const bulletLines = lines.filter(l => l.trim().startsWith('•'));
    const hasBullets = bulletLines.length > 0;

    if (hasBullets) {
      return (
        <div key={i} className="space-y-3">
          {isHeading && (
            <h3 className="text-base font-black text-[#111827]">
              {firstLine.slice(0, -1)}
            </h3>
          )}
          <ul className="space-y-2.5">
            {bulletLines.map((b, j) => (
              <li key={j} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3538CD] mt-[7px] shrink-0" />
                <span className="text-[15px] text-[#374151] leading-relaxed font-medium">
                  {b.replace(/^•\s*/, '').trim()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (isHeading) {
      const body = lines.slice(1).join(' ');
      return (
        <div key={i} className="space-y-2">
          <h3 className="text-base font-black text-[#111827]">{firstLine.slice(0, -1)}</h3>
          {body && <p className="text-[15px] text-[#374151] leading-relaxed font-medium">{body}</p>}
        </div>
      );
    }

    return (
      <p key={i} className="text-[15px] text-[#374151] leading-relaxed font-medium">
        {para}
      </p>
    );
  });
}

export default function JobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, currentUser, applications, toggleSaveJob } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'register' | 'signin'>('register');
  const [authRedirectTo, setAuthRedirectTo] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [showReapplyModal, setShowReapplyModal] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const pendingSaveJobId = useRef<string | null>(null);

  const job = jobs.find(j => j.id === jobId) || jobs[0];

  if (!job) {
    return (
      <PortalLayout>
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-500 mb-8">The job you're looking for might have been moved or removed.</p>
          <Link to="/portal/yopmails" className="px-6 py-3 bg-[#3538CD] text-white font-bold rounded-xl uppercase tracking-widest text-xs">
            Back to All Jobs
          </Link>
        </div>
      </PortalLayout>
    );
  }

  const existingApplication = applications.find(
    a => a.candidateId === currentUser?.id && a.jobId === job.id && a.status !== 'Draft'
  );
  const previousApp = applications
    .filter(a => a.candidateId === currentUser?.id && a.status === 'Submitted')
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())[0];

  useEffect(() => {
    if (currentUser && pendingSaveJobId.current) {
      const jobIdToSave = pendingSaveJobId.current;
      pendingSaveJobId.current = null;
      if (!currentUser.savedJobIds?.includes(jobIdToSave)) toggleSaveJob(jobIdToSave);
      setSaveToast(false);
    }
  }, [currentUser]);

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentUser) {
      if (previousApp) setShowReapplyModal(true);
      else navigate(`/portal/yopmails/apply/${job.id}`);
    } else {
      setAuthTab('register');
      setAuthRedirectTo(`/portal/yopmails/apply/${job.id}`);
      setShowAuthModal(true);
    }
  };

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setAuthTab('signin');
    setAuthRedirectTo(undefined);
    setShowAuthModal(true);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser) {
      pendingSaveJobId.current = job.id;
      setSaveToast(true);
      setAuthTab('signin');
      setShowAuthModal(true);
    } else {
      toggleSaveJob(job.id);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSaved = currentUser?.savedJobIds?.includes(job.id);
  const similarJobs = jobs.filter(j => j.id !== job.id).slice(0, 3);

  const metaItems = [
    { label: 'Posted', value: formatPostedDate(job.createdAt) },
    { label: 'Job ID', value: jobCode(job.id) },
    { label: 'Location', value: job.location, icon: <MapPin className="w-3.5 h-3.5 text-[#3538CD]" /> },
    { label: 'Department', value: job.businessUnit, icon: <Building2 className="w-3.5 h-3.5 text-[#3538CD]" /> },
    { label: 'Employment Type', value: job.employmentType, icon: <Briefcase className="w-3.5 h-3.5 text-[#3538CD]" /> },
    { label: 'Work Mode', value: job.jobType, icon: <Building2 className="w-3.5 h-3.5 text-[#3538CD]" /> },
    { label: 'Experience', value: job.experience, icon: <Clock className="w-3.5 h-3.5 text-[#3538CD]" /> },
  ];

  return (
    <PortalLayout>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6 py-3">
            <Link to="/portal/yopmails" className="flex items-center gap-2 text-xs font-black text-[#3538CD] uppercase tracking-widest hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to all jobs
            </Link>
            <div className="w-[1px] h-4 bg-[#E5E7EB]" />
            <nav className="flex items-center gap-1.5 text-sm">
              <Link to="/portal/yopmails" className="text-[#6B7280] hover:text-[#3538CD] transition-colors">{job.businessUnit} Jobs</Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
              <span className="text-[#111827] font-medium">{job.title}</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* ── LEFT: Job title + full description ── */}
          <div className="flex-1 min-w-0">
            {/* Title block */}
            <div className="mb-8">
              <p className="text-xs font-black text-[#9CA3AF] uppercase tracking-widest mb-2">{job.businessUnit}</p>
              <h1 className="text-4xl font-black text-[#111827] leading-tight mb-3">{job.title}</h1>
              <p className="text-sm text-[#9CA3AF] font-medium">{formatPostedDate(job.createdAt)}</p>
            </div>

            {/* JD content */}
            <div className="space-y-7">
              {renderDescription(job.description)}
            </div>
          </div>

          {/* ── RIGHT: Sticky apply card ── */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="sticky top-24 space-y-4">

              {/* CTA card */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
                {existingApplication ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-50 text-emerald-600 border border-emerald-200 text-sm font-bold rounded-xl cursor-default">
                      <CheckCircle className="w-5 h-5" /> Application Submitted
                    </div>
                    <button
                      onClick={() => navigate(`/portal/yopmails/application/${existingApplication.id}`)}
                      className="w-full text-center text-[11px] font-black text-[#3538CD] hover:underline uppercase tracking-widest"
                    >
                      Track Status
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleApplyClick}
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#3538CD] text-white text-sm font-bold rounded-xl hover:bg-[#292bb0] transition-all shadow-lg shadow-[#3538CD]/20 mb-3"
                    >
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </button>
                    {!currentUser && (
                      <p className="text-center text-[13px] text-[#6B7280] mb-4">
                        Have an account?{' '}
                        <button onClick={handleSignInClick} className="font-black text-[#3538CD] hover:underline">Sign In</button>
                      </p>
                    )}
                  </>
                )}

                <div className="flex items-center gap-3 mt-1">
                  <button
                    onClick={handleSaveClick}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 rounded-xl text-xs font-black transition-all uppercase tracking-widest group ${
                      isSaved
                        ? 'bg-[#3538CD]/5 border-[#3538CD] text-[#3538CD]'
                        : 'border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB] hover:border-[#D1D5DB]'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#3538CD]' : 'group-hover:fill-[#111827]'}`} />
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                  <div className="relative group/copy">
                    <button
                      onClick={handleCopyLink}
                      className="p-3 border-2 border-[#E5E7EB] text-[#6B7280] rounded-xl hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all"
                    >
                      {copied ? <CheckCheck className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded whitespace-nowrap pointer-events-none transition-all ${copied ? 'opacity-100' : 'opacity-0 group-hover/copy:opacity-100'}`}>
                      {copied ? 'Link copied!' : 'Copy job link'}
                    </div>
                  </div>
                </div>

                {saveToast && (
                  <div className="flex items-center gap-2 px-4 py-3 mt-4 bg-amber-50 border border-amber-200 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <Bookmark className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-[12px] font-bold text-amber-800">Sign in to save jobs</span>
                  </div>
                )}
              </div>

              {/* Job details card */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
                <h3 className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest mb-4">Job Details</h3>
                <div className="space-y-4">
                  {metaItems.map(({ label, value, icon }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                        {icon ?? <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB]" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest leading-none mb-1">{label}</p>
                        <p className="text-sm font-bold text-[#111827]">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills card */}
              {(job.skills?.length ?? 0) > 0 && (
                <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
                  <h3 className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest mb-4">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 text-xs font-bold bg-[#F4F5FA] text-[#3538CD] border border-[#3538CD]/10 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Similar Jobs */}
        <div className="mt-20 pt-16 border-t border-[#E5E7EB]">
          <h2 className="text-2xl font-black text-[#111827] mb-8 flex items-center gap-3">
            Similar Jobs
            <span className="px-2.5 py-1 bg-[#F4F5FA] text-[#3538CD] text-[12px] rounded-full font-bold">{similarJobs.length} Opportunities</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {similarJobs.map(js => (
              <Link
                key={js.id}
                to={`/portal/yopmails/job/${js.id}`}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm hover:border-[#3538CD]/30 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-black text-[#111827] group-hover:text-[#3538CD] transition-colors line-clamp-1">{js.title}</h3>
                  <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider whitespace-nowrap ml-2">Posted Today</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="px-2 py-0.5 bg-[#F9FAFB] text-[#6B7280] text-[10px] font-black rounded uppercase">{js.location}</span>
                  <span className="px-2 py-0.5 bg-[#F9FAFB] text-[#6B7280] text-[10px] font-black rounded uppercase">{js.employmentType}</span>
                  <span className="px-2 py-0.5 bg-[#F9FAFB] text-[#6B7280] text-[10px] font-black rounded uppercase">{js.experience}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#F3F4F6]">
                  {js.skills?.slice(0, 2).map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-white border border-[#E5E7EB] text-[#4B5563] text-[9px] font-bold rounded-lg uppercase tracking-tight">{skill}</span>
                  ))}
                  {(js.skills?.length ?? 0) > 2 && (
                    <span className="px-2 py-0.5 text-[#9CA3AF] text-[9px] font-bold uppercase">+{(js.skills?.length ?? 0) - 2}</span>
                  )}
                </div>
                <div className="flex items-center justify-end mt-4">
                  <span className="text-xs font-black text-[#3538CD] flex items-center gap-1 uppercase tracking-widest group-hover:gap-2 transition-all">
                    View & Apply <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/portal/yopmails" className="inline-flex items-center gap-2 text-sm font-black text-[#3538CD] uppercase tracking-widest hover:gap-3 transition-all">
              View All Open Positions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          if (!currentUser) { pendingSaveJobId.current = null; setSaveToast(false); }
        }}
        jobTitle={job.title}
        businessUnit={job.businessUnit}
        jobId={job.id}
        initialTab={authTab}
        redirectTo={authRedirectTo}
        onAuthSuccess={() => {}}
      />

      <ReapplyModal
        isOpen={showReapplyModal}
        onClose={() => setShowReapplyModal(false)}
        candidateName={currentUser?.firstName || ''}
        onContinue={() => navigate(`/portal/yopmails/apply/${job.id}`, { state: { prefillFrom: previousApp?.id } })}
        onStartFresh={() => navigate(`/portal/yopmails/apply/${job.id}`)}
      />
    </PortalLayout>
  );
}

function ReapplyModal({ isOpen, onClose, candidateName, onContinue, onStartFresh }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[#111827]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-10">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-[#111827] mb-2 tracking-tight">Welcome back, {candidateName}!</h2>
            <p className="text-[#6B7280] font-bold">We noticed you've applied with us before. Want to use your saved details?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={onContinue} className="p-8 bg-white border-2 border-[#E5E7EB] rounded-3xl text-left hover:border-[#3538CD] group transition-all">
              <div className="w-12 h-12 bg-[#3538CD]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Copy className="w-6 h-6 text-[#3538CD]" />
              </div>
              <h3 className="text-lg font-black text-[#111827] mb-2">Pick up where you left off</h3>
              <p className="text-sm font-bold text-[#6B7280] leading-relaxed mb-6">We'll carry over your resume, details, and answers. Just review and update anything that's changed.</p>
              <span className="inline-flex items-center gap-2 text-sm font-black text-[#3538CD] tracking-tight">Continue with saved details <ArrowRight className="w-4 h-4" /></span>
            </button>
            <button onClick={onStartFresh} className="p-8 bg-white border-2 border-[#E5E7EB] rounded-3xl text-left hover:border-gray-900 group transition-all">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ArrowRight className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-lg font-black text-[#111827] mb-2">Start from scratch</h3>
              <p className="text-sm font-bold text-[#6B7280] leading-relaxed mb-6">Prefer to fill everything fresh? No problem.</p>
              <span className="inline-flex items-center gap-2 text-sm font-black text-gray-900 border-b-2 border-gray-900 tracking-tight">Start fresh <ArrowRight className="w-4 h-4" /></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
