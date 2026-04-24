import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import { Upload, X, Check, UserPlus } from 'lucide-react';
import { useApp } from '../store/AppContext';

const SOURCES = ['LinkedIn', 'Referral', 'Job Fair', 'Direct Approach', 'Naukri', 'Internshala', 'Other'];
const CTC_TYPES = ['Annual', 'Monthly'];
const CURRENCIES = ['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)', 'AED (د.إ)'];
const NOTICE_OPTIONS = ['Immediate', '15 days', '30 days', '45 days', '60 days', '90 days'];
const INDIA_STATES = ['Gujarat', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Rajasthan', 'Telangana', 'West Bengal', 'Uttar Pradesh', 'Punjab'];

const inputCls = 'w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#3538CD]/15 focus:border-[#3538CD] bg-white placeholder:text-[#C4C9D4] transition-all';
const selectCls = `${inputCls} cursor-pointer`;
const labelCls = 'block text-[11px] font-black text-[#6B7280] uppercase tracking-widest mb-1.5';
const requiredMark = <span className="text-red-500 ml-0.5">*</span>;

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}{required && requiredMark}</label>
      {children}
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[220px_1fr] gap-10 items-start">
      <div className="pt-1">
        <p className="text-sm font-black text-[#111827] leading-snug">{title}</p>
        <p className="text-xs text-[#9CA3AF] mt-1.5 leading-relaxed">{hint}</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 space-y-4">
        {children}
      </div>
    </div>
  );
}

