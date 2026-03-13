import { Link } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { Briefcase, Mail, Phone, MapPin, FileText, ExternalLink, Zap, Clock } from 'lucide-react';

const appliedJobs = [
  { id: '1', title: 'React Developer', company: 'Yopmails', status: 'Submitted', date: '13/Mar/2026', statusColor: 'bg-green-50 text-green-700 border-green-200' },
  { id: '3', title: 'Project Manager', company: 'Yopmails', status: 'Under Review', date: '10/Mar/2026', statusColor: 'bg-blue-50 text-blue-700 border-blue-200' },
];

const openJobs = [
  { id: '4', title: 'Flutter Developer', company: 'Yopmails', location: 'Remote', type: 'Full-time' },
  { id: '6', title: 'UI/UX Designer', company: 'Yopmails', location: 'Remote', type: 'Full-time' },
];

export default function CandidateProfilePage() {
  return (
    <PortalLayout isLoggedIn>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* LEFT: Profile Sidebar */}
          <div className="w-[280px] shrink-0">
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-5 sticky top-[80px]">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                Y
              </div>
              <h2 className="text-lg font-bold text-[#1A1A2E] text-center">Yashang Patel</h2>
              <p className="text-sm text-primary text-center mt-0.5">React Developer</p>
              <p className="text-xs text-[#9CA3AF] text-center mt-0.5">3+ years experience</p>

              <div className="border-t border-[#E5E7EB] my-4" />

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-[#374151]">
                  <Mail className="w-4 h-4 text-[#9CA3AF]" />
                  <span className="truncate">yashang@gmail.com</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-[#374151]">
                  <Phone className="w-4 h-4 text-[#9CA3AF]" />
                  <span>+91 9876543210</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-[#374151]">
                  <MapPin className="w-4 h-4 text-[#9CA3AF]" />
                  <span>Ahmedabad, India</span>
                </div>
              </div>

              <div className="border-t border-[#E5E7EB] my-4" />

              {/* Resume */}
              <div className="flex items-center gap-3 p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                <FileText className="w-4 h-4 text-[#9CA3AF]" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#374151] truncate">Yashang_Patel_Resume.pdf</p>
                  <p className="text-[10px] text-[#9CA3AF]">2.4 MB</p>
                </div>
                <button className="text-primary hover:text-[#292bb0]">
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="border-t border-[#E5E7EB] my-4" />

              {/* Skills */}
              <div>
                <p className="text-xs font-semibold text-[#374151] mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {['React', 'JavaScript', 'TypeScript', 'Redux', 'TailwindCSS'].map((skill) => (
                    <span key={skill} className="px-2 py-0.5 text-[10px] font-medium bg-primary/5 text-primary border border-primary/20 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Main Content */}
          <div className="flex-1 min-w-0">
            {/* My Applications */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm mb-6">
              <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-[#1A1A2E]">My Applications</h3>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">{appliedJobs.length}</span>
                </div>
              </div>
              <div className="divide-y divide-[#F3F4F6]">
                {appliedJobs.map((job) => (
                  <div key={job.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">Y</div>
                      <div>
                        <p className="text-sm font-semibold text-[#1A1A2E]">{job.title}</p>
                        <p className="text-xs text-[#6B7280]">{job.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#9CA3AF] flex items-center gap-1"><Clock className="w-3 h-3" />{job.date}</span>
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${job.statusColor}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* One-Click Reapply Section */}
            <div className="bg-white rounded-xl border-2 border-primary/20 shadow-sm mb-6 overflow-hidden">
              <div className="px-6 py-4 bg-primary/5 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-[#1A1A2E]">Apply to More Jobs — One Click</h3>
              </div>
              <div className="divide-y divide-[#F3F4F6]">
                {openJobs.map((job) => (
                  <div key={job.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">Y</div>
                      <div>
                        <Link to={`/portal/yopmails/job/${job.id}`} className="text-sm font-semibold text-primary hover:text-[#292bb0] transition-colors">
                          {job.title}
                        </Link>
                        <p className="text-xs text-[#6B7280]">{job.company} • {job.location} • {job.type}</p>
                      </div>
                    </div>
                    <Link
                      to={`/portal/yopmails/confirmation/${job.id}`}
                      className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-[#292bb0] transition-colors"
                    >
                      <Zap className="w-3 h-3" /> Apply Now
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm">
              <div className="px-6 py-4 border-b border-[#E5E7EB]">
                <h3 className="text-sm font-bold text-[#1A1A2E]">Account Information</h3>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Current Organization</p>
                    <p className="text-sm text-[#1A1A2E]">MindInventory</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Designation</p>
                    <p className="text-sm text-[#1A1A2E]">UI Developer</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Notice Period</p>
                    <p className="text-sm text-[#1A1A2E]">30 Days</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Expected CTC</p>
                    <p className="text-sm text-[#1A1A2E]">₹9 LPA (Annual)</p>
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
