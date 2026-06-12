import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Monitor, Smartphone, Tablet, RotateCcw } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// ── Device presets ──
type DeviceMode = 'desktop' | 'mobile' | 'tablet';

const PRESETS: Record<DeviceMode, { label: string; width: number; height: number }> = {
  desktop: { label: 'Desktop', width: 0, height: 0 },
  mobile: { label: 'iPhone 15 Pro', width: 393, height: 852 },
  tablet: { label: 'iPad Air', width: 820, height: 1180 },
};

// ── Detect if we're inside the simulator iframe ──
function isEmbedded(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

// ── Realistic iOS status bar ──
function StatusBar({ width }: { width: number }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  const timeStr = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <div className="flex items-center justify-between px-8 pt-[14px] pb-0 select-none" style={{ width }}>
      <span className="text-[16px] font-semibold text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', letterSpacing: '-0.02em' }}>
        {timeStr}
      </span>
      <div className="flex items-center gap-[6px]">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><rect x="0.5" y="8" width="3" height="4" rx="1" fill="white"/><rect x="5" y="5" width="3" height="7" rx="1" fill="white"/><rect x="9.5" y="2" width="3" height="10" rx="1" fill="white"/><rect x="14" y="0" width="3" height="12" rx="1" fill="white" opacity="0.3"/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 11a1 1 0 100-2 1 1 0 000 2z" fill="white"/><path d="M5 7.5a4.2 4.2 0 016 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.5 5a7.2 7.2 0 0111 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
        <svg width="28" height="13" viewBox="0 0 28 13" fill="none"><rect x="0.75" y="1" width="22" height="11" rx="2.5" stroke="white" strokeWidth="1" opacity="0.35"/><rect x="2.25" y="2.5" width="17.5" height="8" rx="1.5" fill="white"/><path d="M24.5 5c.9.4.9 3.2 0 3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/></svg>
      </div>
    </div>
  );
}

