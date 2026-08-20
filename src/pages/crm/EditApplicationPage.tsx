import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CRMLayout from '../../components/CRMLayout';
import { useApp } from '../../store/AppContext';
import {
  FormSection, Field, TextField, SelectField, LockedField, FieldLabel, INPUT_CLASS,
} from '../../components/CRMFormField';

/* Option lists — same values the recruiter sees on Add Talent. */
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

  /* The application this row represents — drives the read-only Application
     Information block. Newest first, same rule as the candidate detail page. */
  const application = [...applications]
    .filter(a => a.candidateId === candidateId)
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())[0];
  const appliedJob = application ? jobs.find(j => j.id === application.jobId) : undefined;

  const [form, setForm] = useState(() => ({
    recordOwner: candidate?.recordOwner ?? '',
    firstName: candidate?.firstName ?? '',
    lastName: candidate?.lastName ?? '',
    gender: candidate?.gender ?? '',
    phone: candidate?.phone ?? '',
    email: candidate?.email ?? '',
    dateOfBirth: candidate?.dateOfBirth ?? '',
    linkedin: candidate?.linkedin ?? '',
    maritalStatus: candidate?.maritalStatus ?? '',
    totalExperienceYears: candidate?.totalExperienceYears?.toString() ?? '',
    totalExperienceMonths: candidate?.totalExperienceMonths?.toString() ?? '',
    highestQualification: candidate?.highestQualification ?? '',
    currentOrg: candidate?.currentOrg ?? '',
    currentDesignation: candidate?.currentDesignation ?? '',
    noticePeriod: candidate?.noticePeriod ?? '',
    skills: candidate?.skills ?? [],
    recruiterNotes: candidate?.recruiterNotes ?? '',
    ctcType: candidate?.ctcType ?? '',
    currentCtc: candidate?.currentCtc ?? '',
    expectedCtc: candidate?.expectedCtc ?? '',
    ctcCurrency: candidate?.ctcCurrency ?? '',
    address: candidate?.address ?? '',
    country: candidate?.country ?? '',
    state: candidate?.state ?? '',
    city: candidate?.city ?? '',
    zipCode: candidate?.zipCode ?? '',
  }));

  const [skillInput, setSkillInput] = useState('');
  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

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
        <div className="p-6"><p className="text-sm text-gray-600">Application not found.</p></div>
      </CRMLayout>
    );
  }

  return (
    <CRMLayout breadcrumbs={[{ label: 'Job Applications', path: '/crm/candidates' }, { label: 'Edit Application' }]}>
      <form onSubmit={handleSubmit} className="h-full">
        {/* Header — staging: title + "- {name}" in indigo, Cancel then Update.
            Button class strings are the ×263 / ×210 primary+secondary from the
            crawled design system. */}
        <div className="2xl:py-3 2xl-to-xl:py-2 py-2 2xl:px-4 2xl-to-xl:px-3 px-3 flex flex-col md:flex-row justify-between items-center bg-white border-b border-gray-200">
          <div className="flex flex-col gap-2">
            <h1 className="2xl:text-lg 2xl-to-xl:text-base text-base flex font-semibold text-gray-900">
              Edit Application
              <span>&nbsp;-&nbsp;<span className="text-indigo-700">{candidate.firstName} {candidate.lastName}</span></span>
            </h1>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => navigate('/crm/candidates')}
              className="outline-none font-semibold rounded-lg disabled:cursor-not-allowed border disabled:opacity-100 hover:opacity-90 px-4 mr-2 border-indigo-200 bg-indigo-50 text-indigo-700 2xl:py-2.5 2xl-to-xl:py-1 py-1 2xl:h-10 2xl-to-xl:h-8 h-8 2xl:text-sm 2xl-to-xl:text-xs text-xs"
            >
              <div className="flex items-center justify-center gap-2">Cancel</div>
            </button>
            <button
              type="submit"
              className="outline-none font-semibold rounded-lg disabled:cursor-not-allowed border disabled:opacity-100 hover:opacity-90 disabled:bg-indigo-200 px-4 border-transparent bg-indigo-600 text-white 2xl:py-2 2xl-to-xl:py-1 py-1 2xl:h-9 2xl-to-xl:h-8 h-8 2xl:text-sm 2xl-to-xl:text-xs text-xs"
            >
              <div className="flex items-center justify-center gap-2">Update</div>
            </button>
          </div>
        </div>

        <div className="overflow-auto 2xl:p-4 p-3 scrollbar-hide h-[calc(100vh-192px)] md:h-[calc(100vh-144px)] 2xl:h-[calc(100vh-158px)] 2xl-to-xl:h-[calc(100vh-146px)]">
          <div className="max-w-[1350px] w-full">

            {/* ── business_unit — BU locked, Record Owner editable (as on staging) ── */}
            <FormSection id="business_unit" title="Business Unit" hint="Select the appropriate business unit." first>
              <LockedField label="Business Unit" value={candidate.businessUnit} />
              <SelectField label="Record Owner" required value={form.recordOwner} onChange={v => set('recordOwner', v)} options={RECORD_OWNERS} />
            </FormSection>

            {/* ── application_information — shown, not editable ── */}
            <FormSection id="application_information" title="Application Information" hint="Job and application details cannot be changed here.">
              <LockedField label="Job Title" value={appliedJob?.title} />
              <LockedField label="Application Status" value={application?.status} />
              <LockedField
                label="Applied On"
                value={application ? new Date(application.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : undefined}
              />
              <LockedField label="Source" value={candidate.source} />
              <LockedField label="Source Remark" value={candidate.sourceRemark} />
              <LockedField label="Candidate Status" value={candidate.candidateStatus} />
            </FormSection>

            {/* ── candidate_Information — editable ── */}
            <FormSection id="candidate_Information" title="Candidate Information" hint="Provide basic candidate details.">
              <TextField label="First Name" required value={form.firstName} onChange={v => set('firstName', v)} maxLength={50} />
              <TextField label="Last Name" required value={form.lastName} onChange={v => set('lastName', v)} maxLength={50} />
              <SelectField label="Gender" value={form.gender} onChange={v => set('gender', v)} options={GENDERS} />
              <TextField label="Contact Number" required value={form.phone} onChange={v => set('phone', v)} />
              <TextField label="Email Address" required type="email" value={form.email} onChange={v => set('email', v)} />
              <TextField label="Date of Birth" value={form.dateOfBirth} onChange={v => set('dateOfBirth', v)} placeholder="DD/Mon/YYYY" />
              <TextField label="LinkedIn Profile" value={form.linkedin} onChange={v => set('linkedin', v)} />
              <SelectField label="Marital Status" value={form.maritalStatus} onChange={v => set('maritalStatus', v)} options={MARITAL_STATUSES} />
            </FormSection>

            {/* ── professional_detail — editable ── */}
            <FormSection id="professional_detail" title="Professional Details" hint="Add professional background and experience.">
              {/* Total Experience is a years+months pair inside one field slot. */}
              <div>
                <FieldLabel label="Total Experience" />
                <div className="rounded-lg relative mt-1.5 flex gap-2">
                  <input type="number" min={0} value={form.totalExperienceYears} onChange={e => set('totalExperienceYears', e.target.value)} placeholder="Years" className={INPUT_CLASS} />
                  <input type="number" min={0} max={11} value={form.totalExperienceMonths} onChange={e => set('totalExperienceMonths', e.target.value)} placeholder="Months" className={INPUT_CLASS} />
                </div>
              </div>
              <TextField label="Highest Qualification" value={form.highestQualification} onChange={v => set('highestQualification', v)} />
              <TextField label="Current Organization" value={form.currentOrg} onChange={v => set('currentOrg', v)} />
              <TextField label="Current Designation" value={form.currentDesignation} onChange={v => set('currentDesignation', v)} />
              <SelectField label="Notice Period (Days)" value={form.noticePeriod} onChange={v => set('noticePeriod', v)} options={NOTICE_OPTIONS} />

              {/* Skills spans the full row — chips render under the entry box. */}
              <div className="lg:col-span-3">
                <FieldLabel label="Skills" />
                <div className="rounded-lg relative mt-1.5 flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                    placeholder="Type a skill and press Enter"
                    className={INPUT_CLASS}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="outline-none font-semibold rounded-lg hover:opacity-90 border border-indigo-200 bg-indigo-50 text-indigo-700 px-4 whitespace-nowrap 2xl:h-10 2xl-to-xl:h-9 h-9 2xl:text-sm 2xl-to-xl:text-xs text-xs"
                  >
                    Add
                  </button>
                </div>
                {form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.skills.map(s => (
                      <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg 2xl:text-sm 2xl-to-xl:text-xs text-xs font-medium text-indigo-700">
                        {s}
                        <button type="button" onClick={() => set('skills', form.skills.filter(x => x !== s))} className="text-indigo-400 hover:text-indigo-700">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-3">
                <FieldLabel label="General Remarks" />
                <div className="rounded-lg relative mt-1.5">
                  <textarea
                    value={form.recruiterNotes}
                    onChange={e => set('recruiterNotes', e.target.value)}
                    rows={3}
                    className="rounded-lg py-2 outline-none placeholder-gray-500 px-3 border border-gray-300 focus:border-indigo-300 focus:shadow-outline-purple bg-white w-full 2xl:text-sm 2xl-to-xl:text-xs text-xs placeholder:!text-gray-450"
                  />
                </div>
              </div>
            </FormSection>

            {/* ── salary_information — editable ── */}
            <FormSection id="salary_information" title="Salary Information" hint="Define the candidate's current and expected salary." cols={4}>
              <SelectField label="CTC Type" value={form.ctcType} onChange={v => set('ctcType', v)} options={CTC_TYPES} />
              <SelectField label="Currency" value={form.ctcCurrency} onChange={v => set('ctcCurrency', v)} options={CURRENCIES} />
              <TextField label="Current CTC" value={form.currentCtc} onChange={v => set('currentCtc', v)} />
              <TextField label="Expected CTC" value={form.expectedCtc} onChange={v => set('expectedCtc', v)} />
            </FormSection>

            {/* ── address — editable ── */}
            <FormSection id="address" title="Address" hint="Current residential address of the candidate." cols={4}>
              <div className="lg:col-span-4">
                <Field label="Address">
                  <input type="text" value={form.address} onChange={e => set('address', e.target.value)} className={INPUT_CLASS} />
                </Field>
              </div>
              <SelectField label="Country" value={form.country} onChange={v => set('country', v)} options={COUNTRIES} />
              <SelectField label="State" value={form.state} onChange={v => set('state', v)} options={INDIA_STATES} />
              <TextField label="Town/City" value={form.city} onChange={v => set('city', v)} />
              <TextField label="Zip/Postal Code" value={form.zipCode} onChange={v => set('zipCode', v)} />
            </FormSection>

            {/* ── record_details — shown, not editable ── */}
            <FormSection id="record_details" title="Record Details" hint="System-maintained audit information.">
              <LockedField label="Created By" value={candidate.createdBy} />
              <LockedField label="Modified By" value={candidate.modifiedBy} />
              <LockedField label="Resume" value={candidate.resumeUrl} />
            </FormSection>

            <div className="pb-20" />
          </div>
        </div>
      </form>
    </CRMLayout>
  );
}
