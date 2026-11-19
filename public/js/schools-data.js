// Shared by schools.html and school.html: the school list, ratings/reviews from Supabase,
// star rendering and the Leaflet map (Leaflet itself is loaded by a <script> tag as window.L).

import { t, lang } from './i18n.js';
import { esc } from './shared.js';

export const GEORGIA_BOUNDS = [[41.05, 40.0], [43.6, 46.75]];

export async function loadSchools() {
  const res = await fetch('content/schools.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).schools;
}

export const schoolName = (s) => s.name[lang] || s.name.en;
export const cityName = (s) => t(`city.${s.city}`);
export const describe = (s) =>
  [s.categories?.length ? t('schools.trains', { list: s.categories.join(', ') }) : t('schools.unconfirmed', { city: cityName(s) }), s.description?.[lang] ?? s.description?.en]
    .filter(Boolean)
    .join(' ');

/** Static stars filled to `value` (0–5), with an accessible label. */
export function stars(value, { size = '' } = {}) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  return `<span class="stars ${size}" style="--v:${v}" role="img" aria-label="${esc(t('schools.rating', { avg: v.toLocaleString(lang, { maximumFractionDigits: 1 }) }))}">★★★★★</span>`;
}

export function ratingLine(r) {
  if (!r?.count) return `<span class="rating-line muted">${esc(t('schools.noReviews'))}</span>`;
  return `<span class="rating-line">${stars(r.average)} <strong>${Number(r.average).toLocaleString(lang, { maximumFractionDigits: 1 })}</strong> <span class="muted">${esc(t('schools.reviews', { n: r.count }))}</span></span>`;
}

/** school_id -> { average, count }. Empty when accounts/reviews aren't set up. */
export async function loadRatings(client) {
  if (!client) return new Map();
  const { data, error } = await client.from('school_ratings').select('school_id, average, count');
  if (error) {
    console.warn('ratings unavailable:', error.message);
    return new Map();
  }
  return new Map(data.map((r) => [r.school_id, r]));
}

// ---- map -------------------------------------------------------------------

// Standard OpenStreetMap tiles (no API key). The dark neon look is a CSS filter on the tile pane
// (see .leaflet-tile-pane in style.css), so every theme uses the same tiles.
export function makeMap(el, options = {}) {
  const L = window.L;
  // whole zoom levels only: fractional zoom scales tiles and shows seams under the dark filter
  const map = L.map(el, { scrollWheelZoom: false, ...options });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  ctrlWheelZoom(map, el);
  return map;
}

/**
 * Ctrl + scroll (⌘ + scroll on a Mac) zooms around the pointer; a plain scroll keeps scrolling
 * the page and briefly shows how to zoom, so the map never traps someone scrolling past it.
 */
function ctrlWheelZoom(map, el) {
  const key = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl';
  const hint = document.createElement('div');
  hint.className = 'map-hint';
  hint.textContent = t('map.zoomHint', { key });
  hint.setAttribute('aria-hidden', 'true');
  el.append(hint);
  let hideTimer;
  let last = 0;
  el.addEventListener(
    'wheel',
    (e) => {
      if (!(e.ctrlKey || e.metaKey)) {
        hint.classList.add('on');
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => hint.classList.remove('on'), 1200);
        return;
      }
      e.preventDefault(); // stop the browser's own page zoom
      hint.classList.remove('on');
      // trackpads send many small wheel events; one zoom step per 120ms feels steady
      if (Date.now() - last < 120 || !e.deltaY) return;
      last = Date.now();
      const zoom = map.getZoom() + (e.deltaY < 0 ? 1 : -1);
      map.setZoomAround(map.mouseEventToContainerPoint(e), Math.max(map.getMinZoom(), Math.min(map.getMaxZoom(), zoom)));
    },
    { passive: false },
  );
}

/** Google Maps link for a school's coordinates. */
export const googleMapsUrl = (s) => `https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`;

export function pin(school, { active = false } = {}) {
  const L = window.L;
  return L.marker([school.lat, school.lng], {
    title: schoolName(school),
    icon: L.divIcon({ className: `map-pin${active ? ' is-active' : ''}`, html: '<span></span>', iconSize: [20, 20], iconAnchor: [10, 10] }),
  });
}
