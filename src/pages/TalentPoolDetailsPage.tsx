import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import {
  Mail, Phone, MapPin, FileText, ExternalLink,
  Briefcase, Clock, Check, X, MessageSquare, PhoneCall,
  CalendarDays, ChevronRight
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import InviteEmailCompose from '../components/InviteEmailCompose';

const appStatusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  'Under Review':         { bg: 'bg-[#F4F5FA]',    text: 'text-[#3538CD]',  dot: 'bg-[#3538CD]' },
  'Interview in Progress':{ bg: 'bg-[#F4F5FA]',    text: 'text-[#3538CD]',  dot: 'bg-[#3538CD]' },
  'Decision Made':        { bg: 'bg-[#F9FAFB]',    text: 'text-[#6B7280]',  dot: 'bg-[#9CA3AF]' },
  'Offer Made':           { bg: 'bg-[#3538CD]',    text: 'text-white',      dot: 'bg-white' },
  'Rejected':             { bg: 'bg-gray-100',     text: 'text-gray-400',   dot: 'bg-gray-300' },
  'Draft':                { bg: 'bg-amber-50',     text: 'text-amber-600',  dot: 'bg-amber-400' },
  'Submitted':            { bg: 'bg-[#F4F5FA]',    text: 'text-[#3538CD]',  dot: 'bg-[#3538CD]' },
  'Withdrawn':            { bg: 'bg-gray-50',      text: 'text-gray-400',   dot: 'bg-gray-300' },
};

