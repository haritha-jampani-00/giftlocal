/**
 * form.js
 *
 * All form logic: interest tag selection, custom pills, validation, and data collection.
 * No UI framework needed — clean vanilla JS.
 */

// ─── State ───────────────────────────────────────────────────────
let selectedInterests = new Set();
let customPills = [];
const MAX_INTERESTS = 5;

export function initForm() {
  const interestGrid = document.getElementById('interest-grid');
  const pillInput = document.getElementById('pill-input');

  // Interest tag toggle
  interestGrid.addEventListener('click', (e) => {
    const tag = e.target.closest('.interest-tag');
    if (!tag) return;

    const value = tag.dataset.value;

    if (selectedInterests.has(value)) {
      selectedInterests.delete(value);
      tag.classList.remove('selected');
    } else {
      if (getTotalSelected() >= MAX_INTERESTS) return;
      selectedInterests.add(value);
      tag.classList.add('selected');
    }
  });

  // Custom pill input — Enter or comma adds
  pillInput.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ',') && pillInput.value.trim()) {
      e.preventDefault();
      addCustomPill(pillInput.value.trim().replace(/,/g, ''));
      pillInput.value = '';
    }
    if (e.key === 'Backspace' && !pillInput.value && customPills.length) {
      removeCustomPill(customPills.length - 1);
    }
  });

  pillInput.addEventListener('blur', () => {
    if (pillInput.value.trim()) {
      addCustomPill(pillInput.value.trim());
      pillInput.value = '';
    }
  });

  // ── Location suggestions (pill-style) ────────────────────────
  initLocationSuggestions();
}

function getTotalSelected() {
  return selectedInterests.size + customPills.length;
}

// ─── Custom pills ────────────────────────────────────────────────
function addCustomPill(text) {
  if (getTotalSelected() >= MAX_INTERESTS) return;
  const cleaned = text.replace(/[^a-zA-Z\s\-]/g, '').trim().toLowerCase();
  if (!cleaned || customPills.includes(cleaned)) return;
  customPills.push(cleaned);
  renderCustomPills();
}

function removeCustomPill(i) {
  customPills.splice(i, 1);
  renderCustomPills();
}

function renderCustomPills() {
  let container = document.getElementById('custom-pills');
  if (!container) {
    container = document.createElement('div');
    container.id = 'custom-pills';
    container.className = 'pills-wrap';
    const row = document.querySelector('.custom-interest-row');
    row.parentNode.insertBefore(container, row);
  }
  container.innerHTML = customPills.map((text, i) =>
    `<span class="pill">${escapeHtml(text)}<button type="button" aria-label="Remove ${text}" onclick="window._removeCustomPill(${i})">×</button></span>`
  ).join('');
  if (customPills.length === 0) container.innerHTML = '';
}

window._removeCustomPill = removeCustomPill;

// ─── Validation ──────────────────────────────────────────────────
export function validateForm() {
  const fields = {
    occasion:     { el: document.getElementById('occasion'),     label: 'Occasion' },
    age:          { el: document.getElementById('age'),          label: 'Age' },
    relationship: { el: document.getElementById('relationship'), label: 'Relationship' },
    budget:       { el: document.getElementById('budget'),       label: 'Budget' },
    location:     { el: document.getElementById('location'),     label: 'City & country' },
  };

  for (const [, { el, label }] of Object.entries(fields)) {
    if (!el.value.trim()) {
      return { valid: false, error: `Please fill in: ${label}` };
    }
  }

  if (getTotalSelected() === 0) {
    return { valid: false, error: 'Pick at least one interest — it\'s what makes suggestions feel personal.' };
  }

  const age = parseInt(document.getElementById('age').value);
  if (isNaN(age) || age < 1 || age > 120) {
    return { valid: false, error: 'Please enter a valid age.' };
  }

  const budgetText = document.getElementById('budget').value;
  const budgetNumbers = budgetText.match(/\d+/g);
  if (!budgetNumbers || budgetNumbers.every(n => parseInt(n) <= 0)) {
    return { valid: false, error: 'Please enter a budget greater than 0.' };
  }

  return { valid: true };
}

// ─── Data collection ─────────────────────────────────────────────
export function getFormData() {
  const allInterests = [...selectedInterests, ...customPills];
  const currency = document.getElementById('currency')?.value || '$';
  const budgetAmount = document.getElementById('budget').value;
  return {
    occasion:     document.getElementById('occasion').value,
    age:          document.getElementById('age').value,
    relationship: document.getElementById('relationship').value,
    currency:     currency,
    budget:       `${currency}${budgetAmount}`,
    location:     document.getElementById('location').value,
    extra:        document.getElementById('extra').value,
    personality:  allInterests.join(', '),
  };
}

