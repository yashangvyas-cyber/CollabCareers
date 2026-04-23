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
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const application = applications.find(a => a.id === applicationId) || applications[0];
  const job = jobs.find(j => j.id === application.jobId) || jobs[0];

  const canWithdraw = job.status !== 'Close' && 
    !['Not Considered', 'Joined', 'Not Joined', 'Withdrawn'].includes(application.status);

  const appData = {
    jobTitle: job?.title || 'React Developer',
    company: job?.businessUnit || 'MindInventory',
    location: job?.location || 'Ahmedabad',
    employmentType: job?.employmentType || 'Full-time',
    jobType: job?.jobType || 'On-site',
    experience: job?.experience || '4+ Years',
    appliedAt: application?.appliedAt || '2026-03-18T10:00:00Z',
    status: application?.status || 'Submitted',
    jobClosed: job?.status === 'Close',
    description: job?.description || 'Expert React developer needed for performance-critical web applications.',
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
      generalRemarks: 'Passionate about building accessible and performant web applications.'
    },
    salaryInfo: { ctcType: 'Annual', currency: 'INR (₹)', currentCtc: '18,50,000', expectedCtc: '24,00,000' },
    address: { address: '402, Skyline Apartments, Satellite', country: 'India', state: 'Gujarat', townCity: 'Ahmedabad', zipCode: '380015' },
    additionalInfo: { portfolioUrl: 'https://alexpatel.dev', reloate: 'Yes' },
    resume: { filename: 'Alex_Patel_Resume.pdf' }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <PortalLayout>
      {/* Top nav bar */}
      <div className="sticky top-[64px] z-30 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link 
            to={`/portal/${slug}/profile`} 
            className="flex items-center gap-1.5 text-xs font-black text-[#6B7280] hover:text-[#3538CD] transition-all uppercase tracking-widest"
          >
            <ChevronDown className="rotate-90 w-3.5 h-3.5" />
            My Applications
          </Link>
          <span className={`px-3 py-1 text-[10px] font-black rounded-full border uppercase tracking-widest ${brandStatusStyles[appData.status] || 'bg-gray-100'}`}>
            {appData.status}
          </span>
        </div>
      </div>

      {appData.jobClosed && (
        <div className="bg-amber-50 border-b border-amber-100 py-2.5 px-6 text-center">
          <p className="text-xs font-bold text-amber-700">This position is no longer accepting applications.</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#111827] tracking-tight mb-3">{appData.jobTitle}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-[#6B7280] font-medium">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#9CA3AF]" />{appData.location}</span>
              <span className="text-[#E5E7EB]">|</span>
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-[#9CA3AF]" />{appData.employmentType}</span>
              <span className="text-[#E5E7EB]">|</span>
              <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-[#9CA3AF]" />{appData.jobType}</span>
              <span className="text-[#E5E7EB]">|</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#9CA3AF]" />{appData.experience}</span>
            </div>
          </div>
          {canWithdraw && (
            <button 
              onClick={() => setIsWithdrawModalOpen(true)}
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 border-2 border-[#E5E7EB] text-[#6B7280] hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
            >
              <X className="w-3.5 h-3.5" /> Withdraw
            </button>
          )}
        </div>

        {/* Submitted label */}
        <div className="flex items-center gap-3 mb-4">
          <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest shrink-0">
            Submitted {formatDate(appData.appliedAt)}
          </p>
          <div className="h-px flex-1 bg-[#F3F4F6]" />
        </div>

        {/* Accordion sections */}
        <div className="space-y-3">

          <AccordionCard title="Job Summary" defaultExpanded={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">About the Role</p>
                <p className="text-sm text-[#4B5563] leading-relaxed">{appData.description}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">Key Skills Required</p>
                <div className="flex flex-wrap gap-1.5">
                  {job?.skills?.map(s => (
                    <span key={s} className="px-3 py-1 text-[11px] font-bold bg-[#3538CD]/5 text-[#3538CD] rounded-lg border border-[#3538CD]/10">{s}</span>
                  )) || <span className="text-sm text-[#9CA3AF]">Not specified</span>}
                </div>
              </div>
            </div>
          </AccordionCard>

          <AccordionCard title="Personal Profile">
            <div className="grid grid-cols-2 gap-x-10 gap-y-5">
              <InfoItem label="Full Name" value={appData.candidateInfo.fullName} />
              <InfoItem label="Email Address" value={appData.candidateInfo.email} />
              <InfoItem label="Mobile Number" value={appData.candidateInfo.phone} />
              <InfoItem label="Date of Birth" value={appData.candidateInfo.dob} />
              <div className="col-span-2 flex items-center gap-2 text-sm font-medium text-[#3538CD] pt-1">
                <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                {appData.candidateInfo.linkedin}
              </div>
            </div>
          </AccordionCard>

          <AccordionCard title="Professional Details">
            <div className="grid grid-cols-2 gap-x-10 gap-y-5">
              <InfoItem label="Current Organization" value={appData.professionalDetails.currentOrg} />
              <InfoItem label="Current Designation" value={appData.professionalDetails.currentDesignation} />
              <InfoItem label="Total Experience" value={appData.professionalDetails.totalExperience} />
              <InfoItem label="Highest Qualification" value={appData.professionalDetails.highestQualification} />
              <InfoItem label="Notice Period" value={appData.professionalDetails.noticePeriod} />
              <div className="col-span-2 pt-1">
                <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">Core Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {appData.professionalDetails.skills.map(s => (
                    <span key={s} className="px-3 py-1 text-[11px] font-bold bg-[#3538CD]/5 text-[#3538CD] rounded-lg border border-[#3538CD]/10 uppercase tracking-tight">{s}</span>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <InfoItem label="Additional Notes" value={appData.professionalDetails.generalRemarks} />
              </div>
            </div>
          </AccordionCard>

          <AccordionCard title="Address Information">
            <div className="grid grid-cols-2 gap-x-10 gap-y-5">
              <div className="col-span-2">
                <InfoItem label="Residential Address" value={appData.address.address} />
              </div>
              <InfoItem label="Country" value={appData.address.country} />
              <InfoItem label="State" value={appData.address.state} />
              <InfoItem label="Town / City" value={appData.address.townCity} />
              <InfoItem label="Zip / Postal Code" value={appData.address.zipCode} />
            </div>
          </AccordionCard>

          <AccordionCard title="Salary Information">
            <div className="grid grid-cols-2 gap-x-10 gap-y-5">
              <InfoItem label="CTC Type" value={appData.salaryInfo.ctcType} />
              <InfoItem label="Currency" value={appData.salaryInfo.currency} />
              <InfoItem label="Current CTC" value={`₹ ${appData.salaryInfo.currentCtc}`} />
              <InfoItem label="Expected CTC" value={`₹ ${appData.salaryInfo.expectedCtc}`} />
            </div>
          </AccordionCard>

          <AccordionCard title="Additional Information">
            <div className="grid grid-cols-2 gap-x-10 gap-y-5">
              <div className="col-span-2">
                <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1.5">Portfolio URL</p>
                <a href={appData.additionalInfo.portfolioUrl} target="_blank" rel="noreferrer"
                  className="text-sm font-semibold text-[#3538CD] hover:underline flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  {appData.additionalInfo.portfolioUrl}
                </a>
              </div>
              <InfoItem label="Open to Relocate?" value={appData.additionalInfo.reloate} />
            </div>
          </AccordionCard>

          <AccordionCard title="Resume">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F4F5FA] flex items-center justify-center text-[#3538CD] border border-[#E5E7EB] shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#111827] truncate">{appData.resume.filename}</p>
                <p className="text-[10px] text-[#9CA3AF] font-medium uppercase tracking-widest mt-0.5">PDF · 2.4 MB</p>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs font-black text-[#6B7280] hover:text-[#3538CD] hover:border-[#3538CD]/30 transition-all uppercase tracking-widest shadow-sm">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </AccordionCard>

        </div>
      </div>

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#111827]/60 backdrop-blur-sm" onClick={() => setIsWithdrawModalOpen(false)} />
          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden border border-[#E5E7EB] animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-[#111827] tracking-tight mb-2">Withdraw Application?</h3>
              <p className="text-[#6B7280] text-sm font-medium leading-relaxed mb-7">
                Are you sure you want to withdraw your application for <span className="font-black text-[#111827]">{job.title}</span>?
                This action cannot be undone and the recruiter will be notified.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="flex-1 px-6 py-3.5 bg-[#F9FAFB] text-[#111827] text-xs font-black rounded-2xl hover:bg-[#F3F4F6] transition-all uppercase tracking-widest border border-[#E5E7EB]"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    withdrawApplication(application.id);
                    setIsWithdrawModalOpen(false);
                    navigate(`/portal/${slug}/profile`);
                  }}
                  className="flex-1 px-6 py-3.5 bg-red-600 text-white text-xs font-black rounded-2xl hover:bg-red-700 transition-all uppercase tracking-widest shadow-lg"
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

function AccordionCard({ title, children, defaultExpanded = true }: { title: string; children: React.ReactNode; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F9FAFB] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-0.5 h-4 bg-[#3538CD] rounded-full" />
          <span className="text-xs font-black text-[#111827] uppercase tracking-widest">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="px-6 pb-6 pt-4 border-t border-[#F3F4F6]">
          {children}
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">{label}</p>
      <div className="text-sm font-semibold text-[#111827] leading-relaxed">
        {value || <span className="text-[#D1D5DB] font-normal">Not provided</span>}
      </div>
    </div>
  );
}
