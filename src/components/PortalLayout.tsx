import { ReactNode, useState, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import CollabCRMIcon from './CollabCRMIcon';
import { useApp } from '../store/AppContext';
import { darkenHex, readableTextColor, accessibleOnWhite } from '../lib/theme';
import AuthModal from './AuthModal';

interface PortalLayoutProps {
  children: ReactNode;
  companyName?: string;
  showAuth?: boolean;
}

export default function PortalLayout({
  children,
  showAuth = true,
}: PortalLayoutProps) {
  const { currentUser, portalConfig } = useApp();
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
            {/* Company Logo — uploaded image (or the portal-name initial) + the portal name */}
            <Link to="/portal/yopmails" className="flex items-center gap-2.5">
              {appearance.logoUrl ? (
                <img
                  src={appearance.logoUrl}
                  alt={appearance.portalName}
                  className="h-8 w-auto max-w-[150px] object-contain"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary text-sm font-black shadow-sm">
                  {appearance.portalName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-black text-[#111827] tracking-tight">{appearance.portalName}</span>
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
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-[#111827] leading-tight group-hover:text-primary transition-colors">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-xs text-[#6B7280] leading-tight">({currentUser.email})</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold group-hover:bg-primary/20 transition-colors shrink-0">
                  {currentUser.firstName.charAt(0)}
                </div>
              </Link>

              </>
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
