import { Link } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import { 
  ChevronDown, Plus, X, MoreHorizontal, 
  Eye, Edit2, LayoutGrid
} from 'lucide-react';

const stats = [
  { label: 'Total Candidates', value: '2497', change: '+12%', isPositive: true },
  { label: 'In Interview Process', value: '183' },
  { label: 'Joining Soon', value: '73' },
  { label: 'Future Candidates', value: '19' },
];

const candidatesData = [
  {
    no: 1,
    name: 'Mahesh Patel',
    email: 'Mahesh@gmail.com',
    contact: '+91 98765 43210',
    job: 'React Developer (Open)',
    experience: '3 yrs',
    noticePeriod: '30 days',
    interviewDate: 'Schedule',
    status: 'Active',
    source: 'CollabCRM',
    businessUnit: 'Yopmails',
    recon: '-',
    isAlumni: true
  },
  {
    no: 2,
    name: 'Priya Shah',
    email: 'priya@gmail.com',
    contact: '+91 97654 32109',
    job: 'UI/UX Designer (Open)',
    experience: '4 yrs',
    noticePeriod: '15 days',
    interviewDate: 'Schedule',
    status: 'Active',
    source: 'CollabCRM',
    businessUnit: 'Yopmails',
    recon: '-',
    isAlumni: true
  },
  {
    no: 3,
    name: 'Arjun Mehta',
    email: 'arjun@gmail.com',
    contact: '+91 96543 21098',
    job: 'Flutter Developer (Open)',
    experience: '2 yrs',
    noticePeriod: 'Immediate joiner',
    interviewDate: 'Schedule',
    status: 'Active',
    source: 'CollabCRM',
    businessUnit: 'Yopmails',
    recon: '-',
    isAlumni: false
  },
  {
    no: 4,
    name: 'Sneha Patel',
    email: 'sneha@gmail.com',
    contact: '+91 95432 10987',
    job: 'Business Analyst (Open)',
    experience: '3 yrs',
    noticePeriod: '30 days',
    interviewDate: 'Schedule',
    status: 'Active',
    source: 'CollabCRM',
    businessUnit: 'Yopmails',
    recon: '-',
    isAlumni: false
  },
  {
    no: 5,
    name: 'Rahul Joshi',
    email: 'rahul@gmail.com',
    contact: '+91 94321 09876',
    job: 'Project Manager (Open)',
    experience: '6 yrs',
    noticePeriod: '60 days',
    interviewDate: 'Schedule',
    status: 'Active',
    source: 'CollabCRM',
    businessUnit: 'Yopmails',
    recon: '-',
    isAlumni: false
  },
  {
    no: 6,
    name: 'Kavya Rao',
    email: 'kavya@gmail.com',
    contact: '+91 93210 98765',
    job: '2D Artist (Open)',
    experience: '1 yr',
    noticePeriod: 'Immediate joiner',
    interviewDate: 'Schedule',
    status: 'Active',
    source: 'CollabCRM',
    businessUnit: 'Yopmails',
    recon: '-',
    isAlumni: false
  }
];

