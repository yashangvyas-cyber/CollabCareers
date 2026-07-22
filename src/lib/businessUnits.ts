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
