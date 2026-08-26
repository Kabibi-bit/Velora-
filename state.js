/* ============ VELORA SHARED CORE ============ */

/* ---- Logo mark: guiding star, navy + gold ---- */
function veloraMark(size){
  size = size || 32;
  return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="veloraGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#F7C878"/>
        <stop offset="100%" stop-color="#D98A2B"/>
      </linearGradient>
      <radialGradient id="veloraBg" cx="35%" cy="25%" r="80%">
        <stop offset="0%" stop-color="#1E2150"/>
        <stop offset="100%" stop-color="#0B0C1F"/>
      </radialGradient>
    </defs>
    <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#veloraBg)" stroke="#303463" stroke-width="1"/>
    <path d="M20 8 L22.6 17.4 L20 20 L17.4 17.4 Z" fill="url(#veloraGold)"/>
    <path d="M20 32 L17.4 22.6 L20 20 L22.6 22.6 Z" fill="url(#veloraGold)" opacity="0.5"/>
    <path d="M8 20 L17.4 17.4 L20 20 L17.4 22.6 Z" fill="url(#veloraGold)" opacity="0.5"/>
    <path d="M32 20 L22.6 22.6 L20 20 L22.6 17.4 Z" fill="url(#veloraGold)" opacity="0.5"/>
    <circle cx="20" cy="20" r="2.4" fill="url(#veloraGold)"/>
  </svg>`;
}
function metisMark(size, fg){
  size = size || 26; fg = fg || '#241704';
  return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6 L22.5 18 L20 20.5 L17.5 18 Z" fill="${fg}"/>
    <path d="M20 34 L17.5 22 L20 19.5 L22.5 22 Z" fill="${fg}" opacity="0.45"/>
    <path d="M6 20 L18 17.5 L20.5 20 L18 22.5 Z" fill="${fg}" opacity="0.45"/>
    <path d="M34 20 L22 22.5 L19.5 20 L22 17.5 Z" fill="${fg}" opacity="0.45"/>
  </svg>`;
}

/* ---- Starfield background (subtle, shared across pages) ---- */
function initStarfield(){
  const canvas = document.getElementById('starfield');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
    const count = Math.floor((canvas.width * canvas.height) / 12000);
    stars = Array.from({length: count}, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.1 + 0.2, baseAlpha: Math.random() * 0.5 + 0.12,
      phase: Math.random() * Math.PI * 2, speed: Math.random() * 0.015 + 0.005,
    }));
  }
  function draw(t){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(const s of stars){
      const twinkle = Math.sin(t * s.speed + s.phase) * 0.35 + 0.65;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.baseAlpha * twinkle})`; ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize(); requestAnimationFrame(draw);
}

/* ---- Nav ---- */
function renderNav(activePage){
  const role = localStorage.getItem('velora_role') || 'candidate';
  let links;
  if(role === 'business'){
    links = [
      {id: 'business', label: 'Candidate Search', href: 'business-dashboard.html'},
      {id: 'business-waypoint', label: 'Waypoint', href: 'business-waypoint.html'},
    ];
  } else if(role === 'tutor'){
    links = [
      {id: 'tutor', label: 'Tutor Dashboard', href: 'tutor-dashboard.html'},
      {id: 'tutor-waypoint', label: 'Waypoint', href: 'tutor-waypoint.html'},
    ];
  } else if(role === 'athlete'){
    links = [
      {id: 'athlete-survey', label: 'Survey', href: 'athlete-survey.html'},
      {id: 'athlete', label: 'Opportunities', href: 'athlete-dashboard.html'},
      {id: 'athlete-roadmap', label: 'Roadmap', href: 'athlete-roadmap.html'},
      {id: 'athlete-content', label: 'Content Coach', href: 'athlete-content.html'},
      {id: 'athlete-workshop', label: 'Workshop', href: 'athlete-workshop.html'},
      {id: 'athlete-waypoint', label: 'Waypoint', href: 'athlete-waypoint.html'},
    ];
  } else {
    links = [
      {id: 'survey', label: 'Survey', href: 'survey.html'},
      {id: 'dashboard', label: 'Job Search', href: 'dashboard.html'},
      {id: 'roadmap', label: 'Roadmap', href: 'roadmap.html'},
      {id: 'workshop', label: 'Workshop', href: 'workshop.html'},
      {id: 'auto', label: 'Auto', href: 'auto.html'},
      {id: 'explore', label: 'Explore', href: 'explore.html'},
      {id: 'waypoint', label: 'Waypoint', href: 'waypoint.html'},
      {id: 'inbox', label: 'Inbox', href: 'inbox.html'},
    ];
  }
  const linksHtml = links.map(l => `<a class="nav-link ${l.id===activePage?'active':''}" href="${l.href}">${l.label}</a>`).join('');
  const logoHrefMap = { candidate: 'overview.html', business: 'business-overview.html', tutor: 'tutor-overview.html' };
  const logoHref = logoHrefMap[role] || 'index.html';
  const watchActive = localStorage.getItem('velora_watch_active') === 'true';
  const session = getSession();
  const root = document.getElementById('nav-root');
  if(!root) return;
  root.innerHTML = `
    <nav class="nav">
      <div class="wrap nav-inner">
        <a class="logo" href="${logoHref}">${veloraMark(32)}<span class="logo-word">VELORA</span></a>
        <div class="nav-links">${linksHtml}</div>
        <div class="nav-status"><span class="dot ${watchActive?'live':''}"></span>Watch ${watchActive ? 'active' : 'idle'}</div>
        ${session
          ? `<div class="nav-account"><span class="nav-account-email">${session.email}</span><a class="nav-link" href="#" id="navLogoutLink">Log out</a></div>`
          : ''}
      </div>
    </nav>`;
  const logoutLink = document.getElementById('navLogoutLink');
  if(logoutLink){
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      clearSession();
      window.location.href = 'site-home.html';
    });
  }
}

/* ---- Session (login). Demo mode: this page's own login/signup form
   only creates a LOCAL session (email + role saved to localStorage) -
   there is no backend attached from this standalone frontend, so no
   real password is verified here. The real backend (app/routes/auth.py)
   has genuine bcrypt-hashed passwords and JWT tokens - this local
   session is a stand-in for what a connected frontend would get back
   from POST /auth/login, not a real security boundary on its own. ---- */
function getSession(){ try{ return JSON.parse(localStorage.getItem('velora_session')); }catch(e){ return null; } }
function saveSession(session){ localStorage.setItem('velora_session', JSON.stringify(session)); }
function clearSession(){ localStorage.removeItem('velora_session'); }

/* ---- localStorage helpers ---- */
function getProfile(){ try{ return JSON.parse(localStorage.getItem('velora_profile')); }catch(e){ return null; } }
function saveProfile(p){ localStorage.setItem('velora_profile', JSON.stringify(p)); }

function getAthleteProfile(){ try{ return JSON.parse(localStorage.getItem('velora_athlete_profile')); }catch(e){ return null; } }
function saveAthleteProfile(p){ localStorage.setItem('velora_athlete_profile', JSON.stringify(p)); }
function getMatches(){ try{ return JSON.parse(localStorage.getItem('velora_matches')) || []; }catch(e){ return []; } }
function saveMatches(m){ localStorage.setItem('velora_matches', JSON.stringify(m)); }
function getCycleCount(){ return parseInt(localStorage.getItem('velora_cycle_count') || '0'); }
function saveCycleCount(n){ localStorage.setItem('velora_cycle_count', String(n)); }
function getTrajectory(){ try{ return JSON.parse(localStorage.getItem('velora_trajectory')) || []; }catch(e){ return []; } }
function saveTrajectory(t){ localStorage.setItem('velora_trajectory', JSON.stringify(t)); }
function getSavedIds(){ try{ return new Set(JSON.parse(localStorage.getItem('velora_saved_ids')) || []); }catch(e){ return new Set(); } }
function saveSavedIds(s){ localStorage.setItem('velora_saved_ids', JSON.stringify([...s])); }
function getChatHistory(){ try{ return JSON.parse(localStorage.getItem('velora_chat_history')) || []; }catch(e){ return []; } }
function saveChatHistory(h){ localStorage.setItem('velora_chat_history', JSON.stringify(h)); }
function getNotifications(){ try{ return JSON.parse(localStorage.getItem('velora_notifications')) || []; }catch(e){ return []; } }
function addNotification(note){
  const list = getNotifications();
  list.unshift({ ...note, id: Date.now() + Math.random(), ts: new Date().toISOString() });
  localStorage.setItem('velora_notifications', JSON.stringify(list.slice(0, 50)));
}

/* ---- Applications / Workshop / Auto Apply ---- */
const UNDO_WINDOW_MINUTES = 30;
const ROADMAP_ALIGNMENT_BONUS = 8;

function getAutoApplySettings(){
  try{
    const raw = JSON.parse(localStorage.getItem('velora_auto_apply_settings'));
    if(raw && typeof raw.enabled === 'boolean' && typeof raw.threshold === 'number') return raw;
  }catch(e){}
  return { enabled: false, threshold: 80 };
}
function saveAutoApplySettings(settings){ localStorage.setItem('velora_auto_apply_settings', JSON.stringify(settings)); }

/* ---- Business: Auto-hire settings + Outreach Inbox. Mirrors the
   candidate Auto/Workshop pattern exactly, but for a business
   reaching out to candidates. Since candidates who are open_to_offers
   are already Velora users (not an external company with a guessable
   email), outreach here is an in-app introduction message, not a
   guessed external email address - genuinely more honest than trying
   to invent a candidate's real contact info. ---- */
function getAutoHireSettings(){
  try{
    const raw = JSON.parse(localStorage.getItem('velora_auto_hire_settings'));
    if(raw && typeof raw.enabled === 'boolean' && typeof raw.threshold === 'number') return raw;
  }catch(e){}
  return { enabled: false, threshold: 75 };
}
function saveAutoHireSettings(settings){ localStorage.setItem('velora_auto_hire_settings', JSON.stringify(settings)); }

function getBusinessOutreach(){ try{ return JSON.parse(localStorage.getItem('velora_business_outreach')) || []; }catch(e){ return []; } }
function saveBusinessOutreach(list){ localStorage.setItem('velora_business_outreach', JSON.stringify(list)); }
function getBusinessOutreachForCandidate(candidateId){ return getBusinessOutreach().find(o => o.candidate_id === candidateId); }

async function draftBusinessIntroduction(candidate, need, autoGenerated){
  autoGenerated = autoGenerated || false;
  const existing = getBusinessOutreachForCandidate(candidate.id);
  if(existing) return existing;

  const prompt = `Write a short (80-120 word), specific introduction message from a recruiter to a candidate, inviting them to talk about a role.\nRole: "${need.roleTitle}". Required skills: "${need.requiredSkills}".\nCandidate's stated goal: "${candidate.northstar}". Candidate's skills: "${candidate.skills}".\nReference something specific about the candidate's actual background, not generic flattery. No placeholder brackets. Return ONLY the message body, no subject line, no commentary.`;
  let body = null;
  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 300, messages: [{role:"user", content: prompt}] })
    });
    const data = await response.json();
    body = (data.content || []).map(b => b.type==='text'?b.text:'').filter(Boolean).join('\n') || null;
  } catch(err){ console.error('Introduction draft failed:', err); return null; }
  if(!body) return null;

  const draft = {
    id: 'bizout_' + Date.now() + '_' + Math.random().toString(36).slice(2,8),
    candidate_id: candidate.id,
    candidate_label: candidate.northstar.split(' ').slice(0,6).join(' ') + '...',
    role_title: need.roleTitle,
    body,
    status: 'drafted',
    auto_generated: autoGenerated,
    created_at: new Date().toISOString(),
  };
  const drafts = getBusinessOutreach();
  drafts.unshift(draft);
  saveBusinessOutreach(drafts);
  return draft;
}

function updateBusinessOutreach(id, field, value){
  const drafts = getBusinessOutreach();
  const draft = drafts.find(o => o.id === id);
  if(!draft || draft.status !== 'drafted') return;
  draft[field] = value;
  saveBusinessOutreach(drafts);
}
function discardBusinessOutreach(id){
  const drafts = getBusinessOutreach();
  const draft = drafts.find(o => o.id === id);
  if(draft) draft.status = 'undone';
  saveBusinessOutreach(drafts);
}
function sendBusinessOutreach(id){
  // In-app introduction, not an external email send - candidates in
  // this demo are anonymized mock profiles, not real logged-in users
  // reachable through a real inbox, so this is honestly logged as a
  // demo action rather than claiming a real message was delivered.
  const drafts = getBusinessOutreach();
  const draft = drafts.find(o => o.id === id);
  if(!draft || draft.status !== 'drafted') return { status: 'error' };
  draft.status = 'sent';
  draft.sent_at = new Date().toISOString();
  saveBusinessOutreach(drafts);
  return { status: 'sent' };
}
function sendAllPendingBusinessOutreach(){
  const drafts = getBusinessOutreach();
  const pending = drafts.filter(o => o.status === 'drafted');
  pending.forEach(o => { o.status = 'sent'; o.sent_at = new Date().toISOString(); });
  saveBusinessOutreach(drafts);
  return pending;
}

async function explainCandidateFitDeep(candidate, need){
  const prompt = `A business is hiring for "${need.roleTitle}". Required skills: "${need.requiredSkills}". Must-haves: "${need.mustHaves || 'none stated'}".\n\nA candidate: goal "${candidate.northstar}", skills "${candidate.skills}", stage ${candidate.stage}, location ${candidate.location}.\n\nWrite a genuine, specific 3-4 sentence hiring-manager assessment of this candidate against this specific role - reference their actual stated goal and skills, not generic praise. Be honest about gaps, not just strengths.`;
  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 300, messages: [{role:"user", content: prompt}] })
    });
    const data = await response.json();
    return (data.content || []).map(b => b.type==='text'?b.text:'').filter(Boolean).join('\n') || null;
  } catch(err){ console.error('Candidate fit explanation failed:', err); return null; }
}

