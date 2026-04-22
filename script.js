/* =============================================
   SURPRISE WEBSITE - SCRIPT.JS
   ============================================= */

// =============================================
// ✏️  EDIT TANGGAL JADIAN DI SINI
// Format: new Date('YYYY-MM-DD')
// =============================================
const START_DATE = new Date('2026-02-017');

// =============================================
// SPLASH SCREEN
// =============================================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash').classList.add('hidden');
    startPetals();
  }, 2200);
});

// =============================================
// PETAL RAIN (canvas)
// =============================================
function startPetals() {
  const canvas = document.getElementById('petals');
  const ctx    = canvas.getContext('2d');
  let W, H;
  const petals = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PETAL_COLORS = [
    'rgba(200,66,90,',
    'rgba(232,113,138,',
    'rgba(212,165,90,',
    'rgba(255,180,190,',
  ];

  class Petal {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x   = Math.random() * W;
      this.y   = init ? Math.random() * H : -30;
      this.r   = Math.random() * 8 + 4;
      this.rot = Math.random() * Math.PI * 2;
      this.vx  = (Math.random() - 0.5) * 1.2;
      this.vy  = Math.random() * 1.2 + 0.6;
      this.vr  = (Math.random() - 0.5) * 0.04;
      this.color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      this.alpha = Math.random() * 0.5 + 0.3;
    }
    update() {
      this.x   += this.vx + Math.sin(Date.now() * 0.001 + this.y * 0.01) * 0.4;
      this.y   += this.vy;
      this.rot += this.vr;
      if (this.y > H + 30) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      // heart-ish petal shape
      const s = this.r;
      ctx.moveTo(0, -s * 0.5);
      ctx.bezierCurveTo( s,  -s,   s * 1.5,  s * 0.5,  0,  s);
      ctx.bezierCurveTo(-s * 1.5,  s * 0.5, -s, -s,    0, -s * 0.5);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 55; i++) petals.push(new Petal());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}

// =============================================
// SCROLL TO LETTER
// =============================================
document.getElementById('btnScroll').addEventListener('click', () => {
  document.getElementById('letterSection').scrollIntoView({ behavior: 'smooth' });
});

// =============================================
// ENVELOPE OPEN → LETTER REVEAL
// =============================================
const envelope   = document.getElementById('envelope');
const letterPaper = document.getElementById('letterPaper');
let letterOpened = false;

// Set today's date on the letter
const months = ['Januari','Februari','Maret','April','Mei','Juni',
                 'Juli','Agustus','September','Oktober','November','Desember'];
const now = new Date();
document.getElementById('letterDate').textContent =
  `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

envelope.addEventListener('click', () => {
  if (letterOpened) return;
  letterOpened = true;

  envelope.classList.add('open');
  setTimeout(() => {
    envelope.style.opacity = '0';
    envelope.style.transform = 'translateY(-20px) scale(0.9)';
    envelope.style.transition = 'all 0.5s ease';
  }, 700);
  setTimeout(() => {
    envelope.style.display = 'none';
    letterPaper.classList.add('revealed');
  }, 1200);
});

// =============================================
// QUOTES CAROUSEL
// =============================================
const cards    = document.querySelectorAll('.quote-card');
const qdots    = document.getElementById('qdots');
let current    = 0;
let autoTimer  = null;

// Build dots
cards.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'qdot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goTo(i));
  qdots.appendChild(dot);
});

function goTo(idx, dir = 1) {
  if (idx === current) return;
  const prev = current;
  current = (idx + cards.length) % cards.length;

  cards[prev].classList.remove('active');
  cards[prev].classList.add(dir > 0 ? 'exit-left' : 'exit-right');
  setTimeout(() => cards[prev].classList.remove('exit-left', 'exit-right'), 600);

  cards[current].classList.add('active');

  document.querySelectorAll('.qdot').forEach((d, i) =>
    d.classList.toggle('active', i === current)
  );
}

function nextQuote(dir = 1) { goTo(current + dir, dir); }

document.getElementById('qNext').addEventListener('click', () => {
  nextQuote(1);
  resetAuto();
});
document.getElementById('qPrev').addEventListener('click', () => {
  nextQuote(-1);
  resetAuto();
});

function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => nextQuote(1), 4500);
}
resetAuto();

// =============================================
// COUNTDOWN TIMER
// =============================================
function pad(n, len = 2) { return String(n).padStart(len, '0'); }

function updateCountdown() {
  const diff = Date.now() - START_DATE.getTime();
  if (diff < 0) { return; }

  const totalSecs = Math.floor(diff / 1000);
  const secs  = totalSecs % 60;
  const mins  = Math.floor(totalSecs / 60) % 60;
  const hours = Math.floor(totalSecs / 3600) % 24;
  const days  = Math.floor(totalSecs / 86400);

  const elDays  = document.getElementById('cdDays');
  const elHours = document.getElementById('cdHours');
  const elMins  = document.getElementById('cdMins');
  const elSecs  = document.getElementById('cdSecs');

  elDays.textContent  = pad(days, 3);
  elHours.textContent = pad(hours);
  elMins.textContent  = pad(mins);

  // tick animation on seconds
  elSecs.textContent = pad(secs);
  elSecs.classList.remove('tick');
  void elSecs.offsetWidth; // reflow
  elSecs.classList.add('tick');
  setTimeout(() => elSecs.classList.remove('tick'), 300);

  // Set start date label
  document.getElementById('cdStartDate').textContent =
    `${START_DATE.getDate()} ${months[START_DATE.getMonth()]} ${START_DATE.getFullYear()}`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// =============================================
// CLOSING HEART — click for fireworks
// =============================================
const bigHeart   = document.getElementById('bigHeart');
const fwContainer = document.getElementById('fireworks');

bigHeart.addEventListener('click', () => {
  bigHeart.classList.remove('pop');
  void bigHeart.offsetWidth;
  bigHeart.classList.add('pop');
  launchFireworks();
});

function launchFireworks() {
  const colors = ['#e8718a','#d4a55a','#f0c878','#c8425a','#fff8f5','#ffb3c6'];
  const cx = fwContainer.offsetWidth  / 2;
  const cy = fwContainer.offsetHeight / 2;

  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'fw-particle';
    const angle = (i / 40) * Math.PI * 2;
    const dist  = 80 + Math.random() * 140;
    const tx    = Math.cos(angle) * dist;
    const ty    = Math.sin(angle) * dist;
    p.style.cssText = `
      left: ${cx}px;
      top:  ${cy}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      --tx: ${tx}px;
      --ty: ${ty}px;
      animation-duration: ${0.7 + Math.random() * 0.5}s;
    `;
    fwContainer.appendChild(p);
    setTimeout(() => p.remove(), 1500);
  }
}

// =============================================
// SCROLL REVEAL (Intersection Observer)
// =============================================
const revealEls = document.querySelectorAll(
  '.hero-content, .letter-wrapper, .quotes-inner, .countdown-inner, .closing-inner'
);

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// =============================================
// PARALLAX subtle on hero bg text
// =============================================
const heroBgText = document.querySelector('.hero-bg-text');
if (heroBgText) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBgText.style.transform = `translate(-50%,calc(-50% + ${y * 0.25}px))`;
  });
}
