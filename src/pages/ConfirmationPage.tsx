import { Link } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { Check, Briefcase, List } from 'lucide-react';

export default function ConfirmationPage() {
  return (
    <PortalLayout>
      <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700">
        
        {/* Large Checkmark Icon */}
        <div className="w-20 h-20 rounded-full bg-[#3538CD]/10 flex items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#3538CD] flex items-center justify-center shadow-lg shadow-[#3538CD]/20">
            <Check className="w-10 h-10 text-white stroke-[3px]" />
          </div>
        </div>

        {/* Heading and Subtext */}
        <h1 className="text-3xl font-black text-[#111827] mb-4 tracking-tight">
          Application Submitted Successfully!
        </h1>
        <p className="text-[#6B7280] text-base leading-relaxed max-w-lg mb-8">
          You've applied for <span className="text-[#111827] font-bold">React Developer</span> at <span className="text-[#111827] font-bold">Yopmails</span>. 
          The recruiter will review your application and reach out if shortlisted.
        </p>

        {/* Application ID Pill */}
        <div className="inline-flex items-center px-4 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full text-sm font-semibold text-[#374151] mb-12">
          Application ID: <span className="text-[#3538CD] ml-1.5 font-bold">CC-2044-0312</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <Link
            to="/portal/yopmails/profile"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-[#3538CD] text-white text-sm font-bold rounded-xl hover:bg-[#292bb0] transition-all shadow-lg shadow-[#3538CD]/20"
          >
            <List className="w-4 h-4" /> View My Applications
          </Link>
          <Link
            to="/portal/yopmails"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-white border border-[#E5E7EB] text-[#374151] text-sm font-bold rounded-xl hover:bg-[#F9FAFB] transition-all"
          >
            <Briefcase className="w-4 h-4" /> Browse More Jobs
          </Link>
        </div>
      </div>
    </PortalLayout>
  );
}
