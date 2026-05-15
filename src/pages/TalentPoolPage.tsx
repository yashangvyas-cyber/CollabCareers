import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import {
  ChevronDown, X, Eye, Check, Briefcase, Users, UserCheck,
  GraduationCap, UserPlus, Search, Tag, Activity, ChevronLeft, Pencil, EyeOff,
  Clock, MapPin, Building2, TrendingUp, User, Plus, ArrowUpDown, ArrowUp, ArrowDown, Send,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { Candidate, TalentAvailabilityStatus } from '../store/types';

type CandidateStatus = 'Active' | 'Blacklisted' | 'Discarded' | 'Joined';
import InviteEmailCompose from '../components/InviteEmailCompose';

// ── Sort types ────────────────────────────────────────────────────────────────

type SortKey = 'name' | 'experience' | 'noticePeriod' | 'status' | 'source' | 'recordOwner' | 'lastLoginAt' | 'createdBy' | 'modifiedBy';
type SortDir = 'asc' | 'desc';

// ── Filter types ─────────────────────────────────────────────────────────────

type FilterColumn =
  | 'Availability Status'
  | 'Notice Period'
  | 'Experience'
  | 'Skills'
  | 'Source'
  | 'Location'
  | 'Organisation'
  | 'Designation'
  | 'Record Owner'
  | 'Alumni'
  | 'Added By';

type FilterOperator = 'Is' | 'Contains' | 'Greater Than' | 'Less Than';

type FilterStep = 'closed' | 'menu' | 'field-select' | 'op-select' | 'value-select';

interface PoolFilter {
  id: string;
  column: FilterColumn;
  operator: FilterOperator;
  values: string[];
}

interface ColumnDef {
  key: FilterColumn;
  label: string;
  icon: React.ElementType;
  operators: FilterOperator[];
  values?: string[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const candidateStatusStyle: Record<CandidateStatus, string> = {
  'Active':      'bg-[#EEF4FF] text-[#3538CD] border-[#3538CD]/30',
  'Blacklisted': 'bg-[#EAECF5] text-[#363F72] border-[#363F72]/30',
  'Discarded':   'bg-[#F9FAFB] text-[#344054] border-[#D0D5DD]',
  'Joined':      'bg-[#F8F9FC] text-[#363F72] border-[#D5D9EB]',
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function TalentPoolPage() {
  const { candidates, jobs } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // ── Invite state ──
  const [inviteTarget, setInviteTarget] = useState<Candidate | null>(null);
  const [inviteSent, setInviteSent]     = useState<string | null>(null);
  const [addedToast, setAddedToast]     = useState<string | null>((location.state as any)?.addedName ?? null);

  // ── Tooltip state (fixed-position, bypasses overflow clipping) ──
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const showTooltip = (e: React.MouseEvent, text: string) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTooltip({ text, x: r.left + r.width / 2, y: r.top });
  };

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
  const [columnSearch, setColumnSearch]     = useState('');
  const [pendingCol, setPendingCol]         = useState<FilterColumn | null>(null);
  const [pendingOp, setPendingOp]           = useState<FilterOperator | null>(null);
  const [pendingVals, setPendingVals]       = useState<string[]>([]);
  const [quickSearch, setQuickSearch]       = useState('');
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [sortKey, setSortKey]               = useState<SortKey | null>(null);
  const [sortDir, setSortDir]               = useState<SortDir>('asc');

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
  const talentPool    = candidates.filter(c => c.profileVisibility === 'visible');
  const recordOwners  = Array.from(new Set(talentPool.map(c => c.recordOwner).filter(Boolean) as string[])).sort();

  // Column config
  const COLUMNS: ColumnDef[] = [
    { key: 'Availability Status', label: 'Availability Status', icon: Activity,      operators: ['Is'],                           values: ['Immediate Joiner', 'Serving Notice Period', 'Open to Good Offers', 'Offer in Hand', 'Not Interested'] },
    { key: 'Notice Period',       label: 'Notice Period',       icon: Clock,         operators: ['Is'],                           values: ['Immediate', '15 days', '30 days', '45 days', '60 days', '90 days'] },
    { key: 'Experience',          label: 'Experience (Years)',  icon: TrendingUp,    operators: ['Greater Than', 'Less Than', 'Is'] },
    { key: 'Skills',              label: 'Skills',              icon: Tag,           operators: ['Contains'] },
    { key: 'Source',              label: 'Source',              icon: Search,        operators: ['Is'],                           values: ['LinkedIn', 'Referral', 'Job Fair', 'Direct Approach', 'Naukri', 'Internshala', 'CollabCareers', 'Other'] },
    { key: 'Location',            label: 'Location',            icon: MapPin,        operators: ['Contains'] },
    { key: 'Organisation',        label: 'Organisation',        icon: Building2,     operators: ['Contains'] },
    { key: 'Designation',         label: 'Designation',         icon: Briefcase,     operators: ['Contains'] },
    { key: 'Record Owner',        label: 'Record Owner',        icon: User,          operators: ['Is'],                           values: recordOwners.length ? recordOwners : ['Sarah Chen', 'Michael Park', 'James Wilson', 'Lisa Ray', 'David Kim'] },
    { key: 'Alumni',              label: 'Alumni',              icon: GraduationCap, operators: ['Is'],                           values: ['Yes', 'No'] },
    { key: 'Added By',            label: 'Added By',            icon: UserCheck,     operators: ['Is'],                           values: ['Recruiter Added', 'Self Registered'] },
  ];

  // ── Filter helpers ──
  const pickField = (col: FilterColumn) => {
    const colDef = COLUMNS.find(c => c.key === col)!;
    const existing = activeFilters.find(f => f.column === col);
    setColumnSearch('');
    setPendingCol(col);
    setPendingVals(existing?.values ?? []);
    if (colDef.operators.length === 1) {
      setPendingOp(colDef.operators[0]);
      setFilterStep(colDef.operators[0] === 'Is' ? 'value-select' : 'closed');
    } else {
      setPendingOp(existing?.operator ?? null);
      setFilterStep('op-select');
    }
  };

  const applyFilter = () => {
    if (!pendingCol || !pendingOp) return;
    setActiveFilters(prev => {
      const without = prev.filter(f => f.column !== pendingCol);
      if (pendingVals.length === 0) return without;
      return [...without, { id: `f_${Date.now()}`, column: pendingCol, operator: pendingOp, values: pendingVals }];
    });
    setFilterStep('closed');
    setPendingCol(null);
    setPendingOp(null);
    setPendingVals([]);
  };

  const removeValue = (filterId: string, val: string) => {
    setActiveFilters(prev =>
      prev.map(f => {
        if (f.id !== filterId) return f;
        if (f.operator !== 'Is') return null;
        const next = f.values.filter(v => v !== val);
        return next.length ? { ...f, values: next } : null;
      }).filter(Boolean) as PoolFilter[]
    );
  };

  const clearAll = () => {
    setActiveFilters([]);
    setFilterStep('closed');
    setPendingCol(null);
    setPendingOp(null);
    setPendingVals([]);
    setQuickSearch('');
    setShowQuickSearch(false);
  };

  const hasAnyFilter = activeFilters.length > 0 || quickSearch.trim().length > 0;

  // ── Filtered data ──
  const filteredPool = talentPool.filter(c => {
    if (quickSearch.trim()) {
      const q = quickSearch.toLowerCase();
      const hit =
        `${c.firstName} ${c.lastName} ${c.email} ${c.currentOrg ?? ''} ${c.currentDesignation ?? ''}`.toLowerCase().includes(q) ||
        c.skills?.some(s => s.toLowerCase().includes(q));
      if (!hit) return false;
    }
    // Active look-up filters (AND across columns)
    for (const f of activeFilters) {
      if (f.values.length === 0) continue;
      let match = false;
      const v0 = f.values[0]?.toLowerCase() ?? '';
      switch (f.column) {
        case 'Availability Status':
          match = !!c.availabilityStatus && f.values.includes(c.availabilityStatus); break;
        case 'Notice Period':
          match = !!c.noticePeriod && f.values.includes(c.noticePeriod); break;
        case 'Experience': {
          const yrs = c.isFresher ? 0 : (c.totalExperienceYears ?? undefined);
          if (yrs === undefined) break;
          const n = Number(f.values[0]);
          if (isNaN(n)) break;
          if (f.operator === 'Is') match = yrs === n;
          else if (f.operator === 'Greater Than') match = yrs > n;
          else if (f.operator === 'Less Than') match = yrs < n;
          break;
        }
        case 'Skills':
          match = !!c.skills?.some(s => s.toLowerCase().includes(v0)); break;
        case 'Source':
          match = !!c.source && f.values.includes(c.source); break;
        case 'Location': {
          const loc = (c.city || c.location || '').toLowerCase();
          match = loc.includes(v0); break;
        }
        case 'Organisation':
          match = (c.currentOrg || '').toLowerCase().includes(v0); break;
        case 'Designation':
          match = (c.currentDesignation || '').toLowerCase().includes(v0); break;
        case 'Record Owner':
          match = !!c.recordOwner && f.values.includes(c.recordOwner); break;
        case 'Alumni':
          match = f.values.includes(c.isAlumni ? 'Yes' : 'No'); break;
        case 'Added By':
          match = f.values.includes(c.addedByRecruiter ? 'Recruiter Added' : 'Self Registered'); break;
      }
      if (!match) return false;
    }
    return true;
  });

  // ── Stats ──
  const now = new Date();
  const activeStatuses: TalentAvailabilityStatus[] = ['Immediate Joiner', 'Serving Notice Period', 'Open to Good Offers', 'Offer in Hand'];
  const statCards = [
    {
      label: 'Total Candidates',
      value: talentPool.length,
      action: () => navigate('/crm/talent-pool/add'),
    },
    {
      label: 'Active',
      value: talentPool.filter(c => c.availabilityStatus && activeStatuses.includes(c.availabilityStatus)).length,
    },
    {
      label: 'New This Month',
      value: talentPool.filter(c => {
        if (!c.addedAt) return false;
        const d = new Date(c.addedAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length,
    },
    {
      label: 'Alumni',
      value: talentPool.filter(c => c.isAlumni).length,
    },
    {
      label: 'Blacklisted',
      value: talentPool.filter(c => c.isBlacklisted).length,
    },
  ];

  const handleInviteSent = (name: string) => {
    setInviteTarget(null);
    setInviteSent(name);
    setTimeout(() => setInviteSent(null), 4000);
  };

  // ── Sort helpers ──
  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };
  const noticeDays = (np?: string): number => {
    if (!np) return Infinity;
    if (np === 'Immediate') return 0;
    return parseInt(np) || Infinity;
  };
  const formatExp = (c: Candidate): string => {
    if (c.isFresher) return 'Fresher';
    const y = c.totalExperienceYears; const m = c.totalExperienceMonths;
    if (!y && !m) return '—';
    return [y ? `${y}y` : '', m ? `${m}m` : ''].filter(Boolean).join(' ');
  };
  const SortIcon = ({ sKey }: { sKey: SortKey }) => {
    if (sortKey !== sKey) return <ArrowUpDown className="w-3 h-3 text-[#D1D5DB]" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-[#3538CD]" /> : <ArrowDown className="w-3 h-3 text-[#3538CD]" />;
  };
  const sortedPool = sortKey ? [...filteredPool].sort((a, b) => {
    let av: string | number, bv: string | number;
    switch (sortKey) {
      case 'name':        av = `${a.firstName} ${a.lastName}`.toLowerCase(); bv = `${b.firstName} ${b.lastName}`.toLowerCase(); break;
      case 'experience':  av = a.isFresher ? 0 : (a.totalExperienceYears ?? -1); bv = b.isFresher ? 0 : (b.totalExperienceYears ?? -1); break;
      case 'noticePeriod': av = noticeDays(a.noticePeriod); bv = noticeDays(b.noticePeriod); break;
      case 'status':      av = a.availabilityStatus ?? ''; bv = b.availabilityStatus ?? ''; break;
      case 'source':      av = a.source ?? ''; bv = b.source ?? ''; break;
      case 'recordOwner': av = a.recordOwner ?? ''; bv = b.recordOwner ?? ''; break;
      case 'lastLoginAt': av = a.lastLoginAt ?? ''; bv = b.lastLoginAt ?? ''; break;
      case 'createdBy':   av = a.createdBy ?? ''; bv = b.createdBy ?? ''; break;
      case 'modifiedBy':  av = a.modifiedBy ?? ''; bv = b.modifiedBy ?? ''; break;
      default:            av = ''; bv = '';
    }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  }) : filteredPool;

  // ── Value picker helpers ──
  const pendingColDef  = pendingCol ? COLUMNS.find(c => c.key === pendingCol) : null;
  const pickerValues   = (pendingOp === 'Is' && pendingColDef?.values) ? pendingColDef.values : [];
  const isTextOp       = pendingOp === 'Contains';
  const isNumericOp    = pendingOp === 'Greater Than' || pendingOp === 'Less Than';
  const canApply       = pendingOp === 'Is' ? pendingVals.length > 0 : (pendingVals[0] || '').trim().length > 0;
  const visibleColumns = COLUMNS.filter(c =>
    !columnSearch.trim() || c.label.toLowerCase().includes(columnSearch.toLowerCase())
  );

  return (
    <>
      <CRMLayout breadcrumbs={[{ label: 'Talent Pool' }]}>
        <div className="space-y-6 pt-2">

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4">
            {statCards.map((card, i) => (
              <div key={i} className="bg-white rounded-xl px-5 py-4 flex flex-col border border-[#E5E7EB] shadow-sm min-h-[100px]">
                <p className="text-xs font-medium text-[#6B7280]">{card.label}</p>
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span className="text-2xl font-semibold text-[#111827]">{card.value}</span>
                  {card.action && (
                    <button
                      onClick={card.action}
                      className="p-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                      title="Add Talent"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
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
            <div ref={filterRef} className="relative flex items-stretch gap-2">

              {/* Σ button — opens mode menu */}
              <button
                onClick={() => setFilterStep(prev => prev === 'menu' ? 'closed' : 'menu')}
                className={`flex items-center gap-1 px-2.5 py-2 rounded-xl border text-sm font-black transition-all shrink-0 ${
                  filterStep !== 'closed'
                    ? 'bg-[#3538CD] text-white border-[#3538CD]'
                    : 'bg-[#F9FAFB] text-[#374151] border-[#E5E7EB] hover:border-[#3538CD]/30'
                }`}
              >
                <span className="font-black">Σ</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${filterStep !== 'closed' ? 'rotate-180' : ''}`} />
              </button>

              {/* Chip area */}
              <div className="flex-1 flex items-center gap-1.5 flex-wrap bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 min-h-[42px]">

                {/* Applied filter chips */}
                {activeFilters.map(filter => (
                  <div key={filter.id} className="flex items-center">
                    <button
                      onClick={() => pickField(filter.column)}
                      className="px-2.5 py-1 text-[11px] font-black text-white bg-[#3538CD] rounded-l-lg uppercase tracking-widest hover:bg-[#292bb0] transition-colors"
                    >
                      {filter.column}
                    </button>
                    <span className="px-2 py-1 text-[11px] font-bold text-[#6B7280] bg-[#F9FAFB] border-y border-[#E5E7EB]">
                      {filter.operator}
                    </span>
                    {filter.values.map((val, vi) => (
                      <div
                        key={val}
                        className={`flex items-center gap-1 px-2.5 py-1 bg-[#F4F5FA] border border-[#3538CD]/20 ${vi === filter.values.length - 1 ? 'rounded-r-lg' : ''}`}
                      >
                        <span className="text-[11px] font-bold text-[#3538CD]">{val}</span>
                        <button onClick={() => removeValue(filter.id, val)} className="leading-none">
                          <X className="w-3 h-3 text-[#3538CD] hover:text-red-500 transition-colors" />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}

                {/* In-progress chip */}
                {pendingCol && (
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="px-2.5 py-1 text-[11px] font-black text-white bg-[#3538CD] rounded-lg uppercase tracking-widest">
                      {pendingCol}
                    </span>
                    {pendingOp && (
                      <>
                        <button
                          onClick={() => pendingColDef && pendingColDef.operators.length > 1 && setFilterStep('op-select')}
                          className={`px-2 py-1 text-[11px] font-bold text-[#6B7280] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg transition-colors ${pendingColDef && pendingColDef.operators.length > 1 ? 'hover:bg-[#F3F4F6] cursor-pointer' : 'cursor-default'}`}
                        >
                          {pendingOp}
                        </button>
                        {pendingOp === 'Is' && pendingVals.map(v => (
                          <div key={v} className="flex items-center gap-1 px-2 py-1 bg-[#F4F5FA] border border-[#3538CD]/20 rounded-lg">
                            <span className="text-[11px] font-bold text-[#3538CD]">{v}</span>
                            <button onClick={() => setPendingVals(prev => prev.filter(x => x !== v))} className="leading-none">
                              <X className="w-2.5 h-2.5 text-[#3538CD] hover:text-red-500 transition-colors" />
                            </button>
                          </div>
                        ))}
                        {(isTextOp || isNumericOp) && (
                          <input
                            autoFocus
                            type={isNumericOp ? 'number' : 'text'}
                            min={isNumericOp ? '0' : undefined}
                            value={pendingVals[0] || ''}
                            onChange={e => setPendingVals(e.target.value ? [e.target.value] : [])}
                            placeholder={isNumericOp ? 'Enter years...' : `Type ${pendingCol}...`}
                            className="w-32 px-2 py-1 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#3538CD]"
                            onKeyDown={e => { if (e.key === 'Enter' && canApply) applyFilter(); }}
                          />
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Quick search inline input */}
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

                {/* Placeholder — clicking opens field picker */}
                {!showQuickSearch && !pendingCol && activeFilters.length === 0 && (
                  <button
                    onClick={() => { setColumnSearch(''); setFilterStep('field-select'); }}
                    className="flex-1 text-left text-sm text-[#C4C9D4] select-none cursor-text"
                  >
                    Filter Results...
                  </button>
                )}

                {/* Clear X */}
                {(hasAnyFilter || !!pendingCol) && (
                  <button
                    onClick={clearAll}
                    className="ml-auto p-1 text-[#9CA3AF] hover:text-red-500 transition-colors shrink-0"
                    title="Clear all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter apply button */}
              <button
                onClick={applyFilter}
                disabled={!pendingCol || !canApply}
                className="px-4 py-2 text-sm font-black text-white bg-[#3538CD] rounded-xl hover:bg-[#292bb0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-widest shrink-0"
              >
                Filter
              </button>

              {/* ── Mode menu (Look-up Filter / Quick Search) ── */}
              {filterStep === 'menu' && (
                <div className="absolute top-full left-0 mt-1.5 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 w-52 py-1.5 overflow-hidden">
                  <button
                    onClick={() => { setColumnSearch(''); setFilterStep('field-select'); }}
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

              {/* ── Field select dropdown ── */}
              {filterStep === 'field-select' && (
                <div className="absolute top-full left-0 mt-1.5 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 w-64 overflow-hidden">
                  <div className="p-3 border-b border-[#F3F4F6]">
                    <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2">
                      <Search className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
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
                        onClick={() => pickField(col.key)}
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
                      <p className="px-4 py-4 text-sm text-[#C4C9D4] text-center">No matching fields</p>
                    )}
                  </div>
                </div>
              )}

              {/* ── Operator select dropdown ── */}
              {filterStep === 'op-select' && pendingCol && (
                <div className="absolute top-full left-0 mt-1.5 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 w-56 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#F3F4F6] flex items-center gap-2">
                    <button
                      onClick={() => setFilterStep('field-select')}
                      className="p-0.5 rounded hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#374151] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-black text-[#374151] uppercase tracking-widest flex-1 truncate">{pendingCol}</span>
                  </div>
                  <div className="py-1">
                    {pendingColDef?.operators.map(op => (
                      <button
                        key={op}
                        onClick={() => { setPendingOp(op); setFilterStep(op === 'Is' ? 'value-select' : 'closed'); }}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#F9FAFB] transition-colors text-sm font-bold text-[#374151]"
                      >
                        {op}
                        {pendingOp === op && <Check className="w-4 h-4 text-[#3538CD]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Value picker dropdown (Is operator) ── */}
              {filterStep === 'value-select' && pendingCol && pendingOp === 'Is' && (
                <div className="absolute top-full left-0 mt-1.5 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 w-64 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#F3F4F6] flex items-center gap-2">
                    <button
                      onClick={() => setFilterStep(pendingColDef && pendingColDef.operators.length > 1 ? 'op-select' : 'field-select')}
                      className="p-0.5 rounded hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#374151] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-black text-[#374151] uppercase tracking-widest flex-1 truncate">{pendingCol}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold text-[#6B7280] bg-[#F9FAFB] border border-[#E5E7EB] rounded shrink-0">Is</span>
                  </div>
                  <div className="py-1 max-h-64 overflow-y-auto">
                    {pickerValues.map(val => (
                      <label key={val} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F9FAFB] cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={pendingVals.includes(val)}
                          onChange={() => setPendingVals(prev =>
                            prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
                          )}
                          className="w-4 h-4 accent-[#3538CD] rounded shrink-0"
                        />
                        <span className="text-sm text-[#374151] font-bold">{val}</span>
                      </label>
                    ))}
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
                <table className="w-full text-left border-collapse min-w-[1600px]">
                  <thead>
                    <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                      <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('name')}>
                        <div className="flex items-center gap-1">Name <SortIcon sKey="name" /></div>
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">Contact</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">Current Organization</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('experience')}>
                        <div className="flex items-center gap-1">Experience <SortIcon sKey="experience" /></div>
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('noticePeriod')}>
                        <div className="flex items-center gap-1">Notice Period (Days) <SortIcon sKey="noticePeriod" /></div>
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('status')}>
                        <div className="flex items-center gap-1">Status <SortIcon sKey="status" /></div>
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('source')}>
                        <div className="flex items-center gap-1">Source <SortIcon sKey="source" /></div>
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">Location</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">Skills</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('recordOwner')}>
                        <div className="flex items-center gap-1">Record Owner <SortIcon sKey="recordOwner" /></div>
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('lastLoginAt')}>
                        <div className="flex items-center gap-1">Last Login At <SortIcon sKey="lastLoginAt" /></div>
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('createdBy')}>
                        <div className="flex items-center gap-1">Created By <SortIcon sKey="createdBy" /></div>
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#F3F4F6]" onClick={() => toggleSort('modifiedBy')}>
                        <div className="flex items-center gap-1">Modified By <SortIcon sKey="modifiedBy" /></div>
                      </th>
                      <th className="sticky right-0 z-20 px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap bg-[#F9FAFB] border-l border-[#E5E7EB] shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6]">
                    {sortedPool.map((candidate) => (
                      <tr key={candidate.id} className="hover:bg-[#F9FAFB] transition-colors group">

                        {/* Name */}
                        <td className="px-4 py-4 min-w-[160px]">
                          <p className="text-sm font-semibold text-[#111827] whitespace-nowrap">{candidate.firstName} {candidate.lastName}</p>
                          {candidate.isAlumni && (
                            <span className="inline-block mt-0.5 text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full uppercase tracking-widest">Alumni</span>
                          )}
                        </td>

                        {/* Contact — email above, phone below */}
                        <td className="px-4 py-4 min-w-[180px]">
                          {candidate.allowRecruiterContact ? (
                            <>
                              <p className="text-sm text-[#374151]">{candidate.email}</p>
                              <p className="text-xs text-[#6B7280] mt-0.5">{candidate.phone || '—'}</p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-[#9CA3AF]">••••••@••••••.com</p>
                              <p className="text-xs text-[#9CA3AF] mt-0.5 flex items-center gap-1"><EyeOff className="w-3 h-3" /> hidden</p>
                            </>
                          )}
                        </td>

                        {/* Current Organization — org + designation */}
                        <td className="px-4 py-4 min-w-[160px]">
                          {candidate.currentOrg || candidate.currentDesignation ? (
                            <>
                              <p className="text-sm text-[#374151] font-medium whitespace-nowrap">{candidate.currentOrg || '—'}</p>
                              <p className="text-xs text-[#6B7280] mt-0.5 whitespace-nowrap">{candidate.currentDesignation || '—'}</p>
                            </>
                          ) : <span className="text-sm text-[#9CA3AF]">—</span>}
                        </td>

                        {/* Experience */}
                        <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">{formatExp(candidate)}</td>

                        {/* Notice Period */}
                        <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">{candidate.noticePeriod || '—'}</td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          {candidate.candidateStatus ? (
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border cursor-default ${candidateStatusStyle[candidate.candidateStatus]}`}
                              onMouseEnter={(candidate.candidateStatus === 'Discarded' || candidate.candidateStatus === 'Blacklisted') && candidate.statusReason ? (e) => showTooltip(e, candidate.statusReason!) : undefined}
                              onMouseLeave={() => setTooltip(null)}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                              {candidate.candidateStatus}
                            </span>
                          ) : <span className="text-sm text-[#C4C9D4]">—</span>}
                        </td>

                        {/* Source */}
                        <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">{candidate.source || '—'}</td>

                        {/* Location — City, State */}
                        <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">
                          {[candidate.city, candidate.state].filter(Boolean).join(', ') || candidate.location || '—'}
                        </td>

                        {/* Skills */}
                        <td className="px-4 py-4 min-w-[160px]">
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

                        {/* Record Owner */}
                        <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">{candidate.recordOwner || '—'}</td>

                        {/* Last Login At */}
                        <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">
                          {candidate.lastLoginAt
                            ? new Date(candidate.lastLoginAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : '—'}
                        </td>

                        {/* Created By */}
                        <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">
                          {candidate.createdBy || (candidate.addedByRecruiter ? (candidate.recordOwner || 'Recruiter') : 'Self')}
                        </td>

                        {/* Modified By */}
                        <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">{candidate.modifiedBy || '—'}</td>

                        {/* Actions — frozen right */}
                        <td className="sticky right-0 z-10 px-4 py-4 bg-white group-hover:bg-[#F9FAFB] border-l border-[#E5E7EB] shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)] transition-colors">
                          <div className="flex items-center gap-1">
                            {candidate.allowRecruiterContact && (
                              <button
                                onClick={() => setInviteTarget(candidate)}
                                className="p-1.5 text-[#6B7280] hover:text-[#3538CD] hover:bg-[#F4F5FA] rounded-md border border-transparent hover:border-[#E5E7EB] transition-colors"
                                title="Invite"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            )}
                            <Link
                              to={`/crm/talent-pool/${candidate.id}/edit`}
                              className="p-1.5 text-[#6B7280] hover:text-[#3538CD] hover:bg-[#F4F5FA] rounded-md border border-transparent hover:border-[#E5E7EB] transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/crm/talent-pool/${candidate.id}`}
                              className="p-1.5 text-[#6B7280] hover:text-[#3538CD] hover:bg-[#F4F5FA] rounded-md border border-transparent hover:border-[#E5E7EB] transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
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

      {/* Fixed-position tooltip — renders above overflow-x-auto clipping boundary */}
      {tooltip && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y - 8, transform: 'translate(-50%, -100%)' }}
        >
          <div className="bg-[#1D2939] text-white text-xs px-2.5 py-1.5 rounded-lg shadow-xl max-w-[220px] text-center leading-relaxed break-words">
            {tooltip.text}
          </div>
          <div className="flex justify-center mt-0.5">
            <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#1D2939]" />
          </div>
        </div>
      )}
    </>
  );
}
