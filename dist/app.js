const track = document.getElementById('presentation');
const stage = document.querySelector('.stage');
const anchor = document.getElementById('mercy-anchor');
const annotation = document.getElementById('annotation');
const connector = document.getElementById('connector');
const connectorPath = document.getElementById('connector-path');
const noteLines = [...document.querySelectorAll('.hand-note span')];
const intro = document.getElementById('intro');
const overview = document.getElementById('overview');
const bookMap = document.getElementById('book-map');
const focus = document.getElementById('focus');
const copyButton = document.getElementById('copy-button');
const root = document.documentElement;
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const ramp = (value, from, to) => clamp((value - from) / (to - from));
const checkpoints = [0, .18, .42, .64, .8, 1];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let ticking = false;
let navigating = false;
let wheelLockUntil = 0;
let wheelCarry = 0;
let lastWheelAt = 0;
let snapTimer;
let copyFeedback = false;

function progress() {
  return clamp((window.scrollY - track.offsetTop) / Math.max(1, track.offsetHeight - window.innerHeight));
}

function drawConnector() {
  const a = anchor.getBoundingClientRect();
  const n = annotation.getBoundingClientRect();
  const s = stage.getBoundingClientRect();
  const x1 = a.right - s.left + 8;
  const y1 = a.top - s.top + a.height * .65;
  const x2 = n.left - s.left + 5;
  const y2 = n.top - s.top + Math.min(72, n.height * .22);
  const mid = x1 + Math.max(35, (x2 - x1) * .52);
  connector.setAttribute('viewBox', `0 0 ${s.width} ${s.height}`);
  connectorPath.setAttribute('d', `M ${x1} ${y1} C ${mid} ${y1 + 24}, ${mid - 20} ${y2 - 30}, ${x2} ${y2}`);
}

function update() {
  ticking = false;
  const p = progress();
  const pullBack = ramp(p, .25, .42);
  const mapIn = ramp(p, .3, .42);
  const mapOut = ramp(p, .52, .64);
  const focused = ramp(p, .53, .64);
  root.style.setProperty('--progress', p.toFixed(4));
  root.style.setProperty('--intro-opacity', (1 - ramp(p, .07, .15)).toFixed(4));
  root.style.setProperty('--chrome-opacity', ramp(p, .11, .18).toFixed(4));
  root.style.setProperty('--chrome-events', p >= .16 ? 'auto' : 'none');
  root.style.setProperty('--overview-opacity', (ramp(p, .1, .18) * (1 - ramp(p, .31, .42))).toFixed(4));
  const overviewFit = window.innerWidth <= 700 ? Math.min(1, (window.innerWidth - 24) / 1180) : 1;
  root.style.setProperty('--overview-scale', (overviewFit * (1 - pullBack * .58)).toFixed(4));
  root.style.setProperty('--map-opacity', (mapIn * (1 - mapOut)).toFixed(4));
  root.style.setProperty('--map-scale', (.84 + mapIn * .16 + mapOut * .42).toFixed(4));
  root.style.setProperty('--focus-opacity', focused.toFixed(4));
  root.style.setProperty('--focus-scale', (.86 + focused * .14).toFixed(4));
  root.style.setProperty('--circle', ramp(p, .72, .8).toFixed(4));
  root.style.setProperty('--connector', ramp(p, .8, .87).toFixed(4));
  noteLines.forEach((line, i) => line.style.setProperty('--line-progress', ramp(p, .84 + i * .025, .89 + i * .025).toFixed(4)));
  root.style.setProperty('--underline', ramp(p, .97, 1).toFixed(4));
  document.getElementById('stage-number').textContent = p < .3 ? '01' : p < .53 ? '02' : p < .72 ? '03' : '04';
  document.getElementById('progress-copy').textContent = p < .3 ? 'THE WHOLE CHAPTER' : p < .53 ? 'THE WHOLE LETTER' : p < .72 ? 'VERSE ONE' : 'MERCIES OF GOD';
  const chapterIsActive = p >= .15 && p < .34;
  const mapIsActive = p >= .34 && p < .57;
  const focusIsActive = p >= .57;
  overview.classList.toggle('is-active', chapterIsActive);
  bookMap.classList.toggle('is-active', mapIsActive);
  focus.classList.toggle('is-active', focusIsActive);
  intro.setAttribute('aria-hidden', p >= .15);
  overview.setAttribute('aria-hidden', !chapterIsActive);
  bookMap.setAttribute('aria-hidden', !mapIsActive);
  focus.setAttribute('aria-hidden', !focusIsActive);
  copyButton.disabled = p < .15;
  if (!copyFeedback) copyButton.textContent = focusIsActive ? 'COPY VERSE' : mapIsActive ? 'COPY OUTLINE' : 'COPY CHAPTER';
  copyButton.setAttribute('aria-label', focusIsActive ? 'Copy Romans 12 verse 1' : mapIsActive ? 'Copy Romans outline' : 'Copy Romans 12');
  drawConnector();
}

