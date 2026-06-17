// Brand-appearance helpers shared by the config and the live portal.
import type { PortalAppearance } from '../store/types';

/**
 * Default portal branding — matched to mindinventory.com. The brand colour
 * (#ED184F, a crimson/pink) is taken straight from their logo SVG's fill value;
 * #192020 is their wordmark's near-black. This is the single source of truth for
 * "the default", used by the store's initial state, the config form and Reset.
 */
export const DEFAULT_APPEARANCE: PortalAppearance = {
  portalName: 'MindInventory',
  tagline: 'Explore open roles and apply in minutes.',
  brandColor: '#ED184F',
  logoUrl: '',
};


/** Darken a hex colour by `amount` (0–1) — used to derive a button :hover shade. */
export function darkenHex(hex: string, amount = 0.18): string {
  const m = hex.replace('#', '');
  if (m.length !== 6) return hex;
  const num = parseInt(m, 16);
  const r = Math.max(0, Math.round(((num >> 16) & 255) * (1 - amount)));
  const g = Math.max(0, Math.round(((num >> 8) & 255) * (1 - amount)));
  const b = Math.max(0, Math.round((num & 255) * (1 - amount)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/** WCAG relative luminance of a hex colour (0 = black, 1 = white). */
export function relativeLuminance(hex: string): number {
  const m = hex.replace('#', '');
  if (m.length !== 6) return 0;
  const num = parseInt(m, 16);
  const chan = [(num >> 16) & 255, (num >> 8) & 255, num & 255].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
}

/** Pick a readable text colour (white or near-black) to sit on top of `bg`. */
export function readableTextColor(bg: string): string {
  return relativeLuminance(bg) > 0.5 ? '#111827' : '#FFFFFF';
}

/** WCAG contrast ratio between two hex colours (1 = none, 21 = max). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * A brand colour is "too light" when, used as text/link on a white surface, it
 * falls below the WCAG AA large-text bar (3:1). Buttons can still auto-flip
 * their label colour, but accent text/links can't — so we warn.
 */
export function isLowContrastOnWhite(hex: string): boolean {
  return contrastRatio(hex, '#FFFFFF') < 3;
}

/**
 * Return a version of `hex` that is readable as text/links on a white surface.
 * If the colour already clears the contrast bar it's returned unchanged; if it's
 * too light (e.g. pastel or near-white) it's darkened just enough to stay legible
 * — so the portal name and job titles never disappear, whatever the customer picks.
 */
export function accessibleOnWhite(hex: string, min = 3): string {
  let c = hex;
  let guard = 0;
  while (contrastRatio(c, '#FFFFFF') < min && guard < 24) {
    c = darkenHex(c, 0.1);
    guard++;
  }
  return c;
}

/** A small curated palette so a non-designer gets a good result in one click. */
export const BRAND_PRESETS: { name: string; color: string }[] = [
  { name: 'MindInventory', color: '#ED184F' },
  { name: 'Indigo', color: '#3538CD' },
  { name: 'Blue', color: '#2563EB' },
  { name: 'Teal', color: '#0D9488' },
  { name: 'Emerald', color: '#059669' },
  { name: 'Violet', color: '#7C3AED' },
  { name: 'Rose', color: '#E11D48' },
  { name: 'Orange', color: '#EA580C' },
  { name: 'Slate', color: '#334155' },
];
