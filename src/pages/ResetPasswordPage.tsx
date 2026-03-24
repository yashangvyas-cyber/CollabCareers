import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  KeyRound, Eye, EyeOff, ArrowRight, CheckCircle2, ArrowLeft
} from 'lucide-react';
import PortalLayout from '../components/PortalLayout';

export default function ResetPasswordPage() {
  const { slug } = useParams();
  const [step, setStep] = useState<'reset' | 'success'>('reset');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    // In a real app, we'd call an API here
    setStep('success');
  };

  return (
    <PortalLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-[#F9FAFB]">
        <div className="w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-[#E5E7EB]">
          {/* Header */}
          <div className="px-8 pt-8 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#3538CD] rounded-lg flex items-center justify-center text-white font-black text-lg">C</div>
              <span className="text-lg font-black text-[#111827] tracking-tight">CollabCareers</span>
            </div>
          </div>

          <div className="p-8">
            {step === 'reset' ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#3538CD]/5 text-[#3538CD] flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-8 h-8" />
                  </div>
                  <h1 className="text-2xl font-black text-[#111827] mb-2 tracking-tight">Reset Your Password</h1>
                  <p className="text-sm text-[#6B7280] font-medium leading-relaxed px-4">
                    Enter a new password for your account. Make sure it's secure.
                  </p>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">New Password *</label>
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
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Confirm New Password *</label>
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
                    Reset Password <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 text-center">
                <div className="w-16 h-16 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center mx-auto mb-4 border border-[#10b981]/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-black text-[#111827] mb-2 tracking-tight">Password Reset Successful</h1>
                <p className="text-sm text-[#6B7280] font-medium leading-relaxed mb-10 px-4">
                  Your password has been updated. You can now sign in with your new password.
                </p>

                <Link
                  to={`/portal/${slug}`}
                  className="w-full py-4 bg-[#3538CD] text-white text-sm font-black rounded-xl hover:bg-[#292bb0] transition-all shadow-lg shadow-[#3538CD]/20 uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