function scheduleUpdate() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
}
function animateToCheckpoint(index) {
  if (navigating) return;
  const target = track.offsetTop + checkpoints[index] * Math.max(1, track.offsetHeight - window.innerHeight);
  const start = window.scrollY;
  if (Math.abs(target - start) < 2) return;
  clearTimeout(snapTimer);
  navigating = true;
  const duration = reducedMotion.matches ? 0 : index === checkpoints.length - 1 ? 2200 : 1700;
  const startTime = performance.now();

  function frame(now) {
    const t = duration ? clamp((now - startTime) / duration) : 1;
    const eased = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    window.scrollTo(0, start + (target - start) * eased);
    if (t < 1) requestAnimationFrame(frame);
    else {
      navigating = false;
      wheelLockUntil = now + 350;
      scheduleUpdate();
    }
  }
  requestAnimationFrame(frame);
}

function step(direction) {
  if (navigating || performance.now() < wheelLockUntil) return;
  const p = progress();
  const index = direction > 0
    ? checkpoints.findIndex(point => point > p + .02)
    : checkpoints.findLastIndex(point => point < p - .02);
  if (index >= 0) animateToCheckpoint(index);
}

window.addEventListener('wheel', event => {
  if (event.ctrlKey || event.metaKey) return;
  event.preventDefault();
  if (navigating || performance.now() < wheelLockUntil) return;
  const now = performance.now();
  if (now - lastWheelAt > 180) wheelCarry = 0;
  lastWheelAt = now;
  const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
  wheelCarry += event.deltaY * multiplier;
  if (Math.abs(wheelCarry) > 24) {
    step(Math.sign(wheelCarry));
    wheelCarry = 0;
  }
}, {passive:false});

window.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, textarea, [contenteditable]')) return;
  if (event.target.closest('button') && (event.key === ' ' || event.key === 'Enter')) return;
  if (window.getSelection()?.toString()) return;
  const forward = ['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key) && !(event.key === ' ' && event.shiftKey);
  const backward = ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey);
  if (forward || backward) {
    event.preventDefault();
    step(forward ? 1 : -1);
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    animateToCheckpoint(event.key === 'Home' ? 0 : checkpoints.length - 1);
  }
});

window.addEventListener('scroll', () => {
  scheduleUpdate();
  if (navigating || window.getSelection()?.toString()) return;
  clearTimeout(snapTimer);
  snapTimer = setTimeout(() => {
    const p = progress();
    const nearest = checkpoints.reduce((best, point, index) => Math.abs(point - p) < Math.abs(checkpoints[best] - p) ? index : best, 0);
    if (Math.abs(checkpoints[nearest] - p) > .012) animateToCheckpoint(nearest);
  }, 260);
}, {passive:true});

copyButton.addEventListener('click', async () => {
  const p = progress();
  const source = p >= .57 ? document.querySelector('.verse') : p >= .34 ? bookMap : document.querySelector('.chapter-text');
  const text = source.innerText.replace(/\s+/g, ' ').trim();
  const fallback = document.createElement('textarea');
  fallback.value = text;
  fallback.style.cssText = 'position:fixed;left:-9999px;top:0';
  document.body.appendChild(fallback);
  fallback.select();
  let copied = false;
  try { copied = document.execCommand('copy'); } catch { /* Try the Clipboard API next. */ }
  fallback.remove();
  copyButton.textContent = copied ? 'COPIED' : 'COPYING…';
  copyFeedback = true;
  if (!copied && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch { /* The button will show the failure below. */ }
  }
  copyButton.textContent = copied ? 'COPIED' : 'COPY FAILED';
  setTimeout(() => { copyFeedback = false; scheduleUpdate(); }, 1800);
});

window.addEventListener('resize', scheduleUpdate);
document.fonts?.ready.then(scheduleUpdate);
scheduleUpdate();
