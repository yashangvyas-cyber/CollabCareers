import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CRMLayout from '../../components/CRMLayout';
import { ChevronDown } from 'lucide-react';
import { useApp } from '../../store/AppContext';

/* Option lists — copied from AddTalentPage so both recruiter forms offer the
   same values. */
const CTC_TYPES = ['Annual', 'Monthly'];
const CURRENCIES = ['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)', 'AED (د.إ)'];
const NOTICE_OPTIONS = ['Immediate', '15 days', '30 days', '45 days', '60 days', '90 days'];
const INDIA_STATES = ['Gujarat', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Rajasthan', 'Telangana', 'West Bengal', 'Uttar Pradesh', 'Punjab', 'Kerala'];
const COUNTRIES = ['India', 'United States', 'United Kingdom', 'United Arab Emirates', 'Australia', 'Canada'];
const GENDERS = ['Male', 'Female', 'Other'];
const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed'];
const RECORD_OWNERS = ['Sarah Chen', 'Michael Park', 'Lisa Ray', 'James Wilson', 'David Kim'];

export default function EditApplicationPage() {
  const navigate = useNavigate();
  const { candidateId } = useParams<{ candidateId: string }>();
  const { candidates, applications, jobs, updateCandidate } = useApp();

  const candidate = candidates.find(c => c.id === candidateId);

  /* The application this row represents — used for the read-only Application
     Information block (job title, status). Newest first, same as the detail page. */
  const application = [...applications]
    .filter(a => a.candidateId === candidateId)
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())[0];
  const appliedJob = application ? jobs.find(j => j.id === application.jobId) : undefined;

  const [form, setForm] = useState(() => ({
    // Record owner
    recordOwner: candidate?.recordOwner ?? '',
    // Personal Information
    firstName: candidate?.firstName ?? '',
    lastName: candidate?.lastName ?? '',
    gender: candidate?.gender ?? '',
    phone: candidate?.phone ?? '',
    email: candidate?.email ?? '',
    dateOfBirth: candidate?.dateOfBirth ?? '',
    linkedin: candidate?.linkedin ?? '',
    maritalStatus: candidate?.maritalStatus ?? '',
    // Professional Details
    totalExperienceYears: candidate?.totalExperienceYears?.toString() ?? '',
    totalExperienceMonths: candidate?.totalExperienceMonths?.toString() ?? '',
    highestQualification: candidate?.highestQualification ?? '',
    currentOrg: candidate?.currentOrg ?? '',
    currentDesignation: candidate?.currentDesignation ?? '',
    noticePeriod: candidate?.noticePeriod ?? '',
    skills: candidate?.skills ?? [],
    recruiterNotes: candidate?.recruiterNotes ?? '',
    // Salary Information
    ctcType: candidate?.ctcType ?? '',
    currentCtc: candidate?.currentCtc ?? '',
    expectedCtc: candidate?.expectedCtc ?? '',
    ctcCurrency: candidate?.ctcCurrency ?? '',
    // Address
    address: candidate?.address ?? '',
    country: candidate?.country ?? '',
    state: candidate?.state ?? '',
    city: candidate?.city ?? '',
    zipCode: candidate?.zipCode ?? '',
  }));

  const [skillInput, setSkillInput] = useState('');
  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

  /* Field classes copied verbatim from the staging Edit Candidate DOM. */
  const inputClass = "rounded-lg py-2 outline-none placeholder-gray-500 px-3 border border-gray-300 focus:border-indigo-300 focus:shadow-outline-purple bg-white w-full 2xl:h-10 2xl-to-xl:h-9 h-9 2xl:text-sm 2xl-to-xl:text-xs text-xs placeholder:!text-gray-450";
  const selectClass = "w-full border border-gray-300 bg-white rounded-lg px-3 2xl:h-10 2xl-to-xl:h-9 h-9 2xl:text-sm 2xl-to-xl:text-xs text-xs focus:outline-none focus:border-indigo-300 focus:shadow-outline-purple appearance-none text-[#111827] transition-all";
  /* Staging renders locked fields as greyed, non-interactive controls
     (react-select--is-disabled / cursor-not-allowed) rather than plain text. */
  const disabledInputClass = "rounded-lg py-2 px-3 border border-gray-300 bg-gray-50 text-gray-500 w-full 2xl:h-10 2xl-to-xl:h-9 h-9 2xl:text-sm 2xl-to-xl:text-xs text-xs cursor-not-allowed";
  const labelClass = "text-xs font-medium text-gray-700";
  const reqClass = "text-error-500 pe-1";

  const SideLabel = ({ title, hint }: { title: string; hint: string }) => (
    <div className="2xl:w-1/4 2xl-to-xl:w-[20%] w-[20%]">
      <div className="flex items-center">
        <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-700 font-medium">{title}</p>
      </div>
      <p className="text-gray-400 2xl:text-xs 2xl-to-xl:text-xxs text-xxs mt-1 max-w-[80%] w-full">{hint}</p>
    </div>
  );

  /** A field that is shown but not editable — rendered as a greyed control. */
  const LockedField = ({ label, value }: { label: string; value?: string }) => (
    <div>
      <div className="mb-1.5 flex items-end min-h-6">
        <label className={labelClass}>{label}</label>
      </div>
      <div className="cursor-not-allowed">
        <input type="text" value={value || '–'} disabled readOnly className={disabledInputClass} />
      </div>
    </div>
  );

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || form.skills.includes(s)) return;
    set('skills', [...form.skills, s]);
    setSkillInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateId) return;
    updateCandidate(candidateId, {
      recordOwner: form.recordOwner,
      firstName: form.firstName,
      lastName: form.lastName,
      gender: form.gender,
      phone: form.phone,
      email: form.email,
      dateOfBirth: form.dateOfBirth,
      linkedin: form.linkedin,
      maritalStatus: form.maritalStatus,
      totalExperienceYears: form.totalExperienceYears === '' ? undefined : Number(form.totalExperienceYears),
      totalExperienceMonths: form.totalExperienceMonths === '' ? undefined : Number(form.totalExperienceMonths),
      highestQualification: form.highestQualification,
      currentOrg: form.currentOrg,
      currentDesignation: form.currentDesignation,
      noticePeriod: form.noticePeriod,
      skills: form.skills,
      recruiterNotes: form.recruiterNotes,
      ctcType: form.ctcType,
      currentCtc: form.currentCtc,
      expectedCtc: form.expectedCtc,
      ctcCurrency: form.ctcCurrency,
      address: form.address,
      country: form.country,
      state: form.state,
      city: form.city,
      zipCode: form.zipCode,
      modifiedBy: 'Sarah Chen',
    });
    navigate('/crm/candidates');
  };

  if (!candidate) {
    return (
      <CRMLayout breadcrumbs={[{ label: 'Job Applications', path: '/crm/candidates' }, { label: 'Edit Application' }]}>
        <div className="p-6">
          <p className="text-sm text-gray-600">Application not found.</p>
        </div>
      </CRMLayout>
    );
  }

  return (
    <CRMLayout breadcrumbs={[{ label: 'Job Applications', path: '/crm/candidates' }, { label: 'Edit Application' }]}>
      <form onSubmit={handleSubmit} className="h-full">
        {/* Header / Actions — staging shows "Edit Candidate - {name}" with Cancel + Update */}
        <div className="2xl:py-3 2xl-to-xl:py-2 py-2 2xl:px-4 2xl-to-xl:px-3 px-3 flex flex-col md:flex-row justify-between items-center border-b border-gray-200 bg-white">
          <div className="flex flex-col gap-2">
            <h1 className="2xl:text-lg 2xl-to-xl:text-base text-base flex font-semibold text-gray-900">
              Edit Application
              <span>&nbsp;-&nbsp;<span className="text-indigo-700">{candidate.firstName} {candidate.lastName}</span></span>
            </h1>
          </div>
          <div className="flex items-center">
            <button type="button" onClick={() => navigate('/crm/candidates')} className="px-4 mr-2 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:opacity-90">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:opacity-90">Update</button>
          </div>
        </div>

        <div className="overflow-auto 2xl:p-4 p-3 scrollbar-hide h-[calc(100vh-192px)] md:h-[calc(100vh-144px)] 2xl:h-[calc(100vh-158px)] 2xl-to-xl:h-[calc(100vh-146px)]">
          <div className="max-w-[1350px] w-full mx-auto space-y-3 2xl:space-y-4 pb-20">

            {/* ── Business Unit — BU locked, Record Owner editable (as on staging) ── */}
            <div className="flex lg:flex-row flex-col gap-2">
              <SideLabel title="Business Unit" hint="Select the appropriate business unit." />
              <div className="w-full p-3 pt-2 bg-white border rounded-lg border-gray-200 2xl:w-3/4 2xl-to-xl:w-[80%] w-[80%] 2xl:p-5 2xl:pt-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <LockedField label="Business Unit" value={candidate.businessUnit} />
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Record Owner&nbsp;</label>
                      <span className={reqClass}>*</span>
                    </div>
                    <div className="relative">
                      <select required value={form.recordOwner} onChange={e => set('recordOwner', e.target.value)} className={selectClass}>
                        <option value="">Select</option>
                        {RECORD_OWNERS.map(o => <option key={o}>{o}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Application Information — shown, not editable ── */}
            <div className="flex lg:flex-row flex-col gap-2">
              <SideLabel title="Application Information" hint="Job and application details cannot be changed here." />
              <div className="w-full p-3 pt-2 bg-white border rounded-lg border-gray-200 2xl:w-3/4 2xl-to-xl:w-[80%] w-[80%] 2xl:p-5 2xl:pt-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <LockedField label="Job Title" value={appliedJob?.title} />
                  <LockedField label="Application Status" value={application?.status} />
                  <LockedField label="Applied On" value={application ? new Date(application.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : undefined} />
                  <LockedField label="Source" value={candidate.source} />
                  <LockedField label="Source Remark" value={candidate.sourceRemark} />
                  <LockedField label="Candidate Status" value={candidate.candidateStatus} />
                </div>
              </div>
            </div>

            {/* ── Personal Information — editable ── */}
            <div className="flex lg:flex-row flex-col gap-2">
              <SideLabel title="Personal Information" hint="Provide basic candidate details." />
              <div className="w-full p-3 pt-2 bg-white border rounded-lg border-gray-200 2xl:w-3/4 2xl-to-xl:w-[80%] w-[80%] 2xl:p-5 2xl:pt-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>First Name&nbsp;</label><span className={reqClass}>*</span>
                    </div>
                    <input required type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)} className={inputClass} maxLength={50} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Last Name&nbsp;</label><span className={reqClass}>*</span>
                    </div>
                    <input required type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)} className={inputClass} maxLength={50} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Gender&nbsp;</label>
                    </div>
                    <div className="relative">
                      <select value={form.gender} onChange={e => set('gender', e.target.value)} className={selectClass}>
                        <option value="">Select</option>
                        {GENDERS.map(g => <option key={g}>{g}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Contact Number&nbsp;</label><span className={reqClass}>*</span>
                    </div>
                    <input required type="text" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Email Address&nbsp;</label><span className={reqClass}>*</span>
                    </div>
                    <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Date of Birth&nbsp;</label>
                    </div>
                    <input type="text" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} placeholder="DD/Mon/YYYY" className={inputClass} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>LinkedIn Profile&nbsp;</label>
                    </div>
                    <input type="text" value={form.linkedin} onChange={e => set('linkedin', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Marital Status&nbsp;</label>
                    </div>
                    <div className="relative">
                      <select value={form.maritalStatus} onChange={e => set('maritalStatus', e.target.value)} className={selectClass}>
                        <option value="">Select</option>
                        {MARITAL_STATUSES.map(m => <option key={m}>{m}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Professional Details — editable ── */}
            <div className="flex lg:flex-row flex-col gap-2">
              <SideLabel title="Professional Details" hint="Add professional background and experience." />
              <div className="w-full p-3 pt-2 bg-white border rounded-lg border-gray-200 2xl:w-3/4 2xl-to-xl:w-[80%] w-[80%] 2xl:p-5 2xl:pt-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Total Experience&nbsp;</label>
                    </div>
                    <div className="flex gap-2">
                      <input type="number" min={0} value={form.totalExperienceYears} onChange={e => set('totalExperienceYears', e.target.value)} placeholder="Years" className={inputClass} />
                      <input type="number" min={0} max={11} value={form.totalExperienceMonths} onChange={e => set('totalExperienceMonths', e.target.value)} placeholder="Months" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Highest Qualification&nbsp;</label>
                    </div>
                    <input type="text" value={form.highestQualification} onChange={e => set('highestQualification', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Current Organization&nbsp;</label>
                    </div>
                    <input type="text" value={form.currentOrg} onChange={e => set('currentOrg', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Current Designation&nbsp;</label>
                    </div>
                    <input type="text" value={form.currentDesignation} onChange={e => set('currentDesignation', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Notice Period (Days)&nbsp;</label>
                    </div>
                    <div className="relative">
                      <select value={form.noticePeriod} onChange={e => set('noticePeriod', e.target.value)} className={selectClass}>
                        <option value="">Select</option>
                        {NOTICE_OPTIONS.map(n => <option key={n}>{n}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-3">
                  <div className="mb-1.5 flex items-end min-h-6">
                    <label className={labelClass}>Skills&nbsp;</label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                      placeholder="Type a skill and press Enter"
                      className={inputClass}
                    />
                    <button type="button" onClick={addSkill} className="px-4 whitespace-nowrap border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">Add</button>
                  </div>
                  {form.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.skills.map(s => (
                        <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-900">
                          {s}
                          <button type="button" onClick={() => set('skills', form.skills.filter(x => x !== s))} className="text-gray-400 hover:text-gray-700">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* General Remarks */}
                <div className="mt-3">
                  <div className="mb-1.5 flex items-end min-h-6">
                    <label className={labelClass}>General Remarks&nbsp;</label>
                  </div>
                  <textarea
                    value={form.recruiterNotes}
                    onChange={e => set('recruiterNotes', e.target.value)}
                    rows={3}
                    className="rounded-lg py-2 outline-none placeholder-gray-500 px-3 border border-gray-300 focus:border-indigo-300 bg-white w-full 2xl:text-sm 2xl-to-xl:text-xs text-xs"
                  />
                </div>
              </div>
            </div>

            {/* ── Salary Information — editable ── */}
            <div className="flex lg:flex-row flex-col gap-2">
              <SideLabel title="Salary Information" hint="Define the candidate's current and expected salary." />
              <div className="w-full p-3 pt-2 bg-white border rounded-lg border-gray-200 2xl:w-3/4 2xl-to-xl:w-[80%] w-[80%] 2xl:p-5 2xl:pt-3">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6"><label className={labelClass}>CTC Type</label></div>
                    <div className="relative">
                      <select value={form.ctcType} onChange={e => set('ctcType', e.target.value)} className={selectClass}>
                        <option value="">Select</option>
                        {CTC_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6"><label className={labelClass}>Currency</label></div>
                    <div className="relative">
                      <select value={form.ctcCurrency} onChange={e => set('ctcCurrency', e.target.value)} className={selectClass}>
                        <option value="">Select</option>
                        {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6"><label className={labelClass}>Current CTC</label></div>
                    <input type="text" value={form.currentCtc} onChange={e => set('currentCtc', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6"><label className={labelClass}>Expected CTC</label></div>
                    <input type="text" value={form.expectedCtc} onChange={e => set('expectedCtc', e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Address — editable ── */}
            <div className="flex lg:flex-row flex-col gap-2">
              <SideLabel title="Address" hint="Current residential address of the candidate." />
              <div className="w-full p-3 pt-2 bg-white border rounded-lg border-gray-200 2xl:w-3/4 2xl-to-xl:w-[80%] w-[80%] 2xl:p-5 2xl:pt-3">
                <div className="mb-3">
                  <div className="mb-1.5 flex items-end min-h-6"><label className={labelClass}>Address</label></div>
                  <input type="text" value={form.address} onChange={e => set('address', e.target.value)} className={inputClass} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6"><label className={labelClass}>Country</label></div>
                    <div className="relative">
                      <select value={form.country} onChange={e => set('country', e.target.value)} className={selectClass}>
                        <option value="">Select</option>
                        {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6"><label className={labelClass}>State</label></div>
                    <div className="relative">
                      <select value={form.state} onChange={e => set('state', e.target.value)} className={selectClass}>
                        <option value="">Select</option>
                        {INDIA_STATES.map(s => <option key={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6"><label className={labelClass}>Town/City</label></div>
                    <input type="text" value={form.city} onChange={e => set('city', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6"><label className={labelClass}>Zip/Postal Code</label></div>
                    <input type="text" value={form.zipCode} onChange={e => set('zipCode', e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Record Details — shown, not editable ── */}
            <div className="flex lg:flex-row flex-col gap-2">
              <SideLabel title="Record Details" hint="System-maintained audit information." />
              <div className="w-full p-3 pt-2 bg-white border rounded-lg border-gray-200 2xl:w-3/4 2xl-to-xl:w-[80%] w-[80%] 2xl:p-5 2xl:pt-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <LockedField label="Created By" value={candidate.createdBy} />
                  <LockedField label="Modified By" value={candidate.modifiedBy} />
                  <LockedField label="Resume" value={candidate.resumeUrl} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>
    </CRMLayout>
  );
}