export default function AddTalentPage() {
  const navigate = useNavigate();
  const { jobs, addCandidate } = useApp();

  const businessUnits = Array.from(new Set(jobs.map(j => j.businessUnit))).filter(Boolean);

  const [form, setForm] = useState({
    businessUnit: '',
    recordOwner: '',
    source: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    linkedin: '',
    resumeFile: '',
    resumeLink: '',
    isFresher: false,
    expYears: '',
    expMonths: '',
    currentOrg: '',
    currentDesignation: '',
    noticePeriod: '',
    skills: [] as string[],
    recruiterNotes: '',
    ctcType: '',
    currentCtc: '',
    expectedCtc: '',
    ctcCurrency: '',
    city: '',
    state: '',
    country: 'India',
    allowRecruiterContact: true,
  });

  const [skillInput, setSkillInput] = useState('');

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

  const addSkill = (raw: string) => {
    const s = raw.replace(/,/g, '').trim();
    if (s && !form.skills.includes(s)) set('skills', [...form.skills, s]);
    setSkillInput('');
  };

  const removeSkill = (i: number) => set('skills', form.skills.filter((_, j) => j !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCandidate({
      id: `tp_${Date.now()}`,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      isAlumni: false,
      profileVisibility: 'visible',
      allowRecruiterContact: form.allowRecruiterContact,
      skills: form.skills,
      noticePeriod: form.noticePeriod || undefined,
      currentOrg: form.currentOrg.trim() || undefined,
      currentDesignation: form.currentDesignation.trim() || undefined,
      location: form.city && form.country ? `${form.city}, ${form.country}` : form.city || form.country || undefined,
      linkedin: form.linkedin.trim() || undefined,
      resumeUrl: form.resumeFile || undefined,
      resumeLink: form.resumeLink.trim() || undefined,
      isFresher: form.isFresher,
      totalExperienceYears: form.expYears ? Number(form.expYears) : undefined,
      totalExperienceMonths: form.expMonths ? Number(form.expMonths) : undefined,
      currentCtc: form.currentCtc.trim() || undefined,
      expectedCtc: form.expectedCtc.trim() || undefined,
      ctcType: form.ctcType || undefined,
      ctcCurrency: form.ctcCurrency || undefined,
      city: form.city.trim() || undefined,
      state: form.state || undefined,
      country: form.country || undefined,
      source: form.source || undefined,
      recruiterNotes: form.recruiterNotes.trim() || undefined,
      businessUnit: form.businessUnit || undefined,
      recordOwner: form.recordOwner.trim() || undefined,
      addedByRecruiter: true,
      addedAt: new Date().toISOString(),
    });
    navigate('/crm/talent-pool', { state: { addedName: `${form.firstName} ${form.lastName}` } });
  };

  return (
    <CRMLayout breadcrumbs={[{ label: 'Talent Pool', path: '/crm/talent-pool' }, { label: 'Add Talent' }]}>
      <form onSubmit={handleSubmit}>
        <div className="max-w-5xl mx-auto pt-2 pb-20 space-y-8">

          {/* Header */}
          <div>
            <h1 className="text-xl font-black text-[#111827]">Add Talent</h1>
            <p className="text-sm text-[#9CA3AF] mt-1">Manually add a person to the Talent Pool for future opportunities.</p>
          </div>

          {/* ── 1. Internal Details ── */}
          <Section title="Internal Details" hint="Route this record to the right team and track where this talent came from.">
            <div className="grid grid-cols-3 gap-4">
              <Field label="Business Unit" required>
                <select required value={form.businessUnit} onChange={e => set('businessUnit', e.target.value)} className={selectCls}>
                  <option value="">Select</option>
                  {businessUnits.map(bu => <option key={bu}>{bu}</option>)}
                </select>
              </Field>
              <Field label="Record Owner">
                <select value={form.recordOwner} onChange={e => set('recordOwner', e.target.value)} className={selectCls}>
                  <option value="">Unassigned</option>
                  {['Sarah Chen', 'Michael Park', 'James Wilson', 'Lisa Ray', 'David Kim'].map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Source" required>
                <select required value={form.source} onChange={e => set('source', e.target.value)} className={selectCls}>
                  <option value="">Select</option>
                  {SOURCES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
          </Section>

          {/* ── 2. Personal Details ── */}
          <Section title="Personal Details" hint="Basic contact information so recruiters can reach out when the right role opens.">
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" required>
                <input required type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="e.g. Priya" className={inputCls} />
              </Field>
              <Field label="Last Name" required>
                <input required type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="e.g. Sharma" className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Phone" required>
                <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#3538CD]/15 focus-within:border-[#3538CD] transition-all bg-white">
                  <span className="flex items-center gap-1.5 px-3 py-2.5 bg-[#F9FAFB] border-r border-[#E5E7EB] text-sm text-[#374151] font-medium shrink-0">
                    🇮🇳 +91
                  </span>
                  <input
                    required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="00000 00000"
                    className="flex-1 px-3 py-2.5 text-sm text-[#374151] focus:outline-none placeholder:text-[#C4C9D4] bg-transparent"
                  />
                </div>
              </Field>
              <Field label="Email" required>
                <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="priya@example.com" className={inputCls} />
              </Field>
            </div>
            <Field label="LinkedIn">
              <input type="text" value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="linkedin.com/in/priya-sharma" className={inputCls} />
            </Field>
          </Section>

          {/* ── 3. Professional Background ── */}
          <Section title="Professional Background" hint="Current role, experience, and what they bring to the table.">
            <label className="flex items-center gap-2.5 cursor-pointer w-fit">
              <input
                type="checkbox" checked={form.isFresher}
                onChange={e => set('isFresher', e.target.checked)}
                className="w-4 h-4 rounded border-[#D1D5DB] accent-[#3538CD]"
              />
              <span className="text-sm font-bold text-[#374151]">Fresher — no prior work experience</span>
            </label>

            {!form.isFresher && (
              <div className="grid grid-cols-3 gap-4">
                <Field label="Current Organisation">
                  <input type="text" value={form.currentOrg} onChange={e => set('currentOrg', e.target.value)} placeholder="e.g. Infosys" className={inputCls} />
                </Field>
                <Field label="Designation">
                  <input type="text" value={form.currentDesignation} onChange={e => set('currentDesignation', e.target.value)} placeholder="e.g. Sr. Engineer" className={inputCls} />
                </Field>
                <Field label="Notice Period">
                  <select value={form.noticePeriod} onChange={e => set('noticePeriod', e.target.value)} className={selectCls}>
                    <option value="">Select</option>
                    {NOTICE_OPTIONS.map(n => <option key={n}>{n}</option>)}
                  </select>
                </Field>
              </div>
            )}

            {!form.isFresher && (
              <div className="grid grid-cols-2 gap-4">
                <Field label="Total Experience">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input type="number" min="0" max="40" value={form.expYears} onChange={e => set('expYears', e.target.value)} placeholder="0" className={`${inputCls} pr-12`} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#9CA3AF]">Yrs</span>
                    </div>
                    <div className="relative flex-1">
                      <input type="number" min="0" max="11" value={form.expMonths} onChange={e => set('expMonths', e.target.value)} placeholder="0" className={`${inputCls} pr-12`} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#9CA3AF]">Mos</span>
                    </div>
                  </div>
                </Field>
              </div>
            )}

            <Field label="Skills">
              <div className="border border-[#E5E7EB] rounded-lg px-3 py-2.5 bg-white focus-within:ring-2 focus-within:ring-[#3538CD]/15 focus-within:border-[#3538CD] transition-all min-h-[44px]">
                {form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {form.skills.map((s, i) => (
                      <span key={i} className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-[#3538CD]/10 text-[#3538CD] rounded-full">
                        {s}
                        <button type="button" onClick={() => removeSkill(i)}><X className="w-3 h-3 hover:text-red-500" /></button>
                      </span>
                    ))}
                  </div>
                )}
                <input
                  type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => { if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) { e.preventDefault(); addSkill(skillInput); } }}
                  onBlur={() => { if (skillInput.trim()) addSkill(skillInput); }}
                  placeholder={form.skills.length ? 'Add more...' : 'Type skill and press Enter or comma'}
                  className="w-full text-sm focus:outline-none placeholder:text-[#C4C9D4] bg-transparent"
                />
              </div>
            </Field>

            <Field label="Notes">
              <textarea
                rows={3} value={form.recruiterNotes} onChange={e => set('recruiterNotes', e.target.value)}
                placeholder="Why is this person a good fit? Any context worth capturing..."
                className={`${inputCls} resize-none`}
              />
            </Field>
          </Section>

          {/* ── 4. Resume ── */}
          <Section title="Resume" hint="Upload a file or drop a link — at least one helps recruiters act fast when the right role opens.">
            <label className="block cursor-pointer">
              <div className={`border-2 border-dashed rounded-xl p-8 text-center hover:border-[#3538CD]/40 hover:bg-[#F4F5FA]/50 transition-all ${form.resumeFile ? 'border-[#3538CD]/40 bg-[#F4F5FA]/50' : 'border-[#E5E7EB]'}`}>
                {form.resumeFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-8 bg-[#3538CD]/10 rounded-lg flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#3538CD]" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-[#111827]">{form.resumeFile}</p>
                      <button type="button" onClick={() => set('resumeFile', '')} className="text-xs text-red-500 hover:underline mt-0.5">Remove</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-[#9CA3AF] mx-auto mb-3" />
                    <p className="text-sm text-[#374151]"><span className="font-black text-[#3538CD]">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">PDF or DOCX, max 5 MB</p>
                  </>
                )}
              </div>
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) set('resumeFile', f.name); }} />
            </label>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#F3F4F6]" />
              <span className="text-xs font-bold text-[#C4C9D4] uppercase tracking-widest">or paste a link</span>
              <div className="flex-1 h-px bg-[#F3F4F6]" />
            </div>

            <input type="url" value={form.resumeLink} onChange={e => set('resumeLink', e.target.value)} placeholder="https://drive.google.com/..." className={inputCls} />
          </Section>

          {/* ── 5. Compensation ── */}
          <Section title="Compensation" hint="Helps match this talent against role budgets before reaching out.">
            <div className="grid grid-cols-4 gap-4">
              <Field label="Currency">
                <select value={form.ctcCurrency} onChange={e => set('ctcCurrency', e.target.value)} className={selectCls}>
                  <option value="">Select</option>
                  {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Type">
                <select value={form.ctcType} onChange={e => set('ctcType', e.target.value)} className={selectCls}>
                  <option value="">Select</option>
                  {CTC_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Current CTC">
                <input type="text" value={form.currentCtc} onChange={e => set('currentCtc', e.target.value)} placeholder="e.g. 8,00,000" className={inputCls} />
              </Field>
              <Field label="Expected CTC">
                <input type="text" value={form.expectedCtc} onChange={e => set('expectedCtc', e.target.value)} placeholder="e.g. 12,00,000" className={inputCls} />
              </Field>
            </div>
          </Section>

          {/* ── 6. Location ── */}
          <Section title="Location" hint="Current city helps target location-specific openings.">
            <div className="grid grid-cols-3 gap-4">
              <Field label="City">
                <input type="text" value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Ahmedabad" className={inputCls} />
              </Field>
              <Field label="State">
                <select value={form.state} onChange={e => set('state', e.target.value)} className={selectCls}>
                  <option value="">Select</option>
                  {INDIA_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Country">
                <input type="text" value={form.country} onChange={e => set('country', e.target.value)} className={inputCls} />
              </Field>
            </div>
          </Section>

          {/* ── 7. Reachability ── */}
          <Section title="Reachability" hint="How comfortable is this person being contacted by recruiters directly?">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-sm font-bold text-[#111827]">Open to direct recruiter contact</p>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  {form.allowRecruiterContact
                    ? 'Recruiters can reach out via email or phone without a formal invite.'
                    : 'This person prefers an invite before being contacted directly.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => set('allowRecruiterContact', !form.allowRecruiterContact)}
                className={`relative rounded-full shrink-0 transition-colors ${form.allowRecruiterContact ? 'bg-[#3538CD]' : 'bg-[#D1D5DB]'}`}
                style={{ minWidth: '2.75rem', height: '1.5rem' }}
              >
                <span
                  className={`absolute top-0.5 left-0.5 bg-white rounded-full shadow transition-transform ${form.allowRecruiterContact ? 'translate-x-[1.25rem]' : ''}`}
                  style={{ width: '1.25rem', height: '1.25rem' }}
                />
              </button>
            </div>
          </Section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#F3F4F6]">
            <button
              type="button"
              onClick={() => navigate('/crm/talent-pool')}
              className="px-6 py-2.5 border border-[#E5E7EB] text-[#6B7280] text-sm font-black rounded-xl hover:bg-[#F9FAFB] transition-colors uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-2.5 bg-[#3538CD] text-white text-sm font-black rounded-xl hover:bg-[#292bb0] transition-all shadow-lg shadow-[#3538CD]/20 uppercase tracking-widest"
            >
              <UserPlus className="w-4 h-4" /> Add to Pool
            </button>
          </div>

        </div>
      </form>
    </CRMLayout>
  );
}
