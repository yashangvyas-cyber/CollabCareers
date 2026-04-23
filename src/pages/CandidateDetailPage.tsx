import { useState } from 'react';
import { useParams } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import { Mail, Phone, Copy, Eye, MoreVertical, ExternalLink, UserCheck, EyeOff, Briefcase } from 'lucide-react';
import { useApp } from '../store/AppContext';

function DetailField({ label, value, isLink }: { label: string; value?: string; isLink?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">{label}</p>
      {isLink && value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#3538CD] hover:underline flex items-center gap-1.5">
          {value} <ExternalLink className="w-3.5 h-3.5" />
        </a>
      ) : (
        <p className="text-sm font-bold text-[#1A1A2E]">{value || '–'}</p>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-6 py-4 bg-[#F9FAFB] border-b border-[#E5E7EB] flex flex-col gap-0.5">
      <h3 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wider">{title}</h3>
      {subtitle && <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">{subtitle}</p>}
    </div>
  );
}

const mockCandidatesMap: Record<string, {
  firstName: string; lastName: string; email: string; phone: string;
  isAlumni: boolean; currentOrg?: string; currentDesignation?: string;
  noticePeriod?: string; skills: string[];
}> = {
  '1': { firstName: 'Mahesh', lastName: 'Patel', email: 'Mahesh@gmail.com', phone: '+91 98765 43210', isAlumni: true, currentOrg: 'MindInventory', currentDesignation: 'React Developer', noticePeriod: '30 days', skills: ['React', 'JavaScript', 'TypeScript'] },
  '2': { firstName: 'Priya', lastName: 'Shah', email: 'priya@gmail.com', phone: '+91 97654 32109', isAlumni: true, currentOrg: 'DesignCo', currentDesignation: 'UI/UX Designer', noticePeriod: '15 days', skills: ['Figma', 'Design Systems', 'Prototyping'] },
  '3': { firstName: 'Arjun', lastName: 'Mehta', email: 'arjun@gmail.com', phone: '+91 96543 21098', isAlumni: false, currentOrg: 'FlutterApps', currentDesignation: 'Flutter Developer', noticePeriod: 'Immediate joiner', skills: ['Dart', 'Firebase', 'Flutter'] },
  '4': { firstName: 'Sneha', lastName: 'Patel', email: 'sneha@gmail.com', phone: '+91 95432 10987', isAlumni: false, currentOrg: 'BizAnalytics', currentDesignation: 'Business Analyst', noticePeriod: '30 days', skills: ['Agile', 'JIRA', 'SQL'] },
  '5': { firstName: 'Rahul', lastName: 'Joshi', email: 'rahul@gmail.com', phone: '+91 94321 09876', isAlumni: false, currentOrg: 'ProjMasters', currentDesignation: 'Project Manager', noticePeriod: '60 days', skills: ['Agile', 'Jira', 'Kanban'] },
  '6': { firstName: 'Kavya', lastName: 'Rao', email: 'kavya@gmail.com', phone: '+91 93210 98765', isAlumni: false, currentOrg: 'ArtStudio', currentDesignation: '2D Artist', noticePeriod: 'Immediate joiner', skills: ['Illustrator', 'Photoshop', 'After Effects'] },
};

type MockAppRow = { no: number; appliedDate: string; jobTitle: string; businessUnit: string; source: string; status: string; recruiter: string; lastInterview: string; };
const mockAppliedJobsMap: Record<string, MockAppRow[]> = {
  '1': [
    { no: 1, appliedDate: '21 Apr 2026', jobTitle: 'React Developer', businessUnit: 'MindInventory', source: 'CollabCareers', status: 'Under Review', recruiter: 'Super User', lastInterview: 'Not scheduled' },
    { no: 2, appliedDate: '10 Apr 2026', jobTitle: 'Node.js Backend Engineer', businessUnit: 'MindInventory', source: 'CollabCareers', status: 'Interview Scheduled', recruiter: 'Super User', lastInterview: '25 Apr 2026' },
  ],
  '2': [
    { no: 1, appliedDate: '18 Apr 2026', jobTitle: 'UI/UX Designer', businessUnit: 'MindInventory', source: 'CollabCareers', status: 'Interview in Progress', recruiter: 'Super User', lastInterview: '22 Apr 2026' },
  ],
  '3': [
    { no: 1, appliedDate: '23 Apr 2026', jobTitle: 'Flutter Developer', businessUnit: 'MindInventory', source: 'CollabCareers', status: 'Submitted', recruiter: 'Super User', lastInterview: 'Not scheduled' },
    { no: 2, appliedDate: '15 Apr 2026', jobTitle: 'DevOps Engineer', businessUnit: 'MindInventory', source: 'CollabCareers', status: 'Rejected', recruiter: 'Super User', lastInterview: '18 Apr 2026' },
  ],
  '4': [
    { no: 1, appliedDate: '22 Apr 2026', jobTitle: 'Business Analyst', businessUnit: 'MindInventory', source: 'CollabCareers', status: 'Draft', recruiter: 'Super User', lastInterview: 'Not scheduled' },
  ],
  '5': [
    { no: 1, appliedDate: '18 Apr 2026', jobTitle: 'Project Manager', businessUnit: 'MindInventory', source: 'CollabCareers', status: 'Decision Made', recruiter: 'Super User', lastInterview: '20 Apr 2026' },
    { no: 2, appliedDate: '05 Apr 2026', jobTitle: 'Business Analyst', businessUnit: 'MindInventory', source: 'CollabCareers', status: 'Rejected', recruiter: 'Super User', lastInterview: '10 Apr 2026' },
  ],
  '6': [
    { no: 1, appliedDate: '20 Apr 2026', jobTitle: '2D Artist', businessUnit: 'MindInventory', source: 'CollabCareers', status: 'Under Review', recruiter: 'Super User', lastInterview: 'Not scheduled' },
  ],
};

export default function CandidateDetailPage() {
  const { candidateId } = useParams();
  const { candidates, applications, jobs } = useApp();

  const portalCandidate = candidates.find(c => c.id === candidateId);

  // Look up from mock map (for ATS candidates from listing page)
  const mockData = candidateId ? mockCandidatesMap[candidateId] : undefined;
  const isMockCandidate = !portalCandidate;
  const firstName = portalCandidate?.firstName ?? mockData?.firstName ?? 'Unknown';
  const lastName = portalCandidate?.lastName ?? mockData?.lastName ?? 'Candidate';
  const email = portalCandidate?.email ?? mockData?.email ?? '-';
  const phone = portalCandidate?.phone ?? mockData?.phone ?? '-';
  const isAlumni = portalCandidate?.isAlumni ?? mockData?.isAlumni ?? false;
  const alumniEmail = portalCandidate?.alumniEmail ?? 'verified@yopmails.com';
  const currentOrg = portalCandidate?.currentOrg ?? mockData?.currentOrg;
  const currentDesignation = portalCandidate?.currentDesignation ?? mockData?.currentDesignation;
  const noticePeriod = portalCandidate?.noticePeriod ?? mockData?.noticePeriod;
  const skills = portalCandidate?.skills ?? mockData?.skills ?? [];
  const allowRecruiterContact = portalCandidate?.allowRecruiterContact;

  const candidateApplications = applications.filter(a => a.candidateId === candidateId);
  const latestApp = candidateApplications[0];
  const appliedJob = latestApp ? jobs.find(j => j.id === latestApp.jobId) : null;

  // Mock applied jobs for ATS (listing) candidates
  const mockAppsForThisCandidate: MockAppRow[] = (isMockCandidate && candidateId) ? (mockAppliedJobsMap[candidateId] ?? []) : [];
  const totalApplicationCount = isMockCandidate ? mockAppsForThisCandidate.length : candidateApplications.length;

  const tabs = ['Candidate Details', 'Applied Jobs', 'Interview Details', 'Notes', 'History'];
  const [activeTab, setActiveTab] = useState('Candidate Details');

  return (
    <CRMLayout
      breadcrumbs={[
        { label: 'Candidates', path: '/crm/candidates' },
        { label: `${firstName} ${lastName}` },
      ]}
    >
      <div className="flex gap-8 items-start">
        {/* LEFT SIDEBAR */}
        <div className="w-[300px] shrink-0 sticky top-[80px]">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#3538CD]/5 flex items-center justify-center text-[#3538CD] font-black text-3xl mb-4 border-4 border-white shadow-sm">
                {firstName[0]}{lastName[0]}
              </div>

              <h2 className="text-xl font-black text-[#1A1A2E] text-center tracking-tight">{firstName} {lastName}</h2>
              {currentDesignation && (
                <p className="text-sm font-bold text-[#3538CD] mt-1 text-center">{currentDesignation}</p>
              )}

              <div className="flex flex-col items-center gap-2 mt-4">
                <span className="px-4 py-1.5 text-[10px] font-black bg-[#F4F5FA] text-[#3538CD] border border-[#3538CD]/20 rounded-full uppercase tracking-widest">
                  Active
                </span>

                {isAlumni && (
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="px-4 py-1.5 text-[10px] font-black bg-[#3538CD] text-white rounded-full uppercase tracking-widest">
                      Alumni
                    </span>
                    <p className="text-[10px] font-bold text-[#6B7280] text-center leading-relaxed">
                      Previously worked here · Verified via {alumniEmail} · Jan 2022 – Dec 2024
                    </p>
                  </div>
                )}

                {/* Talent pool contact preference */}
                {!isMockCandidate && (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border ${
                    allowRecruiterContact
                      ? 'bg-green-50 text-green-600 border-green-200'
                      : 'bg-gray-50 text-gray-500 border-gray-200'
                  }`}>
                    {allowRecruiterContact
                      ? <><UserCheck className="w-3.5 h-3.5" /> Open to contact</>
                      : <><EyeOff className="w-3.5 h-3.5" /> Prefers to apply first</>
                    }
                  </div>
                )}
              </div>

              <div className="w-full border-t border-[#E5E7EB] my-6" />

              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#E5E7EB] rounded-2xl text-xs font-black text-[#374151] hover:bg-[#F9FAFB] transition-all uppercase tracking-widest">
                <Eye className="w-4 h-4" /> View Resume
              </button>

              <div className="w-full space-y-4 mt-6">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center text-[#6B7280] group-hover:text-[#3538CD] transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Email</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#374151] truncate">{email}</span>
                      <Copy className="w-3.5 h-3.5 text-[#6B7280] hover:text-[#3538CD] shrink-0" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center text-[#6B7280] group-hover:text-[#3538CD] transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Phone</p>
                    <span className="text-sm font-bold text-[#374151]">{phone}</span>
                  </div>
                </div>

                <div 
                  className="flex items-center gap-3 group cursor-pointer"
                  onClick={() => setActiveTab('Applied Jobs')}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center text-[#6B7280] group-hover:text-[#3538CD] transition-colors">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Total Applications</p>
                    <span className="text-sm font-bold text-[#3538CD] underline decoration-[#3538CD]/30 underline-offset-4 hover:decoration-[#3538CD]">
                      {totalApplicationCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-[#E5E7EB] my-6" />

              <div className="w-full space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Created by</p>
                  <p className="text-[10px] font-bold text-[#6B7280]">Super User · 16/Mar/2026, 12:18 PM</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Modified by</p>
                  <p className="text-[10px] font-bold text-[#6B7280]">Super User · 16/Mar/2026, 05:11 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6 bg-white p-2 rounded-2xl border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all rounded-xl ${
                    tab === activeTab
                      ? 'bg-[#3538CD] text-white shadow-md shadow-[#3538CD]/20'
                      : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 pr-2">
              {!isMockCandidate && !appliedJob ? (
                <span className="px-4 py-2 text-xs font-black text-[#9CA3AF] border border-[#E5E7EB] rounded-xl uppercase tracking-widest">
                  No Application Yet
                </span>
              ) : (
                <button className="bg-[#3538CD] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#292bb0] transition-all shadow-lg shadow-[#3538CD]/20">
                  Schedule Interview
                </button>
              )}
              <button className="p-3 rounded-xl border-2 border-[#E5E7EB] hover:bg-[#F9FAFB] transition-all">
                <MoreVertical className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === 'Candidate Details' && (
              <>
                {/* Talent Pool notice banner */}
                {!isMockCandidate && !appliedJob && (
              <div className="bg-[#F4F5FA] border border-[#3538CD]/10 rounded-2xl px-6 py-4 flex items-center gap-3">
                <span className="inline-flex px-3 py-1 bg-[#3538CD] text-white text-[10px] font-black rounded-lg uppercase tracking-widest shrink-0">
                  Talent Pool
                </span>
                <p className="text-xs font-bold text-[#6B7280]">
                  This candidate registered via the CollabCareers portal and is open to being discovered. They have not yet applied to any job.
                </p>
              </div>
            )}

            {/* Applied Job (if any) */}
            {appliedJob && (
              <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <SectionHeader title="Applied Job" />
                <div className="p-6 grid grid-cols-3 gap-8">
                  <DetailField label="Job Title" value={appliedJob.title} />
                  <DetailField label="Business Unit" value={appliedJob.businessUnit} />
                  <DetailField label="Status" value={latestApp?.status} />
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <SectionHeader title="Personal Information" />
              <div className="p-6 grid grid-cols-3 gap-8">
                <DetailField label="Date of Birth" value={isMockCandidate ? '15/Aug/1998' : undefined} />
                <DetailField label="Gender" value={isMockCandidate ? 'Male' : undefined} />
                <DetailField label="Marital Status" value={isMockCandidate ? 'Single' : undefined} />
              </div>
            </div>

            {/* Professional Details */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <SectionHeader title="Professional Details" />
              <div className="p-6 space-y-8">
                <div className="grid grid-cols-3 gap-8">
                  <DetailField label="Current Organization" value={currentOrg} />
                  <DetailField label="Current Designation" value={currentDesignation} />
                  <DetailField label="Notice Period" value={noticePeriod} />
                  <DetailField label="Total Experience" value={isMockCandidate ? '3 Years, 2 Months' : undefined} />
                  <DetailField label="Highest Qualification" value={isMockCandidate ? 'B.Tech Computer Science' : undefined} />
                </div>
                {skills.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs font-bold text-[#1A1A2E]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {isMockCandidate && (
                  <DetailField label="General Remarks" value="Excellent problem solving skills and deep understanding of React ecosystem." />
                )}
              </div>
            </div>

            {/* Salary — only for ATS candidates */}
            {isMockCandidate && (
              <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <SectionHeader title="Salary Information" />
                <div className="p-6 grid grid-cols-4 gap-8">
                  <DetailField label="CTC Type" value="Annual" />
                  <DetailField label="Current CTC" value="₹6,00,000" />
                  <DetailField label="Expected CTC" value="₹9,00,000" />
                  <DetailField label="Currency" value="INR" />
                </div>
              </div>
            )}

            {/* Address — only for ATS candidates */}
            {isMockCandidate && (
              <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <SectionHeader title="Address" />
                <div className="p-6 space-y-8">
                  <DetailField label="Address" value="123 Corporate Greens, Sector 45" />
                  <div className="grid grid-cols-4 gap-8">
                    <DetailField label="Country" value="India" />
                    <DetailField label="State" value="Gujarat" />
                    <DetailField label="Town/City" value="Ahmedabad" />
                    <DetailField label="Zip/Postal Code" value="380054" />
                  </div>
                </div>
              </div>
            )}

            {/* Source */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <SectionHeader title="Source Information" />
              <div className="p-6 grid grid-cols-3 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Source</p>
                  <span className="inline-flex px-3 py-1.5 bg-[#3538CD] text-white text-[11px] font-black rounded-lg uppercase tracking-wider">
                    CollabCareers
                  </span>
                </div>
                <DetailField label="Remark" value={isMockCandidate ? 'Referred via portal' : 'Self-registered via portal'} />
                <DetailField label="Record Owner" value="Super User" />
              </div>
            </div>

            {/* Additional Info — only for ATS candidates with job applications */}
            {isMockCandidate && (
              <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <SectionHeader
                  title="Additional Information"
                  subtitle="Answers submitted by candidate for this job's custom fields"
                />
                <div className="p-6 grid grid-cols-2 gap-8">
                  <DetailField label="Portfolio URL" value="https://alex.design" isLink />
                  <DetailField label="Are you open to relocate?" value="Yes" />
                </div>
              </div>
            )}
              </>
            )}

            {activeTab === 'Applied Jobs' && (
              <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                        <th className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest">No</th>
                        <th className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest">Applied Date</th>
                        <th className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest">Job Title</th>
                        <th className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest">Business Unit</th>
                        <th className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest">Source</th>
                        <th className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest">Application Status</th>
                        <th className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest">Recruiter</th>
                        <th className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest">Last Interview</th>
                        <th className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {isMockCandidate ? (
                        mockAppsForThisCandidate.length === 0 ? (
                          <tr><td colSpan={9} className="px-6 py-12 text-center text-[#6B7280] text-sm font-medium">No applications found.</td></tr>
                        ) : (
                          mockAppsForThisCandidate.map((app) => (
                            <tr key={app.no} className="hover:bg-[#F9FAFB] transition-colors">
                              <td className="px-6 py-4 font-bold text-[#111827]">{app.no}</td>
                              <td className="px-6 py-4 text-[#374151] font-medium">{app.appliedDate}</td>
                              <td className="px-6 py-4 font-bold text-[#3538CD]">{app.jobTitle}</td>
                              <td className="px-6 py-4 text-[#374151] font-medium">{app.businessUnit}</td>
                              <td className="px-6 py-4 text-[#374151] font-medium">{app.source}</td>
                              <td className="px-6 py-4">
                                <span className="inline-flex px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md bg-[#F4F5FA] text-[#3538CD] border border-[#3538CD]/10">{app.status}</span>
                              </td>
                              <td className="px-6 py-4 text-[#374151] font-medium">{app.recruiter}</td>
                              <td className="px-6 py-4 text-[#6B7280] italic">{app.lastInterview}</td>
                              <td className="px-6 py-4">
                                <button className="text-[#3538CD] font-bold text-xs hover:underline uppercase tracking-widest">View</button>
                              </td>
                            </tr>
                          ))
                        )
                      ) : (
                        candidateApplications.length === 0 ? (
                          <tr><td colSpan={9} className="px-6 py-12 text-center text-[#6B7280] text-sm font-medium">No applications found.</td></tr>
                        ) : (
                          candidateApplications.map((app, i) => {
                            const job = jobs.find(j => j.id === app.jobId);
                            return (
                              <tr key={app.id} className="hover:bg-[#F9FAFB] transition-colors">
                                <td className="px-6 py-4 font-bold text-[#111827]">{i + 1}</td>
                                <td className="px-6 py-4 text-[#374151] font-medium">
                                  {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                </td>
                                <td className="px-6 py-4 font-bold text-[#3538CD]">{job?.title || 'Unknown Job'}</td>
                                <td className="px-6 py-4 text-[#374151] font-medium">{job?.businessUnit || 'N/A'}</td>
                                <td className="px-6 py-4 text-[#374151] font-medium">CollabCareers</td>
                                <td className="px-6 py-4">
                                  <span className="inline-flex px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md bg-[#F4F5FA] text-[#3538CD] border border-[#3538CD]/10">{app.status}</span>
                                </td>
                                <td className="px-6 py-4 text-[#374151] font-medium">Super User</td>
                                <td className="px-6 py-4 text-[#6B7280] italic">Not scheduled</td>
                                <td className="px-6 py-4">
                                  <button className="text-[#3538CD] font-bold text-xs hover:underline uppercase tracking-widest">View</button>
                                </td>
                              </tr>
                            );
                          })
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
