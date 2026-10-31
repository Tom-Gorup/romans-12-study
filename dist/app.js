const track = document.getElementById('presentation');
const stage = document.querySelector('.stage');
const anchor = document.getElementById('mercy-anchor');
const annotation = document.getElementById('annotation');
const livingAnchor = document.getElementById('living-anchor');
const livingAnnotation = document.getElementById('living-annotation');
const connector = document.getElementById('connector');
const connectorPath = document.getElementById('connector-path');
const livingConnectorPath = document.getElementById('living-connector-path');
const noteLines = [...annotation.querySelectorAll('.hand-note span')];
const livingNoteLines = [...livingAnnotation.querySelectorAll('.hand-note span')];
const intro = document.getElementById('intro');
const overview = document.getElementById('overview');
const bookMap = document.getElementById('book-map');
const logicOverview = document.getElementById('logic-overview');
const logicCards = [...document.querySelectorAll('.logic-card')];
const flowSteps = [...document.querySelectorAll('.flow-step')];
const quotePanels = [...document.querySelectorAll('.quote-panel')];
const logicConclusion = document.querySelector('.logic-conclusion');
const navButtons = [...document.querySelectorAll('.section-nav button')];
const focus = document.getElementById('focus');
const passageSlides = [...document.querySelectorAll('.passage-slide')];
const passageExtension = document.querySelector('.passage-extension');
const verseTwoSlide = document.querySelector('.passage-two');
const verseTwoDrawing = document.getElementById('verse-two-drawing');
const conformedAnchor = document.getElementById('conformed-anchor');
const transformedAnchor = document.getElementById('transformed-anchor');
const mindAnchor = document.getElementById('mind-anchor');
const testingAnchor = document.getElementById('testing-anchor');
const translationNote = document.getElementById('translation-note');
const testingNote = document.getElementById('testing-note');
const translationLines = [...translationNote.querySelectorAll('.hand-note span')];
const testingLines = [...testingNote.querySelectorAll('.hand-note span')];
const handNotes = [...document.querySelectorAll('.hand-note')];
const rangeThree = document.querySelector('.range-three');
const rangeThreeFive = document.querySelector('.range-three-five');
const copyButton = document.getElementById('copy-button');
const root = document.documentElement;
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const ramp = (value, from, to) => clamp((value - from) / (to - from));
const checkpoints = [0, .12, .28, .42, .48, .54, .6, .67, .76, .91, 1, 1.11, 1.17, 1.23, 1.34, 1.45, 1.56, 1.67, 1.78, 1.89, 2];
const storyEnd = checkpoints[checkpoints.length - 1];
const passageWindows = [
  [1.03, 1.11, 1.27, 1.34],
  [1.27, 1.34, 1.49, 1.56],
  [1.49, 1.56, 1.60, 1.67],
  [1.60, 1.67, 1.71, 1.78],
  [1.71, 1.78, 1.82, 1.89],
  [1.82, 1.89, 1.93, 2],
  [1.93, 2, Infinity, Infinity]
];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let ticking = false;
let navigating = false;
let wheelLockUntil = 0;
let wheelCarry = 0;
let lastWheelAt = 0;
let snapTimer;
let copyFeedback = false;
let navigationToken = 0;

function progress() {
  return clamp((window.scrollY - track.offsetTop) / Math.max(1, track.offsetHeight - window.innerHeight)) * storyEnd;
}

function drawConnector() {
  const s = stage.getBoundingClientRect();
  connector.setAttribute('viewBox', `0 0 ${s.width} ${s.height}`);
  [[anchor, annotation, connectorPath], [livingAnchor, livingAnnotation, livingConnectorPath]].forEach(([from, to, path]) => {
    const a = from.getBoundingClientRect();
    const n = to.getBoundingClientRect();
    if (window.innerWidth <= 700) {
      const x1 = a.left - s.left - 7;
      const y1 = a.top - s.top + a.height * .55;
      const x2 = n.left - s.left + 10;
      const y2 = n.top - s.top + 12;
      const gutter = window.innerWidth <= 450 ? 19 : 29;
      path.setAttribute('d', `M ${x1} ${y1} C ${gutter} ${y1 + 10}, ${gutter} ${y1 + 35}, ${gutter} ${y2 - 34} C ${gutter} ${y2 - 10}, ${x2 - 28} ${y2 - 12}, ${x2} ${y2}`);
    } else {
      const x1 = a.right - s.left + 8;
      const y1 = a.top - s.top + a.height * .65;
      const x2 = n.left - s.left + 5;
      const y2 = n.top - s.top + Math.min(72, n.height * .22);
      const mid = x1 + Math.max(35, (x2 - x1) * .52);
      path.setAttribute('d', `M ${x1} ${y1} C ${mid} ${y1 + 24}, ${mid - 20} ${y2 - 30}, ${x2} ${y2}`);
    }
  });
}

