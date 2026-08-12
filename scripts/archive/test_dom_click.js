global.requestAnimationFrame = (fn) => fn();
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const articlesJS = fs.readFileSync('data/articles.js', 'utf8');

// Update initPixelStarsCanvas guard in app.js
let appJS = fs.readFileSync('app.js', 'utf8');
appJS = appJS.replace(
  'if (!canvas) return;\n    const ctx = canvas.getContext(\'2d\');',
  'if (!canvas || typeof canvas.getContext !== \'function\') return;\n    const ctx = canvas.getContext(\'2d\');'
);

fs.writeFileSync('app.js', appJS, 'utf-8');
console.log('1. Updated initPixelStarsCanvas in app.js with context guard');

// Create complete DOM integration test runner
const elements = {};
let documentClickListeners = [];

function getOrCreateElement(id, tagName = 'DIV') {
  if (!elements[id]) {
    elements[id] = {
      id,
      tagName: tagName.toUpperCase(),
      style: { display: '' },
      classList: {
        _classes: new Set(),
        add(c) { this._classes.add(c); },
        remove(c) { this._classes.delete(c); },
        toggle(c, force) { if (force !== undefined) { force ? this._classes.add(c) : this._classes.delete(c); } else { this._classes.has(c) ? this._classes.delete(c) : this._classes.add(c); } },
        contains(c) { return this._classes.has(c); }
      },
      setAttribute(k, v) { this[k] = v; },
      getAttribute(k) { return this[k] || null; },
      querySelectorAll() { return []; },
      querySelector() { return null; },
      addEventListener() {},
      removeEventListener() {},
      appendChild() {},
      contains() { return false; },
      textContent: '',
      innerHTML: '',
      value: '',
      closest(selector) {
        if (selector === '[data-wiki]' && this['data-wiki']) return this;
        return null;
      }
    };
  }
  return elements[id];
}

global.window = {
  scrollTo: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {},
  innerWidth: 1200,
  innerHeight: 800,
  scrollY: 0
};

global.document = {
  body: getOrCreateElement('body', 'BODY'),
  documentElement: getOrCreateElement('html', 'HTML'),
  getElementById: (id) => getOrCreateElement(id),
  querySelectorAll: () => [],
  querySelector: () => null,
  readyState: 'complete',
  addEventListener: (event, fn) => {
    if (event === 'click') {
      documentClickListeners.push(fn);
    }
  }
};

global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};

eval(articlesJS);
eval(appJS);

console.log('2. App initialized, document click listeners registered:', documentClickListeners.length);

// Simulate clicking on Tree of Life card
const testCard = getOrCreateElement('testCard');
testCard['data-wiki'] = 'tree-of-life-kabbalah';

let defaultPrevented = false;
const mockEvent = {
  target: testCard,
  preventDefault: () => { defaultPrevented = true; }
};

documentClickListeners.forEach(listener => listener(mockEvent));

const portalView = getOrCreateElement('initiatoryPortalView');
const articleView = getOrCreateElement('articleReaderView');
const titleEl = getOrCreateElement('articleMainTitle');
const textEl = getOrCreateElement('articleMainText');

console.log('--- Integration Test Results ---');
console.log('Portal View display:', portalView.style.display); // Should be 'none'
console.log('Article View display:', articleView.style.display); // Should be 'block'
console.log('Article Title:', titleEl.textContent); // Should be 'Tree of life (Kabbalah)'
console.log('Article Text length:', textEl.innerHTML.length); // Should be > 0
console.log('Default Prevented:', defaultPrevented);

if (portalView.style.display === 'none' && articleView.style.display === 'block' && titleEl.textContent === 'Tree of life (Kabbalah)' && textEl.innerHTML.length > 0) {
  console.log('\n✓ INTEGRATION TEST PASSED 100%!');
} else {
  console.error('\n✗ INTEGRATION TEST FAILED!');
}
