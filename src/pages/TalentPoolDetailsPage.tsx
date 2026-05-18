import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import {
  Mail, Phone, MapPin, Copy, FileText, ExternalLink,
  Check, X, Link2, Archive,
  CalendarDays, Send, MoreVertical,
  Pencil, Ban, Info, Eye, Clock,
  ArrowUpDown, ArrowUp, ArrowDown,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import InviteEmailCompose from '../components/InviteEmailCompose';
import type { TalentInviteStatus } from '../store/types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function DetailField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-[#1A1A2E]">{value || '–'}</p>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-[#F9FAFB] border-b border-[#E5E7EB]">
        <h3 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: 'asc' | 'desc' | null }) {
  if (!active || !dir) return <ArrowUpDown className="w-3 h-3 text-[#9CA3AF]" />;
  return dir === 'asc' ? <ArrowUp className="w-3 h-3 text-[#3538CD]" /> : <ArrowDown className="w-3 h-3 text-[#3538CD]" />;
}


const inviteStatusStyle: Record<TalentInviteStatus, { pill: string; label: string }> = {
  'Sent':           { pill: 'bg-[#F4F5FA] text-[#3538CD] border-[#3538CD]/10', label: 'Awaiting Response' },
  'Interested':     { pill: 'bg-green-50 text-green-700 border-green-200',      label: 'Interested' },
  'Not Interested': { pill: 'bg-gray-100 text-gray-500 border-gray-200',        label: 'Not Interested' },
  'Applied':        { pill: 'bg-[#3538CD] text-white border-[#3538CD]',         label: 'Applied' },
  'Expired':        { pill: 'bg-amber-50 text-amber-600 border-amber-200',      label: 'Expired' },
};

const APP_STATUS_STYLE: Record<string, { border: string; text: string; bg: string; dot: string }> = {
  'Applied':               { border: 'rgb(191,219,254)', text: 'rgb(29,78,216)',   bg: 'rgb(239,246,255)', dot: 'rgb(59,130,246)'  },
  'Under Review':          { border: 'rgb(191,219,254)', text: 'rgb(29,78,216)',   bg: 'rgb(239,246,255)', dot: 'rgb(59,130,246)'  },
  'Shortlisted':           { border: 'rgb(167,243,208)', text: 'rgb(6,95,70)',     bg: 'rgb(236,253,245)', dot: 'rgb(16,185,129)'  },
  'Interview in Progress': { border: 'rgb(253,230,138)', text: 'rgb(146,64,14)',   bg: 'rgb(255,251,235)', dot: 'rgb(245,158,11)'  },
  'Offer Made':            { border: 'rgb(167,243,208)', text: 'rgb(6,78,59)',     bg: 'rgb(209,250,229)', dot: 'rgb(5,150,105)'   },
  'Offer Accepted':        { border: 'rgb(167,243,208)', text: 'rgb(6,78,59)',     bg: 'rgb(209,250,229)', dot: 'rgb(5,150,105)'   },
  'On Hold':               { border: 'rgb(221,214,254)', text: 'rgb(91,33,182)',   bg: 'rgb(245,243,255)', dot: 'rgb(139,92,246)'  },
  'Selected':              { border: 'rgb(171,239,198)', text: 'rgb(6,118,71)',    bg: 'rgb(236,253,243)', dot: 'rgb(23,178,106)'  },
  'Rejected':              { border: 'rgb(254,205,202)', text: 'rgb(180,35,24)',   bg: 'rgb(254,243,242)', dot: 'rgb(240,68,56)'   },
  'Withdrawn':             { border: 'rgb(220,215,210)', text: 'rgb(113,104,95)',  bg: 'rgb(250,249,247)', dot: 'rgb(168,160,149)' },
  'Joined':                { border: 'rgb(213,217,235)', text: 'rgb(54,63,114)',   bg: 'rgb(248,249,252)', dot: 'rgb(78,91,166)'   },
  'Offer Declined':        { border: 'rgb(246,208,254)', text: 'rgb(159,26,177)',  bg: 'rgb(253,244,255)', dot: 'rgb(212,68,241)'  },
  'Not Joined':            { border: 'rgb(255,193,205)', text: 'rgb(255,0,81)',    bg: 'rgb(255,241,243)', dot: 'rgb(255,0,81)'    },
  'Archived':              { border: 'rgb(203,213,225)', text: 'rgb(71,85,105)',   bg: 'rgb(248,250,252)', dot: 'rgb(100,116,139)' },
  'Offer Revoked':         { border: 'rgb(255,221,211)', text: 'rgb(255,87,34)',   bg: 'rgb(255,247,244)', dot: 'rgb(255,137,100)' },
  'No Show':               { border: 'rgb(253,186,116)', text: 'rgb(120,53,15)',   bg: 'rgb(255,247,237)', dot: 'rgb(217,119,6)'   },
  'Active':                { border: 'rgb(191,219,254)', text: 'rgb(29,78,216)',   bg: 'rgb(239,246,255)', dot: 'rgb(59,130,246)'  },
  'Cancelled':             { border: 'rgb(209,213,219)', text: 'rgb(75,85,99)',    bg: 'rgb(249,250,251)', dot: 'rgb(107,114,128)' },
  'Future':                { border: 'rgb(199,210,254)', text: 'rgb(67,56,202)',   bg: 'rgb(238,242,255)', dot: 'rgb(99,102,241)'  },
};

