import { Link } from 'react-router-dom';
import { ArrowRight, Monitor, Globe, ChevronRight } from 'lucide-react';

const flows = [
  {
    title: 'Flow 1 — Recruiter (CRM)',
    description: 'Internal CRM screens for recruiters to create jobs and review candidates',
    screens: [
      { label: 'Add Job Form', path: '/crm/add-job', badge: 'Prompt 1' },
      { label: 'Candidate Detail', path: '/crm/candidate/1', badge: 'Prompt 2' },
    ],
    icon: <Monitor className="w-5 h-5" />,
    color: 'from-indigo-500 to-blue-600',
  },
  {
    title: 'Flow 2+3+4 — Career Portal (Unified)',
    description: 'Complete candidate-facing portal: browse → apply → profile → reapply → alumni',
    screens: [
      { label: '① Career Page (Browse Jobs)', path: '/portal/yopmails', badge: 'Start here' },
      { label: '② Job Detail', path: '/portal/yopmails/job/1', badge: '' },
      { label: '③ Register / Sign In', path: '/portal/yopmails/register?job=1', badge: 'CV Upload' },
      { label: '④ Application Form', path: '/portal/yopmails/apply/1', badge: 'Prefilled' },
      { label: '⑤ Confirmation', path: '/portal/yopmails/confirmation/1', badge: '' },
      { label: '⑥ Candidate Profile', path: '/portal/yopmails/profile', badge: 'One-Click Reapply' },
      { label: '⑦ Alumni Verification', path: '/portal/yopmails/alumni-verify', badge: 'Alumni Flow' },
    ],
    icon: <Globe className="w-5 h-5" />,
    color: 'from-emerald-500 to-teal-600',
  },
];

export default function PrototypeHome() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary via-[#4040d9] to-[#2828a8] text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-3">CollabCareers Prototype</h1>
          <p className="text-white/70 text-lg mb-1">Interactive UI Prototype for the CollabCareers Job Portal</p>
          <p className="text-white/50 text-sm">React + TypeScript + Tailwind CSS v4</p>
        </div>
      </div>

      {/* Flows */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {flows.map((flow) => (
          <div key={flow.title} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className={`bg-gradient-to-r ${flow.color} p-5 flex items-center gap-3`}>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                {flow.icon}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{flow.title}</h2>
                <p className="text-white/70 text-xs mt-0.5">{flow.description}</p>
              </div>
            </div>
            <div className="divide-y divide-[#F3F4F6]">
              {flow.screens.map((screen) => (
                <Link
                  key={screen.path}
                  to={screen.path}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#F9FAFB] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#1A1A2E] group-hover:text-primary transition-colors">
                      {screen.label}
                    </span>
                    {screen.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full">
                        {screen.badge}
                      </span>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#D1D5DB] group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Recommended Flow */}
        <div className="bg-primary/5 rounded-xl border border-primary/15 p-5">
          <h3 className="text-sm font-bold text-[#1A1A2E] mb-2">💡 Recommended Demo Flow</h3>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#6B7280]">
            {['Career Page', 'Job Detail', 'Register (try CV upload!)', 'Application Form', 'Confirmation', 'Profile (see One-Click Reapply)', 'Alumni Verify'].map((step, i) => (
              <span key={step} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="w-3 h-3 text-[#D1D5DB]" />}
                <span className="px-2 py-1 bg-white border border-[#E5E7EB] rounded-md font-medium text-[#374151]">{step}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
