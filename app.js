/* ================= Utilities ================= */
const $ = (sel, parent=document) => parent.querySelector(sel);
const $$ = (sel, parent=document) => Array.from(parent.querySelectorAll(sel));

/* ================= Mobile Menu ================= */
const hamb = $('#hamb');
const nav = $('#navMenu');
if (hamb && nav) {
  hamb.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hamb.setAttribute('aria-expanded', String(open));
  });
  // Close on link click (mobile)
  $$('#navMenu a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); hamb.setAttribute('aria-expanded', 'false');
  }));
}

/* ================= Theme Toggle ================= */
const THEME_KEY = 'pref-theme';
const body = document.body;
const themeToggle = $('#themeToggle');
function setTheme(mode) {
  body.classList.remove('theme-dark','theme-light');
  body.classList.add(mode);
  localStorage.setItem(THEME_KEY, mode);
}
(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) setTheme(saved);
  else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'theme-dark' : 'theme-light');
  }
})();
themeToggle?.addEventListener('click', () => {
  const next = body.classList.contains('theme-dark') ? 'theme-light' : 'theme-dark';
  setTheme(next);
});

/* ================= Smooth reveal on scroll ================= */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });
$$('.section .card, .project-card, .post, .timeline li').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

/* ================= Filters (Projects) ================= */
const grid = $('#projectGrid');
const filterButtons = $$('#filters .chip');
filterButtons.forEach(btn => btn.addEventListener('click', () => {
  filterButtons.forEach(b => b.classList.remove('is-active'));
  btn.classList.add('is-active');
  const cat = btn.dataset.filter;
  $$('.project-card', grid).forEach(card => {
    const show = cat === 'all' || card.dataset.cat === cat;
    card.style.display = show ? '' : 'none';
  });
}));

/* ================= Contact Form (client-side) ================= */
const form = $('#contactForm');
const formMsg = $('#formMsg');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = data.get('name')?.toString().trim();
  const email = data.get('email')?.toString().trim();
  const message = data.get('message')?.toString().trim();
  if (!name || !email || !message) {
    formMsg.textContent = 'Please fill all fields.';
    return;
  }
  // Simulate success (replace with fetch to your backend or Formspree)
  formMsg.textContent = 'Sending...';
  setTimeout(() => {
    formMsg.textContent = '✅ Message sent successfully (demo).';
    form.reset();
  }, 700);
});

/* ================= Back to Top + Year ================= */
$('#year').textContent = new Date().getFullYear();
const backToTop = $('#backToTop');
window.addEventListener('scroll', () => {
  backToTop.style.opacity = window.scrollY > 500 ? '1' : '0.3';
});

/* ================= Background Particles (canvas) ================= */
const canvas = $('#bgParticles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;
  let w, h, particles;
  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * DPR; canvas.height = h * DPR; ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  function init() {
    resize();
    particles = Array.from({length: 48}, () => ({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4,
      r: Math.random()*2 + 0.5, a: Math.random()*0.6 + 0.2
    }));
  }
  function tick() {
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(124,58,237,0.18)';
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.globalAlpha = p.a;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  window.addEventListener('resize', resize);
  init(); tick();
}
