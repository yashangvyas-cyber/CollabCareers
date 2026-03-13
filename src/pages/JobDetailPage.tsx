import { Link, useParams } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { MapPin, Briefcase, Building2, Clock, IndianRupee, ArrowRight, Bookmark, ChevronRight, Zap } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Job } from '../store/types';

export default function JobDetailPage() {
  const { jobId } = useParams();
  const { jobs } = useApp();
  
  const job = jobs.find(j => j.id === jobId) || jobs[0] || {
    id: '1', title: 'React Developer', location: 'Ahmedabad', jobType: 'On-site',
    employmentType: 'Full-time', experience: '2-4 Years', salaryRange: { min: '6', max: '10', currency: 'INR', type: 'Annual' },
    skills: ['React', 'JavaScript', 'TypeScript'],
    description: 'We are looking for a talented React Developer...',
    customFields: []
  } as any as Job;

  return (
    <PortalLayout>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm">
            <Link to="/portal/yopmails" className="text-[#6B7280] hover:text-primary transition-colors">Yopmails Jobs</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
            <span className="text-[#1A1A2E] font-medium">{job.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN — Job Details */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
              <h1 className="text-3xl font-bold text-[#1A1A2E] mb-4">{job.title}</h1>

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-[#6B7280] mb-6">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {job.location}</span>
                <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> {job.employmentType}</span>
                <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> {job.jobType}</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {job.experience} Experience</span>
              </div>

              {/* Salary */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg text-sm font-bold text-primary mb-8">
                <IndianRupee className="w-4 h-4" />
                {job.salaryRange?.min} – {job.salaryRange?.max} LPA ({job.salaryRange?.type})
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mb-4">Required Skills</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {job.skills?.map((skill: string) => (
                    <span key={skill} className="px-4 py-1.5 text-xs font-semibold bg-white text-[#374151] border border-[#E5E7EB] rounded-full shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#F3F4F6] my-8" />

              {/* Description */}
              <div className="mb-10">
                <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">Job Description</h2>
                <div className="text-sm text-[#374151] leading-relaxed space-y-4 whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>

              {/* Additional Information Required (Recruiter's Custom Fields) */}
              {job.customFields && job.customFields.length > 0 && (
                <div className="bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] p-6 mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-[#E07C3F] fill-[#E07C3F]" />
                    <h3 className="text-base font-bold text-[#1A1A2E]">Custom Form Fields</h3>
                  </div>
                  <p className="text-sm text-[#6B7280] mb-4">The recruiter has requested the following additional information for this role:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {job.customFields.map((f) => (
                      <div key={f.id} className="flex flex-col gap-1 p-3 bg-white border border-[#E5E7EB] rounded-xl">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Field Label</span>
                        <span className="text-sm font-semibold text-[#1A1A2E]">{f.label}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{f.type}</span>
                          {f.required && <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold">Required</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN — Sticky Apply Card */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="sticky top-[120px]">
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">Apply for this role</h3>
                  <p className="text-xs text-[#6B7280]">Your application will be directly sent to the hiring team at {job.businessUnit}.</p>
                </div>

                <Link
                  to={`/portal/yopmails/register?job=${job.id}`}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white text-base font-bold rounded-xl hover:bg-[#292bb0] transition-all transform hover:translate-y-[-2px] shadow-lg shadow-primary/25 mb-4"
                >
                  Start Application <ArrowRight className="w-5 h-5" />
                </Link>

                <button className="flex items-center justify-center gap-2 w-full py-3.5 border border-[#E5E7EB] text-[#374151] text-sm font-bold rounded-xl hover:bg-[#F9FAFB] transition-colors mb-6">
                  <Bookmark className="w-4 h-4" /> Save this job
                </button>

                <div className="pt-6 border-t border-[#F3F4F6] text-center">
                  <p className="text-xs text-[#9CA3AF] mb-3 font-medium">Already applied to a job at Yopmails?</p>
                  <Link
                    to={`/portal/yopmails/register?tab=signin&job=${job.id}`}
                    className="text-sm font-bold text-primary hover:underline"
                  >
                    Sign In to Re-apply →
                  </Link>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Actively Hiring</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
