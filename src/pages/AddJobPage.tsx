import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import { GripVertical, Trash2, Plus, ChevronDown, Info, X, AlertCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { CustomField, FieldType, Job } from '../store/types';

// Reusable form section wrapper
function FormSection({
  title,
  subtitle,
  children,
  collapsed = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  collapsed?: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  return (
    <div className="flex gap-8 mb-6">
      <div className="w-[240px] shrink-0 pt-1">
        <h3 className="text-sm font-semibold text-[#1A1A2E]">{title}</h3>
        {subtitle && <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{subtitle}</p>}
      </div>
      <div className="flex-1 bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
        {collapsed ? (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-primary transition-colors w-full"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
            <span>{isCollapsed ? 'Expand section' : 'Collapse section'}</span>
          </button>
        ) : null}
        {!isCollapsed && children}
      </div>
    </div>
  );
}

// Form field components
function FormInput({ label, required, placeholder, value, onChange, type = 'text', info }: {
  label: string; required?: boolean; placeholder?: string; value?: string; onChange?: (val: string) => void; type?: string; info?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#374151] mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {info && <Info className="w-3.5 h-3.5 inline-block ml-1 text-[#9CA3AF] -mt-0.5" />}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white placeholder:text-[#9CA3AF]"
      />
    </div>
  );
}

function FormSelect({ label, required, placeholder, value, onChange, options, info }: {
  label: string; required?: boolean; placeholder?: string; value?: string; onChange?: (val: string) => void; options: {label: string, value: string}[]; info?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#374151] mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {info && <Info className="w-3.5 h-3.5 inline-block ml-1 text-[#9CA3AF] -mt-0.5" />}
      </label>
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white appearance-none text-[#374151]"
        >
          <option value="" disabled>{placeholder || 'Select'}</option>
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        checked ? 'bg-primary' : 'bg-[#D1D5DB]'
      }`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
        checked ? 'left-[22px]' : 'left-0.5'
      }`} />
    </button>
  );
}

export default function AddJobPage() {
  const { addJob } = useApp();
  const navigate = useNavigate();

  // Component State
  const [jobData, setJobData] = useState({
    title: '',
    businessUnit: 'Yopmails',
    recruiter: '',
    location: '',
    experience: '',
    employmentType: '',
    jobType: '',
    skills: '',
    minSalary: '',
    maxSalary: '',
    currency: 'INR',
    salaryType: 'Annual',
    description: '',
    status: 'Open' as 'Open' | 'Draft' | 'Close',
  });

  const [customFields, setCustomFields] = useState<CustomField[]>([
    { id: '1', label: 'Portfolio URL', type: 'Text', required: true },
    { id: '2', label: 'Are you open to relocate?', type: 'Yes/No', required: false },
  ]);

  const [publishWebsite, setPublishWebsite] = useState(false);
  const [publishCollabCareers, setPublishCollabCareers] = useState(true);

  // Dropdown Logic
  const [optionInputs, setOptionInputs] = useState<Record<string, string>>({});

  const fieldTypes: FieldType[] = ['Text', 'Number', 'Dropdown', 'Date', 'File Upload', 'Yes/No'];

  const addField = () => {
    setCustomFields([...customFields, {
      id: Date.now().toString(),
      label: '',
      type: 'Text',
      required: false,
    }]);
  };

  const removeField = (id: string) => {
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  const handleTypeChange = (id: string, newType: FieldType) => {
    const field = customFields.find(f => f.id === id);
    if (field?.type === 'Dropdown' && newType !== 'Dropdown' && (field.options?.length ?? 0) > 0) {
      if (confirm("Changing field type will remove your dropdown options. Continue?")) {
        setCustomFields(customFields.map(f => f.id === id ? { ...f, type: newType, options: [] } : f));
      }
    } else {
      setCustomFields(customFields.map(f => f.id === id ? { ...f, type: newType, options: newType === 'Dropdown' ? [] : undefined } : f));
    }
  };

  const addDropdownOption = (fieldId: string) => {
    const val = optionInputs[fieldId]?.trim();
    if (!val) return;
    
    setCustomFields(fields => fields.map(f => {
      if (f.id === fieldId) {
        const options = f.options || [];
        if (options.some(o => o.value.toLowerCase() === val.toLowerCase())) {
          alert("This option already exists!");
          return f;
        }
        return {
          ...f,
          options: [...options, { id: Date.now().toString(), value: val.substring(0, 100) }]
        };
      }
      return f;
    }));
    setOptionInputs({ ...optionInputs, [fieldId]: '' });
  };

  const removeDropdownOption = (fieldId: string, optionId: string) => {
    setCustomFields(fields => fields.map(f => {
      if (f.id === fieldId) {
        return { ...f, options: f.options?.filter(o => o.id !== optionId) };
      }
      return f;
    }));
  };

  const handlePostJob = () => {
    // Basic validation for dropdown options
    const invalidField = customFields.find(f => f.type === 'Dropdown' && (f.options?.length ?? 0) < 2);
    if (invalidField) {
      alert(`Field "${invalidField.label || 'Unnamed'}" needs at least 2 options.`);
      return;
    }

    if (!jobData.title) {
        alert("Please enter a job title.");
        return;
    }

    const newJob: Job = {
      id: Date.now().toString(),
      title: jobData.title,
      businessUnit: jobData.businessUnit,
      recruiter: jobData.recruiter,
      location: jobData.location,
      experience: jobData.experience,
      employmentType: jobData.employmentType,
      jobType: jobData.jobType,
      skills: jobData.skills.split(',').map(s => s.trim()).filter(Boolean),
      salaryRange: {
        min: jobData.minSalary,
        max: jobData.maxSalary,
        currency: jobData.currency,
        type: jobData.salaryType,
      },
      description: jobData.description,
      status: jobData.status,
      publishOnCollabCareers: publishCollabCareers,
      customFields: customFields,
      createdAt: new Date().toISOString(),
    };

    addJob(newJob);
    alert("Job posted successfully! It will now appear on the Career Portal.");
    navigate('/');
  };

  return (
    <CRMLayout
      breadcrumbs={[
        { label: 'Jobs', path: '#' },
        { label: 'Add Job' },
      ]}
      title="Add Job"
      actions={
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="px-5 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
          >
            Cancel
          </button>
          <div className="flex">
            <button 
              onClick={handlePostJob}
              className="bg-primary text-white px-5 py-2 rounded-l-lg text-sm font-medium hover:bg-[#292bb0] transition-colors"
            >
              Post Job
            </button>
            <button className="bg-primary text-white px-2 py-2 rounded-r-lg border-l border-white/20 hover:bg-[#292bb0] transition-colors">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      }
    >
      {/* Team & Ownership */}
      <FormSection title="Team & Ownership" subtitle="Choose the business unit, recruiter(s), and interview panel managing this job.">
        <div className="grid grid-cols-3 gap-4">
          <FormSelect label="Business Unit" required info value={jobData.businessUnit} options={[{label: 'Yopmails', value: 'Yopmails'}]} />
          <FormInput label="Recruiter(s)" required info value={jobData.recruiter} onChange={v => setJobData({...jobData, recruiter: v})} />
          <FormSelect label="Interview Panel" placeholder="Select" info options={[]} />
        </div>
      </FormSection>

      {/* Job Information */}
      <FormSection title="Job Information" subtitle="Add job details here.">
        <div className="flex justify-end mb-4">
          <button className="text-sm font-medium text-primary hover:text-[#292bb0] transition-colors">
            Use Template
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <FormInput label="Job Title" required value={jobData.title} onChange={v => setJobData({...jobData, title: v})} />
          <FormInput label="No. of Job Openings" required type="number" />
          <FormInput label="Job Location" placeholder="i.e: Ahmedabad, India" value={jobData.location} onChange={v => setJobData({...jobData, location: v})} />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <FormInput label="Experience Required (Years)" required value={jobData.experience} onChange={v => setJobData({...jobData, experience: v})} />
          <FormInput label="Employment Type" required value={jobData.employmentType} onChange={v => setJobData({...jobData, employmentType: v})} />
          <FormInput label="Job Type" required value={jobData.jobType} onChange={v => setJobData({...jobData, jobType: v})} />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <FormInput label="Required Skills" required placeholder="React, JavaScript..." value={jobData.skills} onChange={v => setJobData({...jobData, skills: v})} />
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">
              Target Date <Info className="w-3.5 h-3.5 inline-block ml-1 text-[#9CA3AF] -mt-0.5" />
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">📅</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">
            Job Description <span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
            <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-3 py-2 flex items-center gap-1">
              {['B', 'I', 'U', 'S'].map((btn) => (
                <button key={btn} className="w-8 h-8 rounded hover:bg-white flex items-center justify-center text-sm font-semibold text-[#374151]">
                  {btn === 'S' ? <span className="line-through">S</span> : btn}
                </button>
              ))}
              <span className="mx-1 w-px h-5 bg-[#E5E7EB]" />
              <button className="px-3 py-1 rounded hover:bg-white text-sm text-[#374151] flex items-center gap-1">
                Normal <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <textarea
              rows={5}
              value={jobData.description}
              onChange={(e) => setJobData({...jobData, description: e.target.value})}
              className="w-full px-3 py-3 text-sm focus:outline-none resize-none"
              placeholder="Enter job description..."
            />
          </div>
        </div>
      </FormSection>

      {/* Salary Range */}
      <FormSection title="Salary Range" subtitle="Define the offered salary range here.">
        <div className="grid grid-cols-4 gap-4">
          <FormSelect label="CTC Type" value={jobData.salaryType} options={[{label: 'Annual', value: 'Annual'}, {label: 'Monthly', value: 'Monthly'}]} onChange={v => setJobData({...jobData, salaryType: v})} />
          <FormInput label="Minimum (CTC)" value={jobData.minSalary} onChange={v => setJobData({...jobData, minSalary: v})} />
          <FormInput label="Maximum (CTC)" value={jobData.maxSalary} onChange={v => setJobData({...jobData, maxSalary: v})} />
          <FormSelect label="Currency" value={jobData.currency} options={[{label: 'INR', value: 'INR'}, {label: 'USD', value: 'USD'}]} onChange={v => setJobData({...jobData, currency: v})} />
        </div>
      </FormSection>

      {/* Job Status */}
      <FormSection title="Job Status" subtitle="Select job status here.">
        <div className="flex gap-0">
          {(['Open', 'Draft', 'Close'] as const).map(s => (
            <button
              key={s}
              onClick={() => setJobData({...jobData, status: s})}
              className={`px-5 py-2 text-sm font-medium border border-[#E5E7EB] first:rounded-l-lg last:rounded-r-lg ${
                jobData.status === s ? 'bg-primary text-white border-primary' : 'text-[#374151] hover:bg-[#F9FAFB] border-l-0 first:border-l'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </FormSection>

      {/* Evaluation Criteria */}
      <FormSection title="Evaluation Criteria" subtitle="Add evaluation criteria here">
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">
            Evaluation Criteria <span className="text-red-500 ml-0.5">*</span>
            <Info className="w-3.5 h-3.5 inline-block ml-1 text-[#9CA3AF] -mt-0.5" />
          </label>
          <div className="flex items-center gap-2 mb-3">
            <GripVertical className="w-4 h-4 text-[#9CA3AF] cursor-grab" />
            <input
              type="text"
              className="flex-1 border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            />
          </div>
          <button className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-[#292bb0] transition-colors">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </FormSection>

      {/* Application Form Fields */}
      <FormSection
        title="Application Form Fields"
        subtitle="Add extra fields for candidates to fill when applying for this job on CollabCareers"
      >
        <div className="space-y-4">
          {customFields.map((field) => (
            <div key={field.id} className="space-y-3">
              <div className="flex items-center gap-3 group bg-[#F9FAFB] rounded-lg p-3 border border-[#E5E7EB] hover:border-primary/30 transition-colors">
                <GripVertical className="w-5 h-5 text-[#9CA3AF] cursor-grab shrink-0" />
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => setCustomFields(customFields.map(f => f.id === field.id ? {...f, label: e.target.value} : f))}
                    placeholder="e.g. Portfolio URL"
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white px-3"
                  />
                </div>
                <div className="w-[160px] shrink-0">
                  <div className="relative">
                    <select
                      value={field.type}
                      onChange={(e) => handleTypeChange(field.id, e.target.value as FieldType)}
                      className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white appearance-none"
                    >
                      {fieldTypes.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-[#6B7280] font-medium">Required</span>
                  <Toggle
                    checked={field.required}
                    onChange={() => setCustomFields(customFields.map(f => f.id === field.id ? {...f, required: !f.required} : f))}
                  />
                </div>
                <button onClick={() => removeField(field.id)} className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Dropdown Options Panel */}
              {field.type === 'Dropdown' && (
                <div className="ml-8 p-4 bg-white border border-[#E5E7EB] rounded-xl shadow-sm space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-2 mb-2">
                    <h4 className="text-xs font-bold text-[#1A1A2E] flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-primary" /> Dropdown Options
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ (field.options?.length ?? 0) >= 2 ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                      {(field.options?.length ?? 0)} Options
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {field.options?.map((opt) => (
                      <div key={opt.id} className="flex items-center justify-between text-sm bg-[#F9FAFB] px-3 py-1.5 rounded-lg group">
                        <span className="text-[#374151]">{opt.value}</span>
                        <button onClick={() => removeDropdownOption(field.id, opt.id)} className="text-[#9CA3AF] hover:text-red-500 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={optionInputs[field.id] || ''}
                      onChange={(e) => setOptionInputs({...optionInputs, [field.id]: e.target.value})}
                      onKeyDown={(e) => e.key === 'Enter' && addDropdownOption(field.id)}
                      placeholder="Type an option..."
                      maxLength={100}
                      className="flex-1 border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <button
                      onClick={() => addDropdownOption(field.id)}
                      className="bg-primary text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-[#292bb0] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  
                  {(field.options?.length ?? 0) < 2 && (
                    <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-medium bg-amber-50 p-2 rounded-lg border border-amber-100">
                      <AlertCircle className="w-3 h-3" />
                      Add at least 2 options before saving
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addField}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Field
          </button>
        </div>
      </FormSection>

      {/* Publish Section */}
      <FormSection title="Publish" subtitle="Choose where you would like to publish this job.">
        <div className="space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[#374151]">Publish on Website</h4>
              <p className="text-xs text-[#6B7280] mt-0.5 max-w-md">Select this to show the job on your website if it's integrated with our API manager.</p>
            </div>
            <Toggle checked={publishWebsite} onChange={() => setPublishWebsite(!publishWebsite)} />
          </div>
          <div className="border-t border-[#E5E7EB]" />
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[#374151]">Publish on CollabCareers</h4>
              <p className="text-xs text-[#6B7280] mt-0.5 max-w-md">Candidates can discover and apply for this job on your CollabCareers portal</p>
            </div>
            <Toggle checked={publishCollabCareers} onChange={() => setPublishCollabCareers(!publishCollabCareers)} />
          </div>
        </div>
      </FormSection>
    </CRMLayout>
  );
}
