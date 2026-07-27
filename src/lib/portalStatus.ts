// Candidate-portal status presentation — the single source of truth for BOTH
// the applications list (CandidateProfilePage) and the detail page
// (ViewApplicationPage). Two candidate-facing surfaces, one palette, so a status
// can never look different between them.
//
// Palette = the approved design handoff: a distinct hue per status (WCAG AA in
// light), exact hex so rendered badges match the swatches. The brand pink
// (#ED184F) is reserved for buttons/links and never used for a status.

/** Internal application status → the label a candidate actually sees. */
export const portalStatusLabel: Record<string, string> = {
  'Applied': 'Applied',
  'Under Review': 'Under Review',
  'Shortlisted': 'Under Review',
  'Interview in Progress': 'Interview In Progress',
  'Offered': 'Offered',
  'Offer Accepted': 'Offer Accepted',
  'Offer Declined': 'Offer Declined',
  'Offer Revoked': 'Offer On Hold',   // internal "Revoked" reads as "On Hold" to the candidate
  'Withdrawn': 'Application Withdrawn',
  'On Hold': 'Under Review',
  'Rejected': 'Not Selected',
  'Selected': 'Under Review',
  'Joined': 'Joined',
  'Not Joined': 'Application Closed',
  'Archived': 'Application Closed',
  'Cancelled': 'Application Closed',
  'No Show': 'Application Closed',
  'Future': 'Under Review',
  'Active': 'Under Review',
};

/** Portal label → badge classes (bg / text / border). */
export const portalStatusColor: Record<string, string> = {
  'Draft':                 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]',
  'Applied':               'bg-[#EEF4FF] text-[#2563EB] border-[#B9D4FF]',
  'Under Review':          'bg-[#FFF4E5] text-[#D97706] border-[#FFD89A]',
  'Interview In Progress': 'bg-[#FFF7E6] text-[#B45309] border-[#F7C65F]',
  'Offered':               'bg-[#F3E8FF] text-[#7C3AED] border-[#D8B4FE]',
  'Offer Accepted':        'bg-[#ECFDF3] text-[#059669] border-[#A7F3D0]',
  'Offer Declined':        'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
  'Offer On Hold':         'bg-[#F5F3FF] text-[#6D28D9] border-[#C4B5FD]',
  'Application Withdrawn': 'bg-[#F3F4F6] text-[#6B7280] border-[#D1D5DB]',
  'Not Selected':          'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
  'Joined':                'bg-[#ECFDF3] text-[#15803D] border-[#86EFAC]',
  'Application Closed':    'bg-[#F3F4F6] text-[#6B7280] border-[#D1D5DB]',
};

const FALLBACK = 'bg-gray-100 text-gray-500 border-gray-200';

/** Resolve a raw application status to the candidate-facing { label, className }.
 *  Pass isDraft for saved-but-unsubmitted applications. */
export function portalStatus(rawStatus: string, opts?: { isDraft?: boolean }): { label: string; className: string } {
  const label = opts?.isDraft ? 'Draft' : (portalStatusLabel[rawStatus] || rawStatus);
  return { label, className: portalStatusColor[label] || FALLBACK };
}
