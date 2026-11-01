const track = document.getElementById('presentation');
const stage = document.querySelector('.stage');
const anchor = document.getElementById('mercy-anchor');
const annotation = document.getElementById('annotation');
const livingAnchor = document.getElementById('living-anchor');
const bodyAnchor = document.getElementById('body-anchor');
const livingAnnotation = document.getElementById('living-annotation');
const connector = document.getElementById('connector');
const connectorPath = document.getElementById('connector-path');
const livingConnectorPath = document.getElementById('living-connector-path');
const bodyConnectorPath = document.getElementById('body-connector-path');
const noteLines = [...annotation.querySelectorAll('.hand-note span')];
const livingNoteLines = [...livingAnnotation.querySelectorAll('.hand-note span')];
const intro = document.getElementById('intro');
const overview = document.getElementById('overview');
const romansBackground = document.getElementById('romans-background');
const bookMap = document.getElementById('book-map');
const logicOverview = document.getElementById('logic-overview');
const logicCards = [...document.querySelectorAll('.logic-card')];
const flowSteps = [...document.querySelectorAll('.flow-step')];
const quotePanels = [...document.querySelectorAll('.quote-panel')];
const logicConclusion = document.querySelector('.logic-conclusion');
const responsesOverview = document.getElementById('responses-overview');
const responsesReprise = document.getElementById('responses-reprise');
const theEnd = document.getElementById('the-end');
const worshipSummary = document.getElementById('worship-summary');
const navButtons = [...document.querySelectorAll('.section-nav button')];
const focus = document.getElementById('focus');
const themeWorship = document.getElementById('theme-worship');
const themeServe = document.getElementById('theme-serve');
const themeLove = document.getElementById('theme-love');
const themes = [themeWorship, themeServe, themeLove];
const passageSlides = [...document.querySelectorAll('.passage-slide')];
const serve34 = document.getElementById('serve-34');
const serve58 = document.getElementById('serve-58');
const standingSlide = document.getElementById('standing-slide');
const serve34Note = document.getElementById('serve-34-note');
const serve58Note = document.getElementById('serve-58-note');
const loveReadings = [...document.querySelectorAll('.love-reading')];
const lovePracticeSlides = [...document.querySelectorAll('.love-practice-slide')];
const verseTwoCanvas = focus;
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
const copyButton = document.getElementById('copy-button');
const readModeLink = document.getElementById('read-mode-link');
const root = document.documentElement;
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const ramp = (value, from, to) => clamp((value - from) / (to - from));
const checkpoints = [0, .12, .28, .41, .55, .57, .62, .68, .75, .90, 1.02, 1.17, 1.26, 1.43, 1.49, 1.59, 1.72, 1.80, 1.90, 2.00, 2.10, 2.22, 2.38, 2.53, 2.70, 2.88, 3.06];
const storyEnd = checkpoints[checkpoints.length - 1];
function logicalProgress(raw) {
  if (raw < .23) return raw;
  if (raw < .36) return .23;
  if (raw < .85) return raw - .13;
  if (raw < .98) return .72;
  return raw - .26;
}
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
  [[anchor, annotation, connectorPath, 0], [livingAnchor, livingAnnotation, livingConnectorPath, 0], [bodyAnchor, livingAnnotation, bodyConnectorPath, 30]].forEach(([from, to, path, endOffset]) => {
    const a = from.getBoundingClientRect();
    const n = to.getBoundingClientRect();
    if (window.innerWidth <= 700) {
      const x1 = a.left - s.left - 7;
      const y1 = a.top - s.top + a.height * .55;
      const x2 = n.left - s.left + 10;
      const y2 = n.top - s.top + 12 + endOffset;
      const gutter = window.innerWidth <= 450 ? 19 : 29;
      path.setAttribute('d', `M ${x1} ${y1} C ${gutter} ${y1 + 10}, ${gutter} ${y1 + 35}, ${gutter} ${y2 - 34} C ${gutter} ${y2 - 10}, ${x2 - 28} ${y2 - 12}, ${x2} ${y2}`);
    } else {
      const x1 = a.right - s.left + 8;
      const y1 = a.top - s.top + a.height * .65;
      const x2 = n.left - s.left + 5;
      const y2 = n.top - s.top + Math.min(72, n.height * .22) + endOffset;
      const mid = x1 + Math.max(35, (x2 - x1) * .52);
      path.setAttribute('d', `M ${x1} ${y1} C ${mid} ${y1 + 24}, ${mid - 20} ${y2 - 30}, ${x2} ${y2}`);
    }
  });
}

