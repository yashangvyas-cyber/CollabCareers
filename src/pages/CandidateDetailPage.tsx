import { useParams } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import { Mail, Phone, Copy, Eye, MoreVertical, ExternalLink, UserCheck, EyeOff } from 'lucide-react';
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

export default function CandidateDetailPage() {
  const { candidateId } = useParams();
  const { candidates, applications, jobs } = useApp();

  const portalCandidate = candidates.find(c => c.id === candidateId);

  // Fallback mock data for ATS candidates accessed by numeric ID
  const isMockCandidate = !portalCandidate;
  const firstName = portalCandidate?.firstName ?? 'Alex';
  const lastName = portalCandidate?.lastName ?? 'Patel';
  const email = portalCandidate?.email ?? 'alex.patel@gmail.com';
  const phone = portalCandidate?.phone ?? '+91 98765 43210';
  const isAlumni = portalCandidate?.isAlumni ?? true;
  const alumniEmail = portalCandidate?.alumniEmail ?? 'alex@yopmails.com';
  const currentOrg = portalCandidate?.currentOrg ?? (isMockCandidate ? 'MindInventory' : undefined);
  const currentDesignation = portalCandidate?.currentDesignation ?? (isMockCandidate ? 'UI Developer' : undefined);
  const noticePeriod = portalCandidate?.noticePeriod ?? (isMockCandidate ? '30 days' : undefined);
  const skills = portalCandidate?.skills ?? (isMockCandidate ? ['React', 'JavaScript', 'TypeScript', 'Redux', 'Tailwind CSS'] : []);
  const allowRecruiterContact = portalCandidate?.allowRecruiterContact;

  const candidateApplications = applications.filter(a => a.candidateId === candidateId);
  const latestApp = candidateApplications[0];
  const appliedJob = latestApp ? jobs.find(j => j.id === latestApp.jobId) : null;

  const tabs = ['Candidate Details', 'Interview Details', 'Notes', 'History'];
  const activeTab = 'Candidate Details';

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
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
