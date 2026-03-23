/**
 * profile.js
 *
 * My Searches and Wishlist views.
 */

import { getSearches, getWishlist, removeFromWishlist } from '../lib/supabase.js';

export function initProfile() {
  document.getElementById('my-searches-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    showSearches();
  });
  document.getElementById('my-wishlist-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    showWishlist();
  });

  // Close panel on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const panel = document.getElementById('profile-panel');
      if (panel) panel.remove();
    }
  });
}

async function showSearches() {
  const searches = await getSearches();
  const panel = getOrCreatePanel();

  if (searches.length === 0) {
    panel.innerHTML = `
      <div class="panel-header">
        <h3>my searches</h3>
        <button class="panel-close" onclick="this.closest('.profile-panel').remove()">×</button>
      </div>
      <p class="panel-empty">no saved searches yet ~ search for gifts and they'll appear here!</p>
    `;
    return;
  }

  panel.innerHTML = `
    <div class="panel-header">
      <h3>my searches</h3>
      <button class="panel-close" onclick="this.closest('.profile-panel').remove()">×</button>
    </div>
    <div class="panel-list">
      ${searches.map((s, i) => {
        const fd = s.form_data || {};
        const date = new Date(s.created_at).toLocaleDateString();
        return `
          <div class="panel-item panel-item-clickable" data-search-index="${i}">
            <div class="panel-item-top">
              <span class="panel-item-title">${fd.occasion || 'Gift'} for ${fd.relationship || 'someone'}</span>
              <span class="panel-item-date">${date}</span>
            </div>
            <span class="panel-item-sub">📍 ${fd.location || 'Unknown'} · ${fd.budget || ''}</span>
            <span class="panel-item-hint">tap to view →</span>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Click to view saved results
  panel.querySelectorAll('.panel-item-clickable').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.searchIndex);
      const search = searches[idx];
      if (!search) return;

      // Import renderResults dynamically and show the saved results
      import('./results.js').then(({ renderResults }) => {
        const results = search.results || {};
        const formData = search.form_data || {};
        renderResults(results, JSON.stringify(results), formData);

        // Show results section, hide form
        const resultsEl = document.getElementById('results');
        const formEl = document.getElementById('form-section');
        if (resultsEl) resultsEl.style.display = '';
        if (formEl) formEl.style.display = 'none';
        resultsEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      panel.remove();
    });
  });
}

async function showWishlist() {
  const items = await getWishlist();
  const panel = getOrCreatePanel();

  if (items.length === 0) {
    panel.innerHTML = `
      <div class="panel-header">
        <h3>my wishlist</h3>
        <button class="panel-close" onclick="this.closest('.profile-panel').remove()">×</button>
      </div>
      <p class="panel-empty">no favorites yet ~ tap the ♡ on any gift to save it here!</p>
    `;
    return;
  }

  panel.innerHTML = `
    <div class="panel-header">
      <h3>my wishlist ♥</h3>
      <button class="panel-close" onclick="this.closest('.profile-panel').remove()">×</button>
    </div>
    <div class="panel-list">
      ${items.map(item => {
        const searchQuery = encodeURIComponent(`${item.gift_name} ${item.gift_where || ''}`);
        return `
        <div class="panel-item wishlist-item" data-id="${item.id}">
          <div class="panel-item-top">
            <span class="panel-item-title">${item.gift_name}</span>
            <span class="panel-item-price">${item.gift_price || ''}</span>
          </div>
          <span class="panel-item-sub">${item.gift_type || ''}</span>
          <div class="wishlist-actions" style="display:none">
            <a href="https://www.google.com/search?q=${searchQuery}" target="_blank" class="wishlist-action-btn">🔍 search on Google</a>
            <a href="https://www.amazon.com/s?k=${encodeURIComponent(item.gift_name)}" target="_blank" class="wishlist-action-btn">🛒 find on Amazon</a>
            <button class="wishlist-action-btn wishlist-remove-btn" data-id="${item.id}">🗑 remove</button>
          </div>
        </div>
      `}).join('')}
    </div>
  `;

  // Toggle actions on tap
  panel.querySelectorAll('.wishlist-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.wishlist-action-btn')) return;
      const actions = item.querySelector('.wishlist-actions');
      // Close others
      panel.querySelectorAll('.wishlist-actions').forEach(a => {
        if (a !== actions) a.style.display = 'none';
      });
      actions.style.display = actions.style.display === 'none' ? 'flex' : 'none';
    });
  });

  // Remove buttons
  panel.querySelectorAll('.wishlist-remove-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      await removeFromWishlist(id);
      btn.closest('.wishlist-item').remove();
      if (panel.querySelectorAll('.wishlist-item').length === 0) {
        showWishlist();
      }
    });
  });
}

function getOrCreatePanel() {
  let panel = document.getElementById('profile-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'profile-panel';
    panel.className = 'profile-panel';
    document.body.appendChild(panel);
  }
  return panel;
}
