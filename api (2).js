/* ============================================================
   Velora API connection layer
   ------------------------------------------------------------
   The real bridge between the frontend and the FastAPI backend.
   Until this file, the frontend was a standalone localStorage demo
   that called the Anthropic API directly; the backend was fully
   built but never contacted. This module is the single point every
   real, authenticated backend call routes through.

   Design goals:
   - One configurable base URL, so pointing at local dev vs the
     deployed Render backend is a one-line change, never scattered.
   - The JWT access token is stored and attached automatically, so
     no individual feature has to remember to send it.
   - Errors are normalized into one predictable shape, so callers
     handle failure the same way everywhere instead of each
     reinventing it.
   - Nothing here calls the Anthropic API directly. Moving AI calls
     server-side (so the API key is never exposed to the browser) is
     exactly what routing through this layer enables.
   ============================================================ */

// The deployed backend URL. Overridable at runtime via a
// window.VELORA_API_BASE global (set before this script loads) so the
// same build works against local dev and production without editing
// this file. Trailing slash is stripped so path-joining is
// unambiguous.
const VELORA_API_BASE = (function(){
  const configured = (typeof window !== 'undefined' && window.VELORA_API_BASE) || 'https://velora-backend.onrender.com';
  return String(configured).replace(/\/+$/, '');
})();

const VELORA_TOKEN_KEY = 'velora_access_token';

function getAuthToken(){
  try{ return localStorage.getItem(VELORA_TOKEN_KEY); }catch(e){ return null; }
}
function setAuthToken(token){
  try{ localStorage.setItem(VELORA_TOKEN_KEY, token); }catch(e){ /* storage unavailable - token stays in memory for this page only */ }
}
function clearAuthToken(){
  try{ localStorage.removeItem(VELORA_TOKEN_KEY); }catch(e){ /* nothing to clear */ }
}

/* The core request function. Every real backend call goes through
   here. Returns { ok, status, data, error }:
   - ok:    true only on a genuine 2xx with a parseable body
   - status: the real HTTP status (0 if the request never completed,
             e.g. the backend is unreachable)
   - data:  the parsed JSON body on success, else null
   - error: a human-readable message on failure, else null
   It never throws for an ordinary failure - callers check .ok. This
   is deliberate: a network blip or a 404 is a normal, expected
   outcome to handle, not an exception to crash on. */
async function apiFetch(path, options){
  options = options || {};
  const url = VELORA_API_BASE + (path.startsWith('/') ? path : '/' + path);
  const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});

  // Attach the auth token automatically unless the caller opts out
  // (login/signup themselves have no token yet).
  if(!options.noAuth){
    const token = getAuthToken();
    if(token) headers['Authorization'] = 'Bearer ' + token;
  }

  let resp;
  try{
    resp = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body != null ? JSON.stringify(options.body) : undefined,
    });
  }catch(networkErr){
    // The request never reached the server (offline, CORS, backend
    // down). A real, distinct failure mode from an HTTP error - the
    // caller may want to fall back to cached/local data here.
    return { ok: false, status: 0, data: null, error: 'Could not reach the server - check your connection and try again.' };
  }

  // A 401 on an AUTHENTICATED request means the token is missing,
  // expired, or invalid - clear it so the app stops sending a dead
  // token. But a 401 on a noAuth request (login/signup) is not an
  // expired session at all - it's the backend rejecting credentials,
  // so let it fall through to surface that real message below.
  if(resp.status === 401 && !options.noAuth){
    clearAuthToken();
    return { ok: false, status: 401, data: null, error: 'Your session has expired - please sign in again.' };
  }

  let body = null;
  const text = await resp.text();
  if(text){
    try{ body = JSON.parse(text); }
    catch(e){ body = null; }  // a non-JSON body (shouldn't happen from this API, but never crash on it)
  }

  if(!resp.ok){
    // FastAPI returns errors as { detail: "..." }; surface that real
    // message when present, else a status-based fallback.
    const detail = (body && (body.detail || body.error)) || `Request failed (${resp.status}).`;
    return { ok: false, status: resp.status, data: null, error: typeof detail === 'string' ? detail : JSON.stringify(detail) };
  }

  return { ok: true, status: resp.status, data: body, error: null };
}

