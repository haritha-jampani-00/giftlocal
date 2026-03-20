/**
 * results.js
 *
 * Renders gift suggestions as a 2-column card grid.
 * Handles search link generation by gift type.
 */

/**
 * Render the full results section.
 *
 * @param {object} data     - parsed JSON from Claude
 * @param {string} rawText  - raw response text (stored for conversation history)
 * @param {object} formData - original form data for context
 */
export function renderResults(data, rawText, formData) {
  const cityName = formData.location.split(',')[0].trim();

  // Update header
  document.getElementById('results-title').textContent =
    `Gifts for your ${formData.relationship.toLowerCase()} in ${cityName}`;
  document.getElementById('results-sub').textContent =
    data.city_line || '';

  // Reset category tabs to "All"
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  const allTab = document.querySelector('.cat-tab[data-category="all"]');
  if (allTab) allTab.classList.add('active');

  // Store raw text for conversation refinement
  const container = document.getElementById('gift-cards-container');
  container.setAttribute('data-raw', rawText);
  container.innerHTML = '';

  // Create grid wrapper
  const grid = document.createElement('div');
  grid.className = 'gift-cards-grid';

  // Render each gift card with staggered animation
  (data.gifts || []).forEach((gift, i) => {
    const card = buildGiftCard(gift, formData.location, i);
    grid.appendChild(card);
  });

  container.appendChild(grid);

  // Star pick
  const starSection = document.getElementById('star-pick');
  const starText = document.getElementById('star-pick-text');
  if (data.star_pick) {
    starText.textContent = data.star_pick;
    starSection.style.display = 'block';
  } else {
    starSection.style.display = 'none';
  }
}

/**
 * Build a single gift card DOM element.
 */
function buildGiftCard(gift, location, index) {
  const card = document.createElement('div');
  card.className = 'gift-card';
  card.dataset.type = gift.type || 'Physical gift';
  card.style.animationDelay = `${index * 0.08}s`;

  const typeClass = getTypeClass(gift.type);
  const searchLinks = buildSearchLinks(gift, location);
  const searchHtml = searchLinks ? `<div class="gift-search-links">${searchLinks}</div>` : '';

  card.innerHTML = `
    <div class="gift-card-top">
      <div class="gift-name">${escapeHtml(gift.name)}</div>
      <div class="gift-price">${escapeHtml(gift.price)}</div>
    </div>
    <span class="gift-type-badge ${typeClass}">${escapeHtml(gift.type || 'Gift')}</span>
    <p class="gift-why">
      <strong>Why it fits:</strong> ${escapeHtml(gift.why)}
    </p>
    <p class="gift-where">
      <strong>Where to find it:</strong> ${escapeHtml(gift.where)}
    </p>
    ${searchHtml}
  `;

  return card;
}

/**
 * Return CSS modifier class based on gift type.
 */
function getTypeClass(type = '') {
  const t = type.toLowerCase();
  if (t.includes('experience')) return 'badge-experience';
  if (t.includes('local') || t.includes('craft')) return 'badge-local';
  if (t.includes('food')) return 'badge-food';
  if (t.includes('subscription')) return 'badge-sub';
  return 'badge-physical';
}

/**
 * Build smart search links based on gift type.
 * Routes to the most relevant platform for each category.
 */
function buildSearchLinks(gift, location) {
  const city = location.split(',')[0].trim();
  const country = (location.split(',')[1] || '').trim().toLowerCase();
  const type = (gift.type || '').toLowerCase();

  const region = getRegion(country, location);
  const googleDomain = getGoogleDomain(region);

  const name = (gift.name || '').trim();
  const words = name.split(/\s+/).length;
  const genericTerms = ['gift', 'present', 'something', 'item', 'thing', 'stuff'];
  const isGeneric = words <= 1 || genericTerms.includes(name.toLowerCase());
  if (isGeneric) return '';

  if (type.includes('subscription')) return '';

  const links = [];
  const nameQuery = encodeURIComponent(name);

  // Amazon link with affiliate tag (for physical/craft/food gifts)
  if (!type.includes('experience')) {
    const amazonUrl = getAmazonLink(region, nameQuery);
    if (amazonUrl) {
      const amazonNames = { in: 'Amazon.in', uk: 'Amazon.co.uk', eu: 'Amazon.de' };
      const amazonName = amazonNames[region] || 'Amazon';
      links.push({ source: amazonName, url: amazonUrl });
    }
  }

  // Google search
  const searchQuery = type.includes('experience')
    ? `${name} experience in ${city}`
    : `${name} in ${city}`;
  links.push({ source: 'Google', url: `${googleDomain}/search?q=${encodeURIComponent(searchQuery)}` });

  return links.map(({ url, source }) => `
    <button class="copy-link-pill" data-url="${escapeHtml(url)}" title="Copy ${source} link" onclick="
      navigator.clipboard.writeText(this.dataset.url).then(() => {
        const orig = this.innerHTML;
        this.innerHTML = '✓ copied!';
        this.classList.add('copied');
        setTimeout(() => { this.innerHTML = orig; this.classList.remove('copied'); }, 1500);
      })
    ">
      <span class="copy-source">${source}</span>
      <span class="copy-icon">📋</span>
    </button>
  `).join('');
}

/**
 * Build Amazon link with affiliate tag for the detected region.
 */
function getAmazonLink(region, query) {
  const config = window.GIFTLOCAL_CONFIG?.affiliates || {};

  const domains = {
    in: { domain: 'https://www.amazon.in', tag: config.amazon_in },
    uk: { domain: 'https://www.amazon.co.uk', tag: config.amazon_uk },
    eu: { domain: 'https://www.amazon.de', tag: config.amazon_com },
    us: { domain: 'https://www.amazon.com', tag: config.amazon_com },
  };

  const info = domains[region] || domains.us;
  let url = `${info.domain}/s?k=${query}`;

  // Append affiliate tag if configured
  if (info.tag) {
    url += `&tag=${encodeURIComponent(info.tag)}`;
  }

  return url;
}

/**
 * Detect region from country/location text.
 */
function getRegion(country, location) {
  const loc = (country + ' ' + location).toLowerCase();
  if (/india|भारत/.test(loc)) return 'in';
  if (/uk|england|scotland|wales|britain|london/.test(loc)) return 'uk';
  if (/germany|france|spain|italy|netherlands|portugal|austria|belgium|ireland|greece|finland|sweden|denmark|norway|switzerland|poland|czech|hungary|romania|croatia/.test(loc)) return 'eu';
  return 'us';
}

function getGoogleDomain(region) {
  const domains = {
    in: 'https://www.google.co.in',
    uk: 'https://www.google.co.uk',
    eu: 'https://www.google.com',
  };
  return domains[region] || 'https://www.google.com';
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
