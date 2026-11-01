const sectionSteps = {chapter:1,context:3,worship:10,serve:16,love:21,takeaways:25};
const presentationLink = document.getElementById('presentation-link');
const readerSections = [...document.querySelectorAll('main > section, main > article')].filter(node => node.id in sectionSteps);
const sectionLinks = [...document.querySelectorAll('.reader-nav a')];
let textScale = 100;

function setTextScale(next) {
  textScale = Math.max(90, Math.min(200, next));
  document.documentElement.style.setProperty('--reading-scale', String(textScale / 100));
  document.getElementById('text-smaller').disabled = textScale === 90;
  document.getElementById('text-larger').disabled = textScale === 200;
  document.getElementById('text-smaller').setAttribute('aria-label', `Make text smaller. Current size ${textScale} percent`);
  document.getElementById('text-larger').setAttribute('aria-label', `Make text larger. Current size ${textScale} percent`);
}
document.getElementById('text-smaller').addEventListener('click', () => setTextScale(textScale - 20));
document.getElementById('text-larger').addEventListener('click', () => setTextScale(textScale + 20));
setTextScale(100);

function updateCurrentSection() {
  const threshold = Math.min(210, window.innerHeight * .4);
  const current = readerSections.reduce((active, section) => section.getBoundingClientRect().top <= threshold ? section : active, readerSections[0]);
  presentationLink.href = `index.html?step=${sectionSteps[current.id]}`;
  sectionLinks.forEach(link => {
    if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', updateCurrentSection, {passive:true});
window.addEventListener('resize', updateCurrentSection);
window.addEventListener('hashchange', () => requestAnimationFrame(updateCurrentSection));

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function noteText(source, selector) {
  const note = source.querySelector(selector);
  if (!note) throw new Error(`Missing study note: ${selector}`);
  return note.getAttribute('aria-label') || [...note.querySelectorAll('span')].map(line => line.textContent.trim()).join(' ');
}

function addReflection(source, destinationId, label, selector) {
  const card = node('article', 'reflection-card');
  card.append(node('span', '', label), node('p', '', noteText(source, selector)));
  document.getElementById(destinationId).append(card);
}

function appendPassage(source, selector, destinationId) {
  const original = source.querySelector(selector);
  if (!original) throw new Error(`Missing passage: ${selector}`);
  const passage = original.cloneNode(true);
  passage.removeAttribute('id');
  passage.className = 'reader-scripture';
  passage.querySelectorAll('span').forEach(span => {
    if (span.querySelector('svg')) span.classList.add('reader-circled');
  });
  passage.querySelectorAll('#testing-anchor,#faith-underline-anchor,#gifts-underline-anchor').forEach(element => element.classList.add('reader-underlined'));
  passage.querySelectorAll('svg').forEach(svg => svg.remove());
  passage.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
  document.getElementById(destinationId).append(passage);
}

async function buildReadingView() {
  const response = await fetch('index.html');
  if (!response.ok) throw new Error(`Could not load Romans 12 (${response.status})`);
  const source = new DOMParser().parseFromString(await response.text(), 'text/html');

  const chapter = source.querySelector('.chapter-text');
  if (!chapter) throw new Error('Romans 12 chapter text is missing');
  const chapterReading = document.getElementById('chapter-reading');
  chapterReading.replaceChildren(...[...chapter.children].map(element => element.cloneNode(true)));
  chapterReading.removeAttribute('aria-live');

  const map = document.getElementById('reader-map');
  source.querySelectorAll('.map-card').forEach(card => {
    const article = node('article');
    article.append(node('span', '', card.querySelector('.map-range')?.textContent || ''), node('h3', '', card.querySelector('h3')?.textContent || ''));
    map.append(article);
  });
  const resources = document.getElementById('reader-resource-links');
  source.querySelectorAll('.map-resources a').forEach(link => resources.append(link.cloneNode(true)));

  const logic = document.getElementById('reader-logic');
  source.querySelectorAll('.logic-card').forEach((card, index) => {
    const article = node('article');
    const quote = source.querySelector(`.quote-panel[data-quote="${index}"]`);
    const blockquote = node('blockquote');
    if (quote) {
      blockquote.append(node('span', '', quote.querySelector('span')?.textContent || ''));
      blockquote.append(document.createTextNode(quote.textContent.replace(quote.querySelector('span')?.textContent || '', '').trim()));
    }
    article.append(node('span', '', card.querySelector('.logic-meta span:last-child')?.textContent || ''), node('h3', '', card.querySelector('h3')?.textContent || ''), node('p', '', card.querySelector('p')?.textContent || ''), blockquote);
    logic.append(article);
  });
  const conclusion = source.querySelector('.logic-conclusion');
  const readerConclusion = document.getElementById('reader-conclusion');
  readerConclusion.append(node('h3', '', conclusion.querySelector('.definition-word')?.textContent || 'Consecration'), node('p', '', conclusion.querySelector('.definition-text')?.textContent || ''));
  readerConclusion.append(node('h3', 'reader-question', conclusion.querySelector('.logic-conclusion-copy h3')?.textContent || ''));
  readerConclusion.append(node('p', '', conclusion.querySelector('.logic-conclusion-copy p')?.textContent || ''));

  appendPassage(source, '#focus .verse', 'reader-worship');
  addReflection(source, 'worship-reflections', 'MERCIES OF GOD', '#annotation .hand-note');
  addReflection(source, 'worship-reflections', 'BODIES · LIVING SACRIFICE', '#living-annotation .hand-note');
  addReflection(source, 'worship-reflections', 'CONFORMED · TRANSFORMED · J. B. PHILLIPS', '#translation-note .hand-note');
  addReflection(source, 'worship-reflections', 'MIND · TEST AND DISCERN', '#testing-note .hand-note');
  const takeaway = document.getElementById('worship-takeaway');
  takeaway.append(node('h3', '', source.querySelector('.worship-summary h2')?.textContent || 'God wants all of you.'));
  const takeawayList = node('ul');
  source.querySelectorAll('.summary-three article').forEach(article => takeawayList.append(node('li', '', `${article.querySelector('h3')?.textContent || ''} ${article.querySelector('p')?.textContent || ''}`)));
  takeaway.append(takeawayList);

  appendPassage(source, '#serve-34 .passage-text', 'reader-serve-34');
  addReflection(source, 'serve-34-reflections', 'GOD HAS ASSIGNED', '#serve-34-note .hand-note');
  appendPassage(source, '#serve-58 .passage-text', 'reader-serve-58');
  addReflection(source, 'serve-58-reflections', 'ONE BODY · GIFTS OF GRACE', '#serve-58-note .hand-note');
  const standingList = source.querySelector('.standing-list');
  if (standingList) document.getElementById('reader-standing-list').replaceChildren(...[...standingList.children].map(item => item.cloneNode(true)));

  appendPassage(source, '#love-9-13 .passage-text', 'reader-love-9-13');
  appendPassage(source, '#love-14-21 .passage-text', 'reader-love-14-21');
  for (const range of ['9-13','14-21']) {
    const list = source.querySelector(`#love-actions-${range} .practice-grid`);
    if (list) document.getElementById(`reader-actions-${range}`).replaceChildren(...[...list.children].map(item => item.cloneNode(true)));
  }
  const responses = document.getElementById('reader-responses');
  source.querySelectorAll('#responses-overview .response-list article').forEach(article => {
    const card = node('article');
    card.append(node('span', '', article.querySelector(':scope > span')?.textContent || ''), node('h3', '', article.querySelector('.response-copy')?.textContent || ''));
    responses.append(card);
  });

  if (location.hash && document.getElementById(location.hash.slice(1))) {
    requestAnimationFrame(() => document.getElementById(location.hash.slice(1)).scrollIntoView());
  }
  updateCurrentSection();
}

buildReadingView().catch(error => {
  const chapter = document.getElementById('chapter-reading');
  chapter.replaceChildren(node('p', '', 'The reading view could not load. Please try reloading the page, or open the presentation view.'));
  console.error(error);
});
