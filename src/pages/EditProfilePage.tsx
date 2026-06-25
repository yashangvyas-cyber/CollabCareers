import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import {
  ChevronDown, CheckCircle, Lock, Check, X,
  Plus, ArrowUp, ArrowDown, Trash2, FileText, Upload,
  Eye, EyeOff, ArrowLeft, Sparkles,
} from 'lucide-react';
import { useApp } from '../store/AppContext';

// Country → states, for the dependent Country/State dropdowns in the address section
const COUNTRY_STATES: Record<string, string[]> = {
  India: ['Gujarat', 'Maharashtra', 'Karnataka', 'Delhi', 'Telangana', 'Tamil Nadu', 'Uttar Pradesh', 'Rajasthan', 'West Bengal', 'Kerala'],
  'United States': ['California', 'New York', 'Texas', 'Florida', 'Washington', 'Illinois', 'Massachusetts'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  Canada: ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
  Australia: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'],
  Germany: ['Bavaria', 'Berlin', 'Hesse', 'North Rhine-Westphalia'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah'],
  Singapore: ['Singapore'],
};

export default function EditProfilePage() {
  const { currentUser, updateCurrentUser, applications } = useApp();
  const navigate = useNavigate();
  const { slug = 'yopmails' } = useParams();

  const backToProfile = () => navigate(`/portal/${slug}/profile`);

  // The candidate's richest profile snapshot = their latest application's saved form
  // (the profile page derives from the same source), overlaid with account fields.
  const latestApp = applications
    .filter(a => a.candidateId === currentUser?.id && a.answers?._fullFormData)
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())[0];
  const src = latestApp?.answers?._fullFormData;

  const [formData, setFormData] = useState(() => ({
    personal: {
      firstName: currentUser?.firstName || src?.personal?.firstName || '',
      lastName: currentUser?.lastName || src?.personal?.lastName || '',
      email: currentUser?.email || src?.personal?.email || '',
      contactNumber: currentUser?.phone || src?.personal?.contactNumber || '',
      gender: currentUser?.gender || src?.personal?.gender || '',
      dob: currentUser?.dateOfBirth || src?.personal?.dob || '',
      linkedin: currentUser?.linkedin || src?.personal?.linkedin || '',
      maritalStatus: currentUser?.maritalStatus || src?.personal?.maritalStatus || '',
    },
    professional: {
      experiences: (currentUser?.experiences?.length ? currentUser.experiences : src?.professional?.experiences) || [],
      expYears: (currentUser?.totalExperienceYears != null ? String(currentUser.totalExperienceYears) : '') || src?.professional?.expYears || '',
      expMonths: (currentUser?.totalExperienceMonths != null ? String(currentUser.totalExperienceMonths) : '') || src?.professional?.expMonths || '',
      highestQualification: currentUser?.highestQualification || src?.professional?.highestQualification || '',
      noticePeriod: currentUser?.noticePeriod || src?.professional?.noticePeriod || '',
      skills: (currentUser?.skills?.length ? currentUser.skills : src?.professional?.skills) || [],
      remarks: src?.professional?.remarks || '',
    },
    salary: {
      ctcType: currentUser?.ctcType || src?.salary?.ctcType || 'Annual',
      currency: currentUser?.ctcCurrency || src?.salary?.currency || 'INR',
      currentCtc: currentUser?.currentCtc || src?.salary?.currentCtc || '',
      expectedCtc: currentUser?.expectedCtc || src?.salary?.expectedCtc || '',
    },
    address: {
      street: currentUser?.address || src?.address?.street || '',
      country: currentUser?.country || src?.address?.country || '',
      state: currentUser?.state || src?.address?.state || '',
      city: currentUser?.city || src?.address?.city || '',
      zip: currentUser?.zipCode || src?.address?.zip || '',
    },
  }));

  const [isFresher, setIsFresher] = useState(!!currentUser?.isFresher);
  const [skillInput, setSkillInput] = useState('');
  const [resumeName, setResumeName] = useState(currentUser?.resumeUrl || latestApp?.resumeUrl || '');
  const [visibility, setVisibility] = useState<'visible' | 'private'>(currentUser?.profileVisibility || 'visible');
  const [allowContact, setAllowContact] = useState(currentUser?.allowRecruiterContact || false);

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    if (!formData.professional.skills.includes(v)) {
      setFormData(p => ({ ...p, professional: { ...p.professional, skills: [...p.professional.skills, v] } }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) =>
    setFormData(p => ({ ...p, professional: { ...p.professional, skills: p.professional.skills.filter((s: string) => s !== skill) } }));

  const handleSave = () => {
    const pendingSkills = skillInput.trim() && !formData.professional.skills.includes(skillInput.trim())
      ? [...formData.professional.skills, skillInput.trim()]
      : formData.professional.skills;

    updateCurrentUser({
      firstName: formData.personal.firstName.trim(),
      lastName: formData.personal.lastName.trim(),
      email: formData.personal.email.trim(),
      phone: formData.personal.contactNumber.trim(),
      gender: formData.personal.gender || undefined,
      dateOfBirth: formData.personal.dob || undefined,
      linkedin: formData.personal.linkedin.trim() || undefined,
      maritalStatus: formData.personal.maritalStatus || undefined,
      isFresher,
      experiences: formData.professional.experiences,
      totalExperienceYears: formData.professional.expYears ? Number(formData.professional.expYears) : undefined,
      totalExperienceMonths: formData.professional.expMonths ? Number(formData.professional.expMonths) : undefined,
      highestQualification: formData.professional.highestQualification.trim() || undefined,
      noticePeriod: formData.professional.noticePeriod || undefined,
      skills: pendingSkills,
      currentCtc: formData.salary.currentCtc || undefined,
      expectedCtc: formData.salary.expectedCtc || undefined,
      ctcType: formData.salary.ctcType || undefined,
      ctcCurrency: formData.salary.currency || undefined,
      address: formData.address.street.trim() || undefined,
      city: formData.address.city.trim() || undefined,
      state: formData.address.state || undefined,
      country: formData.address.country || undefined,
      zipCode: formData.address.zip.trim() || undefined,
      location: [formData.address.city.trim(), formData.address.country].filter(Boolean).join(', ') || undefined,
      ...(resumeName ? { resumeUrl: resumeName } : {}),
      profileVisibility: visibility,
      allowRecruiterContact: allowContact,
    });
    backToProfile();
  };

  if (!currentUser) {
    navigate(`/portal/${slug}`);
    return null;
  }

  return (
    <PortalLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 min-h-[80vh] flex flex-col">

        {/* Page header */}
        <div className="mb-8">
          <button onClick={backToProfile} className="flex items-center gap-2 text-[#6B7280] hover:text-primary font-black text-[11px] uppercase tracking-[0.2em] transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </button>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">Edit Profile</h1>
        </div>

        {/* Info callout */}
        <div className="flex items-start gap-3 bg-primary/5 border border-primary/10 rounded-xl p-4 mb-8">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-primary font-medium leading-relaxed">
            An up-to-date profile enables faster job applications and improves your chances of being matched with relevant opportunities.
          </p>
        </div>

        <div className="space-y-6">
          {/* Resume — first, so parsing can populate fields below */}
          <SectionCard title="Resume" caption="Upload your CV to auto-fill the fields below">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] min-w-0">
                <FileText className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                <span className={`text-sm truncate ${resumeName ? 'font-bold text-[#374151]' : 'font-normal text-[#9CA3AF]'}`}>
                  {resumeName || 'No resume uploaded'}
                </span>
              </div>
              <label className="cursor-pointer shrink-0 flex items-center gap-1.5 px-4 py-2.5 border border-primary text-primary text-[11px] font-black rounded-xl hover:bg-primary/5 transition-colors uppercase tracking-widest">
                <Upload className="w-3.5 h-3.5" />
                Upload
                <input
                  type="file" accept=".pdf,.doc,.docx" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setResumeName(f.name); }}
                />
              </label>
            </div>
          </SectionCard>
          {/* Section 1 — Candidate Information */}
          <SectionCard title="Candidate Information" caption="Personal details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <ProfileInput
                label="First Name" required
                value={formData.personal.firstName}
                onChange={(val: string) => setFormData(p => ({ ...p, personal: { ...p.personal, firstName: val } }))}
              />
              <ProfileInput
                label="Last Name" required
                value={formData.personal.lastName}
                onChange={(val: string) => setFormData(p => ({ ...p, personal: { ...p.personal, lastName: val } }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <ProfileInput label="Email Address" required value={formData.personal.email} isLocked />
              <ProfilePhoneInput
                label="Contact Number"
                value={formData.personal.contactNumber}
                onChange={(val: string) => setFormData(p => ({ ...p, personal: { ...p.personal, contactNumber: val } }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <ProfileInput
                label="Date of Birth" type="date"
                value={formData.personal.dob}
                onChange={(val: string) => setFormData(p => ({ ...p, personal: { ...p.personal, dob: val } }))}
              />
              <ProfileSelect
                label="Gender"
                options={['Select', 'Male', 'Female', 'Other', 'Prefer not to say']}
                value={formData.personal.gender}
                onChange={(val: string) => setFormData(p => ({ ...p, personal: { ...p.personal, gender: val } }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ProfileSelect
                label="Marital Status"
                options={['Select', 'Single', 'Married', 'Other']}
                value={formData.personal.maritalStatus}
                onChange={(val: string) => setFormData(p => ({ ...p, personal: { ...p.personal, maritalStatus: val } }))}
              />
              <ProfileInput
                label="LinkedIn Profile"
                value={formData.personal.linkedin}
                placeholder="linkedin.com/in/..."
                onChange={(val: string) => setFormData(p => ({ ...p, personal: { ...p.personal, linkedin: val } }))}
              />
            </div>
          </SectionCard>

          {/* Section 2 — Professional Details */}
          <SectionCard title="Professional Details" caption="Work experience & qualifications">
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={isFresher}
                    onChange={(e) => setIsFresher(e.target.checked)}
                    className="w-5 h-5 border-2 border-[#D1D5DB] rounded-md checked:bg-primary checked:border-primary appearance-none transition-all cursor-pointer"
                  />
                  <CheckCircle className={`absolute inset-0 m-auto w-3.5 h-3.5 text-white transition-opacity ${isFresher ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                <span className="text-sm font-black text-[#374151] group-hover:text-[#111827] uppercase tracking-widest">I am a Fresher</span>
              </label>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <ProfileInput
                  label="Highest Qualification"
                  value={formData.professional.highestQualification}
                  onChange={(val: string) => setFormData(p => ({ ...p, professional: { ...p.professional, highestQualification: val } }))}
                />
                {!isFresher && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Total Experience</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <input
                          type="number" placeholder="Years"
                          defaultValue={formData.professional.expYears}
                          onChange={(e) => setFormData(p => ({ ...p, professional: { ...p.professional, expYears: e.target.value } }))}
                          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 bg-[#F9FAFB] text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#9CA3AF] uppercase">Yrs</span>
                      </div>
                      <div className="relative">
                        <input
                          type="number" placeholder="Months"
                          defaultValue={formData.professional.expMonths}
                          onChange={(e) => setFormData(p => ({ ...p, professional: { ...p.professional, expMonths: e.target.value } }))}
                          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 bg-[#F9FAFB] text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#9CA3AF] uppercase">Mos</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!isFresher && (
                <>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest block mb-2">Experience</label>
                    {formData.professional.experiences.map((exp: any, i: number) => (
                      <div key={exp.id} className="p-5 border border-[#E5E7EB] rounded-2xl bg-[#F9FAFB] relative group">
                        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {i > 0 && (
                            <button onClick={() => {
                              const newExp = [...formData.professional.experiences];
                              [newExp[i - 1], newExp[i]] = [newExp[i], newExp[i - 1]];
                              setFormData(p => ({ ...p, professional: { ...p.professional, experiences: newExp } }));
                            }} className="p-1 text-[#6B7280] hover:bg-[#E5E7EB] rounded"><ArrowUp className="w-4 h-4" /></button>
                          )}
                          {i < formData.professional.experiences.length - 1 && (
                            <button onClick={() => {
                              const newExp = [...formData.professional.experiences];
                              [newExp[i + 1], newExp[i]] = [newExp[i], newExp[i + 1]];
                              setFormData(p => ({ ...p, professional: { ...p.professional, experiences: newExp } }));
                            }} className="p-1 text-[#6B7280] hover:bg-[#E5E7EB] rounded"><ArrowDown className="w-4 h-4" /></button>
                          )}
                          <button onClick={() => {
                            setFormData(p => ({ ...p, professional: { ...p.professional, experiences: p.professional.experiences.filter((_: any, idx: number) => idx !== i) } }));
                          }} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:pr-20">
                          <ProfileInput
                            label="Company" value={exp.company}
                            onChange={(val: string) => {
                              const newExp = [...formData.professional.experiences];
                              newExp[i].company = val;
                              setFormData(p => ({ ...p, professional: { ...p.professional, experiences: newExp } }));
                            }}
                          />
                          <ProfileInput
                            label="Designation" value={exp.designation}
                            onChange={(val: string) => {
                              const newExp = [...formData.professional.experiences];
                              newExp[i].designation = val;
                              setFormData(p => ({ ...p, professional: { ...p.professional, experiences: newExp } }));
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2 sm:pr-20">
                          <ProfileMonthYearPicker
                            label="From (Year/Month)" value={exp.from}
                            onChange={(val: string) => {
                              const newExp = [...formData.professional.experiences];
                              newExp[i].from = val;
                              setFormData(p => ({ ...p, professional: { ...p.professional, experiences: newExp } }));
                            }}
                          />
                          <div>
                            <ProfileMonthYearPicker
                              label="To (Year/Month)" value={exp.to} isLocked={exp.isCurrent}
                              onChange={(val: string) => {
                                const newExp = [...formData.professional.experiences];
                                newExp[i].to = val;
                                setFormData(p => ({ ...p, professional: { ...p.professional, experiences: newExp } }));
                              }}
                            />
                          </div>
                        </div>
                        <div className="mb-4 flex items-center">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                checked={exp.isCurrent}
                                onChange={(e) => {
                                  let newExp = [...formData.professional.experiences];
                                  if (e.target.checked) {
                                    newExp.forEach((ex: any) => {
                                      ex.isCurrent = false;
                                      if (ex.to === 'Present') ex.to = '';
                                    });
                                    newExp[i].isCurrent = true;
                                    newExp[i].to = 'Present';
                                    const currentItem = newExp.splice(i, 1)[0];
                                    newExp.unshift(currentItem);
                                  } else {
                                    newExp[i].isCurrent = false;
                                    newExp[i].to = '';
                                  }
                                  setFormData(p => ({ ...p, professional: { ...p.professional, experiences: newExp } }));
                                }}
                                className="w-4 h-4 border-2 border-[#D1D5DB] rounded checked:bg-primary checked:border-primary appearance-none transition-all cursor-pointer"
                              />
                              <CheckCircle className={`absolute inset-0 m-auto w-2.5 h-2.5 text-white transition-opacity ${exp.isCurrent ? 'opacity-100' : 'opacity-0'}`} />
                            </div>
                            <span className="text-xs font-bold text-[#6B7280] group-hover:text-[#111827]">I currently work here</span>
                          </label>
                        </div>
                        <ProfileTextarea
                          label="Description" value={exp.description}
                          onChange={(val: string) => {
                            const newExp = [...formData.professional.experiences];
                            newExp[i].description = val;
                            setFormData(p => ({ ...p, professional: { ...p.professional, experiences: newExp } }));
                          }}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => setFormData(p => ({ ...p, professional: { ...p.professional, experiences: [...p.professional.experiences, { id: Date.now(), company: '', designation: '', from: '', to: '', description: '', isCurrent: false }] } }))}
                      className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest hover:underline mt-2"
                    >
                      <Plus className="w-4 h-4" /> Add Experience
                    </button>
                  </div>
                  <ProfileInput
                    label="Notice Period (Days)" type="number"
                    value={formData.professional.noticePeriod}
                    onChange={(val: string) => setFormData(p => ({ ...p, professional: { ...p.professional, noticePeriod: val } }))}
                  />
                </>
              )}
            </div>

            <div className="mt-5">
              <ProfileTextarea
                label="Additional Notes" value={formData.professional.remarks}
                onChange={(val: string) => setFormData(p => ({ ...p, professional: { ...p.professional, remarks: val } }))}
              />
            </div>
          </SectionCard>

          {/* Section 3 — Skills */}
          <SectionCard title="Skills" caption="Add your key skills">
            <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl flex flex-wrap gap-2 items-center focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary transition-all">
              {formData.professional.skills.map((skill: string) => (
                <span key={skill} className="px-3 py-1 text-[10px] font-bold bg-[#F4F5FA] text-primary border border-primary/10 rounded-full flex items-center gap-1.5">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}>
                    <X className="w-3 h-3 text-[#9CA3AF] cursor-pointer hover:text-red-500" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                onBlur={addSkill}
                placeholder="Type a skill and press Enter"
                className="flex-1 min-w-[160px] bg-transparent text-[11px] font-bold focus:outline-none placeholder:text-[#9CA3AF] placeholder:font-normal py-1.5"
              />
            </div>
          </SectionCard>

          {/* Section 4 — Address */}
          <SectionCard title="Address" caption="Your current location">
            <div className="grid grid-cols-1 mb-5">
              <ProfileInput
                label="Address" value={formData.address.street}
                onChange={(val: string) => setFormData(p => ({ ...p, address: { ...p.address, street: val } }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Country</label>
                <div className="relative">
                  <select
                    value={formData.address.country}
                    onChange={(e) => setFormData(p => ({ ...p, address: { ...p.address, country: e.target.value, state: '' } }))}
                    className="w-full border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary appearance-none text-[#111827] hover:border-[#D1D5DB] transition-all"
                  >
                    <option value="">Select country</option>
                    {Object.keys(COUNTRY_STATES).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">State</label>
                <div className="relative">
                  <select
                    value={formData.address.state}
                    onChange={(e) => setFormData(p => ({ ...p, address: { ...p.address, state: e.target.value } }))}
                    disabled={!formData.address.country}
                    className="w-full border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary appearance-none text-[#111827] hover:border-[#D1D5DB] transition-all disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] disabled:cursor-not-allowed"
                  >
                    <option value="">{formData.address.country ? 'Select state' : 'Select country first'}</option>
                    {(COUNTRY_STATES[formData.address.country] || []).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ProfileInput
                label="Town/City" value={formData.address.city}
                onChange={(val: string) => setFormData(p => ({ ...p, address: { ...p.address, city: val } }))}
              />
              <ProfileInput
                label="Zip/Postal Code" value={formData.address.zip}
                onChange={(val: string) => setFormData(p => ({ ...p, address: { ...p.address, zip: val } }))}
              />
            </div>
          </SectionCard>

          {/* Section 5 — Salary Information */}
          <SectionCard title="Salary Information" caption="Compensation details">
            <div className={`grid gap-5 grid-cols-1 sm:grid-cols-2 ${isFresher ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
              <ProfileSelect
                label="CTC Type" options={['Annual', 'Monthly']}
                value={formData.salary.ctcType}
                onChange={(val: string) => setFormData(p => ({ ...p, salary: { ...p.salary, ctcType: val } }))}
              />
              <ProfileSelect
                label="Currency" options={['INR', 'USD', 'GBP', 'EUR']}
                value={formData.salary.currency}
                onChange={(val: string) => setFormData(p => ({ ...p, salary: { ...p.salary, currency: val } }))}
              />
              {!isFresher && (
                <ProfileInput
                  label="Current CTC" type="number"
                  value={formData.salary.currentCtc}
                  onChange={(val: string) => setFormData(p => ({ ...p, salary: { ...p.salary, currentCtc: val } }))}
                />
              )}
              <ProfileInput
                label="Expected CTC" type="number"
                value={formData.salary.expectedCtc}
                onChange={(val: string) => setFormData(p => ({ ...p, salary: { ...p.salary, expectedCtc: val } }))}
              />
            </div>
          </SectionCard>


          {/* Profile Visibility */}
          <SectionCard title="Profile Visibility" caption="Control who can see your profile">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button type="button" onClick={() => setVisibility('visible')}
                className={`relative text-left p-4 rounded-xl border-2 transition-all ${visibility === 'visible' ? 'border-primary bg-primary/5' : 'border-[#E5E7EB] hover:border-[#C7C9F0]'}`}>
                <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${visibility === 'visible' ? 'border-primary' : 'border-[#D1D5DB]'}`}>
                  {visibility === 'visible' && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <Eye className="w-4 h-4 text-primary mb-1.5" />
                <p className="text-xs font-black text-[#111827] leading-tight mb-0.5">Visible to recruiters</p>
                <p className="text-[10px] text-[#6B7280] leading-snug">Discoverable without application</p>
              </button>
              <button type="button" onClick={() => setVisibility('private')}
                className={`relative text-left p-4 rounded-xl border-2 transition-all ${visibility === 'private' ? 'border-primary bg-primary/5' : 'border-[#E5E7EB] hover:border-[#C7C9F0]'}`}>
                <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${visibility === 'private' ? 'border-primary' : 'border-[#D1D5DB]'}`}>
                  {visibility === 'private' && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <EyeOff className="w-4 h-4 text-[#6B7280] mb-1.5" />
                <p className="text-xs font-black text-[#111827] leading-tight mb-0.5">Browse privately</p>
                <p className="text-[10px] text-[#6B7280] leading-snug">Only visible on active applications</p>
              </button>
            </div>
            {visibility === 'visible' && (
              <label className="flex items-center justify-between gap-3 mt-4 cursor-pointer">
                <span className="text-xs font-bold text-[#374151]">Allow recruiters to contact me for future roles</span>
                <button type="button" onClick={() => setAllowContact(v => !v)}
                  className={`relative rounded-full transition-colors shrink-0 ${allowContact ? 'bg-primary' : 'bg-[#D1D5DB]'}`}
                  style={{ minWidth: '2.5rem', height: '1.375rem' }}>
                  <span className={`absolute top-0.5 left-0.5 bg-white rounded-full shadow transition-transform ${allowContact ? 'translate-x-[1.125rem]' : ''}`} style={{ width: '1.125rem', height: '1.125rem' }} />
                </button>
              </label>
            )}
          </SectionCard>
        </div>

        {/* Inline action buttons */}
        <div className="flex items-center justify-end gap-4 mt-10 mb-10">
          <button
            onClick={backToProfile}
            className="px-8 py-3 border border-[#E5E7EB] text-[#374151] text-xs font-black rounded-xl hover:bg-[#F9FAFB] transition-all uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-primary text-white text-xs font-black rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all uppercase tracking-widest flex items-center gap-2 active:scale-95"
          >
            <Check className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </PortalLayout>
  );
}

// ── Profile-style section card (always open, flat) ──
function SectionCard({ title, caption, children }: { title: string; caption: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 sm:p-8">
      <div className="mb-6">
        <h3 className="text-sm font-black text-[#111827]">{title}</h3>
        <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mt-1">{caption}</p>
      </div>
      {children}
    </div>
  );
}

// ── Profile-style form field components (softer inputs) ──
function ProfileInput(props: any) {
  const { label, required, value, isLocked, type = 'text', placeholder, onChange } = props;
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-[#6B7280] ml-1 flex items-center gap-1.5 min-h-[1.2rem] uppercase tracking-widest">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {isLocked && <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-[#9CA3AF]"><Lock className="w-3.5 h-3.5" /></div>}
        <input
          type={type}
          defaultValue={value}
          readOnly={isLocked}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full border rounded-xl px-4 py-2.5 text-sm font-bold transition-all focus:outline-none focus:ring-4 ${
            isLocked
              ? 'bg-[#F3F4F6] border-[#E5E7EB] text-[#9CA3AF] pl-10 cursor-not-allowed shadow-inner'
              : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:ring-primary/10 focus:border-primary hover:border-[#D1D5DB] cursor-text'
          }`}
        />
      </div>
    </div>
  );
}

function ProfilePhoneInput({ label, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">{label}</label>
      <div className="flex gap-2">
        <div className="w-[72px] shrink-0 relative">
          <select className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs font-bold appearance-none bg-[#F9FAFB]">
            <option>+91</option>
            <option>+1</option>
            <option>+44</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="relative flex-1">
          <input
            type="text"
            defaultValue={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 bg-[#F9FAFB] text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none placeholder:text-gray-300 transition-all"
            placeholder="98765 43210"
          />
        </div>
      </div>
    </div>
  );
}

function ProfileSelect({ label, options, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <select
          defaultValue={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary appearance-none text-[#111827] hover:border-[#D1D5DB] transition-all"
        >
          {options.map((opt: string) => <option key={opt} value={opt === 'Select' ? '' : opt}>{opt}</option>)}
        </select>
        <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

function ProfileMonthYearPicker({ label, required, value, isLocked, onChange }: any) {
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

  if (isLocked) {
    return <ProfileInput label={label} value="Present" isLocked={true} type="text" onChange={() => {}} />;
  }

  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1 flex items-center gap-1.5 min-h-[1.2rem]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <select
            value={month || ''}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="w-full border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary appearance-none text-[#111827] hover:border-[#D1D5DB] transition-all"
          >
            <option value="" disabled>Month</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="relative flex-1">
          <select
            value={year || ''}
            onChange={(e) => handleYearChange(e.target.value)}
            className="w-full border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary appearance-none text-[#111827] hover:border-[#D1D5DB] transition-all"
          >
            <option value="" disabled>Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

function ProfileTextarea({ label, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">{label}</label>
      <textarea
        defaultValue={value}
        onChange={(e) => onChange?.(e.target.value)}
        rows={4}
        className="w-full border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary text-[#111827] resize-none hover:border-[#D1D5DB] transition-all"
      />
    </div>
  );
}