/* ---- Tutor: Auto-accept settings + Response Inbox. Session prep
   responses are also in-app, not an external email - students in
   this demo are anonymized mock requests, so responses are honestly
   logged as delivered in-demo rather than claiming a real send. ---- */
function getAutoAcceptSettings(){
  try{
    const raw = JSON.parse(localStorage.getItem('velora_auto_accept_settings'));
    if(raw && typeof raw.enabled === 'boolean' && typeof raw.threshold === 'number') return raw;
  }catch(e){}
  return { enabled: false, threshold: 75 };
}
function saveAutoAcceptSettings(settings){ localStorage.setItem('velora_auto_accept_settings', JSON.stringify(settings)); }

async function explainRequestFitDeep(request, tutorProfile){
  const prompt = `A tutor's stated expertise: "${tutorProfile.skills}". Bio: "${tutorProfile.bio || 'none stated'}".\n\nA student request: skill gap "${request.skill_gap}", their message: "${request.message}", urgency: ${request.urgency}.\n\nWrite a genuine, specific 3-4 sentence assessment of whether this tutor is a strong fit for this specific request - reference the tutor's actual stated expertise and the student's actual described need. Be honest if the fit is only partial.`;
  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 300, messages: [{role:"user", content: prompt}] })
    });
    const data = await response.json();
    return (data.content || []).map(b => b.type==='text'?b.text:'').filter(Boolean).join('\n') || null;
  } catch(err){ console.error('Request fit explanation failed:', err); return null; }
}

/* ---- Athlete: application drafting on star, Auto mode, deep-explain.
   Mirrors the candidate pattern exactly, but built against the
   athlete profile shape (sport/level/careerDirection/achievements)
   instead of northstar/skills. ---- */
function getAthleteApplications(){ try{ return JSON.parse(localStorage.getItem('velora_athlete_applications')) || []; }catch(e){ return []; } }
function saveAthleteApplications(list){ localStorage.setItem('velora_athlete_applications', JSON.stringify(list)); }
function getAthleteApplicationForListing(listingId){ return getAthleteApplications().find(a => a.listing_id === String(listingId)); }

function getAthleteAutoSettings(){
  try{
    const raw = JSON.parse(localStorage.getItem('velora_athlete_auto_settings'));
    if(raw && typeof raw.enabled === 'boolean' && typeof raw.threshold === 'number') return raw;
  }catch(e){}
  return { enabled: false, threshold: 75 };
}
function saveAthleteAutoSettings(settings){ localStorage.setItem('velora_athlete_auto_settings', JSON.stringify(settings)); }

async function draftAthleteApplication(listing, athleteProfile, autoGenerated){
  autoGenerated = autoGenerated || false;
  const existing = getAthleteApplicationForListing(listing.id);
  if(existing) return existing;

  const prompt = `Write a short, tailored application message (120-180 words) for this listing: "${listing.title}" at ${listing.org} (${listing.type === 'athletic' ? 'athletics' : listing.type}).\nCandidate's sport: "${athleteProfile.sport}". Level: ${athleteProfile.level}. Career direction: ${athleteProfile.careerDirection.replace('-',' ')}. Achievements: "${athleteProfile.achievements}".\nBe concrete and specific, reference their actual achievements, no generic filler, no placeholder brackets.`;
  let draftText = null;
  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 400, messages: [{role: "user", content: prompt}] })
    });
    const data = await response.json();
    draftText = (data.content || []).map(b => b.type === 'text' ? b.text : '').filter(Boolean).join('\n') || null;
  } catch(err){ console.error('Athlete application draft failed:', err); return null; }
  if(!draftText) return null;

  const settings = getAthleteAutoSettings();
  const status = listing.pct >= settings.threshold ? 'approved' : 'pending_review';
  const sendableAt = status === 'approved' ? new Date(Date.now() + UNDO_WINDOW_MINUTES * 60000).toISOString() : null;

  const application = {
    id: 'athapp_' + Date.now() + '_' + Math.random().toString(36).slice(2,8),
    listing_id: String(listing.id),
    listing_title: listing.title,
    listing_org: listing.org,
    match_score: listing.pct,
    confidence_pct: listing.pct,
    draft: draftText,
    status,
    sendable_at: sendableAt,
    sent_at: null,
    auto_generated: autoGenerated,
    created_at: new Date().toISOString(),
  };
  const apps = getAthleteApplications();
  apps.unshift(application);
  saveAthleteApplications(apps);

  addNotification({
    type: 'athlete_application',
    title: `${autoGenerated ? 'Auto-drafted' : 'Drafted'} application: ${listing.title}`,
    detail: `${status === 'approved' ? 'Auto-approved' : 'Needs your review'} - ${listing.pct}% match.`,
  });
  return application;
}

async function runAthleteAutoApply(matches, athleteProfile){
  const settings = getAthleteAutoSettings();
  if(!settings.enabled) return [];
  const results = [];
  for(const listing of matches){
    if(getAthleteApplicationForListing(listing.id)) continue;
    const app = await draftAthleteApplication(listing, athleteProfile, true);
    if(app) results.push(app);
  }
  return results;
}

async function explainAthleteMatchDeep(listing, athleteProfile){
  const prompt = `A student-athlete: sport "${athleteProfile.sport}", level ${athleteProfile.level}, career direction ${athleteProfile.careerDirection.replace('-',' ')}, achievements: "${athleteProfile.achievements}".\n\nA listing they're considering: "${listing.title}" at ${listing.org}, tags: ${listing.tags.join(', ')}.\n\nWrite a genuine, specific 3-4 sentence case for why this is or isn't a strong match for THIS athlete specifically - reference their actual sport, level, and achievements. Be honest about weak fit if it's weak, don't oversell.`;
  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 300, messages: [{role:"user", content: prompt}] })
    });
    const data = await response.json();
    return (data.content || []).map(b => b.type==='text'?b.text:'').filter(Boolean).join('\n') || null;
  } catch(err){ console.error('Athlete match explanation failed:', err); return null; }
}

/* ---- Athlete match scoring, shared across athlete-dashboard.html and
   athlete-roadmap.html (the roadmap page needs real current matches
   too, for its "supported by" tags on each milestone). ---- */
function athleteRationale(listing, matched, profile){
  if(matched.length === 0){
    return `Looser fit for ${profile.sport} at the ${profile.level} level - no strong overlap yet, but worth a look while broadening your search.`;
  }
  return `Matches on <b>${matched.slice(0,3).join(', ')}</b> - directly relevant to ${profile.sport} and your stated direction toward ${profile.careerDirection.replace('-', ' ')}.`;
}

function runAthleteMatchCycle(profile){
  const athletic = LISTINGS.filter(l => l.type === 'athletic');
  const requirementText = `${profile.sport} ${profile.level} ${profile.careerDirection} ${profile.achievements}`;
  const dealbreakers = (profile.dealbreakers || '').toLowerCase();
  return athletic
    .filter(l => !dealbreakers || !l.tags.some(t => dealbreakers.includes(t)))
    .map(l => {
      const { pct, matched } = scoreByOverlap(l.tags, requirementText);
      return { ...l, pct, matched, rationale: athleteRationale(l, matched, profile) };
    })
    .sort((a,b) => b.pct - a.pct);
}

/* ---- Athlete events: deadlines and trial opportunities (tryouts,
   camps, combines, application deadlines), optionally tied to a
   specific roadmap stage. ---- */
function getAthleteEvents(){ try{ return JSON.parse(localStorage.getItem('velora_athlete_events')) || []; }catch(e){ return []; } }
function saveAthleteEvents(list){ localStorage.setItem('velora_athlete_events', JSON.stringify(list)); }
function addAthleteEvent(event){
  const events = getAthleteEvents();
  events.push({ id: 'evt_' + Date.now() + '_' + Math.random().toString(36).slice(2,8), status: 'upcoming', ...event });
  events.sort((a,b) => (a.event_date || '9999').localeCompare(b.event_date || '9999'));
  saveAthleteEvents(events);
}
function updateAthleteEventStatus(eventId, status){
  const events = getAthleteEvents();
  const event = events.find(e => e.id === eventId);
  if(event) event.status = status;
  saveAthleteEvents(events);
}
function deleteAthleteEvent(eventId){
  saveAthleteEvents(getAthleteEvents().filter(e => e.id !== eventId));
}

/* ---- Coach outreach: real email + cold-call script, mirroring the
   candidate side's "never invent a specific named person" boundary. ---- */
async function draftCoachOutreach(athleteProfile, targetDescription){
  const directionLabel = {'play-college': 'playing at the college level', 'go-pro': 'going pro', 'coach': 'coaching', 'sports-management': 'a sports management career'}[athleteProfile.careerDirection] || athleteProfile.careerDirection;
  const prompt = `A student-athlete: sport "${athleteProfile.sport}", level ${athleteProfile.level}, career direction: ${directionLabel}. Achievements: "${athleteProfile.achievements}". They want to reach out about: "${targetDescription}".\n\nHelp them make direct contact. Never invent a specific real named person - describe the TYPE of contact to look for, not a fabricated name.\n\nReturn a JSON object with exactly these five keys:\n- who_to_contact: the specific type of person worth reaching out to\n- how_to_find: 1-2 concrete sentences on how to actually find that person\n- email_subject: a short, specific email subject line\n- email_body: a genuine, specific 100-140 word email referencing their actual sport, achievements, and goal - no generic filler, no placeholder brackets\n- cold_call_script: a real, specific phone call opening and structure (2-3 sentences of what to actually say when the person picks up, plus 1-2 follow-up talking points) - concrete and usable, not generic "be confident" advice\n\nReturn ONLY valid JSON, nothing else, no markdown fences, no commentary.`;
  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 700, messages: [{role:"user", content: prompt}] })
    });
    const data = await response.json();
    let text = (data.content || []).map(b => b.type==='text'?b.text:'').filter(Boolean).join('\n');
    text = text.trim().replace(/^```json/,'').replace(/^```/,'').replace(/```$/,'').trim();
    return JSON.parse(text);
  } catch(err){ console.error('Coach outreach draft failed:', err); return null; }
}

function getAthleteOutreachDrafts(){ try{ return JSON.parse(localStorage.getItem('velora_athlete_outreach')) || []; }catch(e){ return []; } }
function saveAthleteOutreachDrafts(list){ localStorage.setItem('velora_athlete_outreach', JSON.stringify(list)); }

/* ---- Video clip planner: a real, honestly-scoped tool. This is NOT
   video editing/merging/export - that would need either heavy
   client-side video encoding or real server infrastructure, neither
   of which exists here. What this genuinely does: lets you preview
   your OWN local video file entirely in-browser (no upload, no
   storage - the file never leaves your computer), mark real in/out
   timestamps for clips you want to use, tag each to a reel-structure
   segment, and export a real, usable edit plan (a shot list with
   exact timestamps) to hand to any actual video editor. ---- */
function getClipPlan(){ try{ return JSON.parse(localStorage.getItem('velora_athlete_clip_plan')) || []; }catch(e){ return []; } }
function saveClipPlan(clips){ localStorage.setItem('velora_athlete_clip_plan', JSON.stringify(clips)); }
function addClip(clip){
  const clips = getClipPlan();
  clips.push({ id: 'clip_' + Date.now() + '_' + Math.random().toString(36).slice(2,8), ...clip });
  saveClipPlan(clips);
}
function removeClip(clipId){
  saveClipPlan(getClipPlan().filter(c => c.id !== clipId));
}
function formatTimestamp(seconds){
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2,'0')}`;
}

/* ---- Quick clip plan from a text description - complementary to the
   manual timestamp-marking tool above, for before footage is
   organized/uploaded. Mirrors app/services/athletics.py's
   generate_clip_edit_plan() exactly. Still not real video editing -
   a real plan grounded in what the athlete actually describes having. ---- */