const formatRelativeDate = (dateStr: string) => {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff}d ago`;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

export default function TalentPoolDetailsPage() {
  const { candidateId } = useParams();
  const { candidates, jobs, applications } = useApp();

  const [showInvite, setShowInvite] = useState(false);
  const [inviteSent, setInviteSent] = useState<string | null>(null);

  const candidate = candidates.find(c => c.id === candidateId);

  if (!candidate) {
    return (
      <CRMLayout breadcrumbs={[{ label: 'Talent Pool', path: '/crm/talent-pool' }, { label: 'Not Found' }]}>
        <div className="p-8 text-center text-[#6B7280]">Candidate not found.</div>
      </CRMLayout>
    );
  }

  const candidateApps = applications
    .filter(a => a.candidateId === candidate.id)
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

  const handleInviteSent = (name: string) => {
    setShowInvite(false);
    setInviteSent(name);
    setTimeout(() => setInviteSent(null), 4000);
  };

  const canContact = candidate.allowRecruiterContact;

  return (
    <>
      <CRMLayout
        breadcrumbs={[
          { label: 'Talent Pool', path: '/crm/talent-pool' },
          { label: `${candidate.firstName} ${candidate.lastName}` },
        ]}
      >
        <div className="max-w-5xl mx-auto space-y-5 pt-2 pb-10">

          {/* ── Header ── */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-[#3538CD] to-[#6366F1]" />
            <div className="px-6 py-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#3538CD]/10 text-[#3538CD] rounded-2xl flex items-center justify-center text-xl font-black shrink-0">
                  {candidate.firstName[0]}{candidate.lastName[0]}
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#111827]">
                    {candidate.firstName} {candidate.lastName}
                  </h2>
                  <p className="text-sm text-[#6B7280] font-medium mt-0.5">
                    {[candidate.currentDesignation, candidate.currentOrg].filter(Boolean).join(' · ') || 'No designation set'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {candidate.isAlumni && (
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        Verified Alumni
                      </span>
                    )}
                    {candidate.profileVisibility === 'visible' && (
                      <span className="text-[10px] font-black text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        Open to Opportunities
                      </span>
                    )}
                    {candidateApps.length > 0 && (
                      <span className="text-[10px] font-black text-[#3538CD] bg-[#F4F5FA] border border-[#3538CD]/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        {candidateApps.length} Application{candidateApps.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowInvite(true)}
                className="shrink-0 px-6 py-2.5 bg-[#3538CD] text-white text-[11px] font-black rounded-xl hover:bg-[#292bb0] transition-all shadow-md shadow-[#3538CD]/20 uppercase tracking-widest"
              >
                Invite to Apply
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-5 items-start">

            {/* ── LEFT SIDEBAR ── */}
            <div className="w-full lg:w-[300px] shrink-0 space-y-5">

              {/* Contact Info */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5">
                <h3 className="text-[11px] font-black text-[#6B7280] uppercase tracking-widest mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm font-medium text-[#374151]">
                    <Mail className="w-4 h-4 text-[#6B7280] shrink-0" />
                    <span className="truncate">{candidate.email}</span>
                  </div>
                  {candidate.phone && (
                    <div className="flex items-center gap-3 text-sm font-medium text-[#374151]">
                      <Phone className="w-4 h-4 text-[#6B7280] shrink-0" />
                      <span>{candidate.phone}</span>
                    </div>
                  )}
                  {candidate.location && (
                    <div className="flex items-center gap-3 text-sm font-medium text-[#374151]">
                      <MapPin className="w-4 h-4 text-[#6B7280] shrink-0" />
                      <span className="truncate">{candidate.location}</span>
                    </div>
                  )}
                  {candidate.linkedin && (
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-[#0A66C2] shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                      <a
                        href={`https://${candidate.linkedin.replace('https://', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-bold text-[#3538CD] hover:underline truncate"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Preference */}
              <div className={`rounded-2xl border shadow-sm p-5 ${canContact ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <h3 className={`text-[11px] font-black uppercase tracking-widest mb-3 ${canContact ? 'text-green-700' : 'text-amber-700'}`}>
                  Contact Preference
                </h3>
                {canContact ? (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 border border-green-300 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                      <PhoneCall className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-green-800">Open to direct contact</p>
                      <p className="text-xs text-green-600 mt-0.5 leading-relaxed">
                        You can reach out via email or phone without sending a formal invite first.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 border border-amber-300 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                      <MessageSquare className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-amber-800">Prefers invite first</p>
                      <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                        Send a formal invite — candidate will respond if interested.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Resume */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5">
                <h3 className="text-[11px] font-black text-[#6B7280] uppercase tracking-widest mb-4">Resume</h3>
                {candidate.resumeUrl ? (
                  <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] hover:bg-white hover:border-[#3538CD]/30 cursor-pointer transition-all group">
                    <FileText className="w-5 h-5 text-[#3538CD] shrink-0" />
                    <p className="text-xs font-bold text-[#111827] truncate flex-1">{candidate.resumeUrl}</p>
                    <ExternalLink className="w-4 h-4 text-[#3538CD] group-hover:scale-110 transition-transform shrink-0" />
                  </div>
                ) : (
                  <p className="text-xs font-bold text-[#9CA3AF] italic">No resume uploaded</p>
                )}
              </div>
            </div>

            {/* ── RIGHT MAIN ── */}
            <div className="flex-1 min-w-0 space-y-5">

              {/* Professional Profile */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
                <h3 className="text-[11px] font-black text-[#6B7280] uppercase tracking-widest mb-5">Professional Profile</h3>
                <div className="grid grid-cols-3 gap-5">
                  <div>
                    <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3" /> Organisation
                    </p>
                    <p className="text-sm font-bold text-[#111827]">{candidate.currentOrg || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1.5">Designation</p>
                    <p className="text-sm font-bold text-[#111827]">{candidate.currentDesignation || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Notice Period
                    </p>
                    <p className="text-sm font-bold text-[#111827]">{candidate.noticePeriod || '—'}</p>
                  </div>
                </div>

                <div className="border-t border-[#F3F4F6] mt-5 pt-5">
                  <p className="text-[11px] font-black text-[#6B7280] uppercase tracking-widest mb-3">Skills</p>
                  {candidate.skills?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 text-[11px] font-bold bg-[#F4F5FA] text-[#3538CD] border border-[#3538CD]/10 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-[#9CA3AF] italic">No skills listed</p>
                  )}
                </div>
              </div>

              {/* Application History */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[11px] font-black text-[#6B7280] uppercase tracking-widest">Application History</h3>
                  {candidateApps.length > 0 && (
                    <span className="text-[10px] font-black text-[#3538CD] bg-[#F4F5FA] border border-[#3538CD]/10 px-2.5 py-1 rounded-full">
                      {candidateApps.length} total
                    </span>
                  )}
                </div>

                {candidateApps.length === 0 ? (
                  <div className="py-6 flex flex-col items-center gap-2 text-center">
                    <div className="w-10 h-10 bg-[#F4F5FA] rounded-xl flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-[#D1D5DB]" />
                    </div>
                    <p className="text-sm font-bold text-[#9CA3AF]">No applications yet</p>
                    <p className="text-xs text-[#C4C9D4]">This candidate is in the talent pool but hasn't applied to any jobs.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {candidateApps.map(app => {
                      const job = jobs.find(j => j.id === app.jobId);
                      const style = appStatusStyles[app.status] ?? { bg: 'bg-[#F9FAFB]', text: 'text-[#6B7280]', dot: 'bg-[#9CA3AF]' };
                      return (
                        <div key={app.id} className="flex items-center gap-4 p-3.5 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6] hover:border-[#3538CD]/20 hover:bg-white transition-all group">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#111827] truncate group-hover:text-[#3538CD] transition-colors">
                              {job?.title || 'Unknown Job'}
                            </p>
                            <p className="text-xs text-[#9CA3AF] mt-0.5">{job?.businessUnit || ''}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-transparent ${style.bg} ${style.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                              {app.status}
                            </span>
                            <span className="text-[10px] font-bold text-[#9CA3AF] whitespace-nowrap">
                              {formatRelativeDate(app.appliedAt)}
                            </span>
                            <Link
                              to={`/crm/candidates/${candidate.id}`}
                              className="p-1 text-[#D1D5DB] hover:text-[#3538CD] transition-colors"
                              title="View in candidate detail"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </CRMLayout>

      {showInvite && (
        <InviteEmailCompose
          candidate={candidate}
          jobs={jobs}
          onClose={() => setShowInvite(false)}
          onSent={handleInviteSent}
        />
      )}

      {inviteSent && (
        <div className="fixed bottom-6 right-6 z-[200] bg-[#111827] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
          <Check className="w-4 h-4 text-green-400 shrink-0" />
          <span className="text-sm font-bold">Invite sent to {inviteSent}</span>
          <button onClick={() => setInviteSent(null)} className="ml-1 text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
