import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { Briefcase, Mail, Phone, MapPin, FileText, ExternalLink, Linkedin, LogOut, ArrowRight, Clock } from 'lucide-react';
import { useApp } from '../store/AppContext';

const brandStatusStyles: Record<string, string> = {
  'Under Review': 'bg-[#F4F5FA] text-[#3538CD] border-[#3538CD]/20',
  'Interview in Progress': 'bg-[#F4F5FA] text-[#3538CD] border-[#3538CD]/20',
  'Decision Made': 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]',
  'Offer Made': 'bg-[#3538CD] text-white border-[#3538CD]',
  'Rejected': 'bg-gray-100 text-gray-400 border-gray-200',
  'Draft': 'bg-[#F4F5FA] text-[#3538CD] border border-[#3538CD]/20',
  'Submitted': 'bg-[#F4F5FA] text-[#3538CD] border-[#3538CD]/20',
};


const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function CandidateProfilePage() {
  const { currentUser, logoutCandidate, applications, jobs } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'applications' | 'saved'>('applications');

  // Populate mock saved jobs from actual jobs list
  const savedJobs = [
    { ...jobs[0], company: jobs[0]?.businessUnit || 'Yopmails', type: jobs[0]?.employmentType },
    { ...jobs[2], company: jobs[2]?.businessUnit || 'Yopmails', type: jobs[2]?.employmentType },
    { ...jobs[1], company: jobs[1]?.businessUnit || 'Yopmails', type: jobs[1]?.employmentType, status: 'Close' as const }
  ].filter(j => !!j.id).slice(0, 3);

  // Get user applications
  const userApps = applications
    .filter(a => a.candidateId === currentUser?.id)
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

  const displayApps = userApps.map(a => {
    const job = jobs.find(j => j.id === a.jobId);
    return {
      ...a,
      company: job?.businessUnit || 'Yopmails',
      title: job?.title || 'Job Opportunity',
      jobClosed: job?.status === 'Close',
    };
  });

  // Derive profile data from the latest application
  const latestApp = userApps[0];
  const profileData = latestApp?.answers?._fullFormData;

  const derivedProfile = {
    phone: profileData?.personal?.contactNumber || null,
    location: profileData?.address?.city 
      ? `${profileData.address.city}, ${profileData.address.country}`
      : null,
    linkedin: profileData?.personal?.linkedin || null,
    designation: profileData?.professional?.currentDesignation || null,
    currentOrg: profileData?.professional?.currentOrg || null,
    noticePeriod: profileData?.professional?.noticePeriod || null,
    skills: profileData?.professional?.skills || [],
    resumeName: latestApp?.resumeUrl || null,
  };

  const handleLogout = () => {
    logoutCandidate();
    navigate('/portal/yopmails');
  };

  return (
    <PortalLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT: Profile Sidebar */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 sticky top-[80px]">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-[#3538CD]/10 text-[#3538CD] flex items-center justify-center text-3xl font-black mx-auto mb-4">
                {currentUser?.firstName?.charAt(0) || 'Y'}
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-xl font-black text-[#111827]">{currentUser?.firstName} {currentUser?.lastName}</h2>
                {derivedProfile.designation && (
                  <p className="text-sm font-bold text-[#6B7280] mt-1">{derivedProfile.designation}</p>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="mt-4 px-4 py-2 border border-[#E5E7EB] text-gray-500 text-xs font-black rounded-lg hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 transition-colors w-full uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>

              <div className="border-t border-[#F3F4F6] my-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-medium text-[#374151]">
                  <span title="Email"><Mail className="w-4 h-4 text-[#6B7280] shrink-0" /></span>
                  <span className="truncate">{currentUser?.email}</span>
                </div>
                {derivedProfile.phone && (
                  <div className="flex items-center gap-3 text-sm font-medium text-[#374151]">
                     <span title="Phone"><Phone className="w-4 h-4 text-[#6B7280] shrink-0" /></span>
                     <span>{derivedProfile.phone}</span>
                  </div>
                )}
                {derivedProfile.location && (
                  <div className="flex items-center gap-3 text-sm font-medium text-[#374151]">
                     <span title="Location"><MapPin className="w-4 h-4 text-[#6B7280] shrink-0" /></span>
                     <span className="truncate">{derivedProfile.location}</span>
                  </div>
                )}
                {derivedProfile.linkedin && (
                  <div className="flex items-center gap-3">
                     <span title="LinkedIn"><Linkedin className="w-4 h-4 text-[#0A66C2] shrink-0" /></span>
                     <a href={`https://${derivedProfile.linkedin.replace('https://', '')}`} target="_blank" className="text-sm font-bold text-[#3538CD] hover:underline">LinkedIn Profile</a>
                  </div>
                )}
              </div>

              <div className="border-t border-[#F3F4F6] my-6" />

              {/* Resume */}
              <div>
                <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-3">Professional Resume</p>
                {derivedProfile.resumeName ? (
                  <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] group transition-all hover:bg-white hover:border-[#3538CD]/30">
                    <FileText className="w-5 h-5 text-[#3538CD]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#111827] truncate">{derivedProfile.resumeName}</p>
                      <p className="text-[10px] text-[#6B7280] font-bold">Latest Uploaded</p>
                    </div>
                    <button className="text-[#3538CD] hover:scale-110 transition-transform">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs font-bold text-[#6B7280] italic">No resume uploaded</p>
                )}
              </div>

              {derivedProfile.skills.length > 0 && (
                <div>
                  <div className="border-t border-[#F3F4F6] my-6" />
                  <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-3">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {derivedProfile.skills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1 text-[10px] font-bold bg-[#F4F5FA] text-[#3538CD] border border-[#3538CD]/10 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(derivedProfile.currentOrg || derivedProfile.noticePeriod) && (
                <div>
                  <div className="border-t border-[#F3F4F6] my-6" />
                  <div className="space-y-4">
                    {derivedProfile.currentOrg && (
                      <div className="flex items-center gap-3 text-sm font-medium text-[#374151]">
                        <span title="Current Organization"><Briefcase className="w-4 h-4 text-[#6B7280] shrink-0" /></span>
                        <span className="truncate" title={derivedProfile.currentOrg}>{derivedProfile.currentOrg}</span>
                      </div>
                    )}
                    {derivedProfile.noticePeriod && (
                      <div className="flex items-center gap-3 text-sm font-medium text-[#374151]">
                        <span title="Notice Period"><Clock className="w-4 h-4 text-[#6B7280] shrink-0" /></span>
                        <span>{derivedProfile.noticePeriod} days</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Main Content */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-[#F4F5FA] p-1 rounded-2xl mb-8 w-fit">
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all rounded-xl flex items-center gap-2 ${
                  activeTab === 'applications' ? 'bg-white text-[#3538CD] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Applications
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'applications' ? 'bg-[#3538CD] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {displayApps.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all rounded-xl flex items-center gap-2 ${
                  activeTab === 'saved' ? 'bg-white text-[#3538CD] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Saved
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'saved' ? 'bg-[#3538CD] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {savedJobs.length}
                </span>
              </button>
            </div>

            <div className="space-y-4">
              {activeTab === 'applications' ? (
                displayApps.map((app: any) => (
                  <div key={app.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-[#3538CD]/40 hover:shadow-xl hover:shadow-[#3538CD]/5 transition-all duration-300 relative group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#3538CD]/5 group-hover:bg-[#3538CD]/20 transition-all" />
                    
                    <div className="flex-1 min-w-0 pr-12">
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 mb-3">
                        <h4 className="text-[22px] font-black text-[#111827] group-hover:text-[#3538CD] transition-colors tracking-tighter leading-tight">
                          {app.title}
                        </h4>
                        <span className={`w-fit px-4 py-1.5 text-[10px] font-black rounded-full border uppercase tracking-widest shadow-sm shrink-0 ${brandStatusStyles[app.status as keyof typeof brandStatusStyles] || 'bg-gray-100'}`}>
                          {app.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs">
                        <p className="font-bold text-[#6B7280]">{app.company}</p>
                        <span className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
                        <p className="font-black text-[#9CA3AF] uppercase tracking-widest text-[9px]">{formatDate(app.appliedAt)}</p>
                        {app.jobClosed && (
                          <div className="flex items-center gap-1.5 ml-2 text-[9px] font-black text-[#f87171] uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                            Archived
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="shrink-0">
                      {app.status === 'Draft' && !app.jobClosed ? (
                        <button 
                          onClick={() => navigate(`/portal/yopmails/apply/${app.jobId}`, { state: { continueDraft: true, draftJobTitle: app.title, lastSaved: app.appliedAt } })}
                          className="flex items-center gap-2 bg-[#3538CD] text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#292bb0] transition-all shadow-lg shadow-[#3538CD]/20 active:scale-95 whitespace-nowrap"
                        >
                          Continue Application <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <Link 
                          to={`/portal/yopmails/application/${app.id}`} 
                          className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#E5E7EB] text-[#6B7280] hover:text-[#3538CD] hover:border-[#3538CD]/50 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 whitespace-nowrap group/btn"
                        >
                          View Details <ArrowIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                savedJobs.map((js: any) => {
                  const isClosed = js.status === 'Close';
                  return (
                    <div 
                      key={js.id} 
                      className={`bg-white rounded-2xl border border-[#E5E7EB] p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-[#3538CD]/40 hover:shadow-xl hover:shadow-[#3538CD]/5 transition-all duration-300 relative group ${isClosed ? 'opacity-80' : ''}`}
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#3538CD]/5 group-hover:bg-[#3538CD]/20 transition-all" />
                      
                      <div className="flex-1 min-w-0 pr-12">
                        <h4 className={`text-[22px] font-black transition-colors tracking-tighter leading-tight mb-3 ${isClosed ? 'text-gray-400' : 'text-[#111827] group-hover:text-[#3538CD]'}`}>
                          {js.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          <p className="font-bold text-[#6B7280]">{js.company}</p>
                          <span className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
                          <p className="font-medium text-[#6B7280]">{js.location}</p>
                          <span className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
                          <p className="font-black text-[#9CA3AF] uppercase tracking-widest text-[9px]">{js.type}</p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isClosed ? (
                          <div className="px-6 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[10px] font-black text-[#9CA3AF] uppercase tracking-wider">
                            No longer accepting
                          </div>
                        ) : (
                          <Link 
                            to={`/portal/yopmails/job/${js.id}`} 
                            className="flex items-center gap-2 px-8 py-3 bg-[#3538CD] text-white text-[11px] font-black rounded-xl hover:bg-[#292bb0] transition-all uppercase tracking-widest shadow-lg shadow-[#3538CD]/20 active:scale-95 whitespace-nowrap"
                          >
                            Apply Now <ArrowIcon className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {(activeTab === 'applications' ? displayApps.length : savedJobs.length) === 0 && (
                <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-[#E5E7EB]">
                  <Briefcase className="w-12 h-12 text-[#E5E7EB] mx-auto mb-4" />
                  <p className="text-sm font-bold text-[#9CA3AF]">No {activeTab === 'applications' ? 'applications' : 'saved jobs'} found.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </PortalLayout>
  );
}


function ArrowIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