async function generateQuickClipPlan(athleteProfile, clipsDescription){
  const directionLabel = {'play-college': 'playing at the college level', 'go-pro': 'going pro', 'coach': 'coaching', 'sports-management': 'a sports management career'}[athleteProfile.careerDirection] || athleteProfile.careerDirection;
  const prompt = `A student-athlete: sport "${athleteProfile.sport}", level ${athleteProfile.level}, career direction: ${directionLabel}.\n\nThey described their available raw footage/clips as:\n"${clipsDescription}"\n\nGive them a real, specific edit plan for turning this into a strong highlight reel - based ONLY on the clips they actually described, not invented footage. If what they described is too thin to make a strong reel, say so honestly rather than pretending it's enough.\n\nReturn a JSON object with exactly these three keys:\n- edit_sequence: an array of objects, each with "clip" (which described clip/moment this refers to, by their own description) and "instruction" (specific guidance: where to trim it, how long to hold it, what to lead into next, and why it goes in this position)\n- captions: an array of 2-4 short on-screen text suggestions tied to specific clips\n- honest_assessment: 1-2 sentences on whether what they described is actually enough for a strong reel, and if not, what specific kind of footage they're missing\n\nReturn ONLY valid JSON, nothing else, no markdown fences, no commentary.`;
  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 900, messages: [{role:"user", content: prompt}] })
    });
    const data = await response.json();
    let text = (data.content || []).map(b => b.type==='text'?b.text:'').filter(Boolean).join('\n');
    text = text.trim().replace(/^```json/,'').replace(/^```/,'').replace(/```$/,'').trim();
    return JSON.parse(text);
  } catch(err){ console.error('Quick clip plan failed:', err); return null; }
}

function getApplications(){ try{ return JSON.parse(localStorage.getItem('velora_applications')) || []; }catch(e){ return []; } }
function saveApplications(apps){ localStorage.setItem('velora_applications', JSON.stringify(apps)); }
function getApplicationForListing(listingId){ return getApplications().find(a => a.listing_id === listingId); }

async function draftApplicationForMatch(listing, profile){
  const prompt = `Write a short, tailored cover-letter-style paragraph (120-180 words) for this listing: "${listing.title}" at ${listing.org}.\nCandidate's goal: "${profile.northstar}"\nCandidate's skills: "${profile.skills}"\nBe concrete and specific, no generic filler, no placeholder brackets.`;
  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 400, messages: [{role: "user", content: prompt}] })
    });
    const data = await response.json();
    const text = (data.content || []).map(b => b.type === 'text' ? b.text : '').filter(Boolean).join('\n');
    return text || null;
  } catch(err){
    console.error('Draft generation failed:', err);
    return null;
  }
}

function computeCompositeConfidence(matchPct, roadmapAligned){
  return Math.min(100, Math.round(matchPct + (roadmapAligned ? ROADMAP_ALIGNMENT_BONUS : 0)));
}

async function createApplicationForMatch(listing, profile, autoGenerated){
  autoGenerated = autoGenerated || false;
  const existing = getApplicationForListing(String(listing.id));
  if(existing) return existing;

  const draftText = await draftApplicationForMatch(listing, profile);
  if(!draftText) return null;

  const roadmapData = getRoadmap();
  const roadmapAlign = roadmapData ? computeRoadmapAlignment(listing, roadmapData.milestones) : null;
  const composite = computeCompositeConfidence(listing.pct, roadmapAlign !== null);

  const settings = getAutoApplySettings();
  const threshold = settings.threshold || 80;
  const status = composite >= threshold ? 'approved' : 'pending_review';
  const sendableAt = status === 'approved' ? new Date(Date.now() + UNDO_WINDOW_MINUTES * 60000).toISOString() : null;

  const application = {
    id: 'app_' + Date.now() + '_' + Math.random().toString(36).slice(2,8),
    listing_id: String(listing.id),
    listing_title: listing.title,
    listing_org: listing.org,
    listing_type: listing.type,
    match_score: listing.pct,
    roadmap_aligned: roadmapAlign !== null,
    confidence_pct: composite,
    draft: draftText,
    status,
    sendable_at: sendableAt,
    sent_at: null,
    auto_generated: autoGenerated,
    created_at: new Date().toISOString(),
  };

  const apps = getApplications();
  apps.unshift(application);
  saveApplications(apps);

  addNotification({
    type: 'application',
    title: `Draft ready: ${listing.title}`,
    detail: `${status === 'approved' ? 'Auto-approved' : 'Needs your review'} - ${composite}% confidence${roadmapAlign ? ' (roadmap-aligned)' : ''}. Check the Workshop.`,
  });

  return application;
}

async function runAutoApplyForMatches(matches, profile){
  const settings = getAutoApplySettings();
  if(!settings.enabled) return [];
  const results = [];
  for(const listing of matches){
    const existing = getApplicationForListing(String(listing.id));
    if(existing) continue;
    const app = await createApplicationForMatch(listing, profile, true);
    if(app && app.status === 'approved') results.push(app);
  }
  return results;
}
/* ---- Deep, on-demand match explanation (real Claude call, cached per listing) ---- */
function getDeepExplanations(){ try{ return JSON.parse(localStorage.getItem('velora_deep_explanations')) || {}; }catch(e){ return {}; } }
function saveDeepExplanation(listingId, text){
  const all = getDeepExplanations();
  all[listingId] = text;
  localStorage.setItem('velora_deep_explanations', JSON.stringify(all));
}
function getCachedDeepExplanation(listingId){ return getDeepExplanations()[listingId] || null; }

async function fetchDeepExplanation(listing, profile, roadmap){
  const cached = getCachedDeepExplanation(String(listing.id));
  if(cached) return cached;

  const roadmapLine = roadmap && roadmap.milestones
    ? `Their roadmap:\n${roadmap.milestones.map(m => `${m.stage}. ${m.title}`).join('\n')}\n\n`
    : '';
  const prompt = `A candidate's goal: "${profile.northstar}". What "made it" looks like: "${profile.finalidea || ''}". Their skills: "${profile.skills}". What matters most to them: ${(profile.priorities||[]).join(', ')}. Location preference: "${profile.loc || ''}".\n\n${roadmapLine}A listing they're considering: "${listing.title}" at ${listing.org} (${listing.type}), location ${listing.loc || 'unspecified'}, tags: ${listing.tags.join(', ')}.\n\nWrite a genuine, specific 3-4 sentence case for why this is or isn't a strong match for THIS candidate specifically - reference their actual goal, skills, priorities, and roadmap by name where relevant. Be honest about weak fit if it's weak, don't oversell. No generic filler - every sentence should reference a specific fact about the candidate or the listing.`;

  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 300, messages: [{role: "user", content: prompt}] })
    });
    const data = await response.json();
    const text = (data.content || []).map(b => b.type === 'text' ? b.text : '').filter(Boolean).join('\n');
    if(text) saveDeepExplanation(String(listing.id), text);
    return text || null;
  } catch(err){
    console.error('Deep explanation failed:', err);
    return null;
  }
}

/* ---- Connection strategy: the referral/networking feature. This
   deliberately does NOT invent a real named person at the company -
   there's no data source here with real employee information, and
   making up a name would be presenting fabricated data as real. What
   it does instead is genuinely useful: identifies the TYPE of person
   worth reaching out to, concrete guidance on how to actually find
   them, and a tailored outreach message ready to send once you do. ---- */
function getConnectionStrategies(){ try{ return JSON.parse(localStorage.getItem('velora_connection_strategies')) || {}; }catch(e){ return {}; } }
function saveConnectionStrategy(listingId, strategy){
  const all = getConnectionStrategies();
  all[listingId] = strategy;
  localStorage.setItem('velora_connection_strategies', JSON.stringify(all));
}
function getCachedConnectionStrategy(listingId){ return getConnectionStrategies()[String(listingId)] || null; }

async function fetchConnectionStrategy(listing, profile){
  const cached = getCachedConnectionStrategy(listing.id);
  if(cached) return cached;

  const prompt = `A candidate is applying to "${listing.title}" at ${listing.org} (${listing.type}), tags: ${listing.tags.join(', ')}. Their background: skills "${profile.skills}", goal "${profile.northstar}".\n\nHelp them get a real human connection at this company before applying cold. Return a JSON object with exactly these three keys:\n- contact_type: the specific TYPE of person worth reaching out to for this role (e.g. "someone currently in a similar individual-contributor role on this team" or "the hiring manager, likely titled X") - a role description, never a real invented name\n- search_guidance: 1-2 concrete sentences on exactly how to actually find that person - specific search terms or approach, not "network more"\n- outreach_message: a genuine, specific 80-120 word message they could send once they find someone - reference the candidate's real skills/goal and the specific role, ask for a short conversation or referral, not generic flattery\n\nReturn ONLY valid JSON with exactly those three keys, nothing else, no markdown fences.`;

  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 500, messages: [{role: "user", content: prompt}] })
    });
    const data = await response.json();
    let text = (data.content || []).map(b => b.type === 'text' ? b.text : '').filter(Boolean).join('\n');
    text = text.trim().replace(/^```json/,'').replace(/^```/,'').replace(/```$/,'').trim();
    const parsed = JSON.parse(text);
    saveConnectionStrategy(listing.id, parsed);
    return parsed;
  } catch(err){
    console.error('Connection strategy generation failed:', err);
    return null;
  }
}

/* ---- Outreach drafting -> Workshop queue. "Find a contact" and Auto
   mode both funnel here: a draft (guessed address, subject, body) is
   created with status 'drafted' and shown in Workshop, where it can
   be edited and only sent via an explicit click - individually or via
   "Send all pending". Nothing in this pipeline sends automatically,
   including when triggered by Auto mode - Auto only creates drafts. ---- */
function guessCompanyDomain(orgName){
  let cleaned = orgName.replace(/\b(inc|llc|ltd|corp|corporation|co)\b\.?/gi, '');
  cleaned = cleaned.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase();
  const slug = cleaned.replace(/\s+/g, '');
  return slug ? `${slug}.com` : null;
}

async function guessContactEmail(listing){
  const domain = guessCompanyDomain(listing.org);
  if(!domain) return { candidates: [], domain_guessed: null };
  const prefixes = ['careers', 'jobs', 'hr', 'talent', 'recruiting'];
  return {
    domain_guessed: domain,
    candidates: prefixes.map(p => `${p}@${domain}`),
    verified: false,
  };
}

function getOutreachDrafts(){ try{ return JSON.parse(localStorage.getItem('velora_outreach_drafts')) || []; }catch(e){ return []; } }
function saveOutreachDrafts(list){ localStorage.setItem('velora_outreach_drafts', JSON.stringify(list)); }
function getOutreachDraftForListing(listingId){ return getOutreachDrafts().find(o => o.listing_id === String(listingId)); }

async function draftOutreachForWorkshop(listing, profile, autoGenerated){
  autoGenerated = autoGenerated || false;
  const existing = getOutreachDraftForListing(listing.id);
  if(existing) return existing;

  const strategy = await fetchConnectionStrategy(listing, profile);
  if(!strategy) return null;
  const guess = await guessContactEmail(listing);
  if(!guess.candidates.length) return null;

  const draft = {
    id: 'outreach_' + Date.now() + '_' + Math.random().toString(36).slice(2,8),
    listing_id: String(listing.id),
    listing_title: listing.title,
    listing_org: listing.org,
    to_address: guess.candidates[0],
    address_verified: false,
    subject: `Regarding ${listing.title}`,
    body: strategy.outreach_message,
    status: 'drafted',
    auto_generated: autoGenerated,
    created_at: new Date().toISOString(),
  };
  const drafts = getOutreachDrafts();
  drafts.unshift(draft);
  saveOutreachDrafts(drafts);

  addNotification({
    type: 'outreach_drafted',
    title: `${autoGenerated ? 'Auto-drafted' : 'Drafted'} outreach: ${listing.title}`,
    detail: `To ${draft.to_address}. Review and send from the Workshop whenever you're ready.`,
  });
  return draft;
}

async function runAutoOutreachForMatches(matches, profile){
  const settings = getAutoApplySettings();
  if(!settings.enabled) return [];
  const results = [];
  for(const listing of matches){
    const existing = getOutreachDraftForListing(listing.id);
    if(existing) continue;
    const draft = await draftOutreachForWorkshop(listing, profile, true);
    if(draft) results.push(draft);
  }
  return results;
}

function updateOutreachDraft(id, field, value){
  const drafts = getOutreachDrafts();
  const draft = drafts.find(o => o.id === id);
  if(!draft || draft.status !== 'drafted') return;
  draft[field] = value;
  if(field === 'to_address') draft.address_verified = false;
  saveOutreachDrafts(drafts);
}

function discardOutreachDraft(id){
  const drafts = getOutreachDrafts();
  const draft = drafts.find(o => o.id === id);
  if(draft) draft.status = 'undone';
  saveOutreachDrafts(drafts);
}

async function sendOutreachDraft(id){
  // Honest limitation: this standalone frontend demo has no backend
  // attached and no real mail-sending credentials available to a
  // browser. The real send happens via POST /outreach/{id}/send once
  // this frontend is connected to your deployed backend, which calls
  // Resend for real. Here, the click is genuine and required - this
  // just can't reach a real mail server from a static demo page.
  const drafts = getOutreachDrafts();
  const draft = drafts.find(o => o.id === id);
  if(!draft || draft.status !== 'drafted') return { status: 'error' };
  draft.status = 'sent';
  draft.sent_at = new Date().toISOString();
  saveOutreachDrafts(drafts);
  addNotification({ type: 'outreach_sent', title: `Outreach sent (demo mode): ${draft.listing_title}`, detail: `To ${draft.to_address}. Connect this frontend to your deployed backend to send for real via /outreach/{id}/send.` });
  return { status: 'sent' };
}

async function sendAllPendingOutreach(){
  const drafts = getOutreachDrafts();
  const pending = drafts.filter(o => o.status === 'drafted');
  pending.forEach(o => { o.status = 'sent'; o.sent_at = new Date().toISOString(); });
  saveOutreachDrafts(drafts);
  if(pending.length > 0){
    addNotification({ type: 'outreach_sent', title: `${pending.length} outreach email${pending.length===1?'':'s'} sent (demo mode)`, detail: 'Connect this frontend to your deployed backend to send for real.' });
  }
  return pending;
}

/* Bump this any time the roadmap generator's output shape changes -
   this is what forces a stale, older-format roadmap already sitting
   in someone's browser to regenerate automatically instead of being
   silently treated as "already generated" forever. This was the
   actual cause of roadmaps looking weak even after real improvements
   shipped: only a missing .milestones array was being caught before,
   not a merely-outdated one. */
const ROADMAP_VERSION = 3;

function getRoadmap(){
  try{
    const raw = JSON.parse(localStorage.getItem('velora_roadmap'));
    if(!raw) return null;
    // Old format (before the summary+milestones restructure) stored a
    // bare array. Treat that, anything missing .milestones, OR
    // anything from an older generator version as if there's no
    // roadmap yet - forces a fresh regeneration in the current,
    // deeper format instead of silently keeping stale content.
    if(Array.isArray(raw) || !raw.milestones || raw.version !== ROADMAP_VERSION) return null;
    return raw;
  }catch(e){ return null; }
}
function saveRoadmap(r){ localStorage.setItem('velora_roadmap', JSON.stringify(r)); }

