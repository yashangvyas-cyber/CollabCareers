import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import {
  ChevronDown, Plus, X, MoreHorizontal,
  Eye, LayoutGrid, ArrowUpDown, ArrowUp, ArrowDown, UserPlus, Search, ChevronUp,
} from 'lucide-react';
import { useApp } from '../store/AppContext';

// ── Terminal chip colour definitions ──────────────────────────────────────────
const TERMINAL_CHIPS = [
  { status: 'Selected',       border: 'rgb(171,239,198)', text: 'rgb(23,178,106)', bg: 'rgb(236,253,243)', dot: 'rgb(23,178,106)'  },
  { status: 'Rejected',       border: 'rgb(254,205,202)', text: 'rgb(180,35,24)',   bg: 'rgb(254,243,242)', dot: 'rgb(240,68,56)'   },
  { status: 'Withdrawn',      border: 'rgb(220,215,210)', text: 'rgb(113,104,95)',  bg: 'rgb(250,249,247)', dot: 'rgb(168,160,149)' },
  { status: 'Joined',         border: 'rgb(213,217,235)', text: 'rgb(54,63,114)',   bg: 'rgb(248,249,252)', dot: 'rgb(78,91,166)'   },
  { status: 'Offer Declined', border: 'rgb(246,208,254)', text: 'rgb(159,26,177)',  bg: 'rgb(253,244,255)', dot: 'rgb(212,68,241)'  },
  { status: 'Not Joined',     border: 'rgb(255,193,205)', text: 'rgb(255,0,81)',    bg: 'rgb(255,241,243)', dot: 'rgb(255,0,81)'    },
  { status: 'Archived',       border: 'rgb(203,213,225)', text: 'rgb(71,85,105)',   bg: 'rgb(248,250,252)', dot: 'rgb(100,116,139)' },
  { status: 'Offer Revoked',  border: 'rgb(255,221,211)', text: 'rgb(255,87,34)',   bg: 'rgb(255,247,244)', dot: 'rgb(255,137,100)' },
  { status: 'No Show',        border: 'rgb(253,186,116)', text: 'rgb(120,53,15)',   bg: 'rgb(255,247,237)', dot: 'rgb(217,119,6)'   },
];

const APP_STATUS_DISPLAY: Record<string, string> = {
  'Interview in Progress': 'Interview',
};
const displayAppStatus = (s: string) => APP_STATUS_DISPLAY[s] ?? s;

