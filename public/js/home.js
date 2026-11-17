// Homepage: explains SafeRide and joins every section as stops on one road,
// with live numbers and a few deals from data/home.json (written by the scraper).

import { t } from './i18n.js';
import { mountLayout, NAV } from './layout.js';
import { esc, setRates, productCard } from './shared.js';
import { onUserChange, usernameOf } from './auth.js';

mountLayout('home');
document.title = t('home.pageTitle');

const $ = (id) => document.getElementById(id);

// One road segment per gap: into stop 1, between stops, and out of stop 5. Stops sit at
// x = 117/350/584/818/1051 and y = 30 or 70 in the 1168x100 viewBox (see .stop-node in style.css).
const ROAD_SEGMENTS = [
  'M0 50C60 50 60 30 117 30',
  'M117 30C174 30 290 70 350 70',
  'M350 70C410 70 525 30 584 30',
  'M584 30C643 30 757 70 818 70',
  'M818 70C879 70 990 30 1051 30',
  'M1051 30C1112 30 1110 50 1168 50',
];

function renderRoute() {
  // the road is solid as far as the last section that is open, dashed beyond it
  const lastLive = NAV.findLastIndex((n) => !n.soon);
  $('road-line').innerHTML = ROAD_SEGMENTS.map((d, i) => `<path d="${d}" ${i > lastLive ? 'class="road-ahead"' : ''}/>`).join('');
  $('route').innerHTML = NAV.map(
    (n, i) => `
    <li class="stop ${n.soon ? 'is-soon' : 'is-live'}">
      <a href="${n.href}">
        <span class="stop-node" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <strong class="stop-verb">${esc(t(`step.${n.id}.verb`))}</strong>
        <span class="stop-section">${esc(t(`nav.${n.id}`))}</span>
        <span class="stop-desc">${esc(t(`step.${n.id}.desc`))}</span>
        <span class="stop-status" ${n.id === 'sales' ? 'id="sales-status"' : ''}>${esc(n.soon ? t('soon.badge') : t('home.live'))}</span>
      </a>
    </li>`,
  ).join('');
}

async function renderDeals() {
  let home;
  try {
    const res = await fetch('data/home.json', { cache: 'no-cache' });
    if (!res.ok) return;
    home = await res.json();
  } catch {
    return; // the Sales stop keeps its plain "Open now" and the deals block stays hidden
  }
  $('sales-status').textContent = t('home.salesLive', { n: home.stats.items, stores: home.stats.stores });

  if (!home.deals.length) return;
  setRates(home.rates);
  const data = { storeById: Object.fromEntries(home.sources.map((s) => [s.id, s])) };
  $('home-deal-grid').innerHTML = home.deals.map((p) => productCard(p, data)).join('');
  $('home-deals').hidden = false;
}

function renderJoin(user, accountsOn) {
  const box = $('home-join');
  box.hidden = !accountsOn;
  if (!accountsOn) return;
  box.innerHTML = user
    ? `<div>
         <h2>${esc(t('home.join.welcome', { name: usernameOf(user) }))}</h2>
         <p>${esc(t('home.join.member'))}</p>
       </div>
       <div class="join-actions"><a class="btn btn-lg" href="account.html">${esc(t('user.account'))}</a></div>`
    : `<div>
         <h2>${esc(t('home.join.title'))}</h2>
         <p>${esc(t('home.join.body'))}</p>
       </div>
       <div class="join-actions">
         <a class="btn btn-lg cta" href="account.html?view=register">${esc(t('home.join.cta'))}</a>
         <a class="link-btn" href="account.html">${esc(t('home.join.login'))}</a>
       </div>`;
}

renderRoute();
renderDeals();
$('home-join').hidden = true;
onUserChange(renderJoin);
