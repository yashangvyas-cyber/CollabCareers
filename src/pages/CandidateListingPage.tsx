import { useState } from 'react';
import { Link } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import {
  ChevronDown, Plus, X, MoreHorizontal,
  Eye, Edit2, LayoutGrid, Check, Users, UserCheck, Briefcase, GraduationCap,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { Candidate, Job } from '../store/types';

const candidateStats = [
  { label: 'Total Candidates', value: '2497', change: '+12%' },
  { label: 'In Interview Process', value: '183' },
  { label: 'Joining Soon', value: '73' },
  { label: 'Future Candidates', value: '19' },
];

const candidatesData = [
  { no: 1, name: 'Mahesh Patel', email: 'Mahesh@gmail.com', contact: '+91 98765 43210', job: 'React Developer (Open)', experience: '3 yrs', noticePeriod: '30 days', status: 'Active', source: 'CollabCRM', businessUnit: 'Yopmails', recon: '-', isAlumni: true },
  { no: 2, name: 'Priya Shah', email: 'priya@gmail.com', contact: '+91 97654 32109', job: 'UI/UX Designer (Open)', experience: '4 yrs', noticePeriod: '15 days', status: 'Active', source: 'CollabCRM', businessUnit: 'Yopmails', recon: '-', isAlumni: true },
  { no: 3, name: 'Arjun Mehta', email: 'arjun@gmail.com', contact: '+91 96543 21098', job: 'Flutter Developer (Open)', experience: '2 yrs', noticePeriod: 'Immediate joiner', status: 'Active', source: 'CollabCRM', businessUnit: 'Yopmails', recon: '-', isAlumni: false },
  { no: 4, name: 'Sneha Patel', email: 'sneha@gmail.com', contact: '+91 95432 10987', job: 'Business Analyst (Open)', experience: '3 yrs', noticePeriod: '30 days', status: 'Active', source: 'CollabCRM', businessUnit: 'Yopmails', recon: '-', isAlumni: false },
  { no: 5, name: 'Rahul Joshi', email: 'rahul@gmail.com', contact: '+91 94321 09876', job: 'Project Manager (Open)', experience: '6 yrs', noticePeriod: '60 days', status: 'Active', source: 'CollabCRM', businessUnit: 'Yopmails', recon: '-', isAlumni: false },
  { no: 6, name: 'Kavya Rao', email: 'kavya@gmail.com', contact: '+91 93210 98765', job: '2D Artist (Open)', experience: '1 yr', noticePeriod: 'Immediate joiner', status: 'Active', source: 'CollabCRM', businessUnit: 'Yopmails', recon: '-', isAlumni: false },
];

// ── Email Compose View ──────────────────────────────────────────────────────
function InviteEmailCompose({
  candidate,
  jobs,
  onClose,
  onSent,
}: {
  candidate: Candidate;
  jobs: Job[];
  onClose: () => void;
  onSent: (name: string) => void;
}) {
  const [jobId, setJobId] = useState('');
  const [ccEmails, setCcEmails] = useState<string[]>([]);
  const [ccInput, setCcInput] = useState('');
  const [bccInput, setBccInput] = useState('');

  const openJobs = jobs.filter(j => j.status === 'Open');
  const selectedJob = jobId ? jobs.find(j => j.id === jobId) : null;
  const subject = selectedJob
    ? `Invitation to Apply — ${selectedJob.title} at ${selectedJob.businessUnit}`
    : '';

  const addCc = () => {
    if (ccInput.trim()) {
      setCcEmails(prev => [...prev, ccInput.trim()]);
      setCcInput('');
    }
  };

  const handleSend = () => {
    onClose();
    onSent(candidate.firstName);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#F3F4F6] flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-3.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <span
            className="hover:text-[#3538CD] cursor-pointer transition-colors"
            onClick={onClose}
          >
            Talent Pool
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#111827] font-semibold">Invite to Apply</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled={!jobId}
            onClick={handleSend}
            className="px-5 py-2 bg-[#3538CD] text-white text-[11px] font-black rounded-lg hover:bg-[#292bb0] disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-widest transition-all shadow-md shadow-[#3538CD]/20 flex items-center gap-2"
          >
            <Check className="w-3.5 h-3.5" /> Send Invite
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors text-[#6B7280]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto py-8 px-6">
        <div className="max-w-3xl mx-auto space-y-4">

          {/* Compose fields */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm divide-y divide-[#F3F4F6] overflow-hidden">

            {/* From */}
            <div className="flex items-center gap-4 px-6 py-3">
              <span className="text-sm text-[#9CA3AF] w-16 shrink-0 font-medium">From</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#374151]">CollabCareers – Yopmails</span>
                <span className="text-xs text-[#9CA3AF]">&lt;noreply@yopmails.com&gt;</span>
              </div>
            </div>

            {/* Send To */}
            <div className="flex items-center gap-4 px-6 py-3">
              <span className="text-sm text-[#9CA3AF] w-16 shrink-0 font-medium">Send To</span>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F4F5FA] rounded-lg text-sm border border-[#E5E7EB]">
                  <span className="w-5 h-5 bg-[#3538CD] text-white rounded text-[10px] font-black flex items-center justify-center shrink-0">
                    {candidate.firstName[0]}
                  </span>
                  <span className="text-[#374151] font-medium">{candidate.email}</span>
                </div>
                <button className="w-6 h-6 flex items-center justify-center border border-[#E5E7EB] rounded-md text-[#9CA3AF] hover:text-[#3538CD] hover:border-[#3538CD]/40 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cc */}
            <div className="flex items-center gap-4 px-6 py-3">
              <span className="text-sm text-[#9CA3AF] w-16 shrink-0 font-medium">Cc</span>
              <div className="flex items-center gap-2 flex-wrap flex-1">
                {ccEmails.map((email, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F4F5FA] rounded-lg text-sm border border-[#E5E7EB]">
                    <span className="w-5 h-5 bg-[#6B7280] text-white rounded text-[10px] font-black flex items-center justify-center shrink-0">
                      {email[0].toUpperCase()}
                    </span>
                    <span className="text-[#374151] font-medium">{email}</span>
                    <button onClick={() => setCcEmails(ccEmails.filter((_, j) => j !== i))}>
                      <X className="w-3 h-3 text-[#9CA3AF] hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={ccInput}
                  onChange={e => setCcInput(e.target.value)}
                  onKeyDown={e => { if ((e.key === 'Enter' || e.key === ',') && ccInput.trim()) { e.preventDefault(); addCc(); } }}
                  onBlur={addCc}
                  placeholder="Type email and press enter..."
                  className="text-sm flex-1 focus:outline-none placeholder:text-[#D1D5DB] min-w-40"
                />
              </div>
            </div>

            {/* Bcc */}
            <div className="flex items-center gap-4 px-6 py-3">
              <span className="text-sm text-[#9CA3AF] w-16 shrink-0 font-medium">Bcc</span>
              <input
                type="text"
                value={bccInput}
                onChange={e => setBccInput(e.target.value)}
                placeholder="Type email and press enter..."
                className="text-sm flex-1 focus:outline-none placeholder:text-[#D1D5DB]"
              />
            </div>

            {/* Job selector */}
            <div className="flex items-center gap-4 px-6 py-3">
              <span className="text-sm text-[#9CA3AF] w-16 shrink-0 font-medium">Job</span>
              <select
                value={jobId}
                onChange={e => setJobId(e.target.value)}
                className="text-sm text-[#374151] font-medium focus:outline-none bg-transparent flex-1 cursor-pointer"
              >
                <option value="">Select a job to invite for...</option>
                {openJobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title} — {j.businessUnit}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="flex items-center gap-4 px-6 py-3">
              <span className="text-sm text-[#9CA3AF] w-16 shrink-0 font-medium">Subject</span>
              <span className={`text-sm ${subject ? 'text-[#374151] font-medium' : 'text-[#D1D5DB]'}`}>
                {subject || 'Subject will be generated after selecting a job'}
              </span>
            </div>
          </div>

          {/* Email body preview */}
          <div className="bg-[#E5E7EB] rounded-xl p-5">
            <div className="bg-white rounded-xl max-w-2xl mx-auto shadow-sm border border-[#E5E7EB] overflow-hidden">

              {/* Email chrome header */}
              <div className="px-8 py-5 border-b border-[#F3F4F6] flex items-center justify-between">
                <h2 className="text-lg font-black text-[#3538CD]">Invitation to Apply</h2>
                <span className="text-sm font-black text-[#111827] tracking-tight">CollabCRM</span>
              </div>

              {/* Email body */}
              <div className="px-8 py-6 space-y-4 text-sm text-[#374151] leading-relaxed">
                <p>Hi <strong>{candidate.firstName} {candidate.lastName}</strong>,</p>

                <p>
                  We came across your profile on the CollabCareers portal
                  {candidate.currentDesignation
                    ? <> and were impressed by your experience as <strong>{candidate.currentDesignation}</strong>{candidate.currentOrg ? <> at <strong>{candidate.currentOrg}</strong></> : null}</>
                    : null
                  }.
                </p>

                <p>We would like to invite you to apply for the following position:</p>

                {selectedJob ? (
                  <table className="w-full border border-[#E5E7EB] rounded-lg overflow-hidden text-sm border-collapse">
                    <tbody>
                      {[
                        ['Job Title', selectedJob.title],
                        ['Department', selectedJob.businessUnit],
                        ['Location', selectedJob.location],
                        ['Employment Type', selectedJob.employmentType],
                        ['Experience', selectedJob.experience],
                      ].map(([label, value]) => (
                        <tr key={label} className="border-b border-[#F3F4F6] last:border-0">
                          <td className="px-4 py-2.5 text-[#6B7280] font-medium w-2/5 bg-[#F9FAFB]">{label}</td>
                          <td className="px-4 py-2.5 font-bold text-[#111827]">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="bg-[#F9FAFB] border border-dashed border-[#D1D5DB] rounded-lg p-6 text-center text-[#9CA3AF] text-xs">
                    Select a job above to preview the job details here
                  </div>
                )}

                <p>To apply for this position, please click the button below:</p>

                <div className="text-center py-2">
                  <span className="inline-block px-8 py-3 bg-[#3538CD] text-white font-black text-sm rounded-xl cursor-pointer">
                    Apply Now →
                  </span>
                </div>

                <p className="text-[#6B7280]">
                  If you have any questions about the role or the application process, feel free to reply to this email.
                </p>

                <p className="text-[#6B7280] text-xs">
                  We request you to add <span className="text-[#3538CD] font-medium">noreply@yopmails.com</span> to your whitelist so you can receive timely updates.
                </p>

                <div className="pt-4 border-t border-[#F3F4F6]">
                  <p>Regards,</p>
                  <p className="font-bold">HR Team</p>
                  <p className="text-[#9CA3AF]">Yopmails</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function CandidateListingPage() {
  const { candidates, jobs, applications } = useApp();
  const [activeTab, setActiveTab] = useState<'candidates' | 'talent-pool'>('candidates');
  const [inviteTarget, setInviteTarget] = useState<Candidate | null>(null);
  const [inviteSent, setInviteSent] = useState<string | null>(null);
  const [tpSearch, setTpSearch] = useState('');
  const [tpNoticePeriod, setTpNoticePeriod] = useState('');

  const talentPool = candidates.filter(c => c.profileVisibility === 'visible');

  const filteredPool = talentPool.filter(c => {
    const matchSearch = !tpSearch ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(tpSearch.toLowerCase()) ||
      c.currentOrg?.toLowerCase().includes(tpSearch.toLowerCase()) ||
      c.currentDesignation?.toLowerCase().includes(tpSearch.toLowerCase()) ||
      c.skills?.some(s => s.toLowerCase().includes(tpSearch.toLowerCase()));
    const matchNotice = !tpNoticePeriod || c.noticePeriod === tpNoticePeriod;
    return matchSearch && matchNotice;
  });

  const tpStats = [
    { label: 'Talent Pool', value: String(talentPool.length), icon: Users },
    { label: 'Open to Contact', value: String(talentPool.filter(c => c.allowRecruiterContact).length), icon: UserCheck },
    { label: 'With Applications', value: String(talentPool.filter(c => applications.some(a => a.candidateId === c.id)).length), icon: Briefcase },
    { label: 'Alumni', value: String(talentPool.filter(c => c.isAlumni).length), icon: GraduationCap },
  ];

  const hasActiveFilters = !!(tpSearch || tpNoticePeriod);

  const handleInviteSent = (name: string) => {
    setInviteTarget(null);
    setInviteSent(name);
    setTimeout(() => setInviteSent(null), 4000);
  };

  return (
    <>
      <CRMLayout breadcrumbs={[{ label: 'Candidates' }]}>
        <div className="space-y-6 pt-2">

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            {(activeTab === 'candidates' ? candidateStats : tpStats).map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[12px] font-medium text-[#6B7280]">{stat.label}</p>
                  {activeTab === 'talent-pool' && 'icon' in stat && <stat.icon className="w-4 h-4 text-[#9CA3AF]" />}
                  {activeTab === 'candidates' && i === 0 && (
                    <div className="w-8 h-8 bg-[#3538CD]/5 rounded-lg flex items-center justify-center text-[#3538CD] cursor-pointer hover:bg-[#3538CD]/10 transition-colors">
                      <Plus className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-[#111827]">{stat.value}</span>
                  {'change' in stat && stat.change && <span className="text-xs font-bold text-green-500">{stat.change}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-[#F4F5FA] p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('candidates')}
              className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'candidates' ? 'bg-white text-[#3538CD] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'}`}
            >
              Candidates
            </button>
            <button
              onClick={() => setActiveTab('talent-pool')}
              className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 ${activeTab === 'talent-pool' ? 'bg-white text-[#3538CD] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'}`}
            >
              Talent Pool
              {talentPool.length > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'talent-pool' ? 'bg-[#3538CD] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {talentPool.length}
                </span>
              )}
            </button>
          </div>

          {/* ── Candidates Tab ── */}
          {activeTab === 'candidates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#111827]">Candidates</h2>
                  <span className="px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280] text-[11px] font-medium rounded-full">1 - 10 of 712 Candidates</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="bg-[#3538CD] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#292bb0] transition-colors">Add Candidate</button>
                  <button className="p-2 border border-[#E5E7EB] rounded-lg text-[#6B7280] hover:bg-[#F9FAFB]"><LayoutGrid className="w-4 h-4" /></button>
                  <button className="p-2 border border-[#E5E7EB] rounded-lg text-[#6B7280] hover:bg-[#F9FAFB]"><MoreHorizontal className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 min-h-[44px]">
                  <div className="flex items-center gap-1 px-2 py-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[12px]"><span className="text-[#9CA3AF]">∑</span><ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" /></div>
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-md text-[12px]"><Plus className="w-3.5 h-3.5 text-[#3538CD]" /><span className="text-[#374151] font-medium">Job Status</span><span className="text-[#9CA3AF]">Is</span><span className="text-[#374151]">Open</span><X className="w-3 h-3 text-[#9CA3AF] cursor-pointer hover:text-red-500" /></div>
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-md text-[12px]"><Plus className="w-3.5 h-3.5 text-[#3538CD]" /><span className="text-[#374151] font-medium">Candidate Status</span><span className="text-[#9CA3AF]">Is</span><span className="text-[#374151]">Active</span><X className="w-3 h-3 text-[#9CA3AF] cursor-pointer hover:text-red-500" /></div>
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#3538CD]/30 rounded-md text-[12px]"><Plus className="w-3.5 h-3.5 text-[#3538CD]" /><span className="text-[#3538CD] font-semibold">Source</span><span className="text-[#9CA3AF]">Is</span><span className="text-[#3538CD] font-semibold">CollabCRM</span><X className="w-3 h-3 text-[#3538CD] cursor-pointer" /></div>
                  <div className="w-7 h-7 flex items-center justify-center text-[#3538CD] bg-[#F4F5FA] rounded-md cursor-pointer"><Plus className="w-4 h-4" /></div>
                  <div className="ml-auto flex items-center gap-2">
                    <X className="w-4 h-4 text-[#9CA3AF] cursor-pointer" /><div className="w-[1px] h-4 bg-[#E5E7EB]" /><button className="text-[12px] font-semibold text-[#3538CD] px-3 py-1 hover:bg-[#F4F5FA] rounded-md">Filter</button>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                      {['No.', 'Name', 'Contact Number', 'Applied Job', 'Experience', 'Notice Period', 'Interview Date', 'Status', 'Source', 'Business Unit', 'Recon', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6]">
                    {candidatesData.map((c) => (
                      <tr key={c.no} className="hover:bg-[#F9FAFB] transition-colors group">
                        <td className="px-4 py-4 text-sm text-[#6B7280]">{c.no}</td>
                        <td className="px-4 py-4"><p className="text-sm font-semibold text-[#111827]">{c.name}</p><p className="text-xs text-[#6B7280]">{c.email}</p>{c.isAlumni && <p className="text-[10px] text-amber-600 font-bold">Verified Alumni</p>}</td>
                        <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">{c.contact}</td>
                        <td className="px-4 py-4 text-sm"><span className="text-[#3538CD] font-medium">{c.job}</span></td>
                        <td className="px-4 py-4 text-sm text-[#374151]">{c.experience}</td>
                        <td className="px-4 py-4 text-sm text-[#374151]">{c.noticePeriod}</td>
                        <td className="px-4 py-4"><button className="px-3 py-1.5 bg-[#F4F5FA] text-[#3538CD] text-[12px] font-bold rounded-md hover:bg-[#3538CD]/10 transition-colors">Schedule</button></td>
                        <td className="px-4 py-4 whitespace-nowrap"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#3538CD]/20 rounded-full text-[12px] font-semibold text-[#3538CD]"><span className="w-1.5 h-1.5 rounded-full bg-[#3538CD]" />{c.status}</span></td>
                        <td className="px-4 py-4"><span className="inline-flex px-2.5 py-1 bg-[#F4F5FA] text-[#3538CD] text-[11px] font-bold rounded-md border border-[#3538CD]/10">{c.source}</span></td>
                        <td className="px-4 py-4 text-sm text-[#374151]">{c.businessUnit}</td>
                        <td className="px-4 py-4 text-sm text-[#374151]">{c.recon}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/crm/candidates/${c.no}`} className="p-1.5 text-[#6B7280] hover:text-[#3538CD] hover:bg-white rounded-md shadow-sm border border-transparent hover:border-[#E5E7EB]"><Eye className="w-4 h-4" /></Link>
                            <button className="p-1.5 text-[#6B7280] hover:text-[#3538CD] hover:bg-white rounded-md shadow-sm border border-transparent hover:border-[#E5E7EB]"><Edit2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]/50">
                  <div className="flex items-center gap-2"><span className="text-xs text-[#6B7280]">Records Per Page</span><div className="flex items-center gap-1 px-2 py-1 bg-white border border-[#E5E7EB] rounded-md text-xs cursor-pointer">10 <ChevronDown className="w-3 h-3 text-[#9CA3AF]" /></div></div>
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
          )}

          {/* ── Talent Pool Tab ── */}
          {activeTab === 'talent-pool' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#111827]">Talent Pool</h2>
                  <span className="px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280] text-[11px] font-medium rounded-full">{filteredPool.length} of {talentPool.length} candidates</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 min-h-[44px]">
                  <div className="flex items-center gap-1 px-2 py-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[12px]"><span className="text-[#9CA3AF]">∑</span><ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" /></div>
                  {tpNoticePeriod && (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#3538CD]/30 rounded-md text-[12px]">
                      <Plus className="w-3.5 h-3.5 text-[#3538CD]" />
                      <span className="text-[#3538CD] font-semibold">Notice Period</span>
                      <span className="text-[#9CA3AF]">Is</span>
                      <span className="text-[#3538CD] font-semibold">{tpNoticePeriod}</span>
                      <X className="w-3 h-3 text-[#3538CD] cursor-pointer hover:text-red-500" onClick={() => setTpNoticePeriod('')} />
                    </div>
                  )}
                  <div className="w-7 h-7 flex items-center justify-center text-[#3538CD] bg-[#F4F5FA] rounded-md cursor-pointer"><Plus className="w-4 h-4" /></div>
                  <div className="ml-auto flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search name, org, skill..."
                      value={tpSearch}
                      onChange={e => setTpSearch(e.target.value)}
                      className="text-[12px] border border-[#E5E7EB] rounded-md px-3 py-1.5 focus:outline-none focus:border-[#3538CD] w-52"
                    />
                    {hasActiveFilters && (
                      <>
                        <X className="w-4 h-4 text-[#9CA3AF] cursor-pointer hover:text-red-500" onClick={() => { setTpSearch(''); setTpNoticePeriod(''); }} />
                        <div className="w-[1px] h-4 bg-[#E5E7EB]" />
                      </>
                    )}
                    <button className="text-[12px] font-semibold text-[#3538CD] px-3 py-1 hover:bg-[#F4F5FA] rounded-md">Filter</button>
                  </div>
                </div>
                <select
                  value={tpNoticePeriod}
                  onChange={e => setTpNoticePeriod(e.target.value)}
                  className="py-2 px-3 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3538CD]/10 focus:border-[#3538CD] text-[#374151]"
                >
                  <option value="">All Notice Periods</option>
                  <option value="Immediate">Immediate</option>
                  <option value="15 days">15 days</option>
                  <option value="30 days">30 days</option>
                  <option value="45 days">45 days</option>
                  <option value="60 days">60 days</option>
                  <option value="90 days">90 days</option>
                </select>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-x-auto">
                {filteredPool.length === 0 ? (
                  <div className="py-20 text-center">
                    <Users className="w-10 h-10 text-[#E5E7EB] mx-auto mb-3" />
                    <p className="text-sm font-bold text-[#9CA3AF]">
                      {talentPool.length === 0 ? 'No candidates have made themselves discoverable yet.' : 'No candidates match your filters.'}
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                        {['No.', 'Name', 'Contact', 'Organisation', 'Designation', 'Skills', 'Notice Period', 'Actions'].map(h => (
                          <th key={h} className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3F4F6]">
                      {filteredPool.map((candidate, idx) => {
                        const hasApp = applications.some(a => a.candidateId === candidate.id);
                        return (
                          <tr key={candidate.id} className="hover:bg-[#F9FAFB] transition-colors group">
                            <td className="px-4 py-4 text-sm text-[#6B7280]">{idx + 1}</td>
                            <td className="px-4 py-4">
                              <p className="text-sm font-semibold text-[#111827]">{candidate.firstName} {candidate.lastName}</p>
                              <p className="text-xs text-[#6B7280]">{candidate.email}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {candidate.isAlumni && <span className="text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full uppercase tracking-widest">Alumni</span>}
                                {hasApp && <span className="text-[9px] font-black text-[#3538CD] bg-[#F4F5FA] border border-[#3538CD]/10 px-1.5 py-0.5 rounded-full uppercase tracking-widest">Applied</span>}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">{candidate.phone || '—'}</td>
                            <td className="px-4 py-4 text-sm text-[#374151]">{candidate.currentOrg || '—'}</td>
                            <td className="px-4 py-4 text-sm text-[#374151]">{candidate.currentDesignation || '—'}</td>
                            <td className="px-4 py-4">
                              {candidate.skills?.length ? (
                                <div className="flex flex-wrap gap-1">
                                  {candidate.skills.slice(0, 3).map(s => (
                                    <span key={s} className="px-2 py-0.5 text-[10px] font-bold bg-[#F4F5FA] text-[#3538CD] border border-[#3538CD]/10 rounded-full whitespace-nowrap">{s}</span>
                                  ))}
                                  {candidate.skills.length > 3 && <span className="px-2 py-0.5 text-[10px] font-bold text-[#9CA3AF] bg-[#F9FAFB] border border-[#E5E7EB] rounded-full">+{candidate.skills.length - 3}</span>}
                                </div>
                              ) : <span className="text-sm text-[#9CA3AF]">—</span>}
                            </td>
                            <td className="px-4 py-4 text-sm text-[#374151]">{candidate.noticePeriod || '—'}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setInviteTarget(candidate)}
                                  className="px-3 py-1.5 text-[11px] font-black text-[#3538CD] border border-[#3538CD]/20 rounded-lg hover:bg-[#3538CD]/5 transition-colors uppercase tracking-widest whitespace-nowrap"
                                >
                                  Invite
                                </button>
                                <Link to={`/crm/candidates/${candidate.id}`} className="p-1.5 text-[#6B7280] hover:text-[#3538CD] hover:bg-white rounded-md shadow-sm border border-transparent hover:border-[#E5E7EB]">
                                  <Eye className="w-4 h-4" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </CRMLayout>

      {/* Full-screen email compose overlay */}
      {inviteTarget && (
        <InviteEmailCompose
          candidate={inviteTarget}
          jobs={jobs}
          onClose={() => setInviteTarget(null)}
          onSent={handleInviteSent}
        />
      )}

      {/* Toast */}
      {inviteSent && (
        <div className="fixed bottom-6 right-6 z-[200] bg-[#111827] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
          <Check className="w-4 h-4 text-green-400 shrink-0" />
          <span className="text-sm font-bold">Invite sent to {inviteSent}</span>
          <button onClick={() => setInviteSent(null)} className="ml-1 text-white/40 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
        </div>
      )}
    </>
  );
}