function drawVerseTwo() {
  const slide = verseTwoSlide.getBoundingClientRect();
  verseTwoDrawing.setAttribute('viewBox', `0 0 ${slide.width} ${slide.height}`);
  const x = value => value - slide.left;
  const y = value => value - slide.top;
  const mobile = window.innerWidth <= 700;
  const translation = translationNote.querySelector('.hand-note').getBoundingClientRect();
  [[conformedAnchor, 'conformed-connector', 0], [transformedAnchor, 'transformed-connector', 18]].forEach(([anchorNode, pathId, offset]) => {
    const a = anchorNode.getBoundingClientRect();
    const x1 = mobile ? x(a.left) - 7 : x(a.right) + 6;
    const y1 = y(a.top + a.height * .56);
    const x2 = x(translation.left) - 8;
    const y2 = y(translation.top + 18 + offset);
    const middle = mobile ? 12 + offset * .25 : x1 + Math.max(30, (x2 - x1) * .55);
    const d = mobile
      ? `M ${x1} ${y1} C ${middle} ${y1 + 5}, ${middle} ${y2 - 25}, ${x2} ${y2}`
      : `M ${x1} ${y1} C ${middle} ${y1 + 15}, ${middle} ${y2 - 30}, ${x2} ${y2}`;
    document.getElementById(pathId).setAttribute('d', d);
  });

  const range = document.createRange();
  range.selectNodeContents(testingAnchor);
  const rows = [];
  for (const rect of range.getClientRects()) {
    if (rect.width < 2 || rect.height < 2) continue;
    const row = rows.find(item => Math.abs(item.top - rect.top) < 4);
    if (row) {
      row.left = Math.min(row.left, rect.left);
      row.right = Math.max(row.right, rect.right);
      row.bottom = Math.max(row.bottom, rect.bottom);
    } else rows.push({left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom});
  }
  rows.sort((a, b) => a.top - b.top);
  document.getElementById('testing-underline').setAttribute('d', rows.map(row =>
    `M ${x(row.left)} ${y(row.bottom) + 3} Q ${x((row.left + row.right) / 2)} ${y(row.bottom) + 7}, ${x(row.right)} ${y(row.bottom) + 3}`
  ).join(' '));
  const mind = mindAnchor.getBoundingClientRect();
  const noteText = testingNote.querySelector('.hand-note').getBoundingClientRect();
  const x1 = mobile ? x(mind.left) - 7 : x(mind.right) + 8;
  const y1 = y(mind.top + mind.height * .55);
  const x2 = x(noteText.left) - 8;
  const y2 = y(noteText.top + Math.min(24, noteText.height * .18));
  document.getElementById('testing-connector').setAttribute('d', mobile
    ? `M ${x1} ${y1} C 12 ${y1 + 16}, 12 ${y2 - 26}, ${x2} ${y2}`
    : `M ${x1} ${y1} C ${x1 + 80} ${y1 - 25}, ${x2 - 75} ${y2 - 15}, ${x2} ${y2}`);
}

