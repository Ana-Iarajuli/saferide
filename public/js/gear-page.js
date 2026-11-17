// gear-guide.html: beginner gear advice, rendered from js/content/gear.js.
// A full-body rider diagram leads the page: pointing at (or tapping, or tabbing to) a piece
// of gear shows its advice in the panel beside it. The same advice follows as a plain list.

import { lang, tv } from './i18n.js';
import { mountLayout } from './layout.js';
import { esc } from './shared.js';
import { CONTENT, BUY_ORDER } from './content/gear.js';

mountLayout('gear');
const c = CONTENT[lang] ?? CONTENT.en;
document.title = `${c.title} — SafeRide`;

const byId = Object.fromEntries(c.sections.map((s) => [s.id, s]));

// ---- the rider ------------------------------------------------------------
// Front view, 320 x 640. Each <g data-part> is one hover target; ids match the section ids
// in content/gear.js. Draw order = stacking order, so the armour pads and hi-vis stripes
// that sit on top of the jacket and trousers come last.
const part = (id, shapes) =>
  `<g class="gear-part part-${id}" data-part="${id}" tabindex="0" role="button" aria-label="${esc(byId[id].title)}">${shapes}</g>`;

const RIDER = `
<svg class="rider" viewBox="0 0 320 640" role="group" aria-label="${esc(c.figureLabel)}">
  <ellipse class="rider-ground" cx="160" cy="600" rx="112" ry="9"/>
  ${part('jacket', `
    <path d="M120 126H200Q222 130 234 148L210 172L206 318H114L110 172L86 148Q98 130 120 126Z"/>
    <path d="M86 148Q70 200 64 250L56 320L84 326L96 256Q104 210 110 172Z"/>
    <path d="M234 148Q250 200 256 250L264 320L236 326L224 256Q216 210 210 172Z"/>
    <path class="detail" d="M144 126q16 11 32 0M160 134V318M122 300h76"/>`)}
  ${part('trousers', `
    <path d="M114 318H206L212 420L204 522H174L164 372H156L146 522H116L108 420Z"/>
    <path class="detail" d="M114 332h92M160 332v40"/>`)}
  ${part('boots', `
    <path d="M114 516H148V566Q150 584 140 590H100Q92 588 94 578L112 560Z"/>
    <path d="M206 516H172V566Q170 584 180 590H220Q228 588 226 578L208 560Z"/>
    <path class="detail" d="M116 534h30M116 548h30M174 534h30M174 548h30M96 584h46M178 584h46"/>`)}
  ${part('gloves', `
    <path d="M54 318L86 325L84 342Q86 362 76 374Q62 380 54 366Q48 350 52 336Z"/>
    <path d="M266 318L234 325L236 342Q234 362 244 374Q258 380 266 366Q272 350 268 336Z"/>
    <path class="detail" d="M54 332l30 6M266 332l-30 6M60 352h18M242 352h18"/>`)}
  ${part('helmet', `
    <path d="M160 18c-30 0-46 22-46 50 0 26 14 46 46 46s46-20 46-46c0-28-16-50-46-50z"/>
    <path class="visor" d="M122 58c8-8 22-12 38-12s30 4 38 12v14c-8 6-22 9-38 9s-30-3-38-9z"/>
    <path class="detail" d="M146 98h28M150 104h20"/>`)}
  ${part('armour', `
    <ellipse cx="100" cy="150" rx="16" ry="11" transform="rotate(-28 100 150)"/>
    <ellipse cx="220" cy="150" rx="16" ry="11" transform="rotate(28 220 150)"/>
    <ellipse cx="78" cy="238" rx="11" ry="17" transform="rotate(8 78 238)"/>
    <ellipse cx="242" cy="238" rx="11" ry="17" transform="rotate(-8 242 238)"/>
    <rect x="137" y="154" width="46" height="104" rx="14"/>
    <ellipse cx="130" cy="424" rx="14" ry="19"/>
    <ellipse cx="190" cy="424" rx="14" ry="19"/>`)}
  ${part('visibility', `
    <path class="hit" d="M113 284H207M60 284l32 7M260 284l-32 7M111 478h36M173 478h36"/>
    <path d="M113 284H207M60 284l32 7M260 284l-32 7M111 478h36M173 478h36"/>`)}
</svg>`;

