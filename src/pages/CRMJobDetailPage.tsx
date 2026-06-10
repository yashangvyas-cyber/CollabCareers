import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import { useApp } from '../store/AppContext';
import {
  Globe, Info, Eye, Pencil, Copy, ExternalLink, Plus,
  Search, Calendar, ChevronDown, ArrowUpDown, Filter as FilterIcon,
  MoreVertical, Clock,
} from 'lucide-react';

// ─── Static mock data for candidates applied ──────────────────────────────────
type PanelSuggestion = 'Pending' | 'Should Hire' | 'Not Sure' | 'No Show/Cancelled' | null;

interface MockCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  interviewDate: string | null;
  panelSuggestion: PanelSuggestion;
  feedbackScore: number | null;
  completedRounds: number | null;
  appStatus: string;
}

const MOCK_CANDIDATES: MockCandidate[] = [
  { id: 'mc1', name: 'Arjun Mehta',   email: 'arjun.mehta@gmail.com',   phone: '+91 9824501234', experience: '3Y 2M',  interviewDate: '01-Jun-2026, 12:00 PM', panelSuggestion: 'Pending',           feedbackScore: null, completedRounds: null, appStatus: 'Applied' },
  { id: 'mc2', name: 'Kavya Iyer',    email: 'kavya.iyer@gmail.com',    phone: '+91 8987654321', experience: 'Fresher', interviewDate: '17-May-2026, 02:00 PM', panelSuggestion: 'Should Hire',       feedbackScore: 9,    completedRounds: 1,    appStatus: 'Shortlisted' },
  { id: 'mc3', name: 'Arjun Reddy',   email: 'arjun.reddy@gmail.com',   phone: '+91 7098765432', experience: '1Y 7M',  interviewDate: '24-May-2026, 01:40 PM', panelSuggestion: 'Should Hire',       feedbackScore: 8,    completedRounds: 2,    appStatus: 'Interview in Progress' },
  { id: 'mc4', name: 'Deepa Nair',    email: 'deepa.nair@gmail.com',    phone: '+91 9109876543', experience: '2Y 11M', interviewDate: '18-May-2026, 04:00 PM', panelSuggestion: 'No Show/Cancelled', feedbackScore: null, completedRounds: 1,    appStatus: 'No Show' },
  { id: 'mc5', name: 'Vikram Singh',  email: 'vikram.singh@gmail.com',  phone: '+91 8210987654', experience: '6Y 3M',  interviewDate: '19-May-2026, 01:10 PM', panelSuggestion: 'Not Sure',          feedbackScore: 7,    completedRounds: 1,    appStatus: 'Under Review' },
  { id: 'mc6', name: 'Anjali Joshi',  email: 'anjali.joshi@gmail.com',  phone: '+91 9321098765', experience: '3Y 0M',  interviewDate: '19-May-2026, 04:10 PM', panelSuggestion: 'Pending',           feedbackScore: null, completedRounds: null, appStatus: 'Interview in Progress' },
  { id: 'mc7', name: 'Rohan Desai',   email: 'rohan.desai@gmail.com',   phone: '+91 8432109876', experience: '4Y 2M',  interviewDate: '25-May-2026, 02:20 PM', panelSuggestion: null,                feedbackScore: null, completedRounds: null, appStatus: 'Offer Made' },
  { id: 'mc8', name: 'Sneha Mehta',   email: 'sneha.mehta@gmail.com',   phone: '+91 9543210987', experience: '2Y 8M',  interviewDate: '18-May-2026, 03:25 PM', panelSuggestion: null,                feedbackScore: null, completedRounds: null, appStatus: 'On Hold' },
  { id: 'mc9', name: 'Amit Kumar',    email: 'amit.kumar@outlook.com',  phone: '+91 7654321098', experience: '5Y 0M',  interviewDate: null,                    panelSuggestion: null,                feedbackScore: null, completedRounds: null, appStatus: 'Applied' },
  { id: 'mc10',name: 'Priya Patel',   email: 'priya.patel@gmail.com',   phone: '+91 8765432109', experience: '2Y 4M',  interviewDate: null,                    panelSuggestion: null,                feedbackScore: null, completedRounds: null, appStatus: 'Rejected' },
];

