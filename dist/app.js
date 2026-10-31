const track = document.getElementById('presentation');
const stage = document.querySelector('.stage');
const anchor = document.getElementById('mercy-anchor');
const annotation = document.getElementById('annotation');
const connector = document.getElementById('connector');
const connectorPath = document.getElementById('connector-path');
const noteLines = [...document.querySelectorAll('.hand-note span')];
const root = document.documentElement;
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const ramp = (value, from, to) => clamp((value - from) / (to - from));
let ticking = false;

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
  const total = Math.max(1, track.offsetHeight - window.innerHeight);
  const p = clamp((window.scrollY - track.offsetTop) / total);
  const zoom = ramp(p, .08, .31);
  const focused = ramp(p, .16, .35);
  root.style.setProperty('--progress', p.toFixed(4));
  root.style.setProperty('--overview-opacity', (1 - ramp(p, .17, .32)).toFixed(4));
  const overviewFit = window.innerWidth <= 700 ? Math.min(1, (window.innerWidth - 24) / 1180) : 1;
  root.style.setProperty('--overview-scale', (overviewFit * (1 + zoom * 1.2)).toFixed(4));
  root.style.setProperty('--focus-opacity', focused.toFixed(4));
  root.style.setProperty('--focus-scale', (.86 + focused * .14).toFixed(4));
  root.style.setProperty('--circle', ramp(p, .48, .64).toFixed(4));
  root.style.setProperty('--connector', ramp(p, .63, .75).toFixed(4));
  noteLines.forEach((line, i) => line.style.setProperty('--line-progress', ramp(p, .73 + i * .037, .81 + i * .037).toFixed(4)));
  root.style.setProperty('--underline', ramp(p, .91, .98).toFixed(4));
  document.getElementById('stage-number').textContent = p < .25 ? '01' : p < .6 ? '02' : '03';
  document.getElementById('progress-copy').textContent = p < .25 ? 'THE WHOLE CHAPTER' : p < .6 ? 'VERSE ONE' : 'MERCIES OF GOD';
  drawConnector();
}

function scheduleUpdate() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
}
window.addEventListener('scroll', scheduleUpdate, {passive:true});
window.addEventListener('resize', scheduleUpdate);
document.fonts?.ready.then(scheduleUpdate);
scheduleUpdate();
