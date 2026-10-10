// ---------- Data (placeholder — swap in your real projects) ----------
const PROJECTS = [
  {
    name: 'Live Sports Feed', kind: 'Real-time backend', year: '2026',
    desc: 'Live football scores and commentary pushed over WebSockets, with Redis pub/sub fanning events across server instances. Load-tested with k6 to 10,000 concurrent subscribers on one match (p99 700 ms), plus batched Discord goal alerts with AES-256-GCM-encrypted webhooks.',
    tags: ['Node.js', 'Express', 'WebSockets', 'PostgreSQL', 'Redis', 'Drizzle', 'Docker', 'k6'],
    link: 'https://github.com/JackNguyen-cmyk/Sports-dashboard-web-socket-project-',
    colors: ['#065f46', '#34d399'], glyph: "GOAL · 67'",
  },
  {
    name: 'Mavuno', kind: 'Hack4Impact · Nonprofit', year: '2026',
    desc: 'A platform for farmers run by a nonprofit partner. I built phone-and-password sign-up without paid SMS, an approval-based profile schema enforced with Postgres row-level security, and staff endpoints to approve or reject farmers safely under concurrent review.',
    tags: ['TypeScript', 'Express', 'Supabase', 'Postgres RLS', 'Zod', 'Vitest'],
    link: null, privateNote: "Mavuno's code is private to the nonprofit — happy to walk through it",
    colors: ['#78350f', '#f59e0b'], glyph: 'welcome, farmer',
  },
  {
    name: 'Workout Logger API', kind: 'Backend', year: '2026',
    desc: 'A REST API for logging gym sessions set by set, tracking volume and progressive overload, and serving training analytics. JWT auth with every route scoped to the user, Redis-backed rate limiting, and a cached dashboard that invalidates when a workout finishes.',
    tags: ['TypeScript', 'Bun', 'Elysia', 'Drizzle', 'MySQL', 'Redis'],
    link: null, privateNote: 'Repo is private for now — ask me for a walkthrough',
    colors: ['#7f1d1d', '#f87171'], glyph: 'PR · 100kg × 5',
  },
  {
    name: 'HVTP Inventory', kind: 'Hack4Impact · Nonprofit', year: '2026',
    desc: 'An inventory app for a nonprofit warehouse. I turned Figma designs into mobile-friendly admin forms so staff can log stock from their phones, built reusable React search and filter components, and added per-warehouse location tracking.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Express', 'Figma'],
    link: 'https://github.com/cornellh4i/HVTP',
    colors: ['#1e3a8a', '#60a5fa'], glyph: 'in stock',
  },
  {
    name: 'Habit Tracker', kind: 'Web app', year: '2026',
    desc: 'A dependency-free daily tracker for calories, training and LeetCode, with GitHub-style streak heatmaps, tasks that understand "every weekday at 8am" or "next fri", repeating tasks, and due-time reminders.',
    tags: ['JavaScript', 'HTML', 'CSS', 'localStorage'],
    link: null, privateNote: 'Repo is private for now — ask me for a demo',
    colors: ['#14532d', '#a3e635'], glyph: 'day 42 🔥',
  },
  {
    name: 'Internship Copilot', kind: 'Desktop app · WIP', year: '2026',
    desc: 'A local-first workspace for my own internship search: a searchable job feed, application tracker and profile editor backed by SQLite with stale-write protection and an audit trail. A Tauri desktop shell is in progress.',
    tags: ['React', 'TypeScript', 'SQLite', 'Tauri', 'Vitest'],
    link: null, privateNote: 'Still in progress — repo is private for now',
    colors: ['#3b4cca', '#9b5de5'], glyph: 'apply smarter',
  },
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// ---------- Toast ----------
const toast = $('#toast');
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

// ---------- Theme ----------
$('#themeToggle').addEventListener('click', () => {
  const root = document.documentElement;
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// ---------- Nav: scrolled state + active link ----------
const nav = $('#nav');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 20);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

const navLinks = $$('#navLinks a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      navLinks.forEach((a) => a.classList.toggle('active', a.dataset.section === e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach((s) => sectionObserver.observe(s));

// ---------- Mobile menu ----------
const menuBtn = $('#menuBtn');
const mobileMenu = $('#mobileMenu');
function setMenu(open) {
  menuBtn.setAttribute('aria-expanded', open);
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
}
menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
$$('a', mobileMenu).forEach((a) => a.addEventListener('click', () => setMenu(false)));

// ---------- Reveal on scroll ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  revealObserver.observe(el);
});

// ---------- Hero word rotator ----------
const words = ['reliable', 'real-time', 'useful', 'tested', 'fast'];
let wi = 0;
const rot = $('#rotator');
setInterval(() => {
  rot.classList.add('out');
  setTimeout(() => {
    wi = (wi + 1) % words.length;
    rot.textContent = words[wi];
    rot.classList.remove('out');
    rot.classList.add('pre');
    void rot.offsetWidth; // restart transition
    rot.classList.remove('pre');
  }, 350);
}, 2600);

// ---------- Live clock (Ithaca time) ----------
const clock = $('#clock');
const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
const tick = () => { clock.textContent = fmt.format(new Date()); };
tick();
setInterval(tick, 1000);

// ---------- Avatar eyes follow cursor ----------
const avatar = $('#avatar');
const pupils = $$('.pupil', avatar);
addEventListener('pointermove', (e) => {
  pupils.forEach((p) => {
    const r = p.parentElement.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const a = Math.atan2(dy, dx);
    const d = Math.min(12, Math.hypot(dx, dy) / 20);
    p.style.transform = `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px)`;
  });
}, { passive: true });
avatar.parentElement.addEventListener('pointerenter', () => avatar.classList.add('happy'));
avatar.parentElement.addEventListener('pointerleave', () => avatar.classList.remove('happy'));

