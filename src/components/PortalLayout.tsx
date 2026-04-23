import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import CollabCRMIcon from './CollabCRMIcon';
import { useApp } from '../store/AppContext';
import AuthModal from './AuthModal';

interface PortalLayoutProps {
  children: ReactNode;
  companyName?: string;
  showAuth?: boolean;
}

export default function PortalLayout({
  children,
  companyName = 'MindInventory',
  showAuth = true,
}: PortalLayoutProps) {
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
          {/* Left: Logo + Navigation */}
          <div className="flex items-center gap-5">
            {/* Company Logo */}
            <Link to="/portal/yopmails" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#3538CD] flex items-center justify-center text-white text-sm font-black shadow-sm">
                Y
              </div>
              <span className="text-sm font-black text-[#111827] tracking-tight">MindInventory</span>
            </Link>
          </div>

          {/* Right: Auth */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
              <Link
                to="/portal/yopmails/profile"
                className="flex items-center gap-2.5 group hover:opacity-80 transition-opacity"
                title="My Profile"
              >
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#111827] leading-tight group-hover:text-[#3538CD] transition-colors">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-xs text-[#6B7280] leading-tight">({currentUser.email})</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#3538CD]/10 text-[#3538CD] flex items-center justify-center text-xs font-bold group-hover:bg-[#3538CD]/20 transition-colors shrink-0">
                  {currentUser.firstName.charAt(0)}
                </div>
              </Link>

              </>
            ) : showAuth ? (
              <>
                <button
                  onClick={handleSignInClick}
                  className="px-4 py-2 text-sm font-bold text-[#3538CD] border-2 border-[#3538CD] rounded-lg hover:bg-[#3538CD]/5 transition-colors uppercase tracking-widest text-[11px]"
                >
                  Sign In
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="px-4 py-2 text-sm font-bold text-white bg-[#3538CD] border-2 border-[#3538CD] rounded-lg hover:bg-[#292bb0] transition-colors uppercase tracking-widest text-[11px] shadow-sm"
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
        key={authTab}
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        jobTitle="Portal"
        businessUnit={companyName}
        jobId="1"
        initialTab={authTab}
        redirectTo="/portal/yopmails/profile"
      />

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#9CA3AF] text-xs">
            <CollabCRMIcon size={14} />
            <span>
              Powered by{' '}
              <a
                href="https://collabcrm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#3538CD] hover:underline"
              >
                CollabCRM
              </a>
            </span>
          </div>
          <a href="#" className="text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
}
