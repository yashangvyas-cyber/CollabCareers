import { Link } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import {
  ChevronDown, Plus, X, MoreHorizontal,
  Eye, Edit2, LayoutGrid
} from 'lucide-react';

const candidateStats = [
  { label: 'Total Candidates', value: '2497', change: '+12%' },
  { label: 'In Interview Process', value: '183' },
  { label: 'Joining Soon', value: '73' },
  { label: 'Future Candidates', value: '19' },
];

const candidatesData = [
  { no: 1, name: 'Mahesh Patel', email: 'Mahesh@gmail.com', contact: '+91 98765 43210', job: 'React Developer (Open)', experience: '3 yrs', noticePeriod: '30 days', status: 'Active', source: 'CollabCRM', businessUnit: 'MindInventory', recon: '-', isAlumni: true },
  { no: 2, name: 'Priya Shah', email: 'priya@gmail.com', contact: '+91 97654 32109', job: 'UI/UX Designer (Open)', experience: '4 yrs', noticePeriod: '15 days', status: 'Active', source: 'CollabCRM', businessUnit: 'MindInventory', recon: '-', isAlumni: true },
  { no: 3, name: 'Arjun Mehta', email: 'arjun@gmail.com', contact: '+91 96543 21098', job: 'Flutter Developer (Open)', experience: '2 yrs', noticePeriod: 'Immediate joiner', status: 'Active', source: 'CollabCRM', businessUnit: 'MindInventory', recon: '-', isAlumni: false },
  { no: 4, name: 'Sneha Patel', email: 'sneha@gmail.com', contact: '+91 95432 10987', job: 'Business Analyst (Open)', experience: '3 yrs', noticePeriod: '30 days', status: 'Active', source: 'CollabCRM', businessUnit: 'MindInventory', recon: '-', isAlumni: false },
  { no: 5, name: 'Rahul Joshi', email: 'rahul@gmail.com', contact: '+91 94321 09876', job: 'Project Manager (Open)', experience: '6 yrs', noticePeriod: '60 days', status: 'Active', source: 'CollabCRM', businessUnit: 'MindInventory', recon: '-', isAlumni: false },
  { no: 6, name: 'Kavya Rao', email: 'kavya@gmail.com', contact: '+91 93210 98765', job: '2D Artist (Open)', experience: '1 yr', noticePeriod: 'Immediate joiner', status: 'Active', source: 'CollabCRM', businessUnit: 'MindInventory', recon: '-', isAlumni: false },
];

