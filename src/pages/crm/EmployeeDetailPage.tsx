import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mail, User, CheckCircle, ChevronRight, Briefcase,
  ChevronLeft, ArrowRight,
} from 'lucide-react';
import CRMLayout from '../../components/CRMLayout';

type EmployeeMock = {
  name: string;
  designation: string;
  department: string;
  empId: string;
  email: string;
  managerName: string;
  joiningDate: string;
  relievingDate: string;
};

const mockEmployees: Record<string, EmployeeMock> = {
  '1': {
    name: 'Mahesh Patel',
    designation: 'React Developer',
    department: 'Engineering',
    empId: 'MI-EMP-001',
    email: 'mahesh@mindinventory.com',
    managerName: 'Rajan Mehta',
    joiningDate: '2022-01-10',
    relievingDate: '2024-12-31',
  },
  '2': {
    name: 'Priya Shah',
    designation: 'UI/UX Designer',
    department: 'Design',
    empId: 'MI-EMP-002',
    email: 'priya@mindinventory.com',
    managerName: 'Ankit Sharma',
    joiningDate: '2020-03-15',
    relievingDate: '2024-11-30',
  },
};

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm mb-3">
    <div className="flex items-center gap-3 mb-6">
      <h3 className="text-xs font-black text-[#1A1A2E] uppercase tracking-widest whitespace-nowrap">{title}</h3>
      <div className="flex-1 border-t border-[#E5E7EB]" />
    </div>
    {children}
  </div>
);

const Field = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">{label}</span>
    <span className="text-sm font-bold text-[#1A1A2E]">{value || '—'}</span>
  </div>
);