function getAthleteRoadmap(){ try{ const raw = JSON.parse(localStorage.getItem('velora_athlete_roadmap')); return (raw && raw.milestones && raw.version === ROADMAP_VERSION) ? raw : null; }catch(e){ return null; } }
function saveAthleteRoadmap(r){ localStorage.setItem('velora_athlete_roadmap', JSON.stringify(r)); }

function getOutcomes(){ try{ return JSON.parse(localStorage.getItem('velora_outcomes')) || []; }catch(e){ return []; } }
function saveOutcomes(o){ localStorage.setItem('velora_outcomes', JSON.stringify(o)); }

/* ---- Real outcome logging + confidence calibration + rejection
   autopsy. This is the genuinely differentiated piece: instead of
   just showing a match score and hoping it means something, this
   checks whether it actually did, using the user's own real logged
   results - and offers a specific, grounded explanation when
   something falls through, instead of generic advice. ---- */
function logApplicationOutcome(applicationId, status){
  const apps = getApplications();
  const app = apps.find(a => a.id === applicationId);
  if(!app) return null;
  app.outcome_status = status;
  app.outcome_logged_at = new Date().toISOString();
  saveApplications(apps);

  const outcomes = getOutcomes();
  outcomes.unshift({
    status, month: new Date().toLocaleString('en-US', {month:'short'}),
    listing_id: app.listing_id, confidence_pct: app.confidence_pct,
  });
  saveOutcomes(outcomes);
  return app;
}

function computeCalibration(){
  const apps = getApplications().filter(a => a.outcome_status);
  const buckets = {
    '80-100%': { lo: 80, hi: 101, total: 0, positive: 0 },
    '60-79%': { lo: 60, hi: 80, total: 0, positive: 0 },
    'below 60%': { lo: 0, hi: 60, total: 0, positive: 0 },
  };
  const positiveStatuses = new Set(['interview', 'offer']);
  apps.forEach(app => {
    const confidence = app.confidence_pct || 0;
    for(const bucket of Object.values(buckets)){
      if(confidence >= bucket.lo && confidence < bucket.hi){
        bucket.total++;
        if(positiveStatuses.has(app.outcome_status)) bucket.positive++;
        break;
      }
    }
  });
  const result = {};
  Object.entries(buckets).forEach(([label, b]) => {
    result[label] = { total: b.total, positiveRate: b.total > 0 ? Math.round((b.positive / b.total) * 100) : null };
  });
  return { buckets: result, totalWithOutcomes: apps.length };
}

async function explainOutcomeDeep(application, listing, profile){
  const prompt = `A candidate applied to "${listing.title}" at ${listing.org}, tags: ${listing.tags.join(', ')}. The match confidence at the time was ${application.confidence_pct}%. The outcome was: ${application.outcome_status}.\n\nThe application they actually sent:\n"${application.draft}"\n\nCandidate's stated goal: "${profile.northstar}". Skills: "${profile.skills}".\n\nGive a specific, honest hypothesis for what likely contributed to this outcome - compare the actual draft against the actual listing's requirements, don't give generic advice like "keep trying" or "tailor your resume". If the confidence score itself seems to have been wrong (too high or too low for what happened), say so directly. 3-4 sentences, concrete and specific.`;
  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 250, messages: [{role:"user", content: prompt}] })
    });
    const data = await response.json();
    return (data.content || []).map(b => b.type==='text'?b.text:'').filter(Boolean).join('\n') || null;
  } catch(err){ console.error('Outcome explanation failed:', err); return null; }
}

/* ---- Waypoint: a private progress journal, not a social feed.
   This used to include mock peer posts, connection suggestions, and
   a feed ranked by relevance to other people. Cut deliberately: a
   feed and connections only have real value once there are enough
   real users for either to mean something, and a connection feature
   between real people carries a genuine moderation/safety workload
   that isn't worth taking on before there's anyone real to connect
   with. What's left is the part with real value on day one: logging
   real progress, tagged to what's real for each role, with both a
   per-entry reflection AND a genuine pattern reflection across
   several entries - a single one-off reflection doesn't tell you
   anything a journal keeper wouldn't already know; spotting a
   pattern across a week of entries actually does. ---- */
function getWaypointPosts(storageKey){
  try{ return JSON.parse(localStorage.getItem(storageKey)) || []; }
  catch(e){ return []; }
}
function saveWaypointPost(storageKey, post){
  const own = getWaypointPosts(storageKey);
  own.unshift(post);
  localStorage.setItem(storageKey, JSON.stringify(own));
}
function updateWaypointPost(storageKey, id, newBody){
  const own = getWaypointPosts(storageKey);
  const entry = own.find(p => p.id === id);
  if(entry){ entry.body = newBody; entry.edited_at = new Date().toISOString(); }
  localStorage.setItem(storageKey, JSON.stringify(own));
}
function deleteWaypointPost(storageKey, id){
  const own = getWaypointPosts(storageKey).filter(p => p.id !== id);
  localStorage.setItem(storageKey, JSON.stringify(own));
}

/* Backward-compat aliases for the original candidate-only names. */
function getWaypointPostsAll(){ return getWaypointPosts('velora_waypoint_own_posts'); }
function saveOwnWaypointPost(post){ saveWaypointPost('velora_waypoint_own_posts', post); }

async function reflectOnJournalEntry(profile, contextSummary, entryBody, tagLabel){
  const tagLine = tagLabel ? `They tagged this entry to: "${tagLabel}".\n` : '';
  const prompt = `A person's goal or focus: "${profile.northstar || profile.focus || ''}". Their current strategy or context: "${contextSummary || 'none stated yet'}".\n${tagLine}\nA journal entry they just wrote about their progress:\n"${entryBody}"\n\nIn 2-3 sentences, give an honest, specific reflection - does this genuinely represent progress toward their stated goal, is there a real risk or blind spot worth naming, or a concrete next step implied by what they wrote? Reference their actual goal or tag by name. Avoid generic encouragement like "great job" or "keep it up" - be specific or say nothing complimentary at all.`;
  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 200, messages: [{role:"user", content: prompt}] })
    });
    const data = await response.json();
    return (data.content || []).map(b => b.type==='text'?b.text:'').filter(Boolean).join('\n') || null;
  } catch(err){ console.error('Journal reflection failed:', err); return null; }
}

/* The genuinely new piece: a real pattern reflection across several
   recent entries, not just one. This is what makes a journal
   actually useful instead of decorative - a single-entry reflection
   can only ever restate what you just wrote back at you; a pattern
   across entries can surface something you wouldn't have noticed
   yourself (a recurring blocker, a stalled area, a real trend). */
async function reflectOnEntryPattern(profile, contextSummary, recentEntries){
  const entriesText = recentEntries.map((e, i) => `${i+1}. ${e.tag_label ? `[${e.tag_label}] ` : ''}${e.body}`).join('\n');
  const prompt = `A person's goal or focus: "${profile.northstar || profile.focus || ''}". Their current strategy or context: "${contextSummary || 'none stated yet'}".\n\nTheir last ${recentEntries.length} journal entries, most recent first:\n${entriesText}\n\nLook across ALL of these entries together - not one at a time - and give an honest, specific pattern reflection in 3-4 sentences. Is there a recurring blocker or theme they may not have noticed themselves? Is progress actually happening, stalling, or scattered across unrelated things? Reference specific entries or their actual goal by name. Do not just summarize what they wrote - say something they couldn't have gotten from re-reading their own entries.`;
  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 250, messages: [{role:"user", content: prompt}] })
    });
    const data = await response.json();
    return (data.content || []).map(b => b.type==='text'?b.text:'').filter(Boolean).join('\n') || null;
  } catch(err){ console.error('Pattern reflection failed:', err); return null; }
}

function waypointTimeAgo(iso){
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if(days === 0) return 'Today';
  if(days === 1) return '1 day ago';
  return `${days} days ago`;
}

/* The single shared renderer used identically by every role's
   Waypoint page - centralizing this avoids 4 near-duplicate copies
   silently drifting out of sync with each other over time.
   opts: { storageKey, profile, getContextSummary(), listElId,
   countElId, patternBtnId, patternResultId, tagFieldLabel } */
function renderWaypointJournal(opts){
  const entries = getWaypointPosts(opts.storageKey);
  const countEl = document.getElementById(opts.countElId);
  if(countEl) countEl.textContent = `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`;

  const listEl = document.getElementById(opts.listElId);
  if(entries.length === 0){
    listEl.innerHTML = `<div class="empty-state"><div class="glyph">&#128220;</div>No entries yet.<div class="sub">Add your first one above.</div></div>`;
    const patternPanel = document.getElementById(opts.patternPanelId);
    if(patternPanel) patternPanel.classList.add('hidden');
    return;
  }

  const patternPanel = document.getElementById(opts.patternPanelId);
  if(patternPanel) patternPanel.classList.toggle('hidden', entries.length < 3);

  listEl.innerHTML = entries.map(entry => `<div class="entry-card" data-entry-id="${entry.id}">
    <div class="entry-head">
      <span class="entry-time">${waypointTimeAgo(entry.created_at)}${entry.edited_at ? ' (edited)' : ''}</span>
      ${entry.tag_label ? `<span class="entry-stage-badge">${entry.tag_label}</span>` : ''}
    </div>
    <p class="entry-body" id="body-${entry.id}">${entry.body}</p>
    <textarea class="entry-edit-area hidden" id="edit-${entry.id}">${entry.body}</textarea>
    ${entry.video_url ? `<div class="entry-video-note">&#127909; Video: <a href="${entry.video_url}" target="_blank" style="color:var(--comet);">${entry.video_url}</a></div>` : ''}
    <div class="entry-actions">
      <button class="entry-action-btn" data-action="reflect" data-entry-id="${entry.id}">Ask Metis to reflect</button>
      <button class="entry-action-btn" data-action="edit" data-entry-id="${entry.id}">Edit</button>
      <button class="entry-action-btn" data-action="delete" data-entry-id="${entry.id}">Delete</button>
    </div>
    <div class="entry-reflection" id="reflection-${entry.id}"></div>
  </div>`).join('');

  listEl.querySelectorAll('[data-action="reflect"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const entryId = btn.dataset.entryId;
      const entry = entries.find(e => e.id === entryId);
      const container = document.getElementById('reflection-' + entryId);
      btn.disabled = true; btn.textContent = 'Thinking...';
      container.innerHTML = `<p style="color:var(--text-faint); font-style:italic;">Reflecting...</p>`;
      container.classList.add('open');
      const text = await reflectOnJournalEntry(opts.profile, opts.getContextSummary(), entry.body, entry.tag_label);
      btn.disabled = false; btn.textContent = 'Ask Metis to reflect';
      container.innerHTML = text || `<span style="color:var(--danger);">Couldn't reach Metis just now - try again.</span>`;
    });
  });

  listEl.querySelectorAll('[data-action="edit"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const entryId = btn.dataset.entryId;
      const bodyEl = document.getElementById('body-' + entryId);
      const editEl = document.getElementById('edit-' + entryId);
      const editing = !editEl.classList.contains('hidden');
      if(editing){
        updateWaypointPost(opts.storageKey, entryId, editEl.value.trim());
        renderWaypointJournal(opts);
      } else {
        bodyEl.classList.add('hidden');
        editEl.classList.remove('hidden');
        btn.textContent = 'Save';
      }
    });
  });

  listEl.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteWaypointPost(opts.storageKey, btn.dataset.entryId);
      renderWaypointJournal(opts);
    });
  });
}

/* ---- Company Research + Interview Prep Coach. Mirrors
   app/services/market_research.py exactly - real web search on a
   specific company, and a real prep brief once someone has an
   actual interview. Neither of these exist on any mainstream job
   board: they show you a match score and stop there. ---- */
async function researchCompany(companyName, roleTitle){
  const prompt = `Search for real, current, publicly available information about "${companyName}" that would help someone preparing to apply for or interview for a "${roleTitle}" role there - what the company says about itself, recent news, their stated values or mission, size and stage, and anything publicly discussed about their interview process or culture.\n\nReport ONLY what you actually find through search - do not fill in gaps with generic assumptions about companies of this type in general, and do not invent specific claims this company doesn't support. If you can't find anything specific and current, say that plainly rather than guessing.\n\nParaphrase what you find in your own words rather than quoting sources at length. Structure your answer as: what you found, and then 2-3 concrete implications for how this candidate should position themselves for this specific company and role.`;
  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6", max_tokens: 1000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{role:"user", content: prompt}],
      })
    });
    const data = await response.json();
    const findings = (data.content || []).map(b => b.type==='text'?b.text:'').filter(Boolean).join('\n');
    const sources = [];
    (data.content || []).forEach(block => {
      if(block.type === 'web_search_tool_result' && Array.isArray(block.content)){
        block.content.forEach(item => { if(item.url) sources.push({ url: item.url, title: item.title || item.url }); });
      }
    });
    return { findings: findings || null, sources };
  } catch(err){ console.error('Company research failed:', err); return null; }
}

