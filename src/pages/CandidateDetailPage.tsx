import { useParams } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import { Mail, Phone, Copy, Eye, Zap, FileText, MoreVertical } from 'lucide-react';
import { useApp } from '../store/AppContext';

function DetailField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs text-[#6B7280] mb-1">{label}</p>
      <p className="text-sm text-[#1A1A2E]">{value || '–'}</p>
    </div>
  );
}

function SectionCard({ title, children, highlight }: { title: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`bg-white rounded-xl border shadow-sm mb-4 ${highlight ? 'border-primary/30 ring-2 ring-primary/10' : 'border-[#E5E7EB]'}`}>
      <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center gap-2">
        {highlight && <FileText className="w-4 h-4 text-primary" />}
        <h3 className="text-sm font-bold text-[#1A1A2E]">{title}</h3>
        {highlight && (
          <span className="ml-auto px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
            Custom Fields
          </span>
        )}
      </div>
      <div className="px-6 py-5">
        {children}
      </div>
    </div>
  );
}

export default function CandidateDetailPage() {
  const { candidateId } = useParams();
  const { candidates, applications, jobs } = useApp();

  const candidate = candidates.find(c => c.id === candidateId) || candidates[0];
  const candidateApps = applications.filter(a => a.candidateId === candidate?.id);
  const latestApp = candidateApps[candidateApps.length - 1];
  const job = latestApp ? jobs.find(j => j.id === latestApp.jobId) : undefined;

  const tabs = ['Candidate Details', 'Interview Details', 'Notes', 'History'];
  const activeTab = 'Candidate Details';

  if (!candidate) {
    return (
      <CRMLayout breadcrumbs={[{ label: 'Candidates', path: '/crm/candidates' }, { label: 'Not Found' }]}>
        <div className="flex items-center justify-center py-24 text-[#6B7280]">Candidate not found.</div>
      </CRMLayout>
    );
  }

  return (
    <CRMLayout
      breadcrumbs={[
        { label: 'Candidates', path: '/crm/candidates' },
        { label: `${candidate.firstName} ${candidate.lastName}` },
      ]}
    >
      <div className="flex gap-6">
        {/* LEFT SIDEBAR */}
        <div className="w-[280px] shrink-0">
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-5 sticky top-[80px]">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center text-primary font-black text-2xl mb-4">
              {candidate.firstName[0]}{candidate.lastName?.[0] || ''}
            </div>

            <h2 className="text-lg font-bold text-[#1A1A2E] text-center">{candidate.firstName} {candidate.lastName}</h2>
            <p className="text-sm text-primary mt-0.5 text-center">{job?.title || 'Applicant'}</p>

            {/* Badges */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="px-3 py-1 text-xs font-semibold bg-green-50 text-green-700 border border-green-200 rounded-full">
                Active
              </span>
              {candidate.isAlumni && (
                <span className="px-3 py-1 text-xs font-bold bg-[#E07C3F] text-white rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Alumni
                </span>
              )}
            </div>

            {candidate.isAlumni && (
              <p className="text-[11px] text-[#6B7280] mt-2 text-center leading-relaxed">
                Previously worked here · Verified via old work email
              </p>
            )}

            <div className="border-t border-[#E5E7EB] my-4" />

            {/* View Resume */}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors">
              <Eye className="w-4 h-4" /> View Resume
            </button>

            <div className="border-t border-[#E5E7EB] my-4" />

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#9CA3AF]" />
                <span className="text-sm text-[#374151] truncate">{candidate.email}</span>
                <button className="ml-auto text-[#9CA3AF] hover:text-primary transition-colors shrink-0">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              {candidate.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#9CA3AF]" />
                  <span className="text-sm text-[#374151]">{candidate.phone}</span>
                </div>
              )}
            </div>

            <div className="border-t border-[#E5E7EB] my-4" />

            {/* Source */}
            <div className="space-y-3">
              <div>
                <p className="text-[11px] text-[#9CA3AF]">Source</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-[#1A1A2E] font-medium">CollabCareers</span>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">Portal</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#9CA3AF]">Applied on</p>
                <p className="text-sm text-[#374151]">{latestApp ? new Date(latestApp.appliedAt).toLocaleDateString() : '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0">
          {/* Action bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    tab === activeTab
                      ? 'text-primary border-primary'
                      : 'text-[#6B7280] border-transparent hover:text-[#374151]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#292bb0] transition-colors">
                Schedule Interview
              </button>
              <button className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors">
                <MoreVertical className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <SectionCard title="Personal Information">
            <div className="grid grid-cols-3 gap-x-8 gap-y-5">
              <DetailField label="Full Name" value={`${candidate.firstName} ${candidate.lastName}`} />
              <DetailField label="Email" value={candidate.email} />
              <DetailField label="Phone" value={candidate.phone} />
            </div>
          </SectionCard>

          {/* Professional Details */}
          <SectionCard title="Professional Details">
            <div className="grid grid-cols-3 gap-x-8 gap-y-5">
              <DetailField label="Current Organization" value="MindInventory" />
              <DetailField label="Current Designation" value="UI Developer" />
              <DetailField label="Notice Period" value="30 Days" />
              <DetailField label="Total Experience" value="3 Years, 2 Months" />
              <DetailField label="Highest Qualification" value="B.Tech Computer Science" />
            </div>
            <div className="mt-5">
              <DetailField label="Skills" value="React, JavaScript, TypeScript, Redux" />
            </div>
          </SectionCard>

          {/* Salary Information */}
          <SectionCard title="Salary Information">
            <div className="grid grid-cols-3 gap-x-8 gap-y-5">
              <DetailField label="CTC Type" value="Annual" />
              <DetailField label="Current CTC" value="₹6 LPA" />
              <DetailField label="Expected CTC" value="₹9 LPA" />
              <DetailField label="Currency" value="INR" />
            </div>
          </SectionCard>

          {/* Additional Information — DYNAMIC from custom field answers */}
          {latestApp?.answers && Object.keys(latestApp.answers).length > 0 && (
            <SectionCard title="Additional Information" highlight>
              <div className="grid grid-cols-3 gap-x-8 gap-y-5">
                {Object.entries(latestApp.answers).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs text-[#6B7280] mb-1">{key}</p>
                    {String(value) === 'Yes' || String(value) === 'No' ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-sm font-medium rounded-full border ${
                        String(value) === 'Yes' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {String(value)}
                      </span>
                    ) : (
                      <p className="text-sm text-[#1A1A2E] font-medium">{String(value)}</p>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Source Information */}
          <SectionCard title="Source Information">
            <div className="grid grid-cols-3 gap-x-8 gap-y-5">
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Source</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#1A1A2E]">CollabCareers</span>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                    Portal
                  </span>
                </div>
              </div>
              <DetailField label="Resume" value={latestApp?.resumeUrl || '—'} />
              <DetailField label="Application ID" value={latestApp?.id || '—'} />
            </div>
          </SectionCard>
        </div>
      </div>
    </CRMLayout>
  );
}
