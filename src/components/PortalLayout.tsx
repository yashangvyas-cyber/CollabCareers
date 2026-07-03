import { ReactNode, useState, useRef, useEffect, CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, LogOut, ChevronDown, Briefcase, Bookmark } from 'lucide-react';
import CollabCRMIcon from './CollabCRMIcon';
import { useApp } from '../store/AppContext';
import { darkenHex, readableTextColor, accessibleOnWhite } from '../lib/theme';
import AuthModal from './AuthModal';
import ChangePasswordModal from './ChangePasswordModal';

interface PortalLayoutProps {
  children: ReactNode;
  companyName?: string;
  showAuth?: boolean;
}

export default function PortalLayout({
  children,
  showAuth = true,
}: PortalLayoutProps) {
  const { currentUser, portalConfig, logoutCandidate } = useApp();
  const navigate = useNavigate();
  const appearance = portalConfig.appearance;
  // Scope the customer's brand colour to the portal subtree by overriding the
  // Tailwind theme variables — every `*-primary` utility below recolours live.
  // Clamp the brand to a readable shade so text/links/titles never vanish on
  // white, even if the customer picks a pastel or near-white colour.
  const safeBrand = accessibleOnWhite(appearance.brandColor);
  const brandStyle = {
    '--color-primary': safeBrand,
    '--color-primary-hover': darkenHex(safeBrand),
    // Auto-flip button label colour so the brand always has readable text on it
    '--color-on-primary': readableTextColor(safeBrand),
  } as CSSProperties;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'register' | 'signin'>('register');

  // Account dropdown menu (top-right avatar) + Change Password modal.
  const [menuOpen, setMenuOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the account menu on outside-click or Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logoutCandidate();
    navigate('/portal/yopmails');
  };

  const handleSignInClick = () => {
    setAuthTab('signin');
    setShowAuthModal(true);
  };

  const handleRegisterClick = () => {
    setAuthTab('register');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col" style={brandStyle}>
      {/* Top Bar */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Left: Logo + Navigation */}
          <div className="flex items-center gap-5">
            {/* Company branding — logo and/or portal name (each shown when present) */}
            <Link to="/portal/yopmails" className="flex items-center gap-2.5">
              <img src="/mindinventory-logo.svg" alt={appearance.portalName} className="h-8 w-auto" />
              {appearance.portalName && (
                <span className="text-sm font-black text-[#111827] tracking-tight">{appearance.portalName}</span>
              )}
            </Link>
          </div>

          {/* Right: Auth */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-[#111827] leading-tight group-hover:text-primary transition-colors">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className="text-xs text-[#6B7280] leading-tight">({currentUser.email})</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold group-hover:bg-primary/20 transition-colors shrink-0">
                    {currentUser.firstName.charAt(0)}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#E5E7EB] shadow-xl shadow-[#111827]/5 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    {/* Profile & activity */}
                    <div className="py-2">
                      <Link
                        to="/portal/yopmails/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-[#374151] hover:bg-[#F9FAFB] hover:text-primary transition-colors"
                      >
                        <User className="w-4 h-4 text-[#9CA3AF]" /> My Profile
                      </Link>
                      <Link
                        to="/portal/yopmails/profile?tab=applications"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-[#374151] hover:bg-[#F9FAFB] hover:text-primary transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-[#9CA3AF]" /> My Applications
                      </Link>
                      <Link
                        to="/portal/yopmails/profile?tab=saved"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-[#374151] hover:bg-[#F9FAFB] hover:text-primary transition-colors"
                      >
                        <Bookmark className="w-4 h-4 text-[#9CA3AF]" /> Saved Jobs
                      </Link>
                    </div>

                    {/* Account settings */}
                    <div className="py-2 border-t border-[#F3F4F6]">
                      <button
                        onClick={() => { setMenuOpen(false); setShowChangePassword(true); }}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-[#374151] hover:bg-[#F9FAFB] hover:text-primary transition-colors text-left"
                      >
                        <Lock className="w-4 h-4 text-[#9CA3AF]" /> Change Password
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="py-2 border-t border-[#F3F4F6]">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : showAuth ? (
              <>
                <button
                  onClick={handleSignInClick}
                  className="px-3 sm:px-4 py-2 text-sm font-bold text-primary border-2 border-primary rounded-lg hover:bg-primary/5 transition-colors uppercase tracking-widest text-[10px] sm:text-[11px]"
                >
                  Sign In
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="px-3 sm:px-4 py-2 text-sm font-bold text-on-primary bg-primary border-2 border-primary rounded-lg hover:bg-primary-hover transition-colors uppercase tracking-widest text-[10px] sm:text-[11px] shadow-sm"
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
        businessUnit={appearance.portalName}
        jobId="1"
        initialTab={authTab}
        redirectTo="/portal/yopmails/profile"
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
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
