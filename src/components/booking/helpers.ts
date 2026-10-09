/** Small helpers shared by the booking detail sections. */

// Ionicons parses ";utf8," data URLs as raw markup, so the SVG must not be URI-encoded.
const svg = (body: string) =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 24 24'><g fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'>${body}</g></svg>`;

/** Ionicons has no truck glyph; this one follows the outline icon style. */
export const truckOutline = svg(
  `<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>`,
);

/** Google Maps directions link for an address. */
export const mapsUrl = (address: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

export const openMaps = (address: string) => window.open(mapsUrl(address), '_blank', 'noopener');

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

/** "July 17, 2026 · 9:00 AM" → ["Jul 17, 2026", "9:00 AM"]. */
export function splitStamp(stamp: string): [string, string] {
  const [date, time = ''] = stamp.split(/\s*[·•]\s*/);
  return [date.replace(/^([A-Z][a-z]{2})[a-z]+/, '$1'), time];
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

/** Time part of a stage stamp ("Jul 17 · 4:20 PM" → "4:20 PM"). */
export const timeOf = (stamp?: string) => (stamp ? splitStamp(stamp)[1] || stamp : '');
