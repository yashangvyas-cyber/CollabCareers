import { useParams } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import { Mail, Phone, Copy, Eye, MoreVertical, ExternalLink } from 'lucide-react';
import { useApp } from '../store/AppContext';

function DetailField({ label, value, isLink }: { label: string; value?: string; isLink?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">{label}</p>
      {isLink ? (
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
  const { candidates } = useApp();

  // Mocking the specific data from requirements for pixel-perfect replication
  const candidate = candidates.find(c => c.id === candidateId) || {
    firstName: 'Alex',
    lastName: 'Patel',
    email: 'alex.patel@gmail.com',
    phone: '+91 98765 43210',
    isAlumni: true
  };

  const tabs = ['Candidate Details', 'Interview Details', 'Notes', 'History'];
  const activeTab = 'Candidate Details';

  return (
    <CRMLayout
      breadcrumbs={[
        { label: 'Candidates', path: '/crm/candidates' },
        { label: `${candidate.firstName} ${candidate.lastName}` },
      ]}
    >
      <div className="flex gap-8 items-start">
        {/* LEFT SIDEBAR */}
        <div className="w-[300px] shrink-0 sticky top-[80px]">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col items-center">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-[#3538CD]/5 flex items-center justify-center text-[#3538CD] font-black text-3xl mb-4 border-4 border-white shadow-sm">
                {candidate.firstName[0]}{candidate.lastName?.[0] || ''}
              </div>

              <h2 className="text-xl font-black text-[#1A1A2E] text-center tracking-tight">{candidate.firstName} {candidate.lastName}</h2>
              <p className="text-sm font-bold text-[#3538CD] mt-1 text-center">React Developer</p>

              {/* Badges */}
              <div className="flex flex-col items-center gap-2 mt-4">
                <span className="px-4 py-1.5 text-[10px] font-black bg-[#F4F5FA] text-[#3538CD] border border-[#3538CD]/20 rounded-full uppercase tracking-widest">
                  Active
                </span>
                
                {/* ADDITION 1 — Alumni Badge */}
                <div className="flex flex-col items-center gap-1.5">
                  <span className="px-4 py-1.5 text-[10px] font-black bg-[#3538CD] text-white rounded-full uppercase tracking-widest">
                    Alumni
                  </span>
                  <p className="text-[10px] font-bold text-[#6B7280] text-center leading-relaxed">
                    Previously worked here · Verified via alex@yopmails.com · Jan 2022 – Dec 2024
                  </p>
                </div>
              </div>

              <div className="w-full border-t border-[#E5E7EB] my-6" />

              {/* Actions */}
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#E5E7EB] rounded-2xl text-xs font-black text-[#374151] hover:bg-[#F9FAFB] transition-all uppercase tracking-widest">
                <Eye className="w-4 h-4" /> View Resume
              </button>

              <div className="w-full space-y-4 mt-6">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center text-[#9CA3AF] group-hover:text-[#3538CD] transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Email</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#374151] truncate">{candidate.email}</span>
                      <Copy className="w-3.5 h-3.5 text-[#9CA3AF] hover:text-[#3538CD]" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] flex items-center justify-center text-[#9CA3AF] group-hover:text-[#3538CD] transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Phone</p>
                    <span className="text-sm font-bold text-[#374151]">{candidate.phone}</span>
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-[#E5E7EB] my-6" />

              {/* Metadata */}
              <div className="w-full space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Created by</p>
                  <p className="text-[10px] font-bold text-[#6B7280]">Super User · 16/Mar/2026, 12:18 PM</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Modified by</p>
                  <p className="text-[10px] font-bold text-[#6B7280]">Super User · 16/Mar/2026, 05:11 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0">
          {/* Action bar */}
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
              <button className="bg-[#3538CD] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#292bb0] transition-all shadow-lg shadow-[#3538CD]/20 flex items-center gap-2">
                Schedule Interview
              </button>
              <button className="p-3 rounded-xl border-2 border-[#E5E7EB] hover:bg-[#F9FAFB] transition-all">
                <MoreVertical className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <SectionHeader title="Personal Information" />
              <div className="p-6 grid grid-cols-3 gap-8">
                <DetailField label="Date of Birth" value="15/Aug/1998" />
                <DetailField label="Gender" value="Male" />
                <DetailField label="Marital Status" value="Single" />
              </div>
            </div>

            {/* Professional Details */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <SectionHeader title="Professional Details" />
              <div className="p-6 space-y-8">
                <div className="grid grid-cols-3 gap-8 text-[#1A1A2E]">
                  <DetailField label="Current Organization" value="MindInventory" />
                  <DetailField label="Current Designation" value="UI Developer" />
                  <DetailField label="Notice Period (Days)" value="30" />
                  <DetailField label="Total Experience" value="3 Years, 2 Months" />
                  <DetailField label="Highest Qualification" value="B.Tech Computer Science" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'JavaScript', 'TypeScript', 'Redux', 'Tailwind CSS'].map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs font-bold text-[#1A1A2E]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <DetailField label="General Remarks" value="Excellent problem solving skills and deep understanding of React ecosystem." />
              </div>
            </div>

            {/* Salary Information */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <SectionHeader title="Salary Information" />
              <div className="p-6 grid grid-cols-4 gap-8">
                <DetailField label="CTC Type" value="Annual" />
                <DetailField label="Current CTC" value="₹6,00,000" />
                <DetailField label="Expected CTC" value="₹9,00,000" />
                <DetailField label="Currency" value="INR" />
              </div>
            </div>

            {/* Address */}
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

            {/* Source Information */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <SectionHeader title="Source Information" />
              <div className="p-6 grid grid-cols-3 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Source</p>
                  
                  {/* ADDITION 2 — Source Chip */}
                  <span className="inline-flex px-3 py-1.5 bg-[#3538CD] text-white text-[11px] font-black rounded-lg uppercase tracking-wider">
                    CollabCareers
                  </span>
                </div>
                <DetailField label="Remark" value="Referred via portal" />
                <DetailField label="Record Owner" value="Super User" />
              </div>
            </div>

            {/* ADDITION 3 — Additional Information */}
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
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