export default function CandidateListingPage() {

  return (
    <CRMLayout breadcrumbs={[{ label: 'Candidates' }]}>
      <div className="space-y-6 pt-2">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          {candidateStats.map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <p className="text-[12px] font-medium text-[#6B7280]">{stat.label}</p>
                {i === 0 && (
                  <div className="w-8 h-8 bg-[#3538CD]/5 rounded-lg flex items-center justify-center text-[#3538CD] cursor-pointer hover:bg-[#3538CD]/10 transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-[#111827]">{stat.value}</span>
                {'change' in stat && stat.change && <span className="text-xs font-bold text-green-500">{stat.change}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* ── Candidates Tab ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#111827]">Candidates</h2>
              <span className="px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280] text-[11px] font-medium rounded-full">1 - 10 of 712 Candidates</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-[#3538CD] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#292bb0] transition-colors">Add Candidate</button>
              <button className="p-2 border border-[#E5E7EB] rounded-lg text-[#6B7280] hover:bg-[#F9FAFB]"><LayoutGrid className="w-4 h-4" /></button>
              <button className="p-2 border border-[#E5E7EB] rounded-lg text-[#6B7280] hover:bg-[#F9FAFB]"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 min-h-[44px]">
              <div className="flex items-center gap-1 px-2 py-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[12px]"><span className="text-[#9CA3AF]">∑</span><ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" /></div>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-md text-[12px]"><Plus className="w-3.5 h-3.5 text-[#3538CD]" /><span className="text-[#374151] font-medium">Job Status</span><span className="text-[#9CA3AF]">Is</span><span className="text-[#374151]">Open</span><X className="w-3 h-3 text-[#9CA3AF] cursor-pointer hover:text-red-500" /></div>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-md text-[12px]"><Plus className="w-3.5 h-3.5 text-[#3538CD]" /><span className="text-[#374151] font-medium">Candidate Status</span><span className="text-[#9CA3AF]">Is</span><span className="text-[#374151]">Active</span><X className="w-3 h-3 text-[#9CA3AF] cursor-pointer hover:text-red-500" /></div>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#3538CD]/30 rounded-md text-[12px]"><Plus className="w-3.5 h-3.5 text-[#3538CD]" /><span className="text-[#3538CD] font-semibold">Source</span><span className="text-[#9CA3AF]">Is</span><span className="text-[#3538CD] font-semibold">CollabCRM</span><X className="w-3 h-3 text-[#3538CD] cursor-pointer" /></div>
              <div className="w-7 h-7 flex items-center justify-center text-[#3538CD] bg-[#F4F5FA] rounded-md cursor-pointer"><Plus className="w-4 h-4" /></div>
              <div className="ml-auto flex items-center gap-2">
                <X className="w-4 h-4 text-[#9CA3AF] cursor-pointer" /><div className="w-[1px] h-4 bg-[#E5E7EB]" /><button className="text-[12px] font-semibold text-[#3538CD] px-3 py-1 hover:bg-[#F4F5FA] rounded-md">Filter</button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  {['No.', 'Name', 'Contact Number', 'Applied Job', 'Experience', 'Notice Period', 'Interview Date', 'Status', 'Source', 'Business Unit', 'Recon', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {candidatesData.map((c) => (
                  <tr key={c.no} className="hover:bg-[#F9FAFB] transition-colors group">
                    <td className="px-4 py-4 text-sm text-[#6B7280]">{c.no}</td>
                    <td className="px-4 py-4"><p className="text-sm font-semibold text-[#111827]">{c.name}</p><p className="text-xs text-[#6B7280]">{c.email}</p>{c.isAlumni && <p className="text-[10px] text-amber-600 font-bold">Verified Alumni</p>}</td>
                    <td className="px-4 py-4 text-sm text-[#374151] whitespace-nowrap">{c.contact}</td>
                    <td className="px-4 py-4 text-sm"><span className="text-[#3538CD] font-medium">{c.job}</span></td>
                    <td className="px-4 py-4 text-sm text-[#374151]">{c.experience}</td>
                    <td className="px-4 py-4 text-sm text-[#374151]">{c.noticePeriod}</td>
                    <td className="px-4 py-4"><button className="px-3 py-1.5 bg-[#F4F5FA] text-[#3538CD] text-[12px] font-bold rounded-md hover:bg-[#3538CD]/10 transition-colors">Schedule</button></td>
                    <td className="px-4 py-4 whitespace-nowrap"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#3538CD]/20 rounded-full text-[12px] font-semibold text-[#3538CD]"><span className="w-1.5 h-1.5 rounded-full bg-[#3538CD]" />{c.status}</span></td>
                    <td className="px-4 py-4"><span className="inline-flex px-2.5 py-1 bg-[#F4F5FA] text-[#3538CD] text-[11px] font-bold rounded-md border border-[#3538CD]/10">{c.source}</span></td>
                    <td className="px-4 py-4 text-sm text-[#374151]">{c.businessUnit}</td>
                    <td className="px-4 py-4 text-sm text-[#374151]">{c.recon}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/crm/candidates/${c.no}`} className="p-1.5 text-[#6B7280] hover:text-[#3538CD] hover:bg-white rounded-md shadow-sm border border-transparent hover:border-[#E5E7EB]"><Eye className="w-4 h-4" /></Link>
                        <button className="p-1.5 text-[#6B7280] hover:text-[#3538CD] hover:bg-white rounded-md shadow-sm border border-transparent hover:border-[#E5E7EB]"><Edit2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]/50">
              <div className="flex items-center gap-2"><span className="text-xs text-[#6B7280]">Records Per Page</span><div className="flex items-center gap-1 px-2 py-1 bg-white border border-[#E5E7EB] rounded-md text-xs cursor-pointer">10 <ChevronDown className="w-3 h-3 text-[#9CA3AF]" /></div></div>
              <div className="flex items-center gap-1 text-[12px]">
                <button className="px-2 py-1 text-[#9CA3AF] disabled:opacity-50" disabled>Previous</button>
                <button className="w-7 h-7 flex items-center justify-center bg-[#3538CD] text-white rounded font-bold">1</button>
                <button className="w-7 h-7 flex items-center justify-center text-[#374151] hover:bg-[#F3F4F6] rounded">2</button>
                <button className="w-7 h-7 flex items-center justify-center text-[#374151] hover:bg-[#F3F4F6] rounded">3</button>
                <span className="text-[#9CA3AF] px-1">...</span>
                <button className="w-7 h-7 flex items-center justify-center text-[#374151] hover:bg-[#F3F4F6] rounded">72</button>
                <button className="px-2 py-1 text-[#3538CD] font-semibold">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
