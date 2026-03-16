import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  X, Eye, EyeOff, Zap, ArrowRight 
} from 'lucide-react';
import { useApp } from '../store/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  businessUnit: string;
  jobId: string;
  initialTab?: 'register' | 'signin';
}

export default function AuthModal({ isOpen, onClose, jobTitle, businessUnit, jobId, initialTab = 'register' }: AuthModalProps) {
  const { registerCandidate, loginCandidate } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'register' | 'signin'>(initialTab);
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
    navigate(`/portal/yopmails/apply/${jobId}`);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    loginCandidate(formData.email);
    onClose();
    navigate(`/portal/yopmails/apply/${jobId}`);
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

        {/* Tabs */}
        <div className="flex border-b border-[#E5E7EB]">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-4 text-xs font-black text-center transition-all uppercase tracking-widest border-b-2 ${
              activeTab === 'register'
                ? 'text-[#3538CD] border-[#3538CD] bg-[#3538CD]/5'
                : 'text-[#6B7280] border-transparent hover:text-[#374151]'
            }`}
          >
            New Candidate
          </button>
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-4 text-xs font-black text-center transition-all uppercase tracking-widest border-b-2 ${
              activeTab === 'signin'
                ? 'text-[#3538CD] border-[#3538CD] bg-[#3538CD]/5'
                : 'text-[#6B7280] border-transparent hover:text-[#374151]'
            }`}
          >
            Already Registered
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">
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
                <Zap className="w-4 h-4 fill-[#3538CD]" />
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Previously worked here?</span>
             </div>
             <Link
                to="/portal/yopmails/alumni-verify"
                className="text-xs font-black text-[#3538CD] hover:underline"
              >
                Fast-track your application →
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
