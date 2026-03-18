import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AddJobPage from './pages/AddJobPage';
import CandidateDetailPage from './pages/CandidateDetailPage';
import CareerPage from './pages/CareerPage';
import JobDetailPage from './pages/JobDetailPage';
import RegisterPage from './pages/RegisterPage';
import ApplicationFormPage from './pages/ApplicationFormPage';
import ConfirmationPage from './pages/ConfirmationPage';
import CandidateProfilePage from './pages/CandidateProfilePage';
import AlumniApplicationPage from './pages/AlumniApplicationPage';
import CandidateListingPage from './pages/CandidateListingPage';
import FlowMapPage from './pages/FlowMapPage';
import HandoffPage from './pages/HandoffPage';
import PrototypeHome from './pages/PrototypeHome';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<PrototypeHome />} />
        {/* Flow 1: Recruiter (CRM) */}
        <Route path="/crm/add-job" element={<AddJobPage />} />
        <Route path="/crm/candidates/:candidateId" element={<CandidateDetailPage />} />
        <Route path="/crm/candidates" element={<CandidateListingPage />} />
        {/* Unified Career Portal (Flows 2+3+4) */}
        <Route path="/portal/:slug" element={<CareerPage />} />
        <Route path="/portal/:slug/job/:jobId" element={<JobDetailPage />} />
        <Route path="/portal/:slug/register" element={<RegisterPage />} />
        <Route path="/portal/:slug/apply/:jobId" element={<ApplicationFormPage />} />
        <Route path="/portal/:slug/confirmation/:jobId" element={<ConfirmationPage />} />
        <Route path="/portal/:slug/profile" element={<CandidateProfilePage />} />
        <Route path="/portal/:slug/alumni/apply/:jobId" element={<AlumniApplicationPage />} />
        {/* Flow 5: Stitching */}
        <Route path="/flow-map" element={<FlowMapPage />} />
        <Route path="/handoff" element={<HandoffPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
