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
    links = [{id: 'business', label: 'Candidate Search', href: 'business-dashboard.html'}];
  } else if(role === 'tutor'){
    links = [{id: 'tutor', label: 'Tutor Dashboard', href: 'tutor-dashboard.html'}];
  } else if(role === 'athlete'){
    links = [
      {id: 'athlete-survey', label: 'Survey', href: 'athlete-survey.html'},
      {id: 'athlete', label: 'Opportunities', href: 'athlete-dashboard.html'},
    ];
  } else {
    links = [
      {id: 'survey', label: 'Survey', href: 'survey.html'},
      {id: 'dashboard', label: 'Job Search', href: 'dashboard.html'},
      {id: 'roadmap', label: 'Roadmap', href: 'roadmap.html'},
      {id: 'workshop', label: 'Workshop', href: 'workshop.html'},
      {id: 'auto', label: 'Auto', href: 'auto.html'},
      {id: 'explore', label: 'Explore', href: 'explore.html'},
      {id: 'inbox', label: 'Inbox', href: 'inbox.html'},
    ];
  }
  const linksHtml = links.map(l => `<a class="nav-link ${l.id===activePage?'active':''}" href="${l.href}">${l.label}</a>`).join('')
    + `<a class="nav-link" href="index.html">Switch role</a>`;
  const watchActive = localStorage.getItem('velora_watch_active') === 'true';
  const root = document.getElementById('nav-root');
  if(!root) return;
  root.innerHTML = `
    <nav class="nav">
      <div class="wrap nav-inner">
        <a class="logo" href="index.html">${veloraMark(32)}<span class="logo-word">VELORA</span></a>
        <div class="nav-links">${linksHtml}</div>
        <div class="nav-status"><span class="dot ${watchActive?'live':''}"></span>Watch ${watchActive ? 'active' : 'idle'}</div>
      </div>
    </nav>`;
}
 
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
function getOutcomes(){ try{ return JSON.parse(localStorage.getItem('velora_outcomes')) || []; }catch(e){ return []; } }
function saveOutcomes(o){ localStorage.setItem('velora_outcomes', JSON.stringify(o)); }
 
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
  const prompt = `Someone doesn't know what career direction to pursue. Here's what they told us:\nWorking directly with people: ${answers.people}/3. Working with data and analysis: ${answers.data}/3. Creative, open-ended work: ${answers.creative}/3. Structured, process-driven work: ${answers.structure}/3.\nIn their own words, what they find themselves drawn to without anyone asking: "${answers.freeText}"\n\nGenerate 3-4 specific career directions worth them considering. Do NOT default to generic broad categories like "marketing" or "healthcare" unless their answer genuinely points there - reason from the SPECIFIC things they described, and name directions as specific as what they gave you deserves. If their free-text answer is rich and specific, your directions should be too, not generic buckets.\n\nFor each direction, return an object with exactly these four keys:\n- title: a specific, real direction (not a vague category)\n- description: 1-2 sentences on what someone in this direction actually spends their time doing, concretely\n- why_fits: 1-2 sentences connecting THIS specific person's stated answers (quote or reference their actual words) to why this direction fits them specifically, not generically\n- first_step: one concrete, low-commitment thing they could do this week to test whether it actually fits - not "research the field", something specific and doable\n\nReturn ONLY valid JSON, an array of 3-4 such objects, nothing else, no markdown fences, no commentary.`;
  try{
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 900, messages: [{role:"user", content: prompt}] })
    });
    const data = await response.json();
    let text = (data.content || []).map(b => b.type==='text'?b.text:'').filter(Boolean).join('\n');
    text = text.trim().replace(/^```json/,'').replace(/^```/,'').replace(/```$/,'').trim();
    const parsed = JSON.parse(text);
    const freeTextTokens = tokenize(answers.freeText || '');
    return parsed.map((d, i) => {
      const dTokens = tokenize(d.title + ' ' + d.description);
      const allTokens = [...new Set([...dTokens, ...freeTextTokens])];
      const relatedListings = LISTINGS.filter(l => l.tags.some(t => allTokens.some(tok => t.includes(tok) || tok.includes(t))));
      return { ...d, id: 'ai-' + i, relatedCount: relatedListings.length };
    });
  } catch(err){
    console.error('AI career direction generation failed, falling back to offline matching:', err);
    return null;
  }
}
 
async function explainCareerDirectionDeep(direction, answers){
  const prompt = `Someone doesn't yet know what career direction to pursue. They described what energizes them: people-facing work rated ${answers.people}/3, data/analytical work rated ${answers.data}/3, creative work rated ${answers.creative}/3, structured/process work rated ${answers.structure}/3. They also said, in their own words: "${answers.freeText}".\n\nA suggested direction: "${direction.title}" - ${direction.description}\n\nWrite a genuine, specific 3-4 sentence case for why this direction could fit THEM based on what they described - reference their actual words where relevant. Then give one concrete, low-commitment first step they could take this week to test whether it actually fits (not "research the field" - something specific and doable). Be honest if the fit seems only partial.`;
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
function injectMetisWidget(systemContextFn){
  const container = document.createElement('div');
  container.innerHTML = `
    <button class="chat-launcher" id="chatLauncher" aria-label="Open Metis">${metisMark(28)}<span class="badge-dot"></span></button>
    <div class="chat-window" id="chatWindow">
      <div class="chat-header">
        <div><div class="chat-header-title"><span class="mark">${metisMark(22,'#F0B24E')}</span>Metis</div><div class="sub">Your AI career guide</div></div>
        <button class="chat-close" id="chatClose" aria-label="Close chat">&times;</button>
      </div>
      <div class="chat-messages" id="chatMessages">
        <div class="chat-msg assistant"><span class="chat-msg-label">Metis</span><div class="chat-bubble">Hi - I can help with internships, applications, resumes, or your current matches. What's on your mind?</div></div>
      </div>
      <div class="chat-suggestions" id="chatSuggestions">
        <button class="chat-suggestion" data-q="What should I put in a cold outreach email?">Cold outreach tips</button>
        <button class="chat-suggestion" data-q="Which of my current matches should I prioritize?">Prioritize my matches</button>
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
