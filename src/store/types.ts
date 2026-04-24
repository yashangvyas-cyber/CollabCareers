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
  recruiterNotes?: string;
  businessUnit?: string;
  recordOwner?: string;
  targetRole?: string;
  addedByRecruiter?: boolean;
  addedAt?: string;
  availabilityStatus?: TalentAvailabilityStatus;
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Interview in Progress' | 'Decision Made' | 'Offer Made' | 'Rejected' | 'Withdrawn';
  appliedAt: string;
  answers: Record<string, any>;
  resumeUrl: string;
}

export interface PortalConfig {
  termsUrl: string;
  privacyPolicyUrl: string;
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
