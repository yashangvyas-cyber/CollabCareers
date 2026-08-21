/**
 * Multi-entry "Experience Details" repeater — the Career Journey.
 *
 * Lifted from AddTalentPage so the Talent Pool form and the candidate detail
 * RSP share one implementation instead of drifting apart. Behaviour is
 * unchanged: add / remove / reorder cards, and "I currently work here" clears
 * any other current flag, sets To = "Present" and moves that entry to the top.
 *
 * Note `currentOrg` / `currentDesignation` are DERIVED from this list (see
 * deriveCurrent below) — they are never typed independently, or the summary
 * fields desync from the journey.
 */
import { ChevronUp, ChevronDown, Trash2, Plus, CheckCircle } from 'lucide-react';

export interface ExperienceEntry {
  id: number | string;
  company: string;
  designation: string;
  from: string;
  to: string;
  isCurrent: boolean;
  description: string;
}

export const blankExperience = (): ExperienceEntry => ({
  id: Date.now(),
  company: '',
  designation: '',
  from: '',
  to: '',
  isCurrent: false,
  description: '',
});

/** Current org/designation as shown in Professional Details. */
export function deriveCurrent(experiences: ExperienceEntry[]) {
  const cur = experiences.find(e => e.isCurrent) ?? experiences[0];
  return {
    currentOrg: cur?.company || undefined,
    currentDesignation: cur?.designation || undefined,
  };
}

const INPUT =
  'rounded-lg py-2 outline-none placeholder-gray-500 px-3 border border-gray-300 focus:border-indigo-300 focus:shadow-outline-purple bg-white w-full 2xl:h-10 2xl-to-xl:h-9 h-9 2xl:text-sm 2xl-to-xl:text-xs text-xs placeholder:!text-gray-450';
const LABEL = 'text-xs font-medium text-gray-700';
const SELECT =
  'w-full border border-gray-300 bg-white rounded-lg px-3 2xl:h-10 2xl-to-xl:h-9 h-9 2xl:text-sm 2xl-to-xl:text-xs text-xs focus:outline-none focus:border-indigo-300 focus:shadow-outline-purple appearance-none text-[#111827] transition-all';

function MonthYearPicker({ label, value, isLocked, onChange }: {
  label: string; value: string; isLocked?: boolean; onChange: (v: string) => void;
}) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => String(currentYear - i));
  /* Stored values come in two shapes across the seed data: "2019-Feb" and
     "Feb 2022". Parse both so existing records populate the dropdowns instead
     of falling back to the empty "Month" placeholder. Output is normalised to
     "YYYY-Mon". */
  const parse = (v: string): [string, string] => {
    if (!v || v === 'Present') return ['', ''];
    const dash = v.split('-');
    if (dash.length === 2) {
      const [a, b] = dash;
      return /^\d{4}$/.test(a) ? [a, b] : [b, a];
    }
    const space = v.trim().split(/\s+/);
    if (space.length === 2) {
      const [a, b] = space;
      return /^\d{4}$/.test(a) ? [a, b] : [b, a];
    }
    return ['', ''];
  };
  const [year, month] = parse(value);

  if (isLocked) {
    return (
      <div>
        <label className={LABEL}>{label}</label>
        <input type="text" value="Present" disabled className="w-full mt-1.5 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 text-xs cursor-not-allowed" />
      </div>
    );
  }

  return (
    <div>
      <label className={LABEL}>{label}</label>
      <div className="flex gap-2 mt-1.5">
        <div className="relative flex-1">
          <select
            value={month || ''}
            onChange={e => onChange(!year && e.target.value ? `${currentYear}-${e.target.value}` : `${year}-${e.target.value}`)}
            className={SELECT}
          >
            <option value="" disabled>Month</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="relative flex-1">
          <select
            value={year || ''}
            onChange={e => onChange(!month && e.target.value ? `${e.target.value}-Jan` : `${e.target.value}-${month}`)}
            className={SELECT}
          >
            <option value="" disabled>Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

export default function ExperienceRepeater({
  experiences,
  onChange,
  required,
}: {
  experiences: ExperienceEntry[];
  onChange: (next: ExperienceEntry[]) => void;
  required?: boolean;
}) {
  const patch = (i: number, field: keyof ExperienceEntry, value: any) => {
    const next = experiences.map((e, idx) => (idx === i ? { ...e, [field]: value } : e));
    onChange(next);
  };

  const toggleCurrent = (i: number, checked: boolean) => {
    let next = experiences.map(e => ({ ...e }));
    if (checked) {
      // Only one entry can be current; the rest lose the flag and any "Present".
      next.forEach(ex => { ex.isCurrent = false; if (ex.to === 'Present') ex.to = ''; });
      next[i].isCurrent = true;
      next[i].to = 'Present';
      const item = next.splice(i, 1)[0];
      next.unshift(item);
    } else {
      next[i].isCurrent = false;
      next[i].to = '';
    }
    onChange(next);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= experiences.length) return;
    const next = [...experiences];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <label className={LABEL}>Experience Details</label>

      {experiences.map((exp, i) => (
        <div key={exp.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group">
          <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
              className="p-1 text-gray-400 hover:text-indigo-600 rounded transition-colors disabled:opacity-30">
              <ChevronUp className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === experiences.length - 1}
              className="p-1 text-gray-400 hover:text-indigo-600 rounded transition-colors disabled:opacity-30">
              <ChevronDown className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => onChange(experiences.filter((_, idx) => idx !== i))}
              className="p-1 text-error-400 hover:text-error-600 rounded transition-colors ml-2">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3 pr-20">
            <div>
              <label className={LABEL}>Organization {required && <span className="text-error-500 pe-1">*</span>}</label>
              <input required={required} type="text" value={exp.company}
                onChange={e => patch(i, 'company', e.target.value)}
                placeholder="e.g. Acme Corp" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Designation {required && <span className="text-error-500 pe-1">*</span>}</label>
              <input required={required} type="text" value={exp.designation}
                onChange={e => patch(i, 'designation', e.target.value)}
                placeholder="e.g. Developer" className={INPUT} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <MonthYearPicker label="From" value={exp.from} onChange={v => patch(i, 'from', v)} />
            <MonthYearPicker label="To" value={exp.to} isLocked={exp.isCurrent} onChange={v => patch(i, 'to', v)} />
          </div>

          <div className="mb-3">
            <label className="flex items-center gap-2 cursor-pointer w-fit group/chk">
              <div className="relative flex items-center">
                <input type="checkbox" checked={exp.isCurrent}
                  onChange={e => toggleCurrent(i, e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-indigo-600 appearance-none" />
                <div className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${exp.isCurrent ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'}`}>
                  {exp.isCurrent && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700">I currently work here</span>
            </label>
          </div>

          <div>
            <label className={LABEL}>Description</label>
            <textarea rows={2} value={exp.description}
              onChange={e => patch(i, 'description', e.target.value)}
              placeholder="Briefly describe the role..."
              className={`${INPUT} resize-none min-h-[42px] py-2`} />
          </div>
        </div>
      ))}

      <button type="button" onClick={() => onChange([...experiences, blankExperience()])}
        className="flex items-center gap-1.5 text-indigo-600 text-xs font-semibold hover:underline mt-2">
        <Plus className="w-3.5 h-3.5" /> Add Experience
      </button>
    </div>
  );
}
