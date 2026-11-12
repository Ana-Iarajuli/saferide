// schools.html: map of Georgia with every school pinned, then one card per school.

import { t } from './i18n.js';
import { mountLayout } from './layout.js';
import { esc } from './shared.js';
import { getClient } from './auth.js';
import { loadSchools, loadRatings, schoolName, cityName, describe, ratingLine, makeMap, pin, GEORGIA_BOUNDS } from './schools-data.js';

mountLayout('schools');
document.title = t('schools.pageTitle');

const $ = (id) => document.getElementById(id);
const href = (s) => `school.html?id=${encodeURIComponent(s.id)}`;

async function boot() {
  let schools;
  try {
    schools = await loadSchools();
  } catch {
    $('school-list').innerHTML = `<p class="muted">${esc(t('schools.loadError'))}</p>`;
    return;
  }
  // ratings arrive later (Supabase loads from a CDN); the map and cards don't wait for them
  let ratings = new Map();
  getClient()
    .then(loadRatings)
    .then((r) => {
      ratings = r;
      render();
    });

  // city filter: only cities that have schools, in list order
  const cities = [...new Set(schools.map((s) => s.city))];
  let city = '';

  const map = makeMap($('school-map'));
  map.fitBounds(GEORGIA_BOUNDS);
  const markers = new Map(
    schools.map((s) => {
      const m = pin(s).addTo(map);
      m.bindPopup(`<a class="pin-popup" href="${href(s)}"><strong>${esc(schoolName(s))}</strong><span>${esc(cityName(s))}</span></a>`);
      return [s.id, m];
    }),
  );

  const render = () => {
    const shown = schools.filter((s) => !city || s.city === city);
    $('school-count').textContent = t('schools.count', { n: shown.length });
    $('school-list').innerHTML = shown
      .map(
        (s) => `
        <a class="school-card" href="${href(s)}" data-id="${esc(s.id)}">
          <span class="school-city">${esc(cityName(s))}</span>
          <h3>${esc(schoolName(s))}</h3>
          <p>${esc(describe(s))}</p>
          ${ratingLine(ratings.get(s.id))}
        </a>`,
      )
      .join('');
    for (const [id, m] of markers) m.getElement()?.classList.toggle('is-dim', !!city && schools.find((s) => s.id === id).city !== city);
  };

  $('city-filter').innerHTML = [['', t('schools.all')], ...cities.map((c) => [c, t(`city.${c}`)])]
    .map(([id, label]) => `<button type="button" class="pill ${id === city ? 'on' : ''}" data-city="${id}" aria-pressed="${id === city}">${esc(label)}</button>`)
    .join('');
  $('city-filter').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-city]');
    if (!btn) return;
    city = btn.dataset.city;
    for (const b of $('city-filter').children) {
      b.classList.toggle('on', b === btn);
      b.setAttribute('aria-pressed', b === btn);
    }
    const shown = schools.filter((s) => !city || s.city === city);
    if (city) map.flyToBounds(shown.map((s) => [s.lat, s.lng]), { padding: [60, 60], maxZoom: 13, duration: 0.6 });
    else map.flyToBounds(GEORGIA_BOUNDS, { duration: 0.6 });
    render();
  });

  // hovering a card points at its pin
  $('school-list').addEventListener('mouseover', (e) => {
    const id = e.target.closest('[data-id]')?.dataset.id;
    for (const [sid, m] of markers) m.getElement()?.classList.toggle('is-active', sid === id);
  });
  $('school-list').addEventListener('mouseleave', () => {
    for (const m of markers.values()) m.getElement()?.classList.remove('is-active');
  });

  render();
}

boot();
