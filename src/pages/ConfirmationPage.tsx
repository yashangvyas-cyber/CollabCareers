import { Link, useParams } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { CheckCircle, ArrowRight, Briefcase, Eye, Clock, Zap } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Job } from '../store/types';

export default function ConfirmationPage() {
  const { jobId } = useParams();
  const { jobs } = useApp();
  
  const job = jobs.find(j => j.id === jobId) || jobs[0] || {
    id: '1', title: 'React Developer', businessUnit: 'Yopmails', location: 'Ahmedabad'
  } as any as Job;

  return (
    <PortalLayout isLoggedIn>
      <div className="max-w-2xl mx-auto px-6 py-16 text-center animate-in fade-in zoom-in-95 duration-700">
        {/* Success Animation */}
        <div className="w-24 h-24 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-8 relative">
           <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20" />
           <CheckCircle className="w-12 h-12 text-green-600 relative z-10" />
        </div>

        <h1 className="text-3xl font-black text-[#1A1A2E] mb-3 tracking-tight">Application Submitted!</h1>
        <p className="text-[#6B7280] mb-10 max-w-sm mx-auto text-sm leading-relaxed">
          Awesome! Your application for <strong>{job.title}</strong> at
          <strong className="text-primary"> {job.businessUnit}</strong> is on its way.
        </p>

        {/* Status Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl p-6 mb-10 text-left transform transition-transform hover:scale-[1.01]">
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[#F3F4F6]">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-inner">
              {job.businessUnit?.[0] || 'Y'}
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-[#1A1A2E]">{job.title}</p>
              <p className="text-xs text-[#6B7280] font-medium">{job.businessUnit} • {job.location}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-700 border border-green-200 rounded-full shadow-sm">
                Submitted
              </span>
              <span className="text-[10px] text-[#9CA3AF] font-medium">Ref: {job.id.substring(0,8)}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-[#6B7280] font-semibold">
            <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-primary" /> Applied just now</span>
            <span className="flex items-center gap-2"><Eye className="w-3.5 h-3.5 text-primary" /> Under initial review</span>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] p-8 mb-10 text-left">
          <h3 className="text-sm font-black text-[#1A1A2E] uppercase tracking-widest mb-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            What happens next?
          </h3>
          <div className="space-y-6">
            {[
              { step: '1', text: 'Hiring team reviews your profile and CV', time: '1–3 days' },
              { step: '2', text: 'Initial screening call or technical assessment', time: '3–5 days' },
              { step: '3', text: 'Track everything from your candidate dashboard', time: '' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-lg bg-white border border-[#E5E7EB] shadow-sm text-primary flex items-center justify-center text-xs font-black shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                   <p className="text-sm text-[#374151] font-semibold">{item.text}</p>
                   {item.time && <p className="text-[10px] text-[#9CA3AF] font-bold uppercase mt-0.5">{item.time}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            to="/portal/yopmails/profile"
            className="flex items-center gap-2 w-full sm:w-auto px-8 py-4 bg-primary text-white text-sm font-black rounded-xl hover:bg-[#292bb0] transition-all shadow-lg shadow-primary/25 transform hover:translate-y-[-2px]"
          >
            My Candidate Profile <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/portal/yopmails"
            className="flex items-center gap-2 w-full sm:w-auto px-8 py-4 bg-white border border-[#E5E7EB] text-[#374151] text-sm font-bold rounded-xl hover:bg-[#F9FAFB] transition-all shadow-sm"
          >
            <Briefcase className="w-4 h-4" /> Browse More Jobs
          </Link>
        </div>

        {/* One-Click Reapply Teaser */}
        <div className="bg-primary/5 rounded-2xl border border-primary/15 p-6 text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <Zap className="w-12 h-12 text-primary fill-primary" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-black text-primary uppercase tracking-widest">Speed Apply Active</span>
          </div>
          <p className="text-xs text-[#6B7280] leading-relaxed font-medium max-w-md">
            Your profile and documents are now stored in our talent pool. 
            You can apply to any other role at <span className="text-[#1A1A2E] font-bold">Yopmails</span> instantly with a single click.
          </p>
        </div>
      </div>
    </PortalLayout>
  );
}
