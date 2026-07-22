import { readableTextColor } from './theme';

/** Business unit reference data — placeholder addresses/colors, easily swapped. */
export interface BusinessUnitInfo {
  name: string;
  brandColor: string;
  address: string;
  initials: string;
  /** Full wordmark SVG (served from public/) — rendered instead of the initials tile when present. */
  logoUrl?: string;
}

export const BUSINESS_UNITS: Record<string, BusinessUnitInfo> = {
  MindInventory: {
    name: 'MindInventory',
    brandColor: '#ED184F',
    address: '4th Floor, Shivalik Shilp, Iscon Cross Rd, Ahmedabad, Gujarat 380015, India',
    initials: 'MI',
    logoUrl: '/mindinventory-logo.svg',
  },
  '300Mind': {
    name: '300Mind',
    brandColor: '#6366F1',
    address: '7th Floor, Titanium City Centre, S.G. Highway, Ahmedabad, Gujarat 380054, India',
    initials: '3M',
  },
  CollabCRM: {
    name: 'CollabCRM',
    brandColor: '#3538CD',
    address: '201 Business Bay, Nr. Shyamal Cross Rd, Ahmedabad, Gujarat 380015, India',
    initials: 'CC',
  },
};

/** Display-ready branding with safe fallbacks — the one place BU lookups happen. */
export interface ResolvedBranding {
  name: string;
  brandColor: string;
  /** Readable text color (black/white) for use on top of brandColor. */
  brandText: string;
  initials: string;
  logoUrl?: string;
  address?: string;
}

export function resolveBranding(businessUnit: string): ResolvedBranding {
  const info = BUSINESS_UNITS[businessUnit];
  const brandColor = info?.brandColor ?? '#3538CD';
  return {
    name: info?.name ?? businessUnit,
    brandColor,
    brandText: readableTextColor(brandColor),
    initials: info?.initials ?? 'CC',
    logoUrl: info?.logoUrl,
    address: info?.address,
  };
}
