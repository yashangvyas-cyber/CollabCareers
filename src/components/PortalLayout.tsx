import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { useApp } from '../store/AppContext';
import AuthModal from './AuthModal';

interface PortalLayoutProps {
  children: ReactNode;
  companyName?: string;
  showAuth?: boolean;
}

export default function PortalLayout({
  children,
  companyName = 'Yopmails',
  showAuth = true,
}: PortalLayoutProps) {
  const location = useLocation();
  const { currentUser } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'register' | 'signin'>('register');

  const handleSignInClick = () => {
    setAuthTab('signin');
    setShowAuthModal(true);
  };

  const handleRegisterClick = () => {
    setAuthTab('register');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left: CollabCareers branding (secondary) */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#3538CD] flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#1A1A2E] leading-tight">CollabCareers</span>
              <span className="text-[10px] text-[#9CA3AF] leading-tight">Job Portal</span>
            </div>
          </Link>

          {/* Center: Company Name */}
          <Link to="/portal/yopmails" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3538CD] to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {companyName.charAt(0)}
            </div>
            <span className="text-lg font-bold text-[#1A1A2E]">{companyName}</span>
          </Link>

          {/* Right: Auth */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <Link
                  to="/portal/yopmails/profile"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.includes('/profile')
                      ? 'text-[#3538CD]'
                      : 'text-[#6B7280] hover:text-[#3538CD]'
                  }`}
                >
                  My Profile
                </Link>
                <div className="w-8 h-8 rounded-full bg-[#3538CD]/10 text-[#3538CD] flex items-center justify-center text-xs font-bold">
                  {currentUser.firstName.charAt(0)}
                </div>
              </>
            ) : showAuth ? (
              <>
                <button
                  onClick={handleSignInClick}
                  className="px-4 py-2 text-sm font-medium text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#3538CD] rounded-lg hover:bg-[#292bb0] transition-colors"
                >
                  Register
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      {/* Auth Modal (Global) */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        jobTitle="Portal" // Generic context for header triggers
        businessUnit={companyName}
        jobId="1" // Generic fallback
        initialTab={authTab}
      />

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
