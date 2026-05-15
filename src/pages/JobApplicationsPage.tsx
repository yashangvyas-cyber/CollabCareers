import { useState } from 'react';
import { Link } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import {
  ChevronDown, Plus, X, MoreHorizontal,
  Eye, LayoutGrid, ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';

// ── Terminal chip colour definitions ──────────────────────────────────────────
const TERMINAL_CHIPS = [
  { status: 'Selected',       border: 'rgb(171,239,198)', text: 'rgb(6,118,71)',    bg: 'rgb(236,253,243)', dot: 'rgb(23,178,106)'  },
  { status: 'Rejected',       border: 'rgb(254,205,202)', text: 'rgb(180,35,24)',   bg: 'rgb(254,243,242)', dot: 'rgb(240,68,56)'   },
  { status: 'Withdrawn',      border: 'rgb(220,215,210)', text: 'rgb(113,104,95)',  bg: 'rgb(250,249,247)', dot: 'rgb(168,160,149)' },
  { status: 'Joined',         border: 'rgb(213,217,235)', text: 'rgb(54,63,114)',   bg: 'rgb(248,249,252)', dot: 'rgb(78,91,166)'   },
  { status: 'Offer Declined', border: 'rgb(246,208,254)', text: 'rgb(159,26,177)',  bg: 'rgb(253,244,255)', dot: 'rgb(212,68,241)'  },
  { status: 'Not Joined',     border: 'rgb(255,193,205)', text: 'rgb(255,0,81)',    bg: 'rgb(255,241,243)', dot: 'rgb(255,0,81)'    },
  { status: 'Archived',       border: 'rgb(203,213,225)', text: 'rgb(71,85,105)',   bg: 'rgb(248,250,252)', dot: 'rgb(100,116,139)' },
  { status: 'Offer Revoked',  border: 'rgb(255,221,211)', text: 'rgb(255,87,34)',   bg: 'rgb(255,247,244)', dot: 'rgb(255,137,100)' },
  { status: 'No Show',        border: 'rgb(253,186,116)', text: 'rgb(120,53,15)',   bg: 'rgb(255,247,237)', dot: 'rgb(217,119,6)'   },
];

const APP_STATUS_STYLE: Record<string, { border: string; text: string; bg: string; dot: string }> = {
  'Applied':               { border: 'rgb(191,219,254)', text: 'rgb(29,78,216)',  bg: 'rgb(239,246,255)', dot: 'rgb(59,130,246)'  },
  'Under Review':          { border: 'rgb(191,219,254)', text: 'rgb(29,78,216)',  bg: 'rgb(239,246,255)', dot: 'rgb(59,130,246)'  },
  'Shortlisted':           { border: 'rgb(167,243,208)', text: 'rgb(6,95,70)',    bg: 'rgb(236,253,245)', dot: 'rgb(16,185,129)'  },
  'Interview in Progress': { border: 'rgb(253,230,138)', text: 'rgb(146,64,14)',  bg: 'rgb(255,251,235)', dot: 'rgb(245,158,11)'  },
  'Offer Made':            { border: 'rgb(167,243,208)', text: 'rgb(6,78,59)',    bg: 'rgb(209,250,229)', dot: 'rgb(5,150,105)'   },
  'Offer Accepted':        { border: 'rgb(167,243,208)', text: 'rgb(6,78,59)',    bg: 'rgb(209,250,229)', dot: 'rgb(5,150,105)'   },
  'On Hold':               { border: 'rgb(221,214,254)', text: 'rgb(91,33,182)',  bg: 'rgb(245,243,255)', dot: 'rgb(139,92,246)'  },
  ...Object.fromEntries(TERMINAL_CHIPS.map(c => [c.status, c])),
};

const CANDIDATE_STATUS_STYLE: Record<string, string> = {
  'Active':      'bg-[#EEF4FF] text-[#3538CD] border-[#3538CD]/30',
  'Blacklisted': 'bg-[#EAECF5] text-[#363F72] border-[#363F72]/30',
  'Discarded':   'bg-[#F9FAFB] text-[#344054] border-[#D0D5DD]',
  'Joined':      'bg-[#F8F9FC] text-[#363F72] border-[#D5D9EB]',
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const candidatesData = [
  { no: 1,  name: 'Mahesh Patel',   email: 'mahesh@gmail.com',   phone: '+91 98765 43210', job: 'React Developer (Open)',       experience: '3 yrs',  noticePeriod: '30',  interviewDate: null,                        appStatus: 'Applied',               candidateStatus: 'Active',      source: 'CollabCRM', businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: true  },
  { no: 2,  name: 'Priya Shah',     email: 'priya@gmail.com',    phone: '+91 97654 32109', job: 'UI/UX Designer (Open)',        experience: '4 yrs',  noticePeriod: '15',  interviewDate: null,                        appStatus: 'Applied',               candidateStatus: 'Active',      source: 'CollabCRM', businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Michael Park',  isAlumni: true  },
  { no: 3,  name: 'Arjun Mehta',    email: 'arjun@gmail.com',    phone: '+91 96543 21098', job: 'Flutter Developer (Open)',     experience: '2 yrs',  noticePeriod: '0',   interviewDate: null,                        appStatus: 'Applied',               candidateStatus: 'Active',      source: 'LinkedIn',  businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 4,  name: 'Sneha Patel',    email: 'sneha@gmail.com',    phone: '+91 95432 10987', job: 'Business Analyst (Open)',      experience: '3 yrs',  noticePeriod: '30',  interviewDate: null,                        appStatus: 'Applied',               candidateStatus: 'Active',      source: 'Naukri',    businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 5,  name: 'Rahul Joshi',    email: 'rahul@gmail.com',    phone: '+91 94321 09876', job: 'Project Manager (Open)',       experience: '6 yrs',  noticePeriod: '60',  interviewDate: null,                        appStatus: 'Under Review',          candidateStatus: 'Active',      source: 'CollabCRM', businessUnit: '300Mind',       recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 6,  name: 'Kavya Rao',      email: 'kavya@gmail.com',    phone: '+91 93210 98765', job: '2D Artist (Open)',             experience: '1 yr',   noticePeriod: '0',   interviewDate: null,                        appStatus: 'Under Review',          candidateStatus: 'Active',      source: 'Referral',  businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Michael Park',  isAlumni: false },
  { no: 7,  name: 'Nikhil Sharma',  email: 'nikhil@gmail.com',   phone: '+91 92109 87654', job: 'Node.js Engineer (Open)',      experience: '4 yrs',  noticePeriod: '30',  interviewDate: null,                        appStatus: 'Under Review',          candidateStatus: 'Active',      source: 'LinkedIn',  businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: true  },
  { no: 8,  name: 'Deepa Verma',    email: 'deepa@gmail.com',    phone: '+91 91098 76543', job: 'QA Engineer (Open)',           experience: '2 yrs',  noticePeriod: '15',  interviewDate: null,                        appStatus: 'Under Review',          candidateStatus: 'Active',      source: 'CollabCRM', businessUnit: '300Mind',       recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 9,  name: 'Amit Kumar',     email: 'amit@gmail.com',     phone: '+91 90987 65432', job: 'React Developer (Open)',       experience: '5 yrs',  noticePeriod: '0',   interviewDate: '2026-04-30T13:10:00',       appStatus: 'Shortlisted',           candidateStatus: 'Active',      source: 'Naukri',    businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 10, name: 'Pooja Iyer',     email: 'pooja@gmail.com',    phone: '+91 89876 54321', job: 'UI/UX Designer (Open)',        experience: '3 yrs',  noticePeriod: '30',  interviewDate: '2026-03-16T12:55:00',       appStatus: 'Shortlisted',           candidateStatus: 'Active',      source: 'CollabCRM', businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Michael Park',  isAlumni: true  },
  { no: 11, name: 'Rohit Nair',     email: 'rohit@gmail.com',    phone: '+91 88765 43210', job: 'Flutter Developer (Open)',     experience: '3 yrs',  noticePeriod: '15',  interviewDate: '2026-03-05T09:53:00',       appStatus: 'Shortlisted',           candidateStatus: 'Active',      source: 'LinkedIn',  businessUnit: '300Mind',       recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 12, name: 'Sonal Gupta',    email: 'sonal@gmail.com',    phone: '+91 87654 32109', job: 'Business Analyst (Open)',      experience: '4 yrs',  noticePeriod: '60',  interviewDate: '2025-11-12T04:14:00',       appStatus: 'Shortlisted',           candidateStatus: 'Active',      source: 'Referral',  businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 13, name: 'Vishal Singh',   email: 'vishal@gmail.com',   phone: '+91 86543 21098', job: 'Project Manager (Open)',       experience: '7 yrs',  noticePeriod: '30',  interviewDate: '2025-11-25T14:30:00',       appStatus: 'Interview in Progress', candidateStatus: 'Active',      source: 'CollabCRM', businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: true  },
  { no: 14, name: 'Meera Pillai',   email: 'meera@gmail.com',    phone: '+91 85432 10987', job: 'Node.js Engineer (Open)',      experience: '3 yrs',  noticePeriod: '0',   interviewDate: '2026-01-08T10:00:00',       appStatus: 'Interview in Progress', candidateStatus: 'Active',      source: 'LinkedIn',  businessUnit: '300Mind',       recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Michael Park',  isAlumni: false },
  { no: 15, name: 'Karan Desai',    email: 'karan@gmail.com',    phone: '+91 84321 09876', job: 'QA Engineer (Open)',           experience: '2 yrs',  noticePeriod: '15',  interviewDate: '2026-02-14T15:30:00',       appStatus: 'Interview in Progress', candidateStatus: 'Active',      source: 'Naukri',    businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 16, name: 'Ananya Tiwari',  email: 'ananya@gmail.com',   phone: '+91 83210 98765', job: 'React Developer (Open)',       experience: '4 yrs',  noticePeriod: '30',  interviewDate: '2026-03-20T11:00:00',       appStatus: 'Offer Made',            candidateStatus: 'Active',      source: 'CollabCRM', businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 17, name: 'Suresh Reddy',   email: 'suresh@gmail.com',   phone: '+91 82109 87654', job: 'UI/UX Designer (Open)',        experience: '5 yrs',  noticePeriod: '60',  interviewDate: '2026-02-28T14:00:00',       appStatus: 'Offer Made',            candidateStatus: 'Active',      source: 'Referral',  businessUnit: '300Mind',       recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: true  },
  { no: 18, name: 'Ritu Malhotra',  email: 'ritu@gmail.com',     phone: '+91 81098 76543', job: 'Flutter Developer (Open)',     experience: '3 yrs',  noticePeriod: '15',  interviewDate: '2026-01-22T09:30:00',       appStatus: 'Offer Accepted',        candidateStatus: 'Active',      source: 'LinkedIn',  businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Michael Park',  isAlumni: false },
  { no: 19, name: 'Ajay Pandey',    email: 'ajay@gmail.com',     phone: '+91 80987 65432', job: 'Project Manager (Open)',       experience: '8 yrs',  noticePeriod: '0',   interviewDate: '2026-04-05T16:45:00',       appStatus: 'Offer Accepted',        candidateStatus: 'Active',      source: 'CollabCRM', businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: true  },
  { no: 20, name: 'Neha Bhatt',     email: 'neha@gmail.com',     phone: '+91 79876 54321', job: 'Business Analyst (Open)',      experience: '3 yrs',  noticePeriod: '30',  interviewDate: null,                        appStatus: 'On Hold',               candidateStatus: 'Active',      source: 'Naukri',    businessUnit: '300Mind',       recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 21, name: 'Prakash Yadav',  email: 'prakash@gmail.com',  phone: '+91 78765 43210', job: 'Node.js Engineer (Open)',      experience: '5 yrs',  noticePeriod: '15',  interviewDate: null,                        appStatus: 'On Hold',               candidateStatus: 'Active',      source: 'CollabCRM', businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 22, name: 'Divya Menon',    email: 'divya@gmail.com',    phone: '+91 77654 32109', job: 'React Developer (Open)',       experience: '2 yrs',  noticePeriod: '30',  interviewDate: '2025-12-10T10:30:00',       appStatus: 'Selected',              candidateStatus: 'Joined',      source: 'LinkedIn',  businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Michael Park',  isAlumni: false },
  { no: 23, name: 'Harish Nambiar', email: 'harish@gmail.com',   phone: '+91 76543 21098', job: 'QA Engineer (Open)',           experience: '3 yrs',  noticePeriod: '0',   interviewDate: '2025-10-18T14:00:00',       appStatus: 'Rejected',              candidateStatus: 'Discarded',   source: 'CollabCRM', businessUnit: '300Mind',       recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 24, name: 'Tanvi Chauhan',  email: 'tanvi@gmail.com',    phone: '+91 75432 10987', job: 'UI/UX Designer (Open)',        experience: '4 yrs',  noticePeriod: '60',  interviewDate: null,                        appStatus: 'Withdrawn',             candidateStatus: 'Active',      source: 'Referral',  businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 25, name: 'Vikram Bose',    email: 'vikram@gmail.com',   phone: '+91 74321 09876', job: 'Flutter Developer (Open)',     experience: '2 yrs',  noticePeriod: '30',  interviewDate: '2025-09-03T11:15:00',       appStatus: 'Joined',                candidateStatus: 'Joined',      source: 'CollabCRM', businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: true  },
  { no: 26, name: 'Swati Kulkarni', email: 'swati@gmail.com',    phone: '+91 73210 98765', job: 'Project Manager (Open)',       experience: '6 yrs',  noticePeriod: '15',  interviewDate: '2025-11-07T09:00:00',       appStatus: 'Offer Declined',        candidateStatus: 'Active',      source: 'LinkedIn',  businessUnit: '300Mind',       recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Michael Park',  isAlumni: false },
];

const formatInterviewDate = (iso: string) => {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const mon = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  const time = d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${day}/${mon}/${year}, ${time}`;
};

type SortKey = 'job' | 'experience' | 'noticePeriod' | 'interviewDate' | 'appStatus' | 'candidateStatus' | 'source' | 'businessUnit' | 'recordOwner';
type SortDir = 'asc' | 'desc';

export default function JobApplicationsPage() {
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ sKey }: { sKey: SortKey }) => {
    if (sortKey !== sKey) return <ArrowUpDown className="w-3 h-3 text-[#D1D5DB]" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-[#3538CD]" /> : <ArrowDown className="w-3 h-3 text-[#3538CD]" />;
  };

  const filteredCandidates = filterStatuses.length === 0
    ? candidatesData
    : candidatesData.filter(c => filterStatuses.includes(c.appStatus));

  const sortedCandidates = sortKey ? [...filteredCandidates].sort((a, b) => {
    let av: string | number, bv: string | number;
    switch (sortKey) {
      case 'job':             av = a.job.toLowerCase();             bv = b.job.toLowerCase();             break;
      case 'experience':      av = parseInt(a.experience) || 0;     bv = parseInt(b.experience) || 0;     break;
      case 'noticePeriod':    av = parseInt(a.noticePeriod) || 0;   bv = parseInt(b.noticePeriod) || 0;   break;
      case 'interviewDate':   av = a.interviewDate ?? '';            bv = b.interviewDate ?? '';            break;
      case 'appStatus':       av = a.appStatus.toLowerCase();       bv = b.appStatus.toLowerCase();       break;
      case 'candidateStatus': av = a.candidateStatus.toLowerCase(); bv = b.candidateStatus.toLowerCase(); break;
      case 'source':          av = a.source.toLowerCase();          bv = b.source.toLowerCase();          break;
      case 'businessUnit':    av = a.businessUnit.toLowerCase();    bv = b.businessUnit.toLowerCase();    break;
      case 'recordOwner':     av = a.recordOwner.toLowerCase();     bv = b.recordOwner.toLowerCase();     break;
      default:                av = ''; bv = '';
    }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  }) : filteredCandidates;

  const handleStatClick = (statuses: string[]) => {
    const isActive =
      statuses.length > 0 &&
      statuses.length === filterStatuses.length &&
      statuses.every(s => filterStatuses.includes(s));
    setFilterStatuses(isActive ? [] : statuses);
  };

  const handleChipClick = (status: string) => {
    setFilterStatuses(prev =>
      prev.length === 1 && prev[0] === status ? [] : [status]
    );
  };

  const STAT_CARDS = [
    { id: 'all',        label: 'All Applications', statuses: [],                               color: '#6B7280', count: candidatesData.length },
    { id: 'pending',    label: 'Pending Review',   statuses: ['Applied', 'Under Review'],       color: '#3B82F6', count: candidatesData.filter(c => ['Applied', 'Under Review'].includes(c.appStatus)).length,          sub: 'Applied + Under Review' },
    { id: 'shortlisted',label: 'Shortlisted',      statuses: ['Shortlisted'],                  color: '#10B981', count: candidatesData.filter(c => c.appStatus === 'Shortlisted').length },
    { id: 'interview',  label: 'Interview',        statuses: ['Interview in Progress'],         color: '#F59E0B', count: candidatesData.filter(c => c.appStatus === 'Interview in Progress').length },
    { id: 'offer',      label: 'Offer Stage',      statuses: ['Offer Made', 'Offer Accepted'],  color: '#059669', count: candidatesData.filter(c => ['Offer Made', 'Offer Accepted'].includes(c.appStatus)).length,    sub: 'Offered + Accepted' },
    { id: 'onhold',     label: 'On Hold',          statuses: ['On Hold'],                       color: '#8B5CF6', count: candidatesData.filter(c => c.appStatus === 'On Hold').length },
  ];

  return (
    <CRMLayout breadcrumbs={[{ label: 'Job Applications' }]}>
      <div className="space-y-4 pt-2">

        {/* Active Stat Cards */}
        <div className="grid grid-cols-6 gap-4">
          {STAT_CARDS.map(card => {
            const isActive =
              card.statuses.length > 0 &&
              card.statuses.length === filterStatuses.length &&
              card.statuses.every(s => filterStatuses.includes(s));
            return (
              <button
                key={card.id}
                onClick={() => handleStatClick(card.statuses)}
                className={`bg-white rounded-xl px-5 py-4 flex flex-col border shadow-sm min-h-[100px] text-left transition-all hover:shadow-md ${isActive ? 'border-[#3538CD]/40 ring-2 ring-[#3538CD]/20' : 'border-[#E5E7EB]'}`}
              >
                <p className="text-xs font-medium text-[#6B7280]">{card.label}</p>
                <div className="mt-auto pt-3">
                  <span className="text-2xl font-semibold text-[#111827]">{card.count}</span>
                  {card.sub && (
                    <p className="text-[10px] italic text-[#9CA3AF] mt-0.5">{card.sub}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Closed & Terminal Collapsible */}
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl overflow-hidden">
          <button
            onClick={() => setTerminalOpen(v => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#F3F4F6] transition-colors"
          >
            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">
              Closed &amp; Terminal
            </span>
            <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform duration-300 ${terminalOpen ? 'rotate-180' : ''}`} />
          </button>
          <div className={`transition-all duration-300 overflow-hidden ${terminalOpen ? 'max-h-[120px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              {TERMINAL_CHIPS.map(chip => {
                const count = candidatesData.filter(c => c.appStatus === chip.status).length;
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
                    <span className="font-bold">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Applications Table Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#111827]">Applications</h2>
              <span className="px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280] text-[11px] font-medium rounded-full">
                {filterStatuses.length > 0
                  ? `${sortedCandidates.length} of ${candidatesData.length} Applications`
                  : `${candidatesData.length} Applications`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-[#E5E7EB] rounded-lg text-[#6B7280] hover:bg-[#F9FAFB]"><LayoutGrid className="w-4 h-4" /></button>
              <button className="p-2 border border-[#E5E7EB] rounded-lg text-[#6B7280] hover:bg-[#F9FAFB]"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 min-h-[44px] flex-wrap">
              <div className="flex items-center gap-1 px-2 py-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[12px]">
                <span className="text-[#9CA3AF]">∑</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-md text-[12px]">
                <Plus className="w-3.5 h-3.5 text-[#3538CD]" />
                <span className="text-[#374151] font-medium">Job Status</span>
                <span className="text-[#9CA3AF]">Is</span>
                <span className="text-[#374151]">Open</span>
                <X className="w-3 h-3 text-[#9CA3AF] cursor-pointer hover:text-red-500" />
              </div>
              {filterStatuses.length > 0 && (
                <div className="flex items-center gap-1 px-2.5 py-1 bg-[#EEF4FF] border border-[#3538CD]/30 rounded-md text-[12px]">
                  <span className="text-[#3538CD] font-semibold">App Status</span>
                  <span className="text-[#9CA3AF] mx-1">Is</span>
                  <span className="text-[#3538CD] font-semibold">{filterStatuses.join(', ')}</span>
                  <X className="w-3 h-3 text-[#3538CD] cursor-pointer ml-1 hover:text-red-500" onClick={() => setFilterStatuses([])} />
                </div>
              )}
              <div className="w-7 h-7 flex items-center justify-center text-[#3538CD] bg-[#F4F5FA] rounded-md cursor-pointer">
                <Plus className="w-4 h-4" />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <X className="w-4 h-4 text-[#9CA3AF] cursor-pointer" />
                <div className="w-[1px] h-4 bg-[#E5E7EB]" />
                <button className="text-[12px] font-semibold text-[#3538CD] px-3 py-1 hover:bg-[#F4F5FA] rounded-md">Filter</button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1800px]">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">No.</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">Candidate</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">Contact</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('job')}>
                    <div className="flex items-center gap-1">Applied Job <SortIcon sKey="job" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('experience')}>
                    <div className="flex items-center gap-1">Experience <SortIcon sKey="experience" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('noticePeriod')}>
                    <div className="flex items-center gap-1">Notice Period (Days) <SortIcon sKey="noticePeriod" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('interviewDate')}>
                    <div className="flex items-center gap-1">Interview Date and Time <SortIcon sKey="interviewDate" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('appStatus')}>
                    <div className="flex items-center gap-1">Application Status <SortIcon sKey="appStatus" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('candidateStatus')}>
                    <div className="flex items-center gap-1">Candidate Status <SortIcon sKey="candidateStatus" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('source')}>
                    <div className="flex items-center gap-1">Source <SortIcon sKey="source" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('businessUnit')}>
                    <div className="flex items-center gap-1">Business Unit <SortIcon sKey="businessUnit" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('recordOwner')}>
                    <div className="flex items-center gap-1">Record Owner <SortIcon sKey="recordOwner" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">Created By</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">Modified By</th>
                  <th className="sticky right-0 z-20 px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap bg-[#F9FAFB] border-l border-[#E5E7EB] shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {sortedCandidates.map(c => {
                  const appS = APP_STATUS_STYLE[c.appStatus] ?? { border: 'rgb(209,213,219)', text: 'rgb(107,114,128)', bg: 'rgb(249,250,251)', dot: 'rgb(156,163,175)' };
                  const candS = CANDIDATE_STATUS_STYLE[c.candidateStatus] ?? 'bg-[#F9FAFB] text-[#344054] border-[#D0D5DD]';
                  return (
                    <tr key={c.no} className="hover:bg-[#F9FAFB] transition-colors group">

                      {/* No. */}
                      <td className="px-4 py-4 text-sm text-[#6B7280]">{c.no}</td>

                      {/* Candidate */}
                      <td className="px-4 py-4 min-w-[160px]">
                        <Link to={`/crm/candidates/${c.no}`} className="text-sm font-semibold text-[#3538CD] hover:underline whitespace-nowrap">
                          {c.name}
                        </Link>
                        {c.isAlumni && (
                          <span className="block mt-0.5 text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full uppercase tracking-widest w-fit">Alumni</span>
                        )}
                      </td>

                      {/* Contact — email top, phone below */}
                      <td className="px-4 py-4 min-w-[180px]">
                        <p className="text-sm text-[#374151]">{c.email}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{c.phone}</p>
                      </td>

                      {/* Applied Job */}
                      <td className="px-4 py-1.5 text-xs text-gray-600 text-left">
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <div className="flex flex-col text-xs text-indigo-700" style={{ maxWidth: '200px' }}>
                            <div className="truncate w-fit" style={{ maxWidth: '200px' }}>
                              {c.job.replace(/\s*\([^)]*\)$/, '')}
                            </div>
                          </div>
                        </a>
                        <div className="font-medium text-xs text-green-700">
                          ({c.job.match(/\(([^)]+)\)$/)?.[1] ?? 'Open'})
                        </div>
                      </td>

                      {/* Experience */}
                      <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">{c.experience}</td>

                      {/* Notice Period */}
                      <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">
                        {c.noticePeriod === '0' ? 'Immediate' : `${c.noticePeriod} days`}
                      </td>

                      {/* Interview Date and Time */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {c.interviewDate
                          ? <span className="text-sm text-[#374151]">{formatInterviewDate(c.interviewDate)}</span>
                          : <button className="px-3 py-1.5 bg-[#F4F5FA] text-[#3538CD] text-[12px] font-bold rounded-md hover:bg-[#3538CD]/10 transition-colors">Schedule</button>
                        }
                      </td>

                      {/* Application Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                          style={{ borderColor: appS.border, color: appS.text, backgroundColor: appS.bg }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: appS.dot }} />
                          {c.appStatus}
                        </span>
                      </td>

                      {/* Candidate Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${candS}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                          {c.candidateStatus}
                        </span>
                      </td>

                      {/* Source */}
                      <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">{c.source}</td>

                      {/* Business Unit */}
                      <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">{c.businessUnit}</td>

                      {/* Record Owner */}
                      <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">{c.recordOwner}</td>

                      {/* Created By */}
                      <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">{c.createdBy}</td>

                      {/* Modified By */}
                      <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">{c.modifiedBy}</td>

                      {/* Actions */}
                      <td className="sticky right-0 z-10 px-4 py-4 bg-white border-l border-[#E5E7EB] shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)] group-hover:bg-[#F9FAFB]">
                        <div className="flex items-center justify-center gap-2">
                          <Link to={`/crm/candidates/${c.no}`} className="p-1.5 text-[#6B7280] hover:text-[#3538CD] hover:bg-white rounded-md shadow-sm border border-transparent hover:border-[#E5E7EB]">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]/50">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6B7280]">Records Per Page</span>
                <div className="flex items-center gap-1 px-2 py-1 bg-white border border-[#E5E7EB] rounded-md text-xs cursor-pointer">
                  10 <ChevronDown className="w-3 h-3 text-[#9CA3AF]" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-[12px]">
                <button className="px-2 py-1 text-[#9CA3AF] disabled:opacity-50" disabled>Previous</button>
                <button className="w-7 h-7 flex items-center justify-center bg-[#3538CD] text-white rounded font-bold">1</button>
                <button className="w-7 h-7 flex items-center justify-center text-[#374151] hover:bg-[#F3F4F6] rounded">2</button>
                <button className="w-7 h-7 flex items-center justify-center text-[#374151] hover:bg-[#F3F4F6] rounded">3</button>
                <span className="text-[#9CA3AF] px-1">...</span>
                <button className="w-7 h-7 flex items-center justify-center text-[#374151] hover:bg-[#F3F4F6] rounded">72</button>
                <button className="px-2 py-1 text-[#3538CD] font-semibold">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
