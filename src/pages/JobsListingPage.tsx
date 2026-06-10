import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import { useApp } from '../store/AppContext';
import { Eye, Pencil, Globe, MoreVertical, Maximize2, Plus, X, Filter as FilterIcon } from 'lucide-react';

function StatCard({
  label,
  value,
  showAdd,
  onAdd,
}: {
  label: string;
  value: number;
  showAdd?: boolean;
  onAdd?: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] px-5 py-4 flex flex-col">
      <p className="text-xs font-medium text-[#6B7280]">{label}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-2xl font-semibold text-[#111827]">{value}</span>
        {showAdd && (
          <button
            onClick={onAdd}
            className="w-8 h-8 rounded-lg border border-[#C7D2FE] bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center hover:bg-[#E0E7FF] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Open:  { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  Draft: { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  Close: { bg: '#F9FAFB', text: '#6B7280', border: '#E5E7EB' },
};

export default function JobsListingPage() {
  const { jobs, applications } = useApp();
  const navigate = useNavigate();

  const [activeFilters] = useState(['Open', 'Draft']);

  const openCount   = jobs.filter(j => j.status === 'Open').length;
  const draftCount  = jobs.filter(j => j.status === 'Draft').length;
  const closedCount = jobs.filter(j => j.status === 'Close').length;

  const filteredJobs = jobs.filter(j => activeFilters.includes(j.status));

  const appliedCountFor = (jobId: string) =>
    applications.filter(a => a.jobId === jobId).length;

  const getJobCode = (idx: number) =>
    `JB-${String(jobs.length - idx).padStart(1, '0')}`;

  return (
    <CRMLayout breadcrumbs={[{ label: 'Jobs' }]}>
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatCard label="Total Jobs"  value={jobs.length} showAdd onAdd={() => navigate('/crm/add-job')} />
        <StatCard label="Open Jobs"   value={openCount} />
        <StatCard label="Draft Jobs"  value={draftCount} />
        <StatCard label="Closed Jobs" value={closedCount} />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        {/* Table header */}
        <div className="px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-semibold text-[#111827]">Jobs</h2>
            <span className="text-xs font-medium text-[#4F46E5] bg-[#EEF2FF] border border-[#C7D2FE] px-2 py-0.5 rounded-full">
              1 – {filteredJobs.length} of {filteredJobs.length} Jobs
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-px">
              <button
                onClick={() => navigate('/crm/add-job')}
                className="bg-[#4F46E5] text-white text-xs font-semibold px-4 h-8 rounded-l-lg hover:bg-[#4338CA] transition-colors"
              >
                Add Job
              </button>
              <button className="bg-[#4F46E5] text-white text-xs font-semibold px-3 h-8 rounded-r-lg hover:bg-[#4338CA] transition-colors border-l border-white/20 flex items-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
            </div>
            <button className="w-8 h-8 border border-[#D1D5DB] rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 border border-[#D1D5DB] rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-[#E5E7EB] border-y border-[#D1D5DB] px-3 py-2 flex items-center gap-2">
          {/* Sigma / aggregate selector */}
          <div className="h-9 px-2 bg-white border border-[#D1D5DB] rounded-lg flex items-center text-xs text-[#374151] font-medium gap-1">
            <span className="text-[#4F46E5] font-bold text-sm">Σ</span>
            <svg className="w-3 h-3 text-[#9CA3AF]" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
          </div>

          {/* Active filter chips */}
          <div className="flex-1 h-9 bg-white border border-[#D1D5DB] rounded-lg flex items-center px-2 gap-2">
            <div className="flex items-center gap-1 bg-[#F3F4F6] rounded-md px-1">
              <div className="flex items-center gap-1 bg-white border border-[#D1D5DB] rounded py-0.5 px-2 text-xs font-semibold text-[#374151]">
                <svg className="w-3.5 h-3.5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Status
              </div>
              <div className="bg-white border border-[#D1D5DB] rounded py-0.5 px-2 text-xs text-[#374151]">Is</div>
              <div className="bg-white border border-[#D1D5DB] rounded py-0.5 px-2 text-xs text-[#374151]">Open</div>
              <div className="bg-white border border-[#D1D5DB] rounded py-0.5 px-2 text-xs text-[#374151]">Draft</div>
              <X className="w-3.5 h-3.5 text-[#6B7280] cursor-pointer hover:text-red-500 mx-0.5" />
            </div>
            <button className="w-6 h-6 rounded-lg border border-[#C7D2FE] bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center hover:bg-[#E0E7FF] transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
            <div className="ml-auto">
              <X className="w-4 h-4 text-[#6B7280] cursor-pointer hover:text-red-500" />
            </div>
          </div>

          <button className="h-9 px-4 bg-[#EEF2FF] border border-[#C7D2FE] text-[#4F46E5] text-xs font-semibold rounded-lg flex items-center gap-1.5 hover:bg-[#E0E7FF] transition-colors">
            <FilterIcon className="w-3.5 h-3.5" /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px]">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                {[
                  { label: 'No.',                     sortable: false },
                  { label: 'Code',                    sortable: true  },
                  { label: 'Job Title',               sortable: true  },
                  { label: 'Published on',            sortable: false },
                  { label: 'Recruiter',               sortable: false },
                  { label: 'Experience(Y)',            sortable: true  },
                  { label: 'Status',                  sortable: true  },
                  { label: 'Target Date',             sortable: true  },
                  { label: 'Openings',                sortable: true  },
                  { label: 'Applications',            sortable: true  },
                  { label: 'Int. Scheduling Pending', sortable: true  },
                  { label: 'Int. Scheduled',          sortable: true  },
                  { label: 'Job Type',                sortable: true  },
                  { label: 'Employment Type',         sortable: true  },
                  { label: 'Created by',              sortable: true  },
                  { label: 'Modified by',             sortable: true  },
                ].map(({ label, sortable }) => (
                  <th key={label} className="text-left text-xs font-medium text-[#6B7280] px-4 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {label}
                      {sortable && (
                        <svg className="w-3.5 h-3.5 text-[#D1D5DB]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 12l5-5 5 5H5z" /><path d="M5 8l5 5 5-5H5z" />
                        </svg>
                      )}
                    </div>
                  </th>
                ))}
                <th className="text-center text-xs font-medium text-[#6B7280] px-4 py-2.5 whitespace-nowrap sticky right-0 bg-[#F9FAFB]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {filteredJobs.map((job, idx) => {
                const statusStyle = STATUS_STYLES[job.status] ?? STATUS_STYLES.Close;
                const appliedCount = appliedCountFor(job.id);
                const code = getJobCode(jobs.indexOf(job));
                const createdDate = job.createdAt
                  ? new Date(job.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
                    ', ' + new Date(job.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })
                  : '-';

                return (
                  <tr
                    key={job.id}
                    className="h-[56px] hover:bg-[#F9FAFB] cursor-pointer group"
                    onClick={() => navigate(`/crm/jobs/${job.id}`)}
                  >
                    {/* No. */}
                    <td className="px-4 py-2 text-xs text-[#111827] font-medium whitespace-nowrap">{idx + 1}</td>

                    {/* Code */}
                    <td className="px-4 py-2 text-xs text-[#6B7280] whitespace-nowrap">{code}</td>

                    {/* Job Title */}
                    <td className="px-4 py-2 whitespace-nowrap">
                      <p className="text-xs font-medium text-[#111827] truncate max-w-[180px]">{job.title}</p>
                      <p className="text-xs text-[#6B7280] truncate max-w-[180px]">{job.businessUnit}</p>
                    </td>

                    {/* Published on */}
                    <td className="px-4 py-2 whitespace-nowrap">
                      {job.publishOnCollabCareers ? (
                        <span className="inline-flex items-center w-7 h-7 rounded-full border border-[#C7D2FE] bg-[#EEF2FF] text-[#4F46E5] justify-center">
                          <Globe className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="text-xs text-[#6B7280]">-</span>
                      )}
                    </td>

                    {/* Recruiter */}
                    <td className="px-4 py-2 text-xs text-[#6B7280] max-w-[200px] break-words whitespace-normal">{job.recruiter || '-'}</td>

                    {/* Experience(Y) */}
                    <td className="px-4 py-2 text-xs text-[#6B7280] whitespace-nowrap">{job.experience || '-'}</td>

                    {/* Status */}
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                        style={{ background: statusStyle.bg, color: statusStyle.text, borderColor: statusStyle.border }}
                      >
                        {job.status}
                      </span>
                    </td>

                    {/* Target Date */}
                    <td className="px-4 py-2 text-xs whitespace-nowrap">
                      {job.targetDate
                        ? <span className="text-red-500">{job.targetDate}</span>
                        : <span className="text-[#6B7280]">-</span>}
                    </td>

                    {/* Openings */}
                    <td className="px-4 py-2 text-xs text-[#6B7280] whitespace-nowrap">2</td>

                    {/* Applications */}
                    <td className="px-4 py-2 text-xs text-[#6B7280] whitespace-nowrap">{appliedCount || '-'}</td>

                    {/* Int. Scheduling Pending */}
                    <td className="px-4 py-2 text-xs text-[#6B7280] whitespace-nowrap">-</td>

                    {/* Int. Scheduled */}
                    <td className="px-4 py-2 text-xs text-[#6B7280] whitespace-nowrap">-</td>

                    {/* Job Type */}
                    <td className="px-4 py-2 text-xs text-[#6B7280] whitespace-nowrap">{job.jobType || '-'}</td>

                    {/* Employment Type */}
                    <td className="px-4 py-2 text-xs text-[#6B7280] whitespace-nowrap">{job.employmentType || '-'}</td>

                    {/* Created by */}
                    <td className="px-4 py-2 whitespace-nowrap">
                      <p className="text-xs text-[#374151] truncate max-w-[140px]">{job.recruiter || 'Admin'}</p>
                      <p className="text-xs text-[#6B7280]">{createdDate}</p>
                    </td>

                    {/* Modified by */}
                    <td className="px-4 py-2 whitespace-nowrap">
                      <p className="text-xs text-[#374151] truncate max-w-[140px]">{job.recruiter || 'Admin'}</p>
                      <p className="text-xs text-[#6B7280]">{createdDate}</p>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-2 whitespace-nowrap sticky right-0 bg-white group-hover:bg-[#F9FAFB] border-l border-[#E5E7EB]">
                      <div className="flex items-center justify-center gap-2.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/crm/jobs/${job.id}`); }}
                          className="text-[#6B7280] hover:text-[#3538CD] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate('/crm/add-job'); }}
                          className="text-[#6B7280] hover:text-[#3538CD] transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B7280]">Records Per Page</span>
            <div className="relative">
              <select className="text-xs border border-[#D1D5DB] rounded-lg px-2 py-1 pr-6 appearance-none bg-white text-[#374151]">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <svg className="w-3 h-3 text-[#9CA3AF] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-xs text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] disabled:opacity-50" disabled>
              ← Previous
            </button>
            <button className="w-7 h-7 text-xs font-semibold bg-[#4F46E5] text-white rounded-lg">1</button>
            <button className="px-3 py-1.5 text-xs text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] disabled:opacity-50" disabled>
              Next →
            </button>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
