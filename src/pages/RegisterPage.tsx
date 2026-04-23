import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import { useApp } from '../store/AppContext';
import CollabCRMIcon from '../components/CollabCRMIcon';

export default function RegisterPage() {
  const { registerCandidate, loginCandidate } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = searchParams.get('tab') === 'signin' ? 'signin' : 'register';
  const jobId = searchParams.get('job') || '1';
  const [activeTab, setActiveTab] = useState<'register' | 'signin'>(initialTab as 'register' | 'signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.firstName) {
      alert("Please fill in required fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    registerCandidate({
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: '', // Phone removed from registration form
      isAlumni: false,
    });
    navigate(`/portal/yopmails/apply/${jobId}`);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    loginCandidate(formData.email);
    navigate(`/portal/yopmails/apply/${jobId}`);
  };

  return (
    <PortalLayout showAuth={false}>
      <div className="max-w-4xl mx-auto px-6 py-20 flex justify-center items-center">
        
        {/* Centered Form Card */}
        <div className="w-full max-w-[480px]">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl overflow-hidden">

            {/* Org + CollabCRM logos together */}
            <div className="px-8 pt-7 pb-5 flex items-center gap-3 border-b border-[#F3F4F6]">
              {/* Org logo */}
              <div className="w-12 h-12 rounded-2xl bg-[#3538CD] flex items-center justify-center text-white text-xl font-black shadow-md shrink-0">
                Y
              </div>
              {/* Org name + CollabCRM stacked */}
              <div className="flex flex-col">
                <h2 className="text-base font-black text-[#111827] tracking-tight leading-tight">Yopmails</h2>
                <div className="flex items-center gap-1 mt-0.5">
                  <CollabCRMIcon size={12} />
                  <span className="text-[10px] font-medium text-[#9CA3AF]">CollabCRM</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#E5E7EB]">
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-5 text-sm font-black text-center transition-all uppercase tracking-widest ${
                  activeTab === 'register'
                    ? 'text-[#3538CD] border-b-2 border-[#3538CD] bg-[#3538CD]/5'
                    : 'text-[#6B7280] hover:text-[#374151]'
                }`}
              >
                New Candidate
              </button>
              <button
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-5 text-sm font-black text-center transition-all uppercase tracking-widest ${
                  activeTab === 'signin'
                    ? 'text-[#3538CD] border-b-2 border-[#3538CD] bg-[#3538CD]/5'
                    : 'text-[#6B7280] hover:text-[#374151]'
                }`}
              >
                Already Registered
              </button>
            </div>

            <div className="p-8">
              {activeTab === 'register' ? (
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">First Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                        className="w-full border border-[#E5E7EB] rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] placeholder:text-[#9CA3AF]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Last Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                        className="w-full border border-[#E5E7EB] rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] placeholder:text-[#9CA3AF]"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-[#E5E7EB] rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] placeholder:text-[#9CA3AF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full border border-[#E5E7EB] rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#3538CD] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Confirm Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full border border-[#E5E7EB] rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#3538CD] transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          required
                          checked={formData.agreeToTerms}
                          onChange={e => setFormData({...formData, agreeToTerms: e.target.checked})}
                          className="w-5 h-5 border-2 border-[#D1D5DB] rounded-md checked:bg-[#3538CD] checked:border-[#3538CD] appearance-none transition-all cursor-pointer" 
                        />
                        {formData.agreeToTerms && <ArrowRight className="absolute inset-0 m-auto w-3 h-3 text-white -rotate-45" style={{ transform: 'scaleX(-1) translate(1px, -1px) rotate(45deg)' }} />}
                      </div>
                      <span className="text-[11px] font-black text-[#6B7280] group-hover:text-[#374151] uppercase tracking-wide">
                        I agree to the <span className="text-[#3538CD] hover:underline cursor-pointer">Terms of Service</span> and <span className="text-[#3538CD] hover:underline cursor-pointer">Privacy Policy</span>
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-[#3538CD] text-white text-sm font-black rounded-2xl hover:bg-[#292bb0] transition-all shadow-xl shadow-[#3538CD]/20 uppercase tracking-widest mt-4"
                  >
                    Create Account & Continue <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="relative flex items-center justify-center py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5E7EB]" /></div>
                    <span className="relative px-4 bg-white text-[10px] font-black text-[#9CA3AF] tracking-[0.3em] uppercase">OR</span>
                  </div>

                  <button
                    type="button"
                    className="flex items-center justify-center gap-3 w-full py-4 bg-white border-2 border-[#E5E7EB] text-[#374151] text-sm font-black rounded-2xl hover:bg-[#F9FAFB] transition-all uppercase tracking-widest"
                  >
                    <svg className="w-5 h-5 text-[#0077B5] fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                    Continue with LinkedIn
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="Enter your email"
                      className="w-full border border-[#E5E7EB] rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] placeholder:text-[#9CA3AF]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Password</label>
                      <button type="button" className="text-[10px] font-black text-[#3538CD] hover:underline uppercase">Forgot password?</button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter your password"
                        className="w-full border border-[#E5E7EB] rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3538CD]/10 focus:border-[#3538CD] bg-[#F9FAFB] pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#3538CD] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-[#3538CD] text-white text-sm font-black rounded-2xl hover:bg-[#292bb0] transition-all shadow-xl shadow-[#3538CD]/20 uppercase tracking-widest mt-4"
                  >
                    Sign In & Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Alumni Footer Link */}
              <div className="mt-8 flex flex-col items-center gap-3 pt-6 border-t border-[#E5E7EB]">
                <div className="flex items-center gap-2 text-[#3538CD]">
                  <Zap className="w-4 h-4 fill-[#3538CD]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Alumni Priority Access</span>
                </div>
                <div className="text-center">
                  <span className="text-[11px] font-bold text-[#6B7280] uppercase">Previously worked here?</span>
                  <Link
                    to="/portal/yopmails/alumni-verify"
                    className="block text-xs font-black text-[#3538CD] hover:underline mt-1"
                  >
                    Fast-track your application →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