// ---- page -------------------------------------------------------------------

const shopLink = (s) =>
  s.category ? `<a class="link-btn" href="sales.html?category=${encodeURIComponent(s.category)}">${esc(c.shop.replace('{category}', tv('cat', s.category).toLowerCase()))}</a>` : '';
const lists = (s) => `
  <div class="gear-lists">
    <div class="gear-look"><h3>${esc(c.look)}</h3><ul>${s.look.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
    <div class="gear-skip"><h3>${esc(c.skip)}</h3><ul>${s.skip.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
  </div>`;

document.getElementById('doc').innerHTML = `
  <header class="doc-head">
    <h1>${esc(c.title)}</h1>
    <p class="doc-lead">${esc(c.lead)}</p>
  </header>

  <section class="gear-explorer" aria-label="${esc(c.title)}">
    <div class="rider-stage">
      ${RIDER}
      <p class="rider-hint">${esc(c.explore)}</p>
    </div>
    <div class="gear-panel">
      <div class="gear-chips" role="group" aria-label="${esc(c.contents)}">
        ${c.sections.map((s) => `<button type="button" class="pill" data-chip="${s.id}" aria-pressed="false">${esc(s.title)}</button>`).join('')}
      </div>
      <div class="gear-card" id="gear-card" aria-live="polite"></div>
    </div>
  </section>

  <div class="buy-order">
    <h2>${esc(c.orderTitle)}</h2>
    <ol>${BUY_ORDER.map((id) => `<li><a href="#${id}">${esc(byId[id].title)}</a></li>`).join('')}</ol>
  </div>

  <h2 class="gear-all-title">${esc(c.allTitle)}</h2>
  <div class="gear-sections">
    ${c.sections
      .map(
        (s) => `
      <section class="gear-item" id="${s.id}" aria-labelledby="${s.id}-title">
        <h2 id="${s.id}-title">${esc(s.title)}</h2>
        <p class="gear-intro">${esc(s.intro)}</p>
        ${lists(s)}
        <p class="gear-tip">${esc(s.tip)}</p>
        ${shopLink(s)}
      </section>`,
      )
      .join('')}
  </div>`;

// ---- diagram behaviour --------------------------------------------------------

const card = document.getElementById('gear-card');
const parts = [...document.querySelectorAll('.gear-part')];
const chips = [...document.querySelectorAll('[data-chip]')];
let current;

function select(id) {
  if (id === current || !byId[id]) return;
  current = id;
  const s = byId[id];
  for (const p of parts) p.classList.toggle('on', p.dataset.part === id);
  for (const ch of chips) {
    ch.classList.toggle('on', ch.dataset.chip === id);
    ch.setAttribute('aria-pressed', ch.dataset.chip === id);
  }
  card.innerHTML = `
    <h2>${esc(s.title)}</h2>
    <p class="gear-intro">${esc(s.intro)}</p>
    ${lists(s)}
    <p class="gear-tip">${esc(s.tip)}</p>
    <p class="gear-card-links">${shopLink(s)}<a class="link-btn" href="#${s.id}">${esc(c.readMore)}</a></p>`;
}

for (const p of parts) {
  const id = p.dataset.part;
  // hover for mice; touch and pen select on tap (click) so scrolling past the figure changes nothing
  p.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && select(id));
  p.addEventListener('click', () => select(id));
  p.addEventListener('focus', () => select(id));
  p.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select(id);
    }
  });
}
for (const ch of chips) ch.addEventListener('click', () => select(ch.dataset.chip));

select(BUY_ORDER[0]); // start on the helmet, the first thing to buy
