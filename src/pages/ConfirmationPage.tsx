import { Link } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { Check, Briefcase, List } from 'lucide-react';

export default function ConfirmationPage() {
  const steps = [
    { label: 'Applied', status: 'completed' },
    { label: 'Under Review', status: 'current' },
    { label: 'Interview', status: 'upcoming' },
    { label: 'Decision', status: 'upcoming' },
  ];

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

        {/* Horizontal Status Stepper */}
        <div className="w-full max-w-xl mb-16 relative">
          <div className="absolute top-5 left-0 w-full h-[2px] bg-[#E5E7EB]" />
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center relative z-10 w-24">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    step.status === 'completed' 
                      ? 'bg-[#3538CD] border-[#3538CD] text-white' 
                      : step.status === 'current'
                      ? 'bg-white border-[#3538CD] text-[#3538CD]'
                      : 'bg-white border-[#E5E7EB] text-[#9CA3AF]'
                  }`}
                >
                  {step.status === 'completed' ? (
                    <Check className="w-5 h-5 stroke-[3px]" />
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                <p 
                  className={`mt-3 text-xs font-bold whitespace-nowrap ${
                    step.status !== 'upcoming' ? 'text-[#3538CD]' : 'text-[#9CA3AF]'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
          {/* Progress bar overlay */}
          <div 
            className="absolute top-5 left-0 h-[2px] bg-[#3538CD] transition-all duration-500" 
            style={{ width: '33%' }} 
          />
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
