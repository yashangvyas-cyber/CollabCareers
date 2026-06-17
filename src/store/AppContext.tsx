import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Job, Candidate, Application, PortalConfig, TalentInvite, TalentInviteStatus, TalentAvailabilityStatus } from './types';
import { DEFAULT_APPEARANCE } from '../lib/theme';

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
  blacklistCandidate: (candidateId: string, reason: string) => void;
  discardCandidate: (candidateId: string, reason: string) => void;
}

const STORAGE_KEY = 'collab_careers_state_v16';

const initialState: AppState = {
  jobs: [
    {
      id: 'd1',
      category: 'Engineering',
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
      customFields: [
        { id: 'd1_q1', label: 'Portfolio / GitHub URL', type: 'Text', required: true },
        { id: 'd1_q2', label: 'Years of React Experience', type: 'Number', required: true },
        { id: 'd1_q3', label: 'Are you open to relocate?', type: 'Yes/No', required: false },
        { id: 'd1_q4', label: 'Preferred Work Mode', type: 'Dropdown', required: true, options: [{ id: 'wm1', value: 'Remote' }, { id: 'wm2', value: 'On-site' }, { id: 'wm3', value: 'Hybrid' }] },
      ],
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
      category: 'Design',
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
      category: 'Engineering',
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
      category: 'Management',
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
      customFields: [
        { id: 'd4_q1', label: 'Do you hold a PMP or Scrum certification?', type: 'Yes/No', required: true },
        { id: 'd4_q2', label: 'Certifications held (list all)', type: 'Text', required: false },
        { id: 'd4_q3', label: 'Largest team size managed', type: 'Number', required: true },
        { id: 'd4_q4', label: 'Preferred project methodology', type: 'Dropdown', required: true, options: [{ id: 'pm1', value: 'Agile / Scrum' }, { id: 'pm2', value: 'Kanban' }, { id: 'pm3', value: 'Waterfall' }, { id: 'pm4', value: 'Hybrid' }] },
        { id: 'd4_q5', label: 'Notice period confirmed?', type: 'Yes/No', required: true },
      ],
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
      category: 'Analytics',
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
      category: 'Engineering',
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
      category: 'Engineering',
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
      category: 'Quality Assurance',
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
      category: 'Design',
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
      category: 'Analytics',
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
      category: 'Engineering',
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
      category: 'Engineering',
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
    },
    {
      id: 'd13',
      category: 'Design',
      title: '2D Artist',
      businessUnit: 'MindInventory',
      recruiter: 'Sarah Chen',
      location: 'Ahmedabad',
      experience: '1+ Years Experience',
      employmentType: 'Full-time',
      jobType: 'On-site',
      skills: ['Illustrator', 'Photoshop', 'After Effects'],
      salaryRange: { min: '5', max: '9', currency: '₹', type: 'Annual' },
      status: 'Open',
      publishOnCollabCareers: true,
      customFields: [],
      evaluationCriteria: ['Portfolio quality'],
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
      description: 'Create compelling 2D game and app assets for our product studio.',
    },
  ],
  candidates: [
    // ── Fully populated showcase candidates ──────────────────────────────────
    {
      id: 'full1',
      firstName: 'Priya',
      lastName: 'Mehta',
      email: 'priya.mehta@gmail.com',
      phone: '+91 99812 34567',
      isAlumni: false,
      profileVisibility: 'visible' as const,
      allowRecruiterContact: true,
      candidateStatus: 'Active' as const,
      gender: 'Female',
      dateOfBirth: '22/Jun/1996',
      maritalStatus: 'Single',
      currentOrg: 'Amazon',
      currentDesignation: 'Senior Data Scientist',
      noticePeriod: '60 days',
      isFresher: false,
      totalExperienceYears: 5,
      totalExperienceMonths: 4,
      highestQualification: 'M.Tech — Data Science, IIT Delhi',
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Spark', 'AWS SageMaker', 'Tableau'],
      experiences: [
        { id: 1, company: 'Amazon', designation: 'Senior Data Scientist', from: 'Feb 2022', to: 'Present', isCurrent: true, description: 'Building ML models for supply chain demand forecasting serving 50M+ SKUs across India. Reduced overstock cost by 18%.' },
        { id: 2, company: 'Mu Sigma', designation: 'Data Analyst', from: 'Aug 2019', to: 'Jan 2022', isCurrent: false, description: 'Developed predictive analytics dashboards for FMCG clients. Automated 14 manual reporting pipelines saving 120 hrs/month.' },
      ],
      ctcType: 'Annual',
      ctcCurrency: 'INR (₹)',
      currentCtc: '32,00,000',
      expectedCtc: '42,00,000',
      address: '7A Indiranagar 100 Feet Road',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      zipCode: '560038',
      location: 'Bangalore, India',
      linkedin: 'linkedin.com/in/priyamehta-ds',
      source: 'LinkedIn',
      sourceRemark: 'Applied via LinkedIn Easy Apply. Strong publication record — 3 papers on NLP.',
      businessUnit: 'MindInventory',
      recordOwner: 'Sarah Chen',
      recruiterNotes: 'Exceptional analytical thinking. Cleared screening round in 20 min. Interested in AI-first product roles. Follow up by 25 May.',
      resumeUrl: 'Priya_Mehta_Resume.pdf',
      resumeLink: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF2.pdf',
      addedByRecruiter: true,
      addedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      createdBy: 'Sarah Chen',
      modifiedBy: 'Sarah Chen',
      availabilityStatus: 'Serving Notice Period' as const,
    },
    {
      id: 'full2',
      firstName: 'Rohan',
      lastName: 'Kapoor',
      email: 'rohan.kapoor@gmail.com',
      phone: '+91 91100 22334',
      isAlumni: true,
      alumniEmail: 'rohan@mindinventory.com',
      profileVisibility: 'visible' as const,
      allowRecruiterContact: true,
      candidateStatus: 'Active' as const,
      gender: 'Male',
      dateOfBirth: '08/Nov/1991',
      maritalStatus: 'Married',
      currentOrg: 'Flipkart',
      currentDesignation: 'DevOps Lead',
      noticePeriod: '90 days',
      isFresher: false,
      totalExperienceYears: 9,
      totalExperienceMonths: 1,
      highestQualification: 'B.E. — Computer Engineering, BITS Pilani',
      skills: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD', 'Docker', 'Prometheus', 'Linux', 'Go'],
      experiences: [
        { id: 1, company: 'Flipkart', designation: 'DevOps Lead', from: 'Mar 2020', to: 'Present', isCurrent: true, description: 'Leading a team of 8 SREs maintaining 99.99% uptime for Flipkart\'s payments infrastructure. Migrated 200+ services to Kubernetes.' },
        { id: 2, company: 'MindInventory', designation: 'Senior DevOps Engineer', from: 'Jul 2017', to: 'Feb 2020', isCurrent: false, description: 'Built CI/CD pipelines from scratch reducing deployment time from 4 hrs to 12 min. Introduced infrastructure-as-code using Terraform.' },
        { id: 3, company: 'HCL Technologies', designation: 'Systems Engineer', from: 'Jun 2015', to: 'Jun 2017', isCurrent: false, description: 'Managed on-premise Linux servers and automation scripts for a US banking client.' },
      ],
      ctcType: 'Annual',
      ctcCurrency: 'INR (₹)',
      currentCtc: '38,00,000',
      expectedCtc: '50,00,000',
      address: '22 Kondapur Main Road, Gachibowli',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      zipCode: '500084',
      location: 'Hyderabad, India',
      linkedin: 'linkedin.com/in/rohankapoor-devops',
      source: 'Referral',
      sourceRemark: 'Referred by Vikram Nair. Previously at MindInventory — strong cultural fit confirmed.',
      businessUnit: '300Mind',
      recordOwner: 'Michael Park',
      recruiterNotes: 'Very hands-on. Infrastructure design experience is exactly what the platform team needs. Prefers remote. Has offer from Razorpay — decision expected by 30 May.',
      resumeUrl: 'Rohan_Kapoor_Resume.pdf',
      resumeLink: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF2.pdf',
      addedByRecruiter: true,
      addedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      createdBy: 'Michael Park',
      modifiedBy: 'Michael Park',
      availabilityStatus: 'Serving Notice Period' as const,
    },
    {
      id: 'full3',
      firstName: 'Sneha',
      lastName: 'Joshi',
      email: 'sneha.joshi@gmail.com',
      phone: '+91 96770 11223',
      isAlumni: false,
      profileVisibility: 'visible' as const,
      allowRecruiterContact: true,
      candidateStatus: 'Active' as const,
      gender: 'Female',
      dateOfBirth: '14/Apr/1998',
      maritalStatus: 'Single',
      currentOrg: 'Swiggy',
      currentDesignation: 'Product Designer',
      noticePeriod: '30 days',
      isFresher: false,
      totalExperienceYears: 4,
      totalExperienceMonths: 7,
      highestQualification: 'B.Des — Interaction Design, NID Ahmedabad',
      skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Motion Design', 'Accessibility'],
      experiences: [
        { id: 1, company: 'Swiggy', designation: 'Product Designer', from: 'Oct 2021', to: 'Present', isCurrent: true, description: 'Owns end-to-end design for the Swiggy Instamart checkout experience used by 8M+ weekly users. Reduced cart abandonment by 23%.' },
        { id: 2, company: 'Juspay', designation: 'UI/UX Designer', from: 'Sep 2019', to: 'Sep 2021', isCurrent: false, description: 'Designed payment SDK UI components used in PhonePe, Amazon Pay, and Ola. Built comprehensive design token system.' },
      ],
      ctcType: 'Annual',
      ctcCurrency: 'INR (₹)',
      currentCtc: '18,00,000',
      expectedCtc: '25,00,000',
      address: '501 Raheja Residency, Koramangala 5th Block',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      zipCode: '560095',
      location: 'Bangalore, India',
      linkedin: 'linkedin.com/in/snehajoshi-design',
      source: 'Direct Approach',
      sourceRemark: 'Spotted via Dribbble portfolio. Top 1% designer on the platform.',
      businessUnit: 'MindInventory',
      recordOwner: 'Lisa Ray',
      recruiterNotes: 'Portfolio is stunning — especially the payment UX work. Excited about design system opportunities. Available for interview any day this week.',
      resumeUrl: 'Sneha_Joshi_Resume.pdf',
      resumeLink: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF2.pdf',
      addedByRecruiter: true,
      addedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      createdBy: 'Lisa Ray',
      modifiedBy: 'Lisa Ray',
      availabilityStatus: 'Open to Good Offers' as const,
    },
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
      city: 'Pune',
      state: 'Maharashtra',
      location: 'Pune, India',
      source: 'LinkedIn',
      recordOwner: 'Sarah Chen',
      addedAt: new Date().toISOString(),
      addedByRecruiter: true,
      totalExperienceYears: 4,
      totalExperienceMonths: 2,
      linkedin: 'linkedin.com/in/riyadesai',
      availabilityStatus: 'Open to Good Offers' as const,
      candidateStatus: 'Active' as const,
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
      city: 'Bangalore',
      state: 'Karnataka',
      location: 'Bangalore, India',
      source: 'Referral',
      recordOwner: 'Michael Park',
      addedAt: new Date(Date.now() - 86400000 * 40).toISOString(),
      addedByRecruiter: true,
      totalExperienceYears: 7,
      totalExperienceMonths: 0,
      linkedin: 'linkedin.com/in/karanmehta',
      availabilityStatus: 'Not Interested' as const,
      candidateStatus: 'Discarded' as const,
      statusReason: 'Salary expectations significantly above budget',
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
      city: 'Mumbai',
      state: 'Maharashtra',
      location: 'Mumbai, India',
      source: 'Direct Approach',
      recordOwner: 'Sarah Chen',
      addedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      addedByRecruiter: true,
      totalExperienceYears: 5,
      totalExperienceMonths: 8,
      linkedin: 'linkedin.com/in/ananyasharma',
      availabilityStatus: 'Immediate Joiner' as const,
      candidateStatus: 'Joined' as const,
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
      city: 'Hyderabad',
      state: 'Telangana',
      location: 'Hyderabad, India',
      source: 'Naukri',
      recordOwner: 'James Wilson',
      addedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      addedByRecruiter: true,
      totalExperienceYears: 9,
      totalExperienceMonths: 3,
      linkedin: 'linkedin.com/in/vikramnair',
      availabilityStatus: 'Serving Notice Period' as const,
      candidateStatus: 'Blacklisted' as const,
      statusReason: 'Misrepresented experience in previous role',
    },
    {
      id: 'c6',
      firstName: 'Neha',
      lastName: 'Kulkarni',
      email: 'neha.kulkarni@gmail.com',
      phone: '+91 94321 56789',
      isAlumni: false,
      profileVisibility: 'visible' as const,
      allowRecruiterContact: true,
      currentOrg: 'Capgemini',
      currentDesignation: 'Business Analyst',
      noticePeriod: '45 days',
      skills: ['Business Analysis', 'JIRA', 'SQL', 'PowerBI', 'Agile'],
      city: 'Chennai',
      state: 'Tamil Nadu',
      location: 'Chennai, India',
      source: 'CollabCRM Portal',
      recordOwner: 'Lisa Ray',
      addedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      addedByRecruiter: false,
      totalExperienceYears: 3,
      totalExperienceMonths: 6,
      linkedin: 'linkedin.com/in/nehakulkarni',
      availabilityStatus: 'Open to Good Offers' as const,
      candidateStatus: 'Active' as const,
    },
    {
      id: 'c7',
      firstName: 'Arjun',
      lastName: 'Verma',
      email: 'arjun.verma@outlook.com',
      phone: '+91 91234 87650',
      isAlumni: true,
      alumniEmail: 'arjun@alumni.org',
      profileVisibility: 'visible' as const,
      allowRecruiterContact: true,
      currentOrg: 'Deloitte',
      currentDesignation: 'Full Stack Developer',
      noticePeriod: '30 days',
      skills: ['Vue.js', 'Python', 'Django', 'PostgreSQL', 'Docker'],
      city: 'Ahmedabad',
      state: 'Gujarat',
      location: 'Ahmedabad, India',
      source: 'CollabCRM Portal',
      recordOwner: 'David Kim',
      addedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
      addedByRecruiter: false,
      totalExperienceYears: 6,
      totalExperienceMonths: 1,
      linkedin: 'linkedin.com/in/arjunverma',
      availabilityStatus: 'Serving Notice Period' as const,
      candidateStatus: 'Active' as const,
    },
    // Candidates matching JobApplicationsPage rows 1–6
    {
      id: '1',
      firstName: 'Mahesh',
      lastName: 'Patel',
      email: 'mahesh@gmail.com',
      phone: '+91 98765 43210',
      isAlumni: true,
      alumniEmail: 'mahesh@mindinventory.com',
      currentOrg: 'MindInventory',
      currentDesignation: 'Frontend Developer',
      noticePeriod: '30 days',
      skills: ['React', 'JavaScript', 'TypeScript'],
      totalExperienceYears: 3,
      totalExperienceMonths: 2,
      highestQualification: 'B.Tech Computer Science',
      experiences: [{ id: 1, company: 'MindInventory', designation: 'Frontend Developer', from: '2022-Jan', to: 'Present', isCurrent: true, description: 'Developing core product features using React and TypeScript.' }],
      gender: 'Male',
      dateOfBirth: '15/Aug/1998',
      maritalStatus: 'Single',
      ctcType: 'Annual',
      ctcCurrency: 'INR (₹)',
      currentCtc: '6,00,000',
      expectedCtc: '9,00,000',
      address: '123 Corporate Greens, Sector 45',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      zipCode: '380054',
      source: 'CollabCRM',
      sourceRemark: 'Ex-employee, strong React background',
      businessUnit: 'MindInventory',
      recordOwner: 'Sarah Chen',
      recruiterNotes: 'Excellent problem solving skills and deep understanding of React ecosystem.',
      candidateStatus: 'Active' as const,
      addedByRecruiter: true,
      addedAt: '2026-03-16T06:48:00.000Z',
      createdBy: 'Sarah Chen',
      modifiedBy: 'Sarah Chen',
      availabilityStatus: 'Open to Good Offers' as const,
    },
    {
      id: '2',
      firstName: 'Priya',
      lastName: 'Shah',
      email: 'priya@gmail.com',
      phone: '+91 97654 32109',
      isAlumni: true,
      alumniEmail: 'priya@mindinventory.com',
      currentOrg: 'DesignCo',
      currentDesignation: 'Visual Designer',
      noticePeriod: '15 days',
      skills: ['Figma', 'Design Systems', 'Prototyping'],
      totalExperienceYears: 4,
      totalExperienceMonths: 0,
      highestQualification: 'B.Des Visual Communication',
      experiences: [{ id: 1, company: 'DesignCo', designation: 'Visual Designer', from: '2020-Mar', to: 'Present', isCurrent: true, description: 'Leading end-to-end visual design for SaaS products.' }],
      gender: 'Female',
      dateOfBirth: '12/Nov/1996',
      maritalStatus: 'Single',
      ctcType: 'Annual',
      ctcCurrency: 'INR (₹)',
      currentCtc: '8,50,000',
      expectedCtc: '12,00,000',
      address: '45 Rose Garden, Vastrapur',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      zipCode: '380015',
      source: 'CollabCRM',
      businessUnit: 'MindInventory',
      recordOwner: 'Michael Park',
      candidateStatus: 'Active' as const,
      addedByRecruiter: true,
      addedAt: '2026-03-20T09:15:00.000Z',
      createdBy: 'Michael Park',
      modifiedBy: 'Michael Park',
      availabilityStatus: 'Serving Notice Period' as const,
    },
    {
      id: '3',
      firstName: 'Arjun',
      lastName: 'Mehta',
      email: 'arjun@gmail.com',
      phone: '+91 96543 21098',
      isAlumni: false,
      currentOrg: 'FlutterApps',
      currentDesignation: 'Mobile App Developer',
      noticePeriod: 'Immediate joiner',
      skills: ['Dart', 'Firebase', 'Flutter'],
      totalExperienceYears: 2,
      totalExperienceMonths: 5,
      experiences: [{ id: 1, company: 'FlutterApps', designation: 'Mobile App Developer', from: '2021-Jul', to: 'Present', isCurrent: true, description: 'Building cross-platform mobile apps using Flutter and Dart.' }],
      source: 'LinkedIn',
      businessUnit: 'MindInventory',
      recordOwner: 'Sarah Chen',
      candidateStatus: 'Active' as const,
      addedByRecruiter: true,
      addedAt: '2026-04-01T11:00:00.000Z',
      createdBy: 'Sarah Chen',
      modifiedBy: 'Sarah Chen',
      availabilityStatus: 'Immediate Joiner' as const,
    },
    {
      id: '4',
      firstName: 'Sneha',
      lastName: 'Patel',
      email: 'sneha@gmail.com',
      phone: '+91 95432 10987',
      isAlumni: false,
      currentOrg: 'BizAnalytics',
      currentDesignation: 'Data Analyst',
      noticePeriod: '30 days',
      skills: ['Agile', 'JIRA', 'SQL'],
      totalExperienceYears: 3,
      totalExperienceMonths: 0,
      experiences: [{ id: 1, company: 'BizAnalytics', designation: 'Data Analyst', from: '2019-Feb', to: 'Present', isCurrent: true, description: 'Analyzing market trends and client requirements using SQL and Tableau.' }],
      source: 'Naukri',
      businessUnit: 'MindInventory',
      recordOwner: 'Michael Park',
      candidateStatus: 'Active' as const,
      addedByRecruiter: true,
      addedAt: '2026-03-28T08:30:00.000Z',
      createdBy: 'Michael Park',
      modifiedBy: 'Sarah Chen',
      availabilityStatus: 'Open to Good Offers' as const,
    },
    {
      id: '5',
      firstName: 'Rahul',
      lastName: 'Joshi',
      email: 'rahul@gmail.com',
      phone: '+91 94321 09876',
      isAlumni: false,
      currentOrg: 'ProjMasters',
      currentDesignation: 'Senior Scrum Master',
      noticePeriod: '60 days',
      skills: ['Agile', 'Jira', 'Kanban'],
      totalExperienceYears: 6,
      totalExperienceMonths: 4,
      experiences: [{ id: 1, company: 'ProjMasters', designation: 'Senior Scrum Master', from: '2018-Aug', to: 'Present', isCurrent: true, description: 'Leading Agile transformation and managing enterprise software delivery.' }],
      source: 'CollabCRM',
      businessUnit: '300Mind',
      recordOwner: 'Sarah Chen',
      candidateStatus: 'Active' as const,
      addedByRecruiter: true,
      addedAt: '2026-03-15T10:00:00.000Z',
      createdBy: 'Sarah Chen',
      modifiedBy: 'Sarah Chen',
      availabilityStatus: 'Serving Notice Period' as const,
    },
    {
      id: '6',
      firstName: 'Kavya',
      lastName: 'Rao',
      email: 'kavya@gmail.com',
      phone: '+91 93210 98765',
      isAlumni: false,
      currentOrg: 'ArtStudio',
      currentDesignation: 'Graphic Designer',
      noticePeriod: 'Immediate joiner',
      skills: ['Illustrator', 'Photoshop', 'After Effects'],
      totalExperienceYears: 1,
      totalExperienceMonths: 8,
      experiences: [{ id: 1, company: 'ArtStudio', designation: 'Graphic Designer', from: '2022-Nov', to: 'Present', isCurrent: true, description: 'Creating visual assets for games and mobile apps.' }],
      source: 'Referral',
      businessUnit: 'MindInventory',
      recordOwner: 'Michael Park',
      candidateStatus: 'Active' as const,
      addedByRecruiter: true,
      addedAt: '2026-04-05T14:20:00.000Z',
      createdBy: 'Michael Park',
      modifiedBy: 'Michael Park',
      availabilityStatus: 'Immediate Joiner' as const,
    },
    // ── Job Applications list candidates (7–19) ──
    { id: '7',  firstName: 'Nikhil',  lastName: 'Sharma',   email: 'nikhil@gmail.com',  phone: '+91 92109 87654', isAlumni: true,  currentOrg: 'InnoTech',     currentDesignation: 'Node.js Developer',    noticePeriod: '30 days',    totalExperienceYears: 4, skills: ['Node.js', 'MongoDB', 'Express'], source: 'LinkedIn',   businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',   candidateStatus: 'Active' as const, addedByRecruiter: true, addedAt: '2026-04-10T09:00:00.000Z', createdBy: 'Sarah Chen',   modifiedBy: 'Sarah Chen'   },
    { id: '8',  firstName: 'Deepa',   lastName: 'Verma',    email: 'deepa@gmail.com',   phone: '+91 91098 76543', isAlumni: false, currentOrg: 'QualityFirst', currentDesignation: 'QA Analyst',           noticePeriod: '15 days',    totalExperienceYears: 2, skills: ['Selenium', 'JIRA', 'Manual Testing'], source: 'CollabCRM', businessUnit: '300Mind',       recordOwner: 'Michael Park', candidateStatus: 'Active' as const, addedByRecruiter: true, addedAt: '2026-04-11T10:00:00.000Z', createdBy: 'Michael Park', modifiedBy: 'Sarah Chen'   },
    { id: '9',  firstName: 'Amit',    lastName: 'Kumar',    email: 'amit@gmail.com',    phone: '+91 90987 65432', isAlumni: false, currentOrg: 'Reaktiv',      currentDesignation: 'React Developer',      noticePeriod: 'Immediate',  totalExperienceYears: 5, skills: ['React', 'TypeScript', 'Redux'],  source: 'Naukri',    businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',   candidateStatus: 'Active' as const, addedByRecruiter: true, addedAt: '2026-04-12T11:00:00.000Z', createdBy: 'Sarah Chen',   modifiedBy: 'Sarah Chen'   },
    { id: '10', firstName: 'Pooja',   lastName: 'Iyer',     email: 'pooja@gmail.com',   phone: '+91 89876 54321', isAlumni: true,  currentOrg: 'DesignCo',    currentDesignation: 'UI/UX Designer',       noticePeriod: '30 days',    totalExperienceYears: 3, skills: ['Figma', 'Sketch', 'Prototyping'], source: 'CollabCRM', businessUnit: 'MindInventory', recordOwner: 'Michael Park', candidateStatus: 'Active' as const, addedByRecruiter: true, addedAt: '2026-04-13T09:30:00.000Z', createdBy: 'Michael Park', modifiedBy: 'Michael Park' },
    { id: '11', firstName: 'Rohit',   lastName: 'Nair',     email: 'rohit@gmail.com',   phone: '+91 88765 43210', isAlumni: false, currentOrg: 'FlutterDev',  currentDesignation: 'Flutter Developer',    noticePeriod: '15 days',    totalExperienceYears: 3, skills: ['Flutter', 'Dart', 'Firebase'],   source: 'LinkedIn',   businessUnit: '300Mind',       recordOwner: 'Sarah Chen',   candidateStatus: 'Active' as const, addedByRecruiter: true, addedAt: '2026-04-14T10:00:00.000Z', createdBy: 'Sarah Chen',   modifiedBy: 'Sarah Chen'   },
    { id: '12', firstName: 'Sonal',   lastName: 'Gupta',    email: 'sonal@gmail.com',   phone: '+91 87654 32109', isAlumni: false, currentOrg: 'DataBridge',  currentDesignation: 'Business Analyst',     noticePeriod: '60 days',    totalExperienceYears: 4, skills: ['SQL', 'Tableau', 'JIRA'],        source: 'Referral',  businessUnit: 'MindInventory', recordOwner: 'Michael Park', candidateStatus: 'Active' as const, addedByRecruiter: true, addedAt: '2026-04-15T11:00:00.000Z', createdBy: 'Michael Park', modifiedBy: 'Sarah Chen'   },
    { id: '13', firstName: 'Vishal',  lastName: 'Singh',    email: 'vishal@gmail.com',  phone: '+91 86543 21098', isAlumni: true,  currentOrg: 'ProjMasters', currentDesignation: 'Senior Project Manager', noticePeriod: '30 days',   totalExperienceYears: 7, skills: ['PMP', 'Agile', 'Scrum'],         source: 'CollabCRM', businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',   candidateStatus: 'Active' as const, addedByRecruiter: true, addedAt: '2026-04-16T09:00:00.000Z', createdBy: 'Sarah Chen',   modifiedBy: 'Sarah Chen'   },
    { id: '14', firstName: 'Meera',   lastName: 'Pillai',   email: 'meera@gmail.com',   phone: '+91 85432 10987', isAlumni: false, currentOrg: 'BackendBase', currentDesignation: 'Backend Developer',    noticePeriod: 'Immediate',  totalExperienceYears: 3, skills: ['Node.js', 'PostgreSQL', 'REST'],  source: 'LinkedIn',   businessUnit: '300Mind',       recordOwner: 'Michael Park', candidateStatus: 'Active' as const, addedByRecruiter: true, addedAt: '2026-04-17T10:00:00.000Z', createdBy: 'Michael Park', modifiedBy: 'Michael Park' },
    { id: '15', firstName: 'Karan',   lastName: 'Desai',    email: 'karan@gmail.com',   phone: '+91 84321 09876', isAlumni: false, currentOrg: 'TestLab',     currentDesignation: 'QA Engineer',          noticePeriod: '15 days',    totalExperienceYears: 2, skills: ['Selenium', 'Cucumber', 'TestNG'],source: 'Naukri',    businessUnit: 'MindInventory', recordOwner: 'Sarah Chen',   candidateStatus: 'Active' as const, addedByRecruiter: true, addedAt: '2026-04-18T11:00:00.000Z', createdBy: 'Sarah Chen',   modifiedBy: 'Sarah Chen'   },
    { id: '16', firstName: 'Ananya',  lastName: 'Tiwari',   email: 'ananya@gmail.com',  phone: '+91 83210 98765', isAlumni: false, currentOrg: 'WebCraft',    currentDesignation: 'Frontend Developer',   noticePeriod: '30 days',    totalExperienceYears: 4, skills: ['React', 'Next.js', 'CSS'],       source: 'CollabCRM', businessUnit: 'MindInventory', recordOwner: 'Michael Park', candidateStatus: 'Active' as const, addedByRecruiter: true, addedAt: '2026-04-19T09:30:00.000Z', createdBy: 'Michael Park', modifiedBy: 'Sarah Chen'   },
    { id: '17', firstName: 'Suresh',  lastName: 'Reddy',    email: 'suresh@gmail.com',  phone: '+91 82109 87654', isAlumni: true,  currentOrg: 'PixelStudio', currentDesignation: 'Senior UX Designer',   noticePeriod: '60 days',    totalExperienceYears: 5, skills: ['Figma', 'User Research', 'Zeplin'], source: 'Referral', businessUnit: '300Mind',       recordOwner: 'Sarah Chen',   candidateStatus: 'Active' as const, addedByRecruiter: true, addedAt: '2026-04-20T10:00:00.000Z', createdBy: 'Sarah Chen',   modifiedBy: 'Sarah Chen'   },
    { id: '18', firstName: 'Ritu',    lastName: 'Malhotra', email: 'ritu@gmail.com',    phone: '+91 81098 76543', isAlumni: false, currentOrg: 'MobileFirst', currentDesignation: 'Flutter Engineer',     noticePeriod: '15 days',    totalExperienceYears: 3, skills: ['Flutter', 'Dart', 'iOS'],        source: 'LinkedIn',   businessUnit: 'MindInventory', recordOwner: 'Michael Park', candidateStatus: 'Active' as const, addedByRecruiter: true, addedAt: '2026-04-21T11:00:00.000Z', createdBy: 'Michael Park', modifiedBy: 'Michael Park' },
    { id: '19', firstName: 'Ajay',    lastName: 'Pandey',   email: 'ajay@gmail.com',    phone: '+91 80987 65432', isAlumni: true,  currentOrg: 'Synergy Inc', currentDesignation: 'Delivery Manager',     noticePeriod: 'Immediate',  totalExperienceYears: 8, skills: ['PMP', 'Risk Management', 'PRINCE2'], source: 'CollabCRM', businessUnit: 'MindInventory', recordOwner: 'Sarah Chen', candidateStatus: 'Active' as const, addedByRecruiter: true, addedAt: '2026-04-22T09:00:00.000Z', createdBy: 'Sarah Chen', modifiedBy: 'Sarah Chen' },
    // ── Demo candidates — fully populated for profile page showcase ──
    {
      id: 'demo1',
      firstName: 'Vikram',
      lastName: 'Nair',
      email: 'vikram.nair@gmail.com',
      phone: '+91 98001 23456',
      isAlumni: false,
      profileVisibility: 'visible' as const,
      allowRecruiterContact: true,
      candidateStatus: 'Active' as const,
      // Personal
      gender: 'Male',
      dateOfBirth: '04/Mar/1993',
      maritalStatus: 'Married',
      // Professional
      currentOrg: 'Infosys',
      currentDesignation: 'Senior Full-Stack Engineer',
      noticePeriod: '60 days',
      isFresher: false,
      totalExperienceYears: 8,
      totalExperienceMonths: 3,
      highestQualification: 'B.Tech — Computer Science, IIT Bombay',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Redis'],
      experiences: [
        { id: 1, company: 'Infosys', designation: 'Senior Full-Stack Engineer', from: 'Jan 2021', to: 'Present', isCurrent: true, description: 'Leading a team of 6 engineers building a B2B SaaS platform. Architected micro-services migration reducing latency by 40%.' },
        { id: 2, company: 'Wipro', designation: 'Full-Stack Developer', from: 'Jun 2018', to: 'Dec 2020', isCurrent: false, description: 'Built RESTful APIs and React dashboards for an e-commerce analytics product serving 2M+ users.' },
        { id: 3, company: 'TechSpark (Startup)', designation: 'Junior Developer', from: 'Jul 2016', to: 'May 2018', isCurrent: false, description: 'Developed internal tooling and automation scripts. First engineering hire.' },
      ],
      // Salary
      ctcType: 'Annual',
      ctcCurrency: 'INR (₹)',
      currentCtc: '24,00,000',
      expectedCtc: '32,00,000',
      // Address
      address: '14B Whitefield Main Road, Varthur',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      zipCode: '560066',
      location: 'Bangalore, India',
      linkedin: 'linkedin.com/in/vikramnair',
      // Source
      source: 'LinkedIn',
      sourceRemark: 'Reached out directly — strong open source contributions on GitHub.',
      businessUnit: 'MindInventory',
      recordOwner: 'Sarah Chen',
      recruiterNotes: 'Excellent system design skills. Cleared L1 telephonic round with flying colours. Prefers remote or hybrid. Has a competing offer from Razorpay — move fast.',
      // Resume
      resumeUrl: 'Vikram_Nair_Resume.pdf',
      resumeLink: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF2.pdf',
      addedByRecruiter: true,
      addedAt: '2026-05-10T09:30:00.000Z',
      createdBy: 'Sarah Chen',
      modifiedBy: 'Sarah Chen',
      availabilityStatus: 'Serving Notice Period' as const,
    },
    {
      id: 'demo2',
      firstName: 'Aishwarya',
      lastName: 'Menon',
      email: 'aishwarya.menon@gmail.com',
      phone: '+91 91234 56789',
      isAlumni: true,
      alumniEmail: 'aishwarya@mindinventory.com',
      profileVisibility: 'visible' as const,
      allowRecruiterContact: true,
      candidateStatus: 'Active' as const,
      // Personal
      gender: 'Female',
      dateOfBirth: '19/Sep/1995',
      maritalStatus: 'Single',
      // Professional
      currentOrg: 'Accenture',
      currentDesignation: 'Product Manager',
      noticePeriod: '90 days',
      isFresher: false,
      totalExperienceYears: 6,
      totalExperienceMonths: 9,
      highestQualification: 'MBA — Product Management, IIM Ahmedabad',
      skills: ['Product Strategy', 'Roadmapping', 'SQL', 'Figma', 'A/B Testing', 'Agile', 'Stakeholder Management'],
      experiences: [
        { id: 1, company: 'Accenture', designation: 'Product Manager', from: 'Mar 2022', to: 'Present', isCurrent: true, description: 'Owns the end-to-end product roadmap for a FinTech compliance platform. Shipped 3 major features reducing client onboarding time by 55%.' },
        { id: 2, company: 'MindInventory', designation: 'Associate Product Manager', from: 'Jul 2019', to: 'Feb 2022', isCurrent: false, description: 'Defined product specs and coordinated with engineering and design for a fleet-management mobile app. Grew DAU from 12K to 85K in 18 months.' },
        { id: 3, company: 'Deloitte', designation: 'Business Analyst', from: 'Aug 2017', to: 'Jun 2019', isCurrent: false, description: 'Conducted requirements gathering and process mapping for BFSI clients across US and UK markets.' },
      ],
      // Salary
      ctcType: 'Annual',
      ctcCurrency: 'INR (₹)',
      currentCtc: '28,00,000',
      expectedCtc: '38,00,000',
      // Address
      address: '302 Skyline Apartments, Prahlad Nagar',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      zipCode: '380015',
      location: 'Ahmedabad, India',
      linkedin: 'linkedin.com/in/aishwaryamenon',
      // Source
      source: 'Referral',
      sourceRemark: 'Referred by Rahul Joshi — worked together at MindInventory. Strong cultural fit.',
      businessUnit: '300Mind',
      recordOwner: 'Lisa Ray',
      recruiterNotes: 'Very articulate in stakeholder communication. Previous MindInventory alumna — knows the culture well. Interview slots sent for 22 May 2026.',
      // Resume
      resumeUrl: 'Aishwarya_Menon_Resume.pdf',
      resumeLink: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF2.pdf',
      addedByRecruiter: true,
      addedAt: '2026-05-14T11:45:00.000Z',
      createdBy: 'Lisa Ray',
      modifiedBy: 'Lisa Ray',
      availabilityStatus: 'Open to Good Offers' as const,
    },
    // ── Pipeline scenario candidates (ps1–ps7) — minimal, one app each ──
    { id: 'ps1', firstName: 'Sanjay',   lastName: 'Kumar',  email: 'sanjay.kumar@example.com',   phone: '+91 99100 11111', isAlumni: false, candidateStatus: 'Active' as const, currentDesignation: 'Software Engineer',    currentOrg: 'HCL Technologies', noticePeriod: '30 days', source: 'Naukri',    addedByRecruiter: true, addedAt: new Date(Date.now() - 86400000 * 25).toISOString() },
    { id: 'ps2', firstName: 'Divya',    lastName: 'Patel',  email: 'divya.patel@example.com',    phone: '+91 99100 22222', isAlumni: false, candidateStatus: 'Active' as const, currentDesignation: 'UX Designer',          currentOrg: 'Cognizant',        noticePeriod: '45 days', source: 'LinkedIn',  addedByRecruiter: true, addedAt: new Date(Date.now() - 86400000 * 20).toISOString() },
    { id: 'ps3', firstName: 'Kiran',    lastName: 'Shah',   email: 'kiran.shah@example.com',     phone: '+91 99100 33333', isAlumni: false, candidateStatus: 'Active' as const, currentDesignation: 'Product Manager',      currentOrg: 'Wipro',            noticePeriod: '60 days', source: 'Referral',  addedByRecruiter: true, addedAt: new Date(Date.now() - 86400000 * 18).toISOString() },
    { id: 'ps4', firstName: 'Pooja',    lastName: 'Nair',   email: 'pooja.nair@example.com',     phone: '+91 99100 44444', isAlumni: false, candidateStatus: 'Active' as const, currentDesignation: 'Backend Developer',    currentOrg: 'Infosys',          noticePeriod: '30 days', source: 'Naukri',    addedByRecruiter: true, addedAt: new Date(Date.now() - 86400000 * 15).toISOString() },
    { id: 'ps5', firstName: 'Arun',     lastName: 'Verma',  email: 'arun.verma@example.com',     phone: '+91 99100 55555', isAlumni: false, candidateStatus: 'Active' as const, currentDesignation: 'DevOps Engineer',      currentOrg: 'TCS',              noticePeriod: 'Immediate', source: 'Referral', addedByRecruiter: true, addedAt: new Date(Date.now() - 86400000 * 12).toISOString() },
    { id: 'ps6', firstName: 'Priyanka', lastName: 'Rao',    email: 'priyanka.rao@example.com',   phone: '+91 99100 66666', isAlumni: false, candidateStatus: 'Active' as const, currentDesignation: 'QA Engineer',          currentOrg: 'Accenture',        noticePeriod: '30 days', source: 'Naukri',    addedByRecruiter: true, addedAt: new Date(Date.now() - 86400000 * 10).toISOString() },
    { id: 'ps7', firstName: 'Deepak',   lastName: 'Singh',  email: 'deepak.singh@example.com',   phone: '+91 99100 77777', isAlumni: false, candidateStatus: 'Active' as const, currentDesignation: 'Data Analyst',         currentOrg: 'Capgemini',        noticePeriod: '45 days', source: 'LinkedIn',  addedByRecruiter: true, addedAt: new Date(Date.now() - 86400000 * 8).toISOString() },
    { id: 'ps8', firstName: 'Rekha',    lastName: 'Sharma', email: 'rekha.sharma@example.com',   phone: '+91 98765 00001', isAlumni: false, candidateStatus: 'Active' as const, currentDesignation: 'HR Executive',         currentOrg: 'Mindtree',         noticePeriod: '30 days', source: 'Naukri',    addedByRecruiter: true, addedAt: new Date(Date.now() - 86400000 * 50).toISOString(), skills: ['Recruitment', 'HRMS', 'Excel'], totalExperienceYears: 2 },
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
      status: 'Selected',
      appliedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      answers: { _fullFormData: { personal: { contactNumber: '+91 98765 43210' }, address: { city: 'Ahmedabad', country: 'India' } } },
      resumeUrl: 'Alex_Patel_Resume.pdf'
    },
    {
      id: 'a4',
      candidateId: 'c1',
      jobId: 'd5',
      status: 'Applied',
      appliedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      answers: { _fullFormData: { personal: { contactNumber: '+91 98765 43210' } } },
      resumeUrl: 'Alex_Patel_Resume.pdf'
    },
    {
      id: 'a5',
      candidateId: 'c1',
      jobId: 'd8', // QA Engineer
      status: 'Applied',
      appliedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      answers: { _fullFormData: { personal: { contactNumber: '+91 98765 43210' } } },
      resumeUrl: 'Alex_Patel_Resume.pdf'
    },
    // Alex (c1) — in-progress drafts (status 'Applied') so the listing shows "Continue Application"
    {
      id: 'ad1',
      candidateId: 'c1',
      jobId: 'd3', // Flutter Developer
      status: 'Applied',
      appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      answers: { _fullFormData: { personal: { contactNumber: '+91 98765 43210' } } },
      resumeUrl: 'Alex_Patel_Resume.pdf'
    },
    {
      id: 'ad2',
      candidateId: 'c1',
      jobId: 'd6', // Node.js Backend Engineer
      status: 'Applied',
      appliedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      answers: { _fullFormData: { personal: { contactNumber: '+91 98765 43210' } } },
      resumeUrl: 'Alex_Patel_Resume.pdf'
    },
    {
      id: 'ad3',
      candidateId: 'c1',
      jobId: 'd9', // Product Designer
      status: 'Applied',
      appliedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
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
      status: 'Selected',
      appliedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      answers: { _fullFormData: { personal: { contactNumber: '+91 76543 21098' } } },
      resumeUrl: 'Karan_Mehta_Resume.pdf'
    },
    // Ananya Sharma (c4) — no applications (empty state demo)
    // Applications for JobApplicationsPage rows 1–6
    { id: 'm1', candidateId: '1', jobId: 'd1', status: 'Under Review',          appliedAt: '2026-04-21T00:00:00.000Z', answers: { d1_q1: 'https://github.com/maheshpatel-dev', d1_q2: '3', d1_q3: 'No', d1_q4: 'On-site' }, resumeUrl: 'Mahesh_Patel_Resume.pdf' },
    { id: 'm2', candidateId: '1', jobId: 'd6', status: 'Interview in Progress', appliedAt: '2026-04-10T00:00:00.000Z', answers: {}, resumeUrl: 'Mahesh_Patel_Resume.pdf' },
    { id: 'm3', candidateId: '2', jobId: 'd2', status: 'Interview in Progress', appliedAt: '2026-04-18T00:00:00.000Z', answers: {}, resumeUrl: 'Priya_Shah_Resume.pdf' },
    { id: 'm4', candidateId: '3', jobId: 'd3', status: 'Applied',               appliedAt: '2026-04-23T00:00:00.000Z', answers: {}, resumeUrl: 'Arjun_Mehta_Resume.pdf' },
    { id: 'm5', candidateId: '3', jobId: 'd7', status: 'Rejected',              appliedAt: '2026-04-15T00:00:00.000Z', answers: {}, resumeUrl: 'Arjun_Mehta_Resume.pdf' },
    { id: 'm6', candidateId: '4', jobId: 'd5', status: 'Offered',             appliedAt: '2026-04-22T00:00:00.000Z', answers: {}, resumeUrl: 'Sneha_Patel_Resume.pdf' },
    { id: 'm7', candidateId: '5', jobId: 'd4', status: 'Selected',              appliedAt: '2026-04-18T00:00:00.000Z', answers: { d4_q1: 'Yes', d4_q2: 'PMP (2020), Certified Scrum Master (2018)', d4_q3: '15', d4_q4: 'Kanban', d4_q5: 'Yes' }, resumeUrl: 'Rahul_Joshi_Resume.pdf' },
    { id: 'm8', candidateId: '5', jobId: 'd5', status: 'Rejected',              appliedAt: '2026-04-05T00:00:00.000Z', answers: {}, resumeUrl: 'Rahul_Joshi_Resume.pdf' },
    { id: 'm9',  candidateId: '6',  jobId: 'd13', status: 'Offer Accepted',        appliedAt: '2026-04-20T00:00:00.000Z', answers: {}, resumeUrl: 'Kavya_Rao_Resume.pdf' },
    // Job Applications list rows 7–19
    { id: 'r7',  candidateId: '7',  jobId: 'd6',  status: 'Under Review',          appliedAt: '2026-04-10T00:00:00.000Z', answers: {}, resumeUrl: 'Nikhil_Sharma_Resume.pdf' },
    { id: 'r8',  candidateId: '8',  jobId: 'd8',  status: 'Under Review',          appliedAt: '2026-04-11T00:00:00.000Z', answers: {}, resumeUrl: 'Deepa_Verma_Resume.pdf' },
    { id: 'r9',  candidateId: '9',  jobId: 'd1',  status: 'Shortlisted',           appliedAt: '2026-04-12T00:00:00.000Z', answers: {}, resumeUrl: 'Amit_Kumar_Resume.pdf' },
    { id: 'r10', candidateId: '10', jobId: 'd2',  status: 'Shortlisted',           appliedAt: '2026-04-13T00:00:00.000Z', answers: {}, resumeUrl: 'Pooja_Iyer_Resume.pdf' },
    { id: 'r11', candidateId: '11', jobId: 'd3',  status: 'Shortlisted',           appliedAt: '2026-04-14T00:00:00.000Z', answers: {}, resumeUrl: 'Rohit_Nair_Resume.pdf' },
    { id: 'r12', candidateId: '12', jobId: 'd5',  status: 'Shortlisted',           appliedAt: '2026-04-15T00:00:00.000Z', answers: {}, resumeUrl: 'Sonal_Gupta_Resume.pdf' },
    { id: 'r13', candidateId: '13', jobId: 'd4',  status: 'Interview in Progress', appliedAt: '2026-04-16T00:00:00.000Z', answers: {}, resumeUrl: 'Vishal_Singh_Resume.pdf' },
    { id: 'r14', candidateId: '14', jobId: 'd6',  status: 'Interview in Progress', appliedAt: '2026-04-17T00:00:00.000Z', answers: {}, resumeUrl: 'Meera_Pillai_Resume.pdf' },
    { id: 'r15', candidateId: '15', jobId: 'd8',  status: 'Interview in Progress', appliedAt: '2026-04-18T00:00:00.000Z', answers: {}, resumeUrl: 'Karan_Desai_Resume.pdf' },
    { id: 'r16', candidateId: '16', jobId: 'd1',  status: 'Offered',            appliedAt: '2026-04-19T00:00:00.000Z', answers: {}, resumeUrl: 'Ananya_Tiwari_Resume.pdf' },
    { id: 'r17', candidateId: '17', jobId: 'd2',  status: 'Offered',            appliedAt: '2026-04-20T00:00:00.000Z', answers: {}, resumeUrl: 'Suresh_Reddy_Resume.pdf' },
    { id: 'r18', candidateId: '18', jobId: 'd3',  status: 'Offer Accepted',        appliedAt: '2026-04-21T00:00:00.000Z', answers: {}, resumeUrl: 'Ritu_Malhotra_Resume.pdf' },
    { id: 'r19', candidateId: '19', jobId: 'd4',  status: 'Offer Accepted',        appliedAt: '2026-04-22T00:00:00.000Z', answers: {}, resumeUrl: 'Ajay_Pandey_Resume.pdf' },
    // Demo candidates — fully answered application form responses
    {
      id: 'demo-app-1',
      candidateId: 'demo1',
      jobId: 'd1',
      status: 'Shortlisted',
      appliedAt: '2026-05-12T10:30:00.000Z',
      answers: {
        d1_q1: 'https://github.com/vikramnair',
        d1_q2: '7',
        d1_q3: 'Yes',
        d1_q4: 'Hybrid',
      },
      resumeUrl: 'Vikram_Nair_Resume.pdf',
    },
    {
      id: 'demo-app-2',
      candidateId: 'demo2',
      jobId: 'd4',
      status: 'Interview in Progress',
      appliedAt: '2026-05-15T14:00:00.000Z',
      answers: {
        d4_q1: 'Yes',
        d4_q2: 'PMP (2021), Certified Scrum Master (2019), Google Project Management Certificate',
        d4_q3: '22',
        d4_q4: 'Agile / Scrum',
        d4_q5: 'Yes',
      },
      resumeUrl: 'Aishwarya_Menon_Resume.pdf',
    },
    // Priya Mehta (full1) — 2 applications: Data Analyst (shortlisted) + Business Analyst (offer made)
    {
      id: 'full1-app-1',
      candidateId: 'full1',
      jobId: 'd10',
      status: 'Shortlisted',
      appliedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      answers: {},
      resumeUrl: 'Priya_Mehta_Resume.pdf',
    },
    {
      id: 'full1-app-2',
      candidateId: 'full1',
      jobId: 'd5',
      status: 'Offered',
      appliedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
      answers: {},
      resumeUrl: 'Priya_Mehta_Resume.pdf',
    },
    // Rohan Kapoor (full2) — 2 applications: DevOps Engineer (interview) + Node.js (on hold)
    {
      id: 'full2-app-1',
      candidateId: 'full2',
      jobId: 'd7',
      status: 'Interview in Progress',
      appliedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      answers: {},
      resumeUrl: 'Rohan_Kapoor_Resume.pdf',
    },
    {
      id: 'full2-app-2',
      candidateId: 'full2',
      jobId: 'd6',
      status: 'On Hold',
      appliedAt: new Date(Date.now() - 86400000 * 21).toISOString(),
      answers: {},
      resumeUrl: 'Rohan_Kapoor_Resume.pdf',
    },
    // Sneha Joshi (full3) — 2 applications: Product Designer (shortlisted) + UI/UX Designer (applied)
    {
      id: 'full3-app-1',
      candidateId: 'full3',
      jobId: 'd9',
      status: 'Shortlisted',
      appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      answers: {},
      resumeUrl: 'Sneha_Joshi_Resume.pdf',
    },
    {
      id: 'full3-app-2',
      candidateId: 'full3',
      jobId: 'd2',
      status: 'Applied',
      appliedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      answers: {},
      resumeUrl: 'Sneha_Joshi_Resume.pdf',
    },
    // ── c-series candidates — pipeline scenario apps ──
    { id: 'cx-c3', candidateId: 'c3', jobId: 'd1', status: 'Under Review',         appliedAt: new Date(Date.now() - 86400000 * 30).toISOString(), answers: {}, resumeUrl: 'Karan_Mehta_Resume.pdf' },
    { id: 'cx-c4', candidateId: 'c4', jobId: 'd2', status: 'Joined',               appliedAt: new Date(Date.now() - 86400000 * 60).toISOString(), answers: {}, resumeUrl: 'Ananya_Sharma_Resume.pdf' },
    { id: 'cx-c5', candidateId: 'c5', jobId: 'd3', status: 'Interview in Progress', appliedAt: new Date(Date.now() - 86400000 * 14).toISOString(), answers: {}, resumeUrl: 'Vikram_Nair_Resume.pdf' },
    { id: 'cx-c6', candidateId: 'c6', jobId: 'd4', status: 'On Hold',              appliedAt: new Date(Date.now() - 86400000 * 10).toISOString(), answers: {}, resumeUrl: 'Neha_Kulkarni_Resume.pdf' },
    { id: 'cx-c7', candidateId: 'c7', jobId: 'd5', status: 'Future',               appliedAt: new Date(Date.now() - 86400000 * 7).toISOString(), answers: {}, resumeUrl: 'Arjun_Verma_Resume.pdf' },
    // ── pipeline scenario candidates ps1–ps7 ──
    { id: 'ps1-app', candidateId: 'ps1', jobId: 'd6',  status: 'Rejected',      appliedAt: new Date(Date.now() - 86400000 * 22).toISOString(), answers: {}, resumeUrl: 'Sanjay_Kumar_Resume.pdf' },
    { id: 'ps2-app', candidateId: 'ps2', jobId: 'd7',  status: 'Withdrawn',     exitedAfterStage: 1, appliedAt: new Date(Date.now() - 86400000 * 18).toISOString(), answers: {}, resumeUrl: 'Divya_Patel_Resume.pdf' },
    { id: 'ps3-app', candidateId: 'ps3', jobId: 'd8',  status: 'Offer Declined', appliedAt: new Date(Date.now() - 86400000 * 15).toISOString(), answers: {}, resumeUrl: 'Kiran_Shah_Resume.pdf' },
    { id: 'ps4-app', candidateId: 'ps4', jobId: 'd9',  status: 'Offer Revoked', appliedAt: new Date(Date.now() - 86400000 * 12).toISOString(), answers: {}, resumeUrl: 'Pooja_Nair_Resume.pdf' },
    { id: 'ps5-app', candidateId: 'ps5', jobId: 'd10', status: 'Not Joined',    appliedAt: new Date(Date.now() - 86400000 * 10).toISOString(), answers: {}, resumeUrl: 'Arun_Verma_Resume.pdf' },
    { id: 'ps6-app', candidateId: 'ps6', jobId: 'd11', status: 'No Show',       appliedAt: new Date(Date.now() - 86400000 * 8).toISOString(), answers: {}, resumeUrl: 'Priyanka_Rao_Resume.pdf' },
    { id: 'ps7-app', candidateId: 'ps7', jobId: 'd12', status: 'Cancelled',     appliedAt: new Date(Date.now() - 86400000 * 5).toISOString(), answers: {}, resumeUrl: 'Deepak_Singh_Resume.pdf' },
    { id: 'ps8-app', candidateId: 'ps8', jobId: 'd1',  status: 'Archived',      exitedAfterStage: 0, archiveRemark: 'Candidate went silent after 2 follow-ups. Archiving for now.', appliedAt: '2026-03-10T00:00:00.000Z', answers: {}, resumeUrl: 'Rekha_Sharma_Resume.pdf' },
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
    // Priya Mehta (full1) — 2 invites: both resulted in applying
    {
      id: 'inv-full1-1',
      candidateId: 'full1',
      jobId: 'd10',
      jobTitle: 'Data Analyst',
      sentAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      sentBy: 'Sarah Chen',
      status: 'Applied' as const,
      emailMode: 'template' as const,
    },
    {
      id: 'inv-full1-2',
      candidateId: 'full1',
      jobId: 'd5',
      jobTitle: 'Business Analyst',
      sentAt: new Date(Date.now() - 86400000 * 13).toISOString(),
      sentBy: 'Sarah Chen',
      status: 'Applied' as const,
      emailMode: 'template' as const,
    },
    // Rohan Kapoor (full2) — DevOps: applied; Node.js: not interested
    {
      id: 'inv-full2-1',
      candidateId: 'full2',
      jobId: 'd7',
      jobTitle: 'DevOps Engineer',
      sentAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      sentBy: 'Michael Park',
      status: 'Applied' as const,
      emailMode: 'template' as const,
    },
    {
      id: 'inv-full2-2',
      candidateId: 'full2',
      jobId: 'd6',
      jobTitle: 'Node.js Backend Engineer',
      sentAt: new Date(Date.now() - 86400000 * 22).toISOString(),
      sentBy: 'Michael Park',
      status: 'Not Interested' as const,
      emailMode: 'custom' as const,
    },
    // Sneha Joshi (full3) — Product Designer: applied; UI/UX: still waiting
    {
      id: 'inv-full3-1',
      candidateId: 'full3',
      jobId: 'd9',
      jobTitle: 'Product Designer',
      sentAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      sentBy: 'Lisa Ray',
      status: 'Applied' as const,
      emailMode: 'template' as const,
    },
    {
      id: 'inv-full3-2',
      candidateId: 'full3',
      jobId: 'd2',
      jobTitle: 'UI/UX Designer',
      sentAt: new Date(Date.now() - 86400000 * 8).toISOString(),
      sentBy: 'Lisa Ray',
      status: 'Sent' as const,
      emailMode: 'custom' as const,
    },
  ],
  currentUser: null,
  alumniVerified: {
    verified: false,
    email: null,
  },
  portalConfig: {
    termsUrl: 'https://www.mindinventory.com/terms-of-use.php',
    privacyPolicyUrl: 'https://www.mindinventory.com/privacy-policy.php',
    appearance: { ...DEFAULT_APPEARANCE },
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
        portalConfig: {
          ...initialState.portalConfig,
          ...(parsed.portalConfig ?? {}),
          appearance: {
            ...initialState.portalConfig.appearance,
            ...(parsed.portalConfig?.appearance ?? {}),
          },
        },
      };
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Live-sync portal config across tabs so an open candidate portal reflects
  // Appearance edits made in the config tab without a manual refresh.
  // The `storage` event only fires in *other* tabs, so this can't self-loop.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue);
        if (!parsed.portalConfig) return;
        setState(prev =>
          JSON.stringify(prev.portalConfig) === JSON.stringify(parsed.portalConfig)
            ? prev
            : { ...prev, portalConfig: parsed.portalConfig }
        );
      } catch {
        /* ignore malformed payloads */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

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
      applications: [...prev.applications.filter(a => !(a.jobId === app.jobId && a.candidateId === app.candidateId && a.status === 'Applied')), app],
    }));
  };

  const saveDraft = (app: Application) => {
    setState(prev => ({
      ...prev,
      applications: [...prev.applications.filter(a => !(a.jobId === app.jobId && a.candidateId === app.candidateId && a.status === 'Applied')), app],
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

  const blacklistCandidate = (candidateId: string, reason: string) => {
    setState(prev => ({
      ...prev,
      candidates: prev.candidates.map(c =>
        c.id === candidateId
          ? { ...c, candidateStatus: 'Blacklisted' as const, statusReason: reason, isBlacklisted: true }
          : c
      ),
    }));
  };

  const discardCandidate = (candidateId: string, reason: string) => {
    setState(prev => ({
      ...prev,
      candidates: prev.candidates.map(c =>
        c.id === candidateId
          ? { ...c, candidateStatus: 'Discarded' as const, statusReason: reason }
          : c
      ),
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
        blacklistCandidate,
        discardCandidate,
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