// ─── Set form data (for inline editing from summary bar) ─────────
export function setFormData(data) {
  if (data.occasion) document.getElementById('occasion').value = data.occasion;
  if (data.age) document.getElementById('age').value = data.age;
  if (data.relationship) document.getElementById('relationship').value = data.relationship;
  if (data.location) document.getElementById('location').value = data.location;
  if (data.budget) {
    // Strip currency prefix
    document.getElementById('budget').value = data.budget.replace(/^[^0-9]*/, '');
  }
}

// ─── Gemini API key management (primary, free) ──────────────────
const GEMINI_KEY_STORAGE = 'giftlocal_gemini_key';

export function getGeminiKey() {
  if (window.GIFTLOCAL_CONFIG?.geminiKey &&
      window.GIFTLOCAL_CONFIG.geminiKey !== 'YOUR_GEMINI_KEY_HERE') {
    return window.GIFTLOCAL_CONFIG.geminiKey;
  }
  return localStorage.getItem(GEMINI_KEY_STORAGE) || '';
}

export function saveGeminiKey(key) {
  localStorage.setItem(GEMINI_KEY_STORAGE, key);
}

// ─── Anthropic API key management (optional premium) ─────────────
const API_KEY_STORAGE = 'giftlocal_api_key';

export function getApiKey() {
  if (window.GIFTLOCAL_CONFIG?.apiKey &&
      window.GIFTLOCAL_CONFIG.apiKey !== 'YOUR_API_KEY_HERE') {
    return window.GIFTLOCAL_CONFIG.apiKey;
  }
  return localStorage.getItem(API_KEY_STORAGE) || '';
}

export function saveApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE, key);
}

export function promptForApiKey() {
  const existing = getApiKey();
  const key = window.prompt(
    existing
      ? 'Update your Anthropic API key (get one free at platform.anthropic.com):'
      : 'Enter your Anthropic API key to continue.\n\nGet one free (no card) at: platform.anthropic.com',
    existing || ''
  );
  if (key && key.trim()) {
    saveApiKey(key.trim());
    return key.trim();
  }
  return existing;
}


// ─── Location suggestions (OpenStreetMap Nominatim — free) ───────
let locDebounce = null;

function initLocationSuggestions() {
  const input = document.getElementById('location');
  const suggestions = document.getElementById('location-suggestions');
  if (!input || !suggestions) return;

  input.addEventListener('input', () => {
    clearTimeout(locDebounce);
    const q = input.value.trim();
    if (q.length < 2) { closeSuggestions(); return; }
    locDebounce = setTimeout(() => fetchSuggestions(q), 350);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSuggestions();
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.location-wrap')) closeSuggestions();
  });
}

async function fetchSuggestions(query) {
  const suggestions = document.getElementById('location-suggestions');
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&featuretype=city`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (!data.length) { closeSuggestions(); return; }

    const seen = new Set();
    const places = data.filter(p => {
      const addr = p.address || {};
      const city = addr.city || addr.town || addr.village || addr.state || p.name || '';
      const country = addr.country || '';
      const key = `${city.toLowerCase()},${country.toLowerCase()}`;
      if (seen.has(key) || !city) return false;
      seen.add(key);
      return true;
    }).slice(0, 4);

    if (!places.length) { closeSuggestions(); return; }

    suggestions.innerHTML = places.map(p => {
      const addr = p.address || {};
      const city = addr.city || addr.town || addr.village || addr.state || p.name || '';
      const country = addr.country || '';
      const value = country ? `${city}, ${country}` : city;
      return `<button type="button" class="loc-pill" data-value="${escapeHtml(value)}">
        📍 <span class="loc-city">${escapeHtml(city)}</span><span class="loc-country">${country ? ', ' + escapeHtml(country) : ''}</span>
      </button>`;
    }).join('');

    suggestions.classList.add('open');

    suggestions.querySelectorAll('.loc-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.getElementById('location').value = pill.dataset.value;
        closeSuggestions();
      });
    });
  } catch {
    closeSuggestions();
  }
}

function closeSuggestions() {
  const el = document.getElementById('location-suggestions');
  if (el) { el.classList.remove('open'); el.innerHTML = ''; }
}

// ─── Helpers ─────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
