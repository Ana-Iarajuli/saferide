// guide.html: the Beginner's guide hub, listing its three parts in the order a new rider needs them.

import { t } from './i18n.js';
import { mountLayout, NAV } from './layout.js';
import { esc } from './shared.js';

mountLayout('guide');
document.title = t('guide.pageTitle');

const parts = NAV.find((n) => n.id === 'guide').children;
document.getElementById('guide-parts').innerHTML = parts
  .map(
    (p, i) => `
    <li>
      <a class="guide-part" href="${p.href}">
        <span class="guide-num" aria-hidden="true">${i + 1}</span>
        <span class="guide-text">
          <strong>${esc(t(`nav.${p.id}`))}</strong>
          <span>${esc(t(`guide.${p.id}.desc`))}</span>
        </span>
        <span class="guide-go">${esc(t('guide.open'))}</span>
      </a>
    </li>`,
  )
  .join('');