async function generateInterviewPrep(companyName, roleTitle, companyResearch, profile, roadmapSummary){
  const researchLine = companyResearch
    ? `Real research on this company: "${companyResearch}"\n\n`
    : `No company research has been done yet for this one - work from the role and candidate's background only, and don't invent specifics about the company.\n\n`;
  const prompt = `A candidate has a real interview for "${roleTitle}" at "${companyName}".\n\n${researchLine}Their stated goal: "${profile.northstar}". Skills: "${profile.skills}". Their roadmap strategy: "${roadmapSummary || 'no roadmap yet'}".\n\nGenerate a real, specific interview prep brief - grounded in what's actually known about this role and candidate, not generic interview advice.\n\nReturn a JSON object with exactly these four keys:\n- likely_questions: an array of 3-4 specific questions this candidate should genuinely expect for this role, each with a 1-sentence note on what a strong answer would actually demonstrate\n- talking_points: an array of 3-4 specific things from THIS candidate's real background (reference their actual stated skills/goal) that are worth emphasizing for this specific role\n- questions_to_ask: an array of 2-3 real, specific questions this candidate should ask the interviewer - not generic ("what's the culture like"), grounded in the actual role or company research if available\n- roadmap_connection: 1-2 sentences on how this specific interview connects to the candidate's actual roadmap - what it would mean for their plan if it goes well\n\nReturn ONLY valid JSON, nothing else, no markdown fences, no commentary.`;
  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{role:"user", content: prompt}] })
    });
    const data = await response.json();
    let text = (data.content || []).map(b => b.type==='text'?b.text:'').filter(Boolean).join('\n');
    text = text.trim().replace(/^```json/,'').replace(/^```/,'').replace(/```$/,'').trim();
    return JSON.parse(text);
  } catch(err){ console.error('Interview prep generation failed:', err); return null; }
}

function getCompanyResearchCache(){ try{ return JSON.parse(localStorage.getItem('velora_company_research')) || {}; }catch(e){ return {}; } }
function saveCompanyResearchCache(cache){ localStorage.setItem('velora_company_research', JSON.stringify(cache)); }
function getInterviewPrepCache(){ try{ return JSON.parse(localStorage.getItem('velora_interview_prep')) || {}; }catch(e){ return {}; } }
function saveInterviewPrepCache(cache){ localStorage.setItem('velora_interview_prep', JSON.stringify(cache)); }

/* ---- "Why not" near-misses - the listings that fell just short of
   the ranked list, with the same real, grounded rationale used for
   every listing (not a separately-invented negative framing). Most
   job boards silently drop everything below the cutoff. ---- */
function computeNearMisses(scoredAll, topN, nearMissN){
  return scoredAll.slice(topN, topN + nearMissN);
}


/* ---- Mock listings dataset (now includes 'athletic') ---- */
const LISTINGS = [
  {id:1, type:'internship', title:'Product Analytics Intern', org:'Northlight Health', tags:['sql','python','a/b testing','analytics','product'], loc:'Remote', deadline:'Aug 22'},
  {id:2, type:'job', title:'Associate Product Manager', org:'Fernway Labs', tags:['product','sql','roadmap','stakeholder','growth'], loc:'San Francisco, CA', deadline:'Sep 3'},
  {id:3, type:'college', title:'Data & Society Summer Fellowship', org:'Ridgeline Institute', tags:['data','research','fellowship','policy'], loc:'Remote', deadline:'Aug 30'},
  {id:4, type:'internship', title:'Growth & Experimentation Intern', org:'Cobalt Systems', tags:['a/b testing','python','growth','analytics'], loc:'Remote', deadline:'Sep 10'},
  {id:5, type:'job', title:'Business Analyst, New Grad Program', org:'Delmar Financial', tags:['sql','excel','reporting','finance'], loc:'Austin, TX', deadline:'Sep 18'},
  {id:6, type:'college', title:'Undergraduate Research Grant - Applied Data Science', org:'Whitfield University', tags:['research','data','python','grant'], loc:'Remote', deadline:'Aug 25'},
  {id:7, type:'internship', title:'Product Management Intern', org:'Arclight', tags:['product','roadmap','sql','user research'], loc:'San Jose, CA', deadline:'Aug 29'},
  {id:8, type:'job', title:'Data-Focused PM (APM Program)', org:'Twin River', tags:['product','python','sql','analytics','a/b testing'], loc:'Remote', deadline:'Sep 5'},
  {id:9, type:'internship', title:'Operations Analytics Intern', org:'Foundry Retail', tags:['excel','sql','operations','reporting'], loc:'Chicago, IL', deadline:'Sep 1'},
  {id:10, type:'college', title:'Tech Policy & Data Ethics Fellowship', org:'Carrow Center', tags:['policy','research','fellowship','ethics'], loc:'Washington, DC', deadline:'Sep 12'},
  {id:11, type:'job', title:'Junior Data Analyst', org:'Portside Analytics', tags:['sql','python','dashboards','reporting'], loc:'Remote', deadline:'Aug 27'},
  {id:12, type:'internship', title:'Campus Innovation Fellows Program', org:'Alder & Finch', tags:['leadership','product','pitch','mentorship'], loc:'Remote', deadline:'Sep 8'},
  {id:13, type:'job', title:'Product Operations Associate', org:'Cinderlake', tags:['product','sql','process','stakeholder'], loc:'Remote', deadline:'Sep 15'},
  {id:14, type:'college', title:'Quant Social Science Summer Institute', org:'Marrow College', tags:['research','python','data','stats'], loc:'Boston, MA', deadline:'Aug 31'},
  {id:15, type:'internship', title:'Strategy & Analytics Intern', org:'Beacon Peak', tags:['excel','sql','strategy','analytics'], loc:'Remote', deadline:'Sep 6'},
  {id:16, type:'job', title:'Product Insights Analyst', org:'Halyard Co.', tags:['product','sql','python','user research'], loc:'Remote', deadline:'Sep 20'},
  {id:17, type:'internship', title:'Summer Data & Product Intern', org:'Milk & Ledger', tags:['product','python','analytics','a/b testing'], loc:'Remote', deadline:'Sep 4'},
  {id:18, type:'college', title:'Innovation & Entrepreneurship Grant', org:'Osprey Foundation', tags:['grant','product','pitch','leadership'], loc:'Remote', deadline:'Sep 22'},
  {id:19, type:'job', title:'Product Marketing Associate', org:'Bellwood', tags:['marketing','product','writing','positioning'], loc:'Remote', deadline:'Sep 9'},
  {id:20, type:'internship', title:'UX Research Intern', org:'Glasswing Studio', tags:['ux','research','user research','figma'], loc:'Remote', deadline:'Sep 14'},
  {id:21, type:'job', title:'Machine Learning Product Analyst', org:'Cinder & Vale', tags:['ml','python','sql','product','analytics'], loc:'Remote', deadline:'Sep 25'},
  {id:22, type:'college', title:'Women in Data Science Scholarship', org:'Halsey Trust', tags:['data','scholarship','python','mentorship'], loc:'Remote', deadline:'Sep 17'},
  {id:23, type:'internship', title:'Venture Fellows Summer Program', org:'Northbrook Capital', tags:['pitch','leadership','strategy','product'], loc:'Remote', deadline:'Sep 11'},
  {id:24, type:'job', title:'Technical Program Coordinator', org:'Fairhaven Systems', tags:['process','stakeholder','sql','operations'], loc:'Seattle, WA', deadline:'Sep 19'},
  {id:25, type:'athletic', title:"Women's Rowing Athletic Scholarship", org:'Marrow College Athletics', tags:['athletics','rowing','leadership','scholarship'], loc:'Boston, MA', deadline:'Sep 30'},
  {id:26, type:'athletic', title:'Track & Field Partial Scholarship', org:'Whitfield University', tags:['athletics','track','training','scholarship'], loc:'Remote', deadline:'Oct 5'},
  {id:27, type:'athletic', title:'Student-Athlete Leadership Grant', org:'Bold Futures Fund', tags:['athletics','leadership','grant','mentorship'], loc:'Remote', deadline:'Sep 28'},
  {id:28, type:'athletic', title:"Men's Soccer Athletic Scholarship", org:'Carrow Center Athletics', tags:['athletics','soccer','scholarship','recruiting'], loc:'Washington, DC', deadline:'Oct 10'},
  {id:29, type:'athletic', title:'Basketball Partial Scholarship', org:'Northbrook Athletics', tags:['athletics','basketball','scholarship','training'], loc:'Remote', deadline:'Oct 2'},
  {id:30, type:'athletic', title:'Swimming & Diving Scholarship', org:'Halyard Aquatics', tags:['athletics','swimming','scholarship','training'], loc:'Austin, TX', deadline:'Sep 25'},
  {id:31, type:'athletic', title:'Assistant Athletic Coach', org:'Fernway Prep Athletics', tags:['athletics','coaching','leadership','training'], loc:'Remote', deadline:'Oct 8'},
  {id:32, type:'athletic', title:'Certified Athletic Trainer', org:'Delmar Sports Medicine', tags:['athletics','athletic training','injury prevention','sports medicine'], loc:'Chicago, IL', deadline:'Oct 12'},
  {id:33, type:'athletic', title:'Strength & Conditioning Coach', org:'Twin River Performance', tags:['athletics','strength training','coaching','conditioning'], loc:'Remote', deadline:'Oct 6'},
  {id:34, type:'athletic', title:'Sports Program Coordinator', org:'Beacon Peak Recreation', tags:['athletics','sports management','coordination','operations'], loc:'Seattle, WA', deadline:'Oct 15'},
  {id:35, type:'athletic', title:'Athletic Department Operations Assistant', org:'Marrow College Athletics', tags:['athletics','sports management','operations','stakeholder'], loc:'Boston, MA', deadline:'Sep 29'},
];

/* ---- Matching engine ---- */
function tokenize(str){ return (str.toLowerCase().match(/[a-z][a-z\-]{2,}/g) || []); }

function scoreListing(listing, goalTokens, skillTokens, priorities, dealbreakers){
  if(dealbreakers && listing.tags.some(t=> dealbreakers.includes(t))) return null;
  const tagSet = listing.tags;
  let score = 0, matchedGoal = [], matchedSkill = [], neutral = [];
  tagSet.forEach(tag=>{
    const inGoal = goalTokens.some(t=> tag.includes(t) || t.includes(tag));
    const inSkill = skillTokens.some(t=> tag.includes(t) || t.includes(tag));
    if(inGoal){ score += 3; matchedGoal.push(tag); }
    if(inSkill){ score += 2; matchedSkill.push(tag); }
    if(!inGoal && !inSkill) neutral.push(tag);
  });
  if(priorities.includes('learning') && (listing.type==='internship'||listing.type==='college')) score += 1.5;
  if(priorities.includes('pay') && listing.type==='job') score += 1.5;
  score += (listing.id * 37) % 5;
  const pct = Math.max(35, Math.min(97, Math.round((score / (tagSet.length*3+2)) * 100)));
  return {score, pct, matchedGoal:[...new Set(matchedGoal)], matchedSkill:[...new Set(matchedSkill)], neutral:[...new Set(neutral)]};
}
function parseDeadline(str){
  const months = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
  const [mon, day] = str.split(' '); return new Date(2026, months[mon], parseInt(day)).getTime();
}

function buildRationale(listing, m, profile){
  const goalPhrase = (profile.northstar.split(/[.,;]/)[0] || 'your goal').toLowerCase();
  const clauses = [];

  if(m.matchedGoal.length){
    clauses.push(`directly touches <b>${m.matchedGoal.slice(0,2).join(', ')}</b> from your stated goal of ${goalPhrase}`);
  }
  if(m.matchedSkill.length){
    clauses.push(`draws on your existing experience with <b>${m.matchedSkill.slice(0,2).join(', ')}</b>`);
  }

  const priorities = profile.priorities || [];
  if(priorities.includes('pay') && listing.type === 'job'){
    clauses.push('is a full-time role, aligned with pay being a top priority for you');
  }
  if(priorities.includes('learning') && (listing.type === 'internship' || listing.type === 'college')){
    clauses.push('is structured around hands-on learning, which you said matters most right now');
  }
  const listingLoc = (listing.loc || '').toLowerCase();
  if(priorities.includes('flexibility') && listingLoc.includes('remote')){
    clauses.push('is remote, matching your stated need for flexibility');
  }

  const locationPref = (profile.loc || '').toLowerCase();
  if(locationPref && listingLoc){
    if(locationPref.includes('remote') && listingLoc.includes('remote')){
      clauses.push('matches your remote location preference');
    } else {
      const prefTokens = tokenize(locationPref).filter(t => t.length > 3);
      if(prefTokens.some(t => listingLoc.includes(t))){
        clauses.push(`is based in ${listing.loc}, inside your stated location preference`);
      }
    }
  }

  let deadlineNote = '';
  if(listing.deadline){
    const deadlineTime = parseDeadline(listing.deadline);
    if(!isNaN(deadlineTime)){
      const daysLeft = Math.round((deadlineTime - Date.now()) / 86400000);
      if(daysLeft >= 0 && daysLeft <= 14){
        deadlineNote = ` It also closes in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}, so it's worth acting on soon if you're interested.`;
      }
    }
  }

  if(clauses.length === 0){
    return `Looser fit - no strong overlap with your stated goal, skills, or priorities yet, but worth a glance while broadening this cycle's search.${deadlineNote}`;
  }
  let joined;
  if(clauses.length === 1) joined = clauses[0];
  else if(clauses.length === 2) joined = `${clauses[0]}, and ${clauses[1]}`;
  else joined = clauses.slice(0, -1).join(', ') + `, and ${clauses[clauses.length-1]}`;

  return `This ${joined}.${deadlineNote}`;
}
function runMatchCycle(profile){
  const goalTokens = tokenize(profile.northstar + ' ' + profile.finalidea);
  const skillTokens = tokenize(profile.skills);
  let candidates = LISTINGS.filter(l=> profile.types.includes(l.type));
  let scored = candidates.map(l=>{
    const m = scoreListing(l, goalTokens, skillTokens, profile.priorities, profile.dealbreakers);
    if(!m) return null;
    m.rationale = buildRationale(l, m, profile);
    return {...l, ...m};
  }).filter(Boolean).sort((a,b)=> b.pct - a.pct).slice(0,10);
  return scored;
}