// ---------- Terminal typing ----------
const termBody = $('#termBody');
const SCRIPT = [
  { cmd: 'whoami', out: '<span class="k">jack nguyen</span> — cs @ cornell \'28, backend-leaning full-stack dev' },
  { cmd: 'cat now.txt', out: '→ building auth + approvals for Mavuno @ Hack4Impact\n→ TA-ing CS 1110 (intro to python)\n→ looking for summer 2027 SWE internships' },
  { cmd: 'k6 run live-feed.js', out: '<span class="d">✓ 10,000 concurrent subscribers · p99 700 ms · 0 dropped</span>' },
];
let termStarted = false;
async function runTerminal() {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let html = '';
  const caret = '<span class="caret"></span>';
  for (const step of SCRIPT) {
    html += '<span class="p">$</span> ';
    for (const ch of step.cmd) {
      html += ch;
      termBody.innerHTML = html + caret;
      await sleep(70 + Math.random() * 60);
    }
    await sleep(300);
    html += '\n' + step.out + '\n\n';
    termBody.innerHTML = html + caret;
    await sleep(700);
  }
  termBody.innerHTML = html + '<span class="p">$</span> ' + caret;
}
new IntersectionObserver((entries, obs) => {
  if (entries[0].isIntersecting && !termStarted) { termStarted = true; obs.disconnect(); runTerminal(); }
}, { threshold: 0.5 }).observe($('#terminal'));

// ---------- Projects: list + preview ----------
const list = $('#projectList');
const dots = $('#dots');
const preview = $('#preview');
let current = 0;

list.innerHTML = PROJECTS.map((p, i) => `
  <li><button role="tab" data-i="${i}" aria-selected="false">
    <span class="num">${String(i + 1).padStart(2, '0')}</span>
    <span class="name">${p.name}</span>
    <span class="kind">${p.kind}</span>
  </button></li>`).join('');
dots.innerHTML = PROJECTS.map((_, i) => `<button data-i="${i}" aria-label="Go to project ${i + 1}"></button>`).join('');

function mockShot(p) {
  return `<div class="mock" style="background:linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})">
    <div class="mock-bar"><i></i><i></i><i></i><b></b></div>
    <div class="mock-body">
      <div class="mock-hero"><span class="glyph">${p.glyph}</span><b style="width:40%"></b><b></b></div>
      <div class="mock-card"></div><div class="mock-card"></div><div class="mock-card"></div>
    </div>
  </div>`;
}

function render(i, animate = true) {
  current = (i + PROJECTS.length) % PROJECTS.length;
  const p = PROJECTS[current];
  const apply = () => {
    $('#previewShot').innerHTML = mockShot(p);
    $('#pvTitle').textContent = p.name;
    $('#pvYear').textContent = p.year;
    $('#pvDesc').textContent = p.desc;
    $('#pvTags').innerHTML = p.tags.map((t) => `<li>${t}</li>`).join('');
    $('#pvLink').href = p.link || '#';
    $('#pvLink').innerHTML = p.link ? 'View on GitHub <span>↗</span>' : 'Private repo <span>🔒</span>';
    preview.classList.remove('switching');
  };
  $$('button', list).forEach((b, j) => b.setAttribute('aria-selected', j === current));
  $$('button', dots).forEach((b, j) => b.classList.toggle('on', j === current));
  $('#counter').textContent = `${String(current + 1).padStart(2, '0')} / ${String(PROJECTS.length).padStart(2, '0')}`;
  if (animate) { preview.classList.add('switching'); setTimeout(apply, 220); } else apply();
}

list.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) render(+b.dataset.i); });
dots.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) render(+b.dataset.i); });
$('#prevBtn').addEventListener('click', () => render(current - 1));
$('#nextBtn').addEventListener('click', () => render(current + 1));
$('#pvLink').addEventListener('click', (e) => {
  const p = PROJECTS[current];
  if (!p.link) { e.preventDefault(); showToast(p.privateNote); }
});

// Arrow keys when the work section is on screen
let workVisible = false;
new IntersectionObserver((en) => { workVisible = en[0].isIntersecting; }, { threshold: 0.3 }).observe($('#work'));
addEventListener('keydown', (e) => {
  if (!workVisible || e.target.closest('input, textarea')) return;
  if (e.key === 'ArrowRight') render(current + 1);
  if (e.key === 'ArrowLeft') render(current - 1);
});

// Swipe on the preview
let startX = null;
preview.addEventListener('pointerdown', (e) => { startX = e.clientX; });
preview.addEventListener('pointerup', (e) => {
  if (startX === null) return;
  const dx = e.clientX - startX;
  if (Math.abs(dx) > 50) render(current + (dx < 0 ? 1 : -1));
  startX = null;
});

render(0, false);

// ---------- Copy email ----------
$$('[data-copy-email]').forEach((btn) => btn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('hn365@cornell.edu');
    showToast('Email copied to clipboard ✓');
  } catch {
    location.href = 'mailto:hn365@cornell.edu';
  }
}));

// ---------- Contact form (front-end only) ----------
$('#contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  let ok = true;
  $$('input, textarea', form).forEach((f) => {
    const valid = f.value.trim() && (f.type !== 'email' || /^\S+@\S+\.\S+$/.test(f.value));
    f.closest('.field').classList.toggle('error', !valid);
    if (!valid) ok = false;
  });
  if (!ok) { showToast('Please fill in every field'); return; }
  form.reset();
  showToast("Thanks! I'll get back to you soon.");
});

$$('#contactForm input, #contactForm textarea').forEach((f) =>
  f.addEventListener('input', () => f.closest('.field').classList.remove('error')));

$('#year').textContent = new Date().getFullYear();
