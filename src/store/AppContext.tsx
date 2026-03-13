import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Job, Candidate, Application } from './types';

interface AppContextType extends AppState {
  addJob: (job: Job) => void;
  registerCandidate: (candidate: Candidate) => void;
  loginCandidate: (email: string) => void;
  logoutCandidate: () => void;
  submitApplication: (application: Application) => void;
  setAlumniVerified: (verified: boolean, email: string | null) => void;
}

const STORAGE_KEY = 'collab_careers_state';

const initialState: AppState = {
  jobs: [],
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
    return saved ? JSON.parse(saved) : initialState;
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
      applications: [...prev.applications, app],
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