/* ---- "Why not" transparency - mirrors the backend's
   rank_listings_with_near_misses exactly. Returns the top 10 plus the
   next 5 below the cutoff, both using the SAME real rationale already
   computed for every listing - not a separately-invented negative
   framing. Most job boards silently drop everything below the
   cutoff; this shows it, with real reasoning either way. ---- */
function runMatchCycleWithNearMisses(profile){
  const goalTokens = tokenize(profile.northstar + ' ' + profile.finalidea);
  const skillTokens = tokenize(profile.skills);
  let candidates = LISTINGS.filter(l=> profile.types.includes(l.type));
  let scored = candidates.map(l=>{
    const m = scoreListing(l, goalTokens, skillTokens, profile.priorities, profile.dealbreakers);
    if(!m) return null;
    m.rationale = buildRationale(l, m, profile);
    return {...l, ...m};
  }).filter(Boolean).sort((a,b)=> b.pct - a.pct);
  return { matches: scored.slice(0, 10), nearMisses: scored.slice(10, 15) };
}

function typeBadgeLabel(t){ return t==='job'?'Job':t==='internship'?'Internship':t==='athletic'?'Athletics':'College / Fellowship'; }

function computeRoadmapAlignment(listing, milestones){
  if(!milestones || !milestones.length) return null;
  const listingTags = new Set(listing.tags.map(t => t.toLowerCase()));
  let bestStage = null, bestOverlap = 0;
  milestones.forEach(m => {
    const milestoneText = (m.title + ' ' + m.description).toLowerCase();
    let overlap = 0;
    listingTags.forEach(tag => { if(milestoneText.includes(tag)) overlap++; });
    if(overlap > bestOverlap){ bestOverlap = overlap; bestStage = m; }
  });
  if(!bestStage || bestOverlap === 0) return null;
  return { stage: bestStage.stage, title: bestStage.title, matchedOn: bestOverlap };
}

function ringSvg(pct, color, size){
  size = size || 52;
  const r = (size/2) - 5, c = 2*Math.PI*r, offset = c-(pct/100)*c, cx = size/2;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="var(--line)" stroke-width="4"/><circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="${c}" stroke-dashoffset="${offset}" stroke-linecap="round"/></svg>`;
}

/* ---- Generic tag/keyword-overlap scoring, reusable for candidates matching businesses and tutors matching requests ---- */
function scoreByOverlap(itemTags, requirementText){
  const reqTokens = tokenize(requirementText || '');
  const matched = itemTags.filter(tag => reqTokens.some(t => tag.toLowerCase().includes(t) || t.includes(tag.toLowerCase())));
  const pct = itemTags.length ? Math.max(30, Math.min(96, Math.round((matched.length / itemTags.length) * 100) + 25)) : 30;
  return { pct, matched };
}

/* ---- Career discovery: for people who don't know what direction to aim at yet ---- */
const CAREER_DIRECTIONS = [
  { id:'product-strategy', title:'Product & Business Strategy', description:'Deciding what gets built and why - balancing user needs, data, and business goals.', dims:{people:2,data:2,creative:1,structure:2}, listingTags:['product','roadmap','stakeholder','strategy'] },
  { id:'data-analytics', title:'Data & Analytics', description:'Finding patterns in information to answer real questions and guide decisions.', dims:{people:0,data:3,creative:0,structure:2}, listingTags:['sql','python','analytics','data','dashboards'] },
  { id:'software-engineering', title:'Software Engineering', description:'Building the systems and tools other people and businesses run on.', dims:{people:0,data:2,creative:1,structure:2}, listingTags:['python','backend development','ml','testing'] },
  { id:'ux-design', title:'UX & Design', description:'Shaping how something looks, feels, and works for the people using it.', dims:{people:2,data:0,creative:3,structure:0}, listingTags:['figma','user research','prototyping','ux'] },
  { id:'marketing-comms', title:'Marketing & Communications', description:'Telling a story clearly enough that the right people actually hear it.', dims:{people:2,data:1,creative:2,structure:0}, listingTags:['marketing','writing','positioning','growth'] },
  { id:'healthcare-science', title:'Healthcare & Life Sciences', description:'Working directly on human health, from clinical care to research.', dims:{people:3,data:1,creative:0,structure:2}, listingTags:['sports medicine','athletic training','injury prevention','research'] },
  { id:'education-teaching', title:'Education & Teaching', description:'Helping other people learn something you understand well.', dims:{people:3,data:0,creative:1,structure:1}, listingTags:['mentorship','leadership','coaching','training'] },
  { id:'skilled-trades', title:'Skilled Trades & Hands-on Work', description:'Building or fixing real, physical things - work you can see the result of.', dims:{people:1,data:0,creative:1,structure:1}, listingTags:['operations','process','training','conditioning'] },
  { id:'creative-media', title:'Creative & Media', description:'Making things - writing, video, design, or content people actually engage with.', dims:{people:1,data:0,creative:3,structure:0}, listingTags:['writing','positioning','figma','prototyping'] },
  { id:'social-impact', title:'Social Impact & Nonprofit', description:'Working on a mission-driven problem where the impact matters more than the paycheck.', dims:{people:3,data:1,creative:1,structure:1}, listingTags:['policy','ethics','mentorship','leadership'] },
  { id:'finance-ops', title:'Finance & Operations', description:'Keeping the numbers, processes, and logistics of an organization actually working.', dims:{people:0,data:2,creative:0,structure:3}, listingTags:['finance','excel','operations','reporting'] },
  { id:'sports-athletics', title:'Sports & Athletics', description:'A career built around competition, coaching, or the business of sport.', dims:{people:2,data:0,creative:1,structure:1}, listingTags:['athletics','coaching','sports management','training'] },
];

function scoreCareerDirections(answers){
  // answers: {people, data, creative, structure} each 0-3, plus freeText
  const freeTextTokens = tokenize(answers.freeText || '');
  return CAREER_DIRECTIONS.map(dir => {
    const dimDiff = Math.abs(dir.dims.people - answers.people) + Math.abs(dir.dims.data - answers.data) +
                     Math.abs(dir.dims.creative - answers.creative) + Math.abs(dir.dims.structure - answers.structure);
    const maxDiff = 12; // 4 dims x max distance 3
    let pct = Math.round((1 - (dimDiff / maxDiff)) * 100);
    const textMatches = dir.listingTags.filter(tag => freeTextTokens.some(t => tag.includes(t) || t.includes(tag)));
    pct = Math.min(97, pct + (textMatches.length * 6));
    pct = Math.max(20, pct);
    const relatedListings = LISTINGS.filter(l => l.tags.some(t => dir.listingTags.includes(t)));
    return { ...dir, pct, textMatches, relatedCount: relatedListings.length };
  }).sort((a,b) => b.pct - a.pct);
}

/* ---- Real AI-generated career directions: this is the actual
   'better than FutureScope' piece. Static quiz tools (FutureScope,
   CareerExplorer) match your answers against a fixed list of a few
   hundred to a thousand pre-written career profiles - you always get
   back something from their list, worded the same way for everyone
   who lands near that spot. This instead reasons directly over what
   someone actually wrote, so the output isn't capped to a fixed set
   of categories and reads like it was written for this person, not
   pulled from a shelf. scoreCareerDirections() above is kept only as
   an instant offline fallback if this call fails. ---- */
async function generateCareerDirectionsAI(answers){
  const valuesText = (answers.values && answers.values.length) ? answers.values.join(', ') : 'not specified';
  const prompt = `Someone doesn't know what career direction to pursue. Here's what they told us, which is the actual evidence to reason from - weight the concrete, specific things they described far more heavily than the numeric ratings:

REAL EVIDENCE (the strongest signal - what they've actually done):
- Something they're proud of having built, led, organized, or solved: "${answers.proudMoment || 'not answered'}"
- A time they lost track of time (a real flow moment): "${answers.flowMoment || 'not answered'}"
- What people already come to them for help with: "${answers.soughtFor || 'not answered'}"

VALUES (what they'd protect even at a cost): ${valuesText}

WORK STYLE (secondary signal, use to shape HOW you frame directions, not to pick generic categories):
People-facing vs solo: ${answers.people}/3. Data/analytical work: ${answers.data}/3. Open-ended vs structured: ${answers.structure}/3. Risk tolerance (stable vs entrepreneurial): ${answers.risk}/3. Pace (steady vs fast-changing): ${answers.pace}/3.

WHAT TO AVOID: "${answers.avoidText || 'not specified'}"

PRACTICAL CONTEXT: ${answers.timeline === 'now' ? 'Needs direction soon, not just exploring casually' : 'Just exploring, no deadline pressure'}. ${answers.openToTraining === 'yes' ? 'Open to more school/training if it fits.' : 'Prefers to avoid additional formal schooling.'}

Generate 3-4 specific career directions worth them considering. Ground your reasoning in the REAL EVIDENCE section above FIRST - the proud moment, flow moment, and what people seek them out for are worth more than the numeric sliders. Do NOT default to generic broad categories like "marketing" or "healthcare" unless their answers genuinely point there. If what they described is specific, your directions should be too, not generic buckets. Respect their stated dealbreakers - never suggest a direction that clearly conflicts with what they said to avoid.

For each direction, return an object with exactly these four keys:
- title: a specific, real direction (not a vague category)
- description: 1-2 sentences on what someone in this direction actually spends their time doing, concretely
- why_fits: 1-2 sentences connecting THIS specific person's real evidence (quote or reference their actual accomplishment, flow moment, or what people seek them for) to why this direction fits them specifically - not their slider ratings, their actual described evidence
- first_step: one concrete, low-commitment thing they could do this week to test whether it actually fits - not "research the field", something specific and doable

Return ONLY valid JSON, an array of 3-4 such objects, nothing else, no markdown fences, no commentary.`;
  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1100, messages: [{role:"user", content: prompt}] })
    });
    const data = await response.json();
    let text = (data.content || []).map(b => b.type==='text'?b.text:'').filter(Boolean).join('\n');
    text = text.trim().replace(/^```json/,'').replace(/^```/,'').replace(/```$/,'').trim();
    const parsed = JSON.parse(text);
    const evidenceTokens = tokenize([answers.proudMoment, answers.flowMoment, answers.soughtFor].filter(Boolean).join(' '));
    return parsed.map((d, i) => {
      const dTokens = tokenize(d.title + ' ' + d.description);
      const allTokens = [...new Set([...dTokens, ...evidenceTokens])];
      const relatedListings = LISTINGS.filter(l => l.tags.some(t => allTokens.some(tok => t.includes(tok) || tok.includes(t))));
      return { ...d, id: 'ai-' + i, relatedCount: relatedListings.length };
    });
  } catch(err){
    console.error('AI career direction generation failed, falling back to offline matching:', err);
    return null;
  }
}

async function explainCareerDirectionDeep(direction, answers){
  const valuesText = (answers.values && answers.values.length) ? answers.values.join(', ') : 'not specified';
  const prompt = `Someone doesn't yet know what career direction to pursue. What they're proud of: "${answers.proudMoment || 'not answered'}". A real flow moment: "${answers.flowMoment || 'not answered'}". What people already seek them out for: "${answers.soughtFor || 'not answered'}". What they value: ${valuesText}. What they want to avoid: "${answers.avoidText || 'not specified'}".\n\nA suggested direction: "${direction.title}" - ${direction.description}\n\nWrite a genuine, specific 3-4 sentence case for why this direction could fit THEM based on their real evidence above - reference their actual accomplishment or flow moment specifically, not generic traits. Then give one concrete, low-commitment first step they could take this week to test whether it actually fits (not "research the field" - something specific and doable). Be honest if the fit seems only partial, especially if it conflicts with what they said to avoid.`;
  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 300, messages: [{role:"user", content: prompt}] })
    });
    const data = await response.json();
    return (data.content || []).map(b => b.type==='text'?b.text:'').filter(Boolean).join('\n') || null;
  } catch(err){ console.error('Career direction explanation failed:', err); return null; }
}

function getCareerDiscoveryResult(){ try{ return JSON.parse(localStorage.getItem('velora_career_discovery')); }catch(e){ return null; } }
function saveCareerDiscoveryResult(r){ localStorage.setItem('velora_career_discovery', JSON.stringify(r)); }

