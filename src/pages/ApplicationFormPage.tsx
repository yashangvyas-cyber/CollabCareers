import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { 
  ChevronDown, CheckCircle, Upload, Zap, Sparkles, 
  Lock, ArrowRight, Download, X, FileText,
  Plus, ExternalLink
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Job, CustomField } from '../store/types';

const formatDateForBanner = (dateString: string) => {
  if (!dateString) return '18 Mar 2026';
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  try {
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (e) {
    return '18 Mar 2026';
  }
};

export default function ApplicationFormPage() {
  const { jobId } = useParams();
  const { jobs, currentUser, applications, submitApplication, saveDraft, alumniVerified } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const prefillFromId = location.state?.prefillFrom;
  const [prefillSource, setPrefillSource] = useState<any>(null);
  
  // Find job from state
  const job = jobs.find(j => j.id === jobId) || jobs[0] || {
    id: 'd1', title: 'React Developer', businessUnit: 'Yopmails', customFields: [
      { id: '1', label: 'Portfolio URL', type: 'Text', required: true },
      { id: '2', label: 'Are you open to relocate?', type: 'Yes/No', required: false }
    ]
  } as any as Job;

  const [step, setStep] = useState(0); // 0 = CV Upload, 1 = Form, 2 = Review
  const [extracting, setExtracting] = useState(false);
  const [resumeName, setResumeName] = useState('');
  const [isFresher, setIsFresher] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [jobClosed, setJobClosed] = useState(false);

  const [formData, setFormData] = useState({
    personal: {
      firstName: currentUser?.firstName || 'Alex',
      lastName: currentUser?.lastName || 'Patel',
      gender: 'Male',
      contactNumber: currentUser?.phone || '98765 43210',
      email: currentUser?.email || 'alex.patel@example.com',
      dob: '12/05/1998',
      linkedin: 'linkedin.com/in/alexpatel',
      maritalStatus: 'Single',
    },
    professional: {
      currentOrg: 'MindInventory',
      currentDesignation: 'UI Developer',
      expYears: '3',
      expMonths: '2',
      highestQualification: 'B.Tech Computer Science',
      noticePeriod: '30',
      skills: ['React', 'JavaScript', 'TypeScript', 'Redux'],
      remarks: '',
    },
    salary: {
      ctcType: 'Annual',
      currency: 'INR',
      currentCtc: '6',
      expectedCtc: '9',
    },
    address: {
      street: '123, Business Park, S.G. Highway',
      country: 'India',
      state: 'Gujarat',
      city: 'Ahmedabad',
      zip: '380015',
    },
    customAnswers: {} as Record<string, any>,
  });

  const [collapsedSections, setCollapsedSections] = useState<Record<number, boolean>>({
    1: false, 2: false, 3: false, 4: false, 5: false
  });

  const toggleSection = (id: number) => {
    setCollapsedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (!currentUser) {
      navigate(`/portal/yopmails/register?job=${jobId || '1'}`);
      return;
    }

    // Check if job is closed
    if (job?.status === 'Close') {
      setJobClosed(true);
    }

    // Handle Prefill from Previous Application
    if (prefillFromId) {
      const prevApp = applications.find(a => a.id === prefillFromId);
      if (prevApp && prevApp.answers?._fullFormData) {
        const sourceData = prevApp.answers._fullFormData;
        setFormData(() => ({
          ...sourceData,
          personal: { ...sourceData.personal, email: currentUser.email }, // Keep current email
          customAnswers: {}, // Never prefill custom answers
        }));
        setResumeName(prevApp.resumeUrl);
        setPrefillSource({
          title: jobs.find(j => j.id === prevApp.jobId)?.title || 'Previous Job',
          date: new Date(prevApp.appliedAt).toLocaleDateString()
        });
        setStep(1);
        return;
      }
    }

    // Check for existing draft or continueDraft state
    const continueDraft = location.state?.continueDraft;

    if (continueDraft) {
      // Populate with realistic dummy draft data for Business Analyst
      setFormData({
        personal: {
          firstName: 'Alex',
          lastName: 'Patel',
          gender: 'Male',
          contactNumber: '98765 43210',
          email: currentUser.email,
          dob: '15/06/1996',
          linkedin: 'linkedin.com/in/alexpatel',
          maritalStatus: 'Single',
        },
        professional: {
          currentOrg: 'TechSolutions Inc.',
          currentDesignation: 'Senior Frontend Engineer',
          expYears: '5',
          expMonths: '0',
          highestQualification: 'B.Tech',
          noticePeriod: '30',
          skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Redux'],
          remarks: 'I am passionate about building accessible and performant web applications.',
        },
        salary: {
          ctcType: 'Annual',
          currency: 'INR',
          currentCtc: '18.5',
          expectedCtc: '24',
        },
        address: {
          street: '402, Skyline Apartments, Satellite',
          country: 'India',
          state: 'Gujarat',
          city: 'Ahmedabad',
          zip: '380015',
        },
        customAnswers: {
          'Are you open to relocate?': 'Yes'
        } as Record<string, any>,
      });
      setResumeName('Alex_Patel_Resume.pdf');
      setStep(1);
      // Force all sections expanded
      setCollapsedSections({
        1: false, 2: false, 3: false, 4: false, 5: false
      });
      return;
    }

    // Check for existing draft (auto-resumption)
    const draft = applications.find(a => a.jobId === job?.id && a.candidateId === currentUser.id && a.status === 'Draft');
    if (draft) {
      setFormData(prev => ({
        ...(draft.answers?._fullFormData || prev),
        customAnswers: draft.answers || {}
      }));
      setResumeName(draft.resumeUrl);
      setStep(1); 
      return;
    }

    // NEW: Auto-prefill from latest SUBMITTED application if not a draft
    const latestSubmission = applications
      .filter(a => a.candidateId === currentUser.id && a.status === 'Submitted')
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())[0];

    if (latestSubmission && step === 0 && !resumeName) {
      const sourceData = latestSubmission.answers?._fullFormData;
      if (sourceData) {
        setFormData(prev => ({
          ...prev,
          ...sourceData,
          personal: { ...sourceData.personal, email: currentUser.email }, // Privacy: keep current session email
          customAnswers: {}, // Always fresh for new job
        }));
        setResumeName(latestSubmission.resumeUrl);
        setPrefillSource({
          title: jobs.find(j => j.id === latestSubmission.jobId)?.title || 'Previous Job',
          date: new Date(latestSubmission.appliedAt).toLocaleDateString()
        });
      }
    }
  }, [currentUser, navigate, jobId, applications, job, prefillFromId, jobs, step, resumeName]);

  const handleCvUpload = () => {
    setExtracting(true);
    setTimeout(() => {
      setResumeName('Alex_Patel_Resume.pdf');
      setExtracting(false);
      setStep(1);
    }, 2000);
  };

  const handleSaveDraft = () => {
    saveDraft({
      id: `DRAFT-${Date.now()}`,
      candidateId: currentUser?.id || 'guest',
      jobId: job.id,
      status: 'Draft',
      appliedAt: new Date().toISOString(),
      answers: { ...formData.customAnswers, _fullFormData: formData },
      resumeUrl: resumeName || 'Manually Filled',
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = () => {
    submitApplication({
      id: `APP-${Date.now()}`,
      candidateId: currentUser?.id || 'guest',
      jobId: job.id,
      status: 'Submitted',
      appliedAt: new Date().toISOString(),
      answers: { ...formData.customAnswers, _fullFormData: formData },
      resumeUrl: resumeName || 'Manually Filled',
    });
    navigate(`/portal/yopmails/confirmation/${job.id}`);
  };

  if (!currentUser) return null;

  return (
    <PortalLayout>
      <div className="max-w-4xl mx-auto px-6 py-10 min-h-[80vh] flex flex-col">
        
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-16 max-w-3xl mx-auto relative px-10">
          {[
            { label: 'CV UPLOAD', s: 0 },
            { label: 'FILL DETAILS', s: 1 },
            { label: 'REVIEW & SUBMIT', s: 2 }
          ].map((item, i) => (
            <div key={item.label} className="flex flex-col items-center z-10 transition-all duration-500 min-w-[120px]">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 border-2 ${
                step > item.s
                  ? 'bg-[#3538CD] border-[#3538CD] text-white'
                  : step === item.s
                  ? 'bg-white border-[#3538CD] text-[#3538CD]'
                  : 'bg-white border-[#D1D5DB] text-[#9CA3AF]'
              }`}>
                {step > item.s ? <CheckCircle className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`mt-3 text-[10px] font-black tracking-[0.1em] uppercase text-center ${step === item.s ? 'text-[#3538CD]' : 'text-[#9CA3AF]'}`}>
                {item.label}
              </span>
            </div>
          ))}
          {/* Connector Lines */}
          <div className="absolute top-5 left-[20%] right-[20%] h-[2px] bg-[#E5E7EB] -z-0" />
          <div 
            className="absolute top-5 left-[20%] h-[2px] bg-[#3538CD] -z-0 transition-all duration-500" 
            style={{ width: step === 0 ? '0%' : step === 1 ? '30%' : '60%' }}
          />
        </div>

        {/* Job Context Banner */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-[#3538CD] flex items-center justify-center text-white font-black text-2xl shadow-inner uppercase overflow-hidden">
             {job.businessUnit?.[0] || 'Y'}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-[#111827] leading-tight">{job.title}</h2>
            <div className="flex items-center gap-2 mt-1 font-bold">
              <span className="text-xs text-[#6B7280]">{job.businessUnit}</span>
              {alumniVerified.verified && (
                <div className="flex items-center gap-2 px-4 py-1.5 bg-[#3538CD]/10 text-[#3538CD] rounded-full border border-[#3538CD]/20">
                  <Zap className="w-4 h-4 fill-[#3538CD]" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Alumni Verified</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {jobClosed && (
          <div className="flex items-center gap-4 mb-8 p-4 bg-[#3538CD]/5 rounded-2xl border border-[#3538CD]/20 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#3538CD] flex items-center justify-center shrink-0">
              <X className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-[#3538CD] tracking-wide">Job Closed</p>
              <p className="text-sm text-[#3538CD]/80 font-bold mt-0.5">This job is no longer accepting applications.</p>
            </div>
          </div>
        )}

        {/* STEP 0: CV Upload */}
        {step === 0 && (
          <div className="flex-1">
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl overflow-hidden p-12 text-center animate-in zoom-in-95 duration-500">
              <div className="max-w-lg mx-auto">
                {!extracting ? (
                  <div 
                    onClick={handleCvUpload}
                    className="group relative border-2 border-dashed border-[#D1D5DB] hover:border-[#3538CD] rounded-[40px] p-16 cursor-pointer transition-all duration-300 hover:bg-[#F4F5FA] text-center"
                  >
                    <div className="w-20 h-20 bg-[#F4F5FA] group-hover:bg-[#3538CD]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-colors">
                      <Upload className="w-10 h-10 text-[#3538CD]" />
                    </div>
                    <h3 className="text-2xl font-black text-[#111827] mb-3">Upload your Resume</h3>
                    <p className="text-[#6B7280] mb-8 font-medium">Drag and drop your CV here or click to browse</p>
                    
                    <p className="text-xs text-[#9CA3AF] font-bold uppercase tracking-widest">Accepted formats: PDF, DOC, DOCX · Max 5MB</p>
                  </div>
                ) : (
                  <div className="py-10">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                       <div className="absolute inset-0 border-4 border-[#3538CD]/10 rounded-full" />
                       <div className="absolute inset-0 border-4 border-[#3538CD] border-t-transparent rounded-full animate-spin" />
                       <div className="absolute inset-0 m-auto flex items-center justify-center">
                          <FileText className="w-10 h-10 text-[#3538CD]" />
                       </div>
                    </div>
                    <h3 className="text-2xl font-black text-[#3538CD] mb-3">Extracting your details...</h3>
                    <p className="text-[#6B7280] font-medium mb-10 text-center">Our AI is parsing your CV to pre-fill the form.</p>
                    <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div className="h-full bg-[#3538CD] animate-progress" style={{ width: '100%' }} />
                    </div>
                  </div>
                )}

              </div>
            </div>
            
            <div className="mt-10 flex justify-end px-4">
               <button onClick={() => setStep(1)} className="text-[#3538CD] font-black text-sm hover:underline flex items-center gap-1">
                 Skip, fill manually →
               </button>
            </div>
          </div>
        )}

        {/* STEP 1: Fill Details */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {location.state?.continueDraft && (
              <div className="bg-[#3538CD]/5 border border-[#3538CD]/20 rounded-2xl p-5 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 mb-6">
                <div className="w-10 h-10 bg-[#3538CD] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#3538CD]/20">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#3538CD] tracking-wide uppercase tracking-widest text-[10px]">Resuming your draft</p>
                  <p className="text-sm text-[#3538CD]/80 font-bold mt-0.5">
                    ✦ {location.state.draftJobTitle || 'Business Analyst'} · Last saved {formatDateForBanner(location.state.lastSaved)}
                  </p>
                </div>
              </div>
            )}

            {prefillSource && (
              <div className="bg-[#3538CD]/5 border border-[#3538CD]/20 rounded-2xl p-5 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="w-10 h-10 bg-[#3538CD] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#3538CD]/20">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#3538CD] tracking-wide uppercase tracking-widest text-[10px]">Prefilled from your previous application</p>
                  <p className="text-sm text-[#3538CD]/80 font-bold mt-0.5">
                    ✦ {prefillSource.title} · {prefillSource.date}
                  </p>
                </div>
              </div>
            )}

            {resumeName && !prefillSource && (
              <div className="bg-[#3538CD]/5 border border-[#3538CD]/10 rounded-2xl p-5 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="w-10 h-10 bg-[#3538CD] rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-[#3538CD]/20">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#3538CD] tracking-wide uppercase tracking-widest text-[10px]">CV Auto-Extracted</p>
                  <p className="text-sm text-[#3538CD]/70 font-bold mt-0.5">We've pre-filled the form with data from <b>{resumeName}</b>. Please review and edit if needed.</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Section 1 — Candidate Information */}
              <FormCollapsibleCard 
                id={1} 
                title="Candidate Information" 
                isCollapsed={collapsedSections[1]} 
                onToggle={() => toggleSection(1)}
              >
                 <div className="grid grid-cols-2 gap-6 mb-6">
                    <FormInput 
                      label="First Name" 
                      required 
                      value={formData.personal.firstName} 
                      isExtracted={!!resumeName} 
                      onChange={(val: string) => setFormData(p => ({ ...p, personal: { ...p.personal, firstName: val }}))}
                    />
                    <FormInput 
                      label="Last Name" 
                      required 
                      value={formData.personal.lastName} 
                      isExtracted={!!resumeName} 
                      onChange={(val: string) => setFormData(p => ({ ...p, personal: { ...p.personal, lastName: val }}))}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-6 mb-6">
                    <FormSelect 
                      label="Gender" 
                      options={['Select', 'Male', 'Female', 'Other', 'Prefer not to say']} 
                      value={formData.personal.gender} 
                      onChange={(val: string) => setFormData(p => ({ ...p, personal: { ...p.personal, gender: val }}))}
                    />
                    <FormPhoneInput 
                      label="Contact Number" 
                      required 
                      value={formData.personal.contactNumber} 
                      isExtracted={!!resumeName} 
                      onChange={(val: string) => setFormData(p => ({ ...p, personal: { ...p.personal, contactNumber: val }}))}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-6 mb-6">
                    <FormInput label="Email Address" required value={formData.personal.email} isLocked />
                    <FormInput 
                      label="Date of Birth" 
                      value={formData.personal.dob} 
                      type="date" 
                      isExtracted={!!resumeName} 
                      onChange={(val: string) => setFormData(p => ({ ...p, personal: { ...p.personal, dob: val }}))}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <FormInput 
                      label="LinkedIn Profile" 
                      value={formData.personal.linkedin} 
                      placeholder="linkedin.com/in/..." 
                      onChange={(val: string) => setFormData(p => ({ ...p, personal: { ...p.personal, linkedin: val }}))}
                    />
                    <FormSelect 
                      label="Marital Status" 
                      options={['Select', 'Single', 'Married', 'Other']} 
                      value={formData.personal.maritalStatus} 
                      onChange={(val: string) => setFormData(p => ({ ...p, personal: { ...p.personal, maritalStatus: val }}))}
                    />
                 </div>
              </FormCollapsibleCard>

              {/* Section 2 — Professional Details */}
              <FormCollapsibleCard 
                id={2} 
                title="Professional Details" 
                isCollapsed={collapsedSections[2]} 
                onToggle={() => toggleSection(2)}
              >
                <div className="mb-8">
                   <label className="flex items-center gap-3 cursor-pointer group w-fit">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          checked={isFresher} 
                          onChange={(e) => setIsFresher(e.target.checked)}
                          className="w-5 h-5 border-2 border-[#D1D5DB] rounded-md checked:bg-[#3538CD] checked:border-[#3538CD] appearance-none transition-all cursor-pointer" 
                        />
                        <CheckCircle className={`absolute inset-0 m-auto w-3.5 h-3.5 text-white transition-opacity ${isFresher ? 'opacity-100' : 'opacity-0'}`} />
                      </div>
                      <span className="text-sm font-black text-[#374151] group-hover:text-[#111827] uppercase tracking-widest">I am a Fresher</span>
                   </label>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <FormInput 
                      label="Highest Qualification" 
                      value={formData.professional.highestQualification} 
                      isExtracted={!!resumeName} 
                      onChange={(val: string) => setFormData(p => ({ ...p, professional: { ...p.professional, highestQualification: val }}))}
                    />
                    {!isFresher && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Total Experience</label>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <input 
                              type="number" 
                              placeholder="Years" 
                              defaultValue={formData.professional.expYears} 
                              onChange={(e) => setFormData(p => ({ ...p, professional: { ...p.professional, expYears: e.target.value }}))}
                              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD]" 
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#9CA3AF] uppercase">Yrs</span>
                          </div>
                          <div className="relative">
                            <input 
                              type="number" 
                              placeholder="Months" 
                              defaultValue={formData.professional.expMonths} 
                              onChange={(e) => setFormData(p => ({ ...p, professional: { ...p.professional, expMonths: e.target.value }}))}
                              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD]" 
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#9CA3AF] uppercase">Mos</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {!isFresher && (
                    <>
                      <div className="grid grid-cols-2 gap-6">
                        <FormInput 
                          label="Current Organization" 
                          value={formData.professional.currentOrg} 
                          isExtracted={!!resumeName} 
                          onChange={(val: string) => setFormData(p => ({ ...p, professional: { ...p.professional, currentOrg: val }}))}
                        />
                        <FormInput 
                          label="Current Designation" 
                          value={formData.professional.currentDesignation} 
                          isExtracted={!!resumeName} 
                          onChange={(val: string) => setFormData(p => ({ ...p, professional: { ...p.professional, currentDesignation: val }}))}
                        />
                      </div>
                      <FormInput 
                        label="Notice Period (Days)" 
                        type="number" 
                        value={formData.professional.noticePeriod} 
                        onChange={(val: string) => setFormData(p => ({ ...p, professional: { ...p.professional, noticePeriod: val }}))}
                      />
                    </>
                  )}
                </div>
                   <div>
                      <label className="block text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-3">Skills</label>
                      <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl flex flex-wrap gap-2">
                         {formData.professional.skills.map(skill => (
                           <span key={skill} className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-[11px] font-black text-[#3538CD] flex items-center gap-1.5 shadow-sm">
                             {skill} <X className="w-3 h-3 text-[#9CA3AF] cursor-pointer hover:text-red-500" />
                           </span>
                         ))}
                         <button className="px-3 py-1.5 text-[11px] font-black text-[#3538CD] hover:bg-white rounded-lg transition-colors flex items-center gap-1">
                            <Plus className="w-3.5 h-3.5" /> Add Skill
                         </button>
                      </div>
                   </div>
                   <FormTextarea 
                     label="Additional Notes" 
                     value={formData.professional.remarks} 
                     onChange={(val: string) => setFormData(p => ({ ...p, professional: { ...p.professional, remarks: val }}))}
                   />
              </FormCollapsibleCard>

              {/* Section 3 — Salary Information */}
              <FormCollapsibleCard 
                id={3} 
                title="Salary Information" 
                isCollapsed={collapsedSections[3]} 
                onToggle={() => toggleSection(3)}
              >
                 <div className={`grid gap-4 ${isFresher ? 'grid-cols-3' : 'grid-cols-4'}`}>
                    <FormSelect 
                      label="CTC Type" 
                      options={['Annual', 'Monthly', 'Hourly']} 
                      value={formData.salary.ctcType} 
                      onChange={(val: string) => setFormData(p => ({ ...p, salary: { ...p.salary, ctcType: val }}))}
                    />
                    <FormSelect 
                      label="Currency" 
                      options={['INR', 'USD', 'GBP', 'EUR']} 
                      value={formData.salary.currency} 
                      onChange={(val: string) => setFormData(p => ({ ...p, salary: { ...p.salary, currency: val }}))}
                    />
                    {!isFresher && (
                      <FormInput 
                        label="Current CTC" 
                        type="number" 
                        value={formData.salary.currentCtc} 
                        onChange={(val: string) => setFormData(p => ({ ...p, salary: { ...p.salary, currentCtc: val }}))}
                      />
                    )}
                    <FormInput 
                      label="Expected CTC" 
                      type="number" 
                      value={formData.salary.expectedCtc} 
                      onChange={(val: string) => setFormData(p => ({ ...p, salary: { ...p.salary, expectedCtc: val }}))}
                    />
                 </div>
              </FormCollapsibleCard>

              {/* Section 4 — Address */}
              <FormCollapsibleCard 
                id={4} 
                title="Address" 
                isCollapsed={collapsedSections[4]} 
                onToggle={() => toggleSection(4)}
              >
                 <div className="grid grid-cols-1 mb-6">
                    <FormInput 
                      label="Address" 
                      value={formData.address.street} 
                      onChange={(val: string) => setFormData(p => ({ ...p, address: { ...p.address, street: val }}))}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-6 mb-6">
                    <FormSelect 
                      label="Country" 
                      options={['Select', 'India', 'USA', 'UK', 'Germany']} 
                      value={formData.address.country} 
                      onChange={(val: string) => setFormData(p => ({ ...p, address: { ...p.address, country: val }}))}
                    />
                    <FormSelect 
                      label="State" 
                      options={['Select', 'Gujarat', 'Maharashtra', 'Karnataka', 'New York']} 
                      value={formData.address.state} 
                      onChange={(val: string) => setFormData(p => ({ ...p, address: { ...p.address, state: val }}))}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <FormInput 
                      label="Town/City" 
                      value={formData.address.city} 
                      onChange={(val: string) => setFormData(p => ({ ...p, address: { ...p.address, city: val }}))}
                    />
                    <FormInput 
                      label="Zip/Postal Code" 
                      value={formData.address.zip} 
                      onChange={(val: string) => setFormData(p => ({ ...p, address: { ...p.address, zip: val }}))}
                    />
                 </div>
              </FormCollapsibleCard>

              {/* Section 5 — Additional Information */}
              {job.customFields && job.customFields.length > 0 && (
                <FormCollapsibleCard 
                  id={5} 
                  title="Additional Information" 
                  subtitle="Required for this specific job"
                  isCollapsed={collapsedSections[5]} 
                  onToggle={() => toggleSection(5)}
                >
                  <div className="space-y-8">
                    {job.customFields.map((f: CustomField) => (
                      <div key={f.id} className="max-w-2xl">
                        <label className="flex items-center gap-2 text-[10px] font-black text-[#6B7280] mb-3">
                          {f.label} {!f.required && <span className="px-1.5 py-0.5 bg-[#F3F4F6] text-[#9CA3AF] rounded text-[8px] border border-[#E5E7EB] font-bold">Optional</span>}
                        </label>
                        {f.type === 'Yes/No' ? (
                          <div className="flex items-center gap-4">
                             <div className="flex bg-[#F3F4F6] rounded-xl p-1 border border-[#E5E7EB]">
                                {['Yes', 'No'].map(o => (
                                  <button 
                                    key={o}
                                    onClick={() => setFormData(prev => ({...prev, customAnswers: {...prev.customAnswers, [f.label]: o}}))}
                                    className={`px-8 py-2 text-xs font-black rounded-lg transition-all ${
                                      (formData.customAnswers[f.label] || 'Yes') === o 
                                        ? 'bg-[#3538CD] text-white shadow-lg shadow-[#3538CD]/20' 
                                        : 'text-[#6B7280] hover:text-[#111827]'
                                    }`}
                                  >
                                    {o}
                                  </button>
                                ))}
                             </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                             <input 
                               type={f.type === 'Number' ? 'number' : f.type === 'Date' ? 'date' : 'text'}
                               placeholder={f.label === 'Portfolio URL' ? 'https://yourportfolio.com' : f.label}
                               className="w-full border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-white placeholder:text-[#9CA3AF]"
                               onChange={(e) => setFormData(prev => ({...prev, customAnswers: {...prev.customAnswers, [f.label]: e.target.value}}))}
                             />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </FormCollapsibleCard>
              )}
            </div>
            
            {/* Action Bar spacer */}
            <div className="h-24" />
          </div>
        )}

        {/* STEP 2: Review & Submit */}
        {step === 2 && (
          <div className="animate-in zoom-in-95 duration-500 space-y-8 flex-1">
            <div className="text-center mb-10 overflow-hidden">
               <h2 className="text-3xl font-black text-[#111827]">Review Your Application</h2>
               <p className="text-base text-[#6B7280] mt-2 font-medium">Please review your information before submitting.</p>
            </div>
               
            <div className="space-y-6">
               <ReviewCard title="PERSONAL INFORMATION" onEdit={() => setStep(1)} data={[
                  { label: 'Full Name', value: `${formData.personal.firstName} ${formData.personal.lastName}` },
                  { label: 'Email', value: formData.personal.email },
                  { label: 'Contact Number', value: `+91 ${formData.personal.contactNumber}` },
                  { label: 'Date of Birth', value: formData.personal.dob },
                  { label: 'Gender', value: formData.personal.gender },
                  { label: 'Marital Status', value: formData.personal.maritalStatus },
                  { label: 'LinkedIn Profile', value: formData.personal.linkedin }
               ]} />

               <ReviewCard title="PROFESSIONAL DETAILS" onEdit={() => setStep(1)} data={[
                  { label: 'Current Organization', value: isFresher ? '-' : formData.professional.currentOrg },
                  { label: 'Current Designation', value: isFresher ? '-' : formData.professional.currentDesignation },
                  { label: 'Total Experience', value: isFresher ? 'Fresher' : `${formData.professional.expYears} Years, ${formData.professional.expMonths} Months` },
                  { label: 'Highest Qualification', value: formData.professional.highestQualification },
                  { label: 'Notice Period', value: formData.professional.noticePeriod },
                  { label: 'Skills', value: formData.professional.skills.join(', ') }
               ]} />

               <ReviewCard title="SALARY INFORMATION" onEdit={() => setStep(1)} data={[
                  { label: 'CTC Type', value: formData.salary.ctcType },
                  { label: 'Currency', value: formData.salary.currency },
                  { label: 'Current CTC', value: formData.salary.currentCtc },
                  { label: 'Expected CTC', value: formData.salary.expectedCtc }
               ]} />

               <ReviewCard title="ADDRESS INFORMATION" onEdit={() => setStep(1)} data={[
                  { label: 'Address', value: formData.address.street },
                  { label: 'Country', value: formData.address.country },
                  { label: 'State', value: formData.address.state },
                  { label: 'Town/City', value: formData.address.city },
                  { label: 'Zip/Postal Code', value: formData.address.zip }
               ]} />

               {job.customFields && job.customFields.length > 0 && (
                  <ReviewCard title="ADDITIONAL INFORMATION" onEdit={() => setStep(1)} data={[
                     ...Object.entries(formData.customAnswers).map(([k, v]) => ({ 
                        label: k, 
                        value: k.includes('URL') ? <a href={String(v)} target="_blank" className="text-[#3538CD] underline flex items-center gap-1">{String(v)} <ExternalLink className="w-3 h-3" /></a> : String(v) 
                     }))
                  ]} />
               )}

               <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-8 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-white rounded-2xl border border-[#E5E7EB] flex items-center justify-center text-[#3538CD] group-hover:border-[#3538CD]/30 transition-colors">
                        <FileText className="w-8 h-8" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Resume</p>
                        <p className="text-base font-black text-[#111827]">{resumeName || 'Manually Filled'}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     {resumeName && <button className="p-3 text-[#3538CD] hover:bg-[#3538CD]/5 rounded-xl transition-colors"><Download className="w-6 h-6" /></button>}
                     <button onClick={() => setStep(1)} className="text-[#3538CD] font-black text-xs hover:underline uppercase tracking-widest">Edit</button>
                  </div>
               </div>
            </div>

            <div className="h-32" />
          </div>
        )}

        {/* Fixed Action Bar for Step 2 and 3 */}
        {step > 0 && (
           <div className="fixed bottom-0 left-0 right-0 bg-white/60 backdrop-blur-xl border-t border-[#E5E7EB] px-6 py-6 z-50">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                 {step === 1 ? (
                    <>
                       <button onClick={() => setStep(0)} className="text-[#6B7280] hover:text-[#3538CD] font-black text-[11px] transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                         <span className="text-lg">←</span> Change Resume
                       </button>
                       <div className="flex gap-4">
                          <button 
                            onClick={handleSaveDraft}
                            className="px-8 py-3.5 border-2 border-[#E5E7EB] text-[#374151] text-xs font-black rounded-2xl hover:bg-white transition-all uppercase tracking-widest shadow-sm active:scale-95"
                          >
                            Save Draft
                          </button>
                           <button 
                             onClick={() => { setStep(2); window.scrollTo(0, 0); }}
                             disabled={jobClosed}
                             className={`px-10 py-3.5 text-white text-xs font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest flex items-center gap-2 active:scale-95 ${
                               jobClosed 
                                 ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                                 : 'bg-[#3538CD] hover:bg-[#292bb0] shadow-[#3538CD]/30'
                             }`}
                           >
                             Continue to Review <ArrowRight className="w-4 h-4" />
                           </button>
                       </div>
                    </>
                 ) : (
                    <>
                       <button onClick={() => { setStep(1); window.scrollTo(0, 0); }} className="text-[#3538CD] font-black text-[11px] hover:underline uppercase tracking-[0.2em] flex items-center gap-2">
                         <span className="text-lg">←</span> Edit Details
                       </button>
                       <button 
                         onClick={handleSubmit}
                         className="px-12 py-4 bg-[#3538CD] text-white text-sm font-black rounded-2xl hover:bg-[#292bb0] shadow-2xl shadow-[#3538CD]/40 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 w-full max-w-[400px] active:scale-95"
                       >
                         Complete & Submit <ArrowRight className="w-5 h-5" />
                       </button>
                    </>
                 )}
              </div>
           </div>
        )}

        {/* Global Footer */}
        <div className="py-10 border-t border-[#E5E7EB] mt-auto flex justify-between items-center text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] px-2">
           <div>Powered by CollabCareers</div>
           <div className="flex gap-10">
              <button className="hover:text-[#3538CD] transition-colors">Privacy Policy</button>
              <span className="cursor-default">© {new Date().getFullYear()}</span>
           </div>
        </div>

        {/* Success Toast */}
        {showToast && (
          <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-[#111827] text-white px-6 py-3 rounded-full shadow-2xl z-[100] animate-in slide-in-from-bottom-5 duration-300 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#3538CD]" />
            <span className="text-sm font-bold">Draft saved successfully</span>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

// UI Components
function FormCollapsibleCard({ title, subtitle, children, isCollapsed, onToggle }: any) {
  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden transition-all duration-300">
      <button 
        onClick={onToggle}
        className="w-full px-8 py-6 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors group"
      >
        <div>
           <h3 className="text-sm font-black text-[#111827] uppercase tracking-widest group-hover:text-[#3538CD] transition-colors">{title}</h3>
           {subtitle && <p className="text-[11px] text-[#6B7280] font-bold mt-0.5">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-lg bg-[#F4F5FA] text-[#6B7280] group-hover:text-[#3538CD] transition-all duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}>
           <ChevronDown className="w-4 h-4" />
        </div>
      </button>
      <div className={`transition-all duration-300 ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100 p-8 pt-0'}`}>
         <div className="border-t border-[#F3F4F6] pt-8">
            {children}
         </div>
      </div>
    </div>
  );
}

function FormInput(props: any) {
  const { label, required, value, isExtracted, isLocked, type = 'text', placeholder, onChange } = props;
  const showSparkle = !!isExtracted && !isLocked && type !== 'date';
  
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-[#6B7280] ml-1 flex items-center gap-1.5 min-h-[1.2rem]">
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
          className={`w-full border rounded-xl px-5 py-3.5 text-sm font-bold transition-all focus:outline-none focus:ring-4 ${
            isLocked 
              ? 'bg-[#F3F4F6] border-[#E5E7EB] text-[#9CA3AF] pl-10 cursor-not-allowed shadow-inner' 
              : 'bg-white border-[#E5E7EB] text-[#111827] focus:ring-[#3538CD]/10 focus:border-[#3538CD] hover:border-[#D1D5DB] hover:shadow-sm cursor-text'
          }`}
        />
        {showSparkle && (
           <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3538CD]">
              <Sparkles className="w-4 h-4 fill-[#3538CD]" />
           </div>
        )}
      </div>
    </div>
  );
}

 function FormPhoneInput({ label, required, value, isExtracted: _isExtracted, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">{label} {required && <span className="text-red-500">*</span>}</label>
      <div className="flex gap-2">
         <div className="w-[72px] shrink-0 relative">
            <select className="w-full border border-[#E5E7EB] rounded-xl px-3 py-3.5 text-xs font-bold appearance-none bg-[#F9FAFB]">
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
              className="w-full border border-[#E5E7EB] rounded-xl px-5 py-3.5 text-sm font-bold focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] placeholder:text-gray-300" 
              placeholder="98765 43210"
            />
         </div>
      </div>
    </div>
  );
}

 function FormSelect({ label, options, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <select
          defaultValue={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full border border-[#E5E7EB] bg-white rounded-xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] appearance-none text-[#111827] hover:border-[#D1D5DB] transition-all"
        >
          {options.map((opt: string) => <option key={opt} value={opt === 'Select' ? '' : opt}>{opt}</option>)}
        </select>
        <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

function FormTextarea({ label, value }: any) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">{label}</label>
      <textarea
        defaultValue={value}
        rows={4}
        className="w-full border border-[#E5E7EB] bg-white rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] text-[#111827] resize-none hover:border-[#D1D5DB] transition-all"
      />
    </div>
  );
}

function ReviewCard({ title, data, onEdit }: { title: string, data: any[], onEdit: () => void }) {
  return (
    <div className="bg-white rounded-[32px] border border-[#E5E7EB] p-10 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3538CD]/5 group-hover:bg-[#3538CD]/20 transition-all" />
      <div className="flex items-center justify-between mb-8 border-b border-[#F3F4F6] pb-6">
        <h3 className="text-sm font-black text-[#111827] uppercase tracking-[0.15em]">{title}</h3>
        <button onClick={onEdit} className="text-[#3538CD] font-black text-[10px] uppercase tracking-widest px-4 py-2 bg-[#3538CD]/5 rounded-lg border border-[#3538CD]/10 hover:bg-[#3538CD]/10 transition-colors">Edit Section</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-12">
        {data.map((item, i) => (
          <div key={i} className="space-y-2">
            <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">{item.label}</p>
            <div className="text-[14px] font-bold text-[#111827] leading-relaxed">
              {item.value || <span className="text-gray-300">Not Provided</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