function drawVerseTwo() {
  const slide = verseTwoCanvas.getBoundingClientRect();
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
  const noteFirstLine = testingNote.querySelector('.hand-note span').getBoundingClientRect();
  const x1 = x(mind.right) + 8;
  const y1 = y(mind.top + mind.height * .55);
  const x2 = mobile ? x(noteFirstLine.right) + 8 : x(noteText.left) - 8;
  const y2 = mobile ? y(noteFirstLine.top + noteFirstLine.height * .55) : y(noteText.top + Math.min(24, noteText.height * .18));
  const rightGutter = slide.width - (window.innerWidth <= 450 ? 20 : 27);
  document.getElementById('testing-connector').setAttribute('d', mobile
    ? `M ${x1} ${y1} C ${rightGutter} ${y1 + 16}, ${rightGutter} ${y2 - 26}, ${x2} ${y2}`
    : `M ${x1} ${y1} C ${x1 + 80} ${y1 - 25}, ${x2 - 75} ${y2 - 15}, ${x2} ${y2}`);
}

function drawServeAnnotations() {
  const drawUnderline = (slide, svg, anchor, pathId) => {
    const bounds = slide.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    const rows = [];
    const walker = document.createTreeWalker(anchor, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const range = document.createRange();
      range.selectNodeContents(walker.currentNode);
      for (const rect of range.getClientRects()) {
        if (rect.width < 2 || rect.height < 2) continue;
        const row = rows.find(item => Math.abs(item.top - rect.top) < 4);
        if (row) {
          row.left = Math.min(row.left, rect.left);
          row.right = Math.max(row.right, rect.right);
          row.bottom = Math.max(row.bottom, rect.bottom);
        } else rows.push({left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom});
      }
    }
    rows.sort((a, b) => a.top - b.top);
    document.getElementById(pathId).setAttribute('d', rows.map(row => {
      const left = row.left - bounds.left;
      const right = row.right - bounds.left;
      const bottom = row.bottom - bounds.top + 3;
      return `M ${left} ${bottom} Q ${(left + right) / 2} ${bottom + 5}, ${right} ${bottom}`;
    }).join(' '));
  };
  const drawLine = (slide, anchor, target, pathId, endOffset = 0) => {
    const bounds = slide.getBoundingClientRect();
    const from = anchor.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const mobile = window.innerWidth <= 700;
    const x1 = mobile ? from.left - bounds.left - 7 : from.right - bounds.left + 8;
    const y1 = from.top - bounds.top + from.height * .56;
    const x2 = (mobile ? to.left + 10 : to.left - 8) - bounds.left;
    const y2 = to.top - bounds.top + Math.min(35, to.height * .24) + endOffset;
    const bend = mobile ? 18 : x1 + Math.max(40, (x2 - x1) * .5);
    document.getElementById(pathId).setAttribute('d', `M ${x1} ${y1} C ${bend} ${y1 + 12}, ${bend} ${y2 - 24}, ${x2} ${y2}`);
  };
  drawUnderline(serve34, document.getElementById('serve-34-ink'), document.getElementById('faith-underline-anchor'), 'faith-underline');
  drawLine(serve34, document.getElementById('faith-circle-anchor'), serve34Note.querySelector('.hand-note'), 'faith-connector');
  drawUnderline(serve58, document.getElementById('serve-58-ink'), document.getElementById('gifts-underline-anchor'), 'gifts-underline');
  const bodyDrawing = serve58Note.querySelector('.body-drawing');
  drawLine(serve58, document.getElementById('one-body-anchor'), bodyDrawing, 'body-connector');
  drawLine(serve58, document.getElementById('grace-given-anchor'), bodyDrawing, 'grace-connector', 38);
}

