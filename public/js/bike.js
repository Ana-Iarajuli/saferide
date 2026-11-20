// bike.html?id=…: one motorcycle — Specs, Photos & videos, and a way into Compare.

import { t, lang } from './i18n.js';
import { mountLayout } from './layout.js';
import { esc, safeUrl } from './shared.js';
import { loadBikes, bikeName, licenceFor, licenceChip, specGroups, photoUrl, photoPage, videoThumb, categoryLabel } from './bikes-data.js';

mountLayout('reviews');

const root = document.getElementById('bike');
const id = new URLSearchParams(location.search).get('id');
const OUT = 'target="_blank" rel="noopener noreferrer"';
const host = (url) => url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];

function specsPanel(b) {
  return specGroups(b)
    .map(([group, rows]) => {
      const shown = rows.filter(([, v]) => v != null);
      if (!shown.length) return '';
      return `
        <section class="spec-group">
          <h3>${esc(t(group))}</h3>
          <dl>${shown.map(([k, v]) => `<div><dt>${esc(t(k))}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        </section>`;
    })
    .join('');
}

function licencePanel(b) {
  const cat = licenceFor(b);
  if (!cat) return '';
  return `
    <aside class="bike-licence">
      <h3>${esc(t('bikes.licenceTitle'))}</h3>
      <p>${licenceChip(b)} ${esc(t(`bikes.lic.${cat}.long`))}</p>
      ${cat === 'A' && b.a2 ? `<p>${esc(t('bikes.a2fromMaker'))} <q>${esc(b.a2)}</q></p>` : ''}
      <p class="muted small">${esc(t('bikes.licenceNote'))} <a href="licence.html">${esc(t('bikes.licenceLink'))}</a></p>
    </aside>`;
}

/** The bike's main picture beside the specs: the first photo with its credit, else the video thumbnail. */
function coverFigure(b) {
  const p = b.photos[0];
  if (p) {
    return `<figure class="bike-cover">
      <a href="${esc(photoPage(p))}" ${OUT}><img src="${esc(photoUrl(p, 960))}" alt="${esc(bikeName(b))}" referrerpolicy="no-referrer"></a>
      <figcaption>${esc(t('bikes.photoCredit', { author: p.author, license: p.license }))}</figcaption>
    </figure>`;
  }
  if (!b.video) return '';
  return `<figure class="bike-cover"><a href="#media" data-open-media><img src="${esc(videoThumb(b.video))}" alt="${esc(bikeName(b))}" referrerpolicy="no-referrer"></a></figure>`;
}

function mediaPanel(b, channel) {
  const video = b.video
    ? `<div class="video-frame">
         <iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(b.video.id)}" title="${esc(b.video.title)}" loading="lazy"
           allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin"></iframe>
       </div>
       <p class="muted small">${esc(t('bikes.officialVideo', { make: b.make }))}</p>`
    : `<p class="ch-empty">${esc(t('bikes.noVideo', { make: b.make }))} <a href="${esc(safeUrl(channel))}" ${OUT}>${esc(t('bikes.openChannel', { make: b.make }))}</a></p>`;
  const photos = b.photos.length
    ? `<div class="bike-photos">${b.photos
        .map(
          (p) => `
        <figure>
          <a href="${esc(photoPage(p))}" ${OUT}><img src="${esc(photoUrl(p, 1280))}" alt="${esc(bikeName(b))}" loading="lazy" referrerpolicy="no-referrer"></a>
          <figcaption>${esc(t('bikes.photoCredit', { author: p.author, license: p.license }))}</figcaption>
        </figure>`,
        )
        .join('')}</div>`
    : '';
  return video + photos;
}

async function boot() {
  let data;
  try {
    data = await loadBikes();
  } catch {
    root.innerHTML = `<p class="ch-empty">${esc(t('bikes.loadError'))}</p>`;
    return;
  }
  const b = data.bikes.find((x) => x.id === id);
  if (!b) {
    root.innerHTML = `<div class="message"><p>${esc(t('bikes.notFound'))}</p><p><a href="reviews.html">${esc(t('bikes.back'))}</a></p></div>`;
    return;
  }
  document.title = t('bikes.bikeTitle', { name: bikeName(b) });
  const checked = new Date('2026-11-20').toLocaleDateString(lang, { year: 'numeric', month: 'long' });

  root.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="reviews.html">${esc(t('bikes.back'))}</a> <span>/</span> ${esc(b.make)}</nav>
    <header class="bike-head">
      <p class="bike-make">${esc(b.make)} · ${esc(categoryLabel(b.category))}${b.year ? ` · ${b.year}` : ''}</p>
      <h1>${esc(b.model)}</h1>
    </header>
    <div class="bike-tabs" role="tablist" aria-label="${esc(bikeName(b))}">
      <button type="button" role="tab" id="tab-specs" aria-controls="panel-specs" aria-selected="true">${esc(t('bikes.tab.specs'))}</button>
      <button type="button" role="tab" id="tab-media" aria-controls="panel-media" aria-selected="false" tabindex="-1">${esc(t('bikes.tab.media'))}</button>
      <a class="bike-tab-link" href="compare.html?a=${encodeURIComponent(b.id)}">${esc(t('bikes.tab.compare'))}</a>
    </div>

    <section class="bike-panel" role="tabpanel" id="panel-specs" aria-labelledby="tab-specs">
      <div class="bike-specs-layout">
        <div>${specsPanel(b)}</div>
        <div>
          ${coverFigure(b)}
          ${licencePanel(b)}
          <aside class="bike-source">
            <p>${esc(t('bikes.sourceLine', { site: host(b.source) }))} <a href="${esc(safeUrl(b.source))}" ${OUT}>${esc(t('bikes.openSource'))}</a></p>
            ${b.note ? `<p class="muted small">${esc(b.note)}</p>` : ''}
            <p class="muted small">${esc(t('bikes.checked', { date: checked }))}</p>
          </aside>
        </div>
      </div>
    </section>

    <section class="bike-panel" role="tabpanel" id="panel-media" aria-labelledby="tab-media" hidden>
      ${mediaPanel(b, data.channels[b.make])}
    </section>`;

  // tabs: click, or arrow keys between them
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const show = (tab) => {
    for (const x of tabs) {
      const on = x === tab;
      x.setAttribute('aria-selected', on);
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    }
    history.replaceState(null, '', tab.id === 'tab-media' ? '#media' : location.pathname + location.search);
  };
  for (const tab of tabs) {
    tab.addEventListener('click', () => show(tab));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(tabs.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      next.focus();
      show(next);
    });
  }
  if (location.hash === '#media') show(tabs[1]);
  root.querySelector('[data-open-media]')?.addEventListener('click', (e) => {
    e.preventDefault();
    show(tabs[1]);
  });
}

boot();
