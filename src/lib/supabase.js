/**
 * supabase.js
 *
 * Supabase client init + auth helpers.
 * Uses the CDN-loaded supabase global (no npm needed).
 */

const SUPABASE_URL = window.GIFTLOCAL_CONFIG?.supabaseUrl || '';
const SUPABASE_ANON_KEY = window.GIFTLOCAL_CONFIG?.supabaseKey || '';

let _client = null;

export function getClient() {
  if (!_client && SUPABASE_URL && SUPABASE_ANON_KEY) {
    const sb = window.supabase;
    const createFn = sb?.createClient || sb?.default?.createClient;
    if (!createFn) { console.warn('Supabase SDK not loaded yet'); return null; }
    _client = createFn(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _client;
}

// ─── Auth ────────────────────────────────────────────────────────

export async function signInWithGoogle() {
  const client = getClient();
  if (!client) return { error: 'Supabase not configured' };
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  });
  return { data, error };
}

export async function signInWithEmail(email, password) {
  const client = getClient();
  if (!client) return { error: 'Supabase not configured' };
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signUpWithEmail(email, password) {
  const client = getClient();
  if (!client) return { error: 'Supabase not configured' };
  const { data, error } = await client.auth.signUp({ email, password });
  return { data, error };
}

export async function signOut() {
  const client = getClient();
  if (!client) return;
  await client.auth.signOut();
}

export async function getUser() {
  const client = getClient();
  if (!client) return null;
  const { data: { user } } = await client.auth.getUser();
  return user;
}

export function onAuthChange(callback) {
  const client = getClient();
  if (!client) return;
  client.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
}

// ─── Database: Searches ──────────────────────────────────────────

export async function saveSearch(formData, results) {
  const client = getClient();
  const user = await getUser();
  if (!client || !user) return null;

  const { data, error } = await client
    .from('searches')
    .insert({ user_id: user.id, form_data: formData, results })
    .select()
    .single();

  if (error) { console.error('Save search error:', error); return null; }
  return data;
}

export async function getSearches() {
  const client = getClient();
  const user = await getUser();
  if (!client || !user) return [];

  const { data, error } = await client
    .from('searches')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) { console.error('Get searches error:', error); return []; }
  return data || [];
}

export async function shareSearch(searchId) {
  const client = getClient();
  if (!client) return null;

  const shareId = crypto.randomUUID().slice(0, 8);
  const { error } = await client
    .from('searches')
    .update({ share_id: shareId })
    .eq('id', searchId);

  if (error) { console.error('Share error:', error); return null; }
  return shareId;
}

export async function getSharedSearch(shareId) {
  const client = getClient();
  if (!client) return null;

  const { data, error } = await client
    .from('searches')
    .select('*')
    .eq('share_id', shareId)
    .single();

  if (error) return null;
  return data;
}

// ─── Database: Wishlist ──────────────────────────────────────────

export async function addToWishlist(searchId, gift) {
  const client = getClient();
  const user = await getUser();
  if (!client || !user) return null;

  const { data, error } = await client
    .from('wishlist')
    .insert({
      user_id: user.id,
      search_id: searchId,
      gift_name: gift.name,
      gift_price: gift.price,
      gift_type: gift.type,
      gift_where: gift.where,
    })
    .select()
    .single();

  if (error) { console.error('Wishlist add error:', error); return null; }
  return data;
}

export async function removeFromWishlist(wishlistId) {
  const client = getClient();
  if (!client) return;

  await client.from('wishlist').delete().eq('id', wishlistId);
}

export async function getWishlist() {
  const client = getClient();
  const user = await getUser();
  if (!client || !user) return [];

  const { data, error } = await client
    .from('wishlist')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) { console.error('Get wishlist error:', error); return []; }
  return data || [];
}

// ─── Search limits ───────────────────────────────────────────────

const GUEST_LIMIT = 3;
const USER_LIMIT = 10;

export function getGuestSearchCount() {
  const today = new Date().toDateString();
  const stored = JSON.parse(localStorage.getItem('giftlocal_searches') || '{}');
  if (stored.date !== today) return 0;
  return stored.count || 0;
}

export function incrementGuestSearch() {
  const today = new Date().toDateString();
  const stored = JSON.parse(localStorage.getItem('giftlocal_searches') || '{}');
  const count = stored.date === today ? (stored.count || 0) + 1 : 1;
  localStorage.setItem('giftlocal_searches', JSON.stringify({ date: today, count }));
  return count;
}

export function canSearch(isLoggedIn) {
  if (isLoggedIn) {
    // For logged-in users, we count from Supabase searches today
    // But for simplicity, also use localStorage to avoid extra DB call
    const count = getGuestSearchCount();
    return count < USER_LIMIT;
  }
  return getGuestSearchCount() < GUEST_LIMIT;
}

export function getSearchLimit(isLoggedIn) {
  return isLoggedIn ? USER_LIMIT : GUEST_LIMIT;
}

export function getRemainingSearches(isLoggedIn) {
  const limit = getSearchLimit(isLoggedIn);
  const used = getGuestSearchCount();
  return Math.max(0, limit - used);
}
