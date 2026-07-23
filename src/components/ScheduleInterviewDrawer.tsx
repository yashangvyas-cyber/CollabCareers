import { useState } from 'react';
import type { ReactNode } from 'react';
import { X, Info, Plus } from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { ExternalInvite, ExternalInviteContext } from '../store/types';
import { BUSINESS_UNITS } from '../lib/businessUnits';

export interface ScheduleDrawerProps {
  candidateName: string;
  candidateId: string;
  jobTitle: string;
  businessUnit: string;
  evaluationCriteria: string[];
  resumeUrl?: string;
  roundCount: number;
  open: boolean;
  onClose: () => void;
  onScheduled: (msg: string) => void;
}

const ROUND_OPTIONS = ['Technical Round', 'HR Screening', 'Portfolio Review', 'Aptitude Test', 'Culture Fit', 'Final Round'];
const PANEL_OPTIONS = ['Super User', 'Sarah Chen', 'James Wilson', 'Michael Park', 'Lisa Ray', 'David Kim'];
const ONLINE_MEETING_TYPES = ['Telephonic', 'Meeting Link', 'Google Meet', 'Microsoft Teams'];
const DURATIONS = ['15', '30', '45', '60', 'Custom'];

function Label({ children, req }: { children: ReactNode; req?: boolean }) {
  return (
    <label className="block text-[12px] font-semibold text-[#6B7280] mb-1.5">
      {children}{req && <span className="text-red-500"> *</span>}
    </label>
  );
}

