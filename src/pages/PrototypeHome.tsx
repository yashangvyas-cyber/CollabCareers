import { Link } from 'react-router-dom';
import { ArrowRight, Monitor, Globe, ChevronRight } from 'lucide-react';

const flows = [
  {
    title: 'Recruiter (CRM)',
    subtitle: 'Internal recruiter workspace',
    description: 'Create jobs, manage pipelines, and review candidate applications.',
    screens: [
      { label: 'Create New Job', path: '/crm/add-job', badge: 'Step 1' },
      { label: 'Candidate Listing', path: '/crm/candidates', badge: 'Pipeline' },
      { label: 'Candidate Detail', path: '/crm/candidates/1', badge: 'Review' },
      { label: 'Portal Settings', path: '/crm/career-portal', badge: 'Config' },
      { label: 'Talent Pool', path: '/crm/talent-pool', badge: 'New' },
    ],
    icon: <Monitor className="w-6 h-6" />,
    gradient: 'from-[#3538CD] to-[#1e1b4b]',
  },
  {
    title: 'Career Portal',
    subtitle: 'Unified candidate experience',
    description: 'The end-to-end journey from discovery to profile management.',
    screens: [
      { label: 'Job Listings (Browse)', path: '/portal/yopmails', badge: 'Start' },
      { label: 'Job Detail View', path: '/portal/yopmails/job/1', badge: 'UX' },
      { label: 'Register / CV Upload', path: '/portal/yopmails/register?job=1', badge: 'Alumni Flow' },
      { label: 'Smart Application Form', path: '/portal/yopmails/apply/1', badge: 'Auto-Prefill' },
      { label: 'View Submitted App', path: '/portal/yopmails/application/a1', badge: 'Read-only' },
      { label: 'Candidate Profile', path: '/portal/yopmails/profile', badge: 'One-Click' },
      { label: 'Alumni Verification', path: '/portal/yopmails/alumni-verify', badge: 'Verify' },
    ],
    icon: <Globe className="w-6 h-6" />,
    gradient: 'from-[#1e1b4b] to-[#3538CD]',
  },
];

export default function PrototypeHome() {
  return (
    <div className="min-h-screen bg-[#F4F5FA] relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#3538CD]/5 to-transparent rounded-full blur-3xl -z-10" />
      
      {/* Hero */}
      <div className="relative pt-24 pb-16 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3538CD]/5 border border-[#3538CD]/10 text-[#3538CD] text-[10px] font-black uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3538CD] animate-pulse" />
          Interactive UI Prototype v2.0
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-[#111827] tracking-tighter mb-4">
          CollabCareers <span className="text-[#3538CD]">Studio</span>
        </h1>
        <p className="text-[#6B7280] text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          A high-fidelity interactive companion for the CollabCareers ecosystem. Explore end-to-end recruitment flows with premium UI/UX.
        </p>
      </div>

      {/* Recommended Flow */}
      <div className="max-w-5xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-[32px] border border-[#E5E7EB] p-8 shadow-xl shadow-[#3538CD]/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3538CD]/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#3538CD] rounded-xl text-white">
              <ArrowRight className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-[#111827] tracking-tight">Recommended Master Flow</h3>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {[
              { label: 'Browse Jobs', icon: '1', path: '/portal/yopmails' },
              { label: 'Upload CV', icon: '2', path: '/portal/yopmails/register?job=1' },
              { label: 'Smart Apply', icon: '3', path: '/portal/yopmails/apply/1' },
              { label: 'One-Click Profile', icon: '4', path: '/portal/yopmails/profile' },
              { label: 'Alumni Verify', icon: '5', path: '/portal/yopmails/alumni-verify' }
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                {i > 0 && <ChevronRight className="w-4 h-4 text-[#D1D5DB]" />}
                <Link to={step.path} className="flex items-center gap-2 px-4 py-2 bg-[#F4F5FA] border border-[#E5E7EB] rounded-2xl group/step hover:border-[#3538CD]/30 hover:bg-white hover:shadow-lg hover:shadow-[#3538CD]/5 transition-all cursor-pointer">
                  <span className="w-5 h-5 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[10px] font-black text-[#3538CD] group-hover/step:border-[#3538CD]/20 transition-all">{step.icon}</span>
                  <span className="text-xs font-bold text-[#4B5563] group-hover/step:text-[#111827] transition-colors">{step.label}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        {flows.map((flow) => (
          <div key={flow.title} className="flex flex-col">
            <div className="flex items-center gap-4 mb-6 px-2">
               <div className={`p-3 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm text-[#3538CD]`}>
                 {flow.icon}
               </div>
               <div>
                 <h2 className="text-2xl font-black text-[#111827] tracking-tighter">{flow.title}</h2>
                 <p className="text-xs font-bold text-[#6B7280]">{flow.subtitle}</p>
               </div>
            </div>

            <div className="bg-white rounded-[32px] border border-[#E5E7EB] shadow-sm overflow-hidden flex-1 group hover:border-[#3538CD]/20 hover:shadow-2xl hover:shadow-[#3538CD]/5 transition-all duration-500">
              <div className="p-8 border-b border-[#F3F4F6]">
                <p className="text-[13px] text-[#4B5563] leading-relaxed font-medium">
                  {flow.description}
                </p>
              </div>
              
              <div className="divide-y divide-[#F3F4F6]">
                {flow.screens.map((screen) => (
                  <Link
                    key={screen.path}
                    to={screen.path}
                    className="flex items-center justify-between px-8 py-5 hover:bg-[#F9FAFB] transition-all group/link"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB] group-hover/link:bg-[#3538CD] group-hover/link:scale-125 transition-all" />
                      <span className="text-[14px] font-bold text-[#374151] group-hover/link:text-[#111827] transition-colors">
                        {screen.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {screen.badge && (
                        <span className="px-2.5 py-1 text-[9px] font-black bg-[#F4F5FA] text-[#3538CD] border border-[#3538CD]/10 rounded-lg uppercase tracking-widest transition-all group-hover/link:bg-[#3538CD] group-hover/link:text-white group-hover/link:border-transparent">
                          {screen.badge}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-[#D1D5DB] group-hover/link:text-[#3538CD] group-hover/link:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pb-20">
        <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em]">Built with Antigravity AI • 2026</p>
      </div>
    </div>
  );
}
