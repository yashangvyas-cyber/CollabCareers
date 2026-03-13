import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { Eye, EyeOff, Zap, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../store/AppContext';

export default function RegisterPage() {
  const { registerCandidate, loginCandidate } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = searchParams.get('tab') === 'signin' ? 'signin' : 'register';
  const jobId = searchParams.get('job') || '1';
  const [activeTab, setActiveTab] = useState<'register' | 'signin'>(initialTab as 'register' | 'signin');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.firstName) {
      alert("Please fill in required fields.");
      return;
    }
    registerCandidate({
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
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
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10 items-start">
        {/* LEFT SIDE: Value prop */}
        <div className="flex-1 max-w-lg pt-10">
          <h1 className="text-3xl font-bold text-[#1A1A2E] mb-3 leading-tight">
            Join <span className="text-primary">Yopmails</span>
          </h1>
          <p className="text-[#6B7280] mb-8 text-sm leading-relaxed">
            Create your CollabCareers account to apply for open positions. Your profile stays 
            with you — apply again in one click, track your applications, and get notified 
            about new opportunities.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A2E]">One-Click Application</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">Your data is saved securely, making future applications lightning fast.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A2E]">Privacy First</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">Your data is only shared with recruiters when you choose to apply.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E07C3F]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-4 h-4 text-[#E07C3F]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A2E]">Alumni? Get Priority</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">
                   Ex-employees can <Link to="/portal/yopmails/alumni-verify" className="text-[#E07C3F] font-semibold hover:underline">verify status</Link> for priority review.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Form Card */}
        <div className="w-full md:w-[480px] shrink-0">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#E5E7EB]">
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-4 text-sm font-semibold text-center transition-colors ${
                  activeTab === 'register'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-[#6B7280] hover:text-[#374151]'
                }`}
              >
                New Candidate
              </button>
              <button
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-4 text-sm font-semibold text-center transition-colors ${
                  activeTab === 'signin'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-[#6B7280] hover:text-[#374151]'
                }`}
              >
                Already Registered
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'register' ? (
                <form onSubmit={handleRegister}>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-[#374151] mb-1.5">First Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                        className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#374151] mb-1.5">Last Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                        className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-[#292bb0] transition-colors"
                  >
                    Create Account & Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignIn}>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="Enter your email"
                      className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter your password"
                        className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex justify-end mt-1.5">
                      <button type="button" className="text-xs text-primary hover:text-[#292bb0]">Forgot password?</button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-[#292bb0] transition-colors"
                  >
                    Sign In & Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Alumni Link */}
              <div className="mt-5 flex items-center justify-center gap-2 pt-4 border-t border-[#E5E7EB]">
                <Zap className="w-4 h-4 text-[#E07C3F]" />
                <span className="text-xs text-[#6B7280]">Previously worked here?</span>
                <Link
                  to="/portal/yopmails/alumni-verify"
                  className="text-xs font-semibold text-[#E07C3F] hover:underline"
                >
                  Fast-track your application →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
