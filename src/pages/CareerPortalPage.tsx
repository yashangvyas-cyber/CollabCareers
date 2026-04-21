import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CRMLayout from '../components/CRMLayout';
import {
  Code2, Copy, CheckCheck, ExternalLink,
  ChevronDown, ChevronUp, Globe, ChevronRight,
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
}: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
      {/* Section header */}
      <button
        onClick={() => setOpen(!open)}
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

      {/* Section body */}
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
  const slug = 'my-inventory';
  const portalBase = 'careers.collabcrm.com';

  const [portalEnabled, setPortalEnabled] = useState(true);
  const [copied, setCopied] = useState(false);

  const fullUrl = `${portalBase}/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CRMLayout
      breadcrumbs={[
        { label: 'Config', path: '/crm/config' },
        { label: 'Career Portal' },
      ]}
    >
      <div className="flex gap-6">
        {/* LEFT: Module Sidebar — same as OperationalConfigPage */}
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

        {/* ── Branded globe icon section placeholder (Global Appearance) ─── */}
        <Section
          title="Branding & Appearance"
          description="Customise the look of your public career portal"
          icon={Globe}
          defaultOpen={false}
        >
          <p className="text-sm text-[#9CA3AF]">
            Branding settings coming soon — logo, colours, and banner images.
          </p>
        </Section>

          {/* More sections can be added here following the same <Section> pattern */}

          </div> {/* end flex-col gap-4 */}
        </div> {/* end right column */}
      </div> {/* end outer flex */}
    </CRMLayout>
  );
}
