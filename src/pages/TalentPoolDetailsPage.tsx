import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import {
  Mail, Phone, MapPin, Copy, FileText, ExternalLink,
  Briefcase, Check, X, MessageSquare,
  CalendarDays, Send, MoreVertical, UserCheck, EyeOff, ChevronDown,
  Pencil, Ban,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import InviteEmailCompose from '../components/InviteEmailCompose';
import type { TalentAvailabilityStatus, TalentInviteStatus } from '../store/types';

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

const AVAILABILITY_OPTIONS: TalentAvailabilityStatus[] = [
  'Available', 'Open to Opportunities', 'Currently Employed', 'Placed', 'Not Looking',
];

const availabilityStyle: Record<TalentAvailabilityStatus, string> = {
  'Available':              'bg-green-50 text-green-700 border-green-200',
  'Open to Opportunities':  'bg-blue-50 text-blue-700 border-blue-200',
  'Currently Employed':     'bg-[#F4F5FA] text-[#3538CD] border-[#3538CD]/10',
  'Placed':                 'bg-purple-50 text-purple-700 border-purple-200',
  'Not Looking':            'bg-gray-100 text-gray-500 border-gray-200',
};

const inviteStatusStyle: Record<TalentInviteStatus, { pill: string; label: string }> = {
  'Sent':          { pill: 'bg-[#F4F5FA] text-[#3538CD] border-[#3538CD]/10',  label: 'Awaiting Response' },
  'Interested':    { pill: 'bg-green-50 text-green-700 border-green-200',       label: 'Interested' },
  'Not Interested':{ pill: 'bg-gray-100 text-gray-500 border-gray-200',         label: 'Not Interested' },
  'Applied':       { pill: 'bg-[#3538CD] text-white border-[#3538CD]',          label: 'Applied' },
  'Expired':       { pill: 'bg-amber-50 text-amber-600 border-amber-200',       label: 'Expired' },
};

const appStatusStyle: Record<string, string> = {
  'Under Review':          'bg-[#F4F5FA] text-[#3538CD] border-[#3538CD]/10',
  'Interview in Progress': 'bg-[#F4F5FA] text-[#3538CD] border-[#3538CD]/10',
  'Decision Made':         'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]',
  'Offer Made':            'bg-[#3538CD] text-white border-[#3538CD]',
  'Rejected':              'bg-gray-100 text-gray-400 border-gray-200',
  'Draft':                 'bg-amber-50 text-amber-600 border-amber-200',
  'Submitted':             'bg-[#F4F5FA] text-[#3538CD] border-[#3538CD]/10',
  'Withdrawn':             'bg-gray-50 text-gray-400 border-gray-200',
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

const TABS = ['Profile', 'Applications', 'Invite History', 'Notes'] as const;
type Tab = typeof TABS[number];

export default function TalentPoolDetailsPage() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { candidates, jobs, applications, invites, updateInviteStatus, updateCandidateAvailability } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const [showInvite, setShowInvite] = useState(false);
  const [inviteSent, setInviteSent] = useState<string | null>(null);
  const [editingAvailability, setEditingAvailability] = useState(false);
  const [showKebab, setShowKebab] = useState(false);
  const kebabRef = useRef<HTMLDivElement>(null);

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

            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#3538CD] to-[#6366F1]" />
              <div className="p-6 flex flex-col items-center">

                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-[#3538CD]/5 border-4 border-white shadow-sm flex items-center justify-center text-[#3538CD] font-black text-3xl mb-4">
                  {candidate.firstName[0]}{candidate.lastName[0]}
                </div>

                <h2 className="text-lg font-black text-[#1A1A2E] text-center leading-tight">
                  {candidate.firstName} {candidate.lastName}
                </h2>
                {candidate.currentDesignation && (
                  <p className="text-sm font-bold text-[#3538CD] mt-1 text-center">{candidate.currentDesignation}</p>
                )}
                {candidate.currentOrg && (
                  <p className="text-xs text-[#9CA3AF] mt-0.5 text-center">{candidate.currentOrg}</p>
                )}

                {/* Availability status */}
                <div className="mt-3 w-full">
                  {editingAvailability ? (
                    <select
                      autoFocus
                      value={candidate.availabilityStatus ?? ''}
                      onChange={e => {
                        updateCandidateAvailability(candidate.id, e.target.value as TalentAvailabilityStatus);
                        setEditingAvailability(false);
                      }}
                      onBlur={() => setEditingAvailability(false)}
                      className="w-full text-xs font-bold border border-[#3538CD]/30 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3538CD]/15 bg-white text-[#374151]"
                    >
                      <option value="">— Set Availability —</option>
                      {AVAILABILITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <button
                      onClick={() => setEditingAvailability(true)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border text-xs font-black uppercase tracking-widest transition-all hover:opacity-80 ${
                        candidate.availabilityStatus
                          ? availabilityStyle[candidate.availabilityStatus]
                          : 'bg-[#F9FAFB] text-[#9CA3AF] border-[#E5E7EB]'
                      }`}
                    >
                      <span>{candidate.availabilityStatus ?? 'Set Availability'}</span>
                      <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                  {candidate.isAlumni && (
                    <span className="px-2.5 py-1 text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-200 rounded-full uppercase tracking-widest">
                      Verified Alumni
                    </span>
                  )}
                  {candidate.addedByRecruiter && (
                    <span className="px-2.5 py-1 text-[10px] font-black bg-[#F4F5FA] text-[#3538CD] border border-[#3538CD]/10 rounded-full uppercase tracking-widest">
                      Recruiter Added
                    </span>
                  )}

                  <span className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-black rounded-full border uppercase tracking-widest ${
                    canContact
                      ? 'bg-green-50 text-green-600 border-green-200'
                      : 'bg-gray-50 text-gray-500 border-gray-200'
                  }`}>
                    {canContact
                      ? <><UserCheck className="w-3 h-3" /> Open to contact</>
                      : <><EyeOff className="w-3 h-3" /> Invite first</>
                    }
                  </span>
                </div>

                <div className="w-full border-t border-[#E5E7EB] my-5" />

                {/* Contact info */}
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center">
                      <Mail className="w-4 h-4 text-[#6B7280]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Email</p>
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

                  <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('Applications')}>
                    <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-[#6B7280] group-hover:text-[#3538CD] transition-colors" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Applications</p>
                      <span className="text-sm font-bold text-[#3538CD] underline decoration-[#3538CD]/30 underline-offset-4 hover:decoration-[#3538CD]">
                        {candidateApps.length}
                      </span>
                    </div>
                  </div>
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
                  {candidate.source && (
                    <div>
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Source</p>
                      <span className="inline-flex mt-1 px-2.5 py-1 bg-[#3538CD] text-white text-[10px] font-black rounded-lg uppercase tracking-wider">
                        {candidate.source}
                      </span>
                    </div>
                  )}
                  {candidate.businessUnit && (
                    <div>
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Business Unit</p>
                      <p className="text-xs font-bold text-[#374151] mt-0.5">{candidate.businessUnit}</p>
                    </div>
                  )}
                  {candidate.recordOwner && (
                    <div>
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Record Owner</p>
                      <p className="text-xs font-bold text-[#374151] mt-0.5">{candidate.recordOwner}</p>
                    </div>
                  )}
                  {candidate.addedAt && (
                    <div>
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Added On</p>
                      <p className="text-xs font-bold text-[#374151] mt-0.5">{formatDate(candidate.addedAt)}</p>
                    </div>
                  )}
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
                    null;
                  const isActive = tab === activeTab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#3538CD] text-white shadow-md shadow-[#3538CD]/20'
                          : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]'
                      }`}
                    >
                      {tab}
                      {badge !== null && (
                        <span className={`px-1.5 py-0.5 text-[9px] rounded-full font-black ${isActive ? 'bg-white/20 text-white' : 'bg-[#F4F5FA] text-[#3538CD]'}`}>
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 pr-1">
                {canContact && (
                  <button
                    onClick={() => setShowInvite(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#3538CD] text-white text-xs font-black rounded-xl hover:bg-[#292bb0] transition-all shadow-md shadow-[#3538CD]/20 uppercase tracking-widest"
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
                    <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl border border-[#E5E7EB] shadow-xl z-50 overflow-hidden">
                      <button
                        onClick={() => { setShowKebab(false); navigate(`/crm/talent-pool/${candidateId}/edit`); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-black text-[#374151] hover:bg-[#F9FAFB] transition-colors uppercase tracking-widest"
                      >
                        <Pencil className="w-3.5 h-3.5 text-[#6B7280]" /> Edit
                      </button>
                      <div className="h-px bg-[#F3F4F6]" />
                      <button
                        onClick={() => { setShowKebab(false); }}
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



                <SectionCard title="Professional Details">
                  <div className="grid grid-cols-3 gap-8">
                    <DetailField label="Current Organisation" value={candidate.currentOrg} />
                    <DetailField label="Designation" value={candidate.currentDesignation} />
                    <DetailField label="Notice Period" value={candidate.noticePeriod} />
                    <DetailField label="Total Experience" value={candidate.isFresher ? 'Fresher' : totalExp} />
                    <DetailField label="Highest Qualification" value={candidate.highestQualification} />
                  </div>

                  {candidate.skills?.length ? (
                    <div className="border-t border-[#F3F4F6] mt-6 pt-5">
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map(s => (
                          <span key={s} className="px-3 py-1.5 bg-[#F4F5FA] border border-[#3538CD]/10 text-[#3538CD] text-[11px] font-bold rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </SectionCard>

                {(candidate.currentCtc || candidate.expectedCtc) && (
                  <SectionCard title="Compensation">
                    <div className="grid grid-cols-4 gap-8">
                      <DetailField label="CTC Type" value={candidate.ctcType} />
                      <DetailField label="Currency" value={candidate.ctcCurrency} />
                      <DetailField label="Current CTC" value={candidate.currentCtc} />
                      <DetailField label="Expected CTC" value={candidate.expectedCtc} />
                    </div>
                  </SectionCard>
                )}

                {(candidate.city || candidate.state || candidate.country) && (
                  <SectionCard title="Location">
                    <div className="grid grid-cols-3 gap-8">
                      <DetailField label="City" value={candidate.city} />
                      <DetailField label="State" value={candidate.state} />
                      <DetailField label="Country" value={candidate.country} />
                    </div>
                  </SectionCard>
                )}

                <SectionCard title="Recruiter Notes">
                  {candidate.recruiterNotes ? (
                    <p className="text-sm text-[#374151] leading-relaxed">{candidate.recruiterNotes}</p>
                  ) : (
                    <p className="text-sm text-[#C4C9D4] italic">No notes added yet.</p>
                  )}
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
                        {['#', 'Applied Date', 'Job Title', 'Business Unit', 'Status', 'Actions'].map(h => (
                          <th key={h} className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {candidateApps.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-16 text-center">
                            <CalendarDays className="w-8 h-8 text-[#E5E7EB] mx-auto mb-3" />
                            <p className="text-sm font-bold text-[#9CA3AF]">No applications yet</p>
                            <p className="text-xs text-[#C4C9D4] mt-1">This talent hasn't applied to any role.</p>
                          </td>
                        </tr>
                      ) : candidateApps.map((app, i) => {
                        const job = jobs.find(j => j.id === app.jobId);
                        const st = appStatusStyle[app.status] ?? 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]';
                        return (
                          <tr key={app.id} className="hover:bg-[#F9FAFB] transition-colors">
                            <td className="px-6 py-4 font-bold text-[#9CA3AF]">{i + 1}</td>
                            <td className="px-6 py-4 text-[#374151] font-medium">{formatDate(app.appliedAt)}</td>
                            <td className="px-6 py-4 font-bold text-[#3538CD]">{job?.title || '—'}</td>
                            <td className="px-6 py-4 text-[#374151] font-medium">{job?.businessUnit || '—'}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border ${st}`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button className="text-[#3538CD] font-black text-[11px] hover:underline uppercase tracking-widest">View</button>
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
                    <button
                      onClick={() => setShowInvite(true)}
                      className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-[#3538CD] text-white text-xs font-black rounded-xl hover:bg-[#292bb0] transition-all shadow-md shadow-[#3538CD]/20 uppercase tracking-widest"
                    >
                      <Send className="w-3.5 h-3.5" /> Send First Invite
                    </button>
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
                          {/* Top row — invite info */}
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
                            {/* Resend — only when already resolved */}
                            {!isSent && !isApplied && (
                              <button
                                onClick={() => setShowInvite(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black text-[#3538CD] bg-[#F4F5FA] border border-[#3538CD]/10 rounded-lg hover:bg-[#3538CD]/10 transition-colors uppercase tracking-widest shrink-0"
                              >
                                <Send className="w-3 h-3" /> Resend
                              </button>
                            )}
                          </div>

                          {/* Update Response row — always shown unless Applied */}
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

                          {/* Applied — terminal, no override */}
                          {isApplied && (
                            <div className="px-5 pb-4">
                              <p className="text-[11px] text-[#9CA3AF] italic">
                                Candidate applied — no further action needed on this invite.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}

            {/* ── Notes tab ── */}
            {activeTab === 'Notes' && (
              <SectionCard title="Recruiter Notes">
                {candidate.recruiterNotes ? (
                  <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">{candidate.recruiterNotes}</p>
                ) : (
                  <div className="py-12 flex flex-col items-center gap-2 text-center">
                    <div className="w-10 h-10 bg-[#F4F5FA] rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-[#D1D5DB]" />
                    </div>
                    <p className="text-sm font-bold text-[#9CA3AF]">No notes yet</p>
                    <p className="text-xs text-[#C4C9D4]">Notes about this talent will appear here.</p>
                  </div>
                )}
              </SectionCard>
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
    </>
  );
}
