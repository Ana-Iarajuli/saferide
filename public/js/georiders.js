// georiders.html: motorcycle YouTubers, Georgian first, then international.
// The channel list is public/content/riders.json (curated by hand); newest videos come from
// public/data/riders.json, which scripts/fetch-riders.js builds from YouTube's RSS feeds.

import { t, lang } from './i18n.js';
import { mountLayout } from './layout.js';
import { esc, timeAgo } from './shared.js';

mountLayout('georiders');
document.title = t('georiders.pageTitle');

const TOPICS = ['reviews', 'riding', 'gear', 'maintenance', 'travel', 'sport', 'news'];
const INACTIVE_DAYS = 365;
const $ = (id) => document.getElementById(id);
const OUT = 'target="_blank" rel="noopener noreferrer"';

const channelUrl = (c) => `https://www.youtube.com/channel/${encodeURIComponent(c.id)}`;
const videoUrl = (v) => `https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}`;
const thumb = (v) => `https://i.ytimg.com/vi/${encodeURIComponent(v.id)}/mqdefault.jpg`;
const initials = (name) => name.replace(/[^\p{L}\p{N} ]/gu, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

let channels = [];
let feeds = {};
let topic = TOPICS.includes(new URLSearchParams(location.search).get('topic')) ? new URLSearchParams(location.search).get('topic') : '';

const isInactive = (c) => {
  const latest = feeds[c.id]?.latest;
  return latest && Date.now() - new Date(latest) > INACTIVE_DAYS * 864e5;
};

function videoCard(v, c) {
  return `
    <a class="video-card" href="${videoUrl(v)}" ${OUT}>
      <span class="video-thumb"><img src="${thumb(v)}" alt="" loading="lazy" referrerpolicy="no-referrer" width="320" height="180"></span>
      <span class="video-meta">
        <span class="video-channel">${esc(c.name)}</span>
        <strong>${esc(v.title)}</strong>
        <time datetime="${esc(v.published)}">${esc(timeAgo(v.published))}</time>
      </span>
    </a>`;
}

/** Bottom of a channel card: its newest video, or a note that it has gone quiet. */
function channelFooter(c, quiet) {
  if (quiet) return `<p class="ch-quiet">${esc(t('georiders.inactive', { year: new Date(feeds[c.id].latest).getFullYear() }))}</p>`;
  const newest = feeds[c.id]?.videos?.[0];
  if (!newest) return '';
  const when = `${esc(t('georiders.newest'))} · ${esc(timeAgo(newest.published))}`;
  return `
    <a class="ch-newest" href="${videoUrl(newest)}" ${OUT}>
      <img src="${thumb(newest)}" alt="" loading="lazy" referrerpolicy="no-referrer" width="320" height="180">
      <span><small>${when}</small>${esc(newest.title)}</span>
    </a>`;
}

function channelCard(c) {
  const quiet = isInactive(c);
  return `
    <article class="channel-card ${quiet ? 'is-quiet' : ''}">
      <header class="ch-head">
        <span class="ch-avatar" aria-hidden="true">${esc(initials(c.name))}</span>
        <div>
          <h3><a href="${channelUrl(c)}" ${OUT}>${esc(c.name)}</a></h3>
          <span class="ch-handle">@${esc(c.handle)}${c.store ? ` · <span class="ch-store">${esc(t('georiders.store'))}</span>` : ''}</span>
        </div>
      </header>
      <p class="ch-desc">${esc(c.desc[lang] ?? c.desc.en)}</p>
      <ul class="ch-topics">${c.topics.map((tp) => `<li class="${tp === topic ? 'on' : ''}">${esc(t(`topic.${tp}`))}</li>`).join('')}</ul>
      ${channelFooter(c, quiet)}
      <a class="link-btn ch-open" href="${channelUrl(c)}" ${OUT}>${esc(t('georiders.open'))}</a>
    </article>`;
}

function render() {
  const shown = channels.filter((c) => !topic || c.topics.includes(topic));
  // active channels first, in list order; quiet ones after them
  const ordered = [...shown.filter((c) => !isInactive(c)), ...shown.filter(isInactive)];

  // newest videos: a row of Georgian channels first, then a row of international ones
  // (purely by date, the big international channels would fill both rows)
  const newest = (from) =>
    ordered
      .filter((c) => c.from === from && !isInactive(c))
      .flatMap((c) => (feeds[c.id]?.videos ?? []).map((v) => ({ v, c })))
      .sort((a, b) => new Date(b.v.published) - new Date(a.v.published))
      // at most two per channel, so one prolific channel can't fill a row
      .filter(({ c }, i, all) => all.slice(0, i).filter((x) => x.c.id === c.id).length < 2)
      .slice(0, 4);
  const latest = [...newest('ge'), ...newest('intl')];
  $('latest').hidden = !latest.length;
  $('latest-grid').innerHTML = latest.map(({ v, c }) => videoCard(v, c)).join('');

  for (const from of ['ge', 'intl']) {
    const list = ordered.filter((c) => c.from === from);
    $(`count-${from}`).textContent = t('georiders.count', { n: list.length });
    let empty = esc(t('georiders.none'));
    if (from === 'ge' && topic === 'maintenance') empty = esc(t('georiders.noGeMaintenance'));
    $(`grid-${from}`).innerHTML = list.length ? list.map(channelCard).join('') : `<p class="ch-empty">${empty}</p>`;
  }

  for (const b of $('topics').children) {
    const on = b.dataset.topic === topic;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on);
  }
  const u = new URL(location.href);
  topic ? u.searchParams.set('topic', topic) : u.searchParams.delete('topic');
  history.replaceState(null, '', u);
}

async function boot() {
  $('topics').innerHTML = [['', t('georiders.all')], ...TOPICS.map((tp) => [tp, t(`topic.${tp}`)])]
    .map(([id, label]) => `<button type="button" class="pill" data-topic="${id}" aria-pressed="false">${esc(label)}</button>`)
    .join('');
  $('topics').addEventListener('click', (e) => {
    const b = e.target.closest('[data-topic]');
    if (!b) return;
    topic = b.dataset.topic;
    render();
  });

  const [list, latest] = await Promise.all([
    fetch('content/riders.json', { cache: 'no-cache' }).then((r) => r.json()),
    // optional: without it the cards just show no newest video
    fetch('data/riders.json', { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
  ]);
  channels = list.channels;
  feeds = latest?.channels ?? {};
  render();
}

boot().catch((e) => {
  console.error(e);
  $('grid-ge').innerHTML = `<p class="ch-empty">${esc(t('georiders.error'))}</p>`;
});
