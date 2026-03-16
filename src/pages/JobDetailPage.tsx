import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import AuthModal from '../components/AuthModal';
import { 
  MapPin, Briefcase, Building2, Clock, IndianRupee, 
  ArrowRight, Bookmark, ChevronRight, TrendingUp, ArrowLeft, Calendar, Share2 
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Job } from '../store/types';

export default function JobDetailPage() {
  const { jobId } = useParams();
  const { jobs, currentUser } = useApp();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'register' | 'signin'>('register');

  // Find job from state, or fallback to first job
  const job = jobs.find(j => j.id === jobId) || jobs[0] || {
    id: 'd1', title: 'React Developer', location: 'Ahmedabad', jobType: 'On-site',
    employmentType: 'Full-time', experience: '2-4 Years', salaryRange: { min: '6', max: '10', currency: 'INR', type: 'Annual' },
    skills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'Tailwind CSS'],
    description: "As a React Developer at Yopmails, you will be at the forefront of building high-performance web applications that serve millions of users. You will collaborate closely with product managers, UX designers, and senior engineers to translate complex requirements into elegant, scalable front-end solutions.\n\nWe prioritize clean code, performance optimization, and accessibility. You'll spend your day working with React, TypeScript, and modern state management libraries, while contributing to our shared component library and ensuring a seamless experience across all device types. Your input will directly influence our architectural decisions and development best practices.\n\nWe am a fast-paced team that values innovation and continuous learning. If you thrive in an environment where you can take ownership of features from conception to deployment, and if you are passionate about staying up-to-date with the latest developments in the React ecosystem, we would love to have you on board.",
    evaluationCriteria: [
      "Proven experience in building and maintaining large-scale React applications with a focus on component-driven architecture.",
      "Deep understanding of modern JavaScript (ES6+), TypeScript, and core web technologies like HTML5 and CSS3/Tailwind.",
      "Expertise in state management (Redux/Zustand) and asynchronous data fetching patterns (React Query/SWR).",
      "Strong problem-solving skills and the ability to optimize application performance for a smooth user experience."
    ],
    customFields: [
      { id: '1', label: 'Portfolio URL', type: 'Text', required: true },
      { id: '2', label: 'Are you open to relocate?', type: 'Yes/No', required: false }
    ],
    businessUnit: 'Yopmails',
    createdAt: new Date().toISOString(),
    targetDate: '2026-03-30'
  } as any as Job;

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentUser) {
      navigate(`/portal/yopmails/apply/${job.id}`);
    } else {
      setAuthTab('register');
      setShowAuthModal(true);
    }
  };

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setAuthTab('signin');
    setShowAuthModal(true);
  };

  // Similar jobs data (Only Yopmails)
  const similarJobs = [
    {
      id: 'd2',
      title: 'UI/UX Designer',
      company: 'Yopmails',
      location: 'Ahmedabad',
      type: 'Full-time',
      experience: '3-5 Years',
      salary: '8 – 12 LPA',
      skills: ['Figma', 'Adobe XD', 'Prototyping'],
      posted: '2 days ago'
    },
    {
      id: 'd3',
      title: 'Backend Engineer',
      company: 'Yopmails',
      location: 'Remote',
      type: 'Contract',
      experience: '4-6 Years',
      salary: '12 – 18 LPA',
      skills: ['Node.js', 'PostgreSQL', 'Redis'],
      posted: '5 days ago'
    },
    {
      id: 'd4',
      title: 'Project Manager',
      company: 'Yopmails',
      location: 'Ahmedabad',
      type: 'Full-time',
      experience: '5-8 Years',
      salary: '15 – 22 LPA',
      skills: ['Agile', 'Jira', 'Stakeholder Management'],
      posted: '1 day ago'
    }
  ];

  return (
    <PortalLayout>
      {/* Top Navigation & Breadcrumb */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-6">
              <Link to="/portal/yopmails" className="flex items-center gap-2 text-xs font-black text-[#3538CD] uppercase tracking-widest hover:underline">
                <ArrowLeft className="w-4 h-4" /> Back to all jobs
              </Link>
              <div className="w-[1px] h-4 bg-[#E5E7EB]" />
              <nav className="flex items-center gap-1.5 text-sm">
                <Link to="/portal/yopmails" className="text-[#6B7280] hover:text-[#3538CD] transition-colors">{job.businessUnit} Jobs</Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
                <span className="text-[#111827] font-medium">{job.title}</span>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT COLUMN — Comprehensive Job Details */}
          <div className="flex-1 min-w-0 space-y-8">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
              <h1 className="text-3xl font-black text-[#111827] mb-4">{job.title}</h1>

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-6 text-[13px] text-[#6B7280] mb-6 font-medium">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#3538CD]" /> {job.location}</span>
                <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#3538CD]" /> {job.employmentType}</span>
                <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-[#3538CD]" /> {job.jobType}</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#3538CD]" /> {job.experience} Experience</span>
              </div>

              {/* Salary Chip */}
              {job.salaryRange && job.salaryRange.min && job.salaryRange.max && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4F5FA] border border-[#3538CD]/10 rounded-lg text-sm font-bold text-[#3538CD] mb-8">
                  <IndianRupee className="w-4 h-4" />
                  {job.salaryRange.min} – {job.salaryRange.max} LPA ({job.salaryRange.type})
                </div>
              )}

              {/* Required Skills */}
              <div className="mb-10">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-[#9CA3AF] mb-4">Required Skills</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {job.skills?.slice(0, 4).map((skill) => (
                    <span key={skill} className="px-4 py-1.5 text-xs font-bold bg-white text-[#374151] border border-[#E5E7EB] rounded-full shadow-sm hover:border-[#3538CD]/30 transition-colors">
                      {skill}
                    </span>
                  ))}
                  {(job.skills?.length ?? 0) > 4 && (
                    <span className="px-4 py-1.5 text-xs font-bold bg-white text-[#374151] border border-[#E5E7EB] rounded-full shadow-sm">
                      +{(job.skills?.length ?? 0) - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-[#F3F4F6] my-10" />

              {/* About This Role */}
              <div className="mb-12 border-l-2 border-[#3538CD] pl-8">
                <h2 className="text-xl font-black text-[#111827] mb-6">About This Role</h2>
                <div className="text-[15px] text-[#374151] leading-relaxed space-y-6 font-medium whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>

              {/* Evaluation Criteria */}
              {job.evaluationCriteria && job.evaluationCriteria.length > 0 && (
                <div className="mb-12 border-l-2 border-[#3538CD] pl-8">
                  <h2 className="text-xl font-black text-[#111827] mb-6">Evaluation Criteria</h2>
                  <ul className="space-y-4">
                    {job.evaluationCriteria.map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-[15px] text-[#374151] font-medium leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3538CD] mt-2.5 shrink-0" />
                        {(item as any)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Additional Information Required */}
              {job.customFields && job.customFields.length > 0 && (
                <div className="p-8 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB]">
                  <h3 className="text-sm font-black text-[#111827] uppercase tracking-widest mb-6">Additional Information Required</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {job.customFields.map((field: any) => (
                      <div key={field.id} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#3538CD]/30" />
                        <span className="text-sm font-bold text-[#374151]">{field.label} {field.required && <span className="text-[#3538CD] font-black text-xs">*</span>}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT COLUMN — Sticky Apply Card */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl overflow-hidden shadow-[#3538CD]/5">
                {/* Visual Header */}
                <div className="px-8 py-6 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Posted 3 days ago</p>
                      <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Job ID: <span className="text-[#111827]">JB-9921</span></p>
                   </div>
                   <TrendingUp className="w-5 h-5 text-[#3538CD]" />
                </div>

                <div className="p-8">
                  <div className="mb-8">
                    <h3 className="text-xl font-black text-[#111827] mb-2">Apply for this role</h3>
                  </div>

                  {job.targetDate && (
                    <div className="mb-6 p-4 bg-[#D97706]/5 border border-[#D97706]/20 rounded-xl flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#D97706] shrink-0" />
                      <span className="text-xs font-black text-[#D97706] uppercase tracking-widest">Apply before 30 Mar 2026</span>
                    </div>
                  )}


                  <button
                    onClick={handleApplyClick}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-[#3538CD] text-white text-base font-bold rounded-xl hover:bg-[#292bb0] transition-all transform hover:translate-y-[-2px] shadow-lg shadow-[#3538CD]/20 mb-6"
                  >
                    Apply Now <ArrowRight className="w-5 h-5" />
                  </button>

                  <div className="text-center mb-6">
                    <p className="text-[11px] text-[#9CA3AF] font-bold uppercase tracking-widest mb-3">Already applied here before?</p>
                    <button
                      onClick={handleSignInClick}
                      className="text-[13px] font-black text-[#3538CD] hover:underline"
                    >
                      Sign in for one-click apply →
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-[#E5E7EB] text-[#374151] text-xs font-black rounded-xl hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all uppercase tracking-widest group">
                      <Bookmark className="w-4 h-4 group-hover:fill-[#111827]" /> Save
                    </button>
                    <button className="p-3.5 border-2 border-[#E5E7EB] text-[#6B7280] rounded-xl hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Jobs Section */}
        <div className="mt-24 border-t border-[#E5E7EB] pt-16">
          <h2 className="text-2xl font-black text-[#111827] mb-10 flex items-center gap-3">
             Similar Jobs
             <span className="px-2.5 py-1 bg-[#F4F5FA] text-[#3538CD] text-[12px] rounded-full font-bold">3 Opportunities</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarJobs.map((js) => (
              <div key={js.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm hover:border-[#3538CD]/30 hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-base font-black text-[#111827] group-hover:text-[#3538CD] transition-colors">{js.title}</h3>
                  <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">{js.posted}</span>
                </div>
                
                <p className="text-xs font-bold text-[#6B7280] mb-4">{js.company}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2 py-1 bg-[#F9FAFB] text-[#6B7280] text-[10px] font-black rounded uppercase">{js.location}</span>
                  <span className="px-2 py-1 bg-[#F9FAFB] text-[#6B7280] text-[10px] font-black rounded uppercase">{js.type}</span>
                  <span className="px-2 py-1 bg-[#F9FAFB] text-[#6B7280] text-[10px] font-black rounded uppercase">{js.experience}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {js.skills.map(skill => (
                    <span key={skill} className="text-[10px] text-[#9CA3AF] font-bold">#{skill.toLowerCase()}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-[#F3F4F6]">
                  <span className="text-sm font-black text-[#111827]">{js.salary}</span>
                  <Link
                    to={`/portal/yopmails/job/${js.id}`}
                    className="text-xs font-black text-[#3538CD] hover:underline flex items-center gap-1"
                  >
                    View & Apply <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        jobTitle={job.title}
        businessUnit={job.businessUnit}
        jobId={job.id}
        initialTab={authTab}
      />

      {/* Footer */}
      <footer className="mt-24 border-t border-[#E5E7EB] py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest">
           <div>Powered by CollabCareers</div>
           <div className="flex items-center gap-8">
             <Link to="#" className="hover:text-[#3538CD] transition-colors">Privacy Policy</Link>
             <span>&copy; {new Date().getFullYear()} Yopmails Recruitment</span>
           </div>
        </div>
      </footer>
    </PortalLayout>
  );
}
