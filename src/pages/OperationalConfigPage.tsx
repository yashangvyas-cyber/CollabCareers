import { useState } from 'react';
import CRMLayout from '../components/CRMLayout';
import { ChevronRight, ChevronUp, Copy, CheckCheck, Globe, X } from 'lucide-react';

const moduleItems = [
  { name: 'Job Templates', count: 5 },
  { name: 'Employment Types', count: 9 },
  { name: 'Interview Rounds', count: 11 },
  { name: 'Sources', count: 14 },
  { name: 'Job Types', count: 6 },
  { name: 'Operational Config', count: null, active: true },
];

const sourceTags = ['Project', 'Business...', 'Admini...', 'HR', 'Adhoc', 'Admin &...', 'Admini...'];

export default function OperationalConfigPage() {
  const [portalEnabled, setPortalEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText('collabcareers.com/yopmails');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

          {/* Section 2: CollabCareers Portal */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm">
            <div className="px-6 py-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#3538CD]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Globe className="w-4.5 h-4.5 text-[#3538CD]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1A1A2E]">CollabCareers Portal</h3>
                    <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                      Allow candidates to discover and apply for jobs via your CollabCareers portal
                    </p>
                  </div>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => setPortalEnabled(!portalEnabled)}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                    portalEnabled ? 'bg-[#3538CD]' : 'bg-[#D1D5DB]'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    portalEnabled ? 'left-[22px]' : 'left-0.5'
                  }`} />
                </button>
              </div>

              {/* Conditional Content */}
              {portalEnabled ? (
                <div className="mt-5 pt-5 border-t border-[#F3F4F6]">
                  <label className="text-xs font-medium text-[#374151] mb-2 block">
                    Your CollabCareers Portal URL
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        readOnly
                        value="collabcareers.com/yopmails"
                        className="w-full border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm font-medium text-[#6B7280] bg-[#F9FAFB] cursor-default focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[#3538CD] border border-[#3538CD]/30 rounded-lg hover:bg-[#3538CD]/5 transition-colors"
                    >
                      {copied ? (
                        <>
                          <CheckCheck className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-xs text-[#9CA3AF]">
                  Enable the portal to get your unique CollabCareers URL.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
