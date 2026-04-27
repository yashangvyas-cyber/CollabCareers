import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { Search, MapPin, Briefcase, Clock, ChevronDown, X, Building2, Bookmark, LayoutGrid, List, ArrowRight, UserCircle2 } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import { useApp } from '../store/AppContext';

function Chip({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'skill' | 'active' }) {
  const styles = {
    default: 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]',
    skill: 'bg-primary/5 text-primary border-primary/20',
    active: 'bg-primary text-white border-primary',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${styles[variant]}`}>
      {children}
    </span>
  );
}


const formatExperience = (exp: string) => {
  if (!exp) return '';
  const match = exp.match(/^(\d+)/);
  if (match) {
    return `${match[1]}+ Years Experience`;
  }
  return exp;
};

const formatPostedDate = (dateStr?: string): string => {
  if (!dateStr) return 'Posted Recently';
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays === 0) return 'Posted Today';
  if (diffDays === 1) return 'Posted Yesterday';
  if (diffDays < 7) return `Posted ${diffDays} days ago`;
  return `Posted on ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
};

const PROFILE_FIELDS = [
  { key: 'phone', label: 'Phone Number', check: (u: any) => !!u.phone },
  { key: 'currentDesignation', label: 'Designation', check: (u: any) => !!u.currentDesignation },
  { key: 'currentOrg', label: 'Organisation', check: (u: any) => !!u.currentOrg },
  { key: 'skills', label: 'Skills', check: (u: any) => (u.skills?.length ?? 0) > 0 },
  { key: 'noticePeriod', label: 'Notice Period', check: (u: any) => !!u.noticePeriod },
  { key: 'resumeUrl', label: 'Resume', check: (u: any) => !!u.resumeUrl },
];

