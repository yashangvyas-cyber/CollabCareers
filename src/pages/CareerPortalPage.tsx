import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import { useApp } from '../store/AppContext';
import {
  Code2, Copy, CheckCheck, ExternalLink,
  ChevronDown, ChevronUp, ChevronRight,
  SlidersHorizontal, Search, MapPin, Briefcase, TrendingUp, Wifi, Link2,
  AlertTriangle, ShieldCheck,
} from 'lucide-react';

const moduleItems = [
  { name: 'Job Templates', count: 5 },
  { name: 'Employment Types', count: 9 },
  { name: 'Interview Rounds', count: 11 },
  { name: 'Sources', count: 14 },
  { name: 'Job Types', count: 6 },
  { name: 'Operational Config', count: null, path: '/crm/config' },
  { name: 'Career Portal', count: null, active: true, path: '/crm/career-portal' },
];

// ─── Types ───────────────────────────────────────────────────────────────────
interface SectionProps {
  title: string;
  description?: string;
  icon: React.ElementType;
  iconBg?: string;
  iconColor?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  // Controlled open (optional)
  isOpen?: boolean;
  onToggle?: (next: boolean) => void;
}

// ─── Reusable collapsible section ────────────────────────────────────────────
function Section({
  title,
  description,
  icon: Icon,
  iconBg = 'bg-[#3538CD]/10',
  iconColor = 'text-[#3538CD]',
  children,
  defaultOpen = true,
  isOpen: controlledOpen,
  onToggle,
}: SectionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleToggle = () => {
    if (onToggle) onToggle(!open);
    else setInternalOpen(v => !v);
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-[#1A1A2E]">{title}</h3>
            {description && (
              <p className="text-xs text-[#6B7280] mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#6B7280] transition-colors shrink-0" />
          : <ChevronDown className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#6B7280] transition-colors shrink-0" />
        }
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-[#F3F4F6]">
          <div className="pt-5">{children}</div>
        </div>
      )}
    </div>
  );
}

// ─── Toggle component ─────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-pressed={checked}
      className={`relative inline-flex w-11 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3538CD]/40 shrink-0 ${
        checked ? 'bg-[#3538CD]' : 'bg-[#D1D5DB]'
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CareerPortalPage() {
  const navigate = useNavigate();
  const { portalConfig, updatePortalConfig } = useApp();
  const slug = 'mindinventory';
  const portalBase = 'careers.collabcrm.com';

  const [portalEnabled, setPortalEnabled] = useState(true);
  const [copied, setCopied] = useState(false);

  // Footer social links — local state only
  const [footerLinks, setFooterLinks] = useState<Record<string, string>>({
    linkedin: '', twitter: '', instagram: '', facebook: '', youtube: '',
  });

  // Legal links — local state, committed to context only on Save
  const [localTermsUrl, setLocalTermsUrl] = useState(portalConfig?.termsUrl || '');
  const [localPrivacyUrl, setLocalPrivacyUrl] = useState(portalConfig?.privacyPolicyUrl || '');

  // Footer section controlled open state (so we can force it open on validation error)
  const [footerOpen, setFooterOpen] = useState(false);

  // Save state
  const [saveAttempted, setSaveAttempted] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const termsRef = useRef<HTMLInputElement>(null);

  // Job filter toggles
  const [filterLocation, setFilterLocation] = useState(true);
  const [filterEmploymentType, setFilterEmploymentType] = useState(true);
  const [filterExperienceLevel, setFilterExperienceLevel] = useState(false);
  const [filterWorkMode, setFilterWorkMode] = useState(true);

  const fullUrl = `${portalBase}/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setSaveAttempted(true);
    setSaveError('');
    // Validation: portal enabled requires T&C URL
    if (portalEnabled && !localTermsUrl.trim()) {
      setSaveError('Terms & Conditions URL is required when the portal is enabled.');
      setFooterOpen(true); // force open footer section
      setTimeout(() => {
        termsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        termsRef.current?.focus();
      }, 100);
      return;
    }
    // Commit to context
    updatePortalConfig({ termsUrl: localTermsUrl.trim(), privacyPolicyUrl: localPrivacyUrl.trim() });
    setSaveSuccess(true);
    setSaveAttempted(false);
    setSaveError('');
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setLocalTermsUrl(portalConfig?.termsUrl || '');
    setLocalPrivacyUrl(portalConfig?.privacyPolicyUrl || '');
    setSaveAttempted(false);
    setSaveError('');
  };

  return (
    <CRMLayout
      breadcrumbs={[
        { label: 'Config', path: '/crm/config' },
        { label: 'Career Portal' },
      ]}
    >
      <div className="flex gap-6 pt-4">
        {/* LEFT: Module Sidebar */}
        <div className="w-[220px] shrink-0">
          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#1A1A2E]">Module</h3>
              <button className="text-[#9CA3AF] hover:text-[#6B7280]">
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
            <nav className="py-1">
              {moduleItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => item.path && navigate(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                    item.active
                      ? 'bg-[#3538CD]/5 text-[#3538CD] font-semibold border-l-2 border-[#3538CD]'
                      : 'text-[#374151] hover:bg-[#F9FAFB] font-medium'
                  }`}
                >
                  <span>{item.name}</span>
                  <div className="flex items-center gap-1.5">
                    {item.count != null && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        item.active ? 'bg-[#3538CD]/10 text-[#3538CD]' : 'bg-[#F3F4F6] text-[#9CA3AF]'
                      }`}>
                        {item.count}
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* RIGHT: Career Portal content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-4">

          {/* ── Page sub-header: title + Save / Cancel ─────────────────── */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm px-5 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-sm font-bold text-[#1A1A2E]">Career Portal</span>
              {saveError && (
                <div className="flex items-center gap-1.5 text-red-600">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-semibold truncate">{saveError}</span>
                </div>
              )}
              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-semibold">Settings saved</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={handleCancel}
                className="px-4 py-1.5 text-sm font-semibold text-[#6B7280] bg-white border border-[#E5E7EB] rounded-lg hover:border-[#D1D5DB] hover:text-[#374151] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-1.5 text-sm font-black text-white bg-[#3538CD] rounded-lg hover:bg-[#292bb0] transition-colors shadow-sm"
              >
                Save
              </button>
            </div>
          </div>

          {/* ── Section 1: Portal URL ──────────────────────────────────────── */}
          <Section
          title="Portal URL"
          description="Share this link so candidates can browse your jobs"
          icon={Code2}
        >
          {/* URL row */}
          <div className="mb-5">
            <label className="text-xs font-medium text-[#374151] mb-2 block">
              Your portal link
            </label>
            <div className="flex items-center gap-2">
              {/* Base domain chip */}
              <div className="flex items-center border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] px-3 py-2.5 text-sm text-[#9CA3AF] font-medium shrink-0 select-none">
                {portalBase}&nbsp;/
              </div>
              {/* Slug chip */}
              <div className="flex items-center border border-[#3538CD]/20 rounded-lg bg-[#3538CD]/5 px-3 py-2.5 text-sm font-semibold text-[#3538CD] shrink-0 select-none">
                {slug}
              </div>
              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="ml-auto flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[#374151] bg-white border border-[#E5E7EB] rounded-lg hover:border-[#3538CD]/30 hover:text-[#3538CD] transition-colors shadow-sm"
              >
                {copied
                  ? <><CheckCheck className="w-4 h-4 text-green-500" /> Copied!</>
                  : <><Copy className="w-4 h-4" /> Copy link</>
                }
              </button>
              {/* Open in new tab */}
              <a
                href={`/portal/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#3538CD]/30 hover:text-[#3538CD] text-[#9CA3AF] transition-colors shadow-sm"
                title="Open portal"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Portal enabled toggle */}
          <div className="flex items-start justify-between pt-4 border-t border-[#F3F4F6]">
            <div>
              <p className="text-sm font-medium text-[#1A1A2E]">Portal enabled</p>
              <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                When off, the page shows a{' '}
                <span className="font-medium text-[#374151]">"not available"</span>{' '}
                message to visitors
              </p>
            </div>
            <Toggle
              checked={portalEnabled}
              onChange={() => setPortalEnabled(v => !v)}
            />
          </div>

          {/* Disabled state hint */}
          {!portalEnabled && (
            <div className="mt-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700 font-medium">
                Your portal is currently disabled. Visitors will see a "not available" page until you re-enable it.
              </p>
            </div>
          )}
        </Section>


          {/* ── Section 2: Job Filters ────────────────────────────────────── */}
          <Section
            title="Job Filters"
            description="Choose which filters appear on your career landing page"
            icon={SlidersHorizontal}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
            defaultOpen={true}
          >
            <div className="flex flex-col divide-y divide-[#F3F4F6]">

              {/* Keyword Search — always on */}
              <div className="flex items-center justify-between py-3 first:pt-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#3538CD]/10 flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4 text-[#3538CD]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">Keyword search</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Always visible — cannot be turned off</p>
                  </div>
                </div>
                <div title="This filter cannot be disabled" className="cursor-not-allowed opacity-50">
                  <Toggle checked={true} onChange={() => {}} />
                </div>
              </div>

              {/* Location filter */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    filterLocation ? 'bg-[#3538CD]/10' : 'bg-[#F3F4F6]'
                  }`}>
                    <MapPin className={`w-4 h-4 transition-colors ${
                      filterLocation ? 'text-[#3538CD]' : 'text-[#9CA3AF]'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">Location filter</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Lets candidates filter jobs by city or region</p>
                  </div>
                </div>
                <Toggle checked={filterLocation} onChange={() => setFilterLocation(v => !v)} />
              </div>

              {/* Employment Type filter */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    filterEmploymentType ? 'bg-[#3538CD]/10' : 'bg-[#F3F4F6]'
                  }`}>
                    <Briefcase className={`w-4 h-4 transition-colors ${
                      filterEmploymentType ? 'text-[#3538CD]' : 'text-[#9CA3AF]'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">Employment type</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Full-time, part-time, contract, internship, etc.</p>
                  </div>
                </div>
                <Toggle checked={filterEmploymentType} onChange={() => setFilterEmploymentType(v => !v)} />
              </div>

              {/* Experience Level filter */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    filterExperienceLevel ? 'bg-[#3538CD]/10' : 'bg-[#F3F4F6]'
                  }`}>
                    <TrendingUp className={`w-4 h-4 transition-colors ${
                      filterExperienceLevel ? 'text-[#3538CD]' : 'text-[#9CA3AF]'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">Experience level</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Entry, mid, senior, lead, etc.</p>
                  </div>
                </div>
                <Toggle checked={filterExperienceLevel} onChange={() => setFilterExperienceLevel(v => !v)} />
              </div>

              {/* Work Mode filter */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    filterWorkMode ? 'bg-[#3538CD]/10' : 'bg-[#F3F4F6]'
                  }`}>
                    <Wifi className={`w-4 h-4 transition-colors ${
                      filterWorkMode ? 'text-[#3538CD]' : 'text-[#9CA3AF]'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">Job type</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Remote, hybrid, on-site, etc.</p>
                  </div>
                </div>
                <Toggle checked={filterWorkMode} onChange={() => setFilterWorkMode(v => !v)} />
              </div>

            </div>
          </Section>

          {/* ── Section 3: Footer Customization ──────────────────────────── */}
          <Section
            title="Footer Customization"
            description="Configure links shown in your career portal footer and registration form"
            icon={Link2}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            isOpen={footerOpen}
            onToggle={setFooterOpen}
          >
            <div className="space-y-6">

              {/* ── Legal Links — top, mandatory ─────────────────────────── */}
              <div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider">
                    Legal &amp; Policy Links
                  </h4>
                </div>

                {/* Mandatory registration info banner */}
                <div className="flex items-start gap-2.5 bg-[#3538CD]/5 border border-[#3538CD]/15 rounded-lg px-3.5 py-2.5 mb-4">
                  <ShieldCheck className="w-4 h-4 text-[#3538CD] mt-0.5 shrink-0" />
                  <p className="text-xs text-[#3538CD] font-medium leading-relaxed">
                    These links are shown in the <strong>candidate registration form</strong> checkbox — T&amp;C is mandatory for the portal to accept registrations.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* T&C — required */}
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="w-36 shrink-0 text-xs font-semibold text-[#374151]">
                        Terms &amp; Conditions <span className="text-red-500">*</span>
                      </span>
                      <input
                        ref={termsRef}
                        type="url"
                        placeholder="https://yoursite.com/terms (required when portal is enabled)"
                        value={localTermsUrl}
                        onChange={e => {
                          setLocalTermsUrl(e.target.value);
                          if (saveError) setSaveError('');
                        }}
                        className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3538CD]/20 focus:border-[#3538CD] bg-white placeholder:text-[#D1D5DB] text-[#111827] ${
                          saveAttempted && portalEnabled && !localTermsUrl.trim()
                            ? 'border-red-300 bg-red-50/30 focus:ring-red-200 focus:border-red-400'
                            : 'border-[#E5E7EB]'
                        }`}
                      />
                    </div>
                    {saveAttempted && portalEnabled && !localTermsUrl.trim() && (
                      <div className="flex items-center gap-1.5 mt-1.5 ml-40">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        <p className="text-[10px] text-red-500 font-semibold">Required when portal is enabled</p>
                      </div>
                    )}
                  </div>

                  {/* Privacy Policy — optional */}
                  <div className="flex items-center gap-4">
                    <span className="w-36 shrink-0 text-xs font-medium text-[#6B7280]">
                      Privacy Policy <span className="text-[10px] text-[#9CA3AF]">(optional)</span>
                    </span>
                    <input
                      type="url"
                      placeholder="https://yoursite.com/privacy-policy"
                      value={localPrivacyUrl}
                      onChange={e => setLocalPrivacyUrl(e.target.value)}
                      className="flex-1 border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3538CD]/20 focus:border-[#3538CD] bg-white placeholder:text-[#D1D5DB] text-[#111827]"
                    />
                  </div>
                </div>
              </div>

              {/* ── Social Media Links ───────────────────────────────────── */}
              <div className="pt-4 border-t border-[#F3F4F6]">
                <h4 className="text-xs font-semibold text-[#374151] uppercase tracking-wider mb-3">Social Media Links</h4>
                <div className="space-y-3">
                  {([
                    { platform: 'LinkedIn', key: 'linkedin', placeholder: 'https://linkedin.com/company/your-company' },
                    { platform: 'Twitter / X', key: 'twitter', placeholder: 'https://twitter.com/yourhandle' },
                    { platform: 'Instagram', key: 'instagram', placeholder: 'https://instagram.com/yourhandle' },
                    { platform: 'Facebook', key: 'facebook', placeholder: 'https://facebook.com/yourpage' },
                    { platform: 'YouTube', key: 'youtube', placeholder: 'https://youtube.com/@yourchannel' },
                  ] as { platform: string; key: string; placeholder: string }[]).map(({ platform, key, placeholder }) => (
                    <div key={key} className="flex items-center gap-4">
                      <span className="w-36 shrink-0 text-xs font-medium text-[#6B7280]">{platform}</span>
                      <input
                        type="url"
                        placeholder={placeholder}
                        value={footerLinks[key] || ''}
                        onChange={(e) => setFooterLinks({ ...footerLinks, [key]: e.target.value })}
                        className="flex-1 border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3538CD]/20 focus:border-[#3538CD] bg-white placeholder:text-[#D1D5DB] text-[#111827]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview hint */}
              <div className="pt-4 border-t border-[#F3F4F6]">
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  Links filled in above will appear in the footer of your career portal. Leave a field blank to hide that link.
                </p>
              </div>
            </div>
          </Section>

          </div> {/* end flex-col gap-4 */}
        </div> {/* end right column */}
      </div> {/* end outer flex */}
    </CRMLayout>
  );
}
