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

// Default fallback jobs for demo if store is empty
const defaultJobs = [
  {
    id: 'd1', title: 'React Developer', location: 'Ahmedabad', jobType: 'On-site',
    employmentType: 'Full-time', experience: '2-4 Years',
    skills: ['React', 'JavaScript', 'TypeScript'],
    createdAt: new Date().toISOString(),
    publishOnCollabCareers: true,
  },
  {
    id: 'd2', title: 'UI/UX Designer', location: 'Remote', jobType: 'Remote',
    employmentType: 'Full-time', experience: '2-5 Years',
    skills: ['Figma', 'Adobe XD'],
    createdAt: new Date().toISOString(),
    publishOnCollabCareers: true,
  }
];

export default function CareerPage() {
  const { jobs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [employmentFilter, setEmploymentFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');

  // Combine store jobs with defaults if store is sparse
  const displayJobs = useMemo(() => {
    const all = jobs.length > 0 ? jobs : defaultJobs;
    return all.filter(j => j.publishOnCollabCareers);
  }, [jobs]);

  const activeFilters = [locationFilter, employmentFilter, jobTypeFilter].filter(Boolean);

  const filteredJobs = displayJobs.filter((job) => {
    if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    if (locationFilter && job.location !== locationFilter) return false;
    if (employmentFilter && job.employmentType !== employmentFilter) return false;
    if (jobTypeFilter && job.jobType !== jobTypeFilter) return false;
    return true;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setEmploymentFilter('');
    setJobTypeFilter('');
  };

  const locations = Array.from(new Set(displayJobs.map(j => j.location))).filter(Boolean);
  const employmentTypes = Array.from(new Set(displayJobs.map(j => j.employmentType))).filter(Boolean);
  const jobTypes = Array.from(new Set(displayJobs.map(j => j.jobType))).filter(Boolean);

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
              <p className="text-white/70 text-sm mt-1">Building the future of email infrastructure</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/60 mt-2">
            <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> Technology</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Ahmedabad, India</span>
            <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {displayJobs.length} Open Positions</span>
          </div>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-[57px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title or skill..."
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Filters */}
            <FilterDropdown
              label="Location"
              icon={<MapPin className="w-3.5 h-3.5" />}
              value={locationFilter}
              options={locations}
              onChange={setLocationFilter}
            />
            <FilterDropdown
              label="Employment Type"
              icon={<Briefcase className="w-3.5 h-3.5" />}
              value={employmentFilter}
              options={employmentTypes}
              onChange={setEmploymentFilter}
            />
            <FilterDropdown
              label="Job Type"
              icon={<Building2 className="w-3.5 h-3.5" />}
              value={jobTypeFilter}
              options={jobTypes}
              onChange={setJobTypeFilter}
            />

            {activeFilters.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-[#292bb0] font-medium transition-colors whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              {locationFilter && (
                <Chip variant="active">
                  Location: {locationFilter}
                  <button onClick={() => setLocationFilter('')} className="ml-1.5"><X className="w-3 h-3" /></button>
                </Chip>
              )}
              {employmentFilter && (
                <Chip variant="active">
                  {employmentFilter}
                  <button onClick={() => setEmploymentFilter('')} className="ml-1.5"><X className="w-3 h-3" /></button>
                </Chip>
              )}
              {jobTypeFilter && (
                <Chip variant="active">
                  {jobTypeFilter}
                  <button onClick={() => setJobTypeFilter('')} className="ml-1.5"><X className="w-3 h-3" /></button>
                </Chip>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-sm text-[#6B7280] mb-5">
          Showing <span className="font-semibold text-[#1A1A2E]">{filteredJobs.length}</span> open positions
        </p>

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
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Chip>
                  <MapPin className="w-3 h-3 mr-1" />{job.location}
                </Chip>
                <Chip>{job.jobType}</Chip>
                <Chip>{job.employmentType}</Chip>
              </div>

              {/* Experience */}
              <div className="flex items-center gap-1.5 text-sm text-[#6B7280] mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>{job.experience} Experience</span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                {job.skills?.slice(0, 3).map((skill) => (
                  <Chip key={skill} variant="skill">{skill}</Chip>
                ))}
                {(job.skills?.length ?? 0) > 3 && (
                  <span className="text-xs text-[#9CA3AF] font-medium">+{(job.skills?.length ?? 0) - 3} more</span>
                )}
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                <span className="text-xs text-[#9CA3AF]">
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <Link
                  to={`/portal/yopmails/job/${job.id}`}
                  className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-[#292bb0] transition-colors"
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

// Filter Dropdown component
function FilterDropdown({ label, icon, value, options, onChange }: {
  label: string; icon: React.ReactNode; value: string; options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none border rounded-lg px-3 py-2.5 text-sm pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
          value ? 'bg-primary/5 border-primary/30 text-primary font-medium' : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#374151]'
        }`}
      >
        <option value="">{label}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}
