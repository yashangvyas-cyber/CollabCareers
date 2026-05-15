import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import { Upload, X, Check, ChevronDown, ChevronUp, Trash2, Plus, CheckCircle, Loader2, Wand2, Pencil } from 'lucide-react';
import { useApp } from '../store/AppContext';

const SOURCES = ['LinkedIn', 'Referral', 'Job Fair', 'Direct Approach', 'Naukri', 'Internshala', 'Other'];
const CTC_TYPES = ['Annual', 'Monthly'];
const CURRENCIES = ['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)', 'AED (د.إ)'];
const NOTICE_OPTIONS = ['Immediate', '15 days', '30 days', '45 days', '60 days', '90 days'];
const INDIA_STATES = ['Gujarat', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Rajasthan', 'Telangana', 'West Bengal', 'Uttar Pradesh', 'Punjab'];
const GENDERS = ['Male', 'Female', 'Other'];
const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed'];

export default function AddTalentPage() {
  const navigate = useNavigate();
  const { jobs, addCandidate, submitApplication } = useApp();

  const [form, setForm] = useState({
    businessUnit: '',
    recordOwner: '',
    appliedJob: '',
    source: '',
    remark: '',
    firstName: '',
    lastName: '',
    gender: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    linkedin: '',
    maritalStatus: '',
    resumeFile: '',
    resumeLink: '',
    isFresher: false,
    expYears: '',
    expMonths: '',
    highestQualification: '',
    experiences: [{ id: Date.now(), company: '', designation: '', from: '', to: '', isCurrent: false, description: '' }] as any[],
    noticePeriod: '',
    skills: [] as string[],
    recruiterNotes: '',
    ctcType: '',
    currentCtc: '',
    expectedCtc: '',
    ctcCurrency: '',
    address: '',
    country: 'India',
    state: '',
    city: '',
    zipCode: '',
  });

  const [skillInput, setSkillInput] = useState('');
  const [fillMode, setFillMode] = useState<'manual' | 'autofill'>('manual');
  const [autoFilling, setAutoFilling] = useState(false);

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

  const handleFillMode = (mode: 'manual' | 'autofill') => {
    setFillMode(mode);
    if (mode === 'autofill') {
      setAutoFilling(true);
      setTimeout(() => {
        setAutoFilling(false);
        setForm(f => ({
          ...f,
          firstName: 'Priya',
          lastName: 'Mehta',
          gender: 'Female',
          phone: '+91 98765 43210',
          email: 'priya.mehta@gmail.com',
          dateOfBirth: '1995-03-15',
          linkedin: 'linkedin.com/in/priya-mehta-dev',
          maritalStatus: 'Single',
          isFresher: false,
          expYears: '5',
          expMonths: '3',
          highestQualification: 'B.Tech — Computer Science',
          noticePeriod: '30 days',
          skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'MongoDB'],
          currentCtc: '12,00,000',
          expectedCtc: '18,00,000',
          ctcType: 'Annual',
          ctcCurrency: 'INR (₹)',
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India',
          experiences: [
            {
              id: Date.now(),
              company: 'TechCorp Solutions Pvt. Ltd.',
              designation: 'Senior Frontend Developer',
              from: '2022-Jan',
              to: 'Present',
              isCurrent: true,
              description: 'Led development of enterprise-grade React applications. Mentored junior developers and drove adoption of TypeScript across the team.',
            },
            {
              id: Date.now() + 1,
              company: 'Infosys Limited',
              designation: 'Software Engineer',
              from: '2019-Jul',
              to: '2021-Dec',
              isCurrent: false,
              description: 'Built and maintained internal tools using React and Node.js. Collaborated with cross-functional teams to deliver product features on schedule.',
            },
          ],
        }));
      }, 2200);
    }
  };

  const addSkill = (raw: string) => {
    const s = raw.replace(/,/g, '').trim();
    if (s && !form.skills.includes(s)) set('skills', [...form.skills, s]);
    setSkillInput('');
  };

  const removeSkill = (i: number) => set('skills', form.skills.filter((_, j) => j !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const candidateData: any = {
      id: `tp_${Date.now()}`,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      gender: form.gender || undefined,
      dateOfBirth: form.dateOfBirth || undefined,
      maritalStatus: form.maritalStatus || undefined,
      isAlumni: false,
      profileVisibility: 'visible',
      allowRecruiterContact: true,
      skills: form.skills,
      noticePeriod: form.noticePeriod || undefined,
      experiences: form.experiences.length > 0 && (form.experiences[0].company || form.experiences[0].designation) ? form.experiences : undefined,
      appliedJob: form.appliedJob || undefined,
      location: form.city && form.country ? `${form.city}, ${form.country}` : form.city || form.country || undefined,
      address: form.address.trim() || undefined,
      city: form.city.trim() || undefined,
      state: form.state || undefined,
      country: form.country || undefined,
      zipCode: form.zipCode.trim() || undefined,
      linkedin: form.linkedin.trim() || undefined,
      resumeUrl: form.resumeFile || undefined,
      resumeLink: form.resumeLink.trim() || undefined,
      isFresher: form.isFresher,
      totalExperienceYears: form.expYears ? Number(form.expYears) : undefined,
      totalExperienceMonths: form.expMonths ? Number(form.expMonths) : undefined,
      highestQualification: form.highestQualification.trim() || undefined,
      currentCtc: form.currentCtc.trim() || undefined,
      expectedCtc: form.expectedCtc.trim() || undefined,
      ctcType: form.ctcType || undefined,
      ctcCurrency: form.ctcCurrency || undefined,
      source: form.source || undefined,
      sourceRemark: form.remark.trim() || undefined,
      currentOrg: form.experiences.find((e: any) => e.isCurrent)?.company || form.experiences[0]?.company || undefined,
      currentDesignation: form.experiences.find((e: any) => e.isCurrent)?.designation || form.experiences[0]?.designation || undefined,
      recruiterNotes: form.recruiterNotes.trim() || undefined,
      businessUnit: form.businessUnit || undefined,
      recordOwner: form.recordOwner.trim() || undefined,
      addedByRecruiter: true,
      addedAt: new Date().toISOString(),
    };

    addCandidate(candidateData);

    if (form.appliedJob) {
      submitApplication({
        id: `app_${Date.now()}`,
        candidateId: candidateData.id,
        jobId: form.appliedJob,
        status: 'Under Review',
        appliedAt: new Date().toISOString(),
        answers: {
          _fullFormData: {
            personal: { contactNumber: form.phone },
            professional: { experiences: candidateData.experiences }
          }
        },
        resumeUrl: form.resumeFile || ''
      });
    }

    navigate('/crm/talent-pool', { state: { addedName: `${form.firstName} ${form.lastName}` } });
  };

  const inputClass = "rounded-lg py-2 outline-none placeholder-gray-500 px-3 border border-gray-300 focus:border-indigo-300 focus:shadow-outline-purple bg-white w-full 2xl:h-10 2xl-to-xl:h-9 h-9 2xl:text-sm 2xl-to-xl:text-xs text-xs placeholder:!text-gray-450";
  const selectClass = "w-full border border-gray-300 bg-white rounded-lg px-3 2xl:h-10 2xl-to-xl:h-9 h-9 2xl:text-sm 2xl-to-xl:text-xs text-xs focus:outline-none focus:border-indigo-300 focus:shadow-outline-purple appearance-none text-[#111827] transition-all";
  const labelClass = "text-xs font-medium text-gray-700";
  const reqClass = "text-error-500 pe-1";

  const SideLabel = ({ title, hint }: { title: string, hint: string }) => (
    <div className="2xl:w-1/4 2xl-to-xl:w-[20%] w-[20%]">
      <div className="flex items-center">
        <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-700 font-medium">{title}</p>
      </div>
      <p className="text-gray-400 2xl:text-xs 2xl-to-xl:text-xxs text-xxs mt-1 max-w-[80%] w-full">{hint}</p>
    </div>
  );

  return (
    <CRMLayout breadcrumbs={[{ label: 'Talent Pool', path: '/crm/talent-pool' }, { label: 'Add Talent' }]}>
      <form onSubmit={handleSubmit} className="h-full">
        <div className="overflow-auto 2xl:p-4 p-3 scrollbar-hide h-[calc(100vh-192px)] md:h-[calc(100vh-144px)] 2xl:h-[calc(100vh-158px)] 2xl-to-xl:h-[calc(100vh-146px)]">
          <div className="max-w-[1350px] w-full mx-auto space-y-3 2xl:space-y-4 pb-20">
            
            {/* Header / Actions */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Add Talent</h1>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => navigate('/crm/talent-pool')} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Save</button>
              </div>
            </div>

            {/* Resume Submission — at the top so fill-mode can be chosen first */}
            <div className="flex lg:flex-row flex-col gap-2">
              <SideLabel title="Resume" hint="Upload resume and choose how to fill the form." />
              <div className="w-full p-3 pt-2 bg-white border rounded-lg border-gray-200 2xl:w-3/4 2xl-to-xl:w-[80%] w-[80%] 2xl:p-5 2xl:pt-3">
                <div className="w-full">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Resume</label>
                  <label className="block cursor-pointer">
                    <div className={`py-4 px-3.5 items-center border rounded-lg w-full flex justify-center flex-col transition-all ${form.resumeFile ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 hover:border-indigo-300'}`}>
                      {form.resumeFile ? (
                        <div className="flex items-center justify-center gap-3">
                          <Check className="w-5 h-5 text-indigo-600" />
                          <div className="text-left">
                            <p className="text-sm font-bold text-gray-900">{form.resumeFile}</p>
                            <button type="button" onClick={(e) => { e.preventDefault(); set('resumeFile', ''); }} className="text-xs text-error-500 hover:underline mt-0.5">Remove</button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center flex flex-col items-center">
                          <div className="p-[9px] border rounded-lg text-center">
                            <Upload className="w-5 h-5 text-gray-500" />
                          </div>
                          <div className="2xl:mt-4 2xl-to-xl:mt-2 mt-2">
                            <p className="2xl:text-md 2xl-to-xl:text-xs text-xs">
                              <span className="text-indigo-700 font-semibold">Click to upload</span>
                              <span className="text-gray-600"> or drag and drop</span>
                            </p>
                            <p className="text-gray-600 2xl:text-sm 2xl-to-xl:text-xs text-xs mt-0.5">DOCX & PDF (max. 5 MB)</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) set('resumeFile', f.name); }} />
                  </label>
                </div>
                <div className="w-full">
                  <p className="flex justify-center py-3 text-gray-600 text-sm items-center w-full">OR</p>
                  <input type="url" value={form.resumeLink} onChange={e => set('resumeLink', e.target.value)} placeholder="Paste resume link here" className={inputClass} />
                </div>

                {/* Fill mode toggle — only shown when a file is uploaded */}
                {form.resumeFile && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-600 mb-2">How would you like to fill candidate details?</p>
                  <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 gap-0.5">
                    <button
                      type="button"
                      onClick={() => handleFillMode('manual')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${fillMode === 'manual' ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Fill Manually
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFillMode('autofill')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${fillMode === 'autofill' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      Autofill from Resume
                    </button>
                  </div>
                  {autoFilling && (
                    <div className="flex items-center gap-2 mt-3 text-indigo-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs font-medium">Extracting candidate details from resume...</span>
                    </div>
                  )}
                </div>
                )}
              </div>
            </div>

            {/* Record Details */}
            <div className="flex lg:flex-row flex-col gap-2">
              <SideLabel title="Record Details" hint="Assign ownership and link to a job if applicable." />
              <div className="w-full p-3 pt-2 bg-white border rounded-lg border-gray-200 2xl:w-3/4 2xl-to-xl:w-[80%] w-[80%] 2xl:p-5 2xl:pt-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Job Title</label>
                    </div>
                    <div className="relative">
                      <select value={form.appliedJob} onChange={e => set('appliedJob', e.target.value)} className={selectClass}>
                        <option value="">Select</option>
                        {jobs.filter(j => j.status === 'Open').map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Record Owner{form.appliedJob ? <>&nbsp;</> : null}</label>
                      {form.appliedJob && <span className={reqClass}>*</span>}
                    </div>
                    <div className="relative">
                      <select
                        required={!!form.appliedJob}
                        value={form.recordOwner}
                        onChange={e => set('recordOwner', e.target.value)}
                        className={selectClass}
                      >
                        <option value="">Select</option>
                        {['Sarah Chen', 'Michael Park', 'James Wilson', 'Lisa Ray', 'David Kim'].map(o => <option key={o}>{o}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Source&nbsp;</label>
                      <span className={reqClass}>*</span>
                    </div>
                    <div className="relative">
                      <select required value={form.source} onChange={e => set('source', e.target.value)} className={selectClass}>
                        <option value="">Select</option>
                        {SOURCES.map(s => <option key={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Remark</label>
                    </div>
                    <input type="text" value={form.remark} onChange={e => set('remark', e.target.value)} className={inputClass} maxLength={50} />
                  </div>
                </div>
              </div>
            </div>

            {/* Candidate Information */}
            <div className="flex lg:flex-row flex-col gap-2">
              <SideLabel title="Candidate Information" hint="Provide basic candidate details." />
              <div className="w-full p-3 pt-2 bg-white border rounded-lg border-gray-200 2xl:w-3/4 2xl-to-xl:w-[80%] w-[80%] 2xl:p-5 2xl:pt-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>First Name&nbsp;</label>
                      <span className={reqClass}>*</span>
                    </div>
                    <input required type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)} className={inputClass} maxLength={50} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Last Name&nbsp;</label>
                      <span className={reqClass}>*</span>
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
                      <label className={labelClass}>Contact Number&nbsp;</label>
                      <span className={reqClass}>*</span>
                    </div>
                    <input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 0000000000" className={inputClass} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Email Address&nbsp;</label>
                      <span className={reqClass}>*</span>
                    </div>
                    <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputClass} maxLength={50} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Date of Birth&nbsp;</label>
                    </div>
                    <input type="date" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} className={inputClass} />
                  </div>
                  <div className="lg:col-span-2">
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>LinkedIn Profile&nbsp;</label>
                    </div>
                    <input type="url" value={form.linkedin} onChange={e => set('linkedin', e.target.value)} className={inputClass} maxLength={255} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Marital Status&nbsp;</label>
                    </div>
                    <div className="relative">
                      <select value={form.maritalStatus} onChange={e => set('maritalStatus', e.target.value)} className={selectClass}>
                        <option value="">Select</option>
                        {MARITAL_STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="flex lg:flex-row flex-col gap-2">
              <SideLabel title="Professional Details" hint="Add professional background and experience." />
              <div className="w-full p-3 pt-2 bg-white border rounded-lg border-gray-200 2xl:w-3/4 2xl-to-xl:w-[80%] w-[80%] 2xl:p-5 2xl:pt-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="is_fresher" checked={form.isFresher} onChange={e => set('isFresher', e.target.checked)} className="border border-gray-300 rounded focus:border-indigo-300 accent-indigo-600" />
                      <label className="text-gray-900 2xl:text-sm 2xl-to-xl:text-xs font-medium cursor-pointer text-xs" htmlFor="is_fresher">Fresher</label>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-end min-h-6">
                      <label className={labelClass}>Highest Qualification</label>
                    </div>
                    <input type="text" value={form.highestQualification} onChange={e => set('highestQualification', e.target.value)} className={inputClass} maxLength={50} />
                  </div>

                  {!form.isFresher && (
                    <>
                      <div>
                        <div className="mb-1.5 flex items-end min-h-6">
                          <label className={labelClass}>Total Experience</label>
                        </div>
                        <div className="flex rounded-md shadow-sm">
                          <input type="number" min="0" value={form.expYears} onChange={e => set('expYears', e.target.value)} className="w-full rounded-l-lg outline-none py-1.5 px-3 2xl:h-10 2xl-to-xl:h-9 h-9 border 2xl:text-sm 2xl-to-xl:text-xs text-xs border-gray-300 focus:border-indigo-300 bg-white" />
                          <div className="relative -ml-px inline-flex items-center px-3 2xl:text-sm 2xl-to-xl:text-xs text-xs 2xl:h-10 2xl-to-xl:h-9 h-9 text-gray-500 bg-gray-100 border border-gray-300 rounded-r-md">Years</div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-1.5 min-h-6"></div>
                        <div className="flex rounded-md shadow-sm">
                          <input type="number" min="0" max="11" value={form.expMonths} onChange={e => set('expMonths', e.target.value)} className="w-full rounded-l-lg outline-none py-1.5 px-3 2xl:h-10 2xl-to-xl:h-9 h-9 border 2xl:text-sm 2xl-to-xl:text-xs text-xs border-gray-300 focus:border-indigo-300 bg-white" />
                          <div className="relative -ml-px inline-flex items-center px-3 2xl:text-sm 2xl-to-xl:text-xs text-xs 2xl:h-10 2xl-to-xl:h-9 h-9 text-gray-500 bg-gray-100 border border-gray-300 rounded-r-md">Months</div>
                        </div>
                      </div>

                      {/* Experiences block replaces Current Org / Designation */}
                      <div className="lg:col-span-3 mt-4 space-y-4">
                        <label className={labelClass}>Experience Details</label>
                        {form.experiences.map((exp: any, i: number) => (
                          <div key={exp.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group">
                            <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button type="button" onClick={() => {
                                if (i === 0) return;
                                const newExp = [...form.experiences];
                                [newExp[i-1], newExp[i]] = [newExp[i], newExp[i-1]];
                                set('experiences', newExp);
                              }} className="p-1 text-gray-400 hover:text-indigo-600 rounded transition-colors disabled:opacity-30" disabled={i === 0}>
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button type="button" onClick={() => {
                                if (i === form.experiences.length - 1) return;
                                const newExp = [...form.experiences];
                                [newExp[i], newExp[i+1]] = [newExp[i+1], newExp[i]];
                                set('experiences', newExp);
                              }} className="p-1 text-gray-400 hover:text-indigo-600 rounded transition-colors disabled:opacity-30" disabled={i === form.experiences.length - 1}>
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              <button type="button" onClick={() => {
                                set('experiences', form.experiences.filter((_, idx) => idx !== i));
                              }} className="p-1 text-error-400 hover:text-error-600 rounded transition-colors ml-2">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3 pr-20">
                              <div>
                                <label className={labelClass}>Organization <span className={reqClass}>*</span></label>
                                <input required type="text" value={exp.company} onChange={e => {
                                  const newExp = [...form.experiences];
                                  newExp[i].company = e.target.value;
                                  set('experiences', newExp);
                                }} placeholder="e.g. Acme Corp" className={inputClass} />
                              </div>
                              <div>
                                <label className={labelClass}>Designation <span className={reqClass}>*</span></label>
                                <input required type="text" value={exp.designation} onChange={e => {
                                  const newExp = [...form.experiences];
                                  newExp[i].designation = e.target.value;
                                  set('experiences', newExp);
                                }} placeholder="e.g. Developer" className={inputClass} />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <FormMonthYearPicker label="From" value={exp.from} onChange={(val: string) => {
                                const newExp = [...form.experiences];
                                newExp[i].from = val;
                                set('experiences', newExp);
                              }} />
                              <FormMonthYearPicker label="To" value={exp.to} isLocked={exp.isCurrent} onChange={(val: string) => {
                                const newExp = [...form.experiences];
                                newExp[i].to = val;
                                set('experiences', newExp);
                              }} />
                            </div>

                            <div className="mb-3">
                              <label className="flex items-center gap-2 cursor-pointer w-fit group">
                                <div className="relative flex items-center">
                                  <input type="checkbox" checked={exp.isCurrent} onChange={(e) => {
                                    const newExp = [...form.experiences];
                                    if (e.target.checked) {
                                      newExp.forEach(ex => { ex.isCurrent = false; if (ex.to === 'Present') ex.to = ''; });
                                      newExp[i].isCurrent = true;
                                      newExp[i].to = 'Present';
                                      const item = newExp.splice(i, 1)[0];
                                      newExp.unshift(item);
                                    } else {
                                      newExp[i].isCurrent = false;
                                      newExp[i].to = '';
                                    }
                                    set('experiences', newExp);
                                  }} className="w-4 h-4 rounded border-gray-300 accent-indigo-600 appearance-none" />
                                  <div className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${exp.isCurrent ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'}`}>
                                    {exp.isCurrent && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                                  </div>
                                </div>
                                <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors">I currently work here</span>
                              </label>
                            </div>

                            <div>
                               <label className={labelClass}>Description</label>
                               <textarea rows={2} value={exp.description} onChange={e => {
                                 const newExp = [...form.experiences];
                                 newExp[i].description = e.target.value;
                                 set('experiences', newExp);
                               }} placeholder="Briefly describe the role..." className={`${inputClass} resize-none min-h-[42px] py-2`} />
                            </div>
                          </div>
                        ))}

                        <button type="button" onClick={() => set('experiences', [...form.experiences, { id: Date.now(), company: '', designation: '', from: '', to: '', isCurrent: false, description: '' }])} className="flex items-center gap-1.5 text-indigo-600 text-xs font-semibold hover:underline mt-2">
                          <Plus className="w-3.5 h-3.5" /> Add Experience
                        </button>
                      </div>

                      <div>
                        <div className="flex items-end min-h-6">
                          <label className={labelClass}>Notice Period (Days)</label>
                        </div>
                        <div className="relative">
                          <select value={form.noticePeriod} onChange={e => set('noticePeriod', e.target.value)} className={selectClass}>
                            <option value="">Select</option>
                            {NOTICE_OPTIONS.map(n => <option key={n}>{n}</option>)}
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="lg:col-span-3">
                    <div className="flex items-end min-h-6 mb-1.5">
                      <label className={labelClass}>Skills</label>
                    </div>
                    <div className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:border-indigo-300 focus-within:shadow-outline-purple transition-all min-h-[44px]">
                      {form.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {form.skills.map((s, i) => (
                            <span key={i} className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full">
                              {s}
                              <button type="button" onClick={() => removeSkill(i)}><X className="w-3 h-3 hover:text-error-500" /></button>
                            </span>
                          ))}
                        </div>
                      )}
                      <input
                        type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => { if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) { e.preventDefault(); addSkill(skillInput); } }}
                        onBlur={() => { if (skillInput.trim()) addSkill(skillInput); }}
                        placeholder={form.skills.length ? 'Add more...' : 'Type skill and press Enter'}
                        className="w-full text-xs outline-none placeholder-gray-400 bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="w-full lg:col-span-3">
                    <label className={labelClass}>General Remarks</label>
                    <textarea value={form.recruiterNotes} onChange={e => set('recruiterNotes', e.target.value)} className={`${inputClass} resize-none min-h-[42px] mt-1.5`} rows={4}></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Salary Information */}
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
                    <div className="flex items-end min-h-6 mb-1.5"><label className={labelClass}>Current CTC</label></div>
                    <input type="text" value={form.currentCtc} onChange={e => set('currentCtc', e.target.value)} className={inputClass} maxLength={30} />
                  </div>
                  <div>
                    <div className="flex items-end min-h-6 mb-1.5"><label className={labelClass}>Expected CTC</label></div>
                    <input type="text" value={form.expectedCtc} onChange={e => set('expectedCtc', e.target.value)} className={inputClass} maxLength={30} />
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
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="flex lg:flex-row flex-col gap-2">
              <SideLabel title="Address" hint="Current residential address of the candidate." />
              <div className="w-full p-3 pt-2 bg-white border rounded-lg border-gray-200 2xl:w-3/4 2xl-to-xl:w-[80%] w-[80%] 2xl:p-5 2xl:pt-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div className="lg:col-span-2">
                    <div className="flex items-end min-h-6 mb-1.5"><label className={labelClass}>Address</label></div>
                    <input type="text" value={form.address} onChange={e => set('address', e.target.value)} className={inputClass} maxLength={150} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-end min-h-6"><label className={labelClass}>Country</label></div>
                    <input type="text" value={form.country} onChange={e => set('country', e.target.value)} className={inputClass} />
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
                    <div className="flex items-end min-h-6 mb-1.5"><label className={labelClass}>Town/City</label></div>
                    <input type="text" value={form.city} onChange={e => set('city', e.target.value)} className={inputClass} maxLength={50} />
                  </div>
                  <div>
                    <div className="flex items-end min-h-6 mb-1.5"><label className={labelClass}>Zip/Postal Code</label></div>
                    <input type="text" value={form.zipCode} onChange={e => set('zipCode', e.target.value)} className={inputClass} maxLength={15} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>
    </CRMLayout>
  );
}

function FormMonthYearPicker({ label, required, value, isLocked, onChange }: any) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => String(currentYear - i));

  const [year, month] = value ? value.split('-') : ['', ''];

  const handleMonthChange = (newMonth: string) => {
    if (!year && newMonth) onChange(`${currentYear}-${newMonth}`);
    else onChange(`${year}-${newMonth}`);
  };

  const handleYearChange = (newYear: string) => {
    if (!month && newYear) onChange(`${newYear}-Jan`);
    else onChange(`${newYear}-${month}`);
  };

  const selectClass = "w-full border border-gray-300 bg-white rounded-lg px-3 2xl:h-10 2xl-to-xl:h-9 h-9 2xl:text-sm 2xl-to-xl:text-xs text-xs focus:outline-none focus:border-indigo-300 focus:shadow-outline-purple appearance-none text-[#111827] transition-all";

  if (isLocked) {
    return (
      <div>
        <label className="text-xs font-medium text-gray-700">{label} {required && <span className="text-error-500 pe-1">*</span>}</label>
        <input type="text" value="Present" disabled className="w-full mt-1.5 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 text-xs cursor-not-allowed" />
      </div>
    );
  }

  return (
    <div>
      <label className="text-xs font-medium text-gray-700">{label} {required && <span className="text-error-500 pe-1">*</span>}</label>
      <div className="flex gap-2 mt-1.5">
        <div className="relative flex-1">
          <select value={month || ''} onChange={(e) => handleMonthChange(e.target.value)} className={selectClass}>
            <option value="" disabled>Month</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="relative flex-1">
          <select value={year || ''} onChange={(e) => handleYearChange(e.target.value)} className={selectClass}>
            <option value="" disabled>Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
