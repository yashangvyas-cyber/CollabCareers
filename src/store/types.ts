export type FieldType = 'Text' | 'Number' | 'Dropdown' | 'Date' | 'File Upload' | 'Yes/No';

export type TalentAvailabilityStatus =
  | 'Immediate Joiner'
  | 'Serving Notice Period'
  | 'Open to Good Offers'
  | 'Not Interested'
  | 'Offer in Hand';

export type TalentInviteStatus = 'Sent' | 'Interested' | 'Not Interested' | 'Applied' | 'Expired';

export interface TalentInvite {
  id: string;
  candidateId: string;
  jobId: string;
  jobTitle: string;
  sentAt: string;
  sentBy: string;
  status: TalentInviteStatus;
  emailMode: 'template' | 'custom';
}

export interface DropdownOption {
  id: string;
  value: string;
}

export interface CustomField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: DropdownOption[];
}

export interface Job {
  id: string;
  title: string;
  businessUnit: string;
  recruiter: string;
  location: string;
  experience: string;
  employmentType: string;
  jobType: string;
  skills: string[];
  salaryRange: {
    min: string;
    max: string;
    currency: string;
    type: string;
  };
  description: string;
  status: 'Open' | 'Draft' | 'Close';
  publishOnCollabCareers: boolean;
  customFields: CustomField[];
  evaluationCriteria: string[];
  createdAt: string;
  targetDate?: string;
  category?: string;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  resumeLink?: string;
  isAlumni: boolean;
  isBlacklisted?: boolean;
  candidateStatus?: 'Active' | 'Blacklisted' | 'Discarded' | 'Joined';
  statusReason?: string;
  alumniEmail?: string;
  savedJobIds?: string[];
  profileVisibility?: 'visible' | 'private';
  allowRecruiterContact?: boolean;
  skills?: string[];
  noticePeriod?: string;
  currentOrg?: string;
  currentDesignation?: string;
  location?: string;
  linkedin?: string;
  experiences?: any[];
  appliedJob?: string;
  // Recruiter-added fields
  gender?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  isFresher?: boolean;
  totalExperienceYears?: number;
  totalExperienceMonths?: number;
  highestQualification?: string;
  currentCtc?: string;
  expectedCtc?: string;
  ctcType?: string;
  ctcCurrency?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  source?: string;
  sourceRemark?: string;
  recruiterNotes?: string;
  businessUnit?: string;
  recordOwner?: string;
  targetRole?: string;
  addedByRecruiter?: boolean;
  addedAt?: string;
  lastLoginAt?: string;
  createdBy?: string;
  modifiedBy?: string;
  availabilityStatus?: TalentAvailabilityStatus;
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  status:
    | 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview in Progress' | 'Active'
    | 'On Hold' | 'Future'
    | 'Offered' | 'Offer Accepted'
    | 'Selected' | 'Rejected' | 'Cancelled' | 'Withdrawn' | 'Joined' | 'Offer Declined'
    | 'Not Joined' | 'Archived' | 'Offer Revoked' | 'No Show';
  exitedAfterStage?: number;
  archiveRemark?: string;
  appliedAt: string;
  answers: Record<string, any>;
  resumeUrl: string;
}

export interface PortalAppearance {
  /** Portal/company name — system-set, shown in header, greeting and footer */
  portalName: string;
  /** Short welcome sub-line shown under the greeting */
  tagline: string;
  /** Single brand colour (hex) — drives primary buttons */
  brandColor: string;
  /** Whether the hero banner (between greeting and filters) is shown */
  heroEnabled: boolean;
  /** Hero banner image as a data URL; shown only when heroEnabled is true */
  heroImageUrl: string;
}

export interface PortalConfig {
  termsUrl: string;
  privacyPolicyUrl: string;
  appearance: PortalAppearance;
}

export interface AppState {
  jobs: Job[];
  candidates: Candidate[];
  applications: Application[];
  invites: TalentInvite[];
  currentUser: Candidate | null;
  alumniVerified: {
    verified: boolean;
    email: string | null;
  };
  portalConfig: PortalConfig;
}