export default function EmployeeDetailPage() {
  const { empId } = useParams<{ empId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const emp = empId ? mockEmployees[empId] : undefined;

  const getExperience = (from: string, to: string) => {
    const start = new Date(from);
    const end = new Date(to);
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    if (months < 0) { years--; months += 12; }
    return `${years}Y ${months}M`;
  };

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const tabs = [
    { id: 'general',  label: 'General Info' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'assets',   label: 'Assets Allocated' },
    { id: 'performance', label: 'Performance' },
  ];

  const initials = emp
    ? emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <CRMLayout
      breadcrumbs={[
        { label: 'Job Applications', path: '/crm/candidates' },
        { label: emp?.name ?? 'Employee', path: empId ? `/crm/candidates/${empId}` : '/crm/candidates' },
        { label: 'Employee Profile' },
      ]}
    >
      {!emp ? (
        <div className="flex items-center justify-center py-32 text-[#6B7280] text-sm font-medium">
          Employee record not found.
        </div>
      ) : (
        <div className="flex divide-x divide-[#E5E7EB] bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">

          {/* SIDEBAR */}
          {!sidebarCollapsed ? (
            <div className="bg-white overflow-y-auto relative group flex-shrink-0 w-52 flex flex-col border-r border-[#E5E7EB]">
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-8 h-8 border border-[#E5E7EB] rounded-md flex items-center justify-center hover:bg-[#F9FAFB] bg-white"
              >
                <ChevronLeft className="h-4 w-4 text-[#6B7280]" />
              </button>

              <div className="pt-2 flex flex-col flex-1">
                <div className="px-3 mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-wider bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                    Alumni
                  </span>
                </div>

                <div className="p-4 text-center border-b border-[#E5E7EB] flex flex-col items-center">
                  <div className="w-[80px] h-[80px] rounded-full bg-[#3538CD]/5 border-4 border-white shadow-sm flex items-center justify-center text-[#3538CD] font-black text-2xl">
                    {initials}
                  </div>
                  <p className="text-[#111827] font-semibold text-sm mt-3 leading-snug">{emp.name}</p>
                  <p className="text-[#6B7280] text-xs mt-0.5">{emp.designation}</p>
                  <span className="mt-2 text-[11px] font-medium px-2 py-0.5 rounded-lg border border-[#E5E7EB] text-[#374151]">
                    {emp.department}
                  </span>
                </div>

                <div className="p-3 border-b border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] font-medium">Tenure at Company</p>
                  <p className="text-xs text-[#111827] mt-2 font-semibold">
                    {getExperience(emp.joiningDate, emp.relievingDate)}
                  </p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">
                    {fmtDate(emp.joiningDate)} – {fmtDate(emp.relievingDate)}
                  </p>
                </div>

                <div className="p-3 border-b border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] font-medium">Department</p>
                  <p className="text-xs text-[#111827] mt-2">{emp.department}</p>
                </div>

                <div className="flex-1" />
              </div>
            </div>
          ) : (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="bg-white border-r border-[#E5E7EB] flex items-start pt-3 px-1.5 hover:bg-[#F9FAFB] transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-[#9CA3AF]" />
            </button>
          )}

          {/* MAIN CONTENT */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">

            {/* Tab bar */}
            <div className="bg-white py-1.5 px-3 flex justify-between items-center min-h-11 shrink-0 border-b border-[#E5E7EB]">
              <nav className="flex items-center gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`min-w-fit text-xs font-semibold whitespace-nowrap py-1.5 px-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'text-[#3538CD] bg-[#EEF4FF]'
                        : 'text-[#6B7280] hover:text-[#374151] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
              <button
                onClick={() => navigate(empId ? `/crm/candidates/${empId}` : '/crm/candidates')}
                className="text-xs font-semibold text-[#6B7280] hover:text-[#374151] border border-[#E5E7EB] px-3 py-1.5 rounded-lg hover:bg-[#F9FAFB] transition-colors"
              >
                Back to Applicant
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4">

              {activeTab === 'general' && (
                <div>
                  {/* Quick info bar */}
                  <div className="bg-white border border-[#E5E7EB] rounded-xl grid grid-cols-3 mb-3 overflow-hidden">
                    <div className="border-r border-[#E5E7EB] p-3">
                      <div className="mb-2">
                        <a href={`mailto:${emp.email}`} className="border border-[#E5E7EB] rounded-md flex items-center justify-center w-fit hover:bg-[#F9FAFB]">
                          <Mail className="h-4 w-4 text-[#374151] m-1.5" />
                        </a>
                      </div>
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Email Address</p>
                      <p className="text-xs font-semibold mt-1 break-all text-[#111827]">{emp.email}</p>
                    </div>
                    <div className="border-r border-[#E5E7EB] p-3">
                      <div className="border border-[#E5E7EB] rounded-md flex items-center justify-center w-fit mb-2">
                        <User className="h-4 w-4 text-[#374151] m-1.5" />
                      </div>
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Employee Code</p>
                      <p className="text-xs font-semibold mt-1 text-[#111827]">{emp.empId}</p>
                    </div>
                    <div className="p-3">
                      <div className="w-7 h-7 rounded-full bg-[#3538CD]/10 flex items-center justify-center text-[#3538CD] font-black text-xs mb-2">
                        {emp.managerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Reporting Manager</p>
                      <p className="text-xs font-semibold mt-1 text-[#111827]">{emp.managerName}</p>
                    </div>
                  </div>

                  <SectionCard title="Personal Information">
                    <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                      <Field label="First Name" value={emp.name.split(' ')[0]} />
                      <Field label="Middle Name" />
                      <Field label="Last Name" value={emp.name.split(' ').slice(1).join(' ') || '—'} />
                      <Field label="Gender" />
                      <Field label="Date of Birth" />
                      <Field label="Blood Group" />
                    </div>
                  </SectionCard>

                  <SectionCard title="Employee Information">
                    <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                      <Field label="Employee Code" value={emp.empId} />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Status</span>
                        <span className="inline-flex items-center gap-1.5 border rounded-md mt-1 py-0.5 px-2 text-[10px] font-black uppercase tracking-wider bg-[#FEF3C7] text-[#92400E] border-[#FDE68A] w-fit">
                          <div className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
                          Alumni
                        </span>
                      </div>
                      <Field label="Department" value={emp.department} />
                      <Field label="Designation" value={emp.designation} />
                      <Field label="Reporting To" value={emp.managerName} />
                      <Field label="Employee Type" />
                    </div>
                  </SectionCard>

                  <SectionCard title="Company Contact Information">
                    <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                      <Field label="Company Email Address" value={emp.email} />
                      <Field label="Company Mobile Number" />
                      <Field label="Seating Location" />
                    </div>
                  </SectionCard>

                  <SectionCard title="Experience">
                    <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                      <Field label="Joining Date" value={fmtDate(emp.joiningDate)} />
                      <Field label="Relieving Date" value={fmtDate(emp.relievingDate)} />
                      <Field label="Tenure at Company" value={getExperience(emp.joiningDate, emp.relievingDate)} />
                    </div>
                  </SectionCard>
                </div>
              )}

              {activeTab === 'timeline' && (() => {
                type TLEvent = { date: string; label: string; from?: string; to?: string };
                const events: TLEvent[] = [
                  { date: emp.joiningDate, label: 'Joined' },
                  { date: emp.relievingDate, label: 'Status Changed', from: 'Active', to: 'Relieved' },
                ];
                events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                const STATUS_CLS: Record<string, string> = {
                  Active:   'bg-green-50 text-green-700',
                  Relieved: 'bg-red-50 text-red-700',
                };

                return (
                  <div className="flex flex-col gap-2 w-full py-2">
                    {events.map((ev, idx) => {
                      const isLast = idx === events.length - 1;
                      return (
                        <div key={idx} className="grid grid-cols-[20px_1fr] items-start gap-3">
                          <div className="flex flex-col items-center gap-1 h-full">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-[#D1D5DB] bg-white flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-[#9CA3AF]" />
                            </div>
                            {!isLast && <div className="flex-1 w-0.5 min-h-[24px] bg-[#D1D5DB] rounded-full" />}
                          </div>
                          <div className="pb-1">
                            <div className="border border-[#E5E7EB] bg-[#F9FAFB] rounded-lg p-3 flex flex-col gap-1">
                              <p className="text-xs font-semibold text-[#111827]">{fmtDate(ev.date)}</p>
                              <p className="text-xs text-[#6B7280] capitalize">{ev.label}</p>
                              {ev.from && ev.to && (
                                <div className="flex items-center gap-2 pt-1">
                                  <span className={`rounded-full border border-[#E5E7EB] py-1 px-3 text-xs font-medium ${STATUS_CLS[ev.from] ?? 'bg-white text-[#374151]'}`}>
                                    {ev.from}
                                  </span>
                                  <ArrowRight className="h-3.5 w-3.5 text-[#6B7280] flex-shrink-0" />
                                  <span className={`rounded-full border border-[#E5E7EB] py-1 px-3 text-xs font-medium ${STATUS_CLS[ev.to] ?? 'bg-[#EEF4FF] text-[#3538CD]'}`}>
                                    {ev.to}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {activeTab === 'assets' && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-[#E5E7EB]">
                  <div className="bg-orange-50 p-4 rounded-full mb-4">
                    <Briefcase className="h-8 w-8 text-orange-400" />
                  </div>
                  <p className="text-sm font-semibold text-[#374151]">Assets Allocated</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">No assets allocated to this employee.</p>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-[#E5E7EB]">
                  <div className="w-16 h-16 bg-[#EEF4FF] rounded-2xl flex items-center justify-center mb-4 border border-[#3538CD]/10">
                    <CheckCircle className="h-8 w-8 text-[#3538CD]/40" />
                  </div>
                  <p className="text-sm font-black text-[#1A1A2E] uppercase tracking-tight mb-1">No Performance History</p>
                  <p className="text-xs text-[#9CA3AF] font-medium text-center max-w-xs">
                    No formal reviews or appraisal cycles found for this employee.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </CRMLayout>
  );
}
