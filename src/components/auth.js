/**
 * auth.js
 *
 * Login/signup modal UI and auth state management.
 * Matches the cute pastel aesthetic.
 */

import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  getUser,
  onAuthChange,
} from '../lib/supabase.js';

let currentUser = null;

export function initAuth() {
  const signInBtn = document.getElementById('sign-in-btn');
  const authModal = document.getElementById('auth-modal');
  const authClose = document.getElementById('auth-close');
  const googleBtn = document.getElementById('auth-google-btn');
  const emailForm = document.getElementById('auth-email-form');
  const toggleLink = document.getElementById('auth-toggle');
  const authTitle = document.getElementById('auth-title');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const authError = document.getElementById('auth-error');
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');
  const signOutBtn = document.getElementById('sign-out-btn');

  let isSignUp = false;

  // Open modal
  signInBtn?.addEventListener('click', () => {
    authModal.hidden = false;
    authError.hidden = true;
    document.body.style.overflow = 'hidden';
  });

  // Close modal
  authClose?.addEventListener('click', closeModal);
  authModal?.addEventListener('click', (e) => {
    if (e.target === authModal) closeModal();
  });

  function closeModal() {
    authModal.hidden = true;
    document.body.style.overflow = '';
  }

  // Google sign in
  googleBtn?.addEventListener('click', async () => {
    authError.hidden = true;
    const { error } = await signInWithGoogle();
    if (error) showAuthError(error.message || 'Google sign-in failed');
  });

  // Email form
  emailForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    authError.hidden = true;
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;

    if (!email || !password) {
      showAuthError('Please enter email and password');
      return;
    }
    if (password.length < 6) {
      showAuthError('Password must be at least 6 characters');
      return;
    }

    authSubmitBtn.disabled = true;
    authSubmitBtn.textContent = isSignUp ? 'creating account…' : 'signing in…';

    const { data, error } = isSignUp
      ? await signUpWithEmail(email, password)
      : await signInWithEmail(email, password);

    authSubmitBtn.disabled = false;
    authSubmitBtn.textContent = isSignUp ? 'create account' : 'sign in';

    if (error) {
      showAuthError(error.message || 'Something went wrong');
      return;
    }

    if (isSignUp && data?.user?.identities?.length === 0) {
      showAuthError('This email is already registered — try signing in instead');
      return;
    }

    // If session exists, user is logged in (confirmation disabled)
    if (data?.session) {
      closeModal();
      if (isSignUp) showOnboarding();
      return;
    }

    // If no session but signup succeeded, confirmation might be enabled
    if (isSignUp && data?.user && !data?.session) {
      showAuthError('Check your email for a confirmation link!');
      authError.style.background = 'var(--mint-light)';
      authError.style.color = 'var(--ink)';
      return;
    }

    closeModal();
  });

  // Toggle sign in / sign up
  toggleLink?.addEventListener('click', (e) => {
    e.preventDefault();
    isSignUp = !isSignUp;
    authTitle.textContent = isSignUp ? 'create an account ✨' : 'welcome back ✨';
    authSubmitBtn.textContent = isSignUp ? 'create account' : 'sign in';
    toggleLink.textContent = isSignUp ? 'already have an account? sign in' : 'no account? create one';
    authError.hidden = true;
  });

  // Profile dropdown toggle
  profileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('show');
  });

  // Close dropdown on outside click
  document.addEventListener('click', () => {
    profileDropdown?.classList.remove('show');
  });

  // Sign out
  signOutBtn?.addEventListener('click', async () => {
    profileDropdown.classList.remove('show');
    sessionStorage.clear();
    // Reset all form fields
    document.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.tagName === 'SELECT') el.selectedIndex = 0;
      else el.value = '';
    });
    document.querySelectorAll('.interest-tag.selected').forEach(t => t.classList.remove('selected'));
    const cp = document.getElementById('custom-pills');
    if (cp) cp.innerHTML = '';
    await signOut();
    window.location.href = window.location.origin;
  });

  // Auth state listener
  onAuthChange((user) => {
    const wasLoggedIn = !!currentUser;
    currentUser = user;
    updateUI(user);
    // User just signed out — clear everything
    if (wasLoggedIn && !user) {
      sessionStorage.removeItem('giftlocal_last_results');
      // Reset form
      const form = document.getElementById('form-section');
      if (form) {
        form.querySelectorAll('input, select, textarea').forEach(el => {
          if (el.type === 'number' || el.type === 'text' || el.type === 'email') el.value = '';
          else if (el.tagName === 'SELECT') el.selectedIndex = 0;
          else if (el.tagName === 'TEXTAREA') el.value = '';
        });
      }
      // Clear interests
      document.querySelectorAll('.interest-tag.selected').forEach(t => t.classList.remove('selected'));
      const customPills = document.getElementById('custom-pills');
      if (customPills) customPills.innerHTML = '';
      // Hide results, show form
      const resultsEl = document.getElementById('results');
      const formEl = document.getElementById('form-section');
      const summaryBar = document.getElementById('summary-bar');
      if (resultsEl) { resultsEl.style.display = 'none'; resultsEl.classList.remove('show'); }
      if (formEl) { formEl.style.display = 'block'; formEl.classList.remove('hiding'); }
      if (summaryBar) summaryBar.classList.remove('show');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Check initial state
  getUser().then((user) => {
    currentUser = user;
    updateUI(user);
  });

  function showAuthError(msg) {
    authError.textContent = msg;
    authError.hidden = false;
    authError.style.background = '';
    authError.style.color = '';
  }
}

function updateUI(user) {
  const signInBtn = document.getElementById('sign-in-btn');
  const profileBtn = document.getElementById('profile-btn');
  const profileName = document.getElementById('profile-name');
  const profileAvatar = document.getElementById('profile-avatar');

  if (user) {
    signInBtn.style.display = 'none';
    profileBtn.style.display = 'flex';
    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    const initial = name.charAt(0).toUpperCase();
    const avatar = user.user_metadata?.avatar_url;
    const firstName = user.user_metadata?.first_name || name;
    if (avatar) {
      profileAvatar.src = avatar;
      profileAvatar.style.display = 'block';
    } else {
      profileAvatar.style.display = 'none';
    }
    profileName.textContent = `hello, ${firstName.toLowerCase()}! 👋`;
  } else {
    signInBtn.style.display = '';
    profileBtn.style.display = 'none';
  }
}

export function getCurrentUser() {
  return currentUser;
}

function showOnboarding() {
  // Create onboarding modal
  const overlay = document.createElement('div');
  overlay.className = 'auth-modal-backdrop';
  overlay.innerHTML = `
    <div class="auth-modal onboarding-modal">
      <h2 class="auth-title">one more thing! 🎉</h2>
      <p class="auth-subtitle">tell us a little about yourself so we can make your experience better</p>
      <form class="auth-email-form" id="onboarding-form">
        <input type="text" id="onboard-first" placeholder="first name" required/>
        <input type="text" id="onboard-last" placeholder="last name (optional)"/>
        <div class="onboard-dob-row">
          <label class="onboard-label">date of birth (optional)</label>
          <input type="date" id="onboard-dob"/>
        </div>
        <button type="submit" class="auth-submit-btn">let's go! ✨</button>
      </form>
      <a href="#" class="auth-toggle" id="onboard-skip">skip for now</a>
    </div>
  `;
  document.body.appendChild(overlay);

  const form = overlay.querySelector('#onboarding-form');
  const skipBtn = overlay.querySelector('#onboard-skip');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('onboard-first').value.trim();
    const lastName = document.getElementById('onboard-last').value.trim();
    const dob = document.getElementById('onboard-dob').value;

    // Save to Supabase user metadata
    const { getClient } = await import('../lib/supabase.js');
    const client = getClient();
    if (client && firstName) {
      await client.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          dob: dob || null,
        }
      });
      // Update nav immediately
      const profileName = document.getElementById('profile-name');
      if (profileName) profileName.textContent = `hello, ${firstName.toLowerCase()}! 👋`;
    }

    overlay.remove();
  });

  skipBtn.addEventListener('click', (e) => {
    e.preventDefault();
    overlay.remove();
  });
}

export function isLoggedIn() {
  return !!currentUser;
}