// ── Floating toolbar ──
function Toolbar({ mode, onChange }: { mode: DeviceMode; onChange: (m: DeviceMode) => void }) {
  const icons: Record<DeviceMode, ReactNode> = {
    desktop: <Monitor className="w-4 h-4" />,
    mobile: <Smartphone className="w-4 h-4" />,
    tablet: <Tablet className="w-4 h-4" />,
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[99999]" style={{ animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <div className="flex items-center gap-1 bg-[#0f0f1a]/95 backdrop-blur-2xl rounded-2xl p-1.5 shadow-2xl border border-white/[0.08]"
        style={{ boxShadow: '0 20px 60px -15px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)' }}>
        {(Object.keys(PRESETS) as DeviceMode[]).map((key) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-[0.08em] transition-all duration-300 whitespace-nowrap ${
              mode === key
                ? 'bg-white text-[#0f0f1a] shadow-lg'
                : 'text-white/40 hover:text-white/80 hover:bg-white/[0.07]'
            }`}
          >
            {icons[key]}
            <span className="hidden sm:inline">{key === 'desktop' ? 'Desktop' : key === 'mobile' ? 'Mobile' : 'Tablet'}</span>
          </button>
        ))}

        <div className="w-px h-6 bg-white/[0.08] mx-0.5" />

        {mode !== 'desktop' && (
          <span className="text-[9px] font-bold text-white/25 px-2 hidden lg:block tracking-wide">
            {PRESETS[mode].width}×{PRESETS[mode].height}
          </span>
        )}

        {mode !== 'desktop' && (
          <button
            onClick={() => onChange('desktop')}
            className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.07] transition-all"
            title="Back to desktop"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main component ──
export default function DeviceSimulator({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DeviceMode>('desktop');
  const [scale, setScale] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const location = useLocation();

  const embedded = isEmbedded();

  // If we're inside the iframe, just render children with no simulator
  if (embedded) {
    return <>{children}</>;
  }

  // Auto-scale device to fit viewport
  useEffect(() => {
    if (mode === 'desktop') return;
    const compute = () => {
      const p = PRESETS[mode];
      const aH = window.innerHeight - 160;
      const aW = window.innerWidth - 100;
      const s = Math.min(aH / (p.height + 30), aW / (p.width + 30), 1);
      setScale(Math.max(0.3, Math.round(s * 1000) / 1000));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [mode]);

  // Build iframe URL from current route
  const iframeSrc = location.pathname + location.search;

  // Desktop mode — render inline with just the toolbar
  if (mode === 'desktop') {
    return (
      <>
        {children}
        <Toolbar mode={mode} onChange={setMode} />
      </>
    );
  }

  const preset = PRESETS[mode];
  const isMobile = mode === 'mobile';

  return (
    <>
      {/* Immersive dark backdrop */}
      <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, #1a1a3e 0%, #0a0a1a 50%, #050510 100%)' }}>

        {/* Subtle animated grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        {/* Glow behind device */}
        <div className="absolute pointer-events-none" style={{
          width: preset.width * 1.2,
          height: preset.height * 0.4,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />

        {/* Scaled device */}
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center', transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>

          {/* ── Device shell ── */}
          <div className="relative" style={{
            width: preset.width + (isMobile ? 18 : 16),
            height: preset.height + (isMobile ? 18 : 16),
            borderRadius: isMobile ? 56 : 28,
            background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #111 100%)',
            padding: isMobile ? 9 : 8,
            boxShadow: `
              0 0 0 0.5px rgba(255,255,255,0.08),
              0 50px 100px -20px rgba(0,0,0,0.9),
              0 0 80px -10px rgba(99,102,241,0.08),
              inset 0 1px 1px rgba(255,255,255,0.05)
            `,
          }}>

            {/* Inner bezel */}
            <div className="relative overflow-hidden" style={{
              width: preset.width,
              height: preset.height,
              borderRadius: isMobile ? 47 : 20,
              background: '#000',
            }}>

              {/* Dynamic Island (iPhone) */}
              {isMobile && (
                <div className="absolute top-[11px] left-1/2 -translate-x-1/2 z-50">
                  <div className="bg-black rounded-[20px] flex items-center justify-center" style={{ width: 126, height: 37 }}>
                    <div className="absolute right-[22px] w-[12px] h-[12px] rounded-full" style={{
                      background: 'radial-gradient(circle at 40% 40%, #2a2a3e, #0a0a15)',
                      boxShadow: 'inset 0 0 2px rgba(100,100,255,0.15)',
                    }} />
                  </div>
                </div>
              )}

              {/* Status bar */}
              {isMobile && (
                <div className="relative z-40 bg-black" style={{ height: 54 }}>
                  <StatusBar width={preset.width} />
                </div>
              )}

              {/* ── IFRAME: the actual portal rendered at real device width ── */}
              <iframe
                ref={iframeRef}
                src={iframeSrc}
                title="Device Preview"
                className="border-0 bg-white"
                style={{
                  width: preset.width,
                  height: preset.height - (isMobile ? 54 + 34 : 0),
                  display: 'block',
                }}
              />

              {/* Home indicator */}
              {isMobile && (
                <div className="absolute bottom-0 left-0 right-0 z-40 bg-black flex items-center justify-center" style={{ height: 34 }}>
                  <div className="w-[134px] h-[5px] rounded-full bg-white/20" />
                </div>
              )}
            </div>

            {/* Hardware buttons — iPhone */}
            {isMobile && (
              <>
                {/* Power */}
                <div className="absolute -right-[3px] rounded-r-[2px]" style={{ top: 172, width: 4, height: 86, background: 'linear-gradient(90deg, #2a2a2a, #1a1a1a)', boxShadow: '1px 0 3px rgba(0,0,0,0.4)' }} />
                {/* Silent switch */}
                <div className="absolute -left-[3px] rounded-l-[2px]" style={{ top: 148, width: 4, height: 30, background: 'linear-gradient(270deg, #2a2a2a, #1a1a1a)', boxShadow: '-1px 0 3px rgba(0,0,0,0.4)' }} />
                {/* Volume up */}
                <div className="absolute -left-[3px] rounded-l-[2px]" style={{ top: 196, width: 4, height: 60, background: 'linear-gradient(270deg, #2a2a2a, #1a1a1a)', boxShadow: '-1px 0 3px rgba(0,0,0,0.4)' }} />
                {/* Volume down */}
                <div className="absolute -left-[3px] rounded-l-[2px]" style={{ top: 268, width: 4, height: 60, background: 'linear-gradient(270deg, #2a2a2a, #1a1a1a)', boxShadow: '-1px 0 3px rgba(0,0,0,0.4)' }} />
              </>
            )}

            {/* Specular highlight */}
            <div className="absolute inset-0 pointer-events-none" style={{
              borderRadius: isMobile ? 56 : 28,
              background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, transparent 30%)',
            }} />
          </div>
        </div>
      </div>

      <Toolbar mode={mode} onChange={setMode} />

      {/* Keyframe for toolbar entrance */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </>
  );
}
