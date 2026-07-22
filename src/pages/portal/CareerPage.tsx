import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import { Search, MapPin, Briefcase, Clock, ChevronDown, X, Building2, Bookmark, LayoutGrid, List, ArrowRight, Tags, SlidersHorizontal } from 'lucide-react';
import AuthModal from '../../components/AuthModal';
import { useApp } from '../../store/AppContext';

function Chip({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'skill' | 'active' }) {
  const styles = {
    default: 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]',
    skill: 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]',
    active: 'bg-primary text-on-primary border-primary',
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



export default function CareerPage({ openAlumni = false, openRegister = false }: { openAlumni?: boolean, openRegister?: boolean }) {
  const { jobs, currentUser, applications, portalConfig } = useApp();
  const appearance = portalConfig.appearance;
  const navigate = useNavigate();

  // Resolve the current user's relationship to a job:
  //  - 'draft'   → an in-progress draft application on an open job → "Continue Application"
  //  - 'applied' → a submitted application being processed → "Applied"
  //  - null      → not applied yet → "View & Apply"
  const getJobAppState = (job: any): { kind: 'draft' | 'applied' | null; app: any } => {
    if (!currentUser) return { kind: null, app: null };
    const app = applications.find(a => a.candidateId === currentUser.id && a.jobId === job.id);
    if (!app) return { kind: null, app: null };
    const isDraft = app.status === 'Draft' && job.status !== 'Close';
    return { kind: isDraft ? 'draft' : 'applied', app };
  };

  const continueDraft = (job: any, app: any) =>
    navigate(`/portal/yopmails/apply/${job.id}`, {
      state: { continueDraft: true, draftJobTitle: job.title, lastSaved: app.appliedAt },
    });

  // A returning user has prior activity (at least one application); a brand-new signup has none yet.
  const isReturningUser = !!currentUser && applications.some(a => a.candidateId === currentUser.id);

  // Sticky search/filter — lift a soft shadow only once the card sticks under the header
  const filterRef = useRef<HTMLDivElement>(null);
  const [filterStuck, setFilterStuck] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const el = filterRef.current;
      if (!el) return;
      setFilterStuck(el.getBoundingClientRect().top <= 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const [showAuthModal, setShowAuthModal] = useState(openAlumni || openRegister);
  const [authTab, setAuthTab] = useState<'register' | 'signin'>(openRegister ? 'register' : 'signin');

  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [employmentFilter, setEmploymentFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [buFilter, setBuFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeMobileFilterTab, setActiveMobileFilterTab] = useState('Location');
  const itemsPerPage = 6;

  // Lock body scroll when mobile filters are open to prevent double scrollbars
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showMobileFilters]);

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
    if (categoryFilter && job.category !== categoryFilter) return false;
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
    setCategoryFilter('');
    setExperienceFilter('');
    setBuFilter('');
    setCurrentPage(1);
  };

  const locations = Array.from(new Set(displayJobs.map(j => j.location))).filter(Boolean);
  const experienceLevels = Array.from(new Set(displayJobs.map(j => j.experience))).filter(Boolean);
  const businessUnits = Array.from(new Set(displayJobs.map(j => j.businessUnit))).filter(Boolean);
  // Category options come from the career-portal config (here: the categories present on published jobs)
  const categories = Array.from(new Set(displayJobs.map(j => j.category).filter((c): c is string => !!c)));

  return (
    <PortalLayout>
      {/* Sub-header — white section, connected under the portal header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          {!currentUser ? (
            <>
              <h1 className="text-sm font-bold text-[#111827] tracking-tight">
                Welcome to <span className="text-primary">{appearance.portalName}</span> Careers <span className="align-middle">👋</span>
              </h1>
              <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                {appearance.tagline}
              </p>
            </>
          ) : isReturningUser ? (
            <>
              <h1 className="text-sm font-bold text-[#111827] tracking-tight">
                Welcome back, {currentUser.firstName} {currentUser.lastName} <span className="align-middle">👋</span>
              </h1>
              <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                Explore opportunities at <span className="font-semibold text-primary">{appearance.portalName}</span>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-sm font-bold text-[#111827] tracking-tight">
                Welcome, {currentUser.firstName} <span className="align-middle">🎉</span>
              </h1>
              <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                Great to have you — let's find your first role at <span className="font-semibold text-primary">{appearance.portalName}</span>.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Hero banner — optional, sits between the greeting and the filters (set in Appearance config) */}
      {appearance.heroEnabled && appearance.heroImageUrl && (
        <div className="bg-[#F9FAFB] pt-3 sm:pt-4">
          <div className="max-w-7xl mx-auto px-3 sm:px-6">
            <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm">
              <img src={appearance.heroImageUrl} alt="" className="w-full h-40 sm:h-56 object-cover" />
            </div>
          </div>
        </div>
      )}

      {/* Search + Filter — contained white card, sticky */}
      <div ref={filterRef} className="sticky top-[49px] z-40 bg-[#F9FAFB] pt-3 sm:pt-4 pb-2 sm:pb-3">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className={`bg-white border border-[#E5E7EB] rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-4 transition-shadow duration-200 ${filterStuck ? 'shadow-lg shadow-black/10' : 'shadow-sm'}`}>

          {/* Search Row — with filter button on mobile */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 sm:w-5 h-4 sm:h-5 text-[#9CA3AF] absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs..."
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl sm:rounded-2xl pl-9 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm placeholder:text-[#9CA3AF] hover:border-[#D1D5DB]"
              />
            </div>
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="sm:hidden flex items-center gap-1.5 px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-[#374151] hover:border-[#9CA3AF] hover:text-[#111827] transition-all bg-white shrink-0 relative"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-wider">Filters</span>
              {(() => {
                const c = [locationFilter, experienceFilter, employmentFilter, jobTypeFilter, categoryFilter, buFilter].filter(Boolean).length;
                return c > 0 ? <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-on-primary text-[10px] font-black rounded-full flex items-center justify-center">{c}</span> : null;
              })()}
            </button>
          </div>

          {/* Desktop Filters Row — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-3 flex-wrap pb-1">
            <FilterPill label="Location" icon={<MapPin className="w-3.5 h-3.5" />} value={locationFilter} options={locations} onChange={setLocationFilter} />
            <FilterPill label="Experience" icon={<Clock className="w-3.5 h-3.5" />} value={experienceFilter} options={experienceLevels} onChange={setExperienceFilter} />
            <FilterPill label="Employment" icon={<Briefcase className="w-3.5 h-3.5" />} value={employmentFilter} options={Array.from(new Set(displayJobs.map(j => j.employmentType)))} onChange={setEmploymentFilter} />
            <FilterPill label="Type" icon={<Building2 className="w-3.5 h-3.5" />} value={jobTypeFilter} options={Array.from(new Set(displayJobs.map(j => j.jobType)))} onChange={setJobTypeFilter} />
            {categories.length > 0 && (
              <FilterPill label="Category" icon={<Tags className="w-3.5 h-3.5" />} value={categoryFilter} options={categories} onChange={setCategoryFilter} />
            )}
            <FilterPill label="Business Unit" icon={<Building2 className="w-3.5 h-3.5" />} value={buFilter} options={businessUnits} onChange={setBuFilter} />

            {(locationFilter || experienceFilter || employmentFilter || jobTypeFilter || categoryFilter || buFilter) && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 ml-2 px-3 py-1.5 text-[10px] font-black text-[#6B7280] hover:text-red-500 transition-colors uppercase tracking-widest bg-[#F3F4F6] hover:bg-red-50 rounded-lg group">
                <X className="w-3 h-3 group-hover:rotate-90 transition-transform" /> Clear Filters
              </button>
            )}

            <span className="ml-auto shrink-0 inline-flex items-center px-3 py-1 bg-[#F3F4F6] text-[#6B7280] text-[11px] font-bold tracking-wide rounded-full border border-[#E5E7EB] whitespace-nowrap">
              {filteredJobs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} Jobs
            </span>
            <div className="flex items-center gap-1 bg-[#F3F4F6] rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} title="Grid view" className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#9CA3AF] hover:text-[#6B7280]'}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')} title="List view" className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#9CA3AF] hover:text-[#6B7280]'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile active filters summary */}
          {(() => {
            const active = [
              locationFilter && `📍 ${locationFilter}`,
              experienceFilter && `⏱ ${experienceFilter}`,
              employmentFilter && employmentFilter,
              jobTypeFilter && jobTypeFilter,
              categoryFilter && categoryFilter,
              buFilter && buFilter,
            ].filter(Boolean) as string[];
            if (active.length === 0) return null;
            return (
              <div className="flex sm:hidden items-center gap-2 flex-wrap">
                {active.map(a => (
                  <span key={a} className="px-2 py-1 text-[10px] font-bold bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB] rounded-lg">{a}</span>
                ))}
                <button onClick={clearFilters} className="text-[10px] font-black text-red-500 uppercase tracking-wider ml-1">Clear</button>
              </div>
            );
          })()}

          {/* Mobile job count */}
          <div className="flex sm:hidden items-center justify-between">
            <span className="text-[11px] font-bold text-[#9CA3AF]">
              {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
            </span>
            <div className="flex items-center gap-1 bg-[#F3F4F6] rounded-lg p-0.5">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#9CA3AF]'}`}>
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#9CA3AF]'}`}>
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          </div>
        </div>
      </div>

      {/* ── Mobile Filter Bottom Sheet (Dual-Pane Premium Design) ── */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] sm:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="relative bg-white rounded-t-3xl shadow-2xl flex flex-col h-[85vh] animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6] shrink-0">
              <h3 className="text-base font-black text-[#111827]">Filter Jobs</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-[#F3F4F6] rounded-xl transition-colors bg-[#F9FAFB]">
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
            
            {/* Dual Pane Body */}
            <div className="flex flex-1 overflow-hidden">
              {(() => {
                const filterGroups = [
                  { label: 'Location', value: locationFilter, options: locations, onChange: setLocationFilter },
                  { label: 'Experience', value: experienceFilter, options: experienceLevels, onChange: setExperienceFilter },
                  { label: 'Employment', value: employmentFilter, options: Array.from(new Set(displayJobs.map(j => j.employmentType))), onChange: setEmploymentFilter },
                  { label: 'Job Type', value: jobTypeFilter, options: Array.from(new Set(displayJobs.map(j => j.jobType))), onChange: setJobTypeFilter },
                  ...(categories.length > 0 ? [{ label: 'Category', value: categoryFilter, options: categories, onChange: setCategoryFilter }] : []),
                  { label: 'Business Unit', value: buFilter, options: businessUnits, onChange: setBuFilter },
                ];
                
                const activeGroup = filterGroups.find(g => g.label === activeMobileFilterTab) || filterGroups[0];

                return (
                  <>
                    {/* Left Pane: Categories */}
                    <div className="w-[35%] bg-[#F9FAFB] border-r border-[#E5E7EB] overflow-y-auto">
                      {filterGroups.map(group => (
                        <button
                          key={group.label}
                          onClick={() => setActiveMobileFilterTab(group.label)}
                          className={`w-full text-left px-4 py-4 text-xs font-black uppercase tracking-widest relative transition-colors ${
                            activeMobileFilterTab === group.label
                              ? 'bg-white text-[#111827]'
                              : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                          }`}
                        >
                          {activeMobileFilterTab === group.label && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                          )}
                          {group.label}
                          {group.value && (
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Right Pane: Options */}
                    <div className="flex-1 bg-white overflow-y-auto p-4 custom-scrollbar">
                      <div className="space-y-3">
                        {activeGroup.options.length === 0 ? (
                          <p className="text-xs text-[#9CA3AF] font-medium text-center mt-10">No options available.</p>
                        ) : (
                          activeGroup.options.map(opt => (
                            <button
                              key={opt}
                              onClick={() => activeGroup.onChange(activeGroup.value === opt ? '' : opt)}
                              className="w-full flex items-center justify-between p-3 rounded-xl border transition-all"
                              style={{
                                borderColor: activeGroup.value === opt ? appearance.brandColor : '#E5E7EB',
                                backgroundColor: activeGroup.value === opt ? `color-mix(in oklab, ${appearance.brandColor} 8%, white)` : '#FFFFFF'
                              }}
                            >
                              <span className={`text-sm font-bold ${activeGroup.value === opt ? 'text-[#111827]' : 'text-[#374151]'}`}>
                                {opt}
                              </span>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                activeGroup.value === opt ? 'border-primary bg-primary' : 'border-[#D1D5DB]'
                              }`}>
                                {activeGroup.value === opt && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#F3F4F6] bg-white flex gap-3 shrink-0">
              <button
                onClick={() => { clearFilters(); setShowMobileFilters(false); }}
                className="flex-1 py-3.5 text-[11px] font-black text-[#6B7280] border-2 border-[#E5E7EB] rounded-xl uppercase tracking-widest hover:bg-[#F9FAFB] transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-3.5 text-[11px] font-black text-on-primary bg-primary rounded-xl uppercase tracking-widest hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
              >
                Show {filteredJobs.length} Jobs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-8">


        {/* ── Grid View ── */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentJobs.length > 0 ? currentJobs.map((job) => {
              const { kind: appKind, app: userApp } = getJobAppState(job);
              return (
              <div key={job.id} className="bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-200 group">
                <div className="flex items-start justify-between mb-3">
                  <Link to={`/portal/yopmails/job/${job.id}`} className="text-base sm:text-lg font-semibold text-[#111827] group-hover:underline transition-colors">
                    {job.title}
                  </Link>
                  <button onClick={() => { if (!currentUser) { setSelectedJob(job); setAuthTab('signin'); setShowAuthModal(true); } }} className="p-2 text-[#9CA3AF] hover:text-[#374151] hover:bg-[#F3F4F6] rounded-lg transition-all" title="Save Job">
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
                    <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />
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
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-[#F3F4F6]">
                  <span className="text-[10px] sm:text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest">{formatPostedDate(job.createdAt)}</span>
                  {appKind === 'draft' ? (
                    <button
                      onClick={() => continueDraft(job, userApp)}
                      className="flex items-center gap-1.5 px-3 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-black rounded-xl transition-all uppercase tracking-widest shadow-md bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 shadow-amber-500/5"
                    >
                      <span className="hidden sm:inline">Continue Application</span><span className="sm:hidden">Continue</span> <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Link to={`/portal/yopmails/job/${job.id}`} className={`px-3 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-black rounded-xl transition-all uppercase tracking-widest shadow-md ${appKind === 'applied' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 shadow-emerald-500/5' : 'bg-primary text-on-primary hover:bg-primary-hover shadow-primary/10'}`}>
                      {appKind === 'applied' ? 'Applied' : 'View & Apply'}
                    </Link>
                  )}
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
              const { kind: appKind, app: userApp } = getJobAppState(job);
              return (
              <div key={job.id} className="bg-white rounded-xl border border-[#E5E7EB] px-5 py-4 hover:shadow-md hover:border-primary/30 transition-all duration-200 group">
                <div className="flex items-center gap-4">
                  {/* Left: Title + tags */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <Link to={`/portal/yopmails/job/${job.id}`} className="text-base font-semibold text-[#111827] group-hover:underline transition-colors">
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
                          <Clock className="w-3 h-3 text-[#9CA3AF]" />{formatExperience(job.experience)}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Right: Date + actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest whitespace-nowrap hidden sm:block">
                      {formatPostedDate(job.createdAt)}
                    </span>
                    {!appKind && (
                      <button onClick={() => { if (!currentUser) { setSelectedJob(job); setAuthTab('signin'); setShowAuthModal(true); } }} className="p-2 text-[#9CA3AF] hover:text-[#374151] hover:bg-[#F3F4F6] rounded-lg transition-all" title="Save Job">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    )}
                    {appKind === 'draft' ? (
                      <button
                        onClick={() => continueDraft(job, userApp)}
                        className="flex items-center gap-1.5 px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                      >
                        Continue <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <Link to={`/portal/yopmails/job/${job.id}`} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${appKind === 'applied' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100' : 'bg-[#F4F5FA] text-primary hover:bg-primary hover:text-on-primary'}`}>
                        {appKind === 'applied' ? 'Applied' : 'View'}
                      </Link>
                    )}
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
                  : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F4F5FA]'
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
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                    : 'text-[#6B7280] hover:bg-[#F4F5FA] hover:text-[#111827]'
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
                  : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F4F5FA]'
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
            ? 'bg-[#F3F4F6] border-[#D1D5DB] text-[#111827] shadow-sm'
            : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB] hover:bg-[#F9FAFB]'
        }`}
      >
        <span className={value ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}>{icon}</span>
        <span>{value || label}</span>
        {value ? (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
              setIsOpen(false);
            }}
            className="ml-1.5 p-0.5 hover:bg-primary/10 rounded-full transition-colors"
          >
            <X className="w-3 h-3" />
          </div>
        ) : (
          <ChevronDown className={`w-3.5 h-3.5 ml-0.5 text-[#9CA3AF] transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#6B7280]' : ''}`} />
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
                      ? 'text-[#111827] bg-[#F3F4F6]'
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
        className="text-[11px] font-black text-[#6B7280] uppercase tracking-widest ml-1 select-none cursor-default"
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