// Pipeline funnel cards (active stages) — scoped to this job's applications
const STAT_CARDS = [
  { id: 'all',         label: 'All Applications', statuses: [] as string[] },
  { id: 'pending',     label: 'Pending Review',   statuses: ['Applied', 'Under Review'],      sub: 'Applied + Under Review' },
  { id: 'shortlisted', label: 'Shortlisted',      statuses: ['Shortlisted'] },
  { id: 'interview',   label: 'Interview',        statuses: ['Interview in Progress'] },
  { id: 'offer',       label: 'Offer Stage',      statuses: ['Offer Made', 'Offer Accepted'], sub: 'Offered + Accepted' },
  { id: 'onhold',      label: 'On Hold',          statuses: ['On Hold'] },
];

// Closed & terminal stages (collapsible chips)
const TERMINAL_CHIPS = [
  { status: 'Selected',       border: 'rgb(171,239,198)', text: 'rgb(23,178,106)', bg: 'rgb(236,253,243)', dot: 'rgb(23,178,106)'  },
  { status: 'Rejected',       border: 'rgb(254,205,202)', text: 'rgb(180,35,24)',  bg: 'rgb(254,243,242)', dot: 'rgb(240,68,56)'   },
  { status: 'Withdrawn',      border: 'rgb(220,215,210)', text: 'rgb(113,104,95)', bg: 'rgb(250,249,247)', dot: 'rgb(168,160,149)' },
  { status: 'Joined',         border: 'rgb(213,217,235)', text: 'rgb(54,63,114)',  bg: 'rgb(248,249,252)', dot: 'rgb(78,91,166)'   },
  { status: 'Offer Declined', border: 'rgb(246,208,254)', text: 'rgb(159,26,177)', bg: 'rgb(253,244,255)', dot: 'rgb(212,68,241)'  },
  { status: 'Not Joined',     border: 'rgb(255,193,205)', text: 'rgb(255,0,81)',   bg: 'rgb(255,241,243)', dot: 'rgb(255,0,81)'    },
  { status: 'Archived',       border: 'rgb(203,213,225)', text: 'rgb(71,85,105)',  bg: 'rgb(248,250,252)', dot: 'rgb(100,116,139)' },
  { status: 'Offer Revoked',  border: 'rgb(255,221,211)', text: 'rgb(255,87,34)',  bg: 'rgb(255,247,244)', dot: 'rgb(255,137,100)' },
  { status: 'No Show',        border: 'rgb(253,186,116)', text: 'rgb(120,53,15)',  bg: 'rgb(255,247,237)', dot: 'rgb(217,119,6)'   },
];

