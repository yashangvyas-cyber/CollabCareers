import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Job, Candidate, Application, PortalConfig, TalentInvite, TalentInviteStatus, TalentAvailabilityStatus, ExternalInvite, ExternalInviteStatus, ExternalAvailability, ExternalFeedback } from './types';
import { initialState } from './seed';

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
  acceptOffer: (applicationId: string) => void;
  declineOffer: (applicationId: string, reason?: string) => void;
  updatePortalConfig: (updates: Partial<PortalConfig>) => void;
  sendInvite: (invite: TalentInvite) => void;
  updateInviteStatus: (inviteId: string, status: TalentInviteStatus) => void;
  updateCandidateAvailability: (candidateId: string, status: TalentAvailabilityStatus) => void;
  blacklistCandidate: (candidateId: string, reason: string) => void;
  discardCandidate: (candidateId: string, reason: string) => void;
  addExternalPanelists: (invites: ExternalInvite[]) => void;
  submitExternalAvailability: (token: string, availability: ExternalAvailability) => void;
  submitExternalFeedback: (token: string, feedback: ExternalFeedback) => void;
  cancelExternalInvite: (id: string) => void;
  resendExternalInvite: (id: string) => void;
}

const STORAGE_KEY = 'collab_careers_state_v23';

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
        } else if (defaultApp.offer && !mergedApps[existingIdx].offer) {
          // Backfill newly-seeded offer details onto applications saved before
          // the offer feature existed. Status is left untouched so a decline
          // made during a previous session survives the reload.
          mergedApps[existingIdx] = { ...mergedApps[existingIdx], offer: defaultApp.offer };
        } else {
          const stored = mergedApps[existingIdx];
          const freshUrl = defaultApp.offer?.signature?.signUrl;
          // The tokenised signing link expires and gets reissued. It's
          // environment data rather than something the candidate changed, so
          // always take the newest one — signature status and any decline the
          // candidate made in a previous session are preserved.
          if (freshUrl && stored.offer?.signature && stored.offer.signature.signUrl !== freshUrl) {
            mergedApps[existingIdx] = {
              ...stored,
              offer: { ...stored.offer, signature: { ...stored.offer.signature, signUrl: freshUrl } },
            };
          }
        }
        // Otherwise don't overwrite — user may have updated them in session
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

      // Demo tokens must always open in their labelled state: seeded invites are
      // reset to their canonical seed values on every load (interactions during a
      // session still work — they just don't pollute the demo permanently).
      // Invites created via the Schedule drawer are kept as stored.
      const seededExtIds = new Set(initialState.externalInvites.map(i => i.id));
      const userExtInvites: ExternalInvite[] = (parsed.externalInvites || []).filter(
        (i: ExternalInvite) => !seededExtIds.has(i.id)
      );
      const mergedExtInvites = [...initialState.externalInvites, ...userExtInvites];

      return {
        ...parsed,
        jobs: mergedJobs,
        applications: mergedApps,
        candidates: mergedCandidates,
        invites: mergedInvites,
        externalInvites: mergedExtInvites,
        portalConfig: {
          ...initialState.portalConfig,
          ...(parsed.portalConfig ?? {}),
          appearance: {
            ...initialState.portalConfig.appearance,
            ...(parsed.portalConfig?.appearance ?? {}),
            // Brand name / colour / hero are system-set for this MindInventory prototype,
            // so always force the defaults (overriding any stale saved values)
            portalName: initialState.portalConfig.appearance.portalName,
            brandColor: initialState.portalConfig.appearance.brandColor,
            heroEnabled: initialState.portalConfig.appearance.heroEnabled,
            heroImageUrl: initialState.portalConfig.appearance.heroImageUrl,
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

  // Candidate declines an offer from the career portal. Acceptance stays
  // recruiter-driven (or happens by signing), so this is the one offer action
  // the candidate can take directly.
  const declineOffer = (id: string, reason?: string) => {
    setState(prev => ({
      ...prev,
      applications: prev.applications.map(a =>
        a.id === id
          ? {
              ...a,
              status: 'Offer Declined' as const,
              offer: a.offer
                ? {
                    ...a.offer,
                    declinedAt: new Date().toISOString(),
                    declineReason: reason,
                    signature: a.offer.signature
                      ? { ...a.offer.signature, status: 'declined' as const }
                      : undefined,
                  }
                : undefined,
            }
          : a
      ),
    }));
  };

  // Candidate accepts a manual/verbal offer from the career portal. The
  // digital-sign flow has no separate accept — signing the letter is the
  // acceptance — so this only applies where there is no signature.
  const acceptOffer = (id: string) => {
    setState(prev => ({
      ...prev,
      applications: prev.applications.map(a =>
        a.id === id
          ? {
              ...a,
              status: 'Offer Accepted' as const,
              offer: a.offer ? { ...a.offer, acceptedAt: new Date().toISOString() } : undefined,
            }
          : a
      ),
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

  const addExternalPanelists = (newInvites: ExternalInvite[]) => {
    setState(prev => ({
      ...prev,
      externalInvites: [...prev.externalInvites, ...newInvites],
    }));
  };

  const submitExternalAvailability = (token: string, availability: ExternalAvailability) => {
    setState(prev => ({
      ...prev,
      externalInvites: prev.externalInvites.map(inv =>
        inv.accessToken === token
          ? {
              ...inv,
              status: (availability.available ? 'Availability Confirmed' : 'Availability Declined') as ExternalInviteStatus,
              availability,
            }
          : inv
      ),
    }));
  };

  const submitExternalFeedback = (token: string, feedback: ExternalFeedback) => {
    setState(prev => ({
      ...prev,
      externalInvites: prev.externalInvites.map(inv =>
        inv.accessToken === token
          ? { ...inv, status: 'Feedback Submitted' as ExternalInviteStatus, feedback }
          : inv
      ),
    }));
  };

  const cancelExternalInvite = (id: string) => {
    setState(prev => ({
      ...prev,
      externalInvites: prev.externalInvites.map(inv =>
        inv.id === id ? { ...inv, status: 'Cancelled' as ExternalInviteStatus } : inv
      ),
    }));
  };

  const resendExternalInvite = (id: string) => {
    setState(prev => ({
      ...prev,
      externalInvites: prev.externalInvites.map(inv =>
        inv.id === id
          // Re-sending only re-activates a cancelled invite; an active panelist's
          // progress (Availability Confirmed / Feedback Submitted) is never reset.
          ? { ...inv, status: (inv.status === 'Cancelled' ? 'Invited' : inv.status) as ExternalInviteStatus }
          : inv
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
        acceptOffer,
        declineOffer,
        updatePortalConfig,
        sendInvite,
        updateInviteStatus,
        updateCandidateAvailability,
        blacklistCandidate,
        discardCandidate,
        addExternalPanelists,
        submitExternalAvailability,
        submitExternalFeedback,
        cancelExternalInvite,
        resendExternalInvite,
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