const CANDIDATE_STATUS_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  'Active':      { bg: 'rgb(238,242,255)', text: 'rgb(53,56,205)',   border: 'rgb(199,210,254)' },
  'Blacklisted': { bg: 'rgb(254,242,242)', text: 'rgb(185,28,28)',   border: 'rgb(254,202,202)' },
  'Discarded':   { bg: 'rgb(249,250,251)', text: 'rgb(107,114,128)', border: 'rgb(209,213,219)' },
  'Joined':      { bg: 'rgb(240,253,244)', text: 'rgb(21,128,61)',   border: 'rgb(187,247,208)' },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const formatRelative = (iso: string) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff}d ago`;
  return formatDate(iso);
};

// ── Page ─────────────────────────────────────────────────────────────────────

type Note = { id: string; author: string; text: string; createdAt: string };

const mockNotesMap: Record<string, Note[]> = {
  full1: [
    { id: 'n1', author: 'System', text: 'Candidate profile created from LinkedIn outreach by Sarah Chen.', createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 'n2', author: 'Sarah Chen', text: 'Initial phone screen done. Very articulate, strong ML background. Communication is excellent. Moving her to the technical round next week.', createdAt: new Date(Date.now() - 86400000 * 1 + 3600000 * 3).toISOString() },
    { id: 'n3', author: 'Sarah Chen', text: 'Technical assessment sent. Deadline is in 2 days — follow up if no submission by then.', createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
  ],
  full2: [
    { id: 'n4', author: 'System', text: 'Candidate added via referral from Vikram Nair. Alumni status verified — previously worked as Senior DevOps Engineer at MindInventory (Jul 2017 – Feb 2020).', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'n5', author: 'Michael Park', text: 'Intro call completed. Very hands-on. Kubernetes and Terraform expertise is exactly what the platform team needs. Open to relocation if required.', createdAt: new Date(Date.now() - 86400000 * 1 - 3600000 * 2).toISOString() },
    { id: 'n6', author: 'Michael Park', text: 'Competing offer from Razorpay on the table. Rohan expects a decision by 30 May. Escalating to the hiring manager — need to fast-track the process.', createdAt: new Date(Date.now() - 3600000 * 8).toISOString() },
  ],
  full3: [
    { id: 'n7', author: 'System', text: 'Candidate identified via Dribbble portfolio. Directly approached by Lisa Ray on 15 May 2026.', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'n8', author: 'Lisa Ray', text: 'Portfolio walkthrough done — exceptional Figma work, very clear design thinking. Particularly impressed by the Swiggy Instamart checkout redesign. Shortlisting for a design challenge round.', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'n9', author: 'Lisa Ray', text: 'She is available for interviews any day this week and prefers morning slots. Sending calendar invite today.', createdAt: new Date(Date.now() - 3600000 * 6).toISOString() },
  ],
};

const TABS = ['Profile', 'Applications', 'Invite History', 'History', 'Notes'] as const;
type Tab = typeof TABS[number];

export default function TalentPoolDetailsPage() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { candidates, jobs, applications, invites, updateInviteStatus, blacklistCandidate, discardCandidate } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const [showInvite, setShowInvite] = useState(false);
  const [inviteSent, setInviteSent] = useState<string | null>(null);
  const [showKebab, setShowKebab] = useState(false);
  const kebabRef = useRef<HTMLDivElement>(null);
  const [showBlacklist, setShowBlacklist] = useState(false);
  const [blacklistRemarks, setBlacklistRemarks] = useState('');
  const [showDiscard, setShowDiscard] = useState(false);
  const [discardRemarks, setDiscardRemarks] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [appliedSortDir, setAppliedSortDir] = useState<'asc' | 'desc' | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [notes, setNotes] = useState<Note[]>(() => mockNotesMap[candidateId ?? ''] ?? []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (kebabRef.current && !kebabRef.current.contains(e.target as Node)) {
        setShowKebab(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const candidate = candidates.find(c => c.id === candidateId);

  if (!candidate) {
    return (
      <CRMLayout breadcrumbs={[{ label: 'Talent Pool', path: '/crm/talent-pool' }, { label: 'Not Found' }]}>
        <div className="py-20 text-center text-[#6B7280]">Candidate not found.</div>
      </CRMLayout>
    );
  }

  const candidateApps = applications
    .filter(a => a.candidateId === candidate.id)
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

  const candidateInvites = invites
    .filter(i => i.candidateId === candidate.id)
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

  const pendingInviteCount = candidateInvites.filter(i => i.status === 'Sent').length;

  const canContact = !!candidate.allowRecruiterContact;

  const candidateStatus = candidate.candidateStatus ?? (candidate.isBlacklisted ? 'Blacklisted' : 'Active');

  const currentExp = candidate.experiences?.find((e: any) => e.isCurrent) ?? candidate.experiences?.[0];
  const displayOrg = candidate.currentOrg ?? currentExp?.company;
  const displayDesignation = candidate.currentDesignation ?? currentExp?.designation;

  const handleInviteSent = (name: string) => {
    setShowInvite(false);
    setInviteSent(name);
    setTimeout(() => setInviteSent(null), 4000);
  };

  const totalExp = (() => {
    const y = candidate.totalExperienceYears;
    const m = candidate.totalExperienceMonths;
    if (!y && !m) return null;
    const parts = [];
    if (y) parts.push(`${y} yr${y !== 1 ? 's' : ''}`);
    if (m) parts.push(`${m} mo${m !== 1 ? 's' : ''}`);
    return parts.join(', ');
  })();

  const toggleAppliedSort = () => setAppliedSortDir(d => d === 'asc' ? 'desc' : 'asc');

  const sortedApps = [...candidateApps].sort((a, b) => {
    if (!appliedSortDir) return 0;
    const da = new Date(a.appliedAt).getTime();
    const db = new Date(b.appliedAt).getTime();
    return appliedSortDir === 'asc' ? da - db : db - da;
  });

  return (
    <>
      <CRMLayout
        breadcrumbs={[
          { label: 'Talent Pool', path: '/crm/talent-pool' },
          { label: `${candidate.firstName} ${candidate.lastName}` },
        ]}
      >
        <div className="flex gap-8 items-start pb-16">

          {/* ── LEFT SIDEBAR ── */}
          <div className="w-[280px] shrink-0 sticky top-[80px] space-y-4">

            <div className="bg-white rounded-3xl border border-[#E9D5FF] shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#7C3AED] to-[#A78BFA]" />
              <div className="p-6 flex flex-col items-center">

                <div className="mb-3">
                  <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]">
                    Talent Pool
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <h2 className="text-lg font-black text-[#1A1A2E] text-center leading-tight">
                    {candidate.firstName} {candidate.lastName}
                  </h2>
                  {candidate.isAlumni && (
                    <span className="px-2 py-0.5 text-[9px] font-black bg-amber-50 text-amber-600 border border-amber-200 rounded-full uppercase tracking-widest shrink-0">
                      Alumni
                    </span>
                  )}
                </div>

                {displayDesignation && (
                  <p title="Current Designation" className="text-sm font-bold text-[#3538CD] mt-1 text-center cursor-default">{displayDesignation}</p>
                )}

                {/* Candidate status */}
                {(() => {
                  const cs = CANDIDATE_STATUS_STYLE[candidateStatus] ?? CANDIDATE_STATUS_STYLE['Active'];
                  return (
                    <span
                      className="mt-3 px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border"
                      style={{ backgroundColor: cs.bg, color: cs.text, borderColor: cs.border }}
                    >
                      {candidateStatus}
                    </span>
                  );
                })()}

                <div className="w-full border-t border-[#E5E7EB] my-5" />

                {/* Contact info */}
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center">
                      <Mail className="w-4 h-4 text-[#6B7280]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest flex items-center gap-1.5">
                        Email
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${canContact ? 'bg-green-500' : 'bg-gray-300'}`} title={canContact ? 'Open to contact' : 'Invite first'} />
                      </p>
                      <div className="flex items-center gap-1">
                        {canContact ? (
                          <>
                            <span className="text-sm font-bold text-[#374151] truncate">{candidate.email}</span>
                            <Copy className="w-3.5 h-3.5 text-[#9CA3AF] hover:text-[#3538CD] shrink-0 cursor-pointer" />
                          </>
                        ) : (
                          <span className="text-sm font-bold text-[#9CA3AF] tracking-widest">••••••@••••••.com</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {candidate.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center">
                        <Phone className="w-4 h-4 text-[#6B7280]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Phone</p>
                        {canContact ? (
                          <span className="text-sm font-bold text-[#374151]">{candidate.phone}</span>
                        ) : (
                          <span className="text-sm font-bold text-[#9CA3AF] tracking-widest">••••• •••••</span>
                        )}
                      </div>
                    </div>
                  )}

                  {candidate.location && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-[#6B7280]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Location</p>
                        <span className="text-sm font-bold text-[#374151]">{candidate.location}</span>
                      </div>
                    </div>
                  )}

                  {candidate.linkedin && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                          <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">LinkedIn</p>
                        <a
                          href={`https://${candidate.linkedin.replace(/^https?:\/\//, '')}`}
                          target="_blank" rel="noreferrer"
                          className="text-sm font-bold text-[#3538CD] hover:underline flex items-center gap-1"
                        >
                          Profile <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}

                </div>

                <div className="w-full border-t border-[#E5E7EB] my-5" />

                {/* Resume */}
                {(candidate.resumeUrl || candidate.resumeLink) ? (
                  <a
                    href={candidate.resumeLink || '#'} target="_blank" rel="noreferrer"
                    className="w-full flex items-center gap-2.5 px-4 py-3 border border-[#E5E7EB] rounded-2xl text-xs font-black text-[#374151] hover:bg-[#F9FAFB] hover:border-[#3538CD]/30 transition-all uppercase tracking-widest"
                  >
                    <FileText className="w-4 h-4 text-[#3538CD]" />
                    View Resume
                    <ExternalLink className="w-3.5 h-3.5 ml-auto text-[#9CA3AF]" />
                  </a>
                ) : (
                  <p className="text-xs font-bold text-[#C4C9D4] italic text-center">No resume uploaded</p>
                )}

                <div className="w-full border-t border-[#E5E7EB] my-5" />

                {/* Meta */}
                <div className="w-full space-y-2.5">
                  <div>
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Created by</p>
                    <p className="text-[10px] font-bold text-[#6B7280] mt-0.5">
                      {candidate.createdBy ?? 'Super User'} · {candidate.addedAt ? new Date(candidate.addedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Modified by</p>
                    <p className="text-[10px] font-bold text-[#6B7280] mt-0.5">
                      {candidate.modifiedBy ?? 'Super User'} · {candidate.addedAt ? new Date(candidate.addedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0">

            {/* Tab bar + actions */}
            <div className="flex items-center justify-between mb-6 bg-white p-2 rounded-2xl border border-[#E5E7EB] shadow-sm">
              <div className="flex items-center">
                {TABS.map(tab => {
                  const badge =
                    tab === 'Applications' && candidateApps.length > 0 ? candidateApps.length :
                    tab === 'Invite History' && pendingInviteCount > 0 ? pendingInviteCount :
                    tab === 'Notes' && notes.length > 0 ? notes.length :
                    null;
                  const isActive = tab === activeTab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/20'
                          : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]'
                      }`}
                    >
                      {tab}
                      {badge !== null && (
                        <span className={`px-1.5 py-0.5 text-[9px] rounded-full font-black ${isActive ? 'bg-white/20 text-white' : 'bg-[#F4F5FA] text-[#7C3AED]'}`}>
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 pr-1">
                {canContact && candidateStatus === 'Active' && (
                  <button
                    onClick={() => setShowInvite(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#7C3AED] text-white text-xs font-black rounded-xl hover:bg-[#6D28D9] transition-all shadow-md shadow-[#7C3AED]/20 uppercase tracking-widest"
                  >
                    <Send className="w-3.5 h-3.5" /> Invite to Apply
                  </button>
                )}
                <div ref={kebabRef} className="relative">
                  <button
                    onClick={() => setShowKebab(v => !v)}
                    className="p-2.5 rounded-xl border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-all"
                  >
                    <MoreVertical className="w-4 h-4 text-[#6B7280]" />
                  </button>
                  {showKebab && (
                    <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl border border-[#E5E7EB] shadow-xl z-50 overflow-hidden">
                      <button
                        onClick={() => { navigator.clipboard.writeText(window.location.href); setShowKebab(false); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2500); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-black text-[#374151] hover:bg-[#F9FAFB] transition-colors uppercase tracking-widest"
                      >
                        <Link2 className="w-3.5 h-3.5 text-[#6B7280]" /> Copy Profile Link
                      </button>
                      <div className="h-px bg-[#F3F4F6]" />
                      <button
                        onClick={() => { setShowKebab(false); navigate(`/crm/talent-pool/${candidateId}/edit`); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-black text-[#374151] hover:bg-[#F9FAFB] transition-colors uppercase tracking-widest"
                      >
                        <Pencil className="w-3.5 h-3.5 text-[#6B7280]" /> Edit
                      </button>
                      <div className="h-px bg-[#F3F4F6]" />
                      <button
                        onClick={() => { setShowKebab(false); setShowDiscard(true); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-black text-amber-600 hover:bg-amber-50 transition-colors uppercase tracking-widest"
                      >
                        <Archive className="w-3.5 h-3.5" /> Discard
                      </button>
                      <div className="h-px bg-[#F3F4F6]" />
                      <button
                        onClick={() => { setShowKebab(false); setShowBlacklist(true); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-black text-red-600 hover:bg-red-50 transition-colors uppercase tracking-widest"
                      >
                        <Ban className="w-3.5 h-3.5" /> Blacklist
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Profile tab ── */}
            {activeTab === 'Profile' && (
              <div className="space-y-5">

                <SectionCard title="Personal Information">
                  <div className="grid grid-cols-3 gap-8">
                    <DetailField label="Date of Birth" value={candidate.dateOfBirth} />
                    <DetailField label="Gender" value={candidate.gender} />
                    <DetailField label="Marital Status" value={candidate.maritalStatus} />
                  </div>
                </SectionCard>

                <SectionCard title="Professional Details">
                  <div className="space-y-8">
                    <div className="grid grid-cols-3 gap-8">
                      <DetailField label="Current Organisation" value={displayOrg} />
                      <DetailField label="Designation" value={displayDesignation} />
                      <DetailField label="Notice Period" value={candidate.noticePeriod} />
                      <DetailField label="Total Experience" value={candidate.isFresher ? 'Fresher' : totalExp} />
                      <DetailField label="Highest Qualification" value={candidate.highestQualification} />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3">Skills</p>
                      {candidate.skills?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills.map(s => (
                            <span key={s} className="px-3 py-1.5 bg-[#F4F5FA] border border-[#3538CD]/10 text-[#3538CD] text-[11px] font-bold rounded-full">
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : <p className="text-sm font-bold text-[#1A1A2E]">–</p>}
                    </div>

                    <DetailField label="General Remarks" value={candidate.recruiterNotes} />

                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Career Journey</p>
                      {candidate.experiences?.length ? candidate.experiences.map((exp: any, i: number) => (
                        <div key={i} className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-black text-[#111827]">{exp.designation}</h4>
                              <p className="text-xs font-bold text-[#3538CD]">{exp.company}</p>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] bg-white border border-[#E5E7EB] px-2.5 py-1 rounded-md">
                              {exp.from} – {exp.to}
                            </span>
                          </div>
                          {exp.description && (
                            <p className="text-xs font-medium text-[#4B5563] mt-3 leading-relaxed">{exp.description}</p>
                          )}
                        </div>
                      )) : (
                        <p className="text-sm text-[#C4C9D4] italic">No experience added.</p>
                      )}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Salary Information">
                  <div className="grid grid-cols-4 gap-8">
                    <DetailField label="CTC Type" value={candidate.ctcType} />
                    <DetailField label="Currency" value={candidate.ctcCurrency} />
                    <DetailField label="Current CTC" value={candidate.isFresher ? 'Fresher' : candidate.currentCtc} />
                    <DetailField label="Expected CTC" value={candidate.expectedCtc} />
                  </div>
                </SectionCard>

                <SectionCard title="Address">
                  <div className="space-y-6">
                    <DetailField label="Address" value={candidate.address} />
                    <div className="grid grid-cols-4 gap-8">
                      <DetailField label="Country" value={candidate.country} />
                      <DetailField label="State" value={candidate.state} />
                      <DetailField label="Town / City" value={candidate.city} />
                      <DetailField label="Zip / Postal Code" value={candidate.zipCode} />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Source Information">
                  <div className="flex gap-16">
                    {candidate.source ? (
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Source</p>
                        <span className="inline-flex px-3 py-1.5 bg-[#7C3AED] text-white text-[11px] font-black rounded-lg uppercase tracking-wider">
                          {candidate.source}
                        </span>
                      </div>
                    ) : <DetailField label="Source" value={undefined} />}
                    <DetailField label="Source Remark" value={candidate.sourceRemark} />
                  </div>
                </SectionCard>

              </div>
            )}

            {/* ── Applications tab ── */}
            {activeTab === 'Applications' && (
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
                        <tr>
                          <td colSpan={5} className="px-6 py-16 text-center">
                            <CalendarDays className="w-8 h-8 text-[#E5E7EB] mx-auto mb-3" />
                            <p className="text-sm font-bold text-[#9CA3AF]">No applications yet</p>
                            <p className="text-xs text-[#C4C9D4] mt-1">This talent hasn't applied to any role.</p>
                          </td>
                        </tr>
                      ) : sortedApps.map((app, i) => {
                        const job = jobs.find(j => j.id === app.jobId);
                        const style = APP_STATUS_STYLE[app.status] ?? APP_STATUS_STYLE['Applied'];
                        const jobCode = `MI-${String(i + 1).padStart(3, '0')}`;
                        return (
                          <tr key={app.id} className="hover:bg-[#F9FAFB] transition-colors">
                            <td className="px-6 py-4 font-bold text-[#111827] text-xs">{i + 1}</td>
                            <td className="px-6 py-4 text-xs font-medium text-[#374151]">{formatDate(app.appliedAt)}</td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-bold text-[#3538CD]">{jobCode}</span>
                              <span className="text-xs font-medium text-[#374151]"> | {job?.title || '—'}</span>
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
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Invite History tab ── */}
            {activeTab === 'Invite History' && (
              <div className="space-y-3">
                {candidateInvites.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm py-20 flex flex-col items-center gap-3 text-center px-8">
                    <div className="w-12 h-12 bg-[#F4F5FA] rounded-2xl flex items-center justify-center">
                      <Send className="w-5 h-5 text-[#D1D5DB]" />
                    </div>
                    <p className="text-sm font-black text-[#9CA3AF]">No invites sent yet</p>
                    <p className="text-xs text-[#C4C9D4] max-w-xs">
                      When you invite this person to apply for a role, a record will appear here.
                    </p>
                    {candidateStatus === 'Active' && (
                      <button
                        onClick={() => setShowInvite(true)}
                        className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-[#7C3AED] text-white text-xs font-black rounded-xl hover:bg-[#6D28D9] transition-all shadow-md shadow-[#7C3AED]/20 uppercase tracking-widest"
                      >
                        <Send className="w-3.5 h-3.5" /> Send First Invite
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-black text-[#9CA3AF] uppercase tracking-widest px-1">
                      {candidateInvites.length} invite{candidateInvites.length !== 1 ? 's' : ''} sent
                    </p>
                    {candidateInvites.map(invite => {
                      const st = inviteStatusStyle[invite.status];
                      const isApplied = invite.status === 'Applied';
                      const isSent = invite.status === 'Sent';
                      return (
                        <div key={invite.id} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                          <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-black text-[#111827]">
                                  {invite.jobTitle || 'General Invite'}
                                </p>
                                <span className={`inline-flex px-2 py-0.5 text-[10px] font-black rounded-full border uppercase tracking-widest ${st.pill}`}>
                                  {st.label}
                                </span>
                                {invite.emailMode === 'custom' && (
                                  <span className="inline-flex px-2 py-0.5 text-[10px] font-bold text-[#9CA3AF] bg-[#F9FAFB] border border-[#E5E7EB] rounded-full uppercase tracking-widest">
                                    Custom Email
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#9CA3AF] mt-1.5">
                                Sent by <span className="font-bold text-[#6B7280]">{invite.sentBy}</span>
                                {' · '}{formatRelative(invite.sentAt)}
                              </p>
                            </div>
                            {!isSent && !isApplied && candidateStatus === 'Active' && (
                              <button
                                onClick={() => setShowInvite(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black text-[#7C3AED] bg-[#F5F3FF] border border-[#7C3AED]/10 rounded-lg hover:bg-[#7C3AED]/10 transition-colors uppercase tracking-widest shrink-0"
                              >
                                <Send className="w-3 h-3" /> Resend
                              </button>
                            )}
                          </div>
                          {!isApplied && (
                            <div className="px-5 pb-4 flex items-center gap-2">
                              <p className="text-[10px] font-black text-[#C4C9D4] uppercase tracking-widest mr-1 shrink-0">
                                {isSent ? 'Update when you hear back:' : 'Override:'}
                              </p>
                              <button
                                onClick={() => updateInviteStatus(invite.id, 'Interested')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black rounded-lg border transition-colors uppercase tracking-widest ${
                                  invite.status === 'Interested'
                                    ? 'bg-green-100 text-green-700 border-green-300 cursor-default ring-1 ring-green-400'
                                    : 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                                Interested
                                {invite.status === 'Interested' && <span className="ml-0.5 text-[9px]">✓</span>}
                              </button>
                              <button
                                onClick={() => updateInviteStatus(invite.id, 'Not Interested')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black rounded-lg border transition-colors uppercase tracking-widest ${
                                  invite.status === 'Not Interested'
                                    ? 'bg-gray-200 text-gray-600 border-gray-300 cursor-default ring-1 ring-gray-400'
                                    : 'text-gray-500 bg-gray-50 border-gray-200 hover:bg-gray-100'
                                }`}
                              >
                                <X className="w-3.5 h-3.5" />
                                Not Interested
                                {invite.status === 'Not Interested' && <span className="ml-0.5 text-[9px]">✓</span>}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}

            {/* ── History tab ── */}
            {activeTab === 'History' && (
              <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm py-20 flex flex-col items-center gap-3 text-center px-8">
                <div className="w-12 h-12 bg-[#F4F5FA] rounded-2xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#D1D5DB]" />
                </div>
                <p className="text-sm font-black text-[#9CA3AF]">No history yet</p>
                <p className="text-xs text-[#C4C9D4] max-w-xs">
                  Activity and changes for this candidate will appear here.
                </p>
              </div>
            )}

            {/* ── Notes tab ── */}
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
                      const initials = note.author.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                      const ts = new Date(note.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                      return (
                        <div key={note.id} className="flex items-start gap-3 px-5 py-4">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-sm font-semibold text-[#111827]">{note.author}</span>
                              <span className="text-[11px] text-[#9CA3AF]">({ts})</span>
                            </div>
                            <p className="text-sm text-indigo-600">{note.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </CRMLayout>

      {showInvite && (
        <InviteEmailCompose
          candidate={candidate}
          jobs={jobs}
          onClose={() => setShowInvite(false)}
          onSent={handleInviteSent}
        />
      )}

      {inviteSent && (
        <div className="fixed bottom-6 right-6 z-[200] bg-[#111827] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3">
          <Check className="w-4 h-4 text-green-400 shrink-0" />
          <span className="text-sm font-bold">Invite sent to {inviteSent}</span>
          <button onClick={() => setInviteSent(null)} className="ml-1 text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {showBlacklist && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between pl-4 pr-4 py-4">
              <p className="text-gray-900 font-semibold text-xl">
                Confirm — <span className="text-indigo-600">Blacklist candidate</span>
              </p>
              <button
                onClick={() => { setShowBlacklist(false); setBlacklistRemarks(''); }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <hr className="border-t border-gray-200" />

            <div className="p-4 space-y-4">
              <div className="flex rounded-xl border border-indigo-300 bg-indigo-50 text-indigo-700 text-sm">
                <div className="p-3 flex items-center">
                  <div className="border-2 border-indigo-300 rounded-full p-1.5 flex items-center justify-center">
                    <div className="border-2 border-indigo-400 rounded-full p-1 flex items-center justify-center">
                      <Info className="w-4 h-4 text-indigo-700" />
                    </div>
                  </div>
                </div>
                <div className="p-4 pl-0 flex items-center">
                  <h3 className="font-semibold">Are you sure you want to blacklist this candidate?</h3>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1.5">
                  <label className="text-xs font-medium text-gray-700">Remarks</label>
                  <span className="text-red-500 text-xs">*</span>
                </div>
                <textarea
                  rows={4}
                  value={blacklistRemarks}
                  onChange={e => setBlacklistRemarks(e.target.value)}
                  placeholder="Reason for blacklisting..."
                  className="w-full rounded-lg py-2 px-3 border border-gray-300 focus:border-indigo-300 focus:outline-none bg-white text-sm resize-none h-[90px]"
                />
              </div>
            </div>

            <div className="flex gap-3 px-4 pb-4">
              <button
                type="button"
                onClick={() => { setShowBlacklist(false); setBlacklistRemarks(''); }}
                className="flex-1 h-9 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!blacklistRemarks.trim()}
                onClick={() => {
                  blacklistCandidate(candidate.id, blacklistRemarks.trim());
                  setShowBlacklist(false);
                  setBlacklistRemarks('');
                }}
                className="flex-1 h-9 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {showDiscard && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between pl-4 pr-4 py-4">
              <p className="text-gray-900 font-semibold text-xl">
                Confirm — <span className="text-amber-600">Discard candidate</span>
              </p>
              <button
                onClick={() => { setShowDiscard(false); setDiscardRemarks(''); }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <hr className="border-t border-gray-200" />

            <div className="p-4 space-y-4">
              <div className="flex rounded-xl border border-amber-300 bg-amber-50 text-amber-700 text-sm">
                <div className="p-3 flex items-center">
                  <div className="border-2 border-amber-300 rounded-full p-1.5 flex items-center justify-center">
                    <div className="border-2 border-amber-400 rounded-full p-1 flex items-center justify-center">
                      <Info className="w-4 h-4 text-amber-700" />
                    </div>
                  </div>
                </div>
                <div className="p-4 pl-0 flex items-center">
                  <h3 className="font-semibold">Are you sure you want to discard this candidate?</h3>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1.5">
                  <label className="text-xs font-medium text-gray-700">Remarks</label>
                  <span className="text-red-500 text-xs">*</span>
                </div>
                <textarea
                  rows={4}
                  value={discardRemarks}
                  onChange={e => setDiscardRemarks(e.target.value)}
                  placeholder="Reason for discarding..."
                  className="w-full rounded-lg py-2 px-3 border border-gray-300 focus:border-amber-300 focus:outline-none bg-white text-sm resize-none h-[90px]"
                />
              </div>
            </div>

            <div className="flex gap-3 px-4 pb-4">
              <button
                type="button"
                onClick={() => { setShowDiscard(false); setDiscardRemarks(''); }}
                className="flex-1 h-9 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!discardRemarks.trim()}
                onClick={() => {
                  discardCandidate(candidate.id, discardRemarks.trim());
                  setShowDiscard(false);
                  setDiscardRemarks('');
                }}
                className="flex-1 h-9 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Yes, Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {copiedLink && (
        <div className="fixed bottom-6 right-6 z-[200] bg-[#111827] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3">
          <Check className="w-4 h-4 text-green-400 shrink-0" />
          <span className="text-sm font-bold">Profile link copied to clipboard</span>
        </div>
      )}
    </>
  );
}
