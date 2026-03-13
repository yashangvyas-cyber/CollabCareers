import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { ChevronDown, CheckCircle, Upload, Trash2, FileText, Zap, AlertCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Job, CustomField } from '../store/types';

export default function ApplicationFormPage() {
  const { jobId } = useParams();
  const { jobs, currentUser, submitApplication, alumniVerified } = useApp();
  const navigate = useNavigate();
  
  const job = jobs.find(j => j.id === jobId) || jobs[0] || {
    id: '1', title: 'React Developer', businessUnit: 'Yopmails', customFields: []
  } as any as Job;

  const [step, setStep] = useState(0); // 0 = CV Upload, 1 = Form, 2 = Review
  const [extracting, setExtracting] = useState(false);
  const [resumeName, setResumeName] = useState('');

  const [formData, setFormData] = useState({
    personal: {
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      dob: '12/05/1998',
      gender: 'Male',
      maritalStatus: 'Single',
      linkedin: 'linkedin.com/in/yashangpatel',
    },
    professional: {
      isFresher: false,
      totalExperience: '3 Years, 2 Months',
      highestQualification: 'B.Tech Computer Science',
      currentOrg: 'MindInventory',
      currentDesignation: 'UI Developer',
      noticePeriod: '30',
      skills: 'React, JavaScript, TypeScript, Redux',
      remarks: '',
    },
    salary: {
      ctcType: 'Annual',
      currency: 'INR',
      currentCtc: '6',
      expectedCtc: '9',
    },
    customAnswers: {} as Record<string, any>,
  });

  useEffect(() => {
    if (!currentUser) {
      navigate(`/portal/yopmails/register?job=${jobId || '1'}`);
    }
  }, [currentUser, navigate, jobId]);

  const handleCvUpload = () => {
    setResumeName('resume_yashang.pdf');
    setExtracting(true);
    setTimeout(() => {
      setExtracting(false);
      setStep(1);
    }, 2500);
  };

  const handleSubmit = () => {
    submitApplication({
      id: `APP-${Date.now()}`,
      candidateId: currentUser?.id || 'guest',
      jobId: job.id,
      status: 'Submitted',
      appliedAt: new Date().toISOString(),
      answers: formData.customAnswers,
      resumeUrl: resumeName,
    });
    navigate(`/portal/yopmails/confirmation/${job.id}`);
  };

  if (!currentUser) return null;

  return (
    <PortalLayout isLoggedIn>
      <div className="max-w-3xl mx-auto px-6 py-8">
        
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-8 max-w-xl mx-auto">
          {[
            { label: 'CV Upload', s: 0 },
            { label: 'Fill Details', s: 1 },
            { label: 'Review & Submit', s: 2 }
          ].map((item, i) => (
            <div key={item.label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step > item.s
                    ? 'bg-green-500 text-white'
                    : step === item.s
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-[#E5E7EB] text-[#9CA3AF]'
                }`}>
                  {step > item.s ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-bold ${step === item.s ? 'text-primary' : 'text-[#9CA3AF]'}`}>
                  {item.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`flex-1 h-0.5 mx-4 -mt-6 transition-colors ${step > i ? 'bg-green-500' : 'bg-[#E5E7EB]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Job Context */}
        <div className="flex items-center gap-3 mb-6 p-4 bg-white rounded-xl border border-[#E5E7EB] shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-inner">
            {job.businessUnit?.[0] || 'Y'}
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-[#1A1A2E] leading-tight">{job.title}</h2>
            <p className="text-xs text-[#6B7280]">{job.businessUnit} · Career Portal</p>
          </div>
          {alumniVerified.verified && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#E07C3F]/10 text-[#E07C3F] rounded-full border border-[#E07C3F]/20">
              <Zap className="w-3.5 h-3.5 fill-[#E07C3F]" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Alumni Verified</span>
            </div>
          )}
        </div>

        {/* STEP 0: CV Upload */}
        {step === 0 && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl overflow-hidden p-10 text-center animate-in zoom-in-95 duration-300">
            <div className="max-w-md mx-auto">
              <div 
                onClick={handleCvUpload}
                className={`relative border-2 border-dashed rounded-3xl p-10 cursor-pointer transition-all duration-300 ${
                  extracting ? 'border-primary bg-primary/5' : 'border-[#D1D5DB] hover:border-primary hover:bg-primary/5'
                }`}
              >
                {!extracting ? (
                  <>
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">Upload your Resume</h3>
                    <p className="text-sm text-[#6B7280] mb-6">We'll use it to auto-fill the application form for you.</p>
                    <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-full hover:bg-[#292bb0] transition-colors shadow-lg shadow-primary/20">
                      Standard Resume Format (PDF/DOC)
                    </div>
                  </>
                ) : (
                  <div className="py-2">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                    <h3 className="text-lg font-bold text-primary mb-2">Extracting your details...</h3>
                    <p className="text-sm text-[#6B7280]">Our AI is parsing your CV to pre-fill the form.</p>
                    <div className="mt-8 h-1.5 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-progress duration-[2500ms]" style={{ width: '100%' }} />
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-[#9CA3AF] mt-6">
                OR <button className="text-primary font-bold hover:underline" onClick={() => setStep(1)}>Fill details manually</button>
              </p>
            </div>
          </div>
        )}

        {/* STEP 1: Fill Details */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-green-800">CV Auto-Extracted</p>
                <p className="text-xs text-green-600">We've pre-filled the form with data from <b>{resumeName}</b>. Please review carefully.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <Section title="Personal Information" defaultOpen>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormInput label="First Name" value={formData.personal.firstName} readOnly />
                  <FormInput label="Last Name" value={formData.personal.lastName} readOnly />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormInput label="Email Address" value={formData.personal.email} readOnly />
                  <FormInput label="Phone Number" value={formData.personal.phone} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <FormInput label="Date of Birth" value={formData.personal.dob} isExtracted />
                  <FormInput label="Gender" value={formData.personal.gender} isExtracted />
                  <FormInput label="Marital Status" value={formData.personal.maritalStatus} isExtracted />
                </div>
              </Section>

              <Section title="Professional Details">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormInput label="Current Organization" value={formData.professional.currentOrg} isExtracted />
                  <FormInput label="Current Designation" value={formData.professional.currentDesignation} isExtracted />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormInput label="Total Experience" value={formData.professional.totalExperience} isExtracted />
                  <FormInput label="Highest Qualification" value={formData.professional.highestQualification} isExtracted />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormSelect label="Notice Period (Days)" value={formData.professional.noticePeriod} options={['Immediate', '15', '30', '45', '60', '90']} />
                  <FormInput label="Skills" value={formData.professional.skills} isExtracted />
                </div>
              </Section>

              <Section title="Salary Information">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormSelect label="CTC Type" value={formData.salary.ctcType} options={['Annual', 'Monthly', 'Hourly']} />
                  <FormSelect label="Currency" value={formData.salary.currency} options={['INR', 'USD', 'GBP', 'EUR']} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Current CTC" value={formData.salary.currentCtc} />
                  <FormInput label="Expected CTC" value={formData.salary.expectedCtc} />
                </div>
              </Section>

              {/* DYNAMIC CUSTOM FIELDS */}
              {job.customFields && job.customFields.length > 0 && (
                <div className="border-t border-[#E5E7EB]">
                  <div className="px-6 py-4 bg-primary/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-[#1A1A2E]">Additional Information</span>
                       <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">Required by {job.businessUnit}</span>
                    </div>
                  </div>
                  <div className="px-6 py-5 space-y-4">
                    {job.customFields.map((f: CustomField) => (
                      <div key={f.id}>
                        <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                          {f.label} {f.required && <span className="text-red-500">*</span>}
                        </label>
                        {f.type === 'Dropdown' ? (
                          <div className="relative">
                            <select 
                              onChange={(e) => setFormData({...formData, customAnswers: {...formData.customAnswers, [f.label]: e.target.value}})}
                              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white appearance-none"
                            >
                              <option value="">Select an option</option>
                              {f.options?.map(opt => <option key={opt.id} value={opt.value}>{opt.value}</option>)}
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        ) : f.type === 'Yes/No' ? (
                          <div className="flex gap-4">
                            {['Yes', 'No'].map(o => (
                              <label key={o} className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name={f.id} value={o} onChange={(e) => setFormData({...formData, customAnswers: {...formData.customAnswers, [f.label]: e.target.value}})} className="w-4 h-4 text-primary" />
                                <span className="text-sm text-[#374151]">{o}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <input
                            type={f.type === 'Number' ? 'number' : f.type === 'Date' ? 'date' : 'text'}
                            placeholder={f.label}
                            onChange={(e) => setFormData({...formData, customAnswers: {...formData.customAnswers, [f.label]: e.target.value}})}
                            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="px-6 py-5 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between">
                <button onClick={() => setStep(0)} className="text-sm text-[#6B7280] hover:text-[#374151] font-medium transition-colors">
                  ← Change Resume
                </button>
                <div className="flex gap-3">
                  <button className="px-6 py-2.5 bg-white border border-[#E5E7EB] text-[#374151] text-sm font-semibold rounded-lg hover:bg-[#F9FAFB] transition-colors">
                    Save Draft
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-[#292bb0] transition-colors shadow-lg shadow-primary/10"
                  >
                    Review Application →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Review */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="px-8 py-8 border-b border-[#F3F4F6] bg-gradient-to-r from-primary/5 to-white">
              <h2 className="text-2xl font-bold text-[#1A1A2E]">Review Your Application</h2>
              <p className="text-sm text-[#6B7280] mt-1">Ready to start the next chapter with {job.businessUnit}?</p>
            </div>
            
            <div className="px-8 py-8 space-y-8">
              <ReviewSection title="Personal" data={[
                { label: 'Full Name', value: `${formData.personal.firstName} ${formData.personal.lastName}` },
                { label: 'Email', value: formData.personal.email },
                { label: 'Phone', value: formData.personal.phone }
              ]} />

              <ReviewSection title="Professional" data={[
                { label: 'Current Role', value: `${formData.professional.currentDesignation} at ${formData.professional.currentOrg}` },
                { label: 'Experience', value: formData.professional.totalExperience },
                { label: 'Notice Period', value: `${formData.professional.noticePeriod} Days` }
              ]} />

              <ReviewSection title="Additional Info" data={[
                ...Object.entries(formData.customAnswers).map(([k, v]) => ({ label: k, value: String(v) })),
                { label: 'Resume', value: resumeName }
              ]} isHighlight />
            </div>

            <div className="px-8 py-6 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-sm font-bold text-primary hover:underline"
              >
                ← Back to Edit
              </button>
              <button
                onClick={handleSubmit}
                className="px-10 py-3.5 bg-primary text-white text-base font-bold rounded-xl hover:bg-[#292bb0] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/25 flex items-center gap-2"
              >
                Submit Application <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-[#E5E7EB] first:border-t-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 flex items-center justify-between group hover:bg-[#F9FAFB] transition-colors"
      >
        <span className="text-sm font-bold text-[#1A1A2E] group-hover:text-primary transition-colors">{title}</span>
        <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform ${open ? 'rotate-180' : 'rotate-0'}`} />
      </button>
      {open && <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">{children}</div>}
    </div>
  );
}

function FormInput({ label, value, readOnly, isExtracted }: { label: string; value: string; readOnly?: boolean; isExtracted?: boolean }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="text"
          defaultValue={value}
          readOnly={readOnly}
          className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
            readOnly ? 'bg-[#F9FAFB] text-[#9CA3AF]' : isExtracted ? 'border-green-300 bg-green-50/30' : 'border-[#E5E7EB] bg-white'
          }`}
        />
        {isExtracted && <Zap className="w-3 h-3 text-green-500 absolute right-3 top-1/2 -translate-y-1/2 fill-green-500" />}
      </div>
    </div>
  );
}

function FormSelect({ label, value, options }: { label: string; value?: string; options: string[] }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <select
          defaultValue={value}
          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white appearance-none"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

function ReviewSection({ title, data, isHighlight }: { title: string, data: {label: string, value: string}[], isHighlight?: boolean }) {
  return (
    <div className={`p-6 rounded-2xl border ${isHighlight ? 'bg-primary shadow-sm border-primary/20' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
      <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isHighlight ? 'text-white/80' : 'text-[#9CA3AF]'}`}>{title}</h3>
      <div className="grid grid-cols-2 gap-y-4 gap-x-8">
        {data.map(item => (
          <div key={item.label}>
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isHighlight ? 'text-white/60' : 'text-[#9CA3AF]'}`}>{item.label}</p>
            <p className={`text-sm font-semibold truncate ${isHighlight ? 'text-white' : 'text-[#1A1A2E]'}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
