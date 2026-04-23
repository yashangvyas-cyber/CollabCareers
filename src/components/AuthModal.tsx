import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Eye, EyeOff, Building2, ArrowRight, ShieldCheck, Mail, Lock, ArrowLeft, KeyRound, CheckCircle2
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import CollabCRMIcon from './CollabCRMIcon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  businessUnit: string;
  jobId: string;
  initialTab?: 'register' | 'signin';
  initialState?: 'auth' | 'alumni-verify' | 'alumni-success';
  redirectTo?: string;
  onAuthSuccess?: () => void;
}

export default function AuthModal({ 
  isOpen, onClose, jobTitle, businessUnit, jobId, 
  initialTab = 'register', initialState = 'auth', redirectTo,
  onAuthSuccess 
}: AuthModalProps) {
  const { registerCandidate, loginCandidate, setAlumniVerified, portalConfig } = useApp();
  const navigate = useNavigate();
  
  // States: 'auth' | 'alumni-verify' | 'alumni-success'
  const [modalState, setModalState] = useState<'auth' | 'alumni-verify' | 'alumni-success' | 'forgot-password' | 'email-sent'>(initialState);
  const [activeTab, setActiveTab] = useState<'register' | 'signin'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifiedWorkEmail, setVerifiedWorkEmail] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    signInEmail: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [profileVisibility, setProfileVisibility] = useState<'visible' | 'private'>('visible');
  const [allowRecruiterContact, setAllowRecruiterContact] = useState(false);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    registerCandidate({
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: '',
      isAlumni: false,
      profileVisibility,
      allowRecruiterContact,
    });
    onAuthSuccess?.();
    onClose();
    navigate(redirectTo || `/portal/yopmails/apply/${jobId}`);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    loginCandidate(formData.email);
    onAuthSuccess?.();
    onClose();
    navigate(redirectTo || `/portal/yopmails/apply/${jobId}`);
  };

  const handleAlumniVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setError(null);
    setTimeout(() => {
      if (formData.email.toLowerCase().includes('yopmails')) {
        setAlumniVerified(true, formData.email);
        setVerifiedWorkEmail(formData.email);
        setFormData(prev => ({
          ...prev,
          firstName: 'Alex',
          lastName: 'Patel',
          signInEmail: ''
        }));
        setModalState('alumni-success');
      } else {
        setError("We couldn't match this email with our employee records.");
      }
      setVerifying(false);
    }, 2000);
  };

  const handleAlumniFinalize = (e: React.FormEvent) => {
    e.preventDefault();
    registerCandidate({
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.signInEmail,
      phone: '',
      isAlumni: true,
      alumniEmail: verifiedWorkEmail,
    });
    onAuthSuccess?.();
    onClose();
    navigate(redirectTo || `/portal/yopmails/apply/${jobId}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-[#111827]/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header — Org + CollabCRM logos together */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Org logo */}
            <div className="w-10 h-10 rounded-xl bg-[#3538CD] flex items-center justify-center text-white text-base font-black shadow-sm shrink-0">Y</div>
            {/* Org name + CollabCRM small attribution stacked */}
            <div className="flex flex-col">
              <span className="text-sm font-black text-[#111827] tracking-tight leading-tight">{businessUnit}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#F3F4F6] rounded-full transition-colors text-[#6B7280] hover:text-[#111827]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Job Context */}
        <div className="px-8 pb-6">
          <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5">
             <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">
               {jobTitle === 'Portal' ? 'Welcome to' : 'Applying for:'}
             </span>
             <span className="text-[13px] font-black text-[#111827]">
               {jobTitle === 'Portal' ? `${businessUnit} Career Portal` : `${jobTitle} at ${businessUnit}`}
             </span>
          </div>
        </div>

        {/* Tabs - Hidden in Alumni States */}
        {modalState === 'auth' && (
          <div className="px-8 pb-4">
            <div className="flex bg-[#F4F5FA] p-1 rounded-2xl gap-1">
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2.5 text-[11px] font-black text-center transition-all uppercase tracking-widest rounded-xl ${
                  activeTab === 'register'
                    ? 'bg-white text-[#3538CD] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-2.5 text-[11px] font-black text-center transition-all uppercase tracking-widest rounded-xl ${
                  activeTab === 'signin'
                    ? 'bg-white text-[#3538CD] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        <div className="p-8">
          {modalState === 'auth' ? (
            <>
              {activeTab === 'register' ? (
                <form onSubmit={handleRegister} className="space-y-4">

                  {/* Demo auto-fill */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        firstName: 'Alex',
                        lastName: 'Patel',
                        email: 'alex.patel@example.com',
                        password: 'P@ssw0rd!',
                        confirmPassword: 'P@ssw0rd!',
                        agreeToTerms: true
                      })}
                      className="px-2.5 py-1 bg-[#3538CD]/5 border border-[#3538CD]/10 rounded-lg text-[9px] font-black text-[#3538CD] uppercase tracking-widest hover:bg-[#3538CD] hover:text-white transition-all shadow-sm"
                    >
                      Auto-fill for Demo
                    </button>
                  </div>

                  {/* Name row — 2-col */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">First Name *</label>
                      <input type="text" required value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                        className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Last Name *</label>
                      <input type="text" required value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                        className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Email Address *</label>
                    <input type="email" required value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB]"
                    />
                  </div>


                  {/* Password + strength */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] pr-12"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#3538CD]">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Strength bar */}
                    {formData.password.length > 0 && (() => {
                      let score = 0;
                      if (formData.password.length >= 8) score++;
                      if (/[A-Z]/.test(formData.password)) score++;
                      if (/[0-9]/.test(formData.password)) score++;
                      if (/[^A-Za-z0-9]/.test(formData.password)) score++;
                      const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
                      const colors = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
                      const textColors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-600', 'text-green-600'];
                      return (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1">
                            {[1,2,3,4].map(i => (
                              <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= score ? colors[score] : 'bg-[#E5E7EB]'}`} />
                            ))}
                          </div>
                          <p className={`text-[10px] font-black ml-0.5 ${textColors[score]}`}>{labels[score]}</p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Re-enter Password *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder=""
                        value={formData.confirmPassword}
                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                        className={`w-full border rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] pr-12 ${
                          formData.confirmPassword.length > 0 && formData.confirmPassword !== formData.password
                            ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                            : 'border-[#E5E7EB]'
                        }`}
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#3538CD]">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formData.confirmPassword.length > 0 && formData.confirmPassword !== formData.password && (
                      <p className="text-[10px] text-red-500 font-semibold ml-1">Passwords don't match</p>
                    )}
                    {formData.confirmPassword.length > 0 && formData.confirmPassword === formData.password && (
                      <p className="text-[10px] text-green-600 font-semibold ml-1">✓ Passwords match</p>
                    )}
                  </div>

                  {/* Profile Visibility */}
                  <div className="pt-1">
                    <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-3">Profile Visibility</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setProfileVisibility('visible')}
                        className={`relative text-left p-4 rounded-2xl border-2 transition-all ${profileVisibility === 'visible' ? 'border-[#3538CD] bg-[#3538CD]/5' : 'border-[#E5E7EB] bg-white hover:border-[#C7C9F0]'}`}>
                        <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${profileVisibility === 'visible' ? 'border-[#3538CD]' : 'border-[#D1D5DB]'}`}>
                          {profileVisibility === 'visible' && <div className="w-2 h-2 rounded-full bg-[#3538CD]" />}
                        </div>
                        <Eye className="w-5 h-5 text-[#3538CD] mb-2" />
                        <p className="text-xs font-black text-[#111827] leading-tight mb-1">Visible to recruiters</p>
                        <p className="text-[10px] text-[#6B7280] leading-snug">Discoverable without an application</p>
                      </button>
                      <button type="button" onClick={() => setProfileVisibility('private')}
                        className={`relative text-left p-4 rounded-2xl border-2 transition-all ${profileVisibility === 'private' ? 'border-[#3538CD] bg-[#3538CD]/5' : 'border-[#E5E7EB] bg-white hover:border-[#C7C9F0]'}`}>
                        <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${profileVisibility === 'private' ? 'border-[#3538CD]' : 'border-[#D1D5DB]'}`}>
                          {profileVisibility === 'private' && <div className="w-2 h-2 rounded-full bg-[#3538CD]" />}
                        </div>
                        <EyeOff className="w-5 h-5 text-[#6B7280] mb-2" />
                        <p className="text-xs font-black text-[#111827] leading-tight mb-1">Browse privately</p>
                        <p className="text-[10px] text-[#6B7280] leading-snug">Only visible on active applications</p>
                      </button>
                    </div>
                    {/* Dynamic info banner */}
                    <div className="mt-3 flex items-start gap-2 px-3 py-2.5 bg-[#F4F5FA] rounded-xl border border-[#E5E7EB]">
                      <span className="text-[#3538CD] mt-0.5 shrink-0 text-sm">ℹ</span>
                      <p className="text-[11px] text-[#374151] leading-snug">
                        {profileVisibility === 'visible'
                          ? 'Your profile, CV, and contact details will be visible to the recruitment team.'
                          : 'Your profile is hidden. Recruiters can only see your info after you apply.'}
                      </p>
                    </div>
                    {/* Recruiter contact toggle — surfaced within the section */}
                    <label className="flex items-center justify-between gap-3 mt-3 cursor-pointer">
                      <span className="text-[11px] font-bold text-[#374151]">Allow recruiters to contact me for future roles</span>
                      <button type="button" onClick={() => setAllowRecruiterContact(v => !v)}
                        className={`relative rounded-full transition-colors shrink-0 ${allowRecruiterContact ? 'bg-[#3538CD]' : 'bg-[#D1D5DB]'}`}
                        style={{ minWidth: '2.5rem', height: '1.375rem' }}>
                        <span className={`absolute top-0.5 left-0.5 bg-white rounded-full shadow transition-transform ${allowRecruiterContact ? 'translate-x-[1.125rem]' : ''}`}
                          style={{ width: '1.125rem', height: '1.125rem' }} />
                      </button>
                    </label>
                  </div>

                  {/* T&C just above CTA */}
                   <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                    <input type="checkbox" required checked={formData.agreeToTerms}
                      onChange={e => setFormData({...formData, agreeToTerms: e.target.checked})}
                      className="w-4 h-4 border-2 border-[#D1D5DB] rounded accent-[#3538CD]" />
                    <span className="text-[11px] font-bold text-[#6B7280]">
                      I agree to the{' '}
                      {portalConfig?.termsUrl ? (
                        <a href={portalConfig.termsUrl} target="_blank" rel="noopener noreferrer" className="text-[#3538CD] hover:underline">
                          Terms of Service
                        </a>
                      ) : (
                        <span className="text-[#374151]">Terms of Service</span>
                      )}
                      {portalConfig?.privacyPolicyUrl && (
                        <>
                          {' '}and{' '}
                          <a href={portalConfig.privacyPolicyUrl} target="_blank" rel="noopener noreferrer" className="text-[#3538CD] hover:underline">
                            Privacy Policy
                          </a>
                        </>
                      )}
                    </span>
                  </label>

                  <button type="submit"
                    className="w-full py-4 bg-[#3538CD] text-white text-sm font-black rounded-xl hover:bg-[#292bb0] transition-all shadow-lg shadow-[#3538CD]/20 uppercase tracking-widest flex items-center justify-center gap-2">
                    Create Account <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

              ) : (
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Sign In</label>
                    <button 
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        email: 'alex.patel@example.com',
                        password: 'password123'
                      })}
                      className="px-2.5 py-1 bg-[#3538CD]/5 border border-[#3538CD]/10 rounded-lg text-[9px] font-black text-[#3538CD] uppercase tracking-widest hover:bg-[#3538CD] hover:text-white transition-all shadow-sm"
                    >
                      Auto-fill for Demo
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Password *</label>
                      <button type="button" onClick={() => { setForgotEmail(formData.email); setModalState('forgot-password'); }} className="text-[10px] font-black text-[#3538CD] uppercase hover:underline">Forgot password?</button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#3538CD]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#3538CD] text-white text-sm font-black rounded-xl hover:bg-[#292bb0] transition-all shadow-lg shadow-[#3538CD]/20 uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    Sign In & Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              <div className="mt-8 flex flex-col items-center gap-2 pt-6 border-t border-[#E5E7EB]">
                 <div className="flex items-center gap-2 text-[#3538CD]">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Previously worked here?</span>
                 </div>
                 <button
                    onClick={() => setModalState('alumni-verify')}
                    className="text-xs font-black text-[#3538CD] hover:underline"
                  >
                    Fast-track your application →
                  </button>
              </div>
            </>
          ) : modalState === 'alumni-verify' ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <button 
                onClick={() => setModalState('auth')}
                className="flex items-center gap-1.5 text-[10px] font-black text-[#6B7280] uppercase tracking-widest hover:text-[#3538CD] mb-8 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Register
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#3538CD]/5 text-[#3538CD] flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[#111827] mb-2">Alumni Verification</h3>
                <p className="text-sm text-[#6B7280] font-medium leading-relaxed px-4">
                  Enter the work email you used at this company to verify your alumni status.
                </p>
              </div>

              <form onSubmit={handleAlumniVerify} className="space-y-6">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Alumni Email
                    </label>
                    <button 
                      type="button"
                      onClick={() => {
                        setFormData({...formData, email: 'alex.patel@yopmails.com'});
                        setError(null);
                      }}
                      className="px-2.5 py-1 bg-[#3538CD]/5 border border-[#3538CD]/10 rounded-lg text-[9px] font-black text-[#3538CD] uppercase tracking-widest hover:bg-[#3538CD] hover:text-white transition-all shadow-sm"
                    >
                      Use Demo Alumni Email
                    </button>
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => {
                      setFormData({...formData, email: e.target.value});
                      setError(null);
                    }}
                    placeholder="e.g. name@yopmails.com"
                    className={`w-full border ${error ? 'border-red-500' : 'border-[#E5E7EB]'} rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] transition-all`}
                  />
                  {error && (
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 mt-2">{error}</p>
                  )}
                  <div className="flex items-center gap-1.5 ml-1 mt-3">
                    <Lock className="w-3 h-3 text-[#9CA3AF]" />
                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-tight">
                      We'll check this against our employee records. Your data stays private.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full py-4 bg-[#3538CD] text-white text-sm font-black rounded-xl hover:bg-[#292bb0] transition-all shadow-lg shadow-[#3538CD]/20 uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {verifying ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Verify Alumni Status <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </div>
          ) : modalState === 'alumni-success' ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <button 
                onClick={() => setModalState('alumni-verify')}
                className="flex items-center gap-1.5 text-[10px] font-black text-[#6B7280] uppercase tracking-widest hover:text-[#3538CD] mb-8 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center mx-auto mb-4 border border-[#10b981]/20">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[#111827] mb-2">Verified! ✨</h3>
                <p className="text-sm text-[#6B7280] font-medium leading-relaxed mb-6">
                  You've been verified as a former employee. Complete your profile setup to continue.
                </p>
                
                {/* Verified Info Box */}
                <div className="bg-[#3538CD]/5 border border-[#3538CD]/10 rounded-2xl p-4 text-left mb-8 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Building2 className="w-5 h-5 text-[#3538CD]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#111827]">Senior Software Engineer</h4>
                    <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-tight">Jan 2021 - Mar 2024 (3 Years 2 Months)</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleAlumniFinalize} className="space-y-4">
                 {/* Verified Work Email — read-only */}
                 <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      Verified Work Email
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#10b981]/10 text-[#10b981] rounded-md text-[8px] font-black uppercase tracking-widest">
                        ✅ Verified
                      </span>
                    </label>
                    <input
                      type="email"
                      value={verifiedWorkEmail}
                      readOnly
                      className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold bg-[#F3F4F6] text-[#6B7280] cursor-not-allowed"
                    />
                 </div>

                 {/* New Email Address — editable */}
                 <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">New Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.signInEmail}
                      onChange={e => setFormData({...formData, signInEmail: e.target.value})}
                      placeholder="your.email@example.com"
                      className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB]"
                    />
                    <p className="text-[10px] font-bold text-[#9CA3AF] ml-1 mt-1">This will be used to sign in to your CollabCRM account</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                       <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">First Name *</label>
                       <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                        className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB]"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                       <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Last Name *</label>
                       <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                        className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB]"
                      />
                    </div>
                 </div>

                 <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#3538CD]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>


                   <button
                    type="submit"
                    className="w-full py-4 bg-[#3538CD] text-white text-sm font-black rounded-xl hover:bg-[#292bb0] transition-all shadow-lg shadow-[#3538CD]/20 uppercase tracking-widest flex items-center justify-center gap-2 mt-4"
                  >
                    Submit <ArrowRight className="w-4 h-4" />
                  </button>
              </form>
            </div>
          ) : modalState === 'forgot-password' ? (
            /* Screen 1 — Forgot Password Request */
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <button
                onClick={() => { setModalState('auth'); setActiveTab('signin'); }}
                className="flex items-center gap-1.5 text-[10px] font-black text-[#6B7280] uppercase tracking-widest hover:text-[#3538CD] mb-8 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#3538CD]/5 text-[#3538CD] flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[#111827] mb-2">Forgot Password?</h3>
                <p className="text-sm text-[#6B7280] font-medium leading-relaxed px-4">
                  Enter your registered email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setModalState('email-sent');
                }}
                className="space-y-6"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#3538CD] text-white text-sm font-black rounded-xl hover:bg-[#292bb0] transition-all shadow-lg shadow-[#3538CD]/20 uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  Send Reset Link <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : modalState === 'email-sent' ? (
            /* Screen 2 — Email Sent Confirmation */
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center mx-auto mb-4 border border-[#10b981]/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[#111827] mb-2">Check your inbox</h3>
                <p className="text-sm text-[#6B7280] font-medium leading-relaxed px-2">
                  We've sent a password reset link to{' '}
                  <span className="font-black text-[#111827]">{forgotEmail}</span>.
                  <br />The link will expire in 24 hours.
                </p>
              </div>

              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4 text-center mb-6">
                <p className="text-[12px] font-bold text-[#6B7280]">
                  Didn't receive it? Check your spam folder or{' '}
                  <button
                    onClick={() => setModalState('forgot-password')}
                    className="text-[#3538CD] font-black hover:underline"
                  >
                    Resend Email
                  </button>
                </p>
              </div>

              <button
                onClick={() => { setModalState('auth'); setActiveTab('signin'); }}
                className="w-full py-4 bg-[#3538CD] text-white text-sm font-black rounded-xl hover:bg-[#292bb0] transition-all shadow-lg shadow-[#3538CD]/20 uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </button>
            </div>
          ) : null}

          {/* Powered by CollabCRM — subtle attribution */}
          <div className="flex items-center justify-center gap-1.5 pt-4">
            <span className="text-[10px] text-[#D1D5DB]">Powered by</span>
            <CollabCRMIcon size={12} />
            <span className="text-[10px] font-medium text-[#C4C9D4]">CollabCRM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
