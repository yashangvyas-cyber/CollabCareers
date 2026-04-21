import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import { ChevronRight, ChevronUp, X } from 'lucide-react';

const moduleItems = [
  { name: 'Job Templates', count: 5 },
  { name: 'Employment Types', count: 9 },
  { name: 'Interview Rounds', count: 11 },
  { name: 'Sources', count: 14 },
  { name: 'Job Types', count: 6 },
  { name: 'Operational Config', count: null, active: true, path: '/crm/config' },
  { name: 'Career Portal', count: null, path: '/crm/career-portal' },
];

const sourceTags = ['Project', 'Business...', 'Admini...', 'HR', 'Adhoc', 'Admin &...', 'Admini...'];

export default function OperationalConfigPage() {
  const navigate = useNavigate();
  const [sourceOpen, setSourceOpen] = useState(true);

  return (
    <CRMLayout
      breadcrumbs={[
        { label: 'Config', path: '/crm/config' },
        { label: 'Operational Config' },
      ]}
    >
      <div className="flex gap-6">
        {/* LEFT: Module Sidebar */}
        <div className="w-[220px] shrink-0">
          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#1A1A2E]">Module</h3>
              <button className="text-[#9CA3AF] hover:text-[#6B7280]">
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
            <nav className="py-1">
              {moduleItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => item.path && navigate(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                    item.active
                      ? 'bg-[#3538CD]/5 text-[#3538CD] font-semibold border-l-2 border-[#3538CD]'
                      : 'text-[#374151] hover:bg-[#F9FAFB] font-medium'
                  }`}
                >
                  <span>{item.name}</span>
                  <div className="flex items-center gap-1.5">
                    {item.count !== null && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        item.active ? 'bg-[#3538CD]/10 text-[#3538CD]' : 'bg-[#F3F4F6] text-[#9CA3AF]'
                      }`}>
                        {item.count}
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* RIGHT: Config Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#1A1A2E]">Operational Config</h2>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Last updated by <span className="font-semibold text-[#6B7280]">Super User (NS-882)</span> on 10/Mar/2026, 07:30 PM
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-5 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors">
                Cancel
              </button>
              <button className="px-5 py-2 text-sm font-medium text-white bg-[#3538CD] rounded-lg hover:bg-[#292bb0] transition-colors shadow-sm">
                Save
              </button>
            </div>
          </div>

          {/* Section 1: Employee Source Settings */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm mb-6">
            <button
              onClick={() => setSourceOpen(!sourceOpen)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors"
            >
              <h3 className="text-sm font-semibold text-[#1A1A2E]">Employee Source Settings</h3>
              <ChevronUp className={`w-4 h-4 text-[#9CA3AF] transition-transform ${sourceOpen ? '' : 'rotate-180'}`} />
            </button>
            {sourceOpen && (
              <div className="px-6 pb-6 border-t border-[#F3F4F6]">
                <div className="pt-4">
                  <label className="text-xs font-medium text-[#374151] mb-3 flex items-center gap-1">
                    Filter Employees by Department
                    <span className="w-3.5 h-3.5 rounded-full border border-[#D1D5DB] text-[#9CA3AF] flex items-center justify-center text-[8px] font-bold">?</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2 mt-2 p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                    {sourceTags.map((tag, i) => (
                      <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-md text-xs font-medium text-[#374151] shadow-sm">
                        {tag}
                        <X className="w-3 h-3 text-[#9CA3AF] cursor-pointer hover:text-[#6B7280]" />
                      </span>
                    ))}
                    <div className="flex items-center gap-1 ml-auto">
                      <button className="text-[#9CA3AF] hover:text-[#6B7280]">
                        <X className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-[#E5E7EB]" />
                      <ChevronRight className="w-4 h-4 text-[#9CA3AF] rotate-90" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </CRMLayout>
  );
}
