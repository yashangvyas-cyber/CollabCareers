import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { Briefcase, Mail, Phone, MapPin, FileText, ExternalLink, Linkedin, LogOut, ArrowRight, Clock, Pencil, X, Check, Eye, EyeOff, Bookmark, Upload } from 'lucide-react';
import { useApp } from '../store/AppContext';

const brandStatusStyles: Record<string, string> = {
  'Under Review': 'bg-[#F4F5FA] text-[#3538CD] border-[#3538CD]/20',
  'Interview in Progress': 'bg-[#F4F5FA] text-[#3538CD] border-[#3538CD]/20',
  'Decision Made': 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]',
  'Offer Made': 'bg-[#3538CD] text-white border-[#3538CD]',
  'Rejected': 'bg-gray-100 text-gray-400 border-gray-200',
  'Draft': 'bg-[#F4F5FA] text-[#3538CD] border border-[#3538CD]/20',
  'Submitted': 'bg-[#F4F5FA] text-[#3538CD] border-[#3538CD]/20',
  'Withdrawn': 'bg-gray-50 text-gray-400 border-gray-200 opacity-60',
};


const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function CandidateProfilePage() {
  const { currentUser, logoutCandidate, updateCurrentUser, applications, jobs } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'applications' | 'saved'>('applications');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [forceEmptyApps, setForceEmptyApps] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    currentOrg: '',
    currentDesignation: '',
    noticePeriod: '',
    location: '',
    linkedin: '',
  });
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [editResumeName, setEditResumeName] = useState('');
  const [editVisibility, setEditVisibility] = useState<'visible' | 'private'>('visible');
  const [editAllowContact, setEditAllowContact] = useState(false);

  const openEditProfile = () => {
    setEditForm({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || derivedProfile.phone || '',
      currentOrg: currentUser?.currentOrg || derivedProfile.currentOrg || '',
      currentDesignation: currentUser?.currentDesignation || derivedProfile.designation || '',
      noticePeriod: currentUser?.noticePeriod || derivedProfile.noticePeriod || '',
      location: currentUser?.location || derivedProfile.location || '',
      linkedin: currentUser?.linkedin || derivedProfile.linkedin || '',
    });
    setEditSkills(currentUser?.skills?.length ? currentUser.skills : derivedProfile.skills);
    setSkillInput('');
    setEditResumeName(derivedProfile.resumeName || '');
    setEditVisibility(currentUser?.profileVisibility || 'visible');
    setEditAllowContact(currentUser?.allowRecruiterContact || false);
    setShowEditProfile(true);
  };


  const unsaveJob = (jobId: string) => {
    const updated = (currentUser?.savedJobIds || []).filter(id => id !== jobId);
    updateCurrentUser({ savedJobIds: updated });
  };

  const seedDemoSavedJobs = () => {
    const demoIds = jobs.filter(j => j.status === 'Open').slice(0, 5).map(j => j.id);
    updateCurrentUser({ savedJobIds: demoIds });
  };

  const clearSavedJobs = () => updateCurrentUser({ savedJobIds: [] });

  // Populate saved jobs from actual saved IDs
  const savedJobs = jobs
    .filter(j => currentUser?.savedJobIds?.includes(j.id))
    .map(j => ({
      ...j,
      company: j.businessUnit || 'MindInventory',
      type: j.employmentType,
      jobClosed: j.status === 'Close'
    }));

  // Get user applications
  const userApps = applications
    .filter(a => a.candidateId === currentUser?.id)
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

  const displayApps = userApps.map(a => {
    const job = jobs.find(j => j.id === a.jobId);
    return {
      ...a,
      company: job?.businessUnit || 'MindInventory',
      title: job?.title || 'Job Opportunity',
      jobClosed: job?.status === 'Close',
    };
  });

  // Derive profile data from the latest application
  const latestApp = userApps[0];
  const profileData = latestApp?.answers?._fullFormData;

  const derivedProfile = {
    phone: profileData?.personal?.contactNumber || null,
    location: currentUser?.location || (profileData?.address?.city
      ? `${profileData.address.city}, ${profileData.address.country}`
      : null),
    linkedin: currentUser?.linkedin || profileData?.personal?.linkedin || null,
    designation: currentUser?.currentDesignation || profileData?.professional?.currentDesignation || null,
    currentOrg: currentUser?.currentOrg || profileData?.professional?.currentOrg || null,
    noticePeriod: currentUser?.noticePeriod || profileData?.professional?.noticePeriod || null,
    skills: currentUser?.skills?.length ? currentUser.skills : (profileData?.professional?.skills || []),
    resumeName: currentUser?.resumeUrl || latestApp?.resumeUrl || null,
  };

  const handleLogout = () => {
    logoutCandidate();
    navigate('/portal/yopmails');
  };

  return (
    <>
      <PortalLayout>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* LEFT: Profile Sidebar */}
            <div className="w-full lg:w-[320px] shrink-0">
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 sticky top-[80px]">
                {/* Name + buttons */}
                <div className="text-center mb-6">
                  <h2 className="text-xl font-black text-[#111827]">{currentUser?.firstName} {currentUser?.lastName}</h2>
                  {derivedProfile.designation && (
                    <p className="text-sm font-bold text-[#6B7280] mt-1">{derivedProfile.designation}</p>
                  )}

                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={openEditProfile}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 border border-[#3538CD] text-[#3538CD] text-[11px] font-black rounded-xl hover:bg-[#3538CD]/5 transition-colors uppercase tracking-widest"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      title="Sign Out"
                      className="p-2.5 border border-[#E5E7EB] text-[#9CA3AF] rounded-xl hover:bg-gray-50 hover:text-gray-600 hover:border-gray-300 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
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
                          <span>{derivedProfile.noticePeriod}</span>
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
                  className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all rounded-xl flex items-center gap-2 ${activeTab === 'applications' ? 'bg-white text-[#3538CD] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'
                    }`}
                >
                  Applications
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'applications' ? 'bg-[#3538CD] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {displayApps.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all rounded-xl flex items-center gap-2 ${activeTab === 'saved' ? 'bg-white text-[#3538CD] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'
                    }`}
                >
                  Saved
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'saved' ? 'bg-[#3538CD] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {savedJobs.length}
                  </span>
                </button>
              </div>

              {/* Saved tab — demo controls */}
              {activeTab === 'saved' && (
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={seedDemoSavedJobs}
                    className="px-3 py-1.5 bg-[#3538CD]/5 border border-[#3538CD]/10 rounded-lg text-[9px] font-black text-[#3538CD] uppercase tracking-widest hover:bg-[#3538CD] hover:text-white transition-all"
                  >
                    Load Demo Saved Jobs
                  </button>
                  <button
                    onClick={clearSavedJobs}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[9px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-200 transition-all"
                  >
                    Click to view no data case
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {activeTab === 'applications' && (
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => setForceEmptyApps(false)}
                      className="px-3 py-1.5 bg-[#3538CD]/5 border border-[#3538CD]/10 rounded-lg text-[9px] font-black text-[#3538CD] uppercase tracking-widest hover:bg-[#3538CD] hover:text-white transition-all"
                    >
                      Show Applications
                    </button>
                    <button
                      onClick={() => setForceEmptyApps(true)}
                      className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[9px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-200 transition-all"
                    >
                      Click to view no data case
                    </button>
                  </div>
                )}
                {activeTab === 'applications' ? (
                  (!forceEmptyApps ? displayApps : []).map((app: any) =>(
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
                        {app.status === 'Withdrawn' ? (
                          <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">
                              Withdrawn by candidate
                            </p>
                            <p className="text-[11px] font-bold text-gray-500">
                              On {formatDate(app.appliedAt)}
                            </p>
                          </div>
                        ) : app.status === 'Draft' && !app.jobClosed ? (
                          <button
                            onClick={() => navigate(`/portal/yopmails/apply/${app.jobId}`, { state: { continueDraft: true, draftJobTitle: app.title, lastSaved: app.appliedAt } })}
                            className="flex items-center gap-2 bg-[#3538CD] text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#292bb0] transition-all shadow-lg shadow-[#3538CD]/20 active:scale-95 whitespace-nowrap"
                          >
                            Continue Application <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <Link
                            to={`/portal/yopmails/application/${app.id}`}
                            className="flex items-center gap-2 text-[#3538CD] hover:text-[#292bb0] text-[11px] font-black uppercase tracking-widest transition-all group/link"
                          >
                            View Application <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
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

                        <div className="shrink-0 flex items-center gap-2">
                          {isClosed ? (
                            <div className="px-6 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[10px] font-black text-[#9CA3AF] uppercase tracking-wider">
                              No longer accepting
                            </div>
                          ) : (
                            <Link
                              to={`/portal/yopmails/job/${js.id}`}
                              className="flex items-center gap-2 px-6 py-3 bg-[#3538CD] text-white text-[11px] font-black rounded-xl hover:bg-[#292bb0] transition-all uppercase tracking-widest shadow-lg shadow-[#3538CD]/20 active:scale-95 whitespace-nowrap"
                            >
                              Apply Now <ArrowIcon className="w-4 h-4" />
                            </Link>
                          )}
                          <button
                            onClick={() => unsaveJob(js.id)}
                            title="Unsave job"
                            className="p-3 rounded-xl border border-[#E5E7EB] text-[#9CA3AF] hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <Bookmark className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}

                {(activeTab === 'applications' ? (forceEmptyApps ? 0 : displayApps.length) : savedJobs.length) === 0 && (
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

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#111827]/60 backdrop-blur-sm" onClick={() => setShowEditProfile(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#F3F4F6] shrink-0">
              <div>
                <h3 className="text-lg font-black text-[#111827]">Edit Profile</h3>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Update your personal information</p>
              </div>
              <button onClick={() => setShowEditProfile(false)} className="p-2 hover:bg-[#F3F4F6] rounded-full transition-colors text-[#6B7280]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form
              className="px-6 py-5 space-y-4 overflow-y-auto"
              onSubmit={(e) => {
                e.preventDefault();
                const pendingSkills = skillInput.trim()
                  ? [...editSkills, skillInput.trim()]
                  : editSkills;
                updateCurrentUser({
                  firstName: editForm.firstName.trim(),
                  lastName: editForm.lastName.trim(),
                  email: editForm.email.trim(),
                  phone: editForm.phone.trim(),
                  currentOrg: editForm.currentOrg.trim(),
                  currentDesignation: editForm.currentDesignation.trim(),
                  noticePeriod: editForm.noticePeriod,
                  skills: pendingSkills,
                  location: editForm.location.trim() || undefined,
                  linkedin: editForm.linkedin.trim() || undefined,
                  ...(editResumeName ? { resumeUrl: editResumeName } : {}),
                  profileVisibility: editVisibility,
                  allowRecruiterContact: editAllowContact,
                });
                setShowEditProfile(false);
              }}
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">First Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={editForm.firstName}
                    onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Last Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={editForm.lastName}
                    onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="+91 00000 00000"
                      className="w-full border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] placeholder:text-[#D1D5DB]"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="border-t border-[#F3F4F6] pt-3 space-y-3">
                <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Professional Details</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Organisation</label>
                    <input
                      type="text"
                      value={editForm.currentOrg}
                      onChange={e => setEditForm({ ...editForm, currentOrg: e.target.value })}
                      placeholder="e.g. Acme Corp"
                      className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] placeholder:text-[#D1D5DB] placeholder:font-normal"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Designation</label>
                    <input
                      type="text"
                      value={editForm.currentDesignation}
                      onChange={e => setEditForm({ ...editForm, currentDesignation: e.target.value })}
                      placeholder="e.g. Sr. Engineer"
                      className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] placeholder:text-[#D1D5DB] placeholder:font-normal"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Notice Period</label>
                  <select
                    value={editForm.noticePeriod}
                    onChange={e => setEditForm({ ...editForm, noticePeriod: e.target.value })}
                    className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] text-[#374151]"
                  >
                    <option value="">Select notice period</option>
                    <option value="Immediate">Immediate</option>
                    <option value="15 days">15 days</option>
                    <option value="30 days">30 days</option>
                    <option value="45 days">45 days</option>
                    <option value="60 days">60 days</option>
                    <option value="90 days">90 days</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                        placeholder="City, Country"
                        className="w-full border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] placeholder:text-[#D1D5DB] placeholder:font-normal"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">LinkedIn</label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A66C2]" />
                      <input
                        type="text"
                        value={editForm.linkedin}
                        onChange={e => setEditForm({ ...editForm, linkedin: e.target.value })}
                        placeholder="linkedin.com/in/..."
                        className="w-full border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] placeholder:text-[#D1D5DB] placeholder:font-normal"
                      />
                    </div>
                  </div>
                </div>

                {/* Skills Tag Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Skills</label>
                  <div className="border border-[#E5E7EB] rounded-xl px-3 py-2 bg-[#F9FAFB] focus-within:ring-4 focus-within:ring-[#3538CD]/10 focus-within:border-[#3538CD] min-h-[40px]">
                    {editSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        {editSkills.map((skill, i) => (
                          <span key={i} className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-[#3538CD]/10 text-[#3538CD] rounded-full">
                            {skill}
                            <button type="button" onClick={() => setEditSkills(editSkills.filter((_, j) => j !== i))} className="hover:text-red-500 transition-colors">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <input
                      type="text"
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => {
                        if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
                          e.preventDefault();
                          setEditSkills([...editSkills, skillInput.trim()]);
                          setSkillInput('');
                        }
                      }}
                      onBlur={() => {
                        if (skillInput.trim()) {
                          setEditSkills([...editSkills, skillInput.trim()]);
                          setSkillInput('');
                        }
                      }}
                      placeholder="Type a skill and press Enter"
                      className="w-full bg-transparent text-sm font-bold focus:outline-none placeholder:text-[#D1D5DB] placeholder:font-normal"
                    />
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Resume</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] min-w-0">
                      <FileText className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                      <span className={`text-xs truncate ${editResumeName ? 'font-bold text-[#374151]' : 'font-normal text-[#D1D5DB]'}`}>
                        {editResumeName || 'No resume uploaded'}
                      </span>
                    </div>
                    <label className="cursor-pointer shrink-0 flex items-center gap-1.5 px-3 py-2 border border-[#3538CD] text-[#3538CD] text-[11px] font-black rounded-xl hover:bg-[#3538CD]/5 transition-colors uppercase tracking-widest">
                      <Upload className="w-3.5 h-3.5" />
                      Upload
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) setEditResumeName(file.name);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Profile Visibility */}
              <div className="border-t border-[#F3F4F6] pt-3">
                <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-2">Profile Visibility</p>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setEditVisibility('visible')}
                    className={`relative text-left p-2.5 rounded-xl border-2 transition-all ${editVisibility === 'visible' ? 'border-[#3538CD] bg-[#3538CD]/5' : 'border-[#E5E7EB] hover:border-[#C7C9F0]'}`}>
                    <div className={`absolute top-2 right-2 w-3 h-3 rounded-full border-2 flex items-center justify-center ${editVisibility === 'visible' ? 'border-[#3538CD]' : 'border-[#D1D5DB]'}`}>
                      {editVisibility === 'visible' && <div className="w-1.5 h-1.5 rounded-full bg-[#3538CD]" />}
                    </div>
                    <Eye className="w-3.5 h-3.5 text-[#3538CD] mb-1" />
                    <p className="text-[11px] font-black text-[#111827] leading-tight mb-0.5">Visible to recruiters</p>
                    <p className="text-[9px] text-[#6B7280] leading-snug">Discoverable without application</p>
                  </button>
                  <button type="button" onClick={() => setEditVisibility('private')}
                    className={`relative text-left p-2.5 rounded-xl border-2 transition-all ${editVisibility === 'private' ? 'border-[#3538CD] bg-[#3538CD]/5' : 'border-[#E5E7EB] hover:border-[#C7C9F0]'}`}>
                    <div className={`absolute top-2 right-2 w-3 h-3 rounded-full border-2 flex items-center justify-center ${editVisibility === 'private' ? 'border-[#3538CD]' : 'border-[#D1D5DB]'}`}>
                      {editVisibility === 'private' && <div className="w-1.5 h-1.5 rounded-full bg-[#3538CD]" />}
                    </div>
                    <EyeOff className="w-3.5 h-3.5 text-[#6B7280] mb-1" />
                    <p className="text-[11px] font-black text-[#111827] leading-tight mb-0.5">Browse privately</p>
                    <p className="text-[9px] text-[#6B7280] leading-snug">Only visible on active applications</p>
                  </button>
                </div>
                {editVisibility === 'visible' && (
                <label className="flex items-center justify-between gap-3 mt-3 cursor-pointer">
                  <span className="text-xs font-bold text-[#374151]">Allow recruiters to contact me for future roles</span>
                  <button type="button" onClick={() => setEditAllowContact(v => !v)}
                    className={`relative rounded-full transition-colors shrink-0 ${editAllowContact ? 'bg-[#3538CD]' : 'bg-[#D1D5DB]'}`}
                    style={{ minWidth: '2.5rem', height: '1.375rem' }}>
                    <span className={`absolute top-0.5 left-0.5 bg-white rounded-full shadow transition-transform ${editAllowContact ? 'translate-x-[1.125rem]' : ''}`} style={{ width: '1.125rem', height: '1.125rem' }} />
                  </button>
                </label>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 py-2.5 border border-[#E5E7EB] text-[#6B7280] text-sm font-black rounded-xl hover:bg-[#F9FAFB] transition-colors uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#3538CD] text-white text-sm font-black rounded-xl hover:bg-[#292bb0] transition-all shadow-lg shadow-[#3538CD]/20 uppercase tracking-widest"
                >
                  <Check className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}


function ArrowIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
