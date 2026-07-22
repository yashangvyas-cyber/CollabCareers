import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

/** Full-page error card for unknown/expired panelist tokens. */
export default function InvalidLinkScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-[#F4F5FA] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xl p-12 text-center max-w-md">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-[#111827] tracking-tight mb-2">Invalid Link</h1>
        <p className="text-sm text-[#6B7280] leading-relaxed">{message}</p>
        <Link to="/" className="inline-block mt-6 px-6 py-2.5 bg-[#3538CD] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#2d30b0] transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  );
}