function update() {
  ticking = false;
  const p = progress();
  const pullBack = ramp(p, .19, .28);
  const mapIn = ramp(p, .21, .28);
  const mapOut = ramp(p, .34, .42);
  const logicIn = ramp(p, .35, .42);
  const logicOut = ramp(p, .7, .76);
  const focused = ramp(p, .7, .76);
  root.style.setProperty('--progress', (p / storyEnd).toFixed(4));
  root.style.setProperty('--intro-opacity', (1 - ramp(p, .04, .11)).toFixed(4));
  root.style.setProperty('--chrome-opacity', ramp(p, .07, .12).toFixed(4));
  root.style.setProperty('--chrome-events', p >= .1 ? 'auto' : 'none');
  root.style.setProperty('--overview-opacity', (ramp(p, .07, .12) * (1 - ramp(p, .2, .28))).toFixed(4));
  const overviewFit = window.innerWidth <= 700 ? Math.min(1, (window.innerWidth - 24) / 1180) : 1;
  root.style.setProperty('--overview-scale', (overviewFit * (1 - pullBack * .58)).toFixed(4));
  root.style.setProperty('--map-opacity', (mapIn * (1 - mapOut)).toFixed(4));
  root.style.setProperty('--map-scale', (.84 + mapIn * .16 + mapOut * .42).toFixed(4));
  root.style.setProperty('--logic-opacity', (logicIn * (1 - logicOut)).toFixed(4));
  root.style.setProperty('--logic-scale', (.87 + logicIn * .13 + logicOut * .38).toFixed(4));
  root.style.setProperty('--quote-opacity', (ramp(p, .4, .42) * (1 - ramp(p, .63, .66)) * (1 - logicOut)).toFixed(4));
  root.style.setProperty('--summary-opacity', (ramp(p, .64, .67) * (1 - logicOut)).toFixed(4));
  logicConclusion.setAttribute('aria-hidden', p < .65);
  const activeLogic = p < .45 ? 0 : p < .51 ? 1 : p < .57 ? 2 : 3;
  logicCards.forEach((card, index) => card.classList.toggle('is-current', index === activeLogic));
  flowSteps.forEach((step, index) => step.classList.toggle('is-complete', index <= activeLogic));
  quotePanels.forEach((panel, index) => {
    panel.classList.toggle('is-current', index === activeLogic);
    panel.setAttribute('aria-hidden', index !== activeLogic || p >= .65);
  });
  logicOverview.classList.toggle('is-summary', p >= .64);
  root.style.setProperty('--focus-opacity', (focused * (1 - ramp(p, 1, 1.08))).toFixed(4));
  root.style.setProperty('--focus-scale', (.86 + focused * .14).toFixed(4));
  const mercyOpacity = 1 - ramp(p, .91, .95);
  root.style.setProperty('--circle', ramp(p, .78, .82).toFixed(4));
  root.style.setProperty('--connector', ramp(p, .82, .85).toFixed(4));
  root.style.setProperty('--mercy-opacity', mercyOpacity.toFixed(4));
  root.style.setProperty('--mercy-note-opacity', (ramp(p, .85, .87) * mercyOpacity).toFixed(4));
  noteLines.forEach((line, i) => line.style.setProperty('--line-progress', ramp(p, .85 + i * .008, .875 + i * .008).toFixed(4)));
  root.style.setProperty('--underline', ramp(p, .9, .91).toFixed(4));
  root.style.setProperty('--living-circle', ramp(p, .92, .95).toFixed(4));
  root.style.setProperty('--living-connector', ramp(p, .95, .97).toFixed(4));
  root.style.setProperty('--living-opacity', ramp(p, .94, .97).toFixed(4));
  livingNoteLines.forEach((line, i) => line.style.setProperty('--line-progress', ramp(p, .965 + i * .006, .98 + i * .006).toFixed(4)));
  root.style.setProperty('--living-underline', ramp(p, .99, 1).toFixed(4));
  root.style.setProperty('--conformed-circle', ramp(p, 1.112, 1.13).toFixed(4));
  root.style.setProperty('--transformed-circle', ramp(p, 1.125, 1.142).toFixed(4));
  root.style.setProperty('--translation-circle-opacity', (1 - ramp(p, 1.172, 1.187)).toFixed(4));
  root.style.setProperty('--translation-line', ramp(p, 1.14, 1.153).toFixed(4));
  root.style.setProperty('--translation-line-opacity', (1 - ramp(p, 1.172, 1.187)).toFixed(4));
  root.style.setProperty('--translation-note-opacity', (ramp(p, 1.148, 1.164) * (1 - ramp(p, 1.172, 1.187))).toFixed(4));
  translationLines.forEach((line, i) => line.style.setProperty('--line-progress', ramp(p, 1.15 + i * .0035, 1.158 + i * .0035).toFixed(4)));
  root.style.setProperty('--mind-circle', ramp(p, 1.173, 1.188).toFixed(4));
  root.style.setProperty('--testing-underline-progress', ramp(p, 1.186, 1.206).toFixed(4));
  root.style.setProperty('--testing-line', ramp(p, 1.203, 1.216).toFixed(4));
  root.style.setProperty('--testing-note-opacity', ramp(p, 1.213, 1.227).toFixed(4));
  testingLines.forEach((line, i) => line.style.setProperty('--line-progress', ramp(p, 1.213 + i * .003, 1.220 + i * .003).toFixed(4)));
  translationNote.setAttribute('aria-hidden', p < 1.148 || p >= 1.187);
  testingNote.setAttribute('aria-hidden', p < 1.213);
  root.style.setProperty('--expand35', ramp(p, 1.365, 1.44).toFixed(4));
  const expanded = p >= 1.4;
  passageExtension.setAttribute('aria-hidden', !expanded);
  rangeThree.setAttribute('aria-hidden', expanded);
  rangeThreeFive.setAttribute('aria-hidden', !expanded);
  annotation.setAttribute('aria-hidden', p < .85 || p >= .95);
  livingAnnotation.setAttribute('aria-hidden', p < .94);
  const passageIndex = p < 1.08 ? -1 : p < 1.30 ? 0 : p < 1.51 ? 1 : p < 1.62 ? 2 : p < 1.73 ? 3 : p < 1.84 ? 4 : p < 1.95 ? 5 : 6;
  passageSlides.forEach((slide, index) => {
    const [enter, full, leave, gone] = passageWindows[index];
    const opacity = ramp(p, enter, full) * (leave === Infinity ? 1 : 1 - ramp(p, leave, gone));
    slide.style.setProperty('--slide-opacity', opacity.toFixed(4));
    slide.classList.toggle('is-active', index === passageIndex);
    slide.setAttribute('aria-hidden', index !== passageIndex);
  });
  document.getElementById('stage-number').textContent = p < .2 ? '01' : p < .35 ? '02' : p < .72 ? '03' : p < .82 ? '04' : p < .94 ? '05' : p < 1.07 ? '06' : p < 1.30 ? '07' : p < 1.51 ? '08' : p < 1.62 ? '09' : p < 1.73 ? '10' : p < 1.95 ? '11' : '12';
  document.getElementById('progress-copy').textContent = p < .2 ? 'THE WHOLE CHAPTER' : p < .35 ? 'THE WHOLE LETTER' : p < .72 ? 'THE GOSPEL’S LOGIC' : p < .82 ? 'VERSE ONE' : p < .94 ? 'MERCIES OF GOD' : p < 1.07 ? 'LIVING SACRIFICE' : p < 1.11 ? 'VERSE TWO' : p < 1.18 ? 'RE-MOULDED MINDS' : p < 1.30 ? 'TEST AND DISCERN' : p < 1.51 ? 'VERSES THREE TO FIVE' : p < 1.62 ? 'GIFTS OF GRACE' : p < 1.73 ? 'GENUINE LOVE' : p < 1.95 ? 'LOVE IN ACTION' : 'OVERCOME EVIL WITH GOOD';
  const chapterIsActive = p >= .1 && p < .23;
  const mapIsActive = p >= .23 && p < .38;
  const logicIsActive = p >= .38 && p < .73;
  const focusIsActive = p >= .73 && p < 1.06;
  overview.classList.toggle('is-active', chapterIsActive);
  bookMap.classList.toggle('is-active', mapIsActive);
  logicOverview.classList.toggle('is-active', logicIsActive);
  focus.classList.toggle('is-active', focusIsActive);
  intro.setAttribute('aria-hidden', p >= .1);
  overview.setAttribute('aria-hidden', !chapterIsActive);
  bookMap.setAttribute('aria-hidden', !mapIsActive);
  logicOverview.setAttribute('aria-hidden', !logicIsActive);
  focus.setAttribute('aria-hidden', !focusIsActive);
  copyButton.disabled = p < .1;
  if (!copyFeedback) copyButton.textContent = passageIndex >= 0 ? 'COPY PASSAGE' : focusIsActive ? 'COPY VERSE' : logicIsActive ? 'COPY NOTES' : mapIsActive ? 'COPY OUTLINE' : 'COPY CHAPTER';
  copyButton.setAttribute('aria-label', passageIndex >= 0 ? `Copy Romans 12 ${passageSlides[passageIndex].dataset.passage}` : focusIsActive ? 'Copy Romans 12 verse 1' : logicIsActive ? 'Copy Romans passage notes' : mapIsActive ? 'Copy Romans outline' : 'Copy Romans 12');
  const navIndex = p < .08 ? 0 : p < .2 ? 1 : p < .35 ? 2 : p < .72 ? 3 : p < .82 ? 4 : p < .94 ? 5 : p < 1.07 ? 6 : p < 1.14 ? 7 : p < 1.20 ? 8 : p < 1.30 ? 9 : p < 1.51 ? 10 : p < 1.62 ? 11 : p < 1.73 ? 12 : p < 1.95 ? 13 : 14;
  navButtons.forEach((button, index) => {
    button.classList.toggle('is-active', index === navIndex);
    if (index === navIndex) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  drawConnector();
  if (p >= 1.03 && p <= 1.34) drawVerseTwo();
}

function scheduleUpdate() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
}

function fitHandNotes() {
  handNotes.forEach(note => {
    note.style.fontSize = '';
    const baseSize = parseFloat(getComputedStyle(note).fontSize);
    const available = Math.max(100, note.clientWidth - 28);
    const widestLine = Math.max(...[...note.querySelectorAll('span')].map(line => line.scrollWidth));
    if (widestLine > available) note.style.fontSize = `${Math.max(14, baseSize * available / widestLine)}px`;
  });
  scheduleUpdate();
}
function animateToCheckpoint(index, quick = false) {
  if (navigating && !quick) return;
  const token = ++navigationToken;
  const target = track.offsetTop + checkpoints[index] / storyEnd * Math.max(1, track.offsetHeight - window.innerHeight);
  const start = window.scrollY;
  if (Math.abs(target - start) < 2) {
    navigating = false;
    scheduleUpdate();
    return;
  }
  clearTimeout(snapTimer);
  navigating = true;
  const duration = reducedMotion.matches ? 0 : [9, 10, 12, 13].includes(index) ? 2400 : quick ? 1100 : 1700;
  const startTime = performance.now();

  function frame(now) {
    if (token !== navigationToken) return;
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
  const source = p >= 1.08 ? p < 1.40 && p >= 1.30 ? passageSlides[1].querySelector('.passage-verse-three') : passageSlides.find(slide => slide.classList.contains('is-active'))?.querySelector('.passage-body') : p >= .73 ? document.querySelector('.verse') : p >= .38 ? logicOverview : p >= .23 ? bookMap : document.querySelector('.chapter-text');
  const text = source.innerText.replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
  let copied = false;
  copyFeedback = true;
  copyButton.textContent = 'COPYING…';
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch { /* Try the fallback below. */ }
  }
  if (!copied) {
    const fallback = document.createElement('textarea');
    fallback.value = text;
    fallback.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(fallback);
    fallback.select();
    try { copied = document.execCommand('copy'); } catch { /* The button will show the failure below. */ }
    fallback.remove();
  }
  copyButton.textContent = copied ? 'COPIED' : 'COPY FAILED';
  setTimeout(() => { copyFeedback = false; scheduleUpdate(); }, 1800);
});

navButtons.forEach(button => button.addEventListener('click', () => {
  const index = Number(button.dataset.checkpoint);
  if ([9, 10, 12, 13].includes(index)) {
    ++navigationToken;
    navigating = false;
    const leadIn = checkpoints[index - 1] / storyEnd * Math.max(1, track.offsetHeight - window.innerHeight);
    window.scrollTo(0, track.offsetTop + leadIn);
    scheduleUpdate();
    requestAnimationFrame(() => animateToCheckpoint(index));
  } else animateToCheckpoint(index, true);
  button.classList.add('hide-tooltip');
  button.blur();
}));
navButtons.forEach(button => button.addEventListener('mouseleave', () => button.classList.remove('hide-tooltip')));

window.addEventListener('resize', fitHandNotes);
document.fonts?.ready.then(fitHandNotes);
fitHandNotes();
