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
      skills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'Tailwind CSS'],
      salaryRange: { min: '6', max: '10', currency: '₹', type: 'Annual' },
      description: "As a React Developer at Yopmails, you'll build high-performance web applications serving millions. You'll work with TypeScript, modern state management, and reusable component libraries.",
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [
        { id: '1', label: 'Portfolio URL', type: 'Text', required: true },
        { id: '2', label: 'Are you open to relocate?', type: 'Yes/No', required: false }
      ],
      evaluationCriteria: [
        "Proven React experience with component architecture.",
        "Mastery of ES6+, TypeScript, and Tailwind CSS.",
        "Expertise in Redux or Zustand state management."
      ],
      createdAt: new Date().toISOString(),
      targetDate: '2026-03-30'
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
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
      salaryRange: { min: '8', max: '12', currency: '₹', type: 'Annual' },
      description: "Join our design team to craft intuitive user journeys. You'll bridge the gap between user needs and technical implementation through rapid prototyping.",
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [{ id: '3', label: 'Behance/Dribbble Link', type: 'Text', required: true }],
      evaluationCriteria: ["Portfolio showcasing complex UX flows.", "Advanced Figma prototyping skills."],
      createdAt: new Date().toISOString(),
      targetDate: '2026-04-15'
    },
    {
      id: 'd3',
      title: 'Node.js Backend Engineer',
      businessUnit: 'Yopmails',
      recruiter: 'James Wilson',
      location: 'Ahmedabad',
      experience: '4+ Years Experience',
      employmentType: 'Full-time',
      jobType: 'In-office',
      skills: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
      salaryRange: { min: '12', max: '18', currency: '₹', type: 'Annual' },
      description: "Scale our real-time messaging systems. You'll optimize database queries and build resilient microservices.",
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [{ id: '4', label: 'GitHub Profile', type: 'Text', required: true }],
      evaluationCriteria: ["Expertise in Node.js and distributed systems.", "Strong SQL optimization skills."],
      createdAt: new Date().toISOString(),
      targetDate: '2026-04-10'
    },
    {
      id: 'd4',
      title: 'Product Manager',
      businessUnit: 'Yopmails',
      recruiter: 'Lisa Ray',
      location: 'Ahmedabad',
      experience: '5+ Years Experience',
      employmentType: 'Full-time',
      jobType: 'Hybrid',
      skills: ['Agile', 'Market Research', 'Jira', 'Product Roadmap', 'Analytics'],
      salaryRange: { min: '15', max: '22', currency: '₹', type: 'Annual' },
      description: "Drive the vision for our core email products. You'll work with engineering and marketing to launch high-impact features.",
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [],
      evaluationCriteria: ["Experience launching SaaS products.", "Exceptional stakeholder management."],
      createdAt: new Date().toISOString(),
      targetDate: '2026-04-20'
    },
    {
      id: 'd5',
      title: 'DevOps Engineer',
      businessUnit: 'Yopmails',
      recruiter: 'David Kim',
      location: 'Remote',
      experience: '3+ Years Experience',
      employmentType: 'Full-time',
      jobType: 'Remote',
      skills: ['Kubernetes', 'Terraform', 'CI/CD', 'AWS', 'Python'],
      salaryRange: { min: '14', max: '20', currency: '₹', type: 'Annual' },
      description: "Automate everything. You'll maintain our global cloud infrastructure and ensure 99.9% availability.",
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [],
      evaluationCriteria: ["Advanced K8s orchestration knowledge.", "Proficiency in Infrastructure as Code."],
      createdAt: new Date().toISOString(),
      targetDate: '2026-04-05'
    },
    {
      id: 'd6',
      title: 'Mobile Developer (React Native)',
      businessUnit: 'Yopmails',
      recruiter: 'Sarah Chen',
      location: 'Ahmedabad',
      experience: '3+ Years Experience',
      employmentType: 'Full-time',
      jobType: 'Hybrid',
      skills: ['React Native', 'Firebase', 'Swift', 'Kotlin', 'Mobile UI'],
      salaryRange: { min: '10', max: '16', currency: '₹', type: 'Annual' },
      description: "Build our flagship mobile app. You'll create smooth, native-like experiences for iOS and Android.",
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [{ id: '5', label: 'Link to App Store app', type: 'Text', required: false }],
      evaluationCriteria: ["Published RN apps on both stores.", "Knowledge of native bridging."],
      createdAt: new Date().toISOString(),
      targetDate: '2026-04-12'
    },
    {
      id: 'd7',
      title: 'Quality Assurance Lead',
      businessUnit: 'Yopmails',
      recruiter: 'Michael Park',
      location: 'Ahmedabad',
      experience: '5+ Years Experience',
      employmentType: 'Full-time',
      jobType: 'In-office',
      skills: ['Selenium', 'Cypress', 'Automation', 'API Testing', 'Team Lead'],
      salaryRange: { min: '12', max: '15', currency: '₹', type: 'Annual' },
      description: "Define our testing strategy. You'll lead a team of QA engineers to ensure flawless product releases.",
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [],
      evaluationCriteria: ["Experience setting up automation frameworks.", "Leadership background."],
      createdAt: new Date().toISOString(),
      targetDate: '2026-03-25'
    },
    {
      id: 'd8',
      title: 'Data Scientist',
      businessUnit: 'Yopmails',
      recruiter: 'James Wilson',
      location: 'Remote',
      experience: '4+ Years Experience',
      employmentType: 'Full-time',
      jobType: 'Remote',
      skills: ['Python', 'PyTorch', 'SQL', 'NLP', 'Data Visualization'],
      salaryRange: { min: '18', max: '25', currency: '₹', type: 'Annual' },
      description: "Unlock insights from trillions of data points. You'll build models to predict user churn and optimize server load.",
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [{ id: '6', label: 'Kaggle Profile Link', type: 'Text', required: false }],
      evaluationCriteria: ["Mastery of machine learning algorithms.", "Experience with large-scale data processing."],
      createdAt: new Date().toISOString(),
      targetDate: '2026-04-30'
    }
  ],
  candidates: [],
  applications: [],
  currentUser: null,
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

      return { ...parsed, jobs: mergedJobs };
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
