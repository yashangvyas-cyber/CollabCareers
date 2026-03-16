import { useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { Zap, CheckCircle, AlertTriangle, Mail, ArrowRight, Building2, Shield } from 'lucide-react';

type VerifyState = 'idle' | 'verifying' | 'success' | 'failed';

export default function AlumniVerificationPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<VerifyState>('idle');

  const handleVerify = () => {
    setStep('verifying');
    setTimeout(() => {
      // Demo: email ending with @yopmails.com succeeds
      if (email.toLowerCase().includes('yopmails')) {
        setStep('success');
      } else {
        setStep('failed');
      }
    }, 2500);
  };

  return (
    <PortalLayout showAuth={false}>
      <div className="max-w-xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[#E07C3F]/10 text-[#E07C3F] flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">Alumni Verification</h1>
          <p className="text-sm text-[#6B7280] max-w-sm mx-auto leading-relaxed">
            If you've previously worked at <strong>Yopmails</strong>, verify your alumni status 
            for priority consideration on job applications.
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-lg overflow-hidden">
          {step === 'idle' && (
            <div className="p-6">
              <div className="flex items-start gap-3 mb-6 p-4 bg-[#E07C3F]/5 rounded-xl border border-[#E07C3F]/15">
                <Shield className="w-5 h-5 text-[#E07C3F] mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A2E] mb-1">How it works</h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Enter your previous company email address. We'll verify it against Yopmails' 
                    records. If matched, your applications will be flagged with an Alumni badge for 
                    priority review.
                  </p>
                </div>
              </div>

              <label className="block text-xs font-semibold text-[#374151] mb-2">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Enter your old company email</span>
                </div>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alex@yopmails.com"
                className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07C3F]/20 focus:border-[#E07C3F] mb-2"
              />
              <p className="text-[11px] text-[#9CA3AF] mb-5">
                Try <strong>anything@yopmails.com</strong> for a success demo, or another email for failure
              </p>

              <button
                onClick={handleVerify}
                disabled={!email}
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#E07C3F] text-white text-sm font-semibold rounded-lg hover:bg-[#c76a33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4" /> Verify Alumni Status
              </button>
            </div>
          )}

          {step === 'verifying' && (
            <div className="p-10 text-center">
              <div className="w-12 h-12 border-3 border-[#E07C3F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-1">Verifying...</h3>
              <p className="text-sm text-[#6B7280]">Checking {email} against company records</p>
            </div>
          )}

          {step === 'success' && (
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-1">Verified! ✨</h3>
                <p className="text-sm text-[#6B7280] max-w-xs mx-auto">
                  You've been verified as a former employee. Your applications will receive the Alumni badge.
                </p>
              </div>

              {/* Alumni Badge Preview */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="px-4 py-1.5 text-sm font-bold bg-[#E07C3F] text-white rounded-full flex items-center gap-1.5 shadow-sm">
                  <Zap className="w-4 h-4" /> Alumni Verified
                </span>
              </div>

              <div className="space-y-3">
                <Link
                  to="/portal/yopmails/register"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-[#292bb0] transition-colors"
                >
                  Create Account & Apply <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/portal/yopmails"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-[#E5E7EB] text-[#374151] text-sm font-medium rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  <Building2 className="w-4 h-4" /> Browse Open Positions
                </Link>
              </div>
            </div>
          )}

          {step === 'failed' && (
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-amber-50 mx-auto flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-1">Verification Failed</h3>
                <p className="text-sm text-[#6B7280] max-w-xs mx-auto">
                  We couldn't match <strong>{email}</strong> with our records. 
                  You can still register as a regular candidate.
                </p>
              </div>

              <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] mb-6 text-center">
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  If you believe this is an error, contact the HR team directly at <a href="#" className="text-primary font-medium">hr@yopmails.com</a>
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  to="/portal/yopmails/register"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-[#292bb0] transition-colors"
                >
                  Register as Regular Candidate <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => { setStep('idle'); setEmail(''); }}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-[#E5E7EB] text-[#374151] text-sm font-medium rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
