import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, Users, MessageSquare,
  Settings, Clock, ChevronLeft, Search, Bell, CheckSquare,
  Menu
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Jobs', icon: Briefcase, path: '/crm/add-job', hasAdd: true },
  { name: 'Candidates', icon: Users, path: '/crm/candidates', hasAdd: true },
  { name: 'Interviews', icon: MessageSquare, path: '#' },
  { name: 'Config', icon: Settings, path: '/crm/config' },
  { name: 'Timeline', icon: Clock, path: '#' },
];

interface CRMLayoutProps {
  children: ReactNode;
  breadcrumbs?: { label: string; path?: string }[];
  title?: string;
  actions?: ReactNode;
}

export default function CRMLayout({ children, breadcrumbs, title, actions }: CRMLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F4F5FA] flex">
      {/* Sidebar */}
      <aside className="w-[150px] bg-[#3538CD] text-white flex flex-col shrink-0 fixed top-0 left-0 h-screen z-30">
        {/* Logo */}
        <div className="px-4 py-4 flex items-center gap-2 border-b border-white/10">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold">CollabCRM</span>
            <span className="text-[10px] block text-white/60">Recruitment</span>
          </div>
        </div>

        {/* Staging Badge */}
        <div className="px-4 pt-3 pb-2">
          <span className="bg-red-500 text-[10px] font-bold uppercase px-2 py-0.5 rounded text-white tracking-wider">Staging</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path) && item.path !== '/';
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
                {item.hasAdd && (
                  <span className="ml-auto w-5 h-5 rounded bg-white/10 flex items-center justify-center text-xs text-white/60">+</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse */}
        <div className="px-4 py-3 border-t border-white/10">
          <button className="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Collapse</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-[150px]">
        {/* Top Bar */}
        <header className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button className="text-[#6B7280] lg:hidden">
              <Menu className="w-5 h-5" />
            </button>
            {breadcrumbs && (
              <nav className="flex items-center gap-1.5 text-sm">
                <Link to="/" className="text-[#6B7280] hover:text-primary">
                  <LayoutDashboard className="w-4 h-4" />
                </Link>
                {breadcrumbs.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span className="text-[#D1D5DB]">›</span>
                    {crumb.path ? (
                      <Link to={crumb.path} className="text-[#6B7280] hover:text-primary">{crumb.label}</Link>
                    ) : (
                      <span className="text-primary font-medium">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search people by name, email, code..."
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg pl-9 pr-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors">
              <CheckSquare className="w-5 h-5 text-[#6B7280]" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">3</span>
            </button>
            <button className="relative p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors">
              <Bell className="w-5 h-5 text-[#6B7280]" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">5</span>
            </button>
            <button className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#292bb0] transition-colors flex items-center gap-1.5">
              New <span className="text-xs">▾</span>
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm">
              YP
            </div>
          </div>
        </header>

        {/* Page Header */}
        {title && (
          <div className="px-6 pt-5 pb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#1A1A2E]">{title}</h1>
            {actions}
          </div>
        )}

        {/* Page Content */}
        <div className="px-6 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
