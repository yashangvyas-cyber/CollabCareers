import { useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { Briefcase, Mail, Phone, MapPin, FileText, ExternalLink, Clock, Linkedin } from 'lucide-react';
import { useApp } from '../store/AppContext';

const brandStatusStyles: Record<string, string> = {
  'Under Review': 'bg-[#F4F5FA] text-[#3538CD] border-[#3538CD]/20',
  'Interview Scheduled': 'bg-[#F4F5FA] text-[#3538CD] border-[#3538CD]/20',
  'Decision Pending': 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]',
  'Offer Made': 'bg-[#3538CD] text-white border-[#3538CD]',
  'Rejected': 'bg-gray-100 text-gray-400 border-gray-200'
};

const appliedJobs = [
  { id: '1', title: 'React Developer', company: 'Yopmails', status: 'Under Review', date: '13/Mar/2026' },
  { id: '3', title: 'Project Manager', company: 'Yopmails', status: 'Interview Scheduled', date: '10/Mar/2026' },
];

const savedJobs = [
  { id: '4', title: 'Flutter Developer', company: 'Yopmails', location: 'Remote', type: 'Full-time' },
  { id: '6', title: 'UI/UX Designer', company: 'Yopmails', location: 'Remote', type: 'Full-time' },
];

export default function CandidateProfilePage() {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'applications' | 'saved'>('applications');

  return (
    <PortalLayout>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT: Profile Sidebar */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 sticky top-[80px]">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-[#3538CD]/10 text-[#3538CD] flex items-center justify-center text-3xl font-black mx-auto mb-4">
                {currentUser?.firstName?.charAt(0) || 'Y'}
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-xl font-black text-[#111827]">{currentUser?.firstName} {currentUser?.lastName}</h2>
                <p className="text-sm font-bold text-[#6B7280] mt-1">UI Developer</p>
                
                <button className="mt-4 px-4 py-2 border border-[#E5E7EB] text-[#374151] text-xs font-black rounded-lg hover:bg-[#F9FAFB] transition-colors w-full uppercase tracking-widest">
                  Edit Profile
                </button>
              </div>

              <div className="border-t border-[#F3F4F6] my-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-medium text-[#374151]">
                  <Mail className="w-4 h-4 text-[#9CA3AF]" />
                  <span className="truncate">{currentUser?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-[#374151]">
                  <Phone className="w-4 h-4 text-[#9CA3AF]" />
                  <span>{currentUser?.phone || '+91 9876543210'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-[#374151]">
                  <MapPin className="w-4 h-4 text-[#9CA3AF]" />
                  <span>Ahmedabad, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                  <a href="#" className="text-sm font-bold text-[#3538CD] hover:underline">LinkedIn Profile</a>
                </div>
              </div>

              <div className="border-t border-[#F3F4F6] my-6" />

              {/* Resume */}
              <div>
                <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-3">Professional Resume</p>
                <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] group transition-all hover:bg-white hover:border-[#3538CD]/30">
                  <FileText className="w-5 h-5 text-[#3538CD]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#111827] truncate">Alex_Patel_Resume.pdf</p>
                    <p className="text-[10px] text-[#9CA3AF] font-bold">2.4 MB</p>
                  </div>
                  <button className="text-[#3538CD] hover:scale-110 transition-transform">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="border-t border-[#F3F4F6] my-6" />

              {/* Skills */}
              <div>
                <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-3">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {['React', 'JavaScript', 'TypeScript', 'Redux', 'TailwindCSS'].map((skill) => (
                    <span key={skill} className="px-3 py-1 text-[10px] font-bold bg-[#F4F5FA] text-[#3538CD] border border-[#3538CD]/10 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Main Content */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex items-center border-b border-[#E5E7EB] mb-8">
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-8 py-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                  activeTab === 'applications' ? 'text-[#3538CD]' : 'text-[#9CA3AF] hover:text-[#6B7280]'
                }`}
              >
                My Applications
                {activeTab === 'applications' && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#3538CD] rounded-full" />}
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-8 py-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                  activeTab === 'saved' ? 'text-[#3538CD]' : 'text-[#9CA3AF] hover:text-[#6B7280]'
                }`}
              >
                Saved Jobs
                {activeTab === 'saved' && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#3538CD] rounded-full" />}
              </button>
            </div>

            <div className="space-y-4">
              {activeTab === 'applications' ? (
                appliedJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 flex items-center justify-between hover:border-[#3538CD]/30 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#F4F5FA] flex items-center justify-center text-[#3538CD] font-black text-lg">
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-[#111827] group-hover:text-[#3538CD] transition-colors">{job.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs font-bold text-[#6B7280]">{job.company}</p>
                          <span className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
                          <span className="text-[10px] font-bold text-[#9CA3AF] flex items-center gap-1"><Clock className="w-3 h-3" /> Applied on {job.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <span className={`px-3 py-1.5 text-[10px] font-black rounded-full border uppercase tracking-wider ${brandStatusStyles[job.status] || brandStatusStyles['Under Review']}`}>
                        {job.status}
                      </span>
                      <Link to="#" className="text-sm font-black text-[#3538CD] hover:underline flex items-center gap-1">
                        View Application <ArrowIcon />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                savedJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 flex items-center justify-between hover:border-[#3538CD]/30 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#F4F5FA] flex items-center justify-center text-[#3538CD] font-black text-lg">
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-[#111827] group-hover:text-[#3538CD] transition-colors">{job.title}</h4>
                        <p className="text-xs font-bold text-[#6B7280] mt-1">{job.company} • {job.location} • {job.type}</p>
                      </div>
                    </div>
                    <Link to={`/portal/yopmails/job/${job.id}`} className="px-6 py-2.5 bg-[#3538CD] text-white text-xs font-black rounded-lg hover:bg-[#292bb0] transition-colors uppercase tracking-widest shadow-lg shadow-[#3538CD]/10">
                      Apply Now
                    </Link>
                  </div>
                ))
              )}

              {(activeTab === 'applications' ? appliedJobs.length : savedJobs.length) === 0 && (
                <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-[#E5E7EB]">
                  <Briefcase className="w-12 h-12 text-[#E5E7EB] mx-auto mb-4" />
                  <p className="text-sm font-bold text-[#9CA3AF]">No {activeTab === 'applications' ? 'applications' : 'saved jobs'} found.</p>
                </div>
              )}
            </div>

            {/* Account Info Card (Moved below if needed, or kept for detail) */}
            <div className="mt-12 bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
              <div className="px-8 py-5 border-b border-[#F3F4F6] bg-[#F9FAFB]/50">
                <h3 className="text-sm font-black text-[#111827] uppercase tracking-widest">Additional Professional Info</h3>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div>
                    <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">Current Organization</p>
                    <p className="text-sm font-bold text-[#111827]">MindInventory</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">Notice Period</p>
                    <p className="text-sm font-bold text-[#111827]">30 Days</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">Expected CTC</p>
                    <p className="text-sm font-bold text-[#3538CD]">₹9 LPA (Annual)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
