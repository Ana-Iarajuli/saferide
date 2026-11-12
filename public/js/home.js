// Homepage: explains SafeRide and joins every section as stops on one road,
// with live numbers and a few deals from data/home.json (written by the scraper).

import { t } from './i18n.js';
import { mountLayout, NAV } from './layout.js';
import { esc, setRates, productCard } from './shared.js';
import { onUserChange, usernameOf } from './auth.js';

mountLayout('home');
document.title = t('home.pageTitle');

const $ = (id) => document.getElementById(id);

function renderRoute() {
  $('route').innerHTML = NAV.map(
    (n) => `
    <li class="stop ${n.soon ? 'is-soon' : 'is-live'}">
      <a href="${n.href}">
        <span class="stop-node" aria-hidden="true">${n.icon}</span>
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
