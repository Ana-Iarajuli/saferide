// school.html?id=…: one school, its location, reviews, and (for logged-in users) the review form.
// One review per user per school: writing again updates it (see supabase/schema.sql).

import { t, lang } from './i18n.js';
import { mountLayout } from './layout.js';
import { esc, safeUrl } from './shared.js';
import { getClient, onUserChange, usernameOf } from './auth.js';
import { loadSchools, schoolName, cityName, stars, ratingLine, makeMap, pin, googleMapsUrl } from './schools-data.js';

mountLayout('schools');

const root = document.getElementById('school');
const id = new URLSearchParams(location.search).get('id');
let client;
let school;
let user = null;
let reviews = null; // null = unavailable (accounts/reviews not set up)

const date = (iso) => new Date(iso).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' });

async function loadReviews() {
  if (!client) return null;
  const { data, error } = await client
    .from('school_reviews')
    .select('id, rating, comment, created_at, updated_at, user_id, profiles(username)')
    .eq('school_id', school.id)
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('reviews unavailable:', error.message);
    return null;
  }
  return data;
}

function summary() {
  if (!reviews?.length) return null;
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  return { average: Math.round(avg * 10) / 10, count: reviews.length };
}

function renderPage() {
  document.title = t('school.pageTitle', { name: schoolName(school) });
  const facts = [
    [t('school.city'), esc(cityName(school))],
    [t('school.categories'), school.categories?.length ? esc(school.categories.join(', ')) : `<span class="muted">${esc(t('school.categoriesUnknown'))}</span>`],
    school.phone && [t('school.phone'), `<a href="tel:${esc(school.phone.replace(/\s/g, ''))}">${esc(school.phone)}</a>`],
    school.website && [t('school.website'), `<a href="${esc(safeUrl(school.website))}" target="_blank" rel="noopener noreferrer">${esc(school.website.replace(/^https?:\/\/(www\.)?/, ''))}</a>`],
    [t('school.location'), `<a href="${esc(googleMapsUrl(school))}" target="_blank" rel="noopener noreferrer">${esc(t('school.openMap'))}</a>`],
  ].filter(Boolean);

  root.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="schools.html">${esc(t('school.back'))}</a></nav>
    <div class="school-head">
      <div>
        <p class="school-city">${esc(cityName(school))}</p>
        <h1>${esc(schoolName(school))}</h1>
        ${school.description ? `<p class="school-desc">${esc(school.description[lang] ?? school.description.en)}</p>` : ""}
        <div id="school-rating"></div>
        <dl class="specs school-facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('')}</dl>
      </div>
      <div class="school-map" id="school-map" role="img" aria-label="${esc(schoolName(school))}"></div>
    </div>
    <section class="reviews" aria-labelledby="reviews-title">
      <h2 id="reviews-title">${esc(t('reviews.heading'))}</h2>
      <div id="review-form"></div>
      <div id="review-list"></div>
    </section>`;

  const map = makeMap(document.getElementById('school-map'), { zoomControl: false, dragging: !matchMedia('(pointer: coarse)').matches });
  map.setView([school.lat, school.lng], 15);
  pin(school, { active: true }).addTo(map);
}

// ---- reviews ----------------------------------------------------------------
// The form above the list only writes a new review. Your own review is edited and deleted
// in place, in the list; other people's reviews are read-only (the database enforces the
// same rules, see supabase/schema.sql).

let editing = false; // your review is open for editing in the list
let flash = null; // one-off message shown after posting / saving / deleting

/** Star picker + comment box, shared by the new-review form and the in-place editor. */
function reviewFields(prefix, review) {
  return `
    <fieldset class="star-input">
      <legend>${esc(t('reviews.ratingLabel'))}</legend>
      <div class="star-row">
        ${[5, 4, 3, 2, 1]
          .map(
            (n) => `<input type="radio" name="rating" id="${prefix}-star-${n}" value="${n}" ${review?.rating === n ? 'checked' : ''}>
            <label for="${prefix}-star-${n}" title="${esc(t('reviews.star', { n }))}"><span aria-hidden="true">★</span><span class="sr-only">${esc(t('reviews.star', { n }))}</span></label>`,
          )
          .join('')}
      </div>
    </fieldset>
    <label class="field">
      <span class="field-label">${esc(t('reviews.comment'))}</span>
      <textarea name="comment" rows="4" maxlength="1000">${esc(review?.comment ?? '')}</textarea>
      <small class="field-hint">${esc(t('reviews.commentHint'))}</small>
    </label>
    <div class="form-msg" hidden></div>`;
}

const myReview = () => (user && reviews ? reviews.find((r) => r.user_id === user.id) : null);

function showMsg(form, text, kind) {
  const el = form.querySelector('.form-msg');
  Object.assign(el, { textContent: text, className: `form-msg ${kind}`, hidden: !text });
}

/** Runs a database change, then reloads and redraws the reviews; `done` is the message to show. */
async function save(form, change, done) {
  form?.querySelectorAll('button').forEach((b) => (b.disabled = true));
  try {
    const { error } = await change();
    if (error) throw error;
    reviews = await loadReviews();
    editing = false;
    flash = done;
    renderReviews();
    renderForm();
  } catch (e) {
    console.error(e);
    if (form) {
      showMsg(form, t('reviews.error'), 'error');
      form.querySelectorAll('button').forEach((b) => (b.disabled = false));
    } else alert(t('reviews.error'));
  }
}

function readFields(form) {
  return { rating: Number(form.elements.rating.value), comment: form.elements.comment.value.trim() };
}

function renderReviews() {
  document.getElementById('school-rating').innerHTML = reviews ? ratingLine(summary()) : '';
  const list = document.getElementById('review-list');
  if (reviews === null) {
    list.innerHTML = `<p class="muted">${esc(t('reviews.offline'))}</p>`;
    return;
  }
  if (!reviews.length) {
    list.innerHTML = `<p class="reviews-empty">${esc(t('reviews.empty'))}</p>`;
    return;
  }
  list.innerHTML = `<ol class="review-list">${reviews
    .map((r) => {
      const mine = user && r.user_id === user.id;
      const name = r.profiles?.username ?? '—';
      const edited = new Date(r.updated_at) - new Date(r.created_at) > 60000;
      const head = `
        <div class="review-head">
          <span class="avatar sm" aria-hidden="true">${esc(name.slice(0, 1).toUpperCase())}</span>
          <strong>${esc(name)}</strong>${mine ? ` <span class="muted">(${esc(t('reviews.you'))})</span>` : ''}
          ${mine && editing ? '' : stars(r.rating, { size: 'sm' })}
          <time class="muted" datetime="${esc(r.created_at)}">${esc(date(r.created_at))}${edited ? `, ${esc(t('reviews.edited'))}` : ''}</time>
        </div>`;
      if (mine && editing) {
        return `
        <li class="review is-mine is-editing">
          ${head}
          <form class="review-edit" novalidate>
            ${reviewFields('edit', r)}
            <div class="review-actions">
              <button type="submit" class="btn cta">${esc(t('reviews.save'))}</button>
              <button type="button" class="link-btn" data-cancel>${esc(t('reviews.cancel'))}</button>
            </div>
          </form>
        </li>`;
      }
      return `
        <li class="review ${mine ? 'is-mine' : ''}">
          ${head}
          ${r.comment ? `<p>${esc(r.comment)}</p>` : ''}
          ${
            mine
              ? `<div class="review-own-actions">
                   <button type="button" class="link-btn" data-edit>${esc(t('reviews.edit'))}</button>
                   <button type="button" class="link-btn danger" data-delete>${esc(t('reviews.delete'))}</button>
                 </div>`
              : ''
          }
        </li>`;
    })
    .join('')}</ol>`;

  const editForm = list.querySelector('.review-edit');
  if (editForm) {
    editForm.elements.comment.focus();
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const { rating, comment } = readFields(editForm);
      if (!rating) return showMsg(editForm, t('reviews.pickRating'), 'error');
      save(editForm, () => client.from('school_reviews').update({ rating, comment }).eq('id', myReview().id), 'reviews.updated');
    });
  }
}

function renderForm() {
  const box = document.getElementById('review-form');
  const note = flash ? `<div class="form-msg ok">${esc(t(flash))}</div>` : '';
  flash = null;
  if (reviews === null) {
    box.innerHTML = '';
    return;
  }
  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    box.innerHTML = `<p class="review-login">${esc(t('reviews.loginPrompt'))} <a class="btn btn-sm" href="account.html?next=${next}">${esc(t('reviews.login'))}</a></p>`;
    return;
  }
  if (myReview()) {
    // one review per person per school: once written, it is changed in the list, not here
    box.innerHTML = `<div class="review-done">${note}<p class="muted">${esc(t('reviews.alreadyReviewed'))}</p></div>`;
    return;
  }
  box.innerHTML = `
    ${note}
    <form class="review-form" novalidate>
      <h3>${esc(t('reviews.formTitle'))}</h3>
      ${reviewFields('new')}
      <div class="review-actions">
        <button type="submit" class="btn cta">${esc(t('reviews.post'))}</button>
      </div>
    </form>`;

  const form = box.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { rating, comment } = readFields(form);
    if (!rating) return showMsg(form, t('reviews.pickRating'), 'error');
    save(form, () => client.from('school_reviews').insert({ school_id: school.id, user_id: user.id, rating, comment }), 'reviews.posted');
  });
}

// Edit / Cancel / Delete on your own review in the list
document.getElementById('school').addEventListener('click', (e) => {
  if (e.target.closest('[data-edit]')) {
    editing = true;
    renderReviews();
  } else if (e.target.closest('[data-cancel]')) {
    editing = false;
    renderReviews();
  } else if (e.target.closest('[data-delete]')) {
    if (!confirm(t('reviews.confirmDelete'))) return;
    save(null, () => client.from('school_reviews').delete().eq('id', myReview().id), 'reviews.deleted');
  }
});

async function boot() {
  try {
    school = (await loadSchools()).find((s) => s.id === id);
  } catch {
    school = null;
  }
  if (!school) {
    root.innerHTML = `<div class="message"><p>${esc(t('school.notFound'))}</p><p><a href="schools.html">${esc(t('school.back'))}</a></p></div>`;
    return;
  }
  renderPage();
  client = await getClient();
  reviews = await loadReviews();
  renderReviews();
  onUserChange((u) => {
    user = u;
    renderReviews();
    renderForm();
  });
}

boot();