export default function CareerPage({ openAlumni = false, openRegister = false }: { openAlumni?: boolean, openRegister?: boolean }) {
  const { jobs, currentUser, applications } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(openAlumni || openRegister);
  const [authTab, setAuthTab] = useState<'register' | 'signin'>(openRegister ? 'register' : 'signin');
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [employmentFilter, setEmploymentFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [buFilter, setBuFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const itemsPerPage = 6;

  // Combine store jobs with defaults if store is sparse
  const displayJobs = useMemo(() => {
    return jobs.filter(j => j.publishOnCollabCareers);
  }, [jobs]);


  const filteredJobs = displayJobs.filter((job) => {
    if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    if (locationFilter && job.location !== locationFilter) return false;
    if (employmentFilter && job.employmentType !== employmentFilter) return false;
    if (jobTypeFilter && job.jobType !== jobTypeFilter) return false;
    if (experienceFilter && job.experience !== experienceFilter) return false;
    if (buFilter && job.businessUnit !== buFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const currentJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setEmploymentFilter('');
    setJobTypeFilter('');
    setExperienceFilter('');
    setBuFilter('');
    setCurrentPage(1);
  };

  const locations = Array.from(new Set(displayJobs.map(j => j.location))).filter(Boolean);
  const experienceLevels = Array.from(new Set(displayJobs.map(j => j.experience))).filter(Boolean);
  const businessUnits = Array.from(new Set(displayJobs.map(j => j.businessUnit))).filter(Boolean);

  return (
    <PortalLayout>
      {/* Compact Hero Strip */}
      <div className="bg-gradient-to-r from-[#3538CD] to-[#2828a8]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <p className="text-sm text-white/80 font-medium">
            Explore opportunities at <span className="font-bold text-white">MindInventory</span>
          </p>
          <span className="px-3 py-1 bg-white/10 text-white text-[11px] font-bold tracking-wide rounded-full border border-white/20 shadow-sm">
            {filteredJobs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} Jobs
          </span>
        </div>
      </div>

      {/* Profile completion nudge */}
      {(() => {
        if (!currentUser || nudgeDismissed) return null;
        const missing = PROFILE_FIELDS.filter(f => !f.check(currentUser));
        if (missing.length === 0) return null;
        const completed = PROFILE_FIELDS.length - missing.length;
        const pct = Math.round((completed / PROFILE_FIELDS.length) * 100);
        return (
          <div className="bg-gradient-to-r from-[#3538CD] to-[#4F46E5] px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
              <UserCircle2 className="w-5 h-5 text-white/70 shrink-0" />
              <div className="flex-1 min-w-0 flex items-center gap-3">
                <p className="text-sm font-black text-white shrink-0">Your profile is {pct}% complete</p>
                <div className="flex-1 max-w-[240px] h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <Link
                to="/portal/yopmails/profile"
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-white text-[#3538CD] text-[11px] font-black rounded-lg uppercase tracking-widest hover:bg-white/90 transition-colors shadow-sm"
              >
                Complete Profile <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setNudgeDismissed(true)}
                className="shrink-0 p-1.5 text-white/50 hover:text-white transition-colors rounded-md hover:bg-white/10"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })()}

      {/* Search + Filter Bar */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-[49px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
          {/* Search Row */}
          <div className="relative max-w-4xl">
            <Search className="w-5 h-5 text-[#9CA3AF] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search job title, skills, or keywords..."
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl pl-12 pr-6 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm placeholder:text-[#9CA3AF] hover:border-[#D1D5DB]"
            />
          </div>

          {/* Filters Row + View Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <FilterPill label="Location" icon={<MapPin className="w-3.5 h-3.5" />} value={locationFilter} options={locations} onChange={setLocationFilter} />
            <FilterPill label="Experience" icon={<Clock className="w-3.5 h-3.5" />} value={experienceFilter} options={experienceLevels} onChange={setExperienceFilter} />
            <FilterPill label="Employment" icon={<Briefcase className="w-3.5 h-3.5" />} value={employmentFilter} options={Array.from(new Set(displayJobs.map(j => j.employmentType)))} onChange={setEmploymentFilter} />
            <FilterPill label="Type" icon={<Building2 className="w-3.5 h-3.5" />} value={jobTypeFilter} options={Array.from(new Set(displayJobs.map(j => j.jobType)))} onChange={setJobTypeFilter} />
            <FilterPill label="Business Unit" icon={<Building2 className="w-3.5 h-3.5" />} value={buFilter} options={businessUnits} onChange={setBuFilter} />

            {(locationFilter || experienceFilter || employmentFilter || jobTypeFilter || buFilter) && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 ml-2 px-3 py-1.5 text-[10px] font-black text-[#6B7280] hover:text-red-500 transition-colors uppercase tracking-widest bg-[#F3F4F6] hover:bg-red-50 rounded-lg group">
                <X className="w-3 h-3 group-hover:rotate-90 transition-transform" /> Clear Filters
              </button>
            )}

            {/* View Toggle */}
            <div className="ml-auto flex items-center gap-1 bg-[#F3F4F6] rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                title="Grid view"
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-white text-[#3538CD] shadow-sm' : 'text-[#9CA3AF] hover:text-[#6B7280]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                title="List view"
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'list' ? 'bg-white text-[#3538CD] shadow-sm' : 'text-[#9CA3AF] hover:text-[#6B7280]'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-8">

        {/* ── Grid View ── */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentJobs.length > 0 ? currentJobs.map((job) => {
              const hasApplied = currentUser && applications.some(app => app.candidateId === currentUser.id && app.jobId === job.id);
              return (
              <div key={job.id} className="bg-white rounded-xl border border-[#E5E7EB] p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-200 group">
                <div className="flex items-start justify-between mb-3">
                  <Link to={`/portal/yopmails/job/${job.id}`} className="text-lg font-semibold text-primary group-hover:text-[#292bb0] transition-colors">
                    {job.title}
                  </Link>
                  <button onClick={() => { if (!currentUser) { setSelectedJob(job); setAuthTab('signin'); setShowAuthModal(true); } }} className="p-2 text-[#9CA3AF] hover:text-[#3538CD] hover:bg-[#3538CD]/5 rounded-lg transition-all" title="Save Job">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Chip><MapPin className="w-3 h-3 mr-1" />{job.location}</Chip>
                  {job.jobType !== job.location && <Chip>{job.jobType}</Chip>}
                  <Chip>{job.employmentType}</Chip>
                </div>
                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[#6B7280]">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{formatExperience(job.experience)}</span>
                  </div>
                </div>
                {/* Skills — hidden when empty */}
                {(job.skills?.length ?? 0) > 0 && (
                  <>
                    <div className="border-t border-[#F3F4F6] pt-4 mb-4" />
                    <div className="flex flex-wrap items-center gap-1.5 mb-5">
                      <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mr-1">Skills:</span>
                      {job.skills.slice(0, 3).map((skill) => (
                        <Chip key={skill} variant="skill">{skill}</Chip>
                      ))}
                      {job.skills.length > 3 && (
                        <SkillsOverflow skills={job.skills} shown={3} />
                      )}
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6]">
                  <span className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest">{formatPostedDate(job.createdAt)}</span>
                  <Link to={`/portal/yopmails/job/${job.id}`} className={`px-6 py-2.5 text-[12px] font-black rounded-xl transition-all uppercase tracking-widest shadow-md ${hasApplied ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 shadow-emerald-500/5' : 'bg-[#3538CD] text-white hover:bg-[#292bb0] shadow-[#3538CD]/10'}`}>
                    {hasApplied ? 'Applied' : 'View & Apply'}
                  </Link>
                </div>
              </div>
              );
            }) : (
              <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-[#E5E7EB]">
                <p className="text-[#6B7280] text-sm italic">No jobs matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* ── List View ── */}
        {viewMode === 'list' && (
          <div className="flex flex-col gap-2">
            {currentJobs.length > 0 ? currentJobs.map((job) => {
              const hasApplied = currentUser && applications.some(app => app.candidateId === currentUser.id && app.jobId === job.id);
              return (
              <div key={job.id} className="bg-white rounded-xl border border-[#E5E7EB] px-5 py-4 hover:shadow-md hover:border-primary/30 transition-all duration-200 group">
                <div className="flex items-center gap-4">
                  {/* Left: Title + tags */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <Link to={`/portal/yopmails/job/${job.id}`} className="text-base font-semibold text-primary group-hover:text-[#292bb0] transition-colors">
                        {job.title}
                      </Link>
                      {(job.skills?.length ?? 0) > 0 && job.skills.slice(0, 2).map((skill) => (
                        <Chip key={skill} variant="skill">{skill}</Chip>
                      ))}
                      {(job.skills?.length ?? 0) > 2 && (
                        <SkillsOverflow skills={job.skills ?? []} shown={2} />
                      )}
                    </div>
                    <div className="flex items-center flex-wrap gap-2">
                      <Chip><MapPin className="w-3 h-3 mr-1" />{job.location}</Chip>
                      {job.jobType !== job.location && <Chip>{job.jobType}</Chip>}
                      <Chip>{job.employmentType}</Chip>
                      {job.experience && (
                        <span className="flex items-center gap-1 text-[12px] text-[#6B7280] font-bold">
                          <Clock className="w-3 h-3 text-primary" />{formatExperience(job.experience)}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Right: Date + actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest whitespace-nowrap hidden sm:block">
                      {formatPostedDate(job.createdAt)}
                    </span>
                    {!hasApplied && (
                      <button onClick={() => { if (!currentUser) { setSelectedJob(job); setAuthTab('signin'); setShowAuthModal(true); } }} className="p-2 text-[#9CA3AF] hover:text-[#3538CD] hover:bg-[#3538CD]/5 rounded-lg transition-all" title="Save Job">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    )}
                    <Link to={`/portal/yopmails/job/${job.id}`} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${hasApplied ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100' : 'bg-[#F4F5FA] text-[#3538CD] hover:bg-[#3538CD] hover:text-white'}`}>
                      {hasApplied ? 'Applied' : 'View'}
                    </Link>
                  </div>
                </div>
              </div>
              );
            }) : (
              <div className="py-12 text-center bg-white rounded-xl border border-dashed border-[#E5E7EB]">
                <p className="text-[#6B7280] text-sm italic">No jobs matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                currentPage === 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-[#6B7280] hover:text-[#3538CD] hover:bg-[#F4F5FA]'
              }`}
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-10 h-10 rounded-xl text-xs font-black flex items-center justify-center transition-all ${
                  currentPage === i + 1
                    ? 'bg-[#3538CD] text-white shadow-lg shadow-[#3538CD]/20'
                    : 'text-[#6B7280] hover:bg-[#F4F5FA] hover:text-[#3538CD]'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                currentPage === totalPages 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-[#6B7280] hover:text-[#3538CD] hover:bg-[#F4F5FA]'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        jobTitle={selectedJob?.title || 'Portal'} 
        businessUnit={selectedJob?.businessUnit || 'MindInventory'}
        jobId={selectedJob?.id || '1'}
        initialTab={authTab}
        initialState={openAlumni ? 'alumni-verify' : 'auth'}
      />
    </PortalLayout>
  );
}

// Modern Filter Pill component with custom floating dropdown
function FilterPill({ label, icon, value, options, onChange }: {
  label: string; 
  icon: React.ReactNode; 
  value: string; 
  options: string[];
  onChange: (v: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-5 py-2.5 text-[11px] font-black rounded-xl border transition-all uppercase tracking-[0.05em] shadow-sm ${
          value 
            ? 'bg-[#3538CD]/5 border-[#3538CD] text-[#3538CD] shadow-[#3538CD]/5' 
            : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB] hover:bg-[#F9FAFB]'
        }`}
      >
        <span className={value ? 'text-[#3538CD]' : 'text-[#9CA3AF]'}>{icon}</span>
        <span>{value || label}</span>
        {value ? (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
              setIsOpen(false);
            }}
            className="ml-1.5 p-0.5 hover:bg-[#3538CD]/10 rounded-full transition-colors"
          >
            <X className="w-3 h-3" />
          </div>
        ) : (
          <ChevronDown className={`w-3.5 h-3.5 ml-0.5 text-[#9CA3AF] transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#3538CD]' : ''}`} />
        )}
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-white border border-[#E5E7EB] rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-3 pb-2 mb-2 border-b border-[#F3F4F6]">
              <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Select {label}</span>
            </div>
            <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
              <button
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
              >
                All {label}s
              </button>
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${
                    value === option 
                      ? 'text-[#3538CD] bg-[#3538CD]/5' 
                      : 'text-[#374151] hover:bg-[#F9FAFB]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SkillsOverflow({ skills, shown }: { skills: string[]; shown: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isTouchRef = useRef(false); // track if last interaction was touch
  const extra = skills.slice(shown);

  // Close on outside tap (mobile only — desktop closes via mouseleave)
  useEffect(() => {
    if (!open || !isTouchRef.current) return;
    const handler = (e: TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('touchstart', handler);
    return () => document.removeEventListener('touchstart', handler);
  }, [open]);

  if (extra.length === 0) return null;

  return (
    <span
      ref={ref}
      className="relative"
      onTouchStart={() => {
        isTouchRef.current = true;   // mark as touch device
        setOpen(v => !v);            // toggle on tap
      }}
      onMouseEnter={() => {
        if (!isTouchRef.current) setOpen(true);   // hover open (desktop only)
      }}
      onMouseLeave={() => {
        if (!isTouchRef.current) setOpen(false);  // hover close (desktop only)
      }}
    >
      <button
        type="button"
        className="text-[11px] font-black text-[#3538CD] uppercase tracking-widest ml-1 select-none cursor-default"
      >
        +{extra.length} More
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-2 flex flex-col gap-1 bg-[#111827] text-white text-[10px] font-bold rounded-xl px-3 py-2.5 shadow-xl z-50 whitespace-nowrap min-w-max">
          {extra.map(s => <span key={s}>{s}</span>)}
          <div className="absolute top-full left-4 border-4 border-transparent border-t-[#111827]" />
        </div>
      )}
    </span>
  );
}
