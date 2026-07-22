import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
// Prototype 1 — Internal side system (CRM / Recruitment)
import AddJobPage from './pages/crm/AddJobPage';
import JobsListingPage from './pages/crm/JobsListingPage';
import CRMJobDetailPage from './pages/crm/CRMJobDetailPage';
import CandidateDetailPage from './pages/crm/CandidateDetailPage';
import JobApplicationsPage from './pages/crm/JobApplicationsPage';
import OperationalConfigPage from './pages/crm/OperationalConfigPage';
import CareerPortalPage from './pages/crm/CareerPortalPage';
import TalentPoolPage from './pages/crm/TalentPoolPage';
import TalentPoolDetailsPage from './pages/crm/TalentPoolDetailsPage';
import AddTalentPage from './pages/crm/AddTalentPage';
import EmployeeDetailPage from './pages/crm/EmployeeDetailPage';
// Prototype 2 — Career Portal (candidate-facing)
import CareerPage from './pages/portal/CareerPage';
import JobDetailPage from './pages/portal/JobDetailPage';
import ApplicationFormPage from './pages/portal/ApplicationFormPage';
import ConfirmationPage from './pages/portal/ConfirmationPage';
import CandidateProfilePage from './pages/portal/CandidateProfilePage';
import EditProfilePage from './pages/portal/EditProfilePage';
import AlumniApplicationPage from './pages/portal/AlumniApplicationPage';
import ViewApplicationPage from './pages/portal/ViewApplicationPage';
import ResetPasswordPage from './pages/portal/ResetPasswordPage';
// Prototype 3 — External Panelist (token-gated, login-free)
import PanelistPage from './pages/panelist/PanelistPage';
import PanelistEmailPage from './pages/panelist/PanelistEmailPage';
// Shared / meta
import FlowMapPage from './pages/FlowMapPage';
import HandoffPage from './pages/HandoffPage';
import PrototypeHome from './pages/PrototypeHome';
import DeviceSimulator from './components/DeviceSimulator';

/** Wraps all Career Portal routes with the device simulator */
function PortalShell() {
  return (
    <DeviceSimulator>
      <Outlet />
    </DeviceSimulator>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<PrototypeHome />} />
        {/* Flow 1: Recruiter (CRM) — no simulator */}
        <Route path="/crm/jobs" element={<JobsListingPage />} />
        <Route path="/crm/jobs/:jobId" element={<CRMJobDetailPage />} />
        <Route path="/crm/add-job" element={<AddJobPage />} />
        <Route path="/crm/candidates/:candidateId" element={<CandidateDetailPage />} />
        <Route path="/crm/employees/:empId" element={<EmployeeDetailPage />} />
        <Route path="/crm/candidates" element={<JobApplicationsPage />} />
        <Route path="/crm/talent-pool/add" element={<AddTalentPage />} />
        <Route path="/crm/talent-pool/:candidateId" element={<TalentPoolDetailsPage />} />
        <Route path="/crm/talent-pool" element={<TalentPoolPage />} />
        <Route path="/crm/config" element={<OperationalConfigPage />} />
        <Route path="/crm/career-portal" element={<CareerPortalPage />} />
        {/* External Panelist — public, no auth, no simulator */}
        <Route path="/panel/:token" element={<PanelistPage />} />
        <Route path="/panel-email/:token" element={<PanelistEmailPage />} />
        {/* Unified Career Portal (Flows 2+3+4) — with device simulator */}
        <Route element={<PortalShell />}>
          <Route path="/portal/:slug" element={<CareerPage />} />
          <Route path="/portal/:slug/job/:jobId" element={<JobDetailPage />} />
          <Route path="/portal/:slug/register" element={<CareerPage openRegister={true} />} />
          <Route path="/portal/:slug/apply/:jobId" element={<ApplicationFormPage />} />
          <Route path="/portal/:slug/confirmation/:jobId" element={<ConfirmationPage />} />
          <Route path="/portal/:slug/profile" element={<CandidateProfilePage />} />
          <Route path="/portal/:slug/profile/edit" element={<EditProfilePage />} />
          <Route path="/portal/:slug/application/:applicationId" element={<ViewApplicationPage />} />
          <Route path="/portal/:slug/alumni-verify" element={<CareerPage openAlumni={true} />} />
          <Route path="/portal/:slug/alumni/apply/:jobId" element={<AlumniApplicationPage />} />
          <Route path="/portal/:slug/reset-password/:token" element={<ResetPasswordPage />} />
        </Route>
        {/* Flow 5: Stitching */}
        <Route path="/flow-map" element={<FlowMapPage />} />
        <Route path="/handoff" element={<HandoffPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