/* ---- Roadmap generation (client-side, personalized with real match data) ---- */
function generateRoadmapLocal(profile, skillGaps, topMatch){
  skillGaps = skillGaps || [];
  const stage = profile.stage;
  const goalPhrase = profile.northstar.split(/[.,;]/)[0];
  const finalPhrase = (profile.finalidea || '').split(/[.,;]/)[0] || goalPhrase;
  const gapSkill = skillGaps[0];
  const gapSkill2 = skillGaps[1];
  const priorityText = (profile.priorities || []).join(' and ') || 'fit';
  const locText = profile.loc || 'your target location';
  const steps = [];

  const matchLine = topMatch
    ? `Your current top match is "${topMatch.title}" at ${topMatch.org} (${topMatch.pct}% fit) - start there.`
    : `Run a scan on the Job Search page first so this step can point at a real listing instead of a placeholder.`;
  const matchFirstAction = topMatch
    ? `Today: open "${topMatch.title}" at ${topMatch.org} on your Job Search page and read the full listing - decide within 24 hours whether to apply.`
    : `Today: go to Job Search and click "Start watch" so real listings start showing up here.`;

  if(stage === 'student'){
    steps.push({
      title: `Ship one project that directly demonstrates "${goalPhrase}"`,
      description: `Not a class assignment - something you chose, built, and can defend in an interview. It should use the specific skills your target roles ask for, not generic ones.`,
      success_criteria: 'You have a live link, repo, or writeup you would actually be comfortable sending to a stranger.',
      estimated_timeframe: '2-4 weeks',
      first_action: 'Today: write down the exact project idea in one sentence and pick the single dataset, tool, or problem you will use.',
      resource: 'A public dataset on Kaggle or your school\'s data repository in a domain close to your goal.',
      risk: 'Picking a project too broad to finish in the timeframe - scope it down until you could finish a rough version in a weekend.',
    });
    if(gapSkill){
      steps.push({
        title: `Get hands-on with ${gapSkill}${gapSkill2 ? ' and ' + gapSkill2 : ''}`,
        description: `These show up repeatedly in listings that match "${goalPhrase}" but aren't in what you told us about your skills - this is the single highest-leverage gap to close right now.`,
        success_criteria: `You can walk someone through one real example of using ${gapSkill}, not just say you've "studied" it.`,
        estimated_timeframe: '3-6 weeks',
        first_action: `Today: find one free tutorial or real dataset involving ${gapSkill} and complete the first concrete exercise, not just watch an overview.`,
        resource: `A free-tier course or official documentation site for ${gapSkill}, paired with one real practice problem.`,
        risk: 'Passively watching tutorials without building anything - force yourself to produce one artifact, however small.',
      });
    }
    steps.push({
      title: `Apply to your top ${priorityText}-scoring internship matches`,
      description: `${matchLine} Prioritize matches scoring 65%+ over lower ones - fit compounds, volume doesn't.`,
      success_criteria: 'You have applied to at least 5 internships scoring 60%+ and heard back from at least 1.',
      estimated_timeframe: '1-3 months',
      first_action: matchFirstAction,
      resource: 'Your Job Search watch, filtered and sorted by match percentage.',
      risk: 'Applying broadly to low-fit roles instead of a focused set of high-fit ones - quality of application beats quantity here.',
    });
    steps.push({
      title: `Convert your internship into a full-time offer near "${finalPhrase}"`,
      description: `Target new-grad programs at companies similar to wherever you land your internship - proven internal performance is the strongest signal you can build.`,
      success_criteria: 'You have a signed offer, or are in final-round interviews at 2+ places.',
      estimated_timeframe: '2-4 months',
      first_action: 'Once your internship starts: identify the one metric your manager cares about most and make visible progress on it in your first 30 days.',
      resource: 'Your internship manager and one senior peer, as direct sources of what "doing well" actually looks like there.',
      risk: 'Staying heads-down on tasks without ever confirming with your manager whether you\'re prioritizing the right things.',
      if_it_works: `You'll likely get a return offer or a strong referral - use it to negotiate for the specific team or scope closest to "${finalPhrase}", not just any open headcount.`,
      if_it_stalls: 'If no return offer comes, ask directly for specific feedback before the internship ends - a clear "why not" is worth more for your next attempt than silence, and apply that feedback to your next internship search immediately rather than waiting.',
    });
  } else if(stage === 'grad'){
    steps.push({
      title: 'Rewrite your resume around your 3 strongest, most specific outcomes',
      description: `Every bullet should have a number or a before/after - "improved X by Y%" beats "responsible for X" every time.`,
      success_criteria: 'A friend can read your resume for 30 seconds and correctly state your strongest qualification back to you.',
      estimated_timeframe: '1 week',
      first_action: 'Today: pick your single best accomplishment and rewrite it with a specific number attached.',
      resource: 'One trusted peer or mentor willing to give blunt, specific feedback on a draft.',
      risk: 'Over-polishing wording instead of fixing substance - a vague strong bullet needs a real number, not better adjectives.',
    });
    if(gapSkill){
      steps.push({
        title: `Close the ${gapSkill} gap before it costs you interviews`,
        description: `This shows up often in listings matching "${goalPhrase}" but isn't reflected anywhere in your current resume or skills.`,
        success_criteria: `You have one concrete example of using ${gapSkill} you could describe in an interview.`,
        estimated_timeframe: '3-4 weeks',
        first_action: `Today: find one small, real task involving ${gapSkill} you could complete this week.`,
        resource: `A free-tier course or official documentation for ${gapSkill}.`,
        risk: 'Treating this as optional polish rather than a real gap - if it shows up in most of your target listings, it is load-bearing.',
      });
    }
    steps.push({
      title: `Apply to entry-level roles matching "${goalPhrase}", prioritized by fit not title`,
      description: `${matchLine} A 70%+ goal-fit role at a smaller company usually beats a 40%-fit role at a bigger name.`,
      success_criteria: 'You are actively interviewing at 3+ roles scoring 70%+ match.',
      estimated_timeframe: '1-2 months',
      first_action: matchFirstAction,
      resource: 'Your Job Search watch, filtered and sorted by match percentage.',
      risk: 'Chasing brand-name companies over genuine fit - a role that\'s a poor fit rarely converts even if the interview goes well.',
    });
    steps.push({
      title: `Build one documented win in your first 12 months toward "${finalPhrase}"`,
      description: 'The fastest route to your long-term goal is proving you can do the current job well first - not skipping ahead.',
      success_criteria: 'You have one specific, quantified accomplishment you could cite in a promotion or next-job conversation.',
      estimated_timeframe: '12 months',
      first_action: 'In your first week on the job: ask your manager directly what success looks like in 90 days, in their own words.',
      resource: 'Your manager\'s own stated priorities, gathered directly rather than assumed.',
      risk: 'Assuming you know what matters without confirming it - misaligned effort is invisible until review time.',
      if_it_works: `Use that documented win to explicitly ask for scope closer to "${finalPhrase}" in your next review cycle, rather than waiting to be offered it.`,
      if_it_stalls: 'If 6 months pass with no clear win to point to, that\'s a signal worth acting on directly - ask your manager for a harder or more visible project rather than continuing on the current track and hoping it improves.',
    });
  } else if(stage === 'switch'){
    steps.push({
      title: `Write a one-paragraph pitch translating your background into "${goalPhrase}" language`,
      description: 'Your existing experience is an asset, but only if it\'s described in terms your target field recognizes - not your old field\'s jargon.',
      success_criteria: 'You can say this pitch out loud in under 30 seconds without sounding rehearsed.',
      estimated_timeframe: '1 week',
      first_action: 'Today: write 3 bullet points translating your most relevant past work into your target field\'s terms.',
      resource: 'One person already working in your target field, willing to sanity-check your pitch for 15 minutes.',
      risk: 'Leading with your old title instead of your transferable substance - the title itself can work against you here.',
    });
    if(gapSkill){
      steps.push({
        title: `Close the ${gapSkill} credibility gap with one real project`,
        description: `This is a common requirement in listings matching "${goalPhrase}" that your current background doesn't yet demonstrate on paper.`,
        success_criteria: `You've completed one project, course, or task that used ${gapSkill} for real, not just watched a tutorial.`,
        estimated_timeframe: '4-8 weeks',
        first_action: `Today: find one real (not toy) problem you could solve using ${gapSkill} and start it this week.`,
        resource: `A real (not toy) problem from your current job or a public dataset that requires ${gapSkill} to solve.`,
        risk: 'Choosing a tutorial-style toy project - hiring managers can tell the difference between a real problem and a walkthrough.',
      });
    }
    steps.push({
      title: `Apply to roles bridging your old field and "${finalPhrase}"`,
      description: `${matchLine} A hybrid role is usually an easier first step than a pure jump - it lets your existing experience count for something.`,
      success_criteria: 'You have an offer, or serious interest, in a role touching both your old and new field.',
      estimated_timeframe: '2-4 months',
      first_action: matchFirstAction,
      resource: 'Your Job Search watch, filtered for roles tagged with both your old and new domain.',
      risk: 'Jumping straight for a pure new-field role before you have any bridge experience - the hybrid step de-risks the whole switch.',
      if_it_works: `Once you land the hybrid role, treat your first 6 months as evidence-gathering for the pure jump to "${finalPhrase}" - document what transferred and what you had to newly learn.`,
      if_it_stalls: 'If hybrid roles aren\'t responding either, that often means the pitch itself needs work before the target - go back and sharpen the specific project or credential from earlier in this plan before applying more broadly.',
    });
  } else {
    steps.push({
      title: `Turn "${finalPhrase}" into a specific, named target`,
      description: `Vague goals produce vague plans - name the actual title, team, or scope you're aiming at in ${locText}, not just a direction.`,
      success_criteria: 'You can describe your target role or outcome in one concrete sentence, with a real title attached.',
      estimated_timeframe: '1 week',
      first_action: 'Today: write down the exact job title or outcome you\'re aiming for - if you can\'t name one, that\'s the actual first problem to solve.',
      resource: 'Job postings for people already doing what you want to do, as a reference for real titles and scope.',
      risk: 'Staying vague on purpose to avoid commitment - a specific wrong target is easier to correct than no target at all.',
    });
    if(gapSkill){
      steps.push({
        title: `Build visible, provable strength in ${gapSkill}`,
        description: `This shows up often in opportunities matching "${goalPhrase}" - closing it makes your next move credible instead of aspirational.`,
        success_criteria: `You have one concrete, recent example of using ${gapSkill} you could cite today.`,
        estimated_timeframe: '3-6 weeks',
        first_action: `Today: identify one visible task at your current job or a side project where you could apply ${gapSkill} this month.`,
        resource: 'A visible task at your current job where this skill would genuinely help, rather than a side project nobody sees.',
        risk: 'Building the skill invisibly on the side - if nobody who controls your next move ever sees it, it doesn\'t count yet.',
      });
    }
    steps.push({
      title: 'Make your progress visible to the person who controls your next step',
      description: 'Take on work that makes the next move obvious to decision-makers, rather than waiting to be noticed.',
      success_criteria: 'Someone with real influence over your next step has proactively mentioned your progress, unprompted.',
      estimated_timeframe: '1-2 months',
      first_action: 'This week: identify exactly who decides your next move, and find one legitimate reason to update them on progress.',
      resource: 'A regular, low-key update channel (a monthly note, a standing 1:1) rather than one big pitch.',
      risk: 'Waiting for a single perfect moment to make your case - visibility built gradually is more credible than a sudden pitch.',
    });
    steps.push({
      title: `Make the ask for "${finalPhrase}"`,
      description: 'Apply, pitch, or negotiate the transition once the groundwork above is actually in place - not before.',
      success_criteria: 'You have formally made the ask to the person or process that controls the decision.',
      estimated_timeframe: '2-4 weeks',
      first_action: 'Once ready: schedule the actual conversation or submit the actual application - put a date on the calendar now, not "soon".',
      resource: 'A specific date on your calendar, treated as a real commitment.',
      risk: 'Letting "almost ready" become permanent - the groundwork steps above are meant to end, not continue indefinitely.',
      if_it_works: `Get the terms in writing quickly, and use this as the new baseline - "${finalPhrase}" becomes the floor for what you'll accept next, not the ceiling.`,
      if_it_stalls: 'A "no" here is information, not a dead end - ask specifically what would need to be true for a "yes" next time, then treat that answer as your next milestone rather than starting over from scratch.',
    });
  }

  const summary = `This plan moves from ${stage === 'student' ? 'building proof of your interest' : stage === 'grad' ? 'sharpening your existing story' : stage === 'switch' ? 'translating your background' : 'clarifying your target'} toward "${goalPhrase}" in roughly ${steps.length} stages. ${gapSkill ? `The biggest risk to the whole plan is skipping the ${gapSkill} gap - it shows up repeatedly in your real matches and closing it early makes every later stage easier.` : 'The biggest risk to the whole plan is moving to the next stage before the current one has a real, checkable result - momentum without evidence tends to stall.'}`;

  return {
    version: ROADMAP_VERSION,
    summary,
    milestones: steps.map((s, i) => ({...s, stage: i + 1, status: 'planned'})),
  };
}

