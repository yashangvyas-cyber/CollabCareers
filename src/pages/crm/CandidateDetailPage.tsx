import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import CRMLayout from '../../components/CRMLayout';
import { Mail, Phone, Copy, Eye, MoreVertical, ExternalLink, UserCheck, EyeOff, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, UserPlus, RefreshCw, Ban, X, Pencil, MessageSquarePlus, Info } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import ScheduleInterviewDrawer from '../../components/ScheduleInterviewDrawer';

function DetailField({ label, value, isLink }: { label: string; value?: string | null; isLink?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">{label}</p>
      {isLink && value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#3538CD] hover:underline flex items-center gap-1.5">
          {value} <ExternalLink className="w-3.5 h-3.5" />
        </a>
      ) : (
        <p className="text-sm font-bold text-[#1A1A2E]">{value || '–'}</p>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-6 py-4 bg-[#F9FAFB] border-b border-[#E5E7EB] flex flex-col gap-0.5">
      <h3 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wider">{title}</h3>
      {subtitle && <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">{subtitle}</p>}
    </div>
  );
}

type Note = { id: string; author: string; text: string; createdAt: string; tag?: string };

const mockNotesMap: Record<string, Note[]> = {
  '1': [
    { id: 'cn1', author: 'System',     text: 'Application received via Naukri. Resume screened by ATS — 78% match score.', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'cn2', author: 'Sarah Chen', text: 'Reviewed resume — solid full-stack background. Scheduling a quick phone screen for tomorrow.', createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  ],
  '2': [
    { id: 'cn3', author: 'System',     text: 'Application received via LinkedIn. Candidate profile verified.', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'cn4', author: 'Sarah Chen', text: 'First interview done. Strong communication, good React knowledge. Moving to technical round.', createdAt: new Date(Date.now() - 86400000 * 1 - 3600000 * 2).toISOString() },
    { id: 'cn5', author: 'Sarah Chen', text: 'Technical round scheduled for Friday. Panel: Rahul + Ananya.', createdAt: new Date(Date.now() - 3600000 * 4).toISOString() },
  ],
  '3': [
    { id: 'cn6', author: 'System', text: 'Application received via CollabCareers portal.', createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  ],
};

const APP_STATUS_STYLE: Record<string, { border: string; text: string; bg: string; dot: string }> = {
  'Applied':               { border: 'rgb(191,219,254)', text: 'rgb(29,78,216)',   bg: 'rgb(239,246,255)', dot: 'rgb(59,130,246)'  },
  'Under Review':          { border: 'rgb(184,194,240)', text: 'rgb(59,79,160)',   bg: 'rgb(238,240,255)', dot: 'rgb(99,115,210)'  },
  'Shortlisted':           { border: 'rgb(221,214,254)', text: 'rgb(109,40,217)',  bg: 'rgb(245,243,255)', dot: 'rgb(109,40,217)'  },
  'Interview in Progress': { border: 'rgb(253,230,138)', text: 'rgb(146,64,14)',   bg: 'rgb(255,251,235)', dot: 'rgb(245,158,11)'  },
  'Offered':               { border: 'rgb(125,211,252)', text: 'rgb(11,165,236)',  bg: 'rgb(240,249,255)', dot: 'rgb(11,165,236)'  },
  'Offer Accepted':        { border: 'rgb(166,243,207)', text: 'rgb(102,198,28)',  bg: 'rgb(237,252,242)', dot: 'rgb(102,198,28)'  },
  'On Hold':               { border: 'rgb(254,215,170)', text: 'rgb(181,71,8)',    bg: 'rgb(255,250,235)', dot: 'rgb(181,71,8)'    },
  'Selected':              { border: 'rgb(171,239,198)', text: 'rgb(23,178,106)',  bg: 'rgb(236,253,243)', dot: 'rgb(23,178,106)'  },
  'Rejected':              { border: 'rgb(254,205,202)', text: 'rgb(180,35,24)',   bg: 'rgb(254,243,242)', dot: 'rgb(240,68,56)'   },
  'Withdrawn':             { border: 'rgb(220,215,210)', text: 'rgb(113,104,95)',  bg: 'rgb(250,249,247)', dot: 'rgb(168,160,149)' },
  'Joined':                { border: 'rgb(213,217,235)', text: 'rgb(54,63,114)',   bg: 'rgb(248,249,252)', dot: 'rgb(78,91,166)'   },
  'Offer Declined':        { border: 'rgb(246,208,254)', text: 'rgb(159,26,177)',  bg: 'rgb(253,244,255)', dot: 'rgb(212,68,241)'  },
  'Not Joined':            { border: 'rgb(255,193,205)', text: 'rgb(255,0,81)',    bg: 'rgb(255,241,243)', dot: 'rgb(255,0,81)'    },
  'Archived':              { border: 'rgb(203,213,225)', text: 'rgb(71,85,105)',   bg: 'rgb(248,250,252)', dot: 'rgb(100,116,139)' },
  'Offer Revoked':         { border: 'rgb(255,221,211)', text: 'rgb(255,87,34)',   bg: 'rgb(255,247,244)', dot: 'rgb(255,137,100)' },
  'No Show':               { border: 'rgb(253,186,116)', text: 'rgb(120,53,15)',   bg: 'rgb(255,247,237)', dot: 'rgb(217,119,6)'   },
  'Active':                { border: 'rgb(191,219,254)', text: 'rgb(29,78,216)',   bg: 'rgb(239,246,255)', dot: 'rgb(59,130,246)'  },
  'Cancelled':             { border: 'rgb(247,166,222)', text: 'rgb(238,70,188)',  bg: 'rgb(253,242,250)', dot: 'rgb(238,70,188)'  },
  'Future':                { border: 'rgb(199,210,254)', text: 'rgb(67,56,202)',   bg: 'rgb(238,242,255)', dot: 'rgb(99,102,241)'  },
  'Blacklisted':           { border: 'rgb(196,201,224)', text: 'rgb(78,91,166)',   bg: 'rgb(249,250,251)', dot: 'rgb(78,91,166)'   },
  'Discarded':             { border: 'rgb(207,214,224)', text: 'rgb(102,112,133)', bg: 'rgb(249,250,251)', dot: 'rgb(102,112,133)' },
};

const CANDIDATE_STATUS_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  'Active':      { bg: 'rgb(238,242,255)', text: 'rgb(53,56,205)',   border: 'rgb(199,210,254)' },
  'Blacklisted': { bg: 'rgb(249,250,251)', text: 'rgb(78,91,166)',   border: 'rgb(196,201,224)' },
  'Discarded':   { bg: 'rgb(249,250,251)', text: 'rgb(102,112,133)', border: 'rgb(207,214,224)' },
  'Joined':      { bg: 'rgb(240,253,244)', text: 'rgb(21,128,61)',   border: 'rgb(187,247,208)' },
};

type MockRound = {
  id: string; no: number; name: string; mode: 'Offline' | 'Online'; datetime: string;
  status: 'Completed' | 'Scheduled' | 'Pending' | 'Cancelled'; panelSuggestion: 'Next Round' | 'No Show/Cancel' | 'Not Sure' | 'Should Hire' | 'Should Reject' | 'Pending';
  panel: string[]; scheduledBy: string; scheduledAt: string; duration: string;
  additionalInfo: string; feedbackScore: number; feedbackBy: string;
  /** Staging shows "(Provided by X on <datetime>)" in the feedback accordion header. */
  feedbackAt?: string; overallRemarks?: string;
};
type MockInterviewDetails = { offerStatus: string; department: string; joiningOn: string; remarks: string; rounds: MockRound[]; };

const mockInterviewMap: Record<string, MockInterviewDetails> = {
  '1': {
    offerStatus: 'Offer Accepted', department: 'Engineering', joiningOn: '01/Jan/2027', remarks: '-',
    rounds: [
      { id: 'r1-1', no: 1, name: 'Aptitude Test', mode: 'Offline', datetime: '28/Nov/2025, 08:06 PM', status: 'Completed', panelSuggestion: 'Should Hire', panel: ['Super User'], scheduledBy: 'Super User', scheduledAt: '28/Nov/2025, 11:36 PM', duration: '60 Minutes', additionalInfo: '-', feedbackScore: 9, feedbackBy: 'Super User' },
      { id: 'r1-2', no: 2, name: 'Technical Round', mode: 'Online', datetime: '01/Dec/2025, 11:00 AM', status: 'Completed', panelSuggestion: 'Should Hire', panel: ['Super User', 'Rajan Mehta'], scheduledBy: 'Super User', scheduledAt: '30/Nov/2025, 09:00 AM', duration: '90 Minutes', additionalInfo: 'React and TypeScript deep dive.', feedbackScore: 8, feedbackBy: 'Rajan Mehta' },
    ],
  },
  '2': {
    offerStatus: 'Interview in Progress', department: 'Design', joiningOn: '-', remarks: '-',
    rounds: [
      { id: 'r2-1', no: 1, name: 'Portfolio Review', mode: 'Online', datetime: '22/Apr/2026, 03:00 PM', status: 'Completed', panelSuggestion: 'Should Hire', panel: ['Super User'], scheduledBy: 'Super User', scheduledAt: '21/Apr/2026, 05:00 PM', duration: '45 Minutes', additionalInfo: '-', feedbackScore: 8, feedbackBy: 'Super User' },
    ],
  },
  '3': {
    offerStatus: 'Shortlisted', department: 'Mobile', joiningOn: '-', remarks: '-',
    rounds: [
      { id: 'r3-online', no: 1, name: 'Technical Round', mode: 'Online', datetime: '25/Jul/2026, 10:00 AM', status: 'Scheduled', panelSuggestion: 'Should Hire', panel: ['Super User'], scheduledBy: 'Super User', scheduledAt: '22/Jul/2026, 06:00 PM', duration: '60 Minutes', additionalInfo: 'Google Meet link: https://meet.google.com/abc-defg-hij', feedbackScore: 0, feedbackBy: 'Super User' },
      { id: 'r3-offline', no: 2, name: 'Onsite Culture Fit', mode: 'Offline', datetime: '28/Jul/2026, 02:30 PM', status: 'Scheduled', panelSuggestion: 'Should Hire', panel: ['Super User'], scheduledBy: 'Super User', scheduledAt: '22/Jul/2026, 06:00 PM', duration: '45 Minutes', additionalInfo: 'In-person at MindInventory office.', feedbackScore: 0, feedbackBy: 'Super User' },
    ],
  },
  // ── Copied from staging: Jason Doe — pending HR Round, no offer yet ──
  'jason': {
    offerStatus: '', department: '', joiningOn: '-', remarks: '-',
    rounds: [
      { id: 'jd-1', no: 1, name: 'HR Round', mode: 'Offline', datetime: '21/Jul/2026, 09:11 PM', status: 'Pending', panelSuggestion: 'Pending', panel: ['Gurpreetsingh Dhillon'], scheduledBy: 'Gurpreetsingh Dhillon', scheduledAt: '21/Jul/2026, 05:11 PM', duration: '60 Minutes', additionalInfo: 'This is additional information', feedbackScore: 0, feedbackBy: '' },
    ],
  },
  // ── Copied from staging: Arjun Patel — completed HR Round, feedback 9, Offered ──
  'arjunp': {
    offerStatus: 'Offered', department: 'Business', joiningOn: '-', remarks: '-',
    rounds: [
      { id: 'ap-1', no: 1, name: 'HR Round', mode: 'Offline', datetime: '30/Jun/2026, 10:10 AM', status: 'Completed', panelSuggestion: 'Should Hire', panel: ['Gurpreetsingh Dhillon'], scheduledBy: 'Gurpreetsingh Dhillon', scheduledAt: '01/Jul/2026, 11:15 AM', duration: '60 Minutes', additionalInfo: '-', feedbackScore: 9, feedbackBy: 'Gurpreetsingh Dhillon', feedbackAt: '20-Jul-2026, 03:25 PM', overallRemarks: 'Candidate Selected.' },
    ],
  },
};

// Untitled-UI palette hexes copied from the staging interview-rounds DOM
// (success-50/200/300, warning-50/200/700, error-50/200/700, gray tokens)
const ROUND_STATUS_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  'Completed': { bg: '#ECFDF3', border: '#ABEFC6', text: '#067647' },
  'Scheduled': { bg: '#EEF4FF', border: '#C7D2FE', text: '#3538CD' },
  'Pending':   { bg: '#FFFAEB', border: '#FEDF89', text: '#B54708' },
  'Cancelled': { bg: '#FEF3F2', border: '#FECDCA', text: '#B42318' },
};
const SUGGESTION_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  'Should Hire':    { bg: '#ECFDF3', border: '#ABEFC6', text: '#079455' },
  'Next Round':     { bg: '#EEF4FF', border: '#C7D2FE', text: '#3538CD' },
  'Not Sure':       { bg: '#FFFAEB', border: '#FEDF89', text: '#B54708' },
  'Pending':        { bg: '#FFFAEB', border: '#FEDF89', text: '#B54708' },
  'No Show/Cancel': { bg: '#F9FAFB', border: '#D0D5DD', text: '#667085' },
  'Should Reject':  { bg: '#FEF3F2', border: '#FECDCA', text: '#B42318' },
};

/** Staging's react-stars readout: score number + 10 stars (#F4B400 filled / #EAECF0 empty). */
function StarRow({ value }: { value: number }) {
  return (
    <div className="flex items-center">
      <span className="text-center mt-0.5 text-xs font-normal text-[#101828]">{value}</span>
      <div className="flex leading-none mx-1">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="text-xl" style={{ color: i < value ? '#F4B400' : '#EAECF0' }}>★</span>
        ))}
      </div>
    </div>
  );
}
const EXT_STATUS_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  'Invited':                { bg: '#EEF4FF', border: '#C7D2FE', text: '#3538CD' },
  'Availability Confirmed': { bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
  'Availability Declined':  { bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412' },
  'Feedback Submitted':     { bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' },
  'Cancelled':              { bg: '#F9FAFB', border: '#D1D5DB', text: '#6B7280' },
};

function SortIcon({ active, dir }: { active: boolean; dir: 'asc' | 'desc' | null }) {
  if (!active || !dir) return <ArrowUpDown className="w-3 h-3 text-[#9CA3AF]" />;
  return dir === 'asc' ? <ArrowUp className="w-3 h-3 text-[#3538CD]" /> : <ArrowDown className="w-3 h-3 text-[#3538CD]" />;
}

const PIPELINE_STAGES = ['Applied', 'Interview', 'Selected', 'Offered', 'Joined'] as const;

type PipelineStateInfo = {
  stageIndex: number;
  type: 'active' | 'hold' | 'exit' | 'complete';
  label: string;
};

const STATUS_PIPELINE_MAP: Record<string, PipelineStateInfo> = {
  'Applied':               { stageIndex: 0, type: 'active',   label: 'Applied' },
  'Under Review':          { stageIndex: 0, type: 'active',   label: 'Under Review' },
  'Active':                { stageIndex: 0, type: 'active',   label: 'Active' },
  'Shortlisted':           { stageIndex: 0, type: 'active',   label: 'Shortlisted' },
  'Interview in Progress': { stageIndex: 1, type: 'active',   label: 'Interview' },
  'Selected':              { stageIndex: 2, type: 'active',   label: 'Selected' },
  'Offered':               { stageIndex: 3, type: 'active',   label: 'Offered' },
  'Offer Made':            { stageIndex: 3, type: 'active',   label: 'Offered' },
  'Offer Accepted':        { stageIndex: 3, type: 'active',   label: 'Offer Accepted' },
  'Joined':                { stageIndex: 4, type: 'complete', label: 'Joined' },
  'On Hold':               { stageIndex: 1, type: 'hold',     label: 'On Hold' },
  'Future':                { stageIndex: 2, type: 'hold',     label: 'Future Consideration' },
  'No Show':               { stageIndex: 1, type: 'exit',     label: 'No Show' },
  'Cancelled':             { stageIndex: 1, type: 'exit',     label: 'Cancelled' },
  'Rejected':              { stageIndex: 1, type: 'exit',     label: 'Rejected' },
  'Withdrawn':             { stageIndex: 1, type: 'active',   label: 'Withdrawn' },
  'Offer Declined':        { stageIndex: 3, type: 'exit',     label: 'Offer Declined' },
  'Offer Revoked':         { stageIndex: 3, type: 'exit',     label: 'Offer Revoked' },
  'Not Joined':            { stageIndex: 3, type: 'active',   label: 'Not Joined' },
  'Archived':              { stageIndex: 0, type: 'active',   label: 'Archived' },
};

export default function CandidateDetailPage() {
  const { candidateId } = useParams();
  const { candidates, applications, jobs, externalInvites, cancelExternalInvite, resendExternalInvite } = useApp();

  const candidate = candidates.find(c => c.id === candidateId);

  const firstName = candidate?.firstName ?? 'Unknown';
  const lastName = candidate?.lastName ?? 'Candidate';
  const email = candidate?.email ?? '-';
  const phone = candidate?.phone ?? '-';
  const isAlumni = candidate?.isAlumni ?? false;
  const alumniEmail = candidate?.alumniEmail ?? 'verified@yopmails.com';
  const experiences = candidate?.experiences ?? [];
  const currentExp = experiences.find((e: any) => e.isCurrent) ?? experiences[0];
  const displayOrg = candidate?.currentOrg ?? currentExp?.company;
  const displayDesignation = candidate?.currentDesignation ?? currentExp?.designation;
  const noticePeriod = candidate?.noticePeriod;
  const skills = candidate?.skills ?? [];
  const allowRecruiterContact = candidate?.allowRecruiterContact;

  const totalExp = candidate?.isFresher
    ? 'Fresher'
    : (candidate?.totalExperienceYears != null
      ? `${candidate.totalExperienceYears} Yr${candidate.totalExperienceYears !== 1 ? 's' : ''}${candidate.totalExperienceMonths ? `, ${candidate.totalExperienceMonths} Mo` : ''}`
      : undefined);
  const currentCtcDisplay = candidate?.isFresher ? 'Fresher' : candidate?.currentCtc;

  const candidateApplications = applications.filter(a => a.candidateId === candidateId);
  const latestApp = candidateApplications[0];
  const appliedJob = latestApp ? jobs.find(j => j.id === latestApp.jobId) : null;
  const totalApplicationCount = candidateApplications.length;

  const candidateStatus: string = candidate?.candidateStatus ?? 'Active';

  const tabs = ['Applicant Details', 'Interview Details', 'Applied Jobs', 'Notes'];
  const [activeTab, setActiveTab] = useState('Applicant Details');
  const [appliedSortDir, setAppliedSortDir] = useState<'asc' | 'desc' | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState<boolean[]>([]);
  const [extFbOpen, setExtFbOpen] = useState<Record<string, boolean>>({});
  const [roundMenuOpen, setRoundMenuOpen] = useState<number | null>(null);
  const [kebabOpen, setKebabOpen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [archiveRemark, setArchiveRemark] = useState('');
  const [savedArchiveRemark, setSavedArchiveRemark] = useState(() => latestApp?.archiveRemark ?? '');
  const [notes, setNotes] = useState<Note[]>(() => mockNotesMap[candidateId ?? ''] ?? []);
  const [noteInput, setNoteInput] = useState('');

  // ── Schedule Interview Drawer state ──
  const [scheduleDrawerOpen, setScheduleDrawerOpen] = useState(false);
  const [schedToast, setSchedToast] = useState('');

  const handleScheduled = (msg: string) => {
    setScheduleDrawerOpen(false);
    setSchedToast(msg);
    setTimeout(() => setSchedToast(''), 4000);
  };

  // External invites for this candidate
  const candidateExtInvites = (externalInvites ?? []).filter(inv => inv.candidateId === candidateId);

  // Interview Details uses mock data keyed by candidateId
  const interviewData: MockInterviewDetails | null = candidateId ? (mockInterviewMap[candidateId] ?? null) : null;
  const avgScore = interviewData?.rounds.length
    ? Math.round(interviewData.rounds.reduce((s, r) => s + r.feedbackScore, 0) / interviewData.rounds.length)
    : 0;
  const offerStyle = interviewData ? (APP_STATUS_STYLE[interviewData.offerStatus] ?? APP_STATUS_STYLE['Applied']) : null;

  // ── Early-return AFTER all hooks (Rules of Hooks) ──
  if (candidateApplications.length === 0 && candidateId) {
    return <Navigate to={`/crm/talent-pool/${candidateId}`} replace />;
  }

  const toggleAppliedSort = () => setAppliedSortDir(d => d === 'asc' ? 'desc' : 'asc');

  // Not Joined / Withdrawn / Archived: connector badge on the line, dots fill to last reached stage
  const appStatus = latestApp?.status;
  const isConnectorBadge = appStatus === 'Not Joined' || appStatus === 'Withdrawn' || appStatus === 'Archived';
  const isCandidatureOverride = candidateStatus === 'Blacklisted' || candidateStatus === 'Discarded';
  const overrideBadgeLabel = isConnectorBadge ? (appStatus as string) : candidateStatus;

  // Pipeline state — for connector badge statuses, exitedAfterStage overrides the default stageIndex
  const pipelineState: PipelineStateInfo = (() => {
    if (latestApp) {
      const mapped = STATUS_PIPELINE_MAP[latestApp.status] ?? { stageIndex: 0, type: 'active' as const, label: latestApp.status };
      if (isConnectorBadge && latestApp.exitedAfterStage != null) {
        return { ...mapped, stageIndex: latestApp.exitedAfterStage };
      }
      return mapped;
    }
    return { stageIndex: 0, type: 'active' as const, label: 'Applied' };
  })();

  const showConnectorBadge = isConnectorBadge || isCandidatureOverride;
  const overrideAfterStage = showConnectorBadge ? pipelineState.stageIndex : -1;

  const pipelineDotColor = (idx: number) => {
    if (idx > pipelineState.stageIndex) return 'bg-white border-[#D1D5DB] text-transparent';
    if (idx === pipelineState.stageIndex) {
      if (pipelineState.type === 'exit') return 'bg-red-500 border-red-500 text-white';
      if (pipelineState.type === 'hold') return 'bg-amber-400 border-amber-400 text-white';
      return 'bg-[#3538CD] border-[#3538CD] text-white';
    }
    return 'bg-[#3538CD] border-[#3538CD] text-white';
  };

  const pipelineSegColor = (idx: number) => {
    if (idx >= pipelineState.stageIndex) return 'bg-[#E5E7EB]';
    return 'bg-[#3538CD]';
  };


  const sortedApps = [...candidateApplications].sort((a, b) => {
    if (!appliedSortDir) return 0;
    const da = a.appliedAt ? new Date(a.appliedAt).getTime() : 0;
    const db = b.appliedAt ? new Date(b.appliedAt).getTime() : 0;
    return appliedSortDir === 'asc' ? da - db : db - da;
  });

  return (
    <CRMLayout
      breadcrumbs={[
        { label: 'Job Applications', path: '/crm/candidates' },
        { label: `${firstName} ${lastName}` },
      ]}
    >
      <div className="flex gap-8 items-start">
        {/* LEFT SIDEBAR */}
        <div className="w-[300px] shrink-0 sticky top-[80px]">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#3538CD] to-[#565EE9]" />
            <div className="p-6 flex flex-col items-center">
              <h2 className="text-xl font-black text-[#1A1A2E] text-center tracking-tight">{firstName} {lastName}</h2>
              {appliedJob && (
                <p title="Applied For" className="text-sm font-bold text-[#3538CD] mt-1 text-center cursor-default">{appliedJob.title}</p>
              )}

              <div className="flex flex-col items-center gap-2 mt-4">
                {(() => {
                  const cs = CANDIDATE_STATUS_STYLE[candidateStatus] ?? CANDIDATE_STATUS_STYLE['Active'];
                  return (
                    <span className="px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border"
                      style={{ backgroundColor: cs.bg, color: cs.text, borderColor: cs.border }}>
                      {candidateStatus}
                    </span>
                  );
                })()}

                {isAlumni && (
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="px-4 py-1.5 text-[10px] font-black bg-[#3538CD] text-white rounded-full uppercase tracking-widest">
                      Alumni
                    </span>
                    <p className="text-[10px] font-bold text-[#6B7280] text-center leading-relaxed">
                      Previously worked here · Verified via{' '}
                      <Link to={`/crm/employees/${candidateId}`} className="text-[#3538CD] hover:underline">{alumniEmail}</Link>
                    </p>
                  </div>
                )}

                {allowRecruiterContact != null && (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border ${
                    allowRecruiterContact
                      ? 'bg-green-50 text-green-600 border-green-200'
                      : 'bg-gray-50 text-gray-500 border-gray-200'
                  }`}>
                    {allowRecruiterContact
                      ? <><UserCheck className="w-3.5 h-3.5" /> Open to contact</>
                      : <><EyeOff className="w-3.5 h-3.5" /> Prefers to apply first</>
                    }
                  </div>
                )}
              </div>

              <div className="w-full border-t border-[#E5E7EB] my-6" />

              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#E5E7EB] rounded-2xl text-xs font-black text-[#374151] hover:bg-[#F9FAFB] transition-all uppercase tracking-widest">
                <Eye className="w-4 h-4" /> View Resume
              </button>

              <div className="w-full space-y-4 mt-6">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center text-[#6B7280] group-hover:text-[#3538CD] transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Email</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#374151] truncate">{email}</span>
                      <Copy className="w-3.5 h-3.5 text-[#6B7280] hover:text-[#3538CD] shrink-0" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center text-[#6B7280] group-hover:text-[#3538CD] transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Phone</p>
                    <span className="text-sm font-bold text-[#374151]">{phone}</span>
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-[#E5E7EB] my-6" />

              <div className="w-full space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Created by</p>
                  <p className="text-[10px] font-bold text-[#6B7280]">
                    {candidate?.createdBy ?? 'Super User'} · {candidate?.addedAt ? new Date(candidate.addedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '16/Mar/2026, 12:18 PM'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Modified by</p>
                  <p className="text-[10px] font-bold text-[#6B7280]">
                    {candidate?.modifiedBy ?? 'Super User'} · 16/Mar/2026, 05:11 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0">

          <div className="flex items-center justify-between mb-6 bg-white p-2 rounded-2xl border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center">
              {tabs.map((tab) => {
                const isActive = tab === activeTab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1.5 text-xs font-semibold transition-all rounded-md flex items-center gap-1.5 whitespace-nowrap ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    {tab}
                    {tab === 'Applied Jobs' && (
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-[#E5E7EB] text-[#6B7280]'}`}>
                        {totalApplicationCount}
                      </span>
                    )}
                    {tab === 'Notes' && notes.length > 0 && (
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-[#E5E7EB] text-[#6B7280]'}`}>
                        {notes.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3 pr-2">
              <button onClick={() => setScheduleDrawerOpen(true)} className="bg-[#3538CD] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#2d30b0] transition-all shadow-lg shadow-[#3538CD]/20">
                Schedule Interview
              </button>
              <div className="relative">
                <button
                  className="p-3 rounded-xl border-2 border-[#E5E7EB] hover:bg-[#F9FAFB] transition-all"
                  onClick={() => setKebabOpen(o => !o)}
                >
                  <MoreVertical className="w-5 h-5 text-[#6B7280]" />
                </button>
                {kebabOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setKebabOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-[#E5E7EB] shadow-lg z-20 overflow-hidden">
                      <button
                        className="w-full text-left px-4 py-3 text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB] transition-colors"
                        onClick={() => setKebabOpen(false)}
                      >
                        Shortlist Application
                      </button>
                      <button
                        className="w-full text-left px-4 py-3 text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB] transition-colors border-t border-[#F3F4F6]"
                        onClick={() => { setKebabOpen(false); setArchiveModalOpen(true); setArchiveRemark(''); }}
                      >
                        Archive Application
                      </button>
                    </div>
                  </>
                )}
              </div>
              {archiveModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                  <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6">
                    <h3 className="text-sm font-black text-[#111827] uppercase tracking-wider mb-1">Archive Application</h3>
                    <p className="text-xs text-[#6B7280] mb-4">Add an optional remark before archiving.</p>
                    <textarea
                      className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] resize-none focus:outline-none focus:ring-2 focus:ring-[#3538CD]/30 focus:border-[#3538CD]"
                      rows={3}
                      placeholder="Remark (optional)"
                      value={archiveRemark}
                      onChange={e => setArchiveRemark(e.target.value)}
                    />
                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        className="px-4 py-2 text-xs font-bold text-[#6B7280] hover:text-[#111827] transition-colors"
                        onClick={() => setArchiveModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-5 py-2 bg-[#3538CD] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-[#2d30b0] transition-colors"
                        onClick={() => {
                          setSavedArchiveRemark(archiveRemark.trim());
                          setArchiveModalOpen(false);
                        }}
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === 'Applicant Details' && (
              <>
                {/* Pipeline Bar */}
                <div className="bg-[#F0F5FF] rounded-2xl border border-[#C7D2FE] shadow-sm p-5">
                  <div className="flex items-start">
                    {PIPELINE_STAGES.map((stage, idx) => {
                      const isCurrent = idx === pipelineState.stageIndex;
                      const dotEls: React.ReactNode[] = [];
                      dotEls.push(
                        <div key={stage} className="flex flex-col items-center shrink-0 w-20">
                          <span className={`text-[9px] font-bold uppercase tracking-widest mb-2 ${isCurrent ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}>{stage}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-black ${pipelineDotColor(idx)}`}>
                            {idx === pipelineState.stageIndex && pipelineState.type === 'exit' ? '✕' : idx <= pipelineState.stageIndex ? '✓' : ''}
                          </div>
                          {isCurrent && pipelineState.type !== 'complete' && (() => {
                            let chipLabel: string | null = null;
                            if (appStatus === 'Not Joined') chipLabel = 'Offer Accepted';
                            else if (!isConnectorBadge && pipelineState.label !== stage) chipLabel = pipelineState.label;
                            if (!chipLabel) return null;
                            const s = APP_STATUS_STYLE[chipLabel] ?? { bg: 'rgb(249,250,251)', text: 'rgb(107,114,128)', border: 'rgb(209,213,219)' };
                            return (
                              <span
                                className="mt-2 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-full border whitespace-nowrap"
                                style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}
                              >
                                {chipLabel}
                              </span>
                            );
                          })()}
                        </div>
                      );
                      if (idx < PIPELINE_STAGES.length - 1) {
                        const showOverrideBadge = showConnectorBadge && idx === overrideAfterStage;
                        const ovStyle = showOverrideBadge ? (APP_STATUS_STYLE[overrideBadgeLabel] ?? { bg: 'rgb(249,250,251)', text: 'rgb(107,114,128)', border: 'rgb(209,213,219)' }) : null;
                        dotEls.push(
                          <div key={`seg-${idx}`} className={`flex-1 h-0.5 mt-[18px] relative ${pipelineSegColor(idx)}`}>
                            {showOverrideBadge && ovStyle && (
                              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                <span
                                  className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-full border whitespace-nowrap"
                                  style={{ backgroundColor: ovStyle.bg, color: ovStyle.text, borderColor: ovStyle.border }}
                                >
                                  {overrideBadgeLabel}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return dotEls;
                    })}
                  </div>
                </div>

                {/* Applied Job card */}
                {appliedJob && (
                  <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                    <SectionHeader title="Applied Job" />
                    <div className="p-6 grid grid-cols-4 gap-8">
                      <DetailField label="Job Title" value={appliedJob.title} />
                      <DetailField label="Business Unit" value={appliedJob.businessUnit} />
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Application Status</p>
                        {latestApp?.status ? (() => {
                          const s = APP_STATUS_STYLE[latestApp.status] ?? { border: 'rgb(229,231,235)', text: 'rgb(107,114,128)', bg: 'rgb(249,250,251)', dot: 'rgb(156,163,175)' };
                          return (
                            <div className="relative inline-flex group">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border cursor-default"
                                style={{ background: s.bg, color: s.text, borderColor: s.border }}>
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                                {latestApp.status}
                              </span>
                              {savedArchiveRemark && (
                                <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#1F2937] text-white text-[11px] rounded-lg px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                  <p className="font-semibold mb-0.5 text-[#9CA3AF] uppercase tracking-wider text-[9px]">Archive Remark</p>
                                  <p>"{savedArchiveRemark}"</p>
                                  <div className="absolute top-full left-4 border-4 border-transparent border-t-[#1F2937]" />
                                </div>
                              )}
                            </div>
                          );
                        })() : <p className="text-sm font-bold text-[#1A1A2E]">–</p>}
                      </div>
                      <DetailField label="Record Owner" value={candidate?.recordOwner} />
                    </div>
                  </div>
                )}

                {/* Personal Information */}
                <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                  <SectionHeader title="Personal Information" />
                  <div className="p-6 grid grid-cols-3 gap-8">
                    <DetailField label="Date of Birth" value={candidate?.dateOfBirth} />
                    <DetailField label="Gender" value={candidate?.gender} />
                    <DetailField label="Marital Status" value={candidate?.maritalStatus} />
                  </div>
                </div>

                {/* Professional Details */}
                <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                  <SectionHeader title="Professional Details" />
                  <div className="p-6 space-y-8">
                    <div className="grid grid-cols-3 gap-8">
                      <DetailField label="Current Organisation" value={displayOrg} />
                      <DetailField label="Current Designation" value={displayDesignation} />
                      <DetailField label="Notice Period" value={noticePeriod} />
                    </div>
                    <div className="grid grid-cols-3 gap-8">
                      <DetailField label="Total Experience" value={totalExp} />
                      <DetailField label="Highest Qualification" value={candidate?.highestQualification} />
                      <DetailField label="LinkedIn" value={candidate?.linkedin} isLink />
                    </div>
                    {skills.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {skills.map(skill => (
                            <span key={skill} className="px-3 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs font-bold text-[#1A1A2E]">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {experiences.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Career Journey</p>
                        {experiences.map((exp: any, i: number) => (
                          <div key={i} className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-sm font-black text-[#111827]">{exp.designation}</h4>
                                <p className="text-xs font-bold text-[#3538CD]">{exp.company}</p>
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] bg-white border border-[#E5E7EB] px-2.5 py-1 rounded-md">
                                {exp.from} - {exp.to}
                              </span>
                            </div>
                            {exp.description && <p className="text-xs font-medium text-[#4B5563] mt-3 leading-relaxed">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Salary Information */}
                <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                  <SectionHeader title="Salary Information" />
                  <div className="p-6 grid grid-cols-4 gap-8">
                    <DetailField label="CTC Type" value={candidate?.ctcType} />
                    <DetailField label="Currency" value={candidate?.ctcCurrency} />
                    <DetailField label="Current CTC" value={currentCtcDisplay} />
                    <DetailField label="Expected CTC" value={candidate?.expectedCtc} />
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                  <SectionHeader title="Address" />
                  <div className="p-6 space-y-8">
                    <DetailField label="Address" value={candidate?.address} />
                    <div className="grid grid-cols-4 gap-8">
                      <DetailField label="Country" value={candidate?.country} />
                      <DetailField label="State" value={candidate?.state} />
                      <DetailField label="Town/City" value={candidate?.city} />
                      <DetailField label="Zip/Postal Code" value={candidate?.zipCode} />
                    </div>
                  </div>
                </div>

                {/* Source Information */}
                <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                  <SectionHeader title="Source Information" />
                  <div className="p-6 grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Source</p>
                      {candidate?.source ? (
                        <span className="inline-flex px-3 py-1.5 bg-[#3538CD] text-white text-[11px] font-black rounded-lg uppercase tracking-wider">
                          {candidate.source}
                        </span>
                      ) : (
                        <p className="text-sm font-bold text-[#1A1A2E]">–</p>
                      )}
                    </div>
                    <DetailField label="Source Remark" value={candidate?.sourceRemark} />
                  </div>
                </div>

                {/* Application Form Responses */}
                {appliedJob && appliedJob.customFields?.length > 0 && (
                  <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                    <SectionHeader title="Application Form Responses" />
                    <div className="p-6 space-y-6">
                      {appliedJob.customFields.map((field, i) => {
                        const raw = latestApp?.answers?.[field.id];
                        let display: string | undefined;
                        if (raw === undefined || raw === null || raw === '') {
                          display = undefined;
                        } else if (typeof raw === 'boolean') {
                          display = raw ? 'Yes' : 'No';
                        } else if (field.type === 'Yes/No') {
                          display = raw === true || raw === 'true' || raw === 'Yes' ? 'Yes' : 'No';
                        } else if (field.type === 'File Upload') {
                          display = raw ? 'File uploaded' : undefined;
                        } else {
                          display = String(raw);
                        }
                        return (
                          <div key={field.id} className="flex gap-4">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F4F5FA] border border-[#3538CD]/10 text-[#3538CD] text-[10px] font-black flex items-center justify-center mt-0.5">
                              {i + 1}
                            </span>
                            <div className="flex-1 space-y-1.5">
                              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest flex items-center gap-2">
                                {field.label}
                                <span className="px-2 py-0.5 bg-[#F3F4F6] text-[#9CA3AF] text-[9px] font-bold rounded-full normal-case tracking-normal">{field.type}</span>
                                {field.required && <span className="text-red-400 text-[9px] font-bold tracking-normal normal-case">Required</span>}
                              </p>
                              <p className="text-sm font-bold text-[#1A1A2E]">{display || '–'}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'Applied Jobs' && (
              <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                        <th className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest">No</th>
                        <th className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest">
                          <button
                            onClick={toggleAppliedSort}
                            className="flex items-center gap-1.5 hover:text-[#3538CD] transition-colors uppercase tracking-widest"
                          >
                            Applied On
                            <SortIcon active={appliedSortDir !== null} dir={appliedSortDir} />
                          </button>
                        </th>
                        <th className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest">Job Title</th>
                        <th className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest">Application Status</th>
                        <th className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {sortedApps.length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-12 text-center text-[#6B7280] text-sm font-medium">No applications found.</td></tr>
                      ) : (
                        sortedApps.map((app, i) => {
                          const job = jobs.find(j => j.id === app.jobId);
                          const style = APP_STATUS_STYLE[app.status] ?? APP_STATUS_STYLE['Applied'];
                          const jobCode = `MI-${(i + 1).toString().padStart(3, '0')}`;
                          return (
                            <tr key={app.id} className="hover:bg-[#F9FAFB] transition-colors">
                              <td className="px-6 py-4 font-bold text-[#111827] text-xs">{i + 1}</td>
                              <td className="px-6 py-4 text-xs font-medium text-[#374151]">
                                {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-xs font-bold text-[#3538CD]">{jobCode}</span>
                                <span className="text-xs font-medium text-[#374151]"> | {job?.title || 'Unknown Job'}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                                  style={{ borderColor: style.border, color: style.text, backgroundColor: style.bg }}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: style.dot }} />
                                  {app.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <button className="p-1.5 text-[#6B7280] hover:text-[#3538CD] rounded-md hover:bg-[#F3F4F6] transition-colors">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'Notes' && (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#E5E7EB]">
                  <p className="text-base font-semibold text-[#111827]">Notes</p>
                  {notes.length > 0 && (
                    <span className="px-2 py-0.5 rounded-2xl border border-indigo-200 bg-indigo-50 text-indigo-700 text-[11px] font-medium">
                      {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
                    </span>
                  )}
                </div>

                {/* Input row */}
                <div className="px-5 py-3 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center gap-3">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={e => setNoteInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && noteInput.trim()) {
                        setNotes(prev => [...prev, { id: Date.now().toString(), author: 'Super User', text: noteInput.trim(), createdAt: new Date().toISOString() }]);
                        setNoteInput('');
                      }
                    }}
                    placeholder="Write a note here..."
                    className="flex-1 text-sm text-[#374151] bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 placeholder:text-[#9CA3AF]"
                  />
                  <button
                    disabled={!noteInput.trim()}
                    onClick={() => {
                      if (!noteInput.trim()) return;
                      setNotes(prev => [...prev, { id: Date.now().toString(), author: 'Super User', text: noteInput.trim(), createdAt: new Date().toISOString() }]);
                      setNoteInput('');
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </div>

                {/* Notes list */}
                {notes.length === 0 ? (
                  <div className="py-16 flex flex-col items-center gap-2 text-center">
                    <p className="text-sm font-semibold text-[#9CA3AF]">No notes yet</p>
                    <p className="text-xs text-[#C4C9D4]">Add the first note above.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#F3F4F6]">
                    {notes.map(note => {
                      const isSystem = note.author === 'System';
                      const initials = note.author.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                      const ts = new Date(note.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                      return (
                        <div key={note.id} className="flex items-start gap-3 px-5 py-4">
                          <div className="w-8 h-8 rounded-full text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5"
                            style={{ backgroundColor: isSystem ? '#9CA3AF' : '#4F46E5' }}>
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-sm font-semibold text-[#111827]">{note.author}</span>
                              <span className="text-[11px] text-[#9CA3AF]">({ts})</span>
                              {note.tag && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F5F3FF] text-[#6D28D9] border border-[#DDD6FE]">
                                  {note.tag}
                                </span>
                              )}
                            </div>
                            <p className="text-sm" style={{ color: isSystem ? '#6B7280' : '#111827' }}>{note.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Interview Details' && (
              <div className="space-y-4">
                {!interviewData ? (
                  <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm flex flex-col items-center justify-center py-20">
                    <p className="text-sm font-medium text-[#9CA3AF]">No interview details found for this candidate.</p>
                  </div>
                ) : (
                  <>
                    {/* Offer / Status card — hidden when no offer state yet (staging: Jason Doe) */}
                    {interviewData.offerStatus && (
                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl flex items-center justify-center border"
                            style={{ backgroundColor: offerStyle?.bg, borderColor: offerStyle?.border }}>
                            <UserCheck className="w-5 h-5" style={{ color: offerStyle?.text }} />
                          </div>
                          <div>
                            <p className="text-xs text-[#6B7280] font-medium">Offer Details</p>
                            <p className="text-base font-semibold" style={{ color: offerStyle?.text }}>{interviewData.offerStatus}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {isAlumni && (
                            <Link to={`/crm/employees/${candidateId}`}
                              className="text-xs font-semibold text-white bg-[#3538CD] hover:bg-[#292bb0] px-3.5 py-2 rounded-lg transition-colors">
                              View Employee
                            </Link>
                          )}
                          <button className="w-9 h-9 border border-[#E5E7EB] rounded-lg flex items-center justify-center hover:bg-[#F9FAFB] transition-colors">
                            <MoreVertical className="w-4 h-4 text-[#6B7280]" />
                          </button>
                        </div>
                      </div>
                      <div className="px-5 py-2.5 bg-[#F9FAFB] border-t border-b border-[#E5E7EB] flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-[#6B7280] font-medium">Department:</span>
                          <span className="text-xs font-semibold text-[#374151]">{interviewData.department}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-[#6B7280] font-medium">Joining On:</span>
                          <span className="text-xs font-semibold text-[#374151]">{interviewData.joiningOn}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Remarks</p>
                        <p className="text-xs text-[#6B7280] mt-1">{interviewData.remarks}</p>
                      </div>
                    </div>
                    )}

                    {/* Interview Rounds — structure copied from staging interview-rounds screen */}
                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm px-5 pb-5">
                      <div className="flex justify-between items-center">
                        <div className="text-base font-semibold text-[#101828] my-3 flex items-center">
                          <span>Interview Rounds</span>
                          <span className="border rounded-xl py-0 px-2 ml-2 bg-[#EEF4FF] border-[#6172F3] text-[#6172F3] text-xs flex items-center justify-center">
                            {String(interviewData.rounds.length).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <span className="text-xs text-[#475467] font-medium">Feedback Score:</span>
                          <div className="flex items-center gap-1">
                            <span className="text-[#101828] text-lg font-semibold mt-0.5">{avgScore}</span>
                            <div className="flex leading-none mx-1">
                              {Array.from({ length: 10 }, (_, i) => (
                                <span key={i} className="text-xl" style={{ color: i < avgScore ? '#F4B400' : '#EAECF0' }}>★</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5">
                        {interviewData.rounds.map((round, idx) => {
                          const isFbOpen = feedbackOpen[idx] ?? false;
                          const statusStyle = ROUND_STATUS_STYLE[round.status] ?? ROUND_STATUS_STYLE['Completed'];
                          const suggStyle = SUGGESTION_STYLE[round.panelSuggestion] ?? SUGGESTION_STYLE['Should Hire'];
                          const roundExtInvites = candidateExtInvites.filter(inv => inv.roundId === round.id);
                          return (
                            <div key={round.no} className="rounded-lg border border-[#D0D5DD] p-4">
                              {/* Round header — staging: tile · name+mode+datetime (60%) · status (20%) · suggestion (20%) · kebab */}
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex items-start gap-4 w-full">
                                  <div className={`border rounded-lg w-10 h-10 flex shrink-0 justify-center items-center font-medium text-sm text-[#101828] ${round.status === 'Completed' ? 'bg-[#ECFDF3] border-[#75E0A7]' : 'bg-[#F9FAFB] border-[#EAECF0]'}`}>
                                    {round.no}
                                  </div>
                                  <div className="flex flex-col w-[60%]">
                                    <div className="text-base font-semibold text-[#101828] flex flex-wrap items-center gap-2">
                                      {round.name}
                                      <div className="border flex w-max items-center border-[#EAECF0] bg-[#F9FAFB] text-[#344054] rounded-full font-medium capitalize min-w-max py-0.5 px-2 text-xs">
                                        <span>{round.mode.toLowerCase()}</span>
                                      </div>
                                    </div>
                                    <div className="font-medium text-[#344054] mt-1 text-xs">{round.datetime.replace(/\//g, '-')}</div>
                                  </div>
                                  <div className="flex flex-col w-[20%]">
                                    <div>
                                      <p className="text-xs text-[#667085] mb-2">Interview Status</p>
                                      <div className="flex w-max items-center rounded-2xl border font-medium capitalize py-0.5 px-2.5 text-xs"
                                        style={{ backgroundColor: statusStyle.bg, borderColor: statusStyle.border, color: statusStyle.text }}>
                                        <span>{round.status}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col w-[20%]">
                                    <div>
                                      <p className="text-xs text-[#667085] mb-2">Panel Suggestion</p>
                                      <div className="flex w-max items-center rounded-2xl border font-medium capitalize py-0.5 px-2.5 text-xs"
                                        style={{ backgroundColor: suggStyle.bg, borderColor: suggStyle.border, color: suggStyle.text }}>
                                        <span>{round.panelSuggestion}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* Round actions kebab — staging popover: Edit / Cancel / Add Feedback */}
                                <div className="relative">
                                  <button
                                    onClick={() => setRoundMenuOpen(roundMenuOpen === idx ? null : idx)}
                                    className={`cursor-pointer flex items-center justify-center w-9 h-9 duration-300 outline-none rounded-lg border ${roundMenuOpen === idx ? 'bg-[#EEF4FF] border-[#C7D2FE]' : 'border-[#D0D5DD] hover:bg-[#F9FAFB]'}`}>
                                    {roundMenuOpen === idx
                                      ? <X className="w-4 h-4 text-[#3538CD]" />
                                      : <MoreVertical className="w-4 h-4 text-[#344054]" />}
                                  </button>
                                  {roundMenuOpen === idx && (
                                    <div className="z-[51] drop-shadow-xl absolute bg-white shadow-md border border-[#EAECF0] top-full right-0 rounded-md mt-3 px-3 py-0 min-w-[300px]">
                                      <div className="my-1">
                                        {([
                                          { label: 'Edit', Icon: Pencil },
                                          { label: 'Cancel', Icon: X },
                                          { label: 'Add Feedback', Icon: MessageSquarePlus },
                                        ] as const).map(({ label, Icon }) => (
                                          <div key={label} className="mb-1">
                                            <div
                                              onClick={() => { setRoundMenuOpen(null); setSchedToast(`"${label}" is not wired in this prototype`); setTimeout(() => setSchedToast(''), 2500); }}
                                              className="py-2 -mx-2 group hover:bg-gray-50 cursor-pointer rounded-md px-2">
                                              <div className="flex items-center gap-2">
                                                <Icon className="w-4 h-4 text-[#667085] group-hover:text-[#344054]" />
                                                <p className="text-xs font-normal text-[#101828]">{label}</p>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Metadata grid — staging: gray panel, normal-case labels, 2/4 · 1/4 · 1/4 · full cells */}
                              {/* NOTE: staging has overflow-x-auto here; dropped so the external-chip hover card isn't clipped */}
                              <div className="border border-[#EAECF0] rounded-lg bg-[#F9FAFB] py-3 px-2 mt-3 mb-3 flex flex-wrap">
                                <div className="w-full sm:w-1/2 lg:w-2/4 px-2 mb-4">
                                  <p className="text-xs text-[#667085]">Interview Panel</p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {round.panel.map(name => (
                                      <span key={name} className="inline-flex items-center border border-[#D0D5DD] rounded-lg bg-white py-1 px-2 text-xs font-medium text-[#475467]">
                                        <span className="w-5 h-5 rounded-full bg-[#3538CD]/10 text-[#3538CD] text-[9px] font-black flex items-center justify-center shrink-0">
                                          {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </span>
                                        <span className="text-xs capitalize ml-1">{name}</span>
                                      </span>
                                    ))}
                                    {/* External panelists — same chip idiom; email/status/actions in the hover card */}
                                    {roundExtInvites.map(inv => {
                                      const sty = EXT_STATUS_STYLE[inv.status] ?? EXT_STATUS_STYLE['Invited'];
                                      const displayName = inv.name || `${inv.firstName ?? ''} ${inv.lastName ?? ''}`.trim() || inv.email;
                                      const cancelled = inv.status === 'Cancelled';
                                      return (
                                        <span key={inv.id} className={`relative group inline-flex items-center border rounded-lg py-1 px-2 text-xs font-medium gap-1.5 cursor-default ${cancelled ? 'border-dashed border-[#D1D5DB] bg-[#F9FAFB] text-[#9CA3AF]' : 'border-[#E5E7EB] bg-white text-[#374151]'}`}>
                                          <span className="w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: sty.bg, color: sty.text }}>
                                            {displayName.split(/[\s@]/).filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                          </span>
                                          <span className={cancelled ? 'line-through' : ''}>{displayName}</span>
                                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: sty.text }} />
                                          {/* Hover card */}
                                          <span className="absolute top-full left-0 z-20 pt-1.5 hidden group-hover:block">
                                            <span className="block w-60 bg-white border border-[#E5E7EB] rounded-xl shadow-xl p-3 text-left">
                                              <span className="flex items-center gap-1.5">
                                                <UserPlus className="w-3 h-3 text-[#6B7280]" />
                                                <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest">External Panelist</span>
                                              </span>
                                              <span className="block text-xs font-semibold text-[#111827] mt-1.5">{displayName}</span>
                                              <span className="block text-[11px] text-[#6B7280] truncate">{inv.email}</span>
                                              <span className="inline-flex mt-2 px-2 py-0.5 text-[9px] font-bold rounded-full border"
                                                style={{ backgroundColor: sty.bg, color: sty.text, borderColor: sty.border }}>
                                                {inv.status}
                                              </span>
                                              {inv.availability && (
                                                <span className={`block text-[11px] mt-1.5 font-medium ${inv.availability.available ? 'text-green-700' : 'text-orange-700'}`}>
                                                  {inv.availability.available ? '✓ Available' : '✕ Not available'}
                                                  {inv.availability.note && <span className="block font-normal italic text-[#9CA3AF]">"{inv.availability.note}"</span>}
                                                </span>
                                              )}
                                              <span className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-[#F3F4F6]">
                                                {!cancelled && (
                                                  <button onClick={() => cancelExternalInvite(inv.id)}
                                                    className="flex-1 inline-flex items-center justify-center gap-1 py-1 rounded-lg border border-[#E5E7EB] text-[10px] font-semibold text-[#6B7280] hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors">
                                                    <Ban className="w-3 h-3" /> Cancel
                                                  </button>
                                                )}
                                                <button onClick={() => { resendExternalInvite(inv.id); setSchedToast(`Invite resent to ${inv.email}`); setTimeout(() => setSchedToast(''), 3000); }}
                                                  className="flex-1 inline-flex items-center justify-center gap-1 py-1 rounded-lg border border-[#E5E7EB] text-[10px] font-semibold text-[#6B7280] hover:bg-blue-50 hover:border-blue-200 hover:text-[#3538CD] transition-colors">
                                                  <RefreshCw className="w-3 h-3" /> Resend
                                                </button>
                                              </span>
                                            </span>
                                          </span>
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
                                  <p className="text-xs text-[#667085]">Scheduled by</p>
                                  <p className="text-xs font-normal text-[#101828] mt-1 first-letter:uppercase">{round.scheduledBy}</p>
                                  <p className="text-xs text-[#101828]">{round.scheduledAt.replace(/\//g, '-')}</p>
                                </div>
                                <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
                                  <p className="text-xs text-[#667085]">Interview Duration</p>
                                  <p className="text-xs font-normal text-[#101828] mt-1">{round.duration}</p>
                                </div>
                                <div className="w-full px-2">
                                  <p className="text-xs text-[#667085]">Additional Information</p>
                                  <p className="text-xs font-normal text-[#101828] mt-1 break-words">{round.additionalInfo}</p>
                                </div>
                              </div>

                              {/* Panel feedback accordion — staging: disabled gray when none, green + criteria rows when provided */}
                              {round.feedbackScore === 0 ? (
                                <div className="mt-3">
                                  <button className="w-full justify-between border-[#EAECF0] bg-[#F9FAFB] flex items-center p-3 text-sm text-[#344054] font-medium border rounded-lg cursor-not-allowed">
                                    <span className="text-xs">Interview Panel Feedback</span>
                                    <ChevronDown className="w-4 h-4 text-[#667085]" />
                                  </button>
                                </div>
                              ) : (
                                <div className="mt-3">
                                  <button
                                    onClick={() => setFeedbackOpen(prev => {
                                      const next = [...prev];
                                      next[idx] = !isFbOpen;
                                      return next;
                                    })}
                                    className={`w-full justify-between border-[#EAECF0] bg-[#ECFDF3] flex items-center p-3 text-sm text-[#344054] font-medium border ${isFbOpen ? 'rounded-t-lg' : 'rounded-lg'}`}
                                  >
                                    <div className="flex items-center gap-1 flex-wrap text-xs">
                                      <span>Interview Panel Feedback</span>
                                      <span>(Provided by</span>
                                      <span className="text-[#3538CD]">{round.feedbackBy}</span>
                                      {round.feedbackAt && <span>on {round.feedbackAt}</span>}
                                      <span>)</span>
                                      <Info className="w-3.5 h-3.5 text-[#344054] cursor-pointer" />
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-[#667085] transition-transform duration-200 shrink-0 ${isFbOpen ? 'rotate-180' : ''}`} />
                                  </button>
                                  {isFbOpen && (
                                    <div className="p-4 border border-[#EAECF0] border-t-0 rounded-br-lg rounded-bl-lg">
                                      {(appliedJob?.evaluationCriteria ?? []).map((crit, ci) => (
                                        <div key={crit}>
                                          {ci > 0 && <hr className="border-[#EAECF0] mb-4" />}
                                          <div className="flex flex-wrap -mx-2">
                                            <div className="w-full sm:w-1/4 px-2 mb-4">
                                              <p className="text-xs text-[#667085]">{crit}</p>
                                              <div className="mt-1"><StarRow value={round.feedbackScore} /></div>
                                            </div>
                                            <div className="w-full sm:w-3/4 px-2 mb-4 text-[#101828]">
                                              <p className="text-xs text-[#667085]">Remarks</p>
                                              <p className="text-xs font-normal mt-1">-</p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                      <div className="border border-[#EAECF0] rounded-lg bg-[#F9FAFB] p-5 flex flex-wrap">
                                        <div className="w-full sm:w-1/4">
                                          <p className="text-xs text-[#667085]">Average Rating</p>
                                          <div className="mt-1"><StarRow value={round.feedbackScore} /></div>
                                        </div>
                                        <div className="w-full sm:w-3/4 text-[#101828]">
                                          <p className="text-xs text-[#667085]">Overall Remarks</p>
                                          <p className="text-xs font-normal mt-1 break-words">{round.overallRemarks ?? '-'}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* External panel feedback — same accordion idiom, one row per submission */}
                              {roundExtInvites.filter(inv => inv.feedback).map(inv => {
                                const isOpen = extFbOpen[inv.id] ?? false;
                                const fb = inv.feedback!;
                                const ratings = Object.entries(fb.criteriaRatings);
                                const avg = ratings.length ? Math.round(ratings.reduce((s, [, r]) => s + r.score, 0) / ratings.length) : 0;
                                const sugg = SUGGESTION_STYLE[fb.suggestion] ?? SUGGESTION_STYLE['Not Sure'];
                                const displayName = inv.name || `${inv.firstName ?? ''} ${inv.lastName ?? ''}`.trim() || inv.email;
                                return (
                                  <div key={inv.id} className="mt-3">
                                    <button
                                      onClick={() => setExtFbOpen(prev => ({ ...prev, [inv.id]: !isOpen }))}
                                      className={`w-full justify-between border-[#EAECF0] bg-[#ECFDF3] flex items-center p-3 text-sm text-[#344054] font-medium border ${isOpen ? 'rounded-t-lg' : 'rounded-lg'}`}
                                    >
                                      <div className="flex items-center gap-1 flex-wrap text-xs">
                                        <span>Interview Panel Feedback</span>
                                        <span>(Provided by</span>
                                        <span className="text-[#3538CD]">{displayName}</span>
                                        <span>)</span>
                                        <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[#EEF4FF] text-[#3538CD] border border-[#C7D2FE]">External</span>
                                      </div>
                                      <ChevronDown className={`w-4 h-4 text-[#667085] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isOpen && (
                                      <div className="p-4 border border-[#EAECF0] border-t-0 rounded-br-lg rounded-bl-lg">
                                        {ratings.map(([crit, r], ri) => (
                                          <div key={crit}>
                                            {ri > 0 && <hr className="border-[#EAECF0] mb-4" />}
                                            <div className="flex flex-wrap -mx-2">
                                              <div className="w-full sm:w-1/4 px-2 mb-4">
                                                <p className="text-xs text-[#667085]">{crit}</p>
                                                <div className="mt-1"><StarRow value={r.score} /></div>
                                              </div>
                                              <div className="w-full sm:w-3/4 px-2 mb-4 text-[#101828]">
                                                <p className="text-xs text-[#667085]">Remarks</p>
                                                <p className="text-xs font-normal mt-1 first-letter:uppercase">{r.remark || '-'}</p>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                        <div className="border border-[#EAECF0] rounded-lg bg-[#F9FAFB] p-5 flex flex-wrap">
                                          <div className="w-full sm:w-1/4">
                                            <p className="text-xs text-[#667085]">Average Rating</p>
                                            <div className="mt-1"><StarRow value={avg} /></div>
                                            <div className="flex w-max items-center rounded-2xl border font-medium capitalize py-0.5 px-2.5 text-xs mt-2"
                                              style={{ backgroundColor: sugg.bg, borderColor: sugg.border, color: sugg.text }}>
                                              <span>{fb.suggestion}</span>
                                            </div>
                                          </div>
                                          <div className="w-full sm:w-3/4 text-[#101828]">
                                            <p className="text-xs text-[#667085]">Overall Remarks</p>
                                            <p className="text-xs font-normal mt-1 break-words first-letter:uppercase">{fb.overallRemarks}</p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Interview Drawer */}
      <ScheduleInterviewDrawer
        candidateName={`${firstName} ${lastName}`}
        candidateId={candidateId ?? ''}
        jobTitle={appliedJob?.title ?? 'Unknown'}
        businessUnit={appliedJob?.businessUnit ?? 'MindInventory'}
        evaluationCriteria={appliedJob?.evaluationCriteria ?? []}
        resumeUrl={candidate?.resumeUrl}
        roundCount={interviewData?.rounds.length ?? 0}
        open={scheduleDrawerOpen}
        onClose={() => setScheduleDrawerOpen(false)}
        onScheduled={handleScheduled}
      />

      {/* Toast */}
      {schedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-3 animate-[slideUp_0.3s_ease-out]">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {schedToast}
        </div>
      )}
    </CRMLayout>
  );
}
