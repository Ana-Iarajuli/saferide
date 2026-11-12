// gear-guide.html: beginner gear advice, rendered from js/content/gear.js, with a contents list
// that follows the reader and links from each item to that category on the Sales page.

import { lang, tv } from './i18n.js';
import { mountLayout } from './layout.js';
import { esc } from './shared.js';
import { CONTENT, BUY_ORDER } from './content/gear.js';

mountLayout('gear');
const c = CONTENT[lang] ?? CONTENT.en;
document.title = `${c.title} — SafeRide`;

const byId = Object.fromEntries(c.sections.map((s) => [s.id, s]));

document.getElementById('doc').innerHTML = `
  <header class="doc-head">
    <h1>${esc(c.title)}</h1>
    <p class="doc-lead">${esc(c.lead)}</p>
    <div class="buy-order">
      <h2>${esc(c.orderTitle)}</h2>
      <ol>${BUY_ORDER.map((id) => `<li><a href="#${id}">${esc(byId[id].title)}</a></li>`).join('')}</ol>
    </div>
  </header>

  <div class="gear-layout">
    <nav class="gear-toc" aria-label="${esc(c.contents)}">
      <p>${esc(c.contents)}</p>
      <ul>${c.sections.map((s) => `<li><a href="#${s.id}" data-toc="${s.id}">${esc(s.title)}</a></li>`).join('')}</ul>
    </nav>
    <div class="gear-sections">
      ${c.sections
        .map(
          (s) => `
        <section class="gear-item" id="${s.id}" aria-labelledby="${s.id}-title">
          <h2 id="${s.id}-title">${esc(s.title)}</h2>
          <p class="gear-intro">${esc(s.intro)}</p>
          <div class="gear-lists">
            <div class="gear-look">
              <h3>${esc(c.look)}</h3>
              <ul>${s.look.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
            </div>
            <div class="gear-skip">
              <h3>${esc(c.skip)}</h3>
              <ul>${s.skip.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
            </div>
          </div>
          <p class="gear-tip">${esc(s.tip)}</p>
          ${s.category ? `<a class="link-btn" href="sales.html?category=${encodeURIComponent(s.category)}">${esc(c.shop.replace('{category}', tv('cat', s.category).toLowerCase()))}</a>` : ''}
        </section>`,
        )
        .join('')}
    </div>
  </div>`;

// highlight the section being read
const links = new Map([...document.querySelectorAll('[data-toc]')].map((a) => [a.dataset.toc, a]));
const observer = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      for (const [id, a] of links) id === e.target.id ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current');
    }
  },
  { rootMargin: '-30% 0px -60% 0px' },
);
document.querySelectorAll('.gear-item').forEach((s) => observer.observe(s));
