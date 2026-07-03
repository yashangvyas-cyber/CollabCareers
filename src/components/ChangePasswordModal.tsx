import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Reset all state whenever the modal is (re)opened.
  useEffect(() => {
    if (isOpen) {
      setCurrent(''); setNext(''); setConfirm('');
      setShowCurrent(false); setShowNext(false); setShowConfirm(false);
      setError(''); setSuccess(false);
    }
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  let score = 0;
  if (next.length >= 8) score++;
  if (/[A-Z]/.test(next)) score++;
  if (/[0-9]/.test(next)) score++;
  if (/[^A-Za-z0-9]/.test(next)) score++;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  const textColors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-600', 'text-green-600'];

  const handleSubmit = () => {
    setError('');
    if (!current) { setError('Please enter your current password.'); return; }
    if (next.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (next === current) { setError('New password must be different from your current password.'); return; }
    if (next !== confirm) { setError('New passwords do not match.'); return; }
    // Prototype: no real backend — just show the success state.
    setSuccess(true);
    setTimeout(onClose, 1800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#111827]/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl w-full max-w-md animate-in zoom-in-95 fade-in duration-200">
        {success ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-black text-[#111827] mb-2">Password Updated</h3>
            <p className="text-sm font-medium text-[#6B7280]">Your password has been changed successfully.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-base font-black text-[#111827]">Change Password</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 space-y-5">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={current}
                    onChange={e => setCurrent(e.target.value)}
                    className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold bg-[#F9FAFB] pr-12 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-primary">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNext ? 'text' : 'password'}
                    value={next}
                    onChange={e => setNext(e.target.value)}
                    className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm font-bold bg-[#F9FAFB] pr-12 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
                  />
                  <button type="button" onClick={() => setShowNext(!showNext)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-primary">
                    {showNext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {next.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= score ? colors[score] : 'bg-[#E5E7EB]'}`} />
                      ))}
                    </div>
                    <p className={`text-[10px] font-black ml-0.5 ${textColors[score]}`}>{labels[score]}</p>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 text-sm font-bold bg-[#F9FAFB] pr-12 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary ${
                      confirm.length > 0 && confirm !== next ? 'border-red-300 focus:ring-red-100 focus:border-red-400' : 'border-[#E5E7EB]'
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-primary">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirm.length > 0 && confirm !== next && (
                  <p className="text-[10px] text-red-500 font-semibold ml-1">Passwords don't match</p>
                )}
                {confirm.length > 0 && confirm === next && (
                  <p className="text-[10px] text-green-600 font-semibold ml-1">✓ Passwords match</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-xs font-bold text-red-600">{error}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-6 sm:px-8 pb-6 sm:pb-8">
              <button
                onClick={onClose}
                className="flex-1 px-5 py-3 text-xs font-black rounded-xl uppercase tracking-widest border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-5 py-3 text-xs font-black rounded-xl uppercase tracking-widest bg-primary text-on-primary hover:bg-primary-hover shadow-lg shadow-primary/20 transition-colors"
              >
                Update Password
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