const PANEL_STYLE: Record<NonNullable<PanelSuggestion>, { bg: string; text: string; border: string }> = {
  'Pending':           { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  'Should Hire':       { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  'Not Sure':          { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  'No Show/Cancelled': { bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3' },
};

// ─── Static mock history ─────────────────────────────────────────────────────
const MOCK_HISTORY = [
  {
    id: 'h1',
    actor: 'Gurpreetsingh Dhillon',
    date: '22-May-2026, 06:48 PM',
    action: 'Job updated',
    changes: [
      { field: 'Publish on Website',   from: 'No', to: 'Yes' },
      { field: 'Public Link Enabled',  from: 'No', to: 'Yes' },
      { field: 'Publish on Career Portal', from: 'No', to: 'Yes' },
    ],
  },
  {
    id: 'h2',
    actor: 'Gurpreetsingh Dhillon',
    date: '22-May-2026, 06:48 PM',
    action: 'Job created',
    changes: [
      { field: 'Job Title', from: null, to: 'React JS Developer' },
    ],
  },
];

// ─── Shared left panel ───────────────────────────────────────────────────────
function JobInfoPanel({ job, code, applicantsCount }: { job: any; code: string; applicantsCount: number }) {
  const createdDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' +
      new Date(job.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '-';

  return (
    <aside className="w-[260px] shrink-0 bg-white border-r border-[#E5E7EB] overflow-y-auto">
      {/* Title + status */}
      <div className="p-4 border-b border-[#E5E7EB]">
        <p className="text-base font-semibold text-[#374151]">{code}</p>
        <p className="text-base font-semibold text-[#111827] capitalize mt-0.5 break-words">{job.title}</p>
        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]">
            {job.status}
          </span>
          {job.publishOnCollabCareers && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-[#C7D2FE] bg-[#EEF2FF] text-[#4F46E5]">
              <Globe className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="p-4 border-b border-[#E5E7EB] flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#9CA3AF]">Job Openings</span>
          <span className="text-xs font-medium text-[#374151]">2</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#9CA3AF]">Experience Required (Years)</span>
          <span className="text-xs font-medium text-[#374151]">{job.experience || '-'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#9CA3AF]">Candidates Applied</span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-[#374151]">{applicantsCount}</span>
            <Info className="w-3.5 h-3.5 text-[#9CA3AF]" />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 border-b border-[#E5E7EB] flex flex-col gap-3">
        <div>
          <p className="text-xs text-[#9CA3AF]">Employment Type</p>
          <p className="text-xs font-medium text-[#374151] mt-0.5">{job.employmentType || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-[#9CA3AF]">Job Category</p>
          <p className="text-xs font-medium text-[#374151] mt-0.5">Engineering</p>
        </div>
        <div>
          <p className="text-xs text-[#9CA3AF]">Target Date</p>
          <p className="text-xs font-medium text-[#374151] mt-0.5">{job.targetDate || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-[#9CA3AF]">Job Closed On</p>
          <p className="text-xs font-medium text-[#374151] mt-0.5">-</p>
        </div>
      </div>

      {/* Skills */}
      <div className="p-4 border-b border-[#E5E7EB]">
        <p className="text-xs text-[#9CA3AF] mb-2">Required Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {(job.skills || []).map((skill: string) => (
            <span key={skill} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-[#C7D2FE] bg-[#EEF2FF] text-[#4F46E5]">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Business Unit */}
      <div className="p-4 border-b border-[#E5E7EB]">
        <p className="text-xs text-[#9CA3AF]">Business Unit</p>
        <p className="text-xs font-medium text-[#374151] mt-0.5">{job.businessUnit}</p>
      </div>

      {/* Created / Modified */}
      <div className="p-4">
        <p className="text-xs text-[#9CA3AF]">Created by</p>
        <div className="mt-1 mb-4">
          <p className="text-xs font-medium text-[#374151]">{job.recruiter || 'Admin'}</p>
          <p className="text-xs text-[#374151]">{createdDate}</p>
        </div>
        <p className="text-xs text-[#9CA3AF]">Modified by</p>
        <div className="mt-1">
          <p className="text-xs font-medium text-[#374151]">{job.recruiter || 'Admin'}</p>
          <p className="text-xs text-[#374151]">{createdDate}</p>
        </div>
      </div>
    </aside>
  );
}

// ─── Tab: Job Description ────────────────────────────────────────────────────
function JobDescriptionTab({ job }: { job: any }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`collabcareers.com/portal/job/${job.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const salaryMin = job.salaryRange?.min ? `₹ ${parseInt(job.salaryRange.min).toLocaleString('en-IN')}` : '-';
  const salaryMax = job.salaryRange?.max ? `₹ ${parseInt(job.salaryRange.max).toLocaleString('en-IN')}` : '-';
  const ctcType   = job.salaryRange?.type === 'Annual' ? 'Yearly' : (job.salaryRange?.type || '-');
  const currency  = job.salaryRange?.currency === '₹' || job.salaryRange?.currency === 'INR'
    ? 'Indian Rupee (INR - ₹)'
    : (job.salaryRange?.currency || '-');

  const evalColors = [
    'border-[#C7D2FE] bg-[#EEF2FF] text-[#4F46E5]',
    'border-[#FECDD3] bg-[#FFF1F2] text-[#BE123C]',
    'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]',
    'border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]',
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      {/* Description card */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        {/* Sub-header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-[#E5E7EB]">
          <p className="text-sm font-medium text-[#374151] capitalize">
            {job.title} | {job.location || 'Ahmedabad, Gujarat, India'} | {job.jobType || 'On-Site'}
          </p>
          <div className="flex items-center gap-3 text-xs text-[#4F46E5]">
            <button onClick={handleCopy} className="flex items-center gap-1.5 hover:text-[#3730A3] transition-colors">
              <span className="underline">{copied ? 'Copied!' : 'Copy Sharable Link'}</span>
              <Copy className="w-3.5 h-3.5" />
            </button>
            <span className="text-[#E5E7EB]">|</span>
            <button className="flex items-center gap-1.5 hover:text-[#3730A3] transition-colors">
              <span className="underline">Open Job Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {/* Description text */}
        <div className="px-5 py-4 text-sm text-[#374151] leading-relaxed whitespace-pre-line">
          {job.description}
        </div>
      </div>

      {/* Salary Range */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
        <h3 className="text-sm font-semibold text-[#111827] mb-4">Salary Range</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'CTC Type',      value: ctcType },
            { label: 'Minimum (CTC)', value: salaryMin },
            { label: 'Maximum (CTC)', value: salaryMax },
            { label: 'Currency',      value: currency },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-[#9CA3AF]">{label}</p>
              <p className="text-sm font-medium text-[#374151] mt-1">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Evaluation Criteria */}
      {job.evaluationCriteria?.length > 0 && (
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
          <h3 className="text-sm font-semibold text-[#111827] mb-4">Evaluation Criteria</h3>
          <div className="flex flex-wrap gap-2">
            {job.evaluationCriteria.map((c: string, i: number) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${evalColors[i % evalColors.length]}`}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Ownership */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
        <h3 className="text-sm font-semibold text-[#111827] mb-4">Ownership</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-[#9CA3AF]">Recruiter(s)</p>
            <p className="text-sm font-medium text-[#374151] mt-1">{job.recruiter || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF]">Interview Panel</p>
            <p className="text-sm font-medium text-[#374151] mt-1">-</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Candidates Applied ─────────────────────────────────────────────────
function CandidatesAppliedTab({ count }: { count: number }) {
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
  const [terminalOpen, setTerminalOpen] = useState(false);

  const handleStatClick = (statuses: string[]) => {
    // Clicking the active card (or "All") clears the filter
    if (statuses.length === 0) { setFilterStatuses([]); return; }
    setFilterStatuses(prev =>
      prev.length === statuses.length && statuses.every(s => prev.includes(s)) ? [] : statuses
    );
  };

  const handleChipClick = (status: string) => {
    setFilterStatuses(prev => (prev.length === 1 && prev[0] === status ? [] : [status]));
  };

  const filteredCandidates = filterStatuses.length > 0
    ? MOCK_CANDIDATES.filter(c => filterStatuses.includes(c.appStatus))
    : MOCK_CANDIDATES;

  const shownCount = filteredCandidates.length;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Pipeline funnel cards */}
      <div className="grid grid-cols-6 gap-4">
        {STAT_CARDS.map(card => {
          const cardCount = card.statuses.length === 0
            ? MOCK_CANDIDATES.length
            : MOCK_CANDIDATES.filter(c => card.statuses.includes(c.appStatus)).length;
          const isActive =
            card.statuses.length > 0 &&
            card.statuses.length === filterStatuses.length &&
            card.statuses.every(s => filterStatuses.includes(s));
          return (
            <button
              key={card.id}
              onClick={() => handleStatClick(card.statuses)}
              className={`bg-white rounded-xl px-5 py-4 flex flex-col border shadow-sm min-h-[96px] text-left transition-all hover:shadow-md ${
                isActive ? 'border-[#3538CD]/40 ring-2 ring-[#3538CD]/20' : 'border-[#E5E7EB]'
              }`}
            >
              <p className="text-xs font-medium text-[#6B7280]">{card.label}</p>
              <div className="mt-auto pt-3">
                <span className="text-2xl font-semibold text-[#111827]">{cardCount}</span>
                {card.sub && <p className="text-[10px] italic text-[#9CA3AF] mt-0.5">{card.sub}</p>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Closed & Terminal stages — collapsible */}
      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl overflow-hidden">
        <button
          onClick={() => setTerminalOpen(v => !v)}
          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#F3F4F6] transition-colors"
        >
          <span className="text-sm font-semibold text-[#374151]">Click to View Closed &amp; Terminal Stages</span>
          <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform duration-300 ${terminalOpen ? 'rotate-180' : ''}`} />
        </button>
        <div className={`transition-all duration-300 overflow-hidden ${terminalOpen ? 'max-h-[160px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {TERMINAL_CHIPS.map(chip => {
              const chipCount = MOCK_CANDIDATES.filter(c => c.appStatus === chip.status).length;
              const isActive = filterStatuses.length === 1 && filterStatuses[0] === chip.status;
              return (
                <button
                  key={chip.status}
                  onClick={() => handleChipClick(chip.status)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all"
                  style={{ borderColor: chip.border, color: chip.text, backgroundColor: isActive ? chip.border : chip.bg }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: chip.dot }} />
                  {chip.status}
                  <span className="font-bold">{chipCount}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-semibold text-[#111827]">Candidates Applied</h3>
            <span className="text-xs font-medium text-[#4F46E5] bg-[#EEF2FF] border border-[#C7D2FE] px-2 py-0.5 rounded-full">
              {filterStatuses.length > 0
                ? `${shownCount} of ${count} Candidates`
                : `1 – ${Math.min(count, 10)} of ${count} Candidates`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-[#4F46E5] text-white text-xs font-semibold px-4 h-8 rounded-lg hover:bg-[#4338CA] transition-colors flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Candidate
            </button>
            <button className="w-8 h-8 border border-[#D1D5DB] rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F9FAFB]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
            <button className="w-8 h-8 border border-[#D1D5DB] rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F9FAFB]">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search + filter */}
        <div className="px-5 py-3 border-b border-[#E5E7EB] flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter Results..."
              className="w-full pl-9 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] text-[#374151]"
            />
          </div>
          <button className="h-9 px-4 bg-[#EEF2FF] border border-[#C7D2FE] text-[#4F46E5] text-xs font-semibold rounded-lg flex items-center gap-1.5 hover:bg-[#E0E7FF] transition-colors whitespace-nowrap">
            <FilterIcon className="w-3.5 h-3.5" /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                {['No.', 'Name', 'Contact Number', 'Experience', 'Interview Date and Time', 'Panel Suggestion', 'Feedback Score', 'Completed Rounds', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-[#6B7280] px-4 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {h}
                      {['Name','Experience','Interview Date and Time','Panel Suggestion','Feedback Score','Completed Rounds'].includes(h) && (
                        <ArrowUpDown className="w-3 h-3 text-[#D1D5DB]" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-xs text-[#9CA3AF]">
                    No candidates in this stage.
                  </td>
                </tr>
              )}
              {filteredCandidates.map((c, idx) => (
                <tr key={c.id} className="h-[56px] hover:bg-[#F9FAFB] group">
                  <td className="px-4 py-2 text-xs text-[#111827] font-medium whitespace-nowrap">{idx + 1}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <p className="text-xs font-semibold text-[#111827]">{c.name}</p>
                    <p className="text-xs text-[#6B7280]">{c.email}</p>
                  </td>
                  <td className="px-4 py-2 text-xs text-[#374151] whitespace-nowrap">{c.phone}</td>
                  <td className="px-4 py-2 text-xs text-[#374151] whitespace-nowrap">{c.experience}</td>
                  <td className="px-4 py-2 text-xs whitespace-nowrap">
                    {c.interviewDate ? (
                      <span className="text-[#374151]">{c.interviewDate}</span>
                    ) : (
                      <button className="px-3 py-1 text-xs font-medium border border-[#C7D2FE] bg-[#EEF2FF] text-[#4F46E5] rounded-lg hover:bg-[#E0E7FF] transition-colors flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Schedule
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {c.panelSuggestion ? (
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                        style={{
                          background: PANEL_STYLE[c.panelSuggestion].bg,
                          color: PANEL_STYLE[c.panelSuggestion].text,
                          borderColor: PANEL_STYLE[c.panelSuggestion].border,
                        }}
                      >
                        {c.panelSuggestion}
                      </span>
                    ) : (
                      <span className="text-xs text-[#9CA3AF]">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs text-[#374151] whitespace-nowrap">
                    {c.feedbackScore ?? <span className="text-[#9CA3AF]">-</span>}
                  </td>
                  <td className="px-4 py-2 text-xs text-[#374151] whitespace-nowrap">
                    {c.completedRounds ?? <span className="text-[#9CA3AF]">-</span>}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <button className="text-[#6B7280] hover:text-[#4F46E5] transition-colors"><Eye className="w-4 h-4" /></button>
                      <button className="text-[#6B7280] hover:text-[#4F46E5] transition-colors"><Pencil className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
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
              </select>
              <ChevronDown className="w-3 h-3 text-[#9CA3AF] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-xs text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] disabled:opacity-50" disabled>
              ← Previous
            </button>
            <button className="w-7 h-7 text-xs font-semibold bg-[#4F46E5] text-white rounded-lg">1</button>
            <button className="w-7 h-7 text-xs font-semibold border border-[#E5E7EB] text-[#374151] rounded-lg hover:bg-[#F9FAFB]">2</button>
            <button className="px-3 py-1.5 text-xs text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: History ────────────────────────────────────────────────────────────
function HistoryTab() {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-[#E5E7EB]">
          <h3 className="text-base font-semibold text-[#111827]">History</h3>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#374151] border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] transition-colors">
              <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
              Select custom range
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium text-[#374151] hover:text-[#111827] transition-colors">
              Newest First
              <ArrowUpDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-5 space-y-6">
          {MOCK_HISTORY.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center text-[#4F46E5] text-xs font-bold shrink-0">
                  {item.actor.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="w-px flex-1 bg-[#E5E7EB] mt-2 min-h-[24px]" />
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-sm font-semibold text-[#111827]">{item.actor}</p>
                  <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                    <Clock className="w-3.5 h-3.5" />
                    {item.date}
                  </div>
                </div>
                <p className="text-sm font-medium text-[#4F46E5] mb-2">{item.action}</p>
                <div className="space-y-1.5">
                  {item.changes.map((change, ci) => (
                    <div key={ci} className="flex items-center gap-2 text-xs text-[#374151]">
                      <span className="font-medium">{change.field}:</span>
                      {change.from !== null && (
                        <>
                          <span className="text-[#6B7280] line-through">{change.from}</span>
                          <span className="text-[#9CA3AF]">→</span>
                        </>
                      )}
                      <span className="font-medium text-[#111827]">{change.to}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
type Tab = 'description' | 'candidates' | 'history';

export default function CRMJobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { jobs } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>('description');

  const job = jobs.find(j => j.id === jobId);
  if (!job) {
    return (
      <CRMLayout breadcrumbs={[{ label: 'Jobs', path: '/crm/jobs' }, { label: 'Not Found' }]}>
        <div className="flex flex-col items-center justify-center py-20 text-[#6B7280]">
          <p className="text-lg font-medium">Job not found</p>
          <button onClick={() => navigate('/crm/jobs')} className="mt-4 text-sm text-[#4F46E5] underline">Back to Jobs</button>
        </div>
      </CRMLayout>
    );
  }

  const jobIdx   = jobs.indexOf(job);
  const jobCode  = `JB-${String(jobs.length - jobIdx).padStart(1, '0')}`;
  const appCount = MOCK_CANDIDATES.length;

  const tabLabel = activeTab === 'description' ? 'Job Description'
    : activeTab === 'candidates' ? 'Candidates Applied'
    : 'History';

  return (
    <CRMLayout
      breadcrumbs={[
        { label: 'Jobs', path: '/crm/jobs' },
        { label: tabLabel },
      ]}
    >
      {/* Full-bleed split layout — cancel the CRMLayout px-6 pb-8 padding */}
      <div className="-mx-6 -mb-8 flex" style={{ minHeight: 'calc(100vh - 132px)' }}>
        <JobInfoPanel job={job} code={jobCode} applicantsCount={appCount} />

        {/* Right pane */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#F4F5FA]">
          {/* Tab bar + actions */}
          <div className="bg-white border-b border-[#E5E7EB] px-5 py-2 flex items-center justify-between">
            <nav className="flex gap-1">
              {([
                { key: 'description', label: 'Job Description' },
                { key: 'candidates',  label: `Candidates Applied` },
                { key: 'history',     label: 'History' },
              ] as { key: Tab; label: string }[]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    activeTab === key
                      ? 'text-[#4F46E5] bg-[#EEF2FF]'
                      : 'text-[#6B7280] hover:text-[#374151] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {label}
                  {key === 'candidates' && (
                    <span className={`ml-1.5 text-xs border rounded-full px-1.5 py-0 ${
                      activeTab === key
                        ? 'border-[#4F46E5] text-[#4F46E5]'
                        : 'border-[#D1D5DB] text-[#6B7280]'
                    }`}>{appCount}</span>
                  )}
                </button>
              ))}
            </nav>
            {activeTab === 'description' && (
              <button
                onClick={() => navigate('/crm/add-job')}
                className="bg-[#4F46E5] text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-[#4338CA] transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          {/* Tab content */}
          {activeTab === 'description' && <JobDescriptionTab job={job} />}
          {activeTab === 'candidates'  && <CandidatesAppliedTab count={appCount} />}
          {activeTab === 'history'     && <HistoryTab />}
        </div>
      </div>
    </CRMLayout>
  );
}
