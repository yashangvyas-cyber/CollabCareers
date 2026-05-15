import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import { Mail, Phone, Copy, Eye, MoreVertical, ExternalLink, UserCheck, EyeOff, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';
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

const APP_STATUS_STYLE: Record<string, { border: string; text: string; bg: string; dot: string }> = {
  'Applied':               { border: 'rgb(191,219,254)', text: 'rgb(29,78,216)',   bg: 'rgb(239,246,255)', dot: 'rgb(59,130,246)'  },
  'Under Review':          { border: 'rgb(191,219,254)', text: 'rgb(29,78,216)',   bg: 'rgb(239,246,255)', dot: 'rgb(59,130,246)'  },
  'Shortlisted':           { border: 'rgb(167,243,208)', text: 'rgb(6,95,70)',     bg: 'rgb(236,253,245)', dot: 'rgb(16,185,129)'  },
  'Interview in Progress': { border: 'rgb(253,230,138)', text: 'rgb(146,64,14)',   bg: 'rgb(255,251,235)', dot: 'rgb(245,158,11)'  },
  'Offer Made':            { border: 'rgb(167,243,208)', text: 'rgb(6,78,59)',     bg: 'rgb(209,250,229)', dot: 'rgb(5,150,105)'   },
  'Offer Accepted':        { border: 'rgb(167,243,208)', text: 'rgb(6,78,59)',     bg: 'rgb(209,250,229)', dot: 'rgb(5,150,105)'   },
  'On Hold':               { border: 'rgb(221,214,254)', text: 'rgb(91,33,182)',   bg: 'rgb(245,243,255)', dot: 'rgb(139,92,246)'  },
  'Selected':              { border: 'rgb(171,239,198)', text: 'rgb(6,118,71)',    bg: 'rgb(236,253,243)', dot: 'rgb(23,178,106)'  },
  'Rejected':              { border: 'rgb(254,205,202)', text: 'rgb(180,35,24)',   bg: 'rgb(254,243,242)', dot: 'rgb(240,68,56)'   },
  'Withdrawn':             { border: 'rgb(220,215,210)', text: 'rgb(113,104,95)',  bg: 'rgb(250,249,247)', dot: 'rgb(168,160,149)' },
  'Joined':                { border: 'rgb(213,217,235)', text: 'rgb(54,63,114)',   bg: 'rgb(248,249,252)', dot: 'rgb(78,91,166)'   },
  'Offer Declined':        { border: 'rgb(246,208,254)', text: 'rgb(159,26,177)',  bg: 'rgb(253,244,255)', dot: 'rgb(212,68,241)'  },
  'Not Joined':            { border: 'rgb(255,193,205)', text: 'rgb(255,0,81)',    bg: 'rgb(255,241,243)', dot: 'rgb(255,0,81)'    },
  'Archived':              { border: 'rgb(203,213,225)', text: 'rgb(71,85,105)',   bg: 'rgb(248,250,252)', dot: 'rgb(100,116,139)' },
  'Offer Revoked':         { border: 'rgb(255,221,211)', text: 'rgb(255,87,34)',   bg: 'rgb(255,247,244)', dot: 'rgb(255,137,100)' },
  'No Show':               { border: 'rgb(253,186,116)', text: 'rgb(120,53,15)',   bg: 'rgb(255,247,237)', dot: 'rgb(217,119,6)'   },
};

const mockCandidatesMap: Record<string, {
  firstName: string; lastName: string; email: string; phone: string;
  isAlumni: boolean; alumniEmail?: string; experiences?: any[];
  noticePeriod?: string; skills: string[];
}> = {
  '1': { firstName: 'Mahesh', lastName: 'Patel', email: 'Mahesh@gmail.com', phone: '+91 98765 43210', isAlumni: true, alumniEmail: 'mahesh@mindinventory.com', experiences: [{ id: 1, company: 'MindInventory', designation: 'React Developer', from: '2022-Jan', to: 'Present', isCurrent: true, description: 'Developing core features.' }], noticePeriod: '30 days', skills: ['React', 'JavaScript', 'TypeScript'] },
  '2': { firstName: 'Priya', lastName: 'Shah', email: 'priya@gmail.com', phone: '+91 97654 32109', isAlumni: true, alumniEmail: 'priya@mindinventory.com', experiences: [{ id: 1, company: 'DesignCo', designation: 'UI/UX Designer', from: '2020-Mar', to: 'Present', isCurrent: true, description: 'Leading UI team.' }], noticePeriod: '15 days', skills: ['Figma', 'Design Systems', 'Prototyping'] },
  '3': { firstName: 'Arjun', lastName: 'Mehta', email: 'arjun@gmail.com', phone: '+91 96543 21098', isAlumni: false, experiences: [{ id: 1, company: 'FlutterApps', designation: 'Flutter Developer', from: '2021-Jul', to: 'Present', isCurrent: true, description: 'Building cross-platform apps.' }], noticePeriod: 'Immediate joiner', skills: ['Dart', 'Firebase', 'Flutter'] },
  '4': { firstName: 'Sneha', lastName: 'Patel', email: 'sneha@gmail.com', phone: '+91 95432 10987', isAlumni: false, experiences: [{ id: 1, company: 'BizAnalytics', designation: 'Business Analyst', from: '2019-Feb', to: 'Present', isCurrent: true, description: 'Analyzing market trends.' }], noticePeriod: '30 days', skills: ['Agile', 'JIRA', 'SQL'] },
  '5': { firstName: 'Rahul', lastName: 'Joshi', email: 'rahul@gmail.com', phone: '+91 94321 09876', isAlumni: false, experiences: [{ id: 1, company: 'ProjMasters', designation: 'Project Manager', from: '2018-Aug', to: 'Present', isCurrent: true, description: 'Managing enterprise projects.' }], noticePeriod: '60 days', skills: ['Agile', 'Jira', 'Kanban'] },
  '6': { firstName: 'Kavya', lastName: 'Rao', email: 'kavya@gmail.com', phone: '+91 93210 98765', isAlumni: false, experiences: [{ id: 1, company: 'ArtStudio', designation: '2D Artist', from: '2022-Nov', to: 'Present', isCurrent: true, description: 'Creating game assets.' }], noticePeriod: 'Immediate joiner', skills: ['Illustrator', 'Photoshop', 'After Effects'] },
};

type MockAppRow = { no: number; appliedDate: string; jobCode: string; jobTitle: string; status: string; };
const mockAppliedJobsMap: Record<string, MockAppRow[]> = {
  '1': [
    { no: 1, appliedDate: '21 Apr 2026', jobCode: 'MI-001', jobTitle: 'React Developer', status: 'Under Review' },
    { no: 2, appliedDate: '10 Apr 2026', jobCode: 'MI-002', jobTitle: 'Node.js Backend Engineer', status: 'Interview in Progress' },
  ],
  '2': [
    { no: 1, appliedDate: '18 Apr 2026', jobCode: 'MI-003', jobTitle: 'UI/UX Designer', status: 'Interview in Progress' },
  ],
  '3': [
    { no: 1, appliedDate: '23 Apr 2026', jobCode: 'MI-004', jobTitle: 'Flutter Developer', status: 'Applied' },
    { no: 2, appliedDate: '15 Apr 2026', jobCode: 'MI-005', jobTitle: 'DevOps Engineer', status: 'Rejected' },
  ],
  '4': [
    { no: 1, appliedDate: '22 Apr 2026', jobCode: 'MI-006', jobTitle: 'Business Analyst', status: 'Applied' },
  ],
  '5': [
    { no: 1, appliedDate: '18 Apr 2026', jobCode: 'MI-007', jobTitle: 'Project Manager', status: 'Selected' },
    { no: 2, appliedDate: '05 Apr 2026', jobCode: 'MI-008', jobTitle: 'Business Analyst', status: 'Rejected' },
  ],
  '6': [
    { no: 1, appliedDate: '20 Apr 2026', jobCode: 'MI-009', jobTitle: '2D Artist', status: 'Under Review' },
  ],
};

type MockRound = {
  no: number; name: string; mode: 'Offline' | 'Online'; datetime: string;
  status: 'Completed' | 'Scheduled' | 'Cancelled'; panelSuggestion: 'Should Hire' | 'On Hold' | 'Reject';
  panel: string[]; scheduledBy: string; scheduledAt: string; duration: string;
  additionalInfo: string; feedbackScore: number; feedbackBy: string;
};
type MockInterviewDetails = { offerStatus: string; department: string; joiningOn: string; remarks: string; rounds: MockRound[]; };

const mockInterviewMap: Record<string, MockInterviewDetails> = {
  '1': {
    offerStatus: 'Offer Accepted', department: 'Engineering', joiningOn: '01/Jan/2027', remarks: '-',
    rounds: [
      { no: 1, name: 'Aptitude Test', mode: 'Offline', datetime: '28/Nov/2025, 08:06 PM', status: 'Completed', panelSuggestion: 'Should Hire', panel: ['Super User'], scheduledBy: 'Super User', scheduledAt: '28/Nov/2025, 11:36 PM', duration: '60 Minutes', additionalInfo: '-', feedbackScore: 9, feedbackBy: 'Super User' },
      { no: 2, name: 'Technical Round', mode: 'Online', datetime: '01/Dec/2025, 11:00 AM', status: 'Completed', panelSuggestion: 'Should Hire', panel: ['Super User', 'Rajan Mehta'], scheduledBy: 'Super User', scheduledAt: '30/Nov/2025, 09:00 AM', duration: '90 Minutes', additionalInfo: 'React and TypeScript deep dive.', feedbackScore: 8, feedbackBy: 'Rajan Mehta' },
    ],
  },
  '2': {
    offerStatus: 'Interview in Progress', department: 'Design', joiningOn: '-', remarks: '-',
    rounds: [
      { no: 1, name: 'Portfolio Review', mode: 'Online', datetime: '22/Apr/2026, 03:00 PM', status: 'Completed', panelSuggestion: 'Should Hire', panel: ['Super User'], scheduledBy: 'Super User', scheduledAt: '21/Apr/2026, 05:00 PM', duration: '45 Minutes', additionalInfo: '-', feedbackScore: 8, feedbackBy: 'Super User' },
    ],
  },
  '3': {
    offerStatus: 'Shortlisted', department: 'Mobile', joiningOn: '-', remarks: '-',
    rounds: [
      { no: 1, name: 'HR Screening', mode: 'Online', datetime: '25/Apr/2026, 10:00 AM', status: 'Scheduled', panelSuggestion: 'Should Hire', panel: ['Super User'], scheduledBy: 'Super User', scheduledAt: '24/Apr/2026, 06:00 PM', duration: '30 Minutes', additionalInfo: '-', feedbackScore: 0, feedbackBy: 'Super User' },
    ],
  },
};

const ROUND_STATUS_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  'Completed': { bg: 'rgb(240,253,244)', border: 'rgb(187,247,208)', text: 'rgb(21,128,61)' },
  'Scheduled': { bg: 'rgb(239,246,255)', border: 'rgb(191,219,254)', text: 'rgb(29,78,216)' },
  'Cancelled': { bg: 'rgb(254,242,242)', border: 'rgb(254,202,202)', text: 'rgb(185,28,28)' },
};
const SUGGESTION_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  'Should Hire': { bg: 'rgb(240,253,244)', border: 'rgb(187,247,208)', text: 'rgb(22,101,52)'  },
  'On Hold':     { bg: 'rgb(255,251,235)', border: 'rgb(253,230,138)', text: 'rgb(146,64,14)'  },
  'Reject':      { bg: 'rgb(254,242,242)', border: 'rgb(254,202,202)', text: 'rgb(185,28,28)'  },
};