/* ---- Athlete-specific roadmap, tailored to sporting career direction ---- */
function generateAthleteRoadmapLocal(athleteProfile, topMatch){
  const sport = athleteProfile.sport;
  const direction = athleteProfile.careerDirection;
  const level = athleteProfile.level;
  const steps = [];

  const matchLine = topMatch
    ? `Your current top match is "${topMatch.title}" at ${topMatch.org} (${topMatch.pct}% fit) - start there.`
    : `Run a scan on Opportunities first so this step can point at a real listing instead of a placeholder.`;
  const matchFirstAction = topMatch
    ? `Today: open "${topMatch.title}" at ${topMatch.org} and read the full listing - decide within 24 hours whether to apply.`
    : `Today: go to Opportunities and browse what's currently available.`;

  if(direction === 'play-college'){
    steps.push({
      title: `Build a recruiting highlight reel for ${sport}`,
      description: `Coaches decide in seconds whether to keep watching - your reel needs to open with your strongest, most representative plays in ${sport}, not a slow build-up.`,
      success_criteria: 'You have a 3-5 minute video you would actually send to a college coach today.',
      estimated_timeframe: '2-3 weeks',
      first_action: 'Today: pull your 5 best clips from recent games or practice footage and put them in one folder.',
      resource: 'Game or practice footage you already have, plus free editing tools (CapCut, iMovie).',
      risk: 'Waiting for a "perfect" highlight moment instead of using what you already have - a good-enough reel sent now beats a perfect one sent after the recruiting window closes.',
    });
    steps.push({
      title: `Apply to scholarship and recruiting opportunities matching ${level} level`,
      description: `${matchLine} Prioritize programs where your current level is a realistic fit - reaching too high across the board wastes limited outreach time.`,
      success_criteria: 'You have applied to or contacted at least 5 programs matching your level and sport.',
      estimated_timeframe: '1-3 months',
      first_action: matchFirstAction,
      resource: 'Your Opportunities page, filtered by athletic scholarships in your sport.',
      risk: 'Only targeting top-tier programs - a broader list of realistic-fit schools produces more real offers.',
    });
    steps.push({
      title: 'Get on a call with a coach at a realistic-fit program',
      description: 'A direct conversation does more than any application - coaches remember athletes who reach out specifically, not generically.',
      success_criteria: 'You have had at least one real conversation with a college coach about their program.',
      estimated_timeframe: '3-6 weeks',
      first_action: 'This week: email one coach directly, referencing something specific about their program and your fit.',
      resource: 'The coaching staff directory on the program\'s official athletics website.',
      risk: 'Sending the same generic email to every program - a specific, researched message gets responses; a form email gets ignored.',
      if_it_works: 'A good call is often followed by an invite to a camp or visit - treat that invite as the real recruiting event and prepare for it specifically, not casually.',
      if_it_stalls: 'No response after a genuine, specific outreach usually means the fit isn\'t there at that program, not that you did something wrong - move down your realistic-fit list rather than sending the same message again.',
    });
  } else if(direction === 'go-pro'){
    steps.push({
      title: `Get in front of scouts or agents in ${sport}`,
      description: 'Visibility to the people who make roster and signing decisions is the actual bottleneck at this stage, not raw performance alone.',
      success_criteria: 'You have made direct contact with at least one scout, agent, or team representative.',
      estimated_timeframe: '1-2 months',
      first_action: 'Today: identify one realistic contact (a local scout, a combine organizer, an agent) and research how to reach them.',
      resource: 'Combine or tryout events in your region, and public scouting/agent directories for your sport.',
      risk: 'Waiting to be discovered instead of actively reaching out - at this level, visibility is something you build, not something that happens to you.',
    });
    steps.push({
      title: `Compete at the highest available level for ${sport}`,
      description: `${matchLine} Every level up is itself a credential - semi-pro, regional, or open competitions all build a track record scouts can verify.`,
      success_criteria: 'You are registered or competing in the highest-level competition realistically available to you right now.',
      estimated_timeframe: 'Ongoing',
      first_action: matchFirstAction,
      resource: 'Your Opportunities page, filtered for competitive/professional-track listings in your sport.',
      risk: 'Staying at a comfortable level too long - progression requires deliberately seeking tougher competition.',
    });
    steps.push({
      title: 'Build a public record scouts can verify independently',
      description: 'Stats, video, and results that exist publicly are more credible than anything you say about yourself directly.',
      success_criteria: 'A scout could find verifiable performance data about you without asking you for it first.',
      estimated_timeframe: '2-3 months',
      first_action: 'This week: make sure your competition results and stats are documented somewhere public and findable.',
      resource: 'Your league or competition\'s official results/stats pages, plus your own athlete profile page if you have one.',
      risk: 'Relying only on word-of-mouth reputation - a public, verifiable record travels further than a reputation confined to your local circle.',
      if_it_works: 'Once scouts can verify you independently, direct outreach gets dramatically easier - lead with the record itself, not a pitch about your potential.',
      if_it_stalls: 'If interest still isn\'t coming despite a solid public record, the gap is usually visibility, not talent - go back to the earlier step of directly contacting scouts rather than waiting for the record to speak for itself.',
    });
  } else if(direction === 'coach'){
    steps.push({
      title: `Get certified or credentialed to coach ${sport}`,
      description: `Most coaching roles require a specific certification before they will even consider an application - this is the real first gate, not experience alone.`,
      success_criteria: 'You hold (or are actively completing) the certification most commonly required for coaching roles in your sport.',
      estimated_timeframe: '4-8 weeks',
      first_action: 'Today: search for the standard coaching certification for your sport and confirm the exact requirements.',
      resource: 'Your sport\'s national governing body website, which typically lists official certification programs.',
      risk: 'Assuming playing experience alone qualifies you - most programs specifically require the certification, not just a playing background.',
    });
    steps.push({
      title: `Apply to assistant or entry-level coaching roles matching ${level}`,
      description: `${matchLine} An assistant role is the realistic entry point almost everywhere - it builds the track record head roles require.`,
      success_criteria: 'You have applied to at least 5 coaching roles at your current credential level.',
      estimated_timeframe: '1-3 months',
      first_action: matchFirstAction,
      resource: 'Your Opportunities page, filtered for coaching roles in your sport.',
      risk: 'Only applying to head-coach roles before building any staff experience - assistant roles are not a step down, they\'re the standard entry point.',
    });
    steps.push({
      title: 'Build a specific coaching philosophy you can articulate',
      description: 'Programs hire coaches who can clearly explain their approach, not just list credentials - this is usually the actual interview differentiator.',
      success_criteria: 'You can explain your coaching philosophy in 2-3 concrete sentences, with a specific example.',
      estimated_timeframe: '2 weeks',
      first_action: `Today: write down the one coaching principle you would build a program around, with a real example from your own experience.`,
      resource: 'A coach or mentor you respect, as a sounding board for articulating your approach.',
      risk: 'Relying on generic coaching cliches in interviews - specificity is what actually separates candidates.',
      if_it_works: 'A clear, specific philosophy tends to lead to more interviews than credentials alone - lead with it early in applications, not just when asked.',
      if_it_stalls: 'If interviews aren\'t materializing despite certification and a clear philosophy, the gap may be visibility, not qualification - reach out directly to programs rather than relying on job postings alone.',
    });
  } else {
    steps.push({
      title: `Identify the specific sports-management role you're targeting`,
      description: `"Sports management" covers very different jobs - operations, athletic training, sports medicine, program coordination. Naming the specific track focuses everything after this.`,
      success_criteria: 'You can name the exact job title and type of organization you\'re targeting.',
      estimated_timeframe: '1 week',
      first_action: 'Today: look at 5 real job postings in sports management and note which specific track appeals most.',
      resource: 'Your Opportunities page, browsed broadly across sports management/administration listings.',
      risk: 'Staying vague about "something in sports" - a named target is what actually focuses your applications.',
    });
    steps.push({
      title: `Apply to entry-level sports management roles matching ${level}`,
      description: `${matchLine} Athletic departments and sports organizations often hire from within - an entry-level operations or coordination role is a realistic first step.`,
      success_criteria: 'You have applied to at least 5 roles in your identified track.',
      estimated_timeframe: '1-3 months',
      first_action: matchFirstAction,
      resource: 'Your Opportunities page, filtered for sports management and operations roles.',
      risk: 'Applying broadly across every sports-adjacent posting instead of your specific identified track - focus produces stronger applications.',
    });
    steps.push({
      title: 'Build direct experience through a real athletic department or organization',
      description: 'Even part-time or volunteer experience inside a real athletic operation is worth more on paper than related-but-outside experience.',
      success_criteria: 'You have real, even if informal, experience inside an athletic department or sports organization.',
      estimated_timeframe: '2-3 months',
      first_action: 'This week: contact one local athletic department or sports organization about part-time or volunteer opportunities.',
      resource: 'Local high school, college, or club athletic departments - often more accessible than professional organizations for a first step.',
      risk: 'Waiting for a paid role before getting any real experience - unpaid or part-time experience inside the industry is a legitimate, common path in.',
      if_it_works: 'Once you have real experience inside an athletic operation, apply to paid entry-level roles immediately - don\'t stay in an unpaid arrangement longer than it takes to build a real reference and story.',
      if_it_stalls: 'If no department responds to a direct approach, broaden past your first-choice level (high school instead of college, club instead of varsity) - the goal at this stage is real experience, not a prestigious first stop.',
    });
  }

  const directionLabel = {'play-college': 'playing at the college level', 'go-pro': 'going pro', 'coach': 'coaching', 'sports-management': 'a sports management career'}[direction] || 'your athletic career goal';
  const summary = `This plan moves from where you are now toward ${directionLabel} in ${sport}, in ${steps.length} stages. The biggest risk to the whole plan is treating visibility and credentials as things that happen automatically - at every stage, the actual bottleneck is usually direct outreach or a specific credential, not raw ability alone.`;

  return {
    version: ROADMAP_VERSION,
    summary,
    milestones: steps.map((s, i) => ({...s, stage: i + 1, status: 'planned'})),
  };
}

/* ---- Metis floating widget (shared include, used on every logged-in page) ---- */
function injectMetisWidget(systemContextFn, opts){
  opts = opts || {};
  const subtitle = opts.subtitle || 'Your AI career guide';
  const greeting = opts.greeting || "Hi - I can help with internships, applications, resumes, or your current matches. What's on your mind?";
  const suggestions = opts.suggestions || [
    { label: 'Cold outreach tips', q: 'What should I put in a cold outreach email?' },
    { label: 'Prioritize my matches', q: 'Which of my current matches should I prioritize?' },
  ];
  const container = document.createElement('div');
  container.innerHTML = `
    <button class="chat-launcher" id="chatLauncher" aria-label="Open Metis">${metisMark(28)}<span class="badge-dot"></span></button>
    <div class="chat-window" id="chatWindow">
      <div class="chat-header">
        <div><div class="chat-header-title"><span class="mark">${metisMark(22,'#F0B24E')}</span>Metis</div><div class="sub">${subtitle}</div></div>
        <button class="chat-close" id="chatClose" aria-label="Close chat">&times;</button>
      </div>
      <div class="chat-messages" id="chatMessages">
        <div class="chat-msg assistant"><span class="chat-msg-label">Metis</span><div class="chat-bubble">${greeting}</div></div>
      </div>
      <div class="chat-suggestions" id="chatSuggestions">
        ${suggestions.map(s => `<button class="chat-suggestion" data-q="${s.q.replace(/"/g,'&quot;')}">${s.label}</button>`).join('')}
      </div>
      <div class="chat-input-row">
        <textarea id="chatInput" placeholder="Ask Metis anything..." rows="1"></textarea>
        <button class="chat-send" id="chatSend" aria-label="Send">&#10148;</button>
      </div>
    </div>`;
  document.body.appendChild(container);

  const chatLauncher = document.getElementById('chatLauncher');
  const chatWindow = document.getElementById('chatWindow');
  const chatClose = document.getElementById('chatClose');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  let chatHistory = getChatHistory();
  let open = false;

  chatLauncher.addEventListener('click', ()=>{ open = !open; chatWindow.classList.toggle('open', open); if(open) chatInput.focus(); });
  chatClose.addEventListener('click', ()=>{ open = false; chatWindow.classList.remove('open'); });
  chatInput.addEventListener('input', ()=>{ chatInput.style.height='auto'; chatInput.style.height = Math.min(100, chatInput.scrollHeight)+'px'; });
  chatInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); handleSend(); } });
  chatSend.addEventListener('click', handleSend);
  document.querySelectorAll('.chat-suggestion').forEach(btn=> btn.addEventListener('click', ()=>{ chatInput.value = btn.dataset.q; handleSend(); }));

  function escapeHtml(str){ const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }
  function renderMarkdownLite(text){
    const escaped = escapeHtml(text);
    const lines = escaped.split('\n');
    let html = '', inList = false;
    lines.forEach(line=>{
      const trimmed = line.trim();
      if(/^[-*]\s+/.test(trimmed)){ if(!inList){ html += '<ul>'; inList = true; } html += `<li>${trimmed.replace(/^[-*]\s+/, '')}</li>`; }
      else { if(inList){ html += '</ul>'; inList = false; } if(trimmed.length) html += `<p>${trimmed}</p>`; }
    });
    if(inList) html += '</ul>';
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    return html || '<p></p>';
  }
  function appendMessage(role, text){
    const wrap = document.createElement('div');
    wrap.className = 'chat-msg ' + role;
    wrap.innerHTML = `<span class="chat-msg-label">${role==='user' ? 'You' : 'Metis'}</span><div class="chat-bubble">${renderMarkdownLite(text)}</div>`;
    chatMessages.appendChild(wrap); chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function appendTyping(){
    const wrap = document.createElement('div'); wrap.className = 'chat-msg assistant'; wrap.id = 'typingIndicator';
    wrap.innerHTML = `<span class="chat-msg-label">Metis</span><div class="chat-bubble chat-typing"><span></span><span></span><span></span></div>`;
    chatMessages.appendChild(wrap); chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function removeTyping(){ const el = document.getElementById('typingIndicator'); if(el) el.remove(); }

  async function handleSend(){
    const text = chatInput.value.trim();
    if(!text) return;
    chatInput.value = ''; chatInput.style.height = 'auto'; chatSend.disabled = true;
    appendMessage('user', text);
    chatHistory.push({role:'user', content: text});
    appendTyping();
    try{
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system: systemContextFn(), messages: chatHistory })
      });
      const data = await response.json();
      removeTyping();
      const reply = (data.content || []).map(b=> b.type==='text' ? b.text : '').filter(Boolean).join('\n');
      if(!reply){ throw new Error('Empty response'); }
      appendMessage('assistant', reply);
      chatHistory.push({role:'assistant', content: reply});
      saveChatHistory(chatHistory);
    } catch(err){
      removeTyping();
      appendMessage('assistant', "Something went wrong reaching Metis just now - mind trying again?");
      console.error('Chat error:', err);
    } finally { chatSend.disabled = false; }
  }
}