function update() {
  ticking = false;
  const raw = progress();
  const p = logicalProgress(raw);
  const pullBack = ramp(p, .19, .28);
  const mapIn = ramp(raw, .39, .41);
  const mapOut = ramp(p, .34, .42);
  const logicIn = ramp(p, .35, .42);
  const logicOut = ramp(p, .7, .76);
  const focused = ramp(p, .7, .76);
  root.style.setProperty('--progress', (raw / storyEnd).toFixed(4));
  root.style.setProperty('--intro-opacity', (1 - ramp(p, .04, .11)).toFixed(4));
  root.style.setProperty('--chrome-opacity', ramp(p, .07, .12).toFixed(4));
  root.style.setProperty('--chrome-events', p >= .1 ? 'auto' : 'none');
  const backgroundOpacity = ramp(raw, .23, .26) * (1 - ramp(raw, .37, .40));
  root.style.setProperty('--background-opacity', backgroundOpacity.toFixed(4));
  const responsesOpacity = ramp(raw, .85, .88) * (1 - ramp(raw, .96, 1.02));
  root.style.setProperty('--responses-opacity', responsesOpacity.toFixed(4));
  const repriseOpacity = ramp(raw, 2.82, 2.88) * (1 - ramp(raw, 2.95, 3.00));
  root.style.setProperty('--responses-reprise-opacity', repriseOpacity.toFixed(4));
  root.style.setProperty('--end-opacity', ramp(raw, 2.95, 3.00).toFixed(4));
  root.style.setProperty('--end-write', ramp(raw, 2.97, 3.04).toFixed(4));
  root.style.setProperty('--end-flourish', ramp(raw, 3.02, 3.06).toFixed(4));
  root.style.setProperty('--overview-opacity', (ramp(p, .07, .12) * (1 - ramp(raw, .18, .23))).toFixed(4));
  const overviewFit = 1;
  root.style.setProperty('--overview-scale', (overviewFit * (1 - pullBack * .58)).toFixed(4));
  root.style.setProperty('--map-opacity', (mapIn * (1 - mapOut)).toFixed(4));
  root.style.setProperty('--map-scale', (.84 + mapIn * .16 + mapOut * .42).toFixed(4));
  root.style.setProperty('--logic-opacity', (logicIn * (1 - logicOut)).toFixed(4));
  root.style.setProperty('--logic-scale', (.87 + logicIn * .13 + logicOut * .38).toFixed(4));
  root.style.setProperty('--quote-opacity', (ramp(p, .4, .42) * (1 - ramp(p, .59, .61)) * (1 - logicOut)).toFixed(4));
  root.style.setProperty('--summary-opacity', (ramp(p, .59, .61) * (1 - logicOut)).toFixed(4));
  logicConclusion.setAttribute('aria-hidden', p < .60);
  const activeLogic = p < .45 ? 0 : p < .51 ? 1 : p < .59 ? 2 : -1;
  logicCards.forEach((card, index) => card.classList.toggle('is-current', index === activeLogic));
  flowSteps.forEach((step, index) => step.classList.toggle('is-complete', index <= activeLogic));
  quotePanels.forEach((panel, index) => {
    panel.classList.toggle('is-current', index === activeLogic);
    panel.setAttribute('aria-hidden', index !== activeLogic || p >= .59);
  });
  logicOverview.classList.toggle('is-summary', p >= .59);
  root.style.setProperty('--focus-opacity', (focused * (1 - ramp(p, 1.27, 1.34))).toFixed(4));
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
  root.style.setProperty('--body-circle', ramp(p, .915, .945).toFixed(4));
  root.style.setProperty('--body-connector', ramp(p, .945, .965).toFixed(4));
  const verseOneInkOpacity = 1 - ramp(p, 1.04, 1.08);
  root.style.setProperty('--verse-one-ink-opacity', verseOneInkOpacity.toFixed(4));
  root.style.setProperty('--living-opacity', (ramp(p, .94, .97) * verseOneInkOpacity).toFixed(4));
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
  const worshipSummaryOpacity = ramp(raw, 1.53, 1.58) * (1 - ramp(raw, 1.65, 1.70));
  root.style.setProperty('--worship-summary-opacity', worshipSummaryOpacity.toFixed(4));
  const summaryIsActive = raw >= 1.53 && raw < 1.70;
  worshipSummary.classList.toggle('is-active', summaryIsActive);
  worshipSummary.setAttribute('aria-hidden', !summaryIsActive);
  translationNote.setAttribute('aria-hidden', p < 1.148 || p >= 1.187);
  testingNote.setAttribute('aria-hidden', p < 1.213);
  annotation.setAttribute('aria-hidden', p < .85 || p >= .95);
  livingAnnotation.setAttribute('aria-hidden', p < .94 || p >= 1.08);
  root.style.setProperty('--serve34-circle', ramp(raw, 1.725, 1.75).toFixed(4));
  root.style.setProperty('--serve34-underline', ramp(raw, 1.74, 1.765).toFixed(4));
  root.style.setProperty('--serve34-line', ramp(raw, 1.75, 1.77).toFixed(4));
  root.style.setProperty('--serve34-note', ramp(raw, 1.765, 1.78).toFixed(4));
  serve34Note.querySelectorAll('.hand-note span').forEach((line, i) => line.style.setProperty('--line-progress', ramp(raw, 1.77 + i * .004, 1.785 + i * .004).toFixed(4)));
  root.style.setProperty('--serve58-circle', ramp(raw, 1.905, 1.935).toFixed(4));
  root.style.setProperty('--serve58-underline', ramp(raw, 1.92, 1.95).toFixed(4));
  root.style.setProperty('--serve58-line', ramp(raw, 1.94, 1.965).toFixed(4));
  root.style.setProperty('--serve58-note', ramp(raw, 1.96, 1.975).toFixed(4));
  root.style.setProperty('--body-drawing-progress', ramp(raw, 1.955, 1.99).toFixed(4));
  serve58Note.querySelectorAll('.hand-note span').forEach((line, i) => line.style.setProperty('--line-progress', ramp(raw, 1.965 + i * .005, 1.98 + i * .005).toFixed(4)));
  serve34Note.setAttribute('aria-hidden', raw < 1.765 || raw >= 1.90);
  serve58Note.setAttribute('aria-hidden', raw < 1.96 || raw >= 2.22);
  const standingIsActive = raw >= 2.055 && raw < 2.19;
  root.style.setProperty('--standing-opacity', (ramp(raw, 2.025, 2.075) * (1 - ramp(raw, 2.16, 2.22))).toFixed(4));
  standingSlide.classList.toggle('is-active', standingIsActive);
  standingSlide.setAttribute('aria-hidden', !standingIsActive);
  const passageIndex = raw < 1.68 ? -1 : raw < 1.88 ? 0 : raw < 2.20 ? 1 : raw < 2.35 ? 2 : raw < 2.50 ? -1 : raw < 2.67 ? 3 : -1;
  passageSlides.forEach((slide, index) => {
    const timings = [[1.66,1.71,1.85,1.90],[1.85,1.90,2.17,2.22],[2.17,2.22,2.32,2.38],[2.47,2.53,2.64,2.70]];
    const [inStart,inEnd,outStart,outEnd] = timings[index];
    const opacity = ramp(raw,inStart,inEnd) * (1 - ramp(raw,outStart,outEnd));
    slide.style.setProperty('--slide-opacity', opacity.toFixed(4));
    slide.classList.toggle('is-active', index === passageIndex);
    slide.setAttribute('aria-hidden', index !== passageIndex);
  });
  lovePracticeSlides.forEach((slide,index) => {
    const [inStart,inEnd,outStart,outEnd] = index === 0 ? [2.32,2.38,2.47,2.53] : [2.64,2.70,2.82,2.88];
    const opacity = ramp(raw,inStart,inEnd) * (1 - ramp(raw,outStart,outEnd));
    const active = index === 0 ? raw >= 2.35 && raw < 2.50 : raw >= 2.67 && raw < 2.85;
    slide.style.setProperty('--slide-opacity', opacity.toFixed(4));
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', !active);
  });
  document.getElementById('stage-number').textContent = raw < .1 ? '01' : raw < .23 ? '02' : raw < .40 ? '03' : raw < .51 ? '04' : raw < .85 ? '05' : raw < 1.015 ? '06' : raw < 1.53 ? '07' : raw < 1.70 ? '08' : raw < 2.055 ? '09' : raw < 2.20 ? '10' : raw < 2.85 ? '11' : raw < 2.99 ? '12' : '13';
  document.getElementById('progress-copy').textContent = raw < .23 ? 'ROMANS 12' : raw < .40 ? 'ROMANS / BACKGROUND' : raw < .51 ? 'THE WHOLE LETTER' : raw < .85 ? 'THE GOSPEL’S LOGIC' : raw < 1.015 ? 'THREE RESPONSES' : raw < 1.53 ? 'THEREFORE / WORSHIP' : raw < 1.70 ? 'ALL OF YOU' : raw < 2.055 ? 'THEREFORE / SERVE' : raw < 2.20 ? 'THE WHOLE BODY' : raw < 2.85 ? 'THEREFORE / LOVE' : raw < 2.99 ? 'THREE RESPONSES' : 'THE END';
  const readerAnchor = raw < .23 ? 'chapter' : raw < .85 ? 'context' : raw < 1.015 ? 'takeaways' : raw < 1.70 ? 'worship' : raw < 2.20 ? 'serve' : raw < 2.85 ? 'love' : 'takeaways';
  readModeLink.href = `read.html#${readerAnchor}`;
  const chapterIsActive = p >= .1 && p < .23;
  const backgroundIsActive = raw >= .23 && raw < .40;
  const mapIsActive = !backgroundIsActive && p >= .23 && p < .38;
  const responsesIsActive = raw >= .85 && raw < 1.015;
  const repriseIsActive = raw >= 2.85 && raw < 2.99;
  const endIsActive = raw >= 2.99;
  const logicIsActive = !responsesIsActive && p >= .38 && p < .73;
  const focusIsActive = raw >= .96 && p < 1.30;
  const activeTheme = raw >= 2.85 || raw < .96 ? -1 : summaryIsActive || raw < 1.70 ? 0 : raw < 2.20 ? 1 : 2;
  const readingTheme = [
    raw >= 1.00 && raw < 1.10,
    raw >= 1.66 && raw < 1.74 || raw >= 1.85 && raw < 1.92,
    raw >= 2.17 && raw < 2.35 || raw >= 2.47 && raw < 2.67
  ];
  themes.forEach((theme, index) => {
    theme.classList.toggle('is-active', index === activeTheme);
    theme.classList.toggle('is-reading', index === activeTheme && readingTheme[index]);
    theme.querySelector('.theme-heading').setAttribute('aria-hidden', index !== activeTheme || readingTheme[index]);
    theme.setAttribute('aria-hidden', index !== activeTheme);
  });
  overview.classList.toggle('is-active', chapterIsActive);
  romansBackground.classList.toggle('is-active', backgroundIsActive);
  bookMap.classList.toggle('is-active', mapIsActive);
  logicOverview.classList.toggle('is-active', logicIsActive);
  responsesOverview.classList.toggle('is-active', responsesIsActive);
  responsesReprise.classList.toggle('is-active', repriseIsActive);
  theEnd.classList.toggle('is-active', endIsActive);
  stage.classList.toggle('is-ending', endIsActive);
  focus.classList.toggle('is-active', focusIsActive);
  intro.setAttribute('aria-hidden', p >= .1);
  intro.inert = p >= .1;
  overview.setAttribute('aria-hidden', !chapterIsActive);
  romansBackground.setAttribute('aria-hidden', !backgroundIsActive);
  bookMap.setAttribute('aria-hidden', !mapIsActive);
  bookMap.inert = !mapIsActive;
  logicOverview.setAttribute('aria-hidden', !logicIsActive);
  responsesOverview.setAttribute('aria-hidden', !responsesIsActive);
  responsesReprise.setAttribute('aria-hidden', !repriseIsActive);
  theEnd.setAttribute('aria-hidden', !endIsActive);
  focus.setAttribute('aria-hidden', !focusIsActive);
  copyButton.disabled = p < .1;
  const loveStep = raw < 2.20 || raw >= 2.85 ? -1 : raw < 2.35 ? 0 : raw < 2.50 ? 1 : raw < 2.67 ? 2 : 3;
  const loveCopyLabel = loveStep === 0 ? 'Romans 12 verses 9–13' : loveStep === 1 ? 'ways to show love from verses 9–13' : loveStep === 2 ? 'Romans 12 verses 14–21' : 'ways to show love from verses 14–21';
  if (!copyFeedback) copyButton.textContent = standingIsActive ? 'COPY SLIDE' : summaryIsActive ? 'COPY SUMMARY' : loveStep >= 0 ? loveStep % 2 ? 'COPY LIST' : 'COPY PASSAGE' : activeTheme >= 0 ? 'COPY SECTION' : responsesIsActive || repriseIsActive ? 'COPY RESPONSES' : logicIsActive ? 'COPY NOTES' : mapIsActive ? 'COPY OUTLINE' : backgroundIsActive ? 'COPY BACKGROUND' : 'COPY CHAPTER';
  copyButton.setAttribute('aria-label', standingIsActive ? 'Copy what it takes to stand up' : summaryIsActive ? 'Copy body, mind, and allegiance summary' : loveStep >= 0 ? `Copy ${loveCopyLabel}` : activeTheme >= 0 ? `Copy Romans 12 ${['1–2', '3–8', '9–21'][activeTheme]}` : responsesIsActive || repriseIsActive ? 'Copy three Romans 12 responses' : logicIsActive ? 'Copy Romans passage notes' : mapIsActive ? 'Copy Romans outline' : backgroundIsActive ? 'Copy Romans background' : 'Copy Romans 12');
  const navIndex = navButtons.reduce((active, button, index) =>
    raw >= checkpoints[Number(button.dataset.checkpoint)] - .02 ? index : active, 0);
  navButtons.forEach((button, index) => {
    button.classList.toggle('is-active', index === navIndex);
    if (index === navIndex) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  drawConnector();
  if (p >= 1.03 && p <= 1.34) drawVerseTwo();
  if (raw >= 1.63 && raw <= 2.24) drawServeAnnotations();
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
function fitPassages() {
  loveReadings.forEach(slide => {
    const reading = slide.querySelector('.passage-reading');
    const textNode = slide.querySelector('.continuous-text');
    const citation = slide.querySelector('.passage-citation');
    textNode.style.fontSize = '';
    let size = parseFloat(getComputedStyle(textNode).fontSize);
    const available = reading.clientHeight - citation.offsetHeight - parseFloat(getComputedStyle(citation).marginTop) - 8;
    while (textNode.scrollHeight > available && size > 13) {
      size -= .5;
      textNode.style.fontSize = `${size}px`;
    }
  });
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
  const duration = reducedMotion.matches ? 0 : [11, 12, 13, 14, 17, 19].includes(index) ? 2400 : quick ? 1100 : 1700;
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

// A phone swipe advances one beat. Native momentum scrolling can otherwise skip
// the Romans background slide and snap back toward a later checkpoint.
let touchGesture = null;
stage.addEventListener('touchstart', event => {
  if (event.touches.length !== 1 || event.target.closest('a,button')) {
    touchGesture = null;
    return;
  }
  touchGesture = {x:event.touches[0].clientX, y:event.touches[0].clientY};
}, {passive:true});
stage.addEventListener('touchmove', event => {
  if (!touchGesture || event.touches.length !== 1) {
    touchGesture = null;
    return;
  }
  const dx = event.touches[0].clientX - touchGesture.x;
  const dy = event.touches[0].clientY - touchGesture.y;
  if (Math.abs(dy) > 4 && Math.abs(dy) > Math.abs(dx) && !window.getSelection()?.toString()) event.preventDefault();
}, {passive:false});
stage.addEventListener('touchend', event => {
  if (!touchGesture || event.changedTouches.length !== 1) return;
  const dx = event.changedTouches[0].clientX - touchGesture.x;
  const dy = event.changedTouches[0].clientY - touchGesture.y;
  touchGesture = null;
  if (Math.abs(dy) > 38 && Math.abs(dy) > Math.abs(dx) * 1.2 && !window.getSelection()?.toString()) step(dy < 0 ? 1 : -1);
}, {passive:true});
stage.addEventListener('touchcancel', () => { touchGesture = null; }, {passive:true});

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
  const raw = progress();
  const p = logicalProgress(raw);
  const summaryIsActive = raw >= 1.53 && raw < 1.70;
  const standingIsActive = raw >= 2.055 && raw < 2.19;
  const loveSource = raw < 2.20 || raw >= 2.85 ? null : raw < 2.35 ? loveReadings[0].querySelector('.passage-text') : raw < 2.50 ? lovePracticeSlides[0] : raw < 2.67 ? loveReadings[1].querySelector('.passage-text') : lovePracticeSlides[1];
  const theme = summaryIsActive || raw >= 2.20 ? null : raw >= 1.02 ? raw >= 1.70 ? themeServe : themeWorship : null;
  const source = summaryIsActive ? worshipSummary : raw >= 2.85 ? responsesReprise : raw >= .85 && raw < 1.02 ? responsesOverview : raw >= .51 ? logicOverview : raw >= .40 ? bookMap : raw >= .23 ? romansBackground : document.querySelector('.chapter-text');
  const text = (standingIsActive ? standingSlide.innerText : loveSource ? loveSource.innerText : theme
    ? [...theme.querySelectorAll('.verse, .passage-text')].map(node => node.textContent).join(' ')
    : source.innerText).replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
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
  if ([11, 12, 13, 14, 17, 19].includes(index)) {
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

function fitAll() { fitHandNotes(); fitPassages(); }
window.addEventListener('resize', fitAll);
document.fonts?.ready.then(fitAll);
fitAll();
const requestedStep = Number(new URLSearchParams(location.search).get('step'));
if (Number.isInteger(requestedStep) && requestedStep > 0 && requestedStep < checkpoints.length) {
  requestAnimationFrame(() => {
    window.scrollTo(0, track.offsetTop + checkpoints[requestedStep] / storyEnd * Math.max(1, track.offsetHeight - window.innerHeight));
    scheduleUpdate();
  });
}