export default function CandidateListingPage() {
  return (
    <CRMLayout
      breadcrumbs={[{ label: 'Candidates' }]}
    >
      <div className="space-y-6 pt-2">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-sm relative overflow-hidden group">
              <p className="text-[12px] font-medium text-[#6B7280] mb-3">{stat.label}</p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-[#111827]">{stat.value}</span>
                {i === 0 && (
                  <div className="w-8 h-8 bg-[#3538CD]/5 rounded-lg flex items-center justify-center text-[#3538CD] cursor-pointer hover:bg-[#3538CD]/10 transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Header and Filter Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#111827]">Candidates</h2>
              <span className="px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280] text-[11px] font-medium rounded-full">
                1 - 10 of 712 Candidates
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-[#3538CD] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#292bb0] transition-colors flex items-center gap-2">
                Add Candidate
              </button>
              <button className="p-2 border border-[#E5E7EB] rounded-lg text-[#6B7280] hover:bg-[#F9FAFB]">
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button className="p-2 border border-[#E5E7EB] rounded-lg text-[#6B7280] hover:bg-[#F9FAFB]">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 min-h-[44px]">
              <div className="flex items-center gap-1 px-2 py-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[12px] text-[#374151]">
                <span className="text-[#9CA3AF]">∑</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
              </div>
              
              <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-md text-[12px]">
                <Plus className="w-3.5 h-3.5 text-[#3538CD]" />
                <span className="text-[#374151] font-medium">Job Status</span>
                <span className="text-[#9CA3AF]">Is</span>
                <span className="text-[#374151]">Open</span>
                <X className="w-3 h-3 text-[#9CA3AF] cursor-pointer hover:text-red-500" />
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-md text-[12px]">
                <Plus className="w-3.5 h-3.5 text-[#3538CD]" />
                <span className="text-[#374151] font-medium">Candidate Status</span>
                <span className="text-[#9CA3AF]">Is</span>
                <span className="text-[#374151]">Active</span>
                <X className="w-3 h-3 text-[#9CA3AF] cursor-pointer hover:text-red-500" />
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#3538CD]/30 rounded-md text-[12px]">
                <Plus className="w-3.5 h-3.5 text-[#3538CD]" />
                <span className="text-[#3538CD] font-semibold">Source</span>
                <span className="text-[#9CA3AF]">Is</span>
                <span className="text-[#3538CD] font-semibold">CollabCRM</span>
                <X className="w-3 h-3 text-[#3538CD] cursor-pointer" />
              </div>

              <div className="w-7 h-7 flex items-center justify-center text-[#3538CD] bg-[#F4F5FA] rounded-md cursor-pointer">
                <Plus className="w-4 h-4" />
              </div>

              <div className="ml-auto flex items-center gap-2">
                 <X className="w-4 h-4 text-[#9CA3AF] cursor-pointer" />
                 <div className="w-[1px] h-4 bg-[#E5E7EB]"></div>
                 <button className="text-[12px] font-semibold text-[#3538CD] px-3 py-1 hover:bg-[#F4F5FA] rounded-md">Filter</button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">No.</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">Contact Number</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Applied Job</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Experience</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">Notice Period (Days)</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">Interview Date and Time</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">Candidate Status</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">Business Unit</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Recon</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {candidatesData.map((candidate) => (
                <tr key={candidate.no} className="hover:bg-[#F9FAFB] transition-colors group">
                  <td className="px-4 py-4 text-sm text-[#6B7280]">{candidate.no}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                       <div>
                         <p className="text-sm font-semibold text-[#111827]">{candidate.name}</p>
                         <p className="text-xs text-[#6B7280]">{candidate.email}</p>
                         {candidate.isAlumni && (
                           <p className="text-[10px] text-[#6B7280]">Verified Alumni</p>
                         )}
                       </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">{candidate.contact}</td>
                  <td className="px-4 py-4 text-sm">
                    <span className="text-[#3538CD] font-medium">{candidate.job}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#374151]">{candidate.experience}</td>
                  <td className="px-4 py-4 text-sm text-[#374151]">{candidate.noticePeriod}</td>
                  <td className="px-4 py-4">
                    <button className="px-3 py-1.5 bg-[#F4F5FA] text-[#3538CD] text-[12px] font-bold rounded-md hover:bg-[#3538CD]/10 transition-colors">
                      Schedule
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border rounded-full text-[12px] font-semibold ${
                      candidate.status === 'Withdrawn' || candidate.status === 'Cancelled'
                        ? 'border-gray-200 text-gray-400'
                        : 'border-[#3538CD]/20 text-[#3538CD]'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        candidate.status === 'Withdrawn' || candidate.status === 'Cancelled'
                          ? 'bg-gray-300'
                          : 'bg-[#3538CD]'
                      }`}></span>
                      {candidate.status === 'Withdrawn' ? 'Cancelled' : candidate.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex px-2.5 py-1 bg-[#F4F5FA] text-[#3538CD] text-[11px] font-bold rounded-md border border-[#3538CD]/10">
                      {candidate.source}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#374151]">{candidate.businessUnit}</td>
                  <td className="px-4 py-4 text-sm text-[#374151]">{candidate.recon}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/crm/candidates/${candidate.no}`} className="p-1.5 text-[#6B7280] hover:text-[#3538CD] hover:bg-white rounded-md shadow-sm border border-transparent hover:border-[#E5E7EB]">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button className="p-1.5 text-[#6B7280] hover:text-[#3538CD] hover:bg-white rounded-md shadow-sm border border-transparent hover:border-[#E5E7EB]">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]/50">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6B7280]">Records Per Page</span>
              <div className="flex items-center gap-1 px-2 py-1 bg-white border border-[#E5E7EB] rounded-md text-xs text-[#374151] cursor-pointer">
                10 <ChevronDown className="w-3 h-3 text-[#9CA3AF]" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-[12px]">
              <button className="px-2 py-1 text-[#9CA3AF] flex items-center gap-1 hover:text-[#374151] transition-colors disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="w-7 h-7 flex items-center justify-center bg-[#3538CD] text-white rounded font-bold">1</button>
              <button className="w-7 h-7 flex items-center justify-center text-[#374151] hover:bg-[#F3F4F6] rounded">2</button>
              <button className="w-7 h-7 flex items-center justify-center text-[#374151] hover:bg-[#F3F4F6] rounded">3</button>
              <button className="w-7 h-7 flex items-center justify-center text-[#374151] hover:bg-[#F3F4F6] rounded">4</button>
              <span className="text-[#9CA3AF] px-1">...</span>
              <button className="w-7 h-7 flex items-center justify-center text-[#374151] hover:bg-[#F3F4F6] rounded">72</button>
              <button className="px-2 py-1 text-[#3538CD] font-semibold flex items-center gap-1 hover:text-[#292bb0] transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
