import { Link } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import { Search, Filter, ChevronDown, Zap, MapPin, Mail, Eye } from 'lucide-react';
import { useApp } from '../store/AppContext';

export default function CandidateListingPage() {
  const { applications, candidates, jobs } = useApp();

  const enrichedApps = applications.map(app => {
    const candidate = candidates.find(c => c.id === app.candidateId);
    const job = jobs.find(j => j.id === app.jobId);
    return { ...app, candidate, job };
  });

  return (
    <CRMLayout
      breadcrumbs={[{ label: 'Candidates' }]}
      title="Candidate Pipeline"
      actions={
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidates..."
              className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
            />
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors">
            <Filter className="w-3.5 h-3.5" /> Filter
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      }
    >
      {enrichedApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-dashed border-[#D1D5DB]">
          <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6">
            <Eye className="w-8 h-8 text-primary/40" />
          </div>
          <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">No applications yet</h3>
          <p className="text-sm text-[#6B7280] max-w-sm text-center">
            When candidates apply through CollabCareers, their applications will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_120px] gap-4 px-6 py-3 bg-[#F9FAFB] border-b border-[#E5E7EB] text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">
            <span>Candidate</span>
            <span>Applied For</span>
            <span>Source</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {/* Table Rows */}
          {enrichedApps.map(app => (
            <div key={app.id} className="grid grid-cols-[2fr_1.5fr_1fr_1fr_120px] gap-4 items-center px-6 py-4 border-b border-[#F3F4F6] hover:bg-primary/[0.02] transition-colors group">
              {/* Candidate info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {app.candidate?.firstName?.[0] || '?'}{app.candidate?.lastName?.[0] || ''}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1A1A2E] truncate">{app.candidate?.firstName} {app.candidate?.lastName}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-[#6B7280] truncate flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {app.candidate?.email}
                    </p>
                    {app.candidate?.isAlumni && (
                      <span className="px-2 py-0.5 text-[9px] font-black bg-[#E07C3F] text-white rounded-full flex items-center gap-0.5 shrink-0">
                        <Zap className="w-2.5 h-2.5" /> ALUMNI
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Job */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#374151] truncate">{app.job?.title || 'Unknown'}</p>
                <p className="text-[11px] text-[#9CA3AF] truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" /> {app.job?.location}
                </p>
              </div>

              {/* Source */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-full border border-primary/15">
                  CollabCareers
                </span>
              </div>

              {/* Status */}
              <div>
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                  app.status === 'Submitted' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  app.status === 'Under Review' ? 'bg-green-50 text-green-700 border border-green-200' :
                  'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]'
                }`}>
                  {app.status}
                </span>
              </div>

              {/* Action */}
              <div>
                <Link
                  to={`/crm/candidates/${app.candidateId}`}
                  className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-[#292bb0] transition-colors opacity-0 group-hover:opacity-100"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </CRMLayout>
  );
}
