import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { useApp } from '../store/AppContext';
import { 
  Download, Globe, Linkedin, FileText,
  ChevronDown, MapPin, Briefcase, Building2, Clock, X, AlertTriangle
} from 'lucide-react';

const brandStatusStyles: Record<string, string> = {
  'Under Review': 'bg-[#F4F5FA] text-[#3538CD] border-[#3538CD]/20',
  'Interview in Progress': 'bg-[#F4F5FA] text-[#3538CD] border-[#3538CD]/20',
  'Decision Made': 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]',
  'Offer Made': 'bg-[#3538CD] text-white border-[#3538CD]',
  'Rejected': 'bg-gray-100 text-gray-400 border-gray-200',
  'Draft': 'bg-[#F4F5FA] text-[#3538CD] border border-[#3538CD]/20',
  'Submitted': 'bg-[#F4F5FA] text-[#3538CD] border-[#3538CD]/20',
};

export default function ViewApplicationPage() {
  const { slug, applicationId } = useParams();
  const navigate = useNavigate();
  const { applications, jobs, withdrawApplication } = useApp();
  const [isJobExpanded, setIsJobExpanded] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // Find real data
  const application = applications.find(a => a.id === applicationId) || applications[0];
  const job = jobs.find(j => j.id === application.jobId) || jobs[0];

  const canWithdraw = job.status !== 'Close' && 
    !['Not Considered', 'Joined', 'Not Joined', 'Withdrawn'].includes(application.status);

  // Mock data for React Developer application
  const appData = {
    id: applicationId || 'a1',
    jobTitle: 'React Developer',
    company: 'Yopmails',
    location: 'Ahmedabad',
    employmentType: 'Full-time',
    jobType: 'On-site',
    experience: '4+ Years',
    appliedAt: '2026-03-18T10:00:00Z',
    status: 'Submitted',
    jobClosed: false,
    description: 'Expert React developer needed for performance-critical web applications. You will be responsible for building high-quality UI components and managing complex application state.',
    requirements: [
      'Strong proficiency in JavaScript/TypeScript and React',
      'Experience with modern state management (Redux, Context API, etc.)',
      'Solid understanding of CSS-in-JS or Tailwind CSS',
      'Knowledge of RESTful APIs and modern frontend build pipelines',
      'Experience with testing frameworks like Jest or React Testing Library'
    ],
    candidateInfo: {
      fullName: 'Alex Patel',
      email: 'alex.patel@example.com',
      phone: '+91 98765 43210',
      dob: '15 June 1996',
      linkedin: 'linkedin.com/in/alexpatel'
    },
    professionalDetails: {
      currentOrg: 'TechSolutions Inc.',
      currentDesignation: 'Senior Frontend Engineer',
      totalExperience: '5 Years',
      highestQualification: 'B.Tech in Computer Science',
      noticePeriod: '30 Days',
      skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Redux'],
      generalRemarks: 'I am passionate about building accessible and performant web applications.'
    },
    salaryInfo: {
      ctcType: 'Annual',
      currency: 'INR (₹)',
      currentCtc: '18,50,000',
      expectedCtc: '24,00,000'
    },
    address: {
      address: '402, Skyline Apartments, Satellite',
      country: 'India',
      state: 'Gujarat',
      townCity: 'Ahmedabad',
      zipCode: '380015'
    },
    additionalInfo: {
      portfolioUrl: 'https://alexpatel.dev',
      reloate: 'Yes'
    },
    resume: {
      filename: 'Alex_Patel_Resume.pdf'
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <PortalLayout>
      {/* Top sticky navigation bar */}
      <div className="sticky top-[64px] z-30 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            to={`/portal/${slug}/profile`} 
            className="flex items-center gap-2 text-xs font-black text-[#3538CD] hover:text-[#292bb0] transition-all uppercase tracking-[0.15em] py-2"
          >
            <ChevronDown className="rotate-90 w-4 h-4" />
            Back to My Applications
          </Link>
          
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 text-[10px] font-black rounded-full border border-current uppercase tracking-widest ${brandStatusStyles[appData.status] || 'bg-gray-100'}`}>
              {appData.status}
            </span>
          </div>
        </div>
      </div>

      {appData.jobClosed && (
        <div className="bg-amber-50 border-b border-amber-100 py-3 px-6 text-center">
          <p className="text-sm font-bold text-amber-800">This position is no longer accepting applications.</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1 min-w-0">
               <h1 className="text-4xl md:text-6xl font-black text-[#111827] leading-[1.05] tracking-tighter mb-8">
                 {appData.jobTitle}
               </h1>
               <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-bold text-[#6B7280]">
                 <div className="flex items-center gap-2">
                   <div className="p-1.5 bg-[#F4F5FA] rounded-lg text-[#3538CD]"><MapPin className="w-4 h-4" /></div>
                   {appData.location}
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="p-1.5 bg-[#F4F5FA] rounded-lg text-[#3538CD]"><Briefcase className="w-4 h-4" /></div>
                   {appData.employmentType}
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="p-1.5 bg-[#F4F5FA] rounded-lg text-[#3538CD]"><Building2 className="w-4 h-4" /></div>
                   {appData.jobType}
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="p-1.5 bg-[#F4F5FA] rounded-lg text-[#3538CD]"><Clock className="w-4 h-4" /></div>
                   {appData.experience}
                 </div>
               </div>
            </div>
            
            {canWithdraw && (
              <button 
                onClick={() => setIsWithdrawModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 border-2 border-[#E5E7EB] text-[#6B7280] hover:text-red-500 hover:border-red-100 hover:bg-red-50 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 group"
              >
                <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Withdraw Application
              </button>
            )}
          </div>
        </div>

        {/* SECTION 1: JOB DETAILS */}
        <div className="mb-16">
          <div 
            className="flex items-center gap-4 mb-8 cursor-pointer group"
            onClick={() => setIsJobExpanded(!isJobExpanded)}
          >
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-[#3538CD] rounded-full" />
              <h2 className="text-xl font-black text-[#111827] tracking-tight group-hover:text-[#3538CD] transition-colors flex items-center gap-3">
                Job Summary
                <div className={`transition-transform duration-300 ${isJobExpanded ? 'rotate-180 text-[#3538CD]' : 'rotate-0 text-[#6B7280]'}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </h2>
            </div>
            <div className="h-[1px] flex-1 bg-[#E5E7EB]" />
          </div>

          <div className={`transition-all duration-500 overflow-hidden ${isJobExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
            <div className="bg-white rounded-[32px] border border-[#E5E7EB] p-10 shadow-sm relative mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative text-balance">
                <div>
                  <h3 className="text-sm font-black text-[#6B7280] uppercase tracking-widest mb-4">About the Role</h3>
                  <p className="text-[14px] text-[#4B5563] leading-relaxed font-medium">
                    {appData.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#6B7280] uppercase tracking-widest mb-4">Evaluation Criteria</h3>
                  <ul className="space-y-3">
                    {appData.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3 text-[14px] text-[#4B5563] font-medium leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3538CD] mt-2 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: APPLICATION DATA */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-baseline gap-3">
              <div className="w-1 h-6 bg-[#3538CD] rounded-full self-center" />
              <h2 className="text-xl font-black text-[#111827] tracking-tight">Your Submitted Application</h2>
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest bg-[#F4F5FA] px-2 py-0.5 rounded-md border border-[#E5E7EB]">
                {formatDate(appData.appliedAt)}
              </span>
            </div>
            <div className="h-[1px] flex-1 bg-[#E5E7EB]" />
          </div>
          
          <div className="space-y-8">
            {/* Card 1: Candidate Information */}
            <ReadOnlyCard title="Personal Profile">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                <InfoItem label="Full Name" value={appData.candidateInfo.fullName} />
                <InfoItem label="Email Address" value={appData.candidateInfo.email} />
                <InfoItem label="Mobile Number" value={appData.candidateInfo.phone} />
                <InfoItem label="Date of Birth" value={appData.candidateInfo.dob} />
                <div className="md:col-span-2 p-5 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB]">
                  <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-3">Professional Social</p>
                  <div className="flex items-center gap-3 text-[14px] font-bold text-[#3538CD]">
                    <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/10 flex items-center justify-center">
                      <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                    </div>
                    {appData.candidateInfo.linkedin}
                  </div>
                </div>
              </div>
            </ReadOnlyCard>

            {/* Card 2: Professional Details */}
            <ReadOnlyCard title="Professional Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10">
                <InfoItem label="Current Organization" value={appData.professionalDetails.currentOrg} />
                <InfoItem label="Current Designation" value={appData.professionalDetails.currentDesignation} />
                <InfoItem label="Total Experience" value={appData.professionalDetails.totalExperience} />
                <InfoItem label="Highest Qualification" value={appData.professionalDetails.highestQualification} />
                <InfoItem label="Notice Period" value={appData.professionalDetails.noticePeriod} />
                <div className="md:col-span-2 mt-2">
                  <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-4">Core Skills</p>
                  <div className="flex flex-wrap gap-2.5">
                    {appData.professionalDetails.skills.map(skill => (
                      <span key={skill} className="px-4 py-2 text-[11px] font-bold bg-[#3538CD]/5 text-[#3538CD] rounded-xl border border-[#3538CD]/10 uppercase tracking-tight">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <InfoItem label="Additional Notes" value={appData.professionalDetails.generalRemarks} />
                </div>
              </div>
            </ReadOnlyCard>

            {/* Card 3: Address Information */}
            <ReadOnlyCard title="Address Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10">
                <div className="md:col-span-2">
                  <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-2">Residential Address</p>
                  <p className="text-sm font-bold text-[#111827] leading-relaxed">{appData.address.address}</p>
                </div>
                <InfoItem label="Country" value={appData.address.country} />
                <InfoItem label="State" value={appData.address.state} />
                <InfoItem label="Town / City" value={appData.address.townCity} />
                <InfoItem label="Zip / Postal Code" value={appData.address.zipCode} />
              </div>
            </ReadOnlyCard>

            {/* Card 4: Salary Information */}
            <ReadOnlyCard title="Salary Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10">
                <InfoItem label="CTC Type" value={appData.salaryInfo.ctcType} />
                <InfoItem label="Currency" value={appData.salaryInfo.currency} />
                <InfoItem label="Current CTC" value={appData.salaryInfo.currentCtc} />
                <InfoItem label="Expected CTC" value={appData.salaryInfo.expectedCtc} />
              </div>
            </ReadOnlyCard>

            {/* Card 4: Additional Information */}
            <ReadOnlyCard title="Additional Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10">
                <div className="md:col-span-2">
                  <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-2">Portfolio URL</p>
                  <a href={appData.additionalInfo.portfolioUrl} target="_blank" className="text-sm font-bold text-[#3538CD] hover:underline flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {appData.additionalInfo.portfolioUrl}
                  </a>
                </div>
                <InfoItem label="Are you open to relocate?" value={appData.additionalInfo.reloate} />
              </div>
            </ReadOnlyCard>

            {/* Card 5: Resume */}
            <ReadOnlyCard title="Resume">
              <div className="flex items-center gap-5 p-6 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] group transition-all hover:border-[#3538CD]/30 hover:bg-white">
                <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-[#3538CD] border border-[#E5E7EB] shadow-sm group-hover:border-[#3538CD]/20 transition-all">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-black text-[#111827] truncate">{appData.resume.filename}</p>
                  <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest mt-1">PDF Document • 2.4 MB</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[#E5E7EB] rounded-xl text-xs font-black text-[#6B7280] hover:text-[#3538CD] hover:border-[#3538CD]/40 transition-all uppercase tracking-widest shadow-sm active:scale-95">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </ReadOnlyCard>
          </div>
        </div>
      </div>

      {/* Withdraw Confirmation Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#111827]/60 backdrop-blur-sm" onClick={() => setIsWithdrawModalOpen(false)} />
          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden border border-[#E5E7EB] animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-black text-[#111827] tracking-tight mb-3">Withdraw Application?</h3>
              <p className="text-[#6B7280] text-sm font-bold leading-relaxed mb-8">
                Are you sure you want to withdraw your application for <span className="text-[#111827]">{job.title}</span> at <span className="text-[#111827]">{job.businessUnit}</span>? 
                <br /><br />
                This action cannot be undone. The recruiter will be notified.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-[#F9FAFB] text-[#111827] text-xs font-black rounded-2xl hover:bg-[#F3F4F6] transition-all uppercase tracking-widest border border-[#E5E7EB]"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    withdrawApplication(application.id);
                    setIsWithdrawModalOpen(false);
                    navigate(`/portal/${slug}/profile`);
                  }}
                  className="flex-1 px-6 py-4 bg-red-600 text-white text-xs font-black rounded-2xl hover:bg-red-700 transition-all uppercase tracking-widest shadow-lg shadow-red-200 shadow-sm active:scale-95"
                >
                  Yes, Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}

function ReadOnlyCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[40px] border border-[#E5E7EB] p-12 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-2 h-full bg-[#3538CD]/10" />
      <div className="flex items-center gap-4 mb-10 border-b border-[#F3F4F6] pb-8">
        <h3 className="text-sm font-black text-[#111827] uppercase tracking-[0.2em]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">{label}</p>
      <div className="text-[14px] font-bold text-[#111827] leading-relaxed">{value || <span className="text-[#D1D5DB]">Not Provided</span>}</div>
    </div>
  );
}