const APP_STATUS_STYLE: Record<string, { border: string; text: string; bg: string; dot: string }> = {
  'Applied':               { border: 'rgb(191,219,254)', text: 'rgb(29,78,216)',  bg: 'rgb(239,246,255)', dot: 'rgb(59,130,246)'  },
  'Under Review':          { border: 'rgb(184,194,240)', text: 'rgb(59,79,160)',  bg: 'rgb(238,240,255)', dot: 'rgb(99,115,210)'  },
  'Shortlisted':           { border: 'rgb(221,214,254)', text: 'rgb(109,40,217)', bg: 'rgb(245,243,255)', dot: 'rgb(109,40,217)'  },
  'Interview in Progress': { border: 'rgb(253,230,138)', text: 'rgb(146,64,14)',  bg: 'rgb(255,251,235)', dot: 'rgb(245,158,11)'  },
  'Offered':               { border: 'rgb(125,211,252)', text: 'rgb(11,165,236)', bg: 'rgb(240,249,255)', dot: 'rgb(11,165,236)'  },
  'Offer Made':            { border: 'rgb(125,211,252)', text: 'rgb(11,165,236)', bg: 'rgb(240,249,255)', dot: 'rgb(11,165,236)'  },
  'Offer Accepted':        { border: 'rgb(166,243,207)', text: 'rgb(102,198,28)', bg: 'rgb(237,252,242)', dot: 'rgb(102,198,28)'  },
  'On Hold':               { border: 'rgb(254,215,170)', text: 'rgb(181,71,8)',   bg: 'rgb(255,250,235)', dot: 'rgb(181,71,8)'    },
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
  // ── Progressive statuses (one per sub-status in order) ──────────────────────
  { no: 1,  candidateId: '3',   name: 'Arjun Mehta',       email: 'arjun@gmail.com',               phone: '+91 96543 21098', job: 'Flutter Developer (Open)',         experience: '2 yrs',  noticePeriod: '0',   interviewDate: null,                  appStatus: 'Applied',                candidateStatus: 'Active',      source: 'LinkedIn',         businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 2,  candidateId: '1',   name: 'Mahesh Patel',      email: 'mahesh@gmail.com',              phone: '+91 98765 43210', job: 'React Developer (Open)',           experience: '3 yrs',  noticePeriod: '30',  interviewDate: null,                  appStatus: 'Under Review',           candidateStatus: 'Active',      source: 'CollabCRM',        businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: true  },
  { no: 3,  candidateId: '9',   name: 'Amit Kumar',        email: 'amit@gmail.com',                phone: '+91 90987 65432', job: 'React Developer (Open)',           experience: '5 yrs',  noticePeriod: '0',   interviewDate: '2026-04-30T13:10:00', appStatus: 'Shortlisted',            candidateStatus: 'Active',      source: 'Naukri',           businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 4,  candidateId: '2',   name: 'Priya Shah',        email: 'priya@gmail.com',               phone: '+91 97654 32109', job: 'UI/UX Designer (Open)',            experience: '4 yrs',  noticePeriod: '15',  interviewDate: '2026-04-18T00:00:00', appStatus: 'Interview in Progress',  candidateStatus: 'Active',      source: 'CollabCRM',        businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Michael Park',  isAlumni: true  },
  { no: 5,  candidateId: '5',   name: 'Rahul Joshi',       email: 'rahul@gmail.com',               phone: '+91 94321 09876', job: 'Project Manager (Open)',           experience: '6 yrs',  noticePeriod: '60',  interviewDate: '2026-04-18T00:00:00', appStatus: 'Selected',               candidateStatus: 'Active',      source: 'CollabCRM',        businessUnit: '300Mind',       recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 6,  candidateId: '4',   name: 'Sneha Patel',       email: 'sneha@gmail.com',               phone: '+91 95432 10987', job: 'Business Analyst (Open)',          experience: '3 yrs',  noticePeriod: '30',  interviewDate: '2026-03-20T11:00:00', appStatus: 'Offered',                candidateStatus: 'Active',      source: 'Naukri',           businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 7,  candidateId: '6',   name: 'Kavya Rao',         email: 'kavya@gmail.com',               phone: '+91 93210 98765', job: '2D Artist (Open)',                 experience: '1 yr',   noticePeriod: '0',   interviewDate: '2026-04-20T00:00:00', appStatus: 'Offer Accepted',         candidateStatus: 'Active',      source: 'Referral',         businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Michael Park',  isAlumni: false },
  { no: 8,  candidateId: 'c4',  name: 'Ananya Sharma',     email: 'ananya.s@example.com',          phone: '+91 65432 10987', job: 'UX Designer (Open)',               experience: '5 yrs',  noticePeriod: '0',   interviewDate: '2025-12-10T10:30:00', appStatus: 'Joined',                 candidateStatus: 'Joined',      source: 'Direct Approach',  businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: true  },
  // ── Hold ────────────────────────────────────────────────────────────────────
  { no: 9,  candidateId: 'c6',  name: 'Neha Kulkarni',     email: 'neha.kulkarni@gmail.com',       phone: '+91 94321 56789', job: 'Business Analyst (Open)',          experience: '3 yrs',  noticePeriod: '45',  interviewDate: null,                  appStatus: 'On Hold',                candidateStatus: 'Active',      source: 'CollabCRM',        businessUnit: '300Mind',       recordOwner: 'Lisa Ray',      createdBy: 'Lisa Ray',      modifiedBy: 'Lisa Ray',      isAlumni: false },
  // ── Exit at Interview ────────────────────────────────────────────────────────
  { no: 10, candidateId: 'ps1', name: 'Sanjay Kumar',      email: 'sanjay.kumar@example.com',      phone: '+91 99100 11111', job: 'Node.js Backend Engineer (Open)', experience: '4 yrs',  noticePeriod: '30',  interviewDate: '2026-04-10T00:00:00', appStatus: 'Rejected',               candidateStatus: 'Active',      source: 'Naukri',           businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 11, candidateId: 'ps6', name: 'Priyanka Rao',      email: 'priyanka.rao@example.com',      phone: '+91 99100 66666', job: 'QA Engineer (Open)',               experience: '3 yrs',  noticePeriod: '30',  interviewDate: '2026-03-05T10:00:00', appStatus: 'No Show',                candidateStatus: 'Active',      source: 'Naukri',           businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Michael Park',  isAlumni: false },
  { no: 12, candidateId: 'ps7', name: 'Deepak Singh',      email: 'deepak.singh@example.com',      phone: '+91 99100 77777', job: 'Data Analyst (Open)',              experience: '4 yrs',  noticePeriod: '45',  interviewDate: null,                  appStatus: 'Cancelled',              candidateStatus: 'Active',      source: 'LinkedIn',         businessUnit: '300Mind',       recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: false },
  // ── Exit at Offered ──────────────────────────────────────────────────────────
  { no: 13, candidateId: 'ps3', name: 'Kiran Shah',        email: 'kiran.shah@example.com',        phone: '+91 99100 33333', job: 'QA Engineer (Open)',               experience: '5 yrs',  noticePeriod: '60',  interviewDate: '2026-03-15T11:00:00', appStatus: 'Offer Declined',         candidateStatus: 'Active',      source: 'Referral',         businessUnit: '300Mind',       recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 14, candidateId: 'ps4', name: 'Pooja Nair',        email: 'pooja.nair@example.com',        phone: '+91 99100 44444', job: 'React Developer (Open)',           experience: '3 yrs',  noticePeriod: '30',  interviewDate: '2026-02-20T14:00:00', appStatus: 'Offer Revoked',          candidateStatus: 'Active',      source: 'Naukri',           businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Michael Park',  isAlumni: false },
  // ── Connector badges ─────────────────────────────────────────────────────────
  { no: 15, candidateId: 'ps5', name: 'Arun Verma',        email: 'arun.verma@example.com',        phone: '+91 99100 55555', job: 'DevOps Engineer (Open)',           experience: '6 yrs',  noticePeriod: '0',   interviewDate: '2026-01-10T09:00:00', appStatus: 'Not Joined',             candidateStatus: 'Active',      source: 'Referral',         businessUnit: '300Mind',       recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 16, candidateId: 'ps2', name: 'Divya Patel',       email: 'divya.patel@example.com',       phone: '+91 99100 22222', job: 'UI/UX Designer (Open)',            experience: '4 yrs',  noticePeriod: '45',  interviewDate: null,                  appStatus: 'Withdrawn',              candidateStatus: 'Active',      source: 'LinkedIn',         businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Michael Park',  isAlumni: false },
  { no: 17, candidateId: 'ps8', name: 'Rekha Sharma',      email: 'rekha.sharma@example.com',      phone: '+91 98765 00001', job: 'React Developer (Open)',           experience: '2 yrs',  noticePeriod: '30',  interviewDate: null,                  appStatus: 'Archived',               candidateStatus: 'Active',      source: 'Naukri',           businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: false },
  // ── Candidature overrides ────────────────────────────────────────────────────
  { no: 18, candidateId: 'c5',  name: 'Vikram Nair',       email: 'vikram.nair@example.com',       phone: '+91 99887 76655', job: 'Senior Backend Engineer (Open)',   experience: '9 yrs',  noticePeriod: '90',  interviewDate: '2026-02-14T15:30:00', appStatus: 'Interview in Progress',  candidateStatus: 'Blacklisted', source: 'Naukri',           businessUnit: 'MindInventory', recordOwner: 'James Wilson',  createdBy: 'James Wilson',  modifiedBy: 'James Wilson',  isAlumni: false },
  { no: 19, candidateId: 'c3',  name: 'Karan Mehta',       email: 'karan.mehta@example.com',       phone: '+91 76543 21098', job: 'Product Manager (Open)',           experience: '7 yrs',  noticePeriod: '60',  interviewDate: null,                  appStatus: 'Under Review',           candidateStatus: 'Discarded',   source: 'Referral',         businessUnit: '300Mind',       recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Michael Park',  isAlumni: false },
  // ── Remaining bulk rows ───────────────────────────────────────────────────────
  { no: 20, candidateId: 'c7',  name: 'Arjun Verma',       email: 'arjun.verma@outlook.com',       phone: '+91 91234 87650', job: 'Full Stack Developer (Open)',      experience: '5 yrs',  noticePeriod: '30',  interviewDate: null,                  appStatus: 'Future',                 candidateStatus: 'Active',      source: 'CollabCRM',        businessUnit: 'MindInventory', recordOwner: 'David Kim',     createdBy: 'David Kim',     modifiedBy: 'David Kim',     isAlumni: true  },
  { no: 21, candidateId: '7',   name: 'Nikhil Sharma',     email: 'nikhil@gmail.com',              phone: '+91 92109 87654', job: 'Node.js Engineer (Open)',          experience: '4 yrs',  noticePeriod: '30',  interviewDate: null,                  appStatus: 'Under Review',           candidateStatus: 'Active',      source: 'LinkedIn',         businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: true  },
  { no: 22, candidateId: '8',   name: 'Deepa Verma',       email: 'deepa@gmail.com',               phone: '+91 91098 76543', job: 'QA Engineer (Open)',               experience: '2 yrs',  noticePeriod: '15',  interviewDate: null,                  appStatus: 'Under Review',           candidateStatus: 'Active',      source: 'CollabCRM',        businessUnit: '300Mind',       recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 23, candidateId: '10',  name: 'Pooja Iyer',        email: 'pooja@gmail.com',               phone: '+91 89876 54321', job: 'UI/UX Designer (Open)',            experience: '3 yrs',  noticePeriod: '30',  interviewDate: '2026-03-16T12:55:00', appStatus: 'Shortlisted',            candidateStatus: 'Active',      source: 'CollabCRM',        businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Michael Park',  isAlumni: true  },
  { no: 24, candidateId: '11',  name: 'Rohit Nair',        email: 'rohit@gmail.com',               phone: '+91 88765 43210', job: 'Flutter Developer (Open)',         experience: '3 yrs',  noticePeriod: '15',  interviewDate: '2026-03-05T09:53:00', appStatus: 'Shortlisted',            candidateStatus: 'Active',      source: 'LinkedIn',         businessUnit: '300Mind',       recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 25, candidateId: '12',  name: 'Sonal Gupta',       email: 'sonal@gmail.com',               phone: '+91 87654 32109', job: 'Business Analyst (Open)',          experience: '4 yrs',  noticePeriod: '60',  interviewDate: '2025-11-12T04:14:00', appStatus: 'Shortlisted',            candidateStatus: 'Active',      source: 'Referral',         businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 26, candidateId: '13',  name: 'Vishal Singh',      email: 'vishal@gmail.com',              phone: '+91 86543 21098', job: 'Project Manager (Open)',           experience: '7 yrs',  noticePeriod: '30',  interviewDate: '2025-11-25T14:30:00', appStatus: 'Interview in Progress',  candidateStatus: 'Active',      source: 'CollabCRM',        businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: true  },
  { no: 27, candidateId: '14',  name: 'Meera Pillai',      email: 'meera@gmail.com',               phone: '+91 85432 10987', job: 'Node.js Engineer (Open)',          experience: '3 yrs',  noticePeriod: '0',   interviewDate: '2026-01-08T10:00:00', appStatus: 'Interview in Progress',  candidateStatus: 'Active',      source: 'LinkedIn',         businessUnit: '300Mind',       recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Michael Park',  isAlumni: false },
  { no: 28, candidateId: '15',  name: 'Karan Desai',       email: 'karan@gmail.com',               phone: '+91 84321 09876', job: 'QA Engineer (Open)',               experience: '2 yrs',  noticePeriod: '15',  interviewDate: '2026-02-14T15:30:00', appStatus: 'Interview in Progress',  candidateStatus: 'Active',      source: 'Naukri',           businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 29, candidateId: '16',  name: 'Ananya Tiwari',     email: 'ananya@gmail.com',              phone: '+91 83210 98765', job: 'React Developer (Open)',           experience: '4 yrs',  noticePeriod: '30',  interviewDate: '2026-03-20T11:00:00', appStatus: 'Offered',                candidateStatus: 'Active',      source: 'CollabCRM',        businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Sarah Chen',    isAlumni: false },
  { no: 30, candidateId: '17',  name: 'Suresh Reddy',      email: 'suresh@gmail.com',              phone: '+91 82109 87654', job: 'UI/UX Designer (Open)',            experience: '5 yrs',  noticePeriod: '60',  interviewDate: '2026-02-28T14:00:00', appStatus: 'Offered',                candidateStatus: 'Active',      source: 'Referral',         businessUnit: '300Mind',       recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: true  },
  { no: 31, candidateId: '18',  name: 'Ritu Malhotra',     email: 'ritu@gmail.com',                phone: '+91 81098 76543', job: 'Flutter Developer (Open)',         experience: '3 yrs',  noticePeriod: '15',  interviewDate: '2026-01-22T09:30:00', appStatus: 'Offer Accepted',         candidateStatus: 'Active',      source: 'LinkedIn',         businessUnit: 'MindInventory', recordOwner: 'Michael Park',  createdBy: 'Michael Park',  modifiedBy: 'Michael Park',  isAlumni: false },
  { no: 32, candidateId: '19',  name: 'Ajay Pandey',       email: 'ajay@gmail.com',                phone: '+91 80987 65432', job: 'Project Manager (Open)',           experience: '8 yrs',  noticePeriod: '0',   interviewDate: '2026-04-05T16:45:00', appStatus: 'Offer Accepted',         candidateStatus: 'Active',      source: 'CollabCRM',        businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',    createdBy: 'Sarah Chen',    modifiedBy: 'Sarah Chen',    isAlumni: true  },
];

const formatInterviewDate = (iso: string) => {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const mon = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  const time = d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${day}/${mon}/${year}, ${time}`;
};

type SortKey = 'job' | 'experience' | 'noticePeriod' | 'interviewDate' | 'appStatus' | 'candidateStatus' | 'source' | 'businessUnit' | 'recordOwner' | 'createdBy' | 'modifiedBy';
type SortDir = 'asc' | 'desc';

const RECORD_OWNERS = ['Sarah Chen', 'Michael Park', 'James Wilson', 'Lisa Ray', 'David Kim'];

export default function JobApplicationsPage() {
  const { jobs, candidates, applications, submitApplication } = useApp();

  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // ── Add Application RSP ──
  const [showAddApp, setShowAddApp] = useState(false);
  const [addForm, setAddForm] = useState({ bu: '', jobId: '', candidateId: '', recordOwner: '' });
  const [candSearch, setCandSearch] = useState('');
  const [candOpen, setCandOpen] = useState(false);
  const [dupError, setDupError] = useState(false);
  const candRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (candRef.current && !candRef.current.contains(e.target as Node)) setCandOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const buList = Array.from(new Set(jobs.map(j => j.businessUnit).filter(Boolean))).sort() as string[];
  const filteredJobs = addForm.bu ? jobs.filter(j => j.businessUnit === addForm.bu && j.status === 'Open') : [];
  const talentPool = candidates.filter(c => c.profileVisibility === 'visible');
  const filteredCands = talentPool.filter(c => {
    const q = candSearch.toLowerCase();
    return `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });
  const selectedCand = talentPool.find(c => c.id === addForm.candidateId);

  const buAbbr = (bu: string): string => {
    const MAP: Record<string, string> = { 'MindInventory': 'MI', '300Mind': '3M', 'CollabCRM': 'CC' };
    if (MAP[bu]) return MAP[bu];
    const parts = bu.split(/(?=[A-Z])|(?<=\d)(?=[A-Za-z])|\s+/).filter(Boolean);
    return parts.map(p => p[0].toUpperCase()).join('').slice(0, 3);
  };

  const jobLabel = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return '';
    const abbr = buAbbr(job.businessUnit ?? '');
    const num = parseInt(job.id.replace(/\D/g, '')) || 0;
    return `${abbr}-${String(num).padStart(3, '0')} | ${job.title}`;
  };

  const closeRSP = () => {
    setShowAddApp(false);
    setAddForm({ bu: '', jobId: '', candidateId: '', recordOwner: '' });
    setCandSearch('');
    setCandOpen(false);
    setDupError(false);
  };

  const handleAddApp = () => {
    if (!addForm.bu || !addForm.jobId || !addForm.candidateId || !addForm.recordOwner) return;
    const dup = applications.find(a => a.candidateId === addForm.candidateId && a.jobId === addForm.jobId);
    if (dup) { setDupError(true); return; }
    submitApplication({
      id: `app_${Date.now()}`,
      candidateId: addForm.candidateId,
      jobId: addForm.jobId,
      status: 'Under Review',
      appliedAt: new Date().toISOString(),
      answers: { _addedByRecruiter: true, recordOwner: addForm.recordOwner },
      resumeUrl: selectedCand?.resumeUrl || '',
    });
    closeRSP();
  };

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
      case 'createdBy':       av = a.createdBy.toLowerCase();       bv = b.createdBy.toLowerCase();       break;
      case 'modifiedBy':      av = a.modifiedBy.toLowerCase();      bv = b.modifiedBy.toLowerCase();      break;
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
            <span className="text-sm font-semibold text-[#374151]">Click to View Closed &amp; Terminal Stages</span>
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
              <button
                onClick={() => setShowAddApp(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#3538CD] text-white text-sm font-semibold rounded-lg hover:bg-[#2D30B0] transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Add Application
              </button>
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
                  {/* left-aligned: No, Candidate, Contact, Applied Job */}
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap text-left">No.</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap text-left">Candidate</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap text-left">Contact</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap text-left cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('job')}>
                    <div className="flex items-center gap-1">Applied Job <SortIcon sKey="job" /></div>
                  </th>
                  {/* centered: all remaining data columns */}
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap text-center cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('experience')}>
                    <div className="flex items-center justify-center gap-1">Experience <SortIcon sKey="experience" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap text-center cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('noticePeriod')}>
                    <div className="flex items-center justify-center gap-1">Notice Period (Days) <SortIcon sKey="noticePeriod" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap text-center cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('interviewDate')}>
                    <div className="flex items-center justify-center gap-1">Interview <SortIcon sKey="interviewDate" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap text-center cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('appStatus')}>
                    <div className="flex items-center justify-center gap-1">Application Status <SortIcon sKey="appStatus" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap text-center cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('candidateStatus')}>
                    <div className="flex items-center justify-center gap-1">Candidate Status <SortIcon sKey="candidateStatus" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap text-center cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('source')}>
                    <div className="flex items-center justify-center gap-1">Source <SortIcon sKey="source" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap text-center cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('businessUnit')}>
                    <div className="flex items-center justify-center gap-1">Business Unit <SortIcon sKey="businessUnit" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap text-center cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('recordOwner')}>
                    <div className="flex items-center justify-center gap-1">Record Owner <SortIcon sKey="recordOwner" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap text-center cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('createdBy')}>
                    <div className="flex items-center justify-center gap-1">Created By <SortIcon sKey="createdBy" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap text-center cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('modifiedBy')}>
                    <div className="flex items-center justify-center gap-1">Modified By <SortIcon sKey="modifiedBy" /></div>
                  </th>
                  <th className="sticky right-0 z-20 px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap text-center bg-[#F9FAFB] border-l border-[#E5E7EB] shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {sortedCandidates.map(c => {
                  const appS = APP_STATUS_STYLE[c.appStatus] ?? { border: 'rgb(209,213,219)', text: 'rgb(107,114,128)', bg: 'rgb(249,250,251)', dot: 'rgb(156,163,175)' };
                  const candS = CANDIDATE_STATUS_STYLE[c.candidateStatus] ?? 'bg-[#F9FAFB] text-[#344054] border-[#D0D5DD]';
                  return (
                    <tr key={c.no} className="hover:bg-[#F9FAFB] transition-colors group">

                      {/* No. */}
                      <td className="px-4 py-4 text-sm text-[#6B7280] text-left">{c.no}</td>

                      {/* Candidate */}
                      <td className="px-4 py-4 min-w-[160px]">
                        <Link to={`/crm/candidates/${c.candidateId}`} className="text-sm font-semibold text-[#3538CD] hover:underline whitespace-nowrap">
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
                      <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap text-center">{c.experience}</td>

                      {/* Notice Period */}
                      <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap text-center">
                        {c.noticePeriod === '0' ? 'Immediate' : `${c.noticePeriod} days`}
                      </td>

                      {/* Interview Date and Time */}
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        {c.interviewDate
                          ? <span className="text-sm text-[#374151]">{formatInterviewDate(c.interviewDate)}</span>
                          : <button className="px-3 py-1.5 bg-[#F4F5FA] text-[#3538CD] text-[12px] font-bold rounded-md hover:bg-[#3538CD]/10 transition-colors">Schedule</button>
                        }
                      </td>

                      {/* Application Status */}
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                          style={{ borderColor: appS.border, color: appS.text, backgroundColor: appS.bg }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: appS.dot }} />
                          {displayAppStatus(c.appStatus)}
                        </span>
                      </td>

                      {/* Candidate Status */}
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${candS}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                          {c.candidateStatus}
                        </span>
                      </td>

                      {/* Source */}
                      <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap text-center">{c.source}</td>

                      {/* Business Unit */}
                      <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap text-center">{c.businessUnit}</td>

                      {/* Record Owner */}
                      <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap text-center">{c.recordOwner}</td>

                      {/* Created By */}
                      <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap text-center">{c.createdBy}</td>

                      {/* Modified By */}
                      <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap text-center">{c.modifiedBy}</td>

                      {/* Actions */}
                      <td className="sticky right-0 z-10 px-4 py-4 bg-white border-l border-[#E5E7EB] shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)] group-hover:bg-[#F9FAFB]">
                        <div className="flex items-center justify-center gap-2">
                          <Link to={`/crm/candidates/${c.candidateId}`} className="p-1.5 text-[#6B7280] hover:text-[#3538CD] hover:bg-white rounded-md shadow-sm border border-transparent hover:border-[#E5E7EB]">
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

      {/* ── Add Application RSP ── */}
      {showAddApp && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[200]" onClick={closeRSP} />
          <div className="fixed right-0 top-0 h-full w-[480px] bg-white z-[201] shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
              <div>
                <h2 className="text-base font-black text-[#1A1A2E]">Add Application</h2>
                <p className="text-xs text-[#6B7280] mt-0.5">Manually add a candidate to a job opening</p>
              </div>
              <button onClick={closeRSP} className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#374151] hover:bg-[#F3F4F6]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

              {/* BU */}
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Business Unit <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={addForm.bu}
                    onChange={e => setAddForm(f => ({ ...f, bu: e.target.value, jobId: '' }))}
                    className="w-full appearance-none border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm text-[#111827] bg-white focus:outline-none focus:border-[#3538CD] focus:ring-1 focus:ring-[#3538CD]/20"
                  >
                    <option value="">Select Business Unit</option>
                    {buList.map(bu => <option key={bu} value={bu}>{bu}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={addForm.jobId}
                    onChange={e => setAddForm(f => ({ ...f, jobId: e.target.value }))}
                    disabled={!addForm.bu}
                    className="w-full appearance-none border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm text-[#111827] bg-white focus:outline-none focus:border-[#3538CD] focus:ring-1 focus:ring-[#3538CD]/20 disabled:bg-[#F9FAFB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed"
                  >
                    <option value="">{addForm.bu ? 'Select Job' : 'Select BU first'}</option>
                    {filteredJobs.map(j => (
                      <option key={j.id} value={j.id}>{jobLabel(j.id)}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Candidate */}
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Candidate <span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={candRef}>
                  <button
                    type="button"
                    onClick={() => { setCandOpen(o => !o); setCandSearch(''); }}
                    className="w-full flex items-center justify-between border border-[#D1D5DB] rounded-lg px-3 py-2.5 bg-white hover:border-[#3538CD] transition-colors text-left"
                  >
                    {selectedCand ? (
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">{selectedCand.firstName} {selectedCand.lastName}</p>
                        <p className="text-xs text-[#6B7280]">({selectedCand.email})</p>
                      </div>
                    ) : (
                      <span className="text-sm text-[#9CA3AF]">Select Candidate from Talent Pool</span>
                    )}
                    {candOpen ? <ChevronUp className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />}
                  </button>

                  {candOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-xl overflow-hidden">
                      <div className="p-2 border-b border-[#F3F4F6]">
                        <div className="flex items-center gap-2 px-2 py-1.5 bg-[#F9FAFB] rounded-lg">
                          <Search className="w-3.5 h-3.5 text-[#9CA3AF]" />
                          <input
                            autoFocus
                            type="text"
                            placeholder="Search by name or email..."
                            value={candSearch}
                            onChange={e => setCandSearch(e.target.value)}
                            className="flex-1 text-xs bg-transparent outline-none text-[#374151] placeholder-[#9CA3AF]"
                          />
                        </div>
                      </div>
                      <div className="max-h-52 overflow-y-auto">
                        {filteredCands.length === 0 ? (
                          <p className="text-xs text-[#9CA3AF] text-center py-6">No candidates found</p>
                        ) : filteredCands.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => { setAddForm(f => ({ ...f, candidateId: c.id })); setCandOpen(false); setDupError(false); }}
                            className={`w-full text-left px-4 py-3 hover:bg-[#F4F5FA] transition-colors border-b border-[#F9FAFB] last:border-0 ${addForm.candidateId === c.id ? 'bg-[#EEF4FF]' : ''}`}
                          >
                            <p className="text-sm font-semibold text-[#111827]">{c.firstName} {c.lastName}</p>
                            <p className="text-xs text-[#6B7280]">({c.email})</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Record Owner */}
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Record Owner <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={addForm.recordOwner}
                    onChange={e => setAddForm(f => ({ ...f, recordOwner: e.target.value }))}
                    className="w-full appearance-none border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm text-[#111827] bg-white focus:outline-none focus:border-[#3538CD] focus:ring-1 focus:ring-[#3538CD]/20"
                  >
                    <option value="">Select Record Owner</option>
                    {RECORD_OWNERS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Duplicate error */}
              {dupError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-xs font-semibold text-red-700">This candidate already has an application for the selected job.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3 bg-[#F9FAFB]">
              <button onClick={closeRSP} className="px-4 py-2 text-sm font-semibold text-[#374151] border border-[#D1D5DB] rounded-lg hover:bg-white transition-colors">
                Cancel
              </button>
              <button
                onClick={handleAddApp}
                disabled={!addForm.bu || !addForm.jobId || !addForm.candidateId || !addForm.recordOwner}
                className="px-5 py-2 text-sm font-semibold text-white bg-[#3538CD] rounded-lg hover:bg-[#2D30B0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Add Application
              </button>
            </div>
          </div>
        </>
      )}
    </CRMLayout>
  );
}
