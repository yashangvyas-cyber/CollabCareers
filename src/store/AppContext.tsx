import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Job, Candidate, Application, PortalConfig, TalentInvite, TalentInviteStatus, TalentAvailabilityStatus } from './types';

interface AppContextType extends AppState {
  addJob: (job: Job) => void;
  addCandidate: (candidate: Candidate) => void;
  registerCandidate: (candidate: Candidate) => void;
  loginCandidate: (email: string) => void;
  logoutCandidate: () => void;
  updateCurrentUser: (updates: Partial<Candidate>) => void;
  submitApplication: (application: Application) => void;
  saveDraft: (application: Application) => void;
  setAlumniVerified: (verified: boolean, email: string | null) => void;
  toggleSaveJob: (jobId: string) => void;
  withdrawApplication: (applicationId: string) => void;
  updatePortalConfig: (updates: Partial<PortalConfig>) => void;
  sendInvite: (invite: TalentInvite) => void;
  updateInviteStatus: (inviteId: string, status: TalentInviteStatus) => void;
  updateCandidateAvailability: (candidateId: string, status: TalentAvailabilityStatus) => void;
}

const STORAGE_KEY = 'collab_careers_state_v2';

const initialState: AppState = {
  jobs: [
    {
      id: 'd1',
      title: 'React Developer',
      businessUnit: 'MindInventory',
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
      description: `We are looking for an experienced React Developer to join our frontend team and help build high-performance, scalable web applications. You will work closely with product managers, designers, and backend engineers to deliver polished, accessible user experiences.

What you'll do:
• Build and maintain responsive, high-performance React applications
• Collaborate with designers to implement pixel-perfect, accessible UI components
• Write clean, reusable component libraries with TypeScript
• Optimise application performance through profiling, lazy loading, and code-splitting
• Participate in code reviews and contribute to engineering best practices

What you'll bring:
• 2+ years of commercial experience with React and the broader JavaScript ecosystem
• Strong proficiency in TypeScript, HTML5, and modern CSS
• Experience with state management libraries (Redux, Zustand, or React Query)
• Familiarity with modern tooling — Vite, ESLint, Prettier
• Comfortable working in fast-paced, agile cross-functional teams

Why MindInventory:
We build tools used by thousands of teams. Our frontend squad is small, collaborative, and obsessed with quality. You will have genuine ownership over product decisions and a clear path to grow into senior engineering roles.`
    },
    {
      id: 'd2',
      title: 'UI/UX Designer',
      businessUnit: '300Mind',
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
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      description: `We are looking for a talented UI/UX Designer to join our product design team. You will be the voice of the user in every product decision — crafting interfaces that are both beautiful and intuitive, and ensuring design quality from concept to shipped code.

What you'll do:
• Own the end-to-end design process — from discovery and wireframes to high-fidelity prototypes
• Build and maintain a scalable, consistent design system in Figma
• Conduct user research and usability tests, synthesising insights into actionable design decisions
• Partner closely with engineering to ensure implementation quality and fidelity
• Advocate for accessibility and inclusive design practices across all products

What you'll bring:
• 2+ years of product design experience in a technology environment
• Mastery of Figma, including components, variables, and auto-layout
• A portfolio demonstrating both strong visual craft and deep UX thinking
• Ability to clearly articulate and justify every design decision to stakeholders

Why MindInventory:
Design is a first-class citizen at MindInventory. You will work on products that touch real users every day, with the latitude to set the design direction end-to-end and see your work ship within weeks.`
    },
    {
      id: 'd3',
      title: 'Flutter Developer',
      businessUnit: 'MindInventory',
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
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      description: `We are looking for a Flutter Developer to help us deliver seamless mobile experiences across iOS and Android from a single codebase. You will work on consumer-facing features used daily by our growing user base, with direct ownership from design handoff to App Store release.

What you'll do:
• Design, build, and maintain cross-platform mobile applications using Flutter and Dart
• Integrate RESTful APIs and Firebase services into the application layer
• Ensure smooth 60fps animations and responsive layouts across a wide range of device sizes
• Write unit and widget tests to ensure code reliability and prevent regressions
• Collaborate in two-week sprints with daily standups, demos, and retrospectives

What you'll bring:
• 1+ years of commercial Flutter development experience
• Solid understanding of Dart and Flutter's widget and state lifecycle
• Experience with Firebase (Auth, Firestore, Cloud Storage) strongly preferred
• Familiarity with App Store and Google Play submission and review processes

Why MindInventory:
Ship fast, learn faster. Our mobile team is small and the codebase is well-maintained — you will have end-to-end ownership of features from day one, with experienced mentors to support your growth.`
    },
    {
      id: 'd4',
      title: 'Project Manager',
      businessUnit: 'CollabCRM',
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
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      description: `We are looking for a seasoned Project Manager to lead cross-functional initiatives from ideation to delivery. You will be the connective tissue between business stakeholders, engineering, and design — ensuring we build the right things, the right way, on time.

What you'll do:
• Define project scope, milestones, and success metrics in collaboration with stakeholders
• Run agile ceremonies — sprint planning, standups, retrospectives, and stakeholder demos
• Proactively identify and mitigate risks before they become delivery blockers
• Maintain clear, consistent communication of project status and decisions to all levels
• Continuously improve team delivery processes, tooling, and documentation standards

What you'll bring:
• 5+ years of project management experience in a software product environment
• Hands-on experience facilitating Agile and Kanban methodologies
• Proficiency in Jira, Confluence, and project tracking tools
• Strong written and verbal communication — you can distil complex situations clearly
• Agile, Scrum Master, or PMP certification is a plus

Why MindInventory:
We run lean and ship often. As a PM here, your decisions have direct product impact — no layers of bureaucracy, just you, the team, and the problem to solve. You will work with engineers who care deeply about delivery quality.`
    },
    {
      id: 'd5',
      title: 'Business Analyst',
      businessUnit: '300Mind',
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
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      description: 'Bridging the gap between business needs and technical solutions.'
    },
    {
      id: 'd6',
      title: 'Node.js Backend Engineer',
      businessUnit: 'MindInventory',
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
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      description: 'Build scalable backend services for our applications.'
    },
    {
      id: 'd7',
      title: 'DevOps Engineer',
      businessUnit: 'MindInventory',
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
      createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
      description: 'Cloud infrastructure management and CI/CD pipelines.'
    },
    {
      id: 'd8',
      title: 'QA Engineer',
      businessUnit: 'CollabCRM',
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
      createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      description: 'Ensure software quality through automated and manual testing.'
    },
    {
      id: 'd9',
      title: 'Product Designer',
      businessUnit: '300Mind',
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
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      description: 'Drive product vision through design.'
    },
    {
      id: 'd10',
      title: 'Data Analyst',
      businessUnit: '300Mind',
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
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      description: 'Translate raw data into actionable insights.'
    },
    {
      id: 'd11',
      title: 'iOS Developer',
      businessUnit: 'CollabCRM',
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
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      description: 'Build native iOS applications with Swift.'
    },
    {
      id: 'd12',
      title: 'Android Developer',
      businessUnit: 'CollabCRM',
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
      createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
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
      isAlumni: false,
      profileVisibility: 'private' as const,
    },
    {
      id: 'c2',
      firstName: 'Riya',
      lastName: 'Desai',
      email: 'riya.desai@example.com',
      phone: '+91 87654 32109',
      isAlumni: false,
      profileVisibility: 'visible' as const,
      allowRecruiterContact: true,
      currentOrg: 'Infosys',
      currentDesignation: 'Frontend Engineer',
      noticePeriod: '30 days',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
      location: 'Pune, India',
      linkedin: 'linkedin.com/in/riyadesai',
      availabilityStatus: 'Open to Good Offers' as const,
    },
    {
      id: 'c3',
      firstName: 'Karan',
      lastName: 'Mehta',
      email: 'karan.mehta@example.com',
      phone: '+91 76543 21098',
      isAlumni: false,
      profileVisibility: 'visible' as const,
      allowRecruiterContact: true,
      currentOrg: 'Wipro',
      currentDesignation: 'Product Manager',
      noticePeriod: '60 days',
      skills: ['Product Strategy', 'Agile', 'SQL', 'Figma'],
      location: 'Bangalore, India',
      linkedin: 'linkedin.com/in/karanmehta',
      availabilityStatus: 'Not Interested' as const,
    },
    {
      id: 'c4',
      firstName: 'Ananya',
      lastName: 'Sharma',
      email: 'ananya.s@example.com',
      phone: '+91 65432 10987',
      isAlumni: true,
      alumniEmail: 'ananya@yopmails.com',
      profileVisibility: 'visible' as const,
      allowRecruiterContact: true,
      currentOrg: 'Accenture',
      currentDesignation: 'UX Designer',
      noticePeriod: 'Immediate',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      location: 'Mumbai, India',
      linkedin: 'linkedin.com/in/ananyasharma',
      availabilityStatus: 'Immediate Joiner' as const,
    },
    {
      id: 'c5',
      firstName: 'Vikram',
      lastName: 'Nair',
      email: 'vikram.nair@example.com',
      phone: '+91 99887 76655',
      isAlumni: false,
      profileVisibility: 'visible' as const,
      allowRecruiterContact: false,
      currentOrg: 'TCS',
      currentDesignation: 'Senior Backend Engineer',
      noticePeriod: '90 days',
      skills: ['Java', 'Spring Boot', 'Microservices', 'AWS'],
      location: 'Hyderabad, India',
      linkedin: 'linkedin.com/in/vikramnair',
      availabilityStatus: 'Serving Notice Period' as const,
    },
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
    },
    // Riya Desai (c2) — 3 applications, different statuses
    {
      id: 'a6',
      candidateId: 'c2',
      jobId: 'd1', // React Developer
      status: 'Under Review',
      appliedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      answers: { _fullFormData: { personal: { contactNumber: '+91 87654 32109' } } },
      resumeUrl: 'Riya_Desai_Resume.pdf'
    },
    {
      id: 'a7',
      candidateId: 'c2',
      jobId: 'd6', // Node.js Backend Engineer
      status: 'Interview in Progress',
      appliedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      answers: { _fullFormData: { personal: { contactNumber: '+91 87654 32109' } } },
      resumeUrl: 'Riya_Desai_Resume.pdf'
    },
    {
      id: 'a8',
      candidateId: 'c2',
      jobId: 'd11', // iOS Developer
      status: 'Rejected',
      appliedAt: new Date(Date.now() - 86400000 * 25).toISOString(),
      answers: { _fullFormData: { personal: { contactNumber: '+91 87654 32109' } } },
      resumeUrl: 'Riya_Desai_Resume.pdf'
    },
    // Karan Mehta (c3) — 1 application
    {
      id: 'a9',
      candidateId: 'c3',
      jobId: 'd4', // Project Manager
      status: 'Decision Made',
      appliedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      answers: { _fullFormData: { personal: { contactNumber: '+91 76543 21098' } } },
      resumeUrl: 'Karan_Mehta_Resume.pdf'
    },
    // Ananya Sharma (c4) — no applications (empty state demo)
  ],
  invites: [
    // Riya Desai (c2) — invited for Node.js role, she said Interested
    {
      id: 'inv1',
      candidateId: 'c2',
      jobId: 'd6',
      jobTitle: 'Node.js Backend Engineer',
      sentAt: new Date(Date.now() - 86400000 * 8).toISOString(),
      sentBy: 'Sarah Chen',
      status: 'Interested' as const,
      emailMode: 'template' as const,
    },
    // Karan Mehta (c3) — invited for Project Manager, no response yet
    {
      id: 'inv2',
      candidateId: 'c3',
      jobId: 'd4',
      jobTitle: 'Project Manager',
      sentAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      sentBy: 'Lisa Ray',
      status: 'Sent' as const,
      emailMode: 'template' as const,
    },
    // Ananya Sharma (c4) — invited for UI/UX Designer, she declined
    {
      id: 'inv3',
      candidateId: 'c4',
      jobId: 'd2',
      jobTitle: 'UI/UX Designer',
      sentAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      sentBy: 'Michael Park',
      status: 'Not Interested' as const,
      emailMode: 'custom' as const,
    },
  ],
  currentUser: null,
  alumniVerified: {
    verified: false,
    email: null,
  },
  portalConfig: {
    termsUrl: '',
    privacyPolicyUrl: '',
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

      // Ensure mock applications are present — keep their original candidateIds (do NOT override to currentUser)
      const currentApps = parsed.applications || [];
      const mergedApps = [...currentApps];

      initialState.applications.forEach(defaultApp => {
        const existingIdx = mergedApps.findIndex(a => a.id === defaultApp.id);
        if (existingIdx === -1) {
          mergedApps.push(defaultApp); // preserve original candidateId
        }
        // Don't overwrite existing apps — user may have updated them in session
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

      // Ensure mock invites are present
      const currentInvites = parsed.invites || [];
      const mergedInvites = [...currentInvites];
      initialState.invites.forEach(defaultInvite => {
        if (!mergedInvites.find(i => i.id === defaultInvite.id)) {
          mergedInvites.push(defaultInvite);
        }
      });

      return {
        ...parsed,
        jobs: mergedJobs,
        applications: mergedApps,
        candidates: mergedCandidates,
        invites: mergedInvites,
        portalConfig: parsed.portalConfig ?? initialState.portalConfig,
      };
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

  const addCandidate = (candidate: Candidate) => {
    setState(prev => ({
      ...prev,
      candidates: [...prev.candidates.filter(c => c.email !== candidate.email), candidate],
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

  const updateCurrentUser = (updates: Partial<Candidate>) => {
    if (!state.currentUser) return;
    setState(prev => {
      const updated = { ...prev.currentUser!, ...updates };
      return {
        ...prev,
        currentUser: updated,
        candidates: prev.candidates.map(c => c.id === updated.id ? updated : c),
      };
    });
  };

  const updatePortalConfig = (updates: Partial<PortalConfig>) => {
    setState(prev => ({
      ...prev,
      portalConfig: { ...prev.portalConfig, ...updates },
    }));
  };

  const sendInvite = (invite: TalentInvite) => {
    setState(prev => ({
      ...prev,
      invites: [...prev.invites, invite],
    }));
  };

  const updateInviteStatus = (inviteId: string, status: TalentInviteStatus) => {
    setState(prev => ({
      ...prev,
      invites: prev.invites.map(i => i.id === inviteId ? { ...i, status } : i),
    }));
  };

  const updateCandidateAvailability = (candidateId: string, status: TalentAvailabilityStatus) => {
    setState(prev => ({
      ...prev,
      candidates: prev.candidates.map(c => c.id === candidateId ? { ...c, availabilityStatus: status } : c),
    }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        addJob,
        addCandidate,
        registerCandidate,
        loginCandidate,
        logoutCandidate,
        updateCurrentUser,
        submitApplication,
        saveDraft,
        setAlumniVerified,
        toggleSaveJob,
        withdrawApplication,
        updatePortalConfig,
        sendInvite,
        updateInviteStatus,
        updateCandidateAvailability,
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
