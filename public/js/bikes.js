// reviews.html: find a motorcycle by name, type, make or the licence it needs.

import { t } from './i18n.js';
import { mountLayout } from './layout.js';
import { esc } from './shared.js';
import { loadBikes, bikeName, bikeUrl, licenceFor, licenceChip, powerText, coverImg, categoryLabel } from './bikes-data.js';

mountLayout('reviews');
document.title = t('bikes.pageTitle');

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const state = { q: params.get('q') ?? '', cat: params.get('cat') ?? '', make: params.get('make') ?? '', lic: params.get('lic') ?? '' };
let bikes = [];

const options = (values, label, current) =>
  `<option value="">${esc(label)}</option>` + values.map(([v, l]) => `<option value="${esc(v)}" ${v === current ? 'selected' : ''}>${esc(l)}</option>`).join('');

function card(b, i) {
  const s = b.specs;
  const facts = [
    s.displacement_cc != null && `${s.displacement_cc.toLocaleString()} cm³`,
    powerText({ ...s, power_rpm: null }),
    s.weight_kg != null && `${s.weight_kg} kg`,
    s.seat_mm != null && `${t('bikes.spec.seatShort')} ${s.seat_mm} mm`,
  ].filter(Boolean);
  return `
    <a class="bike-card" href="${bikeUrl(b)}">
      <span class="bike-img">${coverImg(b, { eager: i < 4 })}</span>
      <span class="bike-body">
        <span class="bike-top"><span class="bike-make">${esc(b.make)}</span>${licenceChip(b)}</span>
        <strong>${esc(b.model)}</strong>
        <span class="bike-cat">${esc(categoryLabel(b.category))}${b.year ? ` · ${b.year}` : ''}</span>
        <span class="bike-facts">${facts.map((f) => `<span>${esc(f)}</span>`).join('')}</span>
      </span>
    </a>`;
}

function render() {
  const q = state.q.trim().toLowerCase();
  const list = bikes.filter(
    (b) =>
      (!q || bikeName(b).toLowerCase().includes(q)) &&
      (!state.cat || b.category === state.cat) &&
      (!state.make || b.make === state.make) &&
      (!state.lic || licenceFor(b) === state.lic),
  );
  $('bike-count').textContent = t('bikes.count', { n: list.length });
  $('bike-grid').innerHTML = list.length ? list.map((b, i) => card(b, i)).join('') : `<p class="ch-empty">${esc(t('bikes.none'))}</p>`;
  const u = new URLSearchParams(Object.entries(state).filter(([, v]) => v));
  history.replaceState(null, '', u.toString() ? `?${u}` : location.pathname);
}

async function boot() {
  try {
    bikes = (await loadBikes()).bikes;
  } catch {
    $('bike-grid').innerHTML = `<p class="ch-empty">${esc(t('bikes.loadError'))}</p>`;
    return;
  }
  const cats = [...new Set(bikes.map((b) => b.category))].map((c) => [c, categoryLabel(c)]);
  const makes = [...new Set(bikes.map((b) => b.make))].sort().map((m) => [m, m]);
  $('f-cat').innerHTML = options(cats, t('bikes.allTypes'), state.cat);
  $('f-make').innerHTML = options(makes, t('bikes.allMakes'), state.make);
  $('f-lic').innerHTML = options(['A1', 'A2', 'A'].map((c) => [c, t(`bikes.lic.${c}.short`)]), t('bikes.anyLicence'), state.lic);
  $('f-q').value = state.q;

  $('bike-filters').addEventListener('input', (e) => {
    const key = { 'f-q': 'q', 'f-cat': 'cat', 'f-make': 'make', 'f-lic': 'lic' }[e.target.id];
    if (!key) return;
    state[key] = e.target.value;
    render();
  });
  $('bike-filters').addEventListener('submit', (e) => e.preventDefault());
  render();
}

boot();
