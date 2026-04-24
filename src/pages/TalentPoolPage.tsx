import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import {
  ChevronDown, X, Eye, Check, Users, UserCheck, Send, Briefcase,
  GraduationCap, UserPlus, Search, Phone, Tag, Activity, ChevronLeft, Pencil, EyeOff,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { Candidate, TalentAvailabilityStatus } from '../store/types';
import InviteEmailCompose from '../components/InviteEmailCompose';

// ── Filter types ─────────────────────────────────────────────────────────────

type FilterColumn =
  | 'Availability Status'
  | 'Contact Preference'
  | 'Source'
  | 'Business Unit'
  | 'Skills'
  | 'Alumni';

type FilterStep = 'closed' | 'type-select' | 'column-select' | 'value-select';

interface PoolFilter {
  id: string;
  column: FilterColumn;
  values: string[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ACTIVE_APP_STATUSES = new Set([
  'Submitted', 'Under Review', 'Interview in Progress', 'Decision Made', 'Offer Made',
]);

const availabilityStyle: Record<TalentAvailabilityStatus, string> = {
  'Immediate Joiner':      'bg-green-50 text-green-700 border-green-200',
  'Serving Notice Period': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Open to Good Offers':   'bg-blue-50 text-blue-700 border-blue-200',
  'Offer in Hand':         'bg-purple-50 text-purple-700 border-purple-200',
  'Not Interested':        'bg-gray-100 text-gray-500 border-gray-200',
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function TalentPoolPage() {
  const { candidates, jobs, applications, invites } = useApp();
  const location = useLocation();

  // ── Invite state ──
  const [inviteTarget, setInviteTarget] = useState<Candidate | null>(null);
  const [inviteSent, setInviteSent]     = useState<string | null>(null);
  const [addedToast, setAddedToast]     = useState<string | null>((location.state as any)?.addedName ?? null);

  useEffect(() => {
    if (addedToast) {
      const t = setTimeout(() => setAddedToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [addedToast]);

  // ── Filter state ──
  const filterRef    = useRef<HTMLDivElement>(null);
  const [filterStep, setFilterStep]         = useState<FilterStep>('closed');
  const [activeFilters, setActiveFilters]   = useState<PoolFilter[]>([]);
  const [quickSearch, setQuickSearch]       = useState('');
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [columnSearch, setColumnSearch]     = useState('');
  const [pendingCol, setPendingCol]         = useState<FilterColumn | null>(null);
  const [pendingVals, setPendingVals]       = useState<string[]>([]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterStep('closed');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Data ──
  const talentPool   = candidates.filter(c => c.profileVisibility === 'visible');
  const businessUnits = Array.from(new Set(talentPool.map(c => c.businessUnit).filter(Boolean) as string[])).sort();
  const allSkills    = Array.from(new Set(talentPool.flatMap(c => c.skills ?? []))).sort();

  // Column config (values computed from data where needed)
  const COLUMNS: { key: FilterColumn; label: string; icon: React.ElementType; values: string[] }[] = [
    { key: 'Availability Status', label: 'Availability Status', icon: Activity,      values: ['Immediate Joiner', 'Serving Notice Period', 'Open to Good Offers', 'Not Interested', 'Offer in Hand'] },
    { key: 'Contact Preference',  label: 'Contact Preference',  icon: Phone,         values: ['Open to Contact', 'Invite First'] },
    { key: 'Source',              label: 'Source',              icon: Search,        values: ['LinkedIn', 'Referral', 'Job Fair', 'Direct Approach', 'Naukri', 'Internshala', 'CollabCareers', 'Other'] },
    { key: 'Business Unit',       label: 'Business Unit',       icon: Briefcase,     values: businessUnits },
    { key: 'Skills',              label: 'Skills',              icon: Tag,           values: allSkills },
    { key: 'Alumni',              label: 'Alumni',              icon: GraduationCap, values: ['Yes', 'No'] },
  ];

  // ── Filter helpers ──
  const openValuePicker = (col: FilterColumn) => {
    const existing = activeFilters.find(f => f.column === col);
    setPendingCol(col);
    setPendingVals(existing?.values ?? []);
    setFilterStep('value-select');
  };

  const applyFilter = () => {
    if (!pendingCol) return;
    setActiveFilters(prev => {
      const without = prev.filter(f => f.column !== pendingCol);
      if (pendingVals.length === 0) return without;
      return [...without, { id: `f_${Date.now()}`, column: pendingCol, values: pendingVals }];
    });
    setFilterStep('closed');
    setPendingCol(null);
    setPendingVals([]);
  };

  const removeValue = (filterId: string, val: string) => {
    setActiveFilters(prev =>
      prev.map(f => {
        if (f.id !== filterId) return f;
        const next = f.values.filter(v => v !== val);
        return next.length ? { ...f, values: next } : null;
      }).filter(Boolean) as PoolFilter[]
    );
  };

  const clearAll = () => {
    setActiveFilters([]);
    setQuickSearch('');
    setShowQuickSearch(false);
    setFilterStep('closed');
  };

  const hasAnyFilter = activeFilters.length > 0 || quickSearch.trim().length > 0;

  // ── Filtered data ──
  const filteredPool = talentPool.filter(c => {
    // Quick search
    if (quickSearch.trim()) {
      const q = quickSearch.toLowerCase();
      const hit =
        `${c.firstName} ${c.lastName} ${c.email} ${c.currentOrg ?? ''} ${c.currentDesignation ?? ''}`.toLowerCase().includes(q) ||
        c.skills?.some(s => s.toLowerCase().includes(q));
      if (!hit) return false;
    }
    // Active look-up filters (AND across columns, OR within values)
    for (const f of activeFilters) {
      if (f.values.length === 0) continue;
      let match = false;
      switch (f.column) {
        case 'Availability Status':
          match = !!c.availabilityStatus && f.values.includes(c.availabilityStatus); break;
        case 'Contact Preference':
          match = f.values.includes(c.allowRecruiterContact ? 'Open to Contact' : 'Invite First'); break;
        case 'Source':
          match = !!c.source && f.values.includes(c.source); break;
        case 'Business Unit':
          match = !!c.businessUnit && f.values.includes(c.businessUnit); break;
        case 'Skills':
          match = !!c.skills?.some(s => f.values.includes(s)); break;
        case 'Alumni':
          match = f.values.includes(c.isAlumni ? 'Yes' : 'No'); break;
      }
      if (!match) return false;
    }
    return true;
  });

  // ── Stats ──
  const tpStats = [
    { label: 'Talent Pool',      value: talentPool.length,                                                                                        icon: Users },
    { label: 'Available Now',    value: talentPool.filter(c => c.availabilityStatus === 'Immediate Joiner').length,                                       icon: UserCheck },
    { label: 'Invited',          value: invites.filter(i => talentPool.some(c => c.id === i.candidateId)).length,                                  icon: Send },
    { label: 'Alumni',           value: talentPool.filter(c => c.isAlumni).length,                                                                icon: GraduationCap },
  ];

  const handleInviteSent = (name: string) => {
    setInviteTarget(null);
    setInviteSent(name);
    setTimeout(() => setInviteSent(null), 4000);
  };

  // ── Value picker values for current column ──
  const pickerValues = pendingCol ? (COLUMNS.find(c => c.key === pendingCol)?.values ?? []) : [];
  const visibleColumns = COLUMNS.filter(c =>
    !columnSearch.trim() || c.label.toLowerCase().includes(columnSearch.toLowerCase())
  );

  return (
    <>
      <CRMLayout breadcrumbs={[{ label: 'Talent Pool' }]}>
        <div className="space-y-6 pt-2">

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {tpStats.map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[12px] font-medium text-[#6B7280]">{stat.label}</p>
                  <stat.icon className="w-4 h-4 text-[#9CA3AF]" />
                </div>
                <span className="text-3xl font-bold text-[#111827]">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#111827]">Talent Pool</h2>
                <span className="px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280] text-[11px] font-medium rounded-full">
                  {filteredPool.length} of {talentPool.length}
                </span>
              </div>
              <Link
                to="/crm/talent-pool/add"
                className="flex items-center gap-2 px-4 py-2 bg-[#3538CD] text-white text-[12px] font-black rounded-xl hover:bg-[#292bb0] transition-all shadow-md shadow-[#3538CD]/20 uppercase tracking-widest"
              >
                <UserPlus className="w-4 h-4" />
                Add Talent
              </Link>
            </div>

            {/* ── Filter bar ── */}
            <div ref={filterRef} className="relative">
              <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 min-h-[48px] flex-wrap gap-y-1.5">

                {/* Σ button */}
                <button
                  onClick={() => setFilterStep(prev => prev === 'type-select' ? 'closed' : 'type-select')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-sm font-black transition-all shrink-0 ${
                    filterStep !== 'closed'
                      ? 'bg-[#3538CD] text-white border-[#3538CD]'
                      : 'bg-[#F9FAFB] text-[#374151] border-[#E5E7EB] hover:border-[#3538CD]/30'
                  }`}
                >
                  <span className="font-black">Σ</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${filterStep !== 'closed' ? 'rotate-180' : ''}`} />
                </button>

                {/* Active filter chips */}
                {activeFilters.map(filter => (
                  <div key={filter.id} className="flex items-center gap-1 flex-wrap">
                    {/* Column chip — click to re-edit */}
                    <button
                      onClick={() => openValuePicker(filter.column)}
                      className="px-2.5 py-1 text-[11px] font-black text-white bg-[#3538CD] rounded-lg uppercase tracking-widest hover:bg-[#292bb0] transition-colors"
                    >
                      {filter.column}
                    </button>
                    <span className="px-2 py-1 text-[11px] font-bold text-[#6B7280] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                      Is
                    </span>
                    {filter.values.map(val => (
                      <div key={val} className="flex items-center gap-1 px-2.5 py-1 bg-[#F4F5FA] border border-[#3538CD]/20 rounded-lg">
                        <span className="text-[11px] font-bold text-[#3538CD]">{val}</span>
                        <button onClick={() => removeValue(filter.id, val)}>
                          <X className="w-3 h-3 text-[#3538CD] hover:text-red-500 transition-colors" />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}

                {/* Quick search input */}
                {showQuickSearch && (
                  <div className="flex items-center gap-2 flex-1 min-w-40">
                    <Search className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                    <input
                      autoFocus
                      type="text"
                      value={quickSearch}
                      onChange={e => setQuickSearch(e.target.value)}
                      placeholder="Search name, email, skill..."
                      className="flex-1 text-sm focus:outline-none text-[#374151] placeholder:text-[#D1D5DB] bg-transparent"
                    />
                  </div>
                )}

                {/* Placeholder when empty */}
                {!showQuickSearch && activeFilters.length === 0 && (
                  <span className="text-sm text-[#C4C9D4] select-none">No filters applied — use Σ to filter</span>
                )}

                {/* Clear all */}
                {hasAnyFilter && (
                  <button
                    onClick={clearAll}
                    className="ml-auto flex items-center gap-1 text-[11px] font-black text-[#9CA3AF] hover:text-red-500 transition-colors uppercase tracking-widest shrink-0"
                  >
                    <X className="w-3.5 h-3.5" /> Clear all
                  </button>
                )}
              </div>

              {/* ── Type select dropdown ── */}
              {filterStep === 'type-select' && (
                <div className="absolute top-full left-0 mt-1.5 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 w-52 py-1.5 overflow-hidden">
                  <button
                    onClick={() => { setColumnSearch(''); setFilterStep('column-select'); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F9FAFB] transition-colors text-sm font-bold text-[#374151]"
                  >
                    <span className="w-5 text-center font-black text-[#3538CD]">Σ</span>
                    Look-up Filter
                  </button>
                  <div className="h-px bg-[#F3F4F6] mx-3" />
                  <button
                    onClick={() => { setShowQuickSearch(true); setFilterStep('closed'); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F9FAFB] transition-colors text-sm font-bold text-[#374151]"
                  >
                    <Search className="w-4 h-4 text-[#9CA3AF]" />
                    Quick Search
                  </button>
                </div>
              )}

              {/* ── Column picker ── */}
              {filterStep === 'column-select' && (
                <div className="absolute top-full left-0 mt-1.5 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 w-64 overflow-hidden">
                  <div className="p-3 border-b border-[#F3F4F6]">
                    <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2">
                      <span className="font-black text-[#9CA3AF] text-sm shrink-0">Σ</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                      <input
                        autoFocus
                        type="text"
                        value={columnSearch}
                        onChange={e => setColumnSearch(e.target.value)}
                        placeholder="Filter Results..."
                        className="flex-1 text-sm focus:outline-none text-[#374151] placeholder:text-[#9CA3AF] bg-transparent"
                      />
                    </div>
                  </div>
                  <div className="py-1 max-h-72 overflow-y-auto">
                    {visibleColumns.map(col => (
                      <button
                        key={col.key}
                        onClick={() => openValuePicker(col.key)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F9FAFB] transition-colors text-left"
                      >
                        <col.icon className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                        <span className="text-sm text-[#374151] font-bold">{col.label}</span>
                        {activeFilters.find(f => f.column === col.key) && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#3538CD] shrink-0" />
                        )}
                      </button>
                    ))}
                    {visibleColumns.length === 0 && (
                      <p className="px-4 py-4 text-sm text-[#C4C9D4] text-center">No matching columns</p>
                    )}
                  </div>
                </div>
              )}

              {/* ── Value picker ── */}
              {filterStep === 'value-select' && pendingCol && (
                <div className="absolute top-full left-0 mt-1.5 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 w-64 overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-[#F3F4F6] flex items-center gap-2">
                    <button
                      onClick={() => setFilterStep('column-select')}
                      className="p-0.5 rounded hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#374151] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-black text-[#374151] uppercase tracking-widest flex-1 truncate">
                      {pendingCol}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold text-[#6B7280] bg-[#F9FAFB] border border-[#E5E7EB] rounded shrink-0">
                      Is
                    </span>
                  </div>

                  {/* Values */}
                  <div className="py-1 max-h-64 overflow-y-auto">
                    {pickerValues.length === 0 ? (
                      <p className="px-4 py-4 text-sm text-[#C4C9D4] text-center italic">No values available</p>
                    ) : pickerValues.map(val => (
                      <label key={val} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F9FAFB] cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={pendingVals.includes(val)}
                          onChange={() =>
                            setPendingVals(prev =>
                              prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
                            )
                          }
                          className="w-4 h-4 accent-[#3538CD] rounded shrink-0"
                        />
                        <span className="text-sm text-[#374151] font-bold">{val}</span>
                      </label>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-[#F3F4F6] flex gap-2">
                    <button
                      onClick={() => {
                        setActiveFilters(prev => prev.filter(f => f.column !== pendingCol));
                        setPendingVals([]);
                        setFilterStep('closed');
                        setPendingCol(null);
                      }}
                      className="flex-1 py-2 text-xs font-black text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors uppercase tracking-widest"
                    >
                      Clear
                    </button>
                    <button
                      onClick={applyFilter}
                      disabled={pendingVals.length === 0}
                      className="flex-1 py-2 text-xs font-black text-white bg-[#3538CD] rounded-lg hover:bg-[#292bb0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-widest"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-x-auto">
              {filteredPool.length === 0 ? (
                <div className="py-20 text-center">
                  <Users className="w-10 h-10 text-[#E5E7EB] mx-auto mb-3" />
                  <p className="text-sm font-bold text-[#9CA3AF]">
                    {talentPool.length === 0
                      ? 'No candidates have made themselves discoverable yet.'
                      : 'No candidates match your filters.'}
                  </p>
                  {hasAnyFilter && (
                    <button onClick={clearAll} className="mt-3 text-xs font-black text-[#3538CD] hover:underline uppercase tracking-widest">
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                      {['No.', 'Name', 'Contact', 'Organisation', 'Designation', 'Skills', 'Availability', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6]">
                    {filteredPool.map((candidate, idx) => {
                      const isInPipeline = applications.some(
                        a => a.candidateId === candidate.id && ACTIVE_APP_STATUSES.has(a.status)
                      );
                      const hasAnyApp = applications.some(a => a.candidateId === candidate.id);
                      return (
                        <tr key={candidate.id} className="hover:bg-[#F9FAFB] transition-colors group">
                          <td className="px-4 py-4 text-sm text-[#6B7280]">{idx + 1}</td>
                          <td className="px-4 py-4">
                            <p className="text-sm font-semibold text-[#111827]">{candidate.firstName} {candidate.lastName}</p>
                            <p className="text-xs text-[#6B7280]">
                              {candidate.allowRecruiterContact ? candidate.email : '••••••@••••••.com'}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              {candidate.isAlumni && (
                                <span className="text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full uppercase tracking-widest">Alumni</span>
                              )}
                              {isInPipeline && (
                                <span className="text-[9px] font-black text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded-full uppercase tracking-widest">In Pipeline</span>
                              )}
                              {!isInPipeline && hasAnyApp && (
                                <span className="text-[9px] font-black text-[#3538CD] bg-[#F4F5FA] border border-[#3538CD]/10 px-1.5 py-0.5 rounded-full uppercase tracking-widest">Applied</span>
                              )}
                            </div>
                            {!candidate.allowRecruiterContact && (
                              <p className="flex items-center gap-1 text-[10px] text-[#9CA3AF] mt-0.5">
                                <EyeOff className="w-3 h-3" /> Prefers to apply first
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">
                            {candidate.allowRecruiterContact ? (candidate.phone || '—') : '••••• •••••'}
                          </td>
                          <td className="px-4 py-4 text-sm text-[#374151]">{candidate.currentOrg || '—'}</td>
                          <td className="px-4 py-4 text-sm text-[#374151]">{candidate.currentDesignation || '—'}</td>
                          <td className="px-4 py-4">
                            {candidate.skills?.length ? (
                              <div className="flex flex-wrap gap-1">
                                {candidate.skills.slice(0, 3).map(s => (
                                  <span key={s} className="px-2 py-0.5 text-[10px] font-bold bg-[#F4F5FA] text-[#3538CD] border border-[#3538CD]/10 rounded-full whitespace-nowrap">{s}</span>
                                ))}
                                {candidate.skills.length > 3 && (
                                  <span className="px-2 py-0.5 text-[10px] font-bold text-[#9CA3AF] bg-[#F9FAFB] border border-[#E5E7EB] rounded-full">+{candidate.skills.length - 3}</span>
                                )}
                              </div>
                            ) : <span className="text-sm text-[#9CA3AF]">—</span>}
                          </td>
                          <td className="px-4 py-4">
                            {candidate.availabilityStatus ? (
                              <span className={`inline-flex px-2 py-0.5 text-[10px] font-black rounded-full border uppercase tracking-widest whitespace-nowrap ${availabilityStyle[candidate.availabilityStatus]}`}>
                                {candidate.availabilityStatus}
                              </span>
                            ) : (
                              <span className="text-sm text-[#C4C9D4]">—</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                              <div className="flex items-center justify-end gap-2">
                               {candidate.allowRecruiterContact && (
                                 <button
                                   onClick={() => setInviteTarget(candidate)}
                                   className="px-3 py-1.5 text-[11px] font-black text-[#3538CD] border border-[#3538CD]/20 rounded-lg hover:bg-[#3538CD]/5 transition-colors uppercase tracking-widest whitespace-nowrap"
                                 >
                                   Invite
                                 </button>
                               )}
                               <Link
                                 to={`/crm/talent-pool/${candidate.id}/edit`}
                                 className="p-1.5 text-[#6B7280] hover:text-[#3538CD] hover:bg-white rounded-md shadow-sm border border-transparent hover:border-[#E5E7EB]"
                                 title="Edit talent"
                               >
                                 <Pencil className="w-4 h-4" />
                               </Link>
                               <Link
                                 to={`/crm/talent-pool/${candidate.id}`}
                                 className="p-1.5 text-[#6B7280] hover:text-[#3538CD] hover:bg-white rounded-md shadow-sm border border-transparent hover:border-[#E5E7EB]"
                                 title="View talent"
                               >
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

      {inviteTarget && (
        <InviteEmailCompose
          candidate={inviteTarget}
          jobs={jobs}
          onClose={() => setInviteTarget(null)}
          onSent={handleInviteSent}
        />
      )}

      {addedToast && (
        <div className="fixed bottom-6 right-6 z-[200] bg-[#111827] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3">
          <Check className="w-4 h-4 text-green-400 shrink-0" />
          <span className="text-sm font-bold">{addedToast} added to Talent Pool</span>
          <button onClick={() => setAddedToast(null)} className="ml-1 text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {inviteSent && (
        <div className="fixed bottom-16 right-6 z-[200] bg-[#111827] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3">
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
