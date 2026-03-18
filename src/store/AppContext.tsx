import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Job, Candidate, Application } from './types';

interface AppContextType extends AppState {
  addJob: (job: Job) => void;
  registerCandidate: (candidate: Candidate) => void;
  loginCandidate: (email: string) => void;
  logoutCandidate: () => void;
  submitApplication: (application: Application) => void;
  saveDraft: (application: Application) => void;
  setAlumniVerified: (verified: boolean, email: string | null) => void;
  toggleSaveJob: (jobId: string) => void;
  withdrawApplication: (applicationId: string) => void;
}

const STORAGE_KEY = 'collab_careers_state';

const initialState: AppState = {
  jobs: [
    {
      id: 'd1',
      title: 'React Developer',
      businessUnit: 'Yopmails',
      recruiter: 'Sarah Chen',
      location: 'Ahmedabad',
      experience: '2+ Years Experience',
      employmentType: 'Full-time',
      jobType: 'On-site',
      skills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS'],
      salaryRange: { min: '8', max: '14', currency: '₹', type: 'Annual' },
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [{ id: '1', label: 'Portfolio URL', type: 'Text', required: true }],
      evaluationCriteria: ['React expert', 'UI skills'],
      createdAt: new Date().toISOString(),
      description: 'Expert React developer needed for performance-critical web applications.'
    },
    {
      id: 'd2',
      title: 'UI/UX Designer',
      businessUnit: 'Yopmails',
      recruiter: 'Michael Park',
      location: 'Remote',
      experience: '2+ Years Experience',
      employmentType: 'Full-time',
      jobType: 'Remote',
      skills: ['Figma', 'Design Systems', 'Prototyping'],
      salaryRange: { min: '10', max: '16', currency: '₹', type: 'Annual' },
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [{ id: '2', label: 'Behance link', type: 'Text', required: true }],
      evaluationCriteria: ['Design systems mastery'],
      createdAt: new Date().toISOString(),
      description: 'Join our design team to build consistent user experiences.'
    },
    {
      id: 'd3',
      title: 'Flutter Developer',
      businessUnit: 'Yopmails',
      recruiter: 'James Wilson',
      location: 'Remote',
      experience: '1+ Years Experience',
      employmentType: 'Full-time',
      jobType: 'Remote',
      skills: ['Dart', 'Firebase', 'Flutter'],
      salaryRange: { min: '6', max: '12', currency: '₹', type: 'Annual' },
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [],
      evaluationCriteria: ['App store delivery experience'],
      createdAt: new Date().toISOString(),
      description: 'Build cross-platform mobile apps using Flutter.'
    },
    {
      id: 'd4',
      title: 'Project Manager',
      businessUnit: 'Yopmails',
      recruiter: 'Lisa Ray',
      location: 'Ahmedabad',
      experience: '5+ Years Experience',
      employmentType: 'Full-time',
      jobType: 'Hybrid',
      skills: ['Agile', 'Jira', 'Kanban'],
      salaryRange: { min: '18', max: '25', currency: '₹', type: 'Annual' },
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [],
      evaluationCriteria: ['Agile certification'],
      createdAt: new Date().toISOString(),
      description: 'Lead high-impact projects from ideation to delivery.'
    },
    {
      id: 'd5',
      title: 'Business Analyst',
      businessUnit: 'Yopmails',
      recruiter: 'David Kim',
      location: 'Ahmedabad',
      experience: '2+ Years Experience',
      employmentType: 'Full-time',
      jobType: 'On-site',
      skills: ['SQL', 'Tableau', 'Requirement Gathering'],
      salaryRange: { min: '8', max: '12', currency: '₹', type: 'Annual' },
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [],
      evaluationCriteria: ['Analytical thinking'],
      createdAt: new Date().toISOString(),
      description: 'Bridging the gap between business needs and technical solutions.'
    },
    {
      id: 'd6',
      title: 'Node.js Backend Engineer',
      businessUnit: 'Yopmails',
      recruiter: 'James Wilson',
      location: 'Remote',
      experience: '3+ Years Experience',
      employmentType: 'Full-time',
      jobType: 'Remote',
      skills: ['Node.js', 'MongoDB', 'Express'],
      salaryRange: { min: '14', max: '20', currency: '₹', type: 'Annual' },
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [],
      evaluationCriteria: ['System architecture skills'],
      createdAt: new Date().toISOString(),
      description: 'Build scalable backend services for our applications.'
    },
    {
      id: 'd7',
      title: 'DevOps Engineer',
      businessUnit: 'Yopmails',
      recruiter: 'Michael Park',
      location: 'Remote',
      experience: '4+ Years Experience',
      employmentType: 'Contract',
      jobType: 'Remote',
      skills: ['AWS', 'Docker', 'Kubernetes'],
      salaryRange: { min: '1500', max: '2500', currency: '₹', type: 'Weekly' },
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [],
      evaluationCriteria: ['Infrastructure automation experience'],
      createdAt: new Date().toISOString(),
      description: 'Cloud infrastructure management and CI/CD pipelines.'
    },
    {
      id: 'd8',
      title: 'QA Engineer',
      businessUnit: 'Yopmails',
      recruiter: 'Sarah Chen',
      location: 'Ahmedabad',
      experience: '1+ Years Experience',
      employmentType: 'Full-time',
      jobType: 'On-site',
      skills: ['Selenium', 'JIRA', 'Manual Testing'],
      salaryRange: { min: '5', max: '8', currency: '₹', type: 'Annual' },
      status: 'Close',
      publishOnCollabCareers: true,
      customFields: [],
      evaluationCriteria: ['Bug detection skills'],
      createdAt: new Date().toISOString(),
      description: 'Ensure software quality through automated and manual testing.'
    },
    {
      id: 'd9',
      title: 'Product Designer',
      businessUnit: 'Yopmails',
      recruiter: 'Lisa Ray',
      location: 'Remote',
      experience: '3+ Years Experience',
      employmentType: 'Full-time',
      jobType: 'Remote',
      skills: ['Figma', 'Prototyping', 'User Interviews'],
      salaryRange: { min: '12', max: '18', currency: '₹', type: 'Annual' },
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [],
      evaluationCriteria: ['Case studies quality'],
      createdAt: new Date().toISOString(),
      description: 'Drive product vision through design.'
    },
    {
      id: 'd10',
      title: 'Data Analyst',
      businessUnit: 'Yopmails',
      recruiter: 'David Kim',
      location: 'Ahmedabad',
      experience: '2+ Years Experience',
      employmentType: 'Full-time',
      jobType: 'On-site',
      skills: ['Python', 'SQL', 'Pandas'],
      salaryRange: { min: '7', max: '11', currency: '₹', type: 'Annual' },
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [],
      evaluationCriteria: ['Data manipulation proficiency'],
      createdAt: new Date().toISOString(),
      description: 'Translate raw data into actionable insights.'
    },
    {
      id: 'd11',
      title: 'iOS Developer',
      businessUnit: 'Yopmails',
      recruiter: 'Sarah Chen',
      location: 'Remote',
      experience: '2+ Years Experience',
      employmentType: 'Full-time',
      jobType: 'Remote',
      skills: ['Swift', 'Xcode', 'Combine'],
      salaryRange: { min: '12', max: '18', currency: '₹', type: 'Annual' },
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [],
      evaluationCriteria: ['iOS application lifecycle mastery'],
      createdAt: new Date().toISOString(),
      description: 'Build native iOS applications with Swift.'
    },
    {
      id: 'd12',
      title: 'Android Developer',
      businessUnit: 'Yopmails',
      recruiter: 'Michael Park',
      location: 'Remote',
      experience: '2+ Years Experience',
      employmentType: 'Full-time',
      jobType: 'Remote',
      skills: ['Kotlin', 'Android SDK', 'Jetpack Compose'],
      salaryRange: { min: '12', max: '18', currency: '₹', type: 'Annual' },
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [],
      evaluationCriteria: ['Android architecture components knowledge'],
      createdAt: new Date().toISOString(),
      description: 'Build robust native Android apps.'
    }
  ],
  candidates: [
    {
      id: 'c1',
      firstName: 'Alex',
      lastName: 'Patel',
      email: 'alex.patel@example.com',
      phone: '+91 98765 43210',
      isAlumni: false
    }
  ],
  applications: [
    {
      id: 'a1',
      candidateId: 'c1',
      jobId: 'd1',
      status: 'Under Review',
      appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      answers: { 
        _fullFormData: { 
          personal: { contactNumber: '+91 98765 43210', linkedin: 'linkedin.com/in/alexpatel' }, 
          address: { address: '402, Skyline Apartments, Satellite', city: 'Ahmedabad', country: 'India' }, 
          professional: { currentOrg: 'TechSolutions Inc.', currentDesignation: 'Senior Frontend Engineer', skills: ['React', 'TypeScript', 'Tailwind CSS'] },
          salary: { ctcType: 'Annual', currency: 'INR (₹)', currentCtc: '18,50,000', expectedCtc: '24,00,000' }
        } 
      },
      resumeUrl: 'Alex_Patel_Resume.pdf'
    },
    {
      id: 'a2',
      candidateId: 'c1',
      jobId: 'd2',
      status: 'Interview in Progress',
      appliedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      answers: { _fullFormData: { personal: { contactNumber: '+91 98765 43210' }, address: { city: 'Ahmedabad', country: 'India' }, professional: { currentDesignation: 'Senior Developer' } } },
      resumeUrl: 'Alex_Patel_Resume.pdf'
    },
    {
      id: 'a3',
      candidateId: 'c1',
      jobId: 'd4',
      status: 'Decision Made',
      appliedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      answers: { _fullFormData: { personal: { contactNumber: '+91 98765 43210' }, address: { city: 'Ahmedabad', country: 'India' } } },
      resumeUrl: 'Alex_Patel_Resume.pdf'
    },
    {
      id: 'a4',
      candidateId: 'c1',
      jobId: 'd5',
      status: 'Draft',
      appliedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      answers: { _fullFormData: { personal: { contactNumber: '+91 98765 43210' } } },
      resumeUrl: 'Alex_Patel_Resume.pdf'
    },
    {
      id: 'a5',
      candidateId: 'c1',
      jobId: 'd8', // QA Engineer
      status: 'Submitted',
      appliedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      answers: { _fullFormData: { personal: { contactNumber: '+91 98765 43210' } } },
      resumeUrl: 'Alex_Patel_Resume.pdf'
    }
  ],
  currentUser: {
    id: 'c1',
    firstName: 'Alex',
    lastName: 'Patel',
    email: 'alex.patel@example.com',
    phone: '+91 98765 43210',
    isAlumni: false
  },
  alumniVerified: {
    verified: false,
    email: null,
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all 8 default jobs are present and up-to-date (by ID)
      const currentJobs = parsed.jobs || [];
      const mergedJobs = [...currentJobs];
      
      initialState.jobs.forEach(defaultJob => {
        const existingIdx = mergedJobs.findIndex(j => j.id === defaultJob.id);
        if (existingIdx === -1) {
          mergedJobs.push(defaultJob);
        } else {
          // Always overwrite default jobs (d1-d8) to ensure they have the latest fields
          mergedJobs[existingIdx] = defaultJob;
        }
      });

      // Ensure mock applications are present and linked to the actual current user ID
      const currentApps = parsed.applications || [];
      const mergedApps = [...currentApps];
      const actualCandidateId = parsed.currentUser?.id || 'c1';

      initialState.applications.forEach(defaultApp => {
        const appToMerge = { ...defaultApp, candidateId: actualCandidateId };
        const existingIdx = mergedApps.findIndex(a => a.id === appToMerge.id);
        if (existingIdx === -1) {
          mergedApps.push(appToMerge);
        } else {
          mergedApps[existingIdx] = appToMerge;
        }
      });

      // Ensure mock candidate is present
      const currentCandidates = parsed.candidates || [];
      const mergedCandidates = [...currentCandidates];
      initialState.candidates.forEach(defaultCandidate => {
        const existingIdx = mergedCandidates.findIndex(c => c.id === defaultCandidate.id || c.email === defaultCandidate.email);
        if (existingIdx === -1) {
          mergedCandidates.push(defaultCandidate);
        } else {
          mergedCandidates[existingIdx] = { ...mergedCandidates[existingIdx], ...defaultCandidate };
        }
      });

      return { ...parsed, jobs: mergedJobs, applications: mergedApps, candidates: mergedCandidates };
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addJob = (job: Job) => {
    setState(prev => ({
      ...prev,
      jobs: [...prev.jobs.filter(j => j.id !== job.id), job],
    }));
  };

  const registerCandidate = (candidate: Candidate) => {
    setState(prev => ({
      ...prev,
      candidates: [...prev.candidates.filter(c => c.email !== candidate.email), candidate],
      currentUser: candidate,
    }));
  };

  const loginCandidate = (email: string) => {
    const candidate = state.candidates.find(c => c.email === email);
    if (candidate) {
      setState(prev => ({ ...prev, currentUser: candidate }));
    }
  };

  const logoutCandidate = () => {
    setState(prev => ({ ...prev, currentUser: null, alumniVerified: { verified: false, email: null } }));
  };

  const submitApplication = (app: Application) => {
    setState(prev => ({
      ...prev,
      applications: [...prev.applications.filter(a => !(a.jobId === app.jobId && a.candidateId === app.candidateId && a.status === 'Draft')), app],
    }));
  };

  const saveDraft = (app: Application) => {
    setState(prev => ({
      ...prev,
      applications: [...prev.applications.filter(a => !(a.jobId === app.jobId && a.candidateId === app.candidateId && a.status === 'Draft')), app],
    }));
  };

  const setAlumniVerified = (verified: boolean, email: string | null) => {
    setState(prev => ({
      ...prev,
      alumniVerified: { verified, email },
    }));
  };
  
  const toggleSaveJob = (jobId: string) => {
    if (!state.currentUser) return;
    
    setState(prev => {
      const currentSavedIds = prev.currentUser?.savedJobIds || [];
      const newSavedIds = currentSavedIds.includes(jobId)
        ? currentSavedIds.filter(id => id !== jobId)
        : [...currentSavedIds, jobId];
      
      const updatedUser = { ...prev.currentUser!, savedJobIds: newSavedIds };
      
      return {
        ...prev,
        currentUser: updatedUser,
        candidates: prev.candidates.map(c => c.id === updatedUser.id ? updatedUser : c)
      };
    });
  };

  const withdrawApplication = (id: string) => {
    setState(prev => ({
      ...prev,
      applications: prev.applications.map(a => a.id === id ? { ...a, status: 'Withdrawn' } : a)
    }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        addJob,
        registerCandidate,
        loginCandidate,
        logoutCandidate,
        submitApplication,
        saveDraft,
        setAlumniVerified,
        toggleSaveJob,
        withdrawApplication,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
