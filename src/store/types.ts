export type FieldType = 'Text' | 'Number' | 'Dropdown' | 'Date' | 'File Upload' | 'Yes/No';

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
  isAlumni: boolean;
  alumniEmail?: string;
  savedJobIds?: string[];
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

export interface AppState {
  jobs: Job[];
  candidates: Candidate[];
  applications: Application[];
  currentUser: Candidate | null;
  alumniVerified: {
    verified: boolean;
    email: string | null;
  };
}
