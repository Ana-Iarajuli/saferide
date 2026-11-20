// Shared by reviews.html (finder), bike.html (one bike) and compare.html.
// Data: public/content/bikes.json — every value from the manufacturer's own spec page.

import { t, lang } from './i18n.js';
import { esc } from './shared.js';

let cache;
export async function loadBikes() {
  cache ??= fetch('content/bikes.json', { cache: 'no-cache' }).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });
  return cache;
}

export const bikeName = (b) => `${b.make} ${b.model}`;
export const bikeUrl = (b) => `bike.html?id=${encodeURIComponent(b.id)}`;
const num = (n, digits = 1) => Number(n).toLocaleString(lang, { maximumFractionDigits: digits });

// ---- licence category ----------------------------------------------------------
// Georgian rules (see licence.html): A1 up to 125 cm³ and 11 kW; A2 up to 35 kW; A above that.
// Makers state power in kW, PS or hp; PS and hp are converted with the exact unit factors.

export function powerKw(s) {
  if (s.power_kw != null) return s.power_kw;
  if (s.power_ps != null) return s.power_ps * 0.73549875;
  if (s.power_hp != null) return s.power_hp * 0.745699872;
  return null;
}

/** 'A1' | 'A2' | 'A' | null (power not stated) */
export function licenceFor(b) {
  const kw = powerKw(b.specs);
  if (kw == null) return null;
  if (b.specs.displacement_cc <= 125 && kw <= 11) return 'A1';
  if (kw <= 35) return 'A2';
  return 'A';
}

export const licenceChip = (b) => {
  const cat = licenceFor(b);
  if (!cat) return '';
  const extra = cat === 'A' && b.a2 ? ` <small>${esc(t('bikes.a2version'))}</small>` : '';
  return `<span class="licence-chip lic-${cat.toLowerCase()}" title="${esc(t(`bikes.lic.${cat}.short`))}">${cat}${extra}</span>`;
};

// ---- formatting ---------------------------------------------------------------

export function powerText(s) {
  const parts = [];
  if (s.power_kw != null) parts.push(`${num(s.power_kw)} kW`);
  const alt = [s.power_ps != null && `${num(s.power_ps)} PS`, s.power_hp != null && `${num(s.power_hp)} hp`].filter(Boolean);
  if (parts.length && alt.length) parts.push(`(${alt.join(' / ')})`);
  else parts.push(...alt);
  if (!parts.length) return null;
  return parts.join(' ') + (s.power_rpm ? ` @ ${num(s.power_rpm, 0)} rpm` : '');
}

export function torqueText(s) {
  if (s.torque_nm == null) return null;
  return `${num(s.torque_nm)} Nm${s.torque_rpm ? ` @ ${num(s.torque_rpm, 0)} rpm` : ''}`;
}

const unit = (v, u) => (v == null ? null : `${num(v)} ${u}`);

/** Makers measure weight differently (kerb, wet, without fuel…), so the basis is always shown. */
function weightType(type) {
  const key = `bikes.weightType.${type}`;
  const label = t(key);
  return label === key ? type : label;
}

/** Spec rows in display order, grouped. Each row: [label key, value or null]. */
export function specGroups(b) {
  const s = b.specs;
  return [
    ['bikes.group.engine', [
      ['bikes.spec.engine', s.engine],
      ['bikes.spec.displacement', unit(s.displacement_cc, 'cm³')],
      ['bikes.spec.power', powerText(s)],
      ['bikes.spec.torque', torqueText(s)],
      ['bikes.spec.boreStroke', s.bore_stroke],
      ['bikes.spec.compression', s.compression],
      ['bikes.spec.gearbox', s.gearbox],
    ]],
    ['bikes.group.size', [
      ['bikes.spec.seat', unit(s.seat_mm, 'mm')],
      ['bikes.spec.weight', s.weight_kg == null ? null : `${num(s.weight_kg)} kg${s.weight_type ? ` (${weightType(s.weight_type)})` : ''}`],
      ['bikes.spec.fuel', unit(s.fuel_l, 'l')],
      ['bikes.spec.wheelbase', unit(s.wheelbase_mm, 'mm')],
      ['bikes.spec.clearance', unit(s.ground_clearance_mm, 'mm')],
    ]],
    ['bikes.group.chassis', [
      ['bikes.spec.frontSuspension', s.front_suspension],
      ['bikes.spec.rearSuspension', s.rear_suspension],
      ['bikes.spec.frontBrake', s.front_brake],
      ['bikes.spec.rearBrake', s.rear_brake],
      ['bikes.spec.abs', s.abs],
      ['bikes.spec.frontTyre', s.front_tyre],
      ['bikes.spec.rearTyre', s.rear_tyre],
    ]],
  ];
}

// ---- media ----------------------------------------------------------------------

// Commons photos link straight to Wikimedia's cached thumbnails (no redirects). Wikimedia only
// serves fixed widths, and never wider than the original, so requests snap to those steps.
const THUMB_STEPS = [330, 500, 960, 1280, 1920];

function thumbWidth(p, wanted) {
  const fits = THUMB_STEPS.filter((w) => w <= p.width);
  return fits.find((w) => w >= wanted) ?? fits.at(-1) ?? THUMB_STEPS[0];
}

export function photoUrl(p, width = 960) {
  const name = p.path.split('/').pop();
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${p.path}/${thumbWidth(p, width)}px-${name}`;
}

/** srcset with the standard size and the next one up, for sharp screens. */
export function photoSrcset(p, width) {
  const base = thumbWidth(p, width);
  const big = thumbWidth(p, base * 1.9);
  return big > base ? `${photoUrl(p, base)} ${base}w, ${photoUrl(p, big)} ${big}w` : `${photoUrl(p, base)} ${base}w`;
}

export const photoPage = (p) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(p.file.replaceAll(' ', '_'))}`;
export const videoThumb = (v) => `https://i.ytimg.com/vi/${encodeURIComponent(v.id)}/hqdefault.jpg`;

/**
 * <img> for a card: the first Commons photo (500px, 960px on sharp screens), else the official
 * video's thumbnail. `eager` for images in the first visible row; the rest load as they scroll in.
 */
export function coverImg(b, { sizes = '(max-width: 560px) 100vw, 320px', eager = false } = {}) {
  const p = b.photos[0];
  const loading = eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
  const common = `alt="" ${loading} decoding="async" referrerpolicy="no-referrer" width="4" height="3"`;
  if (p) return `<img src="${esc(photoUrl(p, 500))}" srcset="${esc(photoSrcset(p, 500))}" sizes="${sizes}" ${common}>`;
  return b.video ? `<img src="${esc(videoThumb(b.video))}" ${common}>` : '';
}

export const categoryLabel = (c) => t(`bikes.cat.${c}`);
