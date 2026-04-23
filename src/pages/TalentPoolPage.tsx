import { useState } from 'react';
import { Link } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import {
  ChevronDown, Plus, X,
  Eye, Check, Users, UserCheck, Briefcase, GraduationCap
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { Candidate } from '../store/types';
import InviteEmailCompose from '../components/InviteEmailCompose';

// ── Main Page ───────────────────────────────────────────────────────────────
export default function TalentPoolPage() {
  const { candidates, jobs, applications } = useApp();
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
      <CRMLayout breadcrumbs={[{ label: 'Talent Pool' }]}>
        <div className="space-y-6 pt-2">

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            {tpStats.map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[12px] font-medium text-[#6B7280]">{stat.label}</p>
                  <stat.icon className="w-4 h-4 text-[#9CA3AF]" />
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-[#111827]">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>

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
                              <Link to={`/crm/talent-pool/${candidate.id}`} className="p-1.5 text-[#6B7280] hover:text-[#3538CD] hover:bg-white rounded-md shadow-sm border border-transparent hover:border-[#E5E7EB]">
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