function SortIcon({ active, dir }: { active: boolean; dir: 'asc' | 'desc' | null }) {
  if (!active || !dir) return <ArrowUpDown className="w-3 h-3 text-[#9CA3AF]" />;
  return dir === 'asc' ? <ArrowUp className="w-3 h-3 text-[#3538CD]" /> : <ArrowDown className="w-3 h-3 text-[#3538CD]" />;
}

export default function CandidateDetailPage() {
  const { candidateId } = useParams();
  const { candidates, applications, jobs } = useApp();

  const portalCandidate = candidates.find(c => c.id === candidateId);

  const mockData = candidateId ? mockCandidatesMap[candidateId] : undefined;
  const isMockCandidate = !portalCandidate;
  const firstName = portalCandidate?.firstName ?? mockData?.firstName ?? 'Unknown';
  const lastName = portalCandidate?.lastName ?? mockData?.lastName ?? 'Candidate';
  const email = portalCandidate?.email ?? mockData?.email ?? '-';
  const phone = portalCandidate?.phone ?? mockData?.phone ?? '-';
  const isAlumni = portalCandidate?.isAlumni ?? mockData?.isAlumni ?? false;
  const alumniEmail = portalCandidate?.alumniEmail ?? mockData?.alumniEmail ?? 'verified@yopmails.com';
  const experiences = portalCandidate?.experiences ?? mockData?.experiences ?? [];
  const noticePeriod = portalCandidate?.noticePeriod ?? mockData?.noticePeriod;
  const skills = portalCandidate?.skills ?? mockData?.skills ?? [];
  const allowRecruiterContact = portalCandidate?.allowRecruiterContact;

  const candidateApplications = applications.filter(a => a.candidateId === candidateId);
  const latestApp = candidateApplications[0];
  const appliedJob = latestApp ? jobs.find(j => j.id === latestApp.jobId) : null;

  const mockAppsForThisCandidate: MockAppRow[] = (isMockCandidate && candidateId) ? (mockAppliedJobsMap[candidateId] ?? []) : [];
  const totalApplicationCount = isMockCandidate ? mockAppsForThisCandidate.length : candidateApplications.length;

  const tabs = ['Applicant Details', 'Interview Details', 'Applied Jobs', 'Notes', 'History'];
  const [activeTab, setActiveTab] = useState('Applicant Details');
  const [appliedSortDir, setAppliedSortDir] = useState<'asc' | 'desc' | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState<boolean[]>([]);

  const interviewData: MockInterviewDetails | null = isMockCandidate && candidateId ? (mockInterviewMap[candidateId] ?? null) : null;
  const avgScore = interviewData?.rounds.length
    ? Math.round(interviewData.rounds.reduce((s, r) => s + r.feedbackScore, 0) / interviewData.rounds.length)
    : 0;
  const offerStyle = interviewData ? (APP_STATUS_STYLE[interviewData.offerStatus] ?? APP_STATUS_STYLE['Applied']) : null;

  const toggleAppliedSort = () => setAppliedSortDir(d => d === 'asc' ? 'desc' : 'asc');

  const sortedMockApps = [...mockAppsForThisCandidate].sort((a, b) => {
    if (!appliedSortDir) return 0;
    const da = new Date(a.appliedDate).getTime();
    const db = new Date(b.appliedDate).getTime();
    return appliedSortDir === 'asc' ? da - db : db - da;
  });

  const sortedPortalApps = [...candidateApplications].sort((a, b) => {
    if (!appliedSortDir) return 0;
    const da = a.appliedAt ? new Date(a.appliedAt).getTime() : 0;
    const db = b.appliedAt ? new Date(b.appliedAt).getTime() : 0;
    return appliedSortDir === 'asc' ? da - db : db - da;
  });

  return (
    <CRMLayout
      breadcrumbs={[
        { label: 'Job Applications', path: '/crm/candidates' },
        { label: `${firstName} ${lastName}` },
      ]}
    >
      <div className="flex gap-8 items-start">
        {/* LEFT SIDEBAR */}
        <div className="w-[300px] shrink-0 sticky top-[80px]">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col items-center">
              <h2 className="text-xl font-black text-[#1A1A2E] text-center tracking-tight">{firstName} {lastName}</h2>
              {experiences.length > 0 && (
                <p className="text-sm font-bold text-[#3538CD] mt-1 text-center">{experiences[0].designation}</p>
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
                      Previously worked here · Verified via{' '}
                      <Link to={`/crm/employees/${candidateId}`} className="text-[#3538CD] hover:underline">{alumniEmail}</Link>
                    </p>
                  </div>
                )}

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
              {tabs.map((tab) => {
                const isActive = tab === activeTab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all rounded-xl flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#3538CD] text-white shadow-md shadow-[#3538CD]/20'
                        : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    {tab}
                    {tab === 'Applied Jobs' && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-[#E5E7EB] text-[#6B7280]'}`}>
                        {totalApplicationCount}
                      </span>
                    )}
                  </button>
                );
              })}
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
            {activeTab === 'Applicant Details' && (
              <>
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

                {/* Professional Details — fields first, Career Journey below */}
                <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                  <SectionHeader title="Professional Details" />
                  <div className="p-6 space-y-8">
                    <div className="grid grid-cols-3 gap-8">
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

                    {experiences.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Career Journey</p>
                        {experiences.map((exp: any, i: number) => (
                          <div key={i} className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-sm font-black text-[#111827]">{exp.designation}</h4>
                                <p className="text-xs font-bold text-[#3538CD]">{exp.company}</p>
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] bg-white border border-[#E5E7EB] px-2.5 py-1 rounded-md">
                                {exp.from} - {exp.to}
                              </span>
                            </div>
                            {exp.description && <p className="text-xs font-medium text-[#4B5563] mt-3 leading-relaxed">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Salary */}
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

                {/* Address */}
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

                {/* Additional Info */}
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
                        <th className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest">
                          <button
                            onClick={toggleAppliedSort}
                            className="flex items-center gap-1.5 hover:text-[#3538CD] transition-colors uppercase tracking-widest"
                          >
                            Applied On
                            <SortIcon active={appliedSortDir !== null} dir={appliedSortDir} />
                          </button>
                        </th>
                        <th className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest">Job Title</th>
                        <th className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest">Application Status</th>
                        <th className="px-6 py-4 font-black text-[#6B7280] text-[10px] uppercase tracking-widest text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {isMockCandidate ? (
                        sortedMockApps.length === 0 ? (
                          <tr><td colSpan={5} className="px-6 py-12 text-center text-[#6B7280] text-sm font-medium">No applications found.</td></tr>
                        ) : (
                          sortedMockApps.map((app) => {
                            const style = APP_STATUS_STYLE[app.status] ?? APP_STATUS_STYLE['Applied'];
                            return (
                              <tr key={app.no} className="hover:bg-[#F9FAFB] transition-colors">
                                <td className="px-6 py-4 font-bold text-[#111827] text-xs">{app.no}</td>
                                <td className="px-6 py-4 text-xs font-medium text-[#374151]">{app.appliedDate}</td>
                                <td className="px-6 py-4">
                                  <span className="text-xs font-bold text-[#3538CD]">{app.jobCode}</span>
                                  <span className="text-xs font-medium text-[#374151]"> | {app.jobTitle}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                                    style={{ borderColor: style.border, color: style.text, backgroundColor: style.bg }}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: style.dot }} />
                                    {app.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <button className="p-1.5 text-[#6B7280] hover:text-[#3538CD] rounded-md hover:bg-[#F3F4F6] transition-colors">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )
                      ) : (
                        sortedPortalApps.length === 0 ? (
                          <tr><td colSpan={5} className="px-6 py-12 text-center text-[#6B7280] text-sm font-medium">No applications found.</td></tr>
                        ) : (
                          sortedPortalApps.map((app, i) => {
                            const job = jobs.find(j => j.id === app.jobId);
                            const style = APP_STATUS_STYLE[app.status] ?? APP_STATUS_STYLE['Applied'];
                            const jobCode = `MI-${(i + 1).toString().padStart(3, '0')}`;
                            return (
                              <tr key={app.id} className="hover:bg-[#F9FAFB] transition-colors">
                                <td className="px-6 py-4 font-bold text-[#111827] text-xs">{i + 1}</td>
                                <td className="px-6 py-4 text-xs font-medium text-[#374151]">
                                  {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-xs font-bold text-[#3538CD]">{jobCode}</span>
                                  <span className="text-xs font-medium text-[#374151]"> | {job?.title || 'Unknown Job'}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                                    style={{ borderColor: style.border, color: style.text, backgroundColor: style.bg }}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: style.dot }} />
                                    {app.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <button className="p-1.5 text-[#6B7280] hover:text-[#3538CD] rounded-md hover:bg-[#F3F4F6] transition-colors">
                                    <Eye className="w-4 h-4" />
                                  </button>
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

            {activeTab === 'Interview Details' && (
              <div className="space-y-4">
                {!interviewData ? (
                  <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm flex flex-col items-center justify-center py-20">
                    <p className="text-sm font-medium text-[#9CA3AF]">No interview details found for this candidate.</p>
                  </div>
                ) : (
                  <>
                    {/* Offer / Status card */}
                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl flex items-center justify-center border"
                            style={{ backgroundColor: offerStyle?.bg, borderColor: offerStyle?.border }}>
                            <UserCheck className="w-5 h-5" style={{ color: offerStyle?.text }} />
                          </div>
                          <div>
                            <p className="text-xs text-[#6B7280] font-medium">Offer Details</p>
                            <p className="text-base font-semibold" style={{ color: offerStyle?.text }}>{interviewData.offerStatus}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {isAlumni && (
                            <Link to={`/crm/employees/${candidateId}`}
                              className="text-xs font-semibold text-white bg-[#3538CD] hover:bg-[#292bb0] px-3.5 py-2 rounded-lg transition-colors">
                              View Employee
                            </Link>
                          )}
                          <button className="w-9 h-9 border border-[#E5E7EB] rounded-lg flex items-center justify-center hover:bg-[#F9FAFB] transition-colors">
                            <MoreVertical className="w-4 h-4 text-[#6B7280]" />
                          </button>
                        </div>
                      </div>
                      <div className="px-5 py-2.5 bg-[#F9FAFB] border-t border-b border-[#E5E7EB] flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-[#6B7280] font-medium">Department:</span>
                          <span className="text-xs font-semibold text-[#374151]">{interviewData.department}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-[#6B7280] font-medium">Joining On:</span>
                          <span className="text-xs font-semibold text-[#374151]">{interviewData.joiningOn}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Remarks</p>
                        <p className="text-xs text-[#6B7280] mt-1">{interviewData.remarks}</p>
                      </div>
                    </div>

                    {/* Interview Rounds */}
                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                      <div className="px-5 py-4 flex items-center justify-between border-b border-[#E5E7EB]">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-semibold text-[#111827]">Interview Rounds</span>
                          <span className="border border-[#3538CD] rounded-xl py-0.5 px-2 bg-[#EEF4FF] text-[#3538CD] text-xs font-medium">
                            {String(interviewData.rounds.length).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#6B7280] font-medium">Feedback Score:</span>
                          <span className="text-lg font-semibold text-[#111827]">{avgScore}</span>
                          <div className="flex leading-none">
                            {Array.from({ length: 10 }, (_, i) => (
                              <span key={i} className="text-xl" style={{ color: i < avgScore ? '#F4B400' : '#E5E7EB' }}>★</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-5 space-y-5">
                        {interviewData.rounds.map((round, idx) => {
                          const isFbOpen = feedbackOpen[idx] ?? false;
                          const statusStyle = ROUND_STATUS_STYLE[round.status] ?? ROUND_STATUS_STYLE['Completed'];
                          const suggStyle = SUGGESTION_STYLE[round.panelSuggestion] ?? SUGGESTION_STYLE['Should Hire'];
                          return (
                            <div key={round.no} className="border border-[#D1D5DB] rounded-xl p-4 space-y-4">
                              {/* Round header row */}
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl border border-green-300 bg-green-50 flex items-center justify-center text-sm font-semibold text-green-700 shrink-0">
                                  {round.no}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-base font-semibold text-[#111827]">{round.name}</span>
                                    <span className="inline-flex items-center border border-[#E5E7EB] bg-[#F9FAFB] text-[#374151] rounded-full text-xs font-medium py-0.5 px-2 capitalize">
                                      {round.mode.toLowerCase()}
                                    </span>
                                  </div>
                                  <p className="text-xs font-medium text-[#6B7280] mt-1">{round.datetime}</p>
                                </div>
                                <div className="flex gap-6 shrink-0">
                                  <div>
                                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1.5">Interview Status</p>
                                    <span className="inline-flex items-center rounded-full border font-medium text-xs py-0.5 px-2.5"
                                      style={{ backgroundColor: statusStyle.bg, borderColor: statusStyle.border, color: statusStyle.text }}>
                                      {round.status}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1.5">Panel Suggestion</p>
                                    <span className="inline-flex items-center rounded-full border font-medium text-xs py-0.5 px-2.5"
                                      style={{ backgroundColor: suggStyle.bg, borderColor: suggStyle.border, color: suggStyle.text }}>
                                      {round.panelSuggestion}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Metadata grid */}
                              <div className="border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] p-3 flex flex-wrap">
                                <div className="w-1/2 px-2 mb-4">
                                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Interview Panel</p>
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {round.panel.map(name => (
                                      <span key={name} className="inline-flex items-center border border-[#E5E7EB] rounded-lg bg-white py-1 px-2 text-xs font-medium text-[#374151] gap-1.5">
                                        <span className="w-5 h-5 rounded-full bg-[#3538CD]/10 text-[#3538CD] text-[9px] font-black flex items-center justify-center shrink-0">
                                          {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </span>
                                        {name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="w-1/4 px-2 mb-4">
                                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Scheduled By</p>
                                  <p className="text-xs font-semibold text-[#374151] mt-2">{round.scheduledBy}</p>
                                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">{round.scheduledAt}</p>
                                </div>
                                <div className="w-1/4 px-2 mb-4">
                                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Interview Duration</p>
                                  <p className="text-xs font-semibold text-[#374151] mt-2">{round.duration}</p>
                                </div>
                                <div className="w-full px-2">
                                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Additional Information</p>
                                  <p className="text-xs text-[#6B7280] mt-2">{round.additionalInfo}</p>
                                </div>
                              </div>

                              {/* Collapsible feedback */}
                              <div>
                                <button
                                  onClick={() => setFeedbackOpen(prev => {
                                    const next = [...prev];
                                    next[idx] = !isFbOpen;
                                    return next;
                                  })}
                                  className={`w-full flex items-center justify-between border border-[#E5E7EB] bg-green-50 p-3 text-sm font-medium text-[#374151] transition-colors hover:bg-green-100 ${isFbOpen ? 'rounded-t-lg' : 'rounded-lg'}`}
                                >
                                  <div className="flex items-center gap-1 flex-wrap text-xs">
                                    <span>Interview Panel Feedback</span>
                                    <span className="text-[#9CA3AF]">(Provided by</span>
                                    <span className="text-[#3538CD] font-semibold">{round.feedbackBy}</span>
                                    <span className="text-[#9CA3AF]">)</span>
                                  </div>
                                  <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform duration-200 shrink-0 ${isFbOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isFbOpen && (
                                  <div className="border border-t-0 border-[#E5E7EB] rounded-b-lg p-4 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-[#6B7280] font-medium">Score:</span>
                                      <span className="text-sm font-bold text-[#111827]">{round.feedbackScore}</span>
                                      <div className="flex leading-none">
                                        {Array.from({ length: 10 }, (_, i) => (
                                          <span key={i} style={{ color: i < round.feedbackScore ? '#F4B400' : '#E5E7EB' }}>★</span>
                                        ))}
                                      </div>
                                    </div>
                                    <p className="text-xs text-[#9CA3AF] italic">No written feedback provided.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
