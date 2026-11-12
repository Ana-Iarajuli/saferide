// school.html?id=…: one school, its location, reviews, and (for logged-in users) the review form.
// One review per user per school: writing again updates it (see supabase/schema.sql).

import { t, lang } from './i18n.js';
import { mountLayout } from './layout.js';
import { esc, safeUrl } from './shared.js';
import { getClient, onUserChange, usernameOf } from './auth.js';
import { loadSchools, schoolName, cityName, stars, ratingLine, makeMap, pin } from './schools-data.js';

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
    [t('school.location'), `<a href="${esc(safeUrl(school.source))}" target="_blank" rel="noopener noreferrer">${esc(t('school.openMap'))}</a>`],
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
      return `
      <li class="review ${mine ? 'is-mine' : ''}">
        <div class="review-head">
          <span class="avatar sm" aria-hidden="true">${esc(name.slice(0, 1).toUpperCase())}</span>
          <strong>${esc(name)}</strong>${mine ? ` <span class="muted">(${esc(t('reviews.you'))})</span>` : ''}
          ${stars(r.rating, { size: 'sm' })}
          <time class="muted" datetime="${esc(r.created_at)}">${esc(date(r.created_at))}${edited ? `, ${esc(t('reviews.edited'))}` : ''}</time>
        </div>
        ${r.comment ? `<p>${esc(r.comment)}</p>` : ''}
      </li>`;
    })
    .join('')}</ol>`;
}

function renderForm() {
  const box = document.getElementById('review-form');
  if (reviews === null) {
    box.innerHTML = '';
    return;
  }
  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    box.innerHTML = `<p class="review-login">${esc(t('reviews.loginPrompt'))} <a class="btn btn-sm" href="account.html?next=${next}">${esc(t('reviews.login'))}</a></p>`;
    return;
  }
  const mine = reviews.find((r) => r.user_id === user.id);
  box.innerHTML = `
    <form class="review-form" novalidate>
      <h3>${esc(t(mine ? 'reviews.editTitle' : 'reviews.formTitle'))}</h3>
      <fieldset class="star-input">
        <legend>${esc(t('reviews.ratingLabel'))}</legend>
        <div class="star-row">
          ${[5, 4, 3, 2, 1]
            .map(
              (n) => `<input type="radio" name="rating" id="star-${n}" value="${n}" ${mine?.rating === n ? 'checked' : ''}>
              <label for="star-${n}" title="${esc(t('reviews.star', { n }))}"><span aria-hidden="true">★</span><span class="sr-only">${esc(t('reviews.star', { n }))}</span></label>`,
            )
            .join('')}
        </div>
      </fieldset>
      <label class="field">
        <span class="field-label">${esc(t('reviews.comment'))}</span>
        <textarea name="comment" rows="4" maxlength="1000">${esc(mine?.comment ?? '')}</textarea>
        <small class="field-hint">${esc(t('reviews.commentHint'))}</small>
      </label>
      <div class="form-msg" hidden></div>
      <div class="review-actions">
        <button type="submit" class="btn cta">${esc(t(mine ? 'reviews.update' : 'reviews.post'))}</button>
        ${mine ? `<button type="button" class="link-btn danger" data-delete>${esc(t('reviews.delete'))}</button>` : ''}
      </div>
    </form>`;

  const form = box.querySelector('form');
  const msg = (text, kind) => {
    const el = form.querySelector('.form-msg');
    el.textContent = text;
    el.className = `form-msg ${kind}`;
    el.hidden = !text;
  };
  const run = async (fn, done) => {
    form.querySelectorAll('button').forEach((b) => (b.disabled = true));
    try {
      const { error } = await fn();
      if (error) throw error;
      reviews = await loadReviews();
      renderReviews();
      renderForm(); // re-drawn: "Write" becomes "Update" after posting, and back after deleting
      const note = document.querySelector('.review-form .form-msg');
      if (note) Object.assign(note, { textContent: t(done), className: 'form-msg ok', hidden: false });
    } catch (e) {
      console.error(e);
      msg(t('reviews.error'), 'error');
      form.querySelectorAll('button').forEach((b) => (b.disabled = false));
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const rating = Number(form.elements.rating.value);
    if (!rating) return msg(t('reviews.pickRating'), 'error');
    run(
      () =>
        client
          .from('school_reviews')
          .upsert({ school_id: school.id, user_id: user.id, rating, comment: form.elements.comment.value.trim() }, { onConflict: 'school_id,user_id' }),
      mine ? 'reviews.updated' : 'reviews.posted',
    );
  });
  form.querySelector('[data-delete]')?.addEventListener('click', () => run(() => client.from('school_reviews').delete().eq('id', mine.id), 'reviews.deleted'));
}

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