/* -------- Auth: the first genuinely-connected flow -------- */

async function apiSignup(email, password, role){
  const result = await apiFetch('/auth/signup', {
    method: 'POST', noAuth: true,
    body: { email, password, role: role || 'candidate' },
  });
  if(result.ok && result.data && result.data.access_token){
    setAuthToken(result.data.access_token);
  }
  return result;
}

async function apiLogin(email, password){
  const result = await apiFetch('/auth/login', {
    method: 'POST', noAuth: true,
    body: { email, password },
  });
  if(result.ok && result.data && result.data.access_token){
    setAuthToken(result.data.access_token);
  }
  return result;
}

async function apiLogout(){
  clearAuthToken();
}

/* Validates the current token against the backend and returns the
   real user (or null if the token is missing/expired). Used on load
   to confirm a stored session is still genuinely valid, rather than
   trusting a stale localStorage blob. */
async function apiGetCurrentUser(){
  if(!getAuthToken()) return null;
  const result = await apiFetch('/auth/me');
  return result.ok ? result.data : null;
}

/* -------- Profile: the data nearly every other feature reads -------- */

// The frontend and backend genuinely use different field names for
// the same profile fields (historical, on both sides). Rather than
// rename across dozens of files on either side, the two mappings live
// here, in one place, so each side keeps its own natural naming.
function _profileToBackend(userId, p){
  const body = {
    user_id: userId,
    northstar: p.northstar || '',
    final_idea: p.finalidea || null,
    timeframe: p.timeframe || '',
    stage: p.stage || '',
    priorities: p.priorities || [],
    skills: p.skills || '',
    dealbreakers: p.dealbreakers || null,
    location_pref: p.loc || null,
    target_types: p.types || [],
    is_athlete: !!p.isAthlete,
  };
  if(p.isAthlete){
    body.sport = p.sport || null;
    body.level = p.level || null;
    body.career_direction = p.careerDirection || null;
    body.achievements = p.achievements || null;
  }
  return body;
}
function _profileFromBackend(d){
  if(!d) return null;
  const p = {
    northstar: d.northstar || '',
    finalidea: d.final_idea || '',
    timeframe: d.timeframe || '',
    stage: d.stage || '',
    priorities: d.priorities || [],
    skills: d.skills || '',
    dealbreakers: d.dealbreakers || '',
    loc: d.location_pref || '',
    types: d.target_types || [],
    isAthlete: !!d.is_athlete,
  };
  if(d.is_athlete){
    p.sport = d.sport || '';
    p.level = d.level || '';
    p.careerDirection = d.career_direction || '';
    p.achievements = d.achievements || '';
  }
  return p;
}

// Saves the profile to the real backend. Returns the same normalized
// { ok, status, data, error } shape as everything else, plus the
// backend's real response (which includes athletic_signals_detected)
// on success.
async function apiSaveProfile(userId, profile){
  return await apiFetch('/profile', { method: 'POST', body: _profileToBackend(userId, profile) });
}

// Loads the current profile from the backend and maps it back to the
// frontend's field names. Returns null if there's no profile yet or
// the request failed - the caller decides how to handle that.
async function apiLoadProfile(userId){
  const result = await apiFetch('/profile/' + userId);
  if(!result.ok) return null;
  return _profileFromBackend(result.data);
}

/* -------- Matches: the real scored listings the dashboard shows -------- */

// The backend scores listings with snake_case keys; the dashboard's
// rendering was written against camelCase. This maps one match dict so
// the existing render code works unchanged against real backend data.
function _matchFromBackend(m){
  return {
    id: m.id,
    title: m.title,
    org: m.org,
    type: m.type,
    loc: m.location,           // backend 'location' -> frontend 'loc'
    deadline: m.deadline,
    tags: m.tags || [],
    pct: m.score_pct,          // the score
    signalStrength: m.signal_strength,
    dataQuality: m.data_quality,
    matchedGoal: m.goal_match_tags || [],
    matchedSkill: m.skill_match_tags || [],
    personalized: m.personalized,
    rationale: m.rationale,
    factors: m.factors,
    seniorityMismatch: m.seniority_mismatch,
    locationMismatch: m.location_mismatch,
    stalenessNote: m.staleness_note,
    salaryMin: m.salary_min,
    salaryMax: m.salary_max,
    salaryIsPredicted: m.salary_is_predicted,
  };
}

