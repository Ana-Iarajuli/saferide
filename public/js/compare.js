// compare.html?a=…&b=…: two motorcycles side by side, spec by spec.

import { t } from './i18n.js';
import { mountLayout } from './layout.js';
import { esc } from './shared.js';
import { loadBikes, bikeName, bikeUrl, licenceChip, specGroups, coverImage } from './bikes-data.js';

mountLayout('reviews');
document.title = t('bikes.compareTitle');

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
let bikes = [];

/** One <select> listing every bike, grouped by make. */
function picker(id, selected) {
  const makes = [...new Set(bikes.map((b) => b.make))].sort();
  return `<select id="${id}" aria-label="${esc(t('bikes.pick'))}">
    <option value="">${esc(t('bikes.pick'))}</option>
    ${makes
      .map(
        (m) => `<optgroup label="${esc(m)}">${bikes
          .filter((b) => b.make === m)
          .map((b) => `<option value="${esc(b.id)}" ${b.id === selected ? 'selected' : ''}>${esc(b.model)}</option>`)
          .join('')}</optgroup>`,
      )
      .join('')}
  </select>`;
}

function head(b) {
  if (!b) return `<div class="cmp-head is-empty"><span>${esc(t('bikes.pickHint'))}</span></div>`;
  const img = coverImage(b);
  return `
    <a class="cmp-head" href="${bikeUrl(b)}">
      <span class="bike-img">${img ? `<img src="${esc(img)}" alt="" referrerpolicy="no-referrer">` : ''}</span>
      <span class="cmp-name"><span class="bike-make">${esc(b.make)}</span> <strong>${esc(b.model)}</strong> ${licenceChip(b)}</span>
    </a>`;
}

function table(a, b) {
  if (!a || !b) return '';
  const ga = specGroups(a);
  const gb = specGroups(b);
  return ga
    .map(([group, rows], gi) => {
      const lines = rows
        .map(([k, va], ri) => [k, va, gb[gi][1][ri][1]])
        .filter(([, va, vb]) => va != null || vb != null) // a row stays when either bike states it
        .map(([k, va, vb]) => `
          <div class="cmp-row">
            <div class="cmp-label">${esc(t(k))}</div>
            <div>${va == null ? `<span class="muted">${esc(t('bikes.notStated'))}</span>` : esc(va)}</div>
            <div>${vb == null ? `<span class="muted">${esc(t('bikes.notStated'))}</span>` : esc(vb)}</div>
          </div>`)
        .join('');
      return lines ? `<section class="cmp-group"><h3>${esc(t(group))}</h3>${lines}</section>` : '';
    })
    .join('');
}

function render() {
  const a = bikes.find((b) => b.id === $('pick-a').value);
  const b = bikes.find((x) => x.id === $('pick-b').value);
  $('cmp-heads').innerHTML = head(a) + head(b);
  $('cmp-table').innerHTML = table(a, b);
  const u = new URLSearchParams();
  if (a) u.set('a', a.id);
  if (b) u.set('b', b.id);
  history.replaceState(null, '', u.toString() ? `?${u}` : location.pathname);
}

async function boot() {
  try {
    bikes = (await loadBikes()).bikes;
  } catch {
    $('cmp-table').innerHTML = `<p class="ch-empty">${esc(t('bikes.loadError'))}</p>`;
    return;
  }
  $('cmp-pickers').innerHTML = picker('pick-a', params.get('a')) + picker('pick-b', params.get('b'));
  $('cmp-pickers').addEventListener('change', render);
  render();
}

boot();
