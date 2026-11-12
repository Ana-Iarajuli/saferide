// licence.html: motorcycle licence rules, rendered from js/content/licence.js.

import { lang } from './i18n.js';
import { mountLayout } from './layout.js';
import { esc } from './shared.js';
import { CONTENT, SOURCES, CHECKED } from './content/licence.js';

mountLayout('licence');
const c = CONTENT[lang] ?? CONTENT.en;
document.title = `${c.title} — SafeRide`;

const host = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
const sources = (keys) =>
  `<p class="source">${esc(c.sourceLabel)}: ${keys
    .map((k) => `<a href="${esc(SOURCES[k])}" target="_blank" rel="noopener noreferrer">${esc(host(SOURCES[k]))}</a>`)
    .join(', ')}</p>`;
const table = (head, rows, cls) => `
  <div class="table-wrap"><table class="doc-table ${cls}">
    <thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((cell, i) => (i === 0 ? `<th scope="row">${esc(cell)}</th>` : `<td>${esc(cell)}</td>`)).join('')}</tr>`).join('')}</tbody>
  </table></div>`;

const checkedDate = new Date(CHECKED).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' });

document.getElementById('doc').innerHTML = `
  <header class="doc-head">
    <h1>${esc(c.title)}</h1>
    <p class="doc-lead">${esc(c.lead)}</p>
    <p class="doc-checked">${esc(c.checked.replace('{date}', checkedDate))}</p>
  </header>

  <section aria-labelledby="cat-title">
    <h2 id="cat-title">${esc(c.catTitle)}</h2>
    ${table(c.catHead, c.cats, 'cat-table')}
    <ul class="doc-notes">${c.catNotes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
    ${sources(c.catSources)}
  </section>

  <section aria-labelledby="steps-title">
    <h2 id="steps-title">${esc(c.stepsTitle)}</h2>
    <ol class="doc-steps">
      ${c.steps
        .map(
          (s) => `
        <li>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.body)}</p>
          ${s.list.length ? `<ul>${s.list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
          ${sources(s.sources)}
        </li>`,
        )
        .join('')}
    </ol>
  </section>

  <section aria-labelledby="fees-title">
    <h2 id="fees-title">${esc(c.feesTitle)}</h2>
    ${table(c.feesHead, c.fees, 'fee-table')}
    ${sources(c.feesSources)}
  </section>

  <section class="doc-unknown" aria-labelledby="unknown-title">
    <h2 id="unknown-title">${esc(c.unknownTitle)}</h2>
    <ul>${c.unknown.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    <p>${esc(c.unknownAsk)}</p>
  </section>

  <aside class="doc-next">
    <p><strong>${esc(c.nextTitle)}:</strong> ${esc(c.next)}</p>
    <a class="btn" href="schools.html">${esc(c.nextLink)}</a>
  </aside>`;
