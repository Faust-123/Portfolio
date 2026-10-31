const stars = document.querySelector('.stars');
for (let i = 0; i < 32; i++) {
  const star = document.createElement('span');
  star.className = 'star';
  star.textContent = i % 7 === 0 ? '✦' : '·';
  star.style.left = `${3 + Math.random() * 94}%`;
  star.style.top = `${10 + Math.random() * 75}%`;
  star.style.fontSize = `${i % 7 === 0 ? 9 : 13}px`;
  star.style.setProperty('--duration', `${2 + Math.random() * 3}s`);
  star.style.setProperty('--delay', `${Math.random() * -5}s`);
  stars.appendChild(star);
}

const modal = document.querySelector('#surprise');
const card = modal.querySelector('.modal__card');
const closeButton = modal.querySelector('.modal__close');
let previousFocus;
function openSurprise() {
  previousFocus = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  closeButton.focus();
  celebrate();
}
function closeSurprise() {
  modal.hidden = true;
  document.body.style.overflow = '';
  if (previousFocus) previousFocus.focus();
}
document.querySelectorAll('[data-open-surprise]').forEach(button => button.addEventListener('click', openSurprise));
document.querySelectorAll('[data-close-surprise]').forEach(button => button.addEventListener('click', closeSurprise));
document.querySelector('#celebrate').addEventListener('click', celebrate);
document.addEventListener('keydown', event => {
  if (modal.hidden) return;
  if (event.key === 'Escape') closeSurprise();
  if (event.key === 'Tab') {
    const focusable = [...card.querySelectorAll('button')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

const canvas = document.querySelector('#confetti');
const ctx = canvas.getContext('2d');
let particles = [];
let animation;
function celebrate() {
  if (!ctx || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  canvas.hidden = false;
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  const colors = ['#e9c9a6', '#fff2dc', '#c6a3cb', '#e4b5b5', '#ffffff'];
  particles = Array.from({ length: 120 }, () => ({
    x: innerWidth * (.15 + Math.random() * .7), y: innerHeight * (.2 + Math.random() * .4),
    vx: (Math.random() - .5) * 9, vy: -3 - Math.random() * 8,
    size: 2 + Math.random() * 4, color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI, spin: (Math.random() - .5) * .16, life: 100 + Math.random() * 60
  }));
  cancelAnimationFrame(animation);
  draw();
}
function draw() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += .1; p.vx *= .99; p.rotation += p.spin; p.life--;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation); ctx.globalAlpha = Math.min(1, Math.max(0, p.life / 30));
    ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6); ctx.restore();
  });
  particles = particles.filter(p => p.life > 0 && p.y < innerHeight + 20);
  if (particles.length) animation = requestAnimationFrame(draw);
  else {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    canvas.hidden = true;
  }
}
