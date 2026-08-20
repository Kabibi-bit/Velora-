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
  } else {
    links = [
      {id: 'survey', label: 'Survey', href: 'survey.html'},
      {id: 'dashboard', label: 'Job Search', href: 'dashboard.html'},
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
function getRoadmap(){ try{ return JSON.parse(localStorage.getItem('velora_roadmap')); }catch(e){ return null; } }
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
  {id:25, type:'athletic', title:'Women\\'s Rowing Athletic Scholarship', org:'Marrow College Athletics', tags:['athletics','rowing','leadership','scholarship'], loc:'Boston, MA', deadline:'Sep 30'},
  {id:26, type:'athletic', title:'Track & Field Partial Scholarship', org:'Whitfield University', tags:['athletics','track','training','scholarship'], loc:'Remote', deadline:'Oct 5'},
  {id:27, type:'athletic', title:'Student-Athlete Leadership Grant', org:'Bold Futures Fund', tags:['athletics','leadership','grant','mentorship'], loc:'Remote', deadline:'Sep 28'},
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
function buildRationale(listing, m, profile){
  const goalPhrase = (profile.northstar.split(/[.,;]/)[0] || 'your goal').toLowerCase();
  if(m.matchedGoal.length){
    return `Lines up with <b>${goalPhrase}</b> - overlaps on ${m.matchedGoal.slice(0,2).join(' and ')}${m.matchedSkill.length? ', and draws on your background in '+m.matchedSkill.slice(0,2).join(', ')+'.' : ', a credible step toward that.'}`;
  } else if(m.matchedSkill.length){
    return `Skills match on <b>${m.matchedSkill.slice(0,2).join(', ')}</b> - a reasonable stepping stone even if it's not a direct line to "${goalPhrase}".`;
  }
  return `Looser fit - worth a glance while broadening this cycle's search.`;
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
 
/* ---- Roadmap generation (client-side heuristic mirroring the backend's design) ---- */
function generateRoadmapLocal(profile){
  const stage = profile.stage;
  const steps = [];
  if(stage === 'student'){
    steps.push({title: 'Build a portfolio project', description: `Ship one concrete project tied to "${profile.northstar.split(/[.,;]/)[0]}" - proof of interest matters more than a perfect resume at this stage.`});
    steps.push({title: 'Land a relevant internship', description: 'Use the Job Search watch to find internships matching your stated skills and goal.'});
    steps.push({title: 'Convert experience into a full-time offer', description: 'Target APM/new-grad style programs at companies similar to where you interned.'});
  } else if(stage === 'grad'){
    steps.push({title: 'Sharpen your resume around your strongest wins', description: 'Lead with outcomes, not responsibilities.'});
    steps.push({title: 'Target entry-level roles matching your goal', description: 'Prioritize roles the watch scores highly on goal-fit, not just skill-fit.'});
    steps.push({title: 'Build a track record in your first 12 months', description: 'The fastest path to your long-term goal is proving you can do the current job well first.'});
  } else if(stage === 'switch'){
    steps.push({title: 'Identify transferable skills', description: 'Map what you already know onto the language of your target field.'});
    steps.push({title: 'Close the credibility gap', description: 'A short project, certificate, or internship that proves you can operate in the new domain.'});
    steps.push({title: 'Make the switch through an adjacent role', description: 'A hybrid role bridging your old and new field is usually an easier first step than a pure jump.'});
  } else {
    steps.push({title: 'Clarify what "next" actually means', description: `Get specific about what "${profile.finalidea.split(/[.,;]/)[0]}" looks like in practice.`});
    steps.push({title: 'Build visibility internally or externally', description: 'Take on work that makes the next step obvious to decision-makers.'});
    steps.push({title: 'Make the move', description: 'Apply, pitch, or negotiate the transition once the groundwork is in place.'});
  }
  return steps.map((s, i) => ({...s, stage: i + 1}));
}
 
/* ---- Metis floating widget (shared include, used on every logged-in page) ---- */
function injectMetisWidget(systemContextFn){
  const container = document.createElement('div');
  container.innerHTML = `
    <button class="chat-launcher" id="chatLauncher" aria-label="Open Metis">${metisMark(28)}<span class="badge-dot"></span></button>
    <div class="chat-window" id="chatWindow">
      <div class="chat-header">
        <div><div class="chat-header-title"><span class="mark">${metisMark(22,'#F0B24E')}</span>Metis</div><div class="sub">Your AI career guide</div></div>
        <button class="chat-close" id="chatClose" aria-label="Close chat">×</button>
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
 