export default function ScheduleInterviewDrawer({
  candidateName, candidateId, jobTitle, businessUnit, evaluationCriteria,
  resumeUrl, roundCount, open, onClose, onScheduled,
}: ScheduleDrawerProps) {
  const { addExternalPanelists } = useApp();

  const [schedRound, setSchedRound] = useState('');
  const [schedEvalCriteria, setSchedEvalCriteria] = useState<string[]>([]);
  const [schedPanel, setSchedPanel] = useState<string[]>([]);
  const [schedMode, setSchedMode] = useState<'Online' | 'Offline'>('Online');
  const [schedDate, setSchedDate] = useState('');
  const [schedTime, setSchedTime] = useState('');
  const [schedMeetingType, setSchedMeetingType] = useState('Google Meet');
  const [schedDuration, setSchedDuration] = useState('60');
  const [schedCustomDuration, setSchedCustomDuration] = useState('');
  const [schedAdditionalInfo, setSchedAdditionalInfo] = useState('');
  const [sendEmailCandidate, setSendEmailCandidate] = useState(true);
  const [sendEmailPanel, setSendEmailPanel] = useState(true);
  const [extFirst, setExtFirst] = useState('');

  // Demo helper — one click fills the three fields with a fresh fake panelist.
  const DEMO_PANELISTS = [
    { f: 'Priya', l: 'Raghavan' }, { f: 'Marcus', l: 'Webb' }, { f: 'Sofia', l: 'Lindqvist' },
    { f: 'Kenji', l: 'Watanabe' }, { f: 'Fatima', l: 'Rashid' }, { f: 'Diego', l: 'Moreno' },
    { f: 'Anika', l: 'Bose' }, { f: 'Tomas', l: 'Novak' }, { f: 'Leila', l: 'Haddad' }, { f: 'Owen', l: 'Fletcher' },
  ];
  const fillDemoPanelist = () => {
    const taken = new Set(extPanelists.map(p => p.email.toLowerCase()));
    const pool = DEMO_PANELISTS.filter(p => !taken.has(`${p.f}.${p.l}@external.com`.toLowerCase()));
    const from = pool.length ? pool : DEMO_PANELISTS;
    const pick = from[Math.floor(Math.random() * from.length)];
    setExtFirst(pick.f);
    setExtLast(pick.l);
    setExtEmail(`${pick.f}.${pick.l}@external.com`.toLowerCase());
    setExtError('');
  };
  const [extLast, setExtLast] = useState('');
  const [extEmail, setExtEmail] = useState('');
  const [extPanelists, setExtPanelists] = useState<{ firstName: string; lastName: string; email: string }[]>([]);
  const [extError, setExtError] = useState('');
  const [extEnabled, setExtEnabled] = useState(false);

  const handleAddExtPanelist = () => {
    const firstName = extFirst.trim();
    const lastName = extLast.trim();
    const email = extEmail.trim();
    if (!firstName || !lastName || !email) {
      setExtError('First name, last name and email are all required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setExtError(`"${email}" is not a valid email address.`);
      return;
    }
    if (extPanelists.some(p => p.email.toLowerCase() === email.toLowerCase())) {
      setExtError('This email has already been added.');
      return;
    }
    setExtPanelists(prev => [...prev, { firstName, lastName, email }]);
    setExtFirst(''); setExtLast(''); setExtEmail(''); setExtError('');
  };

  const resetForm = () => {
    setSchedRound(''); setSchedEvalCriteria([]); setSchedPanel([]); setSchedMode('Online');
    setSchedDate(''); setSchedTime(''); setSchedMeetingType('Google Meet');
    setSchedDuration('60'); setSchedCustomDuration(''); setSchedAdditionalInfo('');
    setSendEmailCandidate(true); setSendEmailPanel(true);
    setExtFirst(''); setExtLast(''); setExtEmail(''); setExtPanelists([]); setExtError(''); setExtEnabled(false);
  };

  const handleSubmit = () => {
    const bu = businessUnit || 'MindInventory';
    const buInfo = BUSINESS_UNITS[bu];
    const roundId = `sched-${Date.now()}`;
    const roundNo = roundCount + 1;
    const roundName = schedRound || 'Technical Round';
    const durationMinutes = schedDuration === 'Custom' ? (parseInt(schedCustomDuration) || 60) : parseInt(schedDuration);
    const criteria = schedEvalCriteria.length ? schedEvalCriteria : evaluationCriteria;
    const ctx: ExternalInviteContext = {
      candidateName,
      cvUrl: resumeUrl,
      jobTitle,
      businessUnit: bu,
      roundName,
      mode: schedMode,
      meetingType: schedMode === 'Online' ? schedMeetingType : undefined,
      meetingLink: schedMode === 'Online' ? 'https://meet.google.com/new-link' : undefined,
      venueAddress: schedMode === 'Offline' ? buInfo?.address : undefined,
      interviewDate: schedDate ? new Date(schedDate).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) : 'TBD',
      interviewTime: schedTime || 'TBD',
      durationMinutes,
      timezoneLabel: 'IST (GMT+5:30)',
      evaluationCriteria: criteria,
      interviewPanel: schedPanel,
      scheduledByName: 'Sarah Chen',
      scheduledAt: new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }),
      additionalInfo: schedAdditionalInfo || '-',
      interviewStatus: 'Scheduled',
      panelSuggestion: 'Pending',
    };
    const newInvites: ExternalInvite[] = extPanelists.map((p, i) => ({
      id: `ext-new-${Date.now()}-${i}`,
      email: p.email,
      firstName: p.firstName,
      lastName: p.lastName,
      name: `${p.firstName} ${p.lastName}`,
      accessToken: `ext-new-${Date.now()}-${i}`,
      status: 'Invited' as const,
      candidateId,
      roundId,
      roundNo,
      context: ctx,
      createdAt: new Date().toISOString(),
    }));
    if (newInvites.length > 0) {
      addExternalPanelists(newInvites);
    }
    onScheduled(`Interview "${roundName}" scheduled successfully${newInvites.length > 0 ? `. ${newInvites.length} external panelist(s) invited.` : '.'}`);
    resetForm();
  };

  if (!open) return null;

  const inputCls = 'w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3538CD]/20 focus:border-[#3538CD]';

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[500px] bg-white shadow-2xl z-50 flex flex-col animate-[slideIn_0.3s_ease-out]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">Schedule Interview</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center rounded-full bg-[#EEF4FF] text-[#3538CD] px-2.5 py-0.5 text-xs font-semibold">{candidateName}</span>
              <span className="inline-flex items-center rounded-full bg-[#FDF6E3] text-[#B45309] px-2.5 py-0.5 text-xs font-semibold">{jobTitle}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F9FAFB] transition-colors -mr-1.5">
            <X className="w-5 h-5 text-[#9CA3AF]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Round Name + Evaluation Criteria */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label req>Round Name</Label>
              <select value={schedRound} onChange={e => setSchedRound(e.target.value)} className={`${inputCls} bg-white ${!schedRound ? 'text-[#9CA3AF]' : ''}`}>
                <option value="">Select</option>
                {ROUND_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <Label req>Evaluation Criteria</Label>
              <select value="" onChange={e => { if (e.target.value && !schedEvalCriteria.includes(e.target.value)) setSchedEvalCriteria(c => [...c, e.target.value]); }} className={`${inputCls} bg-white text-[#9CA3AF]`}>
                <option value="">Select</option>
                {evaluationCriteria.filter(c => !schedEvalCriteria.includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {schedEvalCriteria.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {schedEvalCriteria.map(c => (
                    <span key={c} className="inline-flex items-center gap-1 bg-[#F3F4F6] text-[#374151] rounded-md px-2 py-0.5 text-[11px] font-medium">
                      {c}
                      <button onClick={() => setSchedEvalCriteria(prev => prev.filter(x => x !== c))} className="text-[#9CA3AF] hover:text-red-500"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Interview Panel (internal) */}
          <div>
            <Label req>Interview Panel</Label>
            <select value="" onChange={e => { if (e.target.value && !schedPanel.includes(e.target.value)) setSchedPanel(p => [...p, e.target.value]); }} className={`${inputCls} bg-white text-[#9CA3AF]`}>
              <option value="">Select</option>
              {PANEL_OPTIONS.filter(p => !schedPanel.includes(p)).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {schedPanel.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {schedPanel.map(name => (
                  <span key={name} className="inline-flex items-center gap-1 bg-[#F3F4F6] text-[#374151] rounded-md px-2 py-0.5 text-[11px] font-medium">
                    {name}
                    <button onClick={() => setSchedPanel(p => p.filter(n => n !== name))} className="text-[#9CA3AF] hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* External Panelists — the new feature field */}
          <div>
            {/* Heading row — checkbox gate sits inline, right of the label */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <label className="text-[12px] font-semibold text-[#6B7280]">External Panelists</label>
                <span className="group relative inline-flex">
                  <Info className="w-3.5 h-3.5 text-[#9CA3AF] cursor-help" />
                  <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-48 rounded-lg bg-[#111827] text-white text-[11px] leading-relaxed px-2.5 py-1.5 text-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg">
                    Bring in outside experts to help interview this candidate.
                  </span>
                </span>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={extEnabled}
                  onChange={e => {
                    setExtEnabled(e.target.checked);
                    if (!e.target.checked) { setExtFirst(''); setExtLast(''); setExtEmail(''); setExtPanelists([]); setExtError(''); }
                  }}
                  className="w-4 h-4 rounded border-[#D1D5DB] text-[#3538CD] focus:ring-[#3538CD]" />
                <span className="text-xs font-medium text-[#374151]">Invite external panelists</span>
              </label>
            </div>

            {extEnabled && (
              <div className="mt-2.5">
                {/* Structured mini-form — captures first name, last name & email per panelist */}
                <div className="border border-[#E5E7EB] rounded-lg p-2.5 space-y-2 bg-[#FAFAFB]">
                  <div className="grid grid-cols-2 gap-2">
                    <input value={extFirst} onChange={e => { setExtFirst(e.target.value); setExtError(''); }}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddExtPanelist(); } }}
                      placeholder="First name"
                      className="w-full border border-[#E5E7EB] rounded-lg px-2.5 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] bg-white focus:outline-none focus:ring-2 focus:ring-[#3538CD]/20 focus:border-[#3538CD]" />
                    <input value={extLast} onChange={e => { setExtLast(e.target.value); setExtError(''); }}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddExtPanelist(); } }}
                      placeholder="Last name"
                      className="w-full border border-[#E5E7EB] rounded-lg px-2.5 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] bg-white focus:outline-none focus:ring-2 focus:ring-[#3538CD]/20 focus:border-[#3538CD]" />
                  </div>
                  <div className="flex gap-2">
                    <input type="email" value={extEmail} onChange={e => { setExtEmail(e.target.value); setExtError(''); }}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddExtPanelist(); } }}
                      placeholder="Email address"
                      className="flex-1 min-w-0 border border-[#E5E7EB] rounded-lg px-2.5 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] bg-white focus:outline-none focus:ring-2 focus:ring-[#3538CD]/20 focus:border-[#3538CD]" />
                    <button type="button" onClick={handleAddExtPanelist}
                      className="shrink-0 inline-flex items-center gap-1 px-3.5 py-2 bg-[#3538CD] text-white text-xs font-semibold rounded-lg hover:bg-[#2d30b0] transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                  {/* Demo shortcut — fills the three fields with a fresh fake panelist */}
                  <button type="button" onClick={fillDemoPanelist}
                    className="block mt-1.5 text-[11px] font-semibold text-[#3538CD] hover:text-[#2d30b0] transition-colors">
                    ✨ Fill demo data
                  </button>
                </div>
                {extError && <p className="text-[11px] text-red-500 font-medium mt-1">{extError}</p>}
                {extPanelists.length > 0 && (
                  <div className="mt-2">
                    <p className="text-[11px] font-semibold text-[#6B7280] mb-1">{extPanelists.length} panelist{extPanelists.length > 1 ? 's' : ''} added</p>
                    {/* Capped height + own scrollbar — a long list never stretches the drawer */}
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {extPanelists.map(p => (
                        <span key={p.email} className="inline-flex items-center gap-1.5 max-w-full bg-[#EEF4FF] text-[#3538CD] border border-[#C7D2FE] rounded-md pl-2 pr-1 py-1 text-xs font-semibold">
                          <span className="truncate">{p.firstName} {p.lastName} <span className="font-normal text-[#6366F1]">({p.email})</span></span>
                          <button onClick={() => setExtPanelists(prev => prev.filter(x => x.email !== p.email))} className="shrink-0 text-[#6366F1] hover:text-red-500"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interview Mode */}
          <div>
            <Label req>Interview Mode</Label>
            <div className="inline-flex rounded-lg border border-[#E5E7EB] overflow-hidden">
              {(['Offline', 'Online'] as const).map(m => (
                <button key={m} onClick={() => setSchedMode(m)}
                  className={`px-6 py-2 text-sm font-semibold transition-colors ${schedMode === m ? 'bg-[#3538CD] text-white' : 'bg-white text-[#374151] hover:bg-[#F9FAFB]'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label req>Interview Date</Label>
              <input type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <Label req>Interview Time</Label>
              <input type="time" value={schedTime} onChange={e => setSchedTime(e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Online meeting type radios */}
          {schedMode === 'Online' && (
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {ONLINE_MEETING_TYPES.map(mt => (
                <label key={mt} className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="meetingType" checked={schedMeetingType === mt} onChange={() => setSchedMeetingType(mt)}
                    className="w-4 h-4 text-[#3538CD] border-[#D1D5DB] focus:ring-[#3538CD]" />
                  <span className="text-sm text-[#374151]">{mt}</span>
                </label>
              ))}
            </div>
          )}

          {/* Duration segmented */}
          <div>
            <Label req>Interview Duration (Minutes)</Label>
            <div className="inline-flex rounded-lg border border-[#E5E7EB] overflow-hidden divide-x divide-[#E5E7EB]">
              {DURATIONS.map(d => (
                <button key={d} onClick={() => setSchedDuration(d)}
                  className={`px-4 py-2 text-sm font-semibold transition-colors ${schedDuration === d ? 'bg-[#3538CD] text-white' : 'bg-white text-[#374151] hover:bg-[#F9FAFB]'}`}>
                  {d}
                </button>
              ))}
            </div>
            {schedDuration === 'Custom' && (
              <input type="number" min={1} value={schedCustomDuration} onChange={e => setSchedCustomDuration(e.target.value)} placeholder="Enter minutes"
                className={`${inputCls} mt-2 w-40`} />
            )}
          </div>

          {/* Notification callout + email checkboxes */}
          <div className="rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] p-3 space-y-2.5">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-[#1D4ED8]">For future interviews, proceeding will send email notifications to the panel members and the candidate about the upcoming interview.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={sendEmailCandidate} onChange={e => setSendEmailCandidate(e.target.checked)} className="w-4 h-4 rounded border-[#93C5FD] text-[#2563EB] focus:ring-[#2563EB]" />
              <span className="text-xs font-semibold text-[#1E3A8A]">Send email to candidate</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={sendEmailPanel} onChange={e => setSendEmailPanel(e.target.checked)} className="w-4 h-4 rounded border-[#93C5FD] text-[#2563EB] focus:ring-[#2563EB]" />
              <span className="text-xs font-semibold text-[#1E3A8A]">Send email to panel</span>
            </label>
          </div>

          {/* Additional Information */}
          <div>
            <Label>Additional Information</Label>
            <textarea value={schedAdditionalInfo} onChange={e => setSchedAdditionalInfo(e.target.value)} rows={3} placeholder=""
              className={`${inputCls} resize-none`} />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E5E7EB] px-6 py-4 flex justify-start gap-3">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors">Cancel</button>
          <button onClick={handleSubmit}
            className="px-6 py-2 bg-[#3538CD] text-white text-sm font-semibold rounded-lg hover:bg-[#2d30b0] transition-colors">
            Schedule
          </button>
        </div>
      </div>
    </>
  );
}