// Fetches the real, backend-scored matches for a user. Returns
// { ok, matches, nearMisses, note, error } - matches/nearMisses are
// already mapped to the frontend's field shape. On failure, matches
// is an empty array so a caller can render an empty state rather than
// crash.
async function apiGetMatches(userId){
  const result = await apiFetch('/listings/matches/' + userId);
  if(!result.ok){
    return { ok: false, matches: [], nearMisses: [], note: null, error: result.error };
  }
  const d = result.data || {};
  return {
    ok: true,
    matches: (d.matches || []).map(_matchFromBackend),
    nearMisses: (d.near_misses || []).map(_matchFromBackend),
    note: d.low_match_note || null,
    error: null,
  };
}

// Triggers a real backend scan (pulls fresh listings, re-scores), then
// returns the same shape as apiGetMatches. This is what a "Run scan"
// action genuinely does server-side.
async function apiTriggerScan(userId){
  const result = await apiFetch('/listings/scan/' + userId, { method: 'POST' });
  if(!result.ok){
    return { ok: false, matches: [], nearMisses: [], note: null, error: result.error };
  }
  // The scan endpoint re-runs scoring; fetch the fresh matches after.
  return await apiGetMatches(userId);
}

/* -------- Saved listings (starring) -------- */
async function apiSaveListing(userId, listingId){
  return await apiFetch('/saved', { method: 'POST', body: { user_id: userId, listing_id: String(listingId) } });
}
async function apiUnsaveListing(userId, listingId){
  return await apiFetch('/saved/' + userId + '/' + listingId, { method: 'DELETE' });
}
// Returns a Set of saved listing ids (as strings), or an empty Set on
// failure - the caller can render an empty state rather than crash.
async function apiGetSavedIds(userId){
  const result = await apiFetch('/saved/' + userId);
  if(!result.ok || !Array.isArray(result.data)) return new Set();
  return new Set(result.data.map(String));
}

/* -------- Dismissed listings (not interested) -------- */
async function apiDismissListing(userId, listingId){
  return await apiFetch('/dismissed', { method: 'POST', body: { user_id: userId, listing_id: String(listingId) } });
}
async function apiUndismissListing(userId, listingId){
  return await apiFetch('/dismissed/' + userId + '/' + listingId, { method: 'DELETE' });
}
async function apiGetDismissedIds(userId){
  const result = await apiFetch('/dismissed/' + userId);
  if(!result.ok || !Array.isArray(result.data)) return new Set();
  return new Set(result.data.map(String));
}

/* -------- Applications: create one for a match -------- */
// The backend's /applications/accept genuinely drafts + records an
// application for a listing (the same real action the dashboard's
// "apply" does). Returns the normalized shape plus the backend body.
async function apiCreateApplication(userId, listingId){
  return await apiFetch('/applications/accept', { method: 'POST', body: { user_id: userId, listing_id: String(listingId) } });
}

/* -------- Roadmap -------- */
// Loads the current roadmap; returns { summary, milestones } mapped to
// the frontend's shape, or null if there's genuinely no roadmap yet.
async function apiGetRoadmap(userId){
  const result = await apiFetch('/roadmap/' + userId);
  if(!result.ok || !result.data || !Array.isArray(result.data.milestones) || result.data.milestones.length === 0){
    return null;
  }
  return { summary: result.data.summary || '', milestones: result.data.milestones };
}
// Asks the backend to generate (or regenerate) the roadmap from the
// person's real profile - the generation happens server-side.
async function apiGenerateRoadmap(userId){
  const result = await apiFetch('/roadmap/' + userId, { method: 'POST' });
  if(!result.ok) return null;
  return { summary: (result.data && result.data.summary) || '', milestones: (result.data && result.data.milestones) || [] };
}
