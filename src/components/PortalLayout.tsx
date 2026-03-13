import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

interface PortalLayoutProps {
  children: ReactNode;
  companyName?: string;
  showAuth?: boolean;
  isLoggedIn?: boolean;
  candidateName?: string;
}

export default function PortalLayout({
  children,
  companyName = 'Yopmails',
  showAuth = true,
  isLoggedIn = false,
  candidateName = 'Yashang',
}: PortalLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left: CollabCareers branding (secondary) */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#1A1A2E] leading-tight">CollabCareers</span>
              <span className="text-[10px] text-[#9CA3AF] leading-tight">Job Portal</span>
            </div>
          </Link>

          {/* Center: Company Name */}
          <Link to="/portal/yopmails" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {companyName.charAt(0)}
            </div>
            <span className="text-lg font-bold text-[#1A1A2E]">{companyName}</span>
          </Link>

          {/* Right: Auth */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  to="/portal/yopmails/profile"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.includes('/profile')
                      ? 'text-primary'
                      : 'text-[#6B7280] hover:text-primary'
                  }`}
                >
                  My Profile
                </Link>
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                  {candidateName.charAt(0)}
                </div>
              </>
            ) : showAuth ? (
              <>
                <Link
                  to="/portal/yopmails/register?tab=signin"
                  className="px-4 py-2 text-sm font-medium text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/portal/yopmails/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-[#292bb0] transition-colors"
                >
                  Register
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#9CA3AF] text-xs">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Powered by <span className="font-semibold text-[#6B7280]">CollabCareers</span></span>
          </div>
          <a href="#" className="text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
}
