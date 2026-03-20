import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Eye, EyeOff, Building2, ArrowRight, ShieldCheck, Mail, Lock, ArrowLeft
} from 'lucide-react';
import { useApp } from '../store/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  businessUnit: string;
  jobId: string;
  initialTab?: 'register' | 'signin';
  initialState?: 'auth' | 'alumni-verify' | 'alumni-success';
  redirectTo?: string;
}

export default function AuthModal({ 
  isOpen, onClose, jobTitle, businessUnit, jobId, 
  initialTab = 'register', initialState = 'auth', redirectTo 
}: AuthModalProps) {
  const { registerCandidate, loginCandidate, setAlumniVerified } = useApp();
  const navigate = useNavigate();
  
  // States: 'auth' | 'alumni-verify' | 'alumni-success'
  const [modalState, setModalState] = useState<'auth' | 'alumni-verify' | 'alumni-success'>(initialState);
  const [activeTab, setActiveTab] = useState<'register' | 'signin'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    registerCandidate({
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: '',
      isAlumni: false,
    });
    onClose();
    navigate(redirectTo || `/portal/yopmails/apply/${jobId}`);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    loginCandidate(formData.email);
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
        setFormData(prev => ({
          ...prev,
          firstName: 'Alex',
          lastName: 'Patel'
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
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    registerCandidate({
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: '',
      isAlumni: true,
    });
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
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#3538CD] rounded-lg flex items-center justify-center text-white font-black text-lg">C</div>
            <span className="text-lg font-black text-[#111827] tracking-tight">CollabCareers</span>
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
          <div className="flex border-b border-[#E5E7EB]">
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-4 text-xs font-black text-center transition-all uppercase tracking-widest border-b-2 ${
                activeTab === 'register'
                  ? 'text-[#3538CD] border-[#3538CD] bg-[#3538CD]/5'
                  : 'text-[#6B7280] border-transparent hover:text-[#374151]'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-4 text-xs font-black text-center transition-all uppercase tracking-widest border-b-2 ${
                activeTab === 'signin'
                  ? 'text-[#3538CD] border-[#3538CD] bg-[#3538CD]/5'
                  : 'text-[#6B7280] border-transparent hover:text-[#374151]'
              }`}
            >
              Sign In
            </button>
          </div>
        )}

        <div className="p-8">
          {modalState === 'auth' ? (
            <>
              {activeTab === 'register' ? (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Account Details</label>
                    <button 
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        firstName: 'Alex',
                        lastName: 'Patel',
                        email: 'alex.patel@example.com',
                        password: 'password123',
                        confirmPassword: 'password123',
                        agreeToTerms: true
                      })}
                      className="px-2.5 py-1 bg-[#3538CD]/5 border border-[#3538CD]/10 rounded-lg text-[9px] font-black text-[#3538CD] uppercase tracking-widest hover:bg-[#3538CD] hover:text-white transition-all shadow-sm"
                    >
                      Auto-fill for Demo
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                        className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB]"
                      />
                    </div>
                    <div className="space-y-1.5">
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

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Confirm Password *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#3538CD]"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        required
                        checked={formData.agreeToTerms}
                        onChange={e => setFormData({...formData, agreeToTerms: e.target.checked})}
                        className="w-4 h-4 border-2 border-[#D1D5DB] rounded accent-[#3538CD]" 
                      />
                      <span className="text-[11px] font-black text-[#6B7280] uppercase tracking-tight">I agree to the <span className="text-[#3538CD] hover:underline">Terms of Service</span> and <span className="text-[#3538CD] hover:underline">Privacy Policy</span></span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#3538CD] text-white text-sm font-black rounded-xl hover:bg-[#292bb0] transition-all shadow-lg shadow-[#3538CD]/20 uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    Create Account & Continue <ArrowRight className="w-4 h-4" />
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
                      <button type="button" className="text-[10px] font-black text-[#3538CD] uppercase hover:underline">Forgot password?</button>
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
          ) : (
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
                 <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB]"
                    />
                    <p className="text-[10px] font-bold text-[#9CA3AF] ml-1 mt-1">This will be used to sign in to your CollabCareers account</p>
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

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Confirm Password *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#3538CD]"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
          )}
        </div>
      </div>
    </div>
  );
}
