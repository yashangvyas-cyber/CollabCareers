import { useState } from 'react';
import { ChevronRight, Check, X, Plus, Pencil, FileText, AlertTriangle } from 'lucide-react';
import type { Candidate, Job } from '../store/types';
import { useApp } from '../store/AppContext';

type EmailMode = 'template' | 'custom';

export default function InviteEmailCompose({
  candidate,
  jobs,
  onClose,
  onSent,
}: {
  candidate: Candidate;
  jobs: Job[];
  onClose: () => void;
  onSent: (name: string) => void;
}) {
  const { invites, sendInvite } = useApp();

  const [jobId, setJobId] = useState('');
  const [ccEmails, setCcEmails] = useState<string[]>([]);
  const [ccInput, setCcInput] = useState('');
  const [bccInput, setBccInput] = useState('');
  const [emailMode, setEmailMode] = useState<EmailMode>('template');
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');

  const openJobs = jobs.filter(j => j.status === 'Open');
  const selectedJob = jobId ? jobs.find(j => j.id === jobId) : null;
  const templateSubject = selectedJob
    ? `Invitation to Apply — ${selectedJob.title} at ${selectedJob.businessUnit}`
    : '';

  // Duplicate pending invite check
  const hasPendingInvite = !!jobId && invites.some(
    i => i.candidateId === candidate.id && i.jobId === jobId && i.status === 'Sent'
  );

  const switchToCustom = () => {
    if (!customSubject) setCustomSubject(templateSubject || 'Invitation to Apply');
    if (!customBody) {
      setCustomBody(
        `Hi ${candidate.firstName} ${candidate.lastName},\n\nI came across your profile and wanted to personally reach out.\n\n[Your message here]\n\nPlease feel free to reply to this email if you have any questions.\n\nRegards,\nHR Team\nCollabCRM`
      );
    }
    setEmailMode('custom');
  };

  const addCc = () => {
    if (ccInput.trim()) {
      setCcEmails(prev => [...prev, ccInput.trim()]);
      setCcInput('');
    }
  };

  const canSend = !hasPendingInvite && (
    emailMode === 'template'
      ? !!jobId
      : (!!customSubject.trim() && !!customBody.trim())
  );

  const handleSend = () => {
    if (selectedJob) {
      sendInvite({
        id: `inv_${Date.now()}`,
        candidateId: candidate.id,
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        sentAt: new Date().toISOString(),
        sentBy: 'Super User',
        status: 'Sent',
        emailMode,
      });
    } else if (emailMode === 'custom') {
      // Custom email with no specific job — still record it without jobId
      sendInvite({
        id: `inv_${Date.now()}`,
        candidateId: candidate.id,
        jobId: '',
        jobTitle: customSubject,
        sentAt: new Date().toISOString(),
        sentBy: 'Super User',
        status: 'Sent',
        emailMode: 'custom',
      });
    }
    onSent(candidate.firstName);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#F3F4F6] flex flex-col">

      {/* Top bar */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-3.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <span className="hover:text-[#3538CD] cursor-pointer transition-colors" onClick={onClose}>Back</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#111827] font-semibold">Invite to Apply</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled={!canSend}
            onClick={handleSend}
            className="px-5 py-2 bg-[#3538CD] text-white text-[11px] font-black rounded-lg hover:bg-[#292bb0] disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-widest transition-all shadow-md shadow-[#3538CD]/20 flex items-center gap-2"
          >
            <Check className="w-3.5 h-3.5" /> Send Invite
          </button>
          <button onClick={onClose} className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors text-[#6B7280]">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto py-8 px-6">
        <div className="max-w-3xl mx-auto space-y-4">

          {/* Duplicate invite warning */}
          {hasPendingInvite && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-black text-amber-800">Invite already pending</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  An invite for this job is already waiting for a response from {candidate.firstName}. Sending another one may feel like spam — update the status in Invite History if needed.
                </p>
              </div>
            </div>
          )}

          {/* Compose fields */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm divide-y divide-[#F3F4F6] overflow-hidden">

            <div className="flex items-center gap-4 px-6 py-3">
              <span className="text-sm text-[#9CA3AF] w-16 shrink-0 font-medium">From</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#374151]">CollabCareers – MindInventory</span>
                <span className="text-xs text-[#9CA3AF]">&lt;noreply@yopmails.com&gt;</span>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-3">
              <span className="text-sm text-[#9CA3AF] w-16 shrink-0 font-medium">Send To</span>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F4F5FA] rounded-lg text-sm border border-[#E5E7EB]">
                  <span className="w-5 h-5 bg-[#3538CD] text-white rounded text-[10px] font-black flex items-center justify-center shrink-0">
                    {candidate.firstName[0]}
                  </span>
                  <span className="text-[#374151] font-medium">{candidate.email}</span>
                </div>
                <button className="w-6 h-6 flex items-center justify-center border border-[#E5E7EB] rounded-md text-[#9CA3AF] hover:text-[#3538CD] hover:border-[#3538CD]/40 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-3">
              <span className="text-sm text-[#9CA3AF] w-16 shrink-0 font-medium">Cc</span>
              <div className="flex items-center gap-2 flex-wrap flex-1">
                {ccEmails.map((email, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F4F5FA] rounded-lg text-sm border border-[#E5E7EB]">
                    <span className="w-5 h-5 bg-[#6B7280] text-white rounded text-[10px] font-black flex items-center justify-center shrink-0">
                      {email[0].toUpperCase()}
                    </span>
                    <span className="text-[#374151] font-medium">{email}</span>
                    <button onClick={() => setCcEmails(ccEmails.filter((_, j) => j !== i))}>
                      <X className="w-3 h-3 text-[#9CA3AF] hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                ))}
                <input
                  type="text" value={ccInput} onChange={e => setCcInput(e.target.value)}
                  onKeyDown={e => { if ((e.key === 'Enter' || e.key === ',') && ccInput.trim()) { e.preventDefault(); addCc(); } }}
                  onBlur={addCc}
                  placeholder="Type email and press enter..."
                  className="text-sm flex-1 focus:outline-none placeholder:text-[#D1D5DB] min-w-40"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-3">
              <span className="text-sm text-[#9CA3AF] w-16 shrink-0 font-medium">Bcc</span>
              <input
                type="text" value={bccInput} onChange={e => setBccInput(e.target.value)}
                placeholder="Type email and press enter..."
                className="text-sm flex-1 focus:outline-none placeholder:text-[#D1D5DB]"
              />
            </div>

            <div className="flex items-center gap-4 px-6 py-3">
              <span className="text-sm text-[#9CA3AF] w-16 shrink-0 font-medium">Job</span>
              <select
                value={jobId}
                onChange={e => setJobId(e.target.value)}
                className="text-sm text-[#374151] font-medium focus:outline-none bg-transparent flex-1 cursor-pointer"
              >
                <option value="">Select a job to invite for...</option>
                {openJobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title} — {j.businessUnit}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4 px-6 py-3">
              <span className="text-sm text-[#9CA3AF] w-16 shrink-0 font-medium">Subject</span>
              {emailMode === 'template' ? (
                <span className={`text-sm ${templateSubject ? 'text-[#374151] font-medium' : 'text-[#D1D5DB]'}`}>
                  {templateSubject || 'Subject will be generated after selecting a job'}
                </span>
              ) : (
                <input
                  type="text" value={customSubject} onChange={e => setCustomSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="text-sm flex-1 text-[#374151] font-medium focus:outline-none placeholder:text-[#D1D5DB]"
                />
              )}
            </div>
          </div>

          {/* Mode toggle */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-[#9CA3AF] uppercase tracking-widest">Email Body</p>
            <div className="flex items-center gap-1 bg-white border border-[#E5E7EB] rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setEmailMode('template')}
                className={`px-3 py-1.5 text-[11px] font-black rounded-md transition-all uppercase tracking-widest flex items-center gap-1.5 ${
                  emailMode === 'template' ? 'bg-[#3538CD] text-white shadow-sm' : 'text-[#9CA3AF] hover:text-[#6B7280]'
                }`}
              >
                <FileText className="w-3 h-3" /> Template
              </button>
              <button
                onClick={switchToCustom}
                className={`px-3 py-1.5 text-[11px] font-black rounded-md transition-all uppercase tracking-widest flex items-center gap-1.5 ${
                  emailMode === 'custom' ? 'bg-[#3538CD] text-white shadow-sm' : 'text-[#9CA3AF] hover:text-[#6B7280]'
                }`}
              >
                <Pencil className="w-3 h-3" /> Custom
              </button>
            </div>
          </div>

          {/* Template mode */}
          {emailMode === 'template' && (
            <div className="bg-[#E5E7EB] rounded-xl p-5">
              <div className="bg-white rounded-xl max-w-2xl mx-auto shadow-sm border border-[#E5E7EB] overflow-hidden">
                <div className="px-8 py-5 border-b border-[#F3F4F6] flex items-center justify-between">
                  <h2 className="text-lg font-black text-[#3538CD]">Invitation to Apply</h2>
                  <span className="text-sm font-black text-[#111827] tracking-tight">CollabCRM</span>
                </div>
                <div className="px-8 py-6 space-y-4 text-sm text-[#374151] leading-relaxed">
                  <p>Hi <strong>{candidate.firstName} {candidate.lastName}</strong>,</p>
                  <p>We came across your profile in the CollabCRM Career Portal. Based on your background and the skills you have highlighted, we think you would be a strong match for an open role on our team.</p>
                  <p>We would like to invite you to apply for the following position:</p>
                  {selectedJob ? (
                    <table className="w-full border border-[#E5E7EB] rounded-lg overflow-hidden text-sm border-collapse">
                      <tbody>
                        {[
                          ['Job Title', selectedJob.title],
                          ['Location', selectedJob.location],
                          ['Employment Type', selectedJob.employmentType],
                          ['Experience Required', selectedJob.experience],
                        ].map(([label, value]) => (
                          <tr key={label} className="border-b border-[#F3F4F6] last:border-0">
                            <td className="px-4 py-2.5 text-[#6B7280] font-medium w-2/5 bg-[#F9FAFB]">{label}</td>
                            <td className="px-4 py-2.5 font-bold text-[#111827]">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="bg-[#F9FAFB] border border-dashed border-[#D1D5DB] rounded-lg p-6 text-center text-[#9CA3AF] text-xs">
                      Select a job above to preview the job details here
                    </div>
                  )}
                  <p>To apply for this position, please click the button below:</p>
                  <div className="text-center py-2">
                    <span className="inline-block px-8 py-3 bg-[#3538CD] text-white font-black text-sm rounded-xl cursor-pointer">Apply Now →</span>
                  </div>
                  <p className="text-[#6B7280]">If you have any questions about the role or the application process, feel free to reply to this email.</p>
                  <p className="text-[#6B7280] text-xs">We request you to add <span className="text-[#3538CD] font-medium">noreply@yopmails.com</span> to your whitelist so you can receive timely updates.</p>
                  <div className="pt-4 border-t border-[#F3F4F6]">
                    <p>Regards,</p>
                    <p className="font-bold">HR Team</p>
                    <p className="text-[#9CA3AF]">CollabCRM</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Custom mode */}
          {emailMode === 'custom' && (
            <div className="bg-[#E5E7EB] rounded-xl p-5">
              <div className="bg-white rounded-xl max-w-2xl mx-auto shadow-sm border border-[#E5E7EB] overflow-hidden">
                <div className="px-8 py-5 border-b border-[#F3F4F6] flex items-center justify-between">
                  <h2 className="text-lg font-black text-[#3538CD]">{customSubject || 'Untitled Email'}</h2>
                  <span className="text-sm font-black text-[#111827] tracking-tight">CollabCRM</span>
                </div>
                <div className="px-8 py-6">
                  <textarea
                    value={customBody} onChange={e => setCustomBody(e.target.value)}
                    placeholder={`Hi ${candidate.firstName} ${candidate.lastName},\n\nWrite your custom message here...`}
                    rows={14}
                    className="w-full text-sm text-[#374151] leading-relaxed focus:outline-none resize-none placeholder:text-[#C4C9D4]"
                  />
                </div>
              </div>
              <p className="text-center text-[11px] text-[#9CA3AF] font-medium mt-3">
                This email will be sent as plain text. Write naturally — no formatting required.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
