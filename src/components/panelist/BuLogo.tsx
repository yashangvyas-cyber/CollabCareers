import { ResolvedBranding } from '../../lib/businessUnits';

/** BU wordmark when a logo asset exists, otherwise the initials tile + name. */
export default function BuLogo({ brand }: { brand: ResolvedBranding }) {
  if (brand.logoUrl) {
    return <img src={brand.logoUrl} alt={brand.name} className="h-10" />;
  }
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0"
        style={{ backgroundColor: brand.brandColor, color: brand.brandText }}
      >
        {brand.initials}
      </div>
      <p className="text-base font-bold text-[#111827] leading-tight">{brand.name}</p>
    </div>
  );
}
