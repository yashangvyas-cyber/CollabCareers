import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import AuthModal from '../components/AuthModal';
import { 
  MapPin, Briefcase, Building2, Clock, 
  ArrowRight, Bookmark, ChevronRight, ArrowLeft, Copy, CheckCheck, X 
} from 'lucide-react';
import { useApp } from '../store/AppContext';

const formatExperience = (exp: string) => {
  if (!exp) return '';
  const match = exp.match(/^(\d+)/);
  if (match) {
    return `${match[1]}+ Years Experience`;
  }
  return exp;
};

export default function JobDetailPage() {
  const { jobId } = useParams();
  const { jobs, currentUser } = useApp();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'register' | 'signin'>('register');
  const [copied, setCopied] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showReapplyModal, setShowReapplyModal] = useState(false);
  const { applications } = useApp();

  // Find job from state, or fallback to first job
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

  const previousApp = applications
    .filter(a => a.candidateId === currentUser?.id && a.status === 'Submitted')
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())[0];

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentUser) {
      if (previousApp) {
        setShowReapplyModal(true);
      } else {
        navigate(`/portal/yopmails/apply/${job.id}`);
      }
    } else {
      setAuthTab('register');
      setShowAuthModal(true);
    }
  };

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setAuthTab('signin');
    setShowAuthModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamic similar jobs (excluding current)
  const similarJobs = jobs.filter(j => j.id !== job.id).slice(0, 3);

  return (
    <PortalLayout>
      {/* Top Navigation & Breadcrumb */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-6">
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
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT COLUMN — Comprehensive Job Details */}
          <div className="flex-1 min-w-0 space-y-8">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
              <h1 className="text-3xl font-black text-[#111827] mb-4">{job.title}</h1>

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-6 text-[13px] text-[#6B7280] mb-6 font-medium">
                <span className="group relative flex items-center gap-2 cursor-help">
                  <MapPin className="w-4 h-4 text-[#3538CD]" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#111827] text-white text-[9px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl z-10">Location</span>
                  {job.location}
                </span>
                <span className="group relative flex items-center gap-2 cursor-help">
                  <Briefcase className="w-4 h-4 text-[#3538CD]" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#111827] text-white text-[9px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl z-10">Employment Type</span>
                  {job.employmentType}
                </span>
                <span className="group relative flex items-center gap-2 cursor-help">
                  <Building2 className="w-4 h-4 text-[#3538CD]" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#111827] text-white text-[9px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl z-10">Job Type</span>
                  {job.jobType}
                </span>
                <span className="group relative flex items-center gap-2 cursor-help">
                  <Clock className="w-4 h-4 text-[#3538CD]" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#111827] text-white text-[9px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl z-10">Experience</span>
                  {formatExperience(job.experience)}
                </span>
              </div>


              {/* Required Skills */}
              <div className="mb-10">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-[#9CA3AF] mb-4">Required Skills</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {(showAllSkills ? job.skills : job.skills?.slice(0, 4))?.map((skill) => (
                    <span key={skill} className="px-4 py-1.5 text-xs font-bold bg-white text-[#374151] border border-[#E5E7EB] rounded-full shadow-sm hover:border-[#3538CD]/30 transition-colors animate-in fade-in zoom-in-95 duration-300">
                      {skill}
                    </span>
                  ))}
                  {(job.skills?.length ?? 0) > 4 && (
                    <button 
                      onClick={() => setShowAllSkills(!showAllSkills)}
                      className="px-4 py-1.5 text-xs font-black text-[#3538CD] bg-[#3538CD]/5 border border-[#3538CD]/20 rounded-full shadow-sm hover:bg-[#3538CD]/10 transition-all uppercase tracking-widest"
                    >
                      {showAllSkills ? 'Show Less' : `+${(job.skills?.length ?? 0) - 4} more`}
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t border-[#F3F4F6] my-10" />

              {/* About This Role */}
              <div className="mb-12 border-l-2 border-[#3538CD] pl-8">
                <h2 className="text-xl font-black text-[#111827] mb-6">About This Role</h2>
                <div className="text-[15px] text-[#374151] leading-relaxed space-y-6 font-medium whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>

              {/* Evaluation Criteria */}
              {job.evaluationCriteria && job.evaluationCriteria.length > 0 && (
                <div className="mb-12 border-l-2 border-[#3538CD] pl-8">
                  <h2 className="text-xl font-black text-[#111827] mb-6">Evaluation Criteria</h2>
                  <ul className="space-y-4">
                    {job.evaluationCriteria.map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-[15px] text-[#374151] font-medium leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3538CD] mt-2.5 shrink-0" />
                        {(item as any)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}


            </div>
          </div>

          {/* RIGHT COLUMN — Sticky Apply Card */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl overflow-hidden shadow-[#3538CD]/5">
                {/* Visual Header */}
                <div className="px-8 py-6 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Posted 3 days ago</p>
                      <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Job ID: <span className="text-[#111827]">JB-9921</span></p>
                   </div>
                </div>

                <div className="p-8">
                  <div className="mb-8">
                    <h3 className="text-xl font-black text-[#111827] mb-2">Apply for this role</h3>
                  </div>



                  <button
                    onClick={handleApplyClick}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-[#3538CD] text-white text-base font-bold rounded-xl hover:bg-[#292bb0] transition-all transform hover:translate-y-[-2px] shadow-lg shadow-[#3538CD]/20 mb-6"
                  >
                    Apply Now <ArrowRight className="w-5 h-5" />
                  </button>

                  <div className="text-center mb-6">
                    <p className="text-[11px] text-[#9CA3AF] font-bold uppercase tracking-widest mb-3">Already applied here before?</p>
                    <button
                      onClick={handleSignInClick}
                      className="text-[13px] font-black text-[#3538CD] hover:underline"
                    >
                      Sign In
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-[#E5E7EB] text-[#374151] text-xs font-black rounded-xl hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all uppercase tracking-widest group">
                      <Bookmark className="w-4 h-4 group-hover:fill-[#111827]" /> Save
                    </button>
                    <div className="relative">
                      <button 
                        onClick={handleCopyLink}
                        className="p-3.5 border-2 border-[#E5E7EB] text-[#6B7280] rounded-xl hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all relative"
                      >
                        {copied ? <CheckCheck className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      {copied && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded whitespace-nowrap animate-in fade-in slide-in-from-bottom-1 duration-200">
                          Link copied!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Jobs Section */}
        <div className="mt-24 border-t border-[#E5E7EB] pt-16">
          <h2 className="text-2xl font-black text-[#111827] mb-10 flex items-center gap-3">
             Similar Jobs
             <span className="px-2.5 py-1 bg-[#F4F5FA] text-[#3538CD] text-[12px] rounded-full font-bold">3 Opportunities</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarJobs.map((js) => (
              <Link 
                key={js.id} 
                to={`/portal/yopmails/job/${js.id}`}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm hover:border-[#3538CD]/30 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-base font-black text-[#111827] group-hover:text-[#3538CD] transition-colors line-clamp-1">{js.title}</h3>
                  <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider whitespace-nowrap">Posted Today</span>
                </div>
                
                <p className="text-xs font-bold text-[#6B7280] mb-4">{js.businessUnit}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-[#F9FAFB] text-[#6B7280] text-[10px] font-black rounded uppercase">{js.location}</span>
                  <span className="px-2 py-1 bg-[#F9FAFB] text-[#6B7280] text-[10px] font-black rounded uppercase">{js.employmentType}</span>
                  <span className="px-2 py-1 bg-[#F9FAFB] text-[#6B7280] text-[10px] font-black rounded uppercase">{formatExperience(js.experience)}</span>
                </div>

                {/* Added Skill Chips for context */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#F3F4F6]">
                  {js.skills?.slice(0, 2).map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-white border border-[#E5E7EB] text-[#4B5563] text-[9px] font-bold rounded-lg uppercase tracking-tight">
                      {skill}
                    </span>
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

          <div className="mt-12 text-center">
            <Link 
              to="/portal/yopmails" 
              className="inline-flex items-center gap-2 text-sm font-black text-[#3538CD] uppercase tracking-widest hover:gap-3 transition-all"
            >
              View All Open Positions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        jobTitle={job.title}
        businessUnit={job.businessUnit}
        jobId={job.id}
        initialTab={authTab}
      />

      <ReapplyModal 
        isOpen={showReapplyModal}
        onClose={() => setShowReapplyModal(false)}
        candidateName={currentUser?.firstName || ''}
        previousJobTitle={jobs.find(j => j.id === previousApp?.jobId)?.title || 'Previous Job'}
        onContinue={() => navigate(`/portal/yopmails/apply/${job.id}`, { state: { prefillFrom: previousApp?.id } })}
        onStartFresh={() => navigate(`/portal/yopmails/apply/${job.id}`)}
      />
    </PortalLayout>
  );
}

function ReapplyModal({ isOpen, onClose, candidateName, previousJobTitle, onContinue, onStartFresh }: any) {
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
            <p className="text-[#6B7280] font-bold">We found your previous application for <span className="text-[#111827]">{previousJobTitle}</span>.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={onContinue}
              className="p-8 bg-white border-2 border-[#E5E7EB] rounded-3xl text-left hover:border-[#3538CD] group transition-all"
            >
              <div className="w-12 h-12 bg-[#3538CD]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Copy className="w-6 h-6 text-[#3538CD]" />
              </div>
              <h3 className="text-lg font-black text-[#111827] mb-2">Use Previous Application</h3>
              <p className="text-sm font-bold text-[#6B7280] leading-relaxed mb-6">We'll prefill all your details. You only need to fill new custom fields for this job.</p>
              <span className="inline-flex items-center gap-2 text-sm font-black text-[#3538CD] uppercase tracking-widest">
                Yes, Continue <ArrowRight className="w-4 h-4" />
              </span>
            </button>

            <button 
              onClick={onStartFresh}
              className="p-8 bg-white border-2 border-[#E5E7EB] rounded-3xl text-left hover:border-gray-900 group transition-all"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ArrowRight className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-lg font-black text-[#111827] mb-2">Start Fresh</h3>
              <p className="text-sm font-bold text-[#6B7280] leading-relaxed mb-6">Fill the application form from scratch.</p>
              <span className="inline-flex items-center gap-2 text-sm font-black text-gray-900 border-b-2 border-gray-900 uppercase tracking-widest">
                Start Fresh
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
