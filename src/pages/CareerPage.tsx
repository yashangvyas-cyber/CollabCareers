import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { Search, MapPin, Briefcase, Clock, ChevronDown, X, Building2 } from 'lucide-react';
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

export default function CareerPage() {
  const { jobs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [employmentFilter, setEmploymentFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');

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
    return true;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setEmploymentFilter('');
    setJobTypeFilter('');
  };

  const locations = Array.from(new Set(displayJobs.map(j => j.location))).filter(Boolean);
  const experienceLevels = Array.from(new Set(displayJobs.map(j => j.experience))).filter(Boolean);

  return (
    <PortalLayout>
      {/* Company Hero Banner */}
      <div className="bg-gradient-to-br from-primary via-[#4040d9] to-[#2828a8] text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-5 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold shadow-lg border border-white/20">
              Y
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Yopmails</h1>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/60 mt-2">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Ahmedabad, India</span>
            <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {displayJobs.length} Open Positions</span>
          </div>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-[57px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-[1.2]">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title or skill..."
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 flex-1 lg:justify-end">
              <FilterPill
                label="Location"
                icon={<MapPin className="w-3.5 h-3.5" />}
                value={locationFilter}
                options={locations}
                onChange={setLocationFilter}
              />
              <FilterPill
                label="Experience"
                icon={<Clock className="w-3.5 h-3.5" />}
                value={experienceFilter}
                options={experienceLevels}
                onChange={setExperienceFilter}
              />
              <FilterPill
                label="Employment"
                icon={<Briefcase className="w-3.5 h-3.5" />}
                value={employmentFilter}
                options={Array.from(new Set(displayJobs.map(j => j.employmentType)))}
                onChange={setEmploymentFilter}
              />
              <FilterPill
                label="Type"
                icon={<Building2 className="w-3.5 h-3.5" />}
                value={jobTypeFilter}
                options={Array.from(new Set(displayJobs.map(j => j.jobType)))}
                onChange={setJobTypeFilter}
              />
              { (locationFilter || experienceFilter || employmentFilter || jobTypeFilter) && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] font-black text-primary hover:text-[#292bb0] uppercase tracking-widest px-2"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.length > 0 ? filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl border border-[#E5E7EB] p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-3">
                <Link
                  to={`/portal/yopmails/job/${job.id}`}
                  className="text-lg font-semibold text-primary group-hover:text-[#292bb0] transition-colors"
                >
                  {job.title}
                </Link>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Chip>
                  <MapPin className="w-3 h-3 mr-1" />{job.location}
                </Chip>
                {job.jobType !== job.location && <Chip>{job.jobType}</Chip>}
                <Chip>{job.employmentType}</Chip>
              </div>

              {/* Experience & Salary */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-[13px] font-bold text-[#6B7280]">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>{formatExperience(job.experience)}</span>
                </div>
              </div>

              <div className="border-t border-[#F3F4F6] pt-5 mb-5" />

              {/* Skills */}
              <div className="flex flex-wrap items-center gap-1.5 mb-6">
                <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mr-1">Skills:</span>
                {job.skills?.slice(0, 3).map((skill) => (
                  <Chip key={skill} variant="skill">{skill}</Chip>
                ))}
                {(job.skills?.length ?? 0) > 3 && (
                  <span className="text-[11px] font-black text-[#3538CD] uppercase tracking-widest ml-1">
                    +{(job.skills?.length ?? 0) - 3} More
                  </span>
                )}
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between pt-5 border-t border-[#F3F4F6]">
                <span className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest">
                  Posted Today
                </span>
                <Link
                  to={`/portal/yopmails/job/${job.id}`}
                  className="px-6 py-2.5 bg-[#3538CD] text-white text-[12px] font-black rounded-xl hover:bg-[#292bb0] transition-all uppercase tracking-widest shadow-md shadow-[#3538CD]/10"
                >
                  View & Apply
                </Link>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-[#E5E7EB]">
              <p className="text-[#6B7280] text-sm italic">No jobs matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
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
        className={`flex items-center gap-2.5 px-4 py-2 text-xs font-black rounded-full border-2 transition-all uppercase tracking-widest ${
          value 
            ? 'bg-[#3538CD]/5 border-[#3538CD] text-[#3538CD]' 
            : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]'
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
            className="ml-1 p-0.5 hover:bg-[#3538CD]/10 rounded-full transition-colors"
          >
            <X className="w-3 h-3" />
          </div>
        ) : (
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
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
