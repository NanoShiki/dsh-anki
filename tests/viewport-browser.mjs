// Real Chromium, complete Workspace viewport regression. Run: node tests/viewport-browser.mjs
// Only synthetic state and workspace-owned browser profiles; no DSH/Anki accounts or data.
// Optional: VIEWPORT_BASELINE_ONLY=1 proves the immutable old-layout failure without testing a fix.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

const here = path.dirname(fileURLToPath(import.meta.url));
const project = path.dirname(here);
const scope = path.join(here, 'viewport-fixture');
fs.mkdirSync(scope, { recursive: true });
assert.equal(spawnSync('git', ['check-ignore', path.relative(project, scope)], { cwd: project, encoding: 'utf8' }).status, 0,
  'all generated viewport artifacts must be ignored');
const baselineCommit = '1e4c2698daea0d155ae96512db57a301c8b765da';
const baselineRun = spawnSync('git', ['show', `${baselineCommit}:client.js`], { cwd: project, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
assert.ifError(baselineRun.error);
assert.equal(baselineRun.status, 0, 'immutable baseline available');
const baseline = baselineRun.stdout;
const sourcePath = path.join(project, 'client.js');
const current = fs.readFileSync(sourcePath, 'utf8');
const digest = (value) => createHash('sha256').update(value).digest('hex');
const baselineOnly = process.env.VIEWPORT_BASELINE_ONLY === '1';
const browser = process.env.VIEWPORT_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
assert.ok(fs.existsSync(browser), 'installed Chromium browser exists');
const matrix = [
  { name: 'wide', width: 1440, height: 960, zoom: 1 },
  { name: 'narrow', width: 470, height: 960, zoom: 1 },
  { name: 'short', width: 1100, height: 600, zoom: 1 },
  { name: 'zoom150', width: 1050, height: 900, zoom: 1.5 },
  { name: 'narrow-zoom150', width: 570, height: 960, zoom: 1.5 },
];
const scenarios = ['browse', 'add', 'review', 'transfer', 'sync', 'sync-full'];
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const unitless = new Set(['opacity', 'flex', 'flexGrow', 'flexShrink', 'order', 'fontWeight', 'lineHeight', 'zIndex']);

function workspaceMarkup(source, scenario) {
  let bundle, main, dictionaries;
  const stack = [];
  const Fragment = Symbol('fragment');
  const fieldNames = ['Question', 'Answer', 'Reading', 'Meaning', 'Examples', 'Source'];
  const fields = Object.fromEntries(fieldNames.map((name) => [name, `${name}: synthetic editor draft\n`.repeat(20)]));
  const decks = Array.from({ length: 60 }, (_, index) => ({
    id: index + 1, name: `Deck ${index + 1} · 中文与 English practice`, total: 50, newCount: 12, learnCount: 3, reviewCount: 7,
  }));
  const models = [{ id: 1, name: 'Synthetic multi-field type', fields: fieldNames, type: 0 }];
  const note = { id: 1, model: { id: 1 }, fields, tags: ['synthetic'], modified: 1, cards: [{ id: 1, suspended: false }] };
  const snapshot = {
    loggedIn: scenario === 'sync-full', account: 'synthetic account', active: false, phase: 'idle',
    settings: { autoSync: false }, lastSyncAt: 0,
    ...(scenario === 'sync-full' ? { pendingFull: { token: 'synthetic-not-a-real-token', allowedDirections: ['upload', 'download'], localNoteCount: 0 } } : {}),
  };
  const values = {
    Workspace: {
      status: { noteCount: 100, cardCount: 100, version: 'synthetic engine', collectionPath: '/synthetic/isolated-workspace/collection.anki2', importsDir: '/synthetic/isolated-workspace/imports', undo: { available: true } },
      decks, models, deckId: '2', tab: scenario === 'sync-full' ? 'sync' : scenario, initializing: false,
      deckName: 'New synthetic deck', rename: 'Renamed synthetic deck',
      notes: { total: 100, items: Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        preview: `${index + 1}. 中文与 English synthetic preview: a genuinely long question that wraps across two lines and preserves useful content when the results list is narrow.`,
        model: 'Synthetic bilingual model', deck: 'Practice · 中文', cards: [{ suspended: index % 3 === 0 }],
      })) },
      note, editFields: fields, editTags: 'synthetic fixture', modelId: '1', addDeckId: '2', addFields: fields, addTags: 'synthetic',
      card: { token: 'synthetic-card', question: '<p>Synthetic question</p>', deckName: decks[1].name, remaining: 50 },
      revealed: { answer: '<p>Synthetic answer</p>', buttons: [1, 2, 3, 4].map((rating) => ({ rating, interval: `${rating} days` })) },
      importName: 'synthetic.apkg', exportName: 'synthetic-export.apkg', exportPath: '/synthetic/isolated-workspace/exports/synthetic-export.apkg', syncState: snapshot,
    },
    SyncPanel: { snapshot, username: '', password: '', selection: scenario === 'sync-full' ? { token: snapshot.pendingFull.token, direction: 'download', consent: false } : { token: null, direction: '', consent: false } },
    CardFrame: { document: { html: '<!doctype html><meta charset="utf-8"><body><p>Synthetic, inert card content.</p></body>', missing: false }, failure: false },
  };
  const React = {
    Fragment,
    createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
    useState(initial) {
      const frame = stack.at(-1);
      assert.ok(frame, 'state hook runs within a rendered component');
      const name = frame.names[frame.index++];
      assert.ok(name, `state hook name found in ${frame.name}`);
      const predefined = values[frame.name] || {};
      return [Object.hasOwn(predefined, name) ? predefined[name] : typeof initial === 'function' ? initial() : initial, () => {}];
    },
    useRef: (value) => ({ current: value }), useEffect() {}, useId: () => 'viewport-fixture', useSyncExternalStore() {},
  };
  const DOMParser = class {
    parseFromString() {
      return { createElement(name) {
        assert.equal(name, 'template');
        const content = { textContent: '' };
        return { content, set innerHTML(value) { assert.doesNotMatch(value, /[<>]/, 'preview fixture is plain text'); content.textContent = value; } };
      } };
    }
  };
  vm.runInNewContext(source, { DOMParser, window: { __ModuleLoader__: { load(value) { bundle = value; } } } });
  const definition = bundle.factory((name) => { assert.equal(name, 'react'); return React; });
  const ctx = {
    effect: (callback) => callback(),
    locale: { register(_namespace, value) { dictionaries = value; }, bind: () => (key) => dictionaries.en[key], subscribe() {}, getSnapshot: () => ({ revision: 1 }) },
    slots: { inject: (_slot, callback) => callback(), register(meta, component) { if (meta.name === 'main') main = { meta, component }; } },
    connection: { rpc: { call() { throw new Error('Layout fixture must never request backend operations'); } } }, layout: {},
  };
  definition.apply(ctx);
  assert.ok(main, 'actual native main-slot component registered');
  function render(node) {
    if (Array.isArray(node)) return node.map(render).join('');
    if (node === undefined || node === null || typeof node === 'boolean') return '';
    if (typeof node !== 'object') return escape(node);
    if (node.type === Fragment) return render(node.children);
    if (typeof node.type === 'function') {
      const names = [...node.type.toString().matchAll(/const\s*\[\s*(\w+)\s*,[^\]]+\]\s*=\s*React\.useState\(/g)].map((match) => match[1]);
      const frame = { name: node.type.name, names, index: 0 };
      stack.push(frame);
      let result;
      try { result = node.type({ ...node.props, children: node.children }); }
      finally { stack.pop(); }
      assert.equal(frame.index, names.length, `${frame.name} state slots are faithfully seeded`);
      return render(result);
    }
    assert.equal(typeof node.type, 'string');
    const attributes = [];
    for (let [name, value] of Object.entries(node.props)) {
      if (name === 'key' || name === 'ref' || name === 'children' || /^on[A-Z]/.test(name) || value === undefined || value === null || value === false) continue;
      if (name === 'style') {
        value = Object.entries(value).map(([property, setting]) => `${property.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase())}:${typeof setting === 'number' && setting !== 0 && !unitless.has(property) ? setting + 'px' : setting}`).join(';');
      }
      name = ({ className: 'class', htmlFor: 'for', srcDoc: 'srcdoc', tabIndex: 'tabindex', strokeWidth: 'stroke-width', strokeLinecap: 'stroke-linecap', strokeLinejoin: 'stroke-linejoin' })[name] || name;
      if (node.type === 'textarea' && name === 'value') continue;
      attributes.push(value === true ? name : `${name}="${escape(value)}"`);
    }
    const open = `<${node.type}${attributes.length ? ' ' + attributes.join(' ') : ''}>`;
    if (['input', 'meta', 'img', 'br', 'hr', 'source', 'link'].includes(node.type)) return open;
    const contents = node.type === 'style' ? node.children.join('') : node.type === 'textarea' ? escape(node.props.value || '') : render(node.children);
    return `${open}${contents}</${node.type}>`;
  }
  const markup = render({ type: main.component, props: main.meta.inject(), children: [] });
  const css = source.match(/const CSS = `([\s\S]*?)`;/)?.[1];
  assert.ok(css && markup.includes(`<style>${css}</style>`), 'actual extracted CSS is used verbatim, without corrective overrides');
  return { markup, cssSHA256: digest(css) };
}

// This script executes in Chromium. It measures the entire Workspace, not a detached list.
function browserMeasurements() {
  const output = { userAgent: navigator.userAgent, viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio }, scenarios: [] };
  const mount = document.getElementById('host-slot');
  const outerElements = () => [document.scrollingElement, document.getElementById('host-shell'), document.getElementById('host-main'), mount, mount.querySelector('.dsh-anki')];
  const rounded = (value) => Math.round(value * 100) / 100;
  const rect = (element) => {
    const box = element.getBoundingClientRect();
    return { top: rounded(box.top), bottom: rounded(box.bottom), left: rounded(box.left), right: rounded(box.right), width: rounded(box.width), height: rounded(box.height) };
  };
  const fullyVisible = (element) => {
    if (!element || !element.getClientRects().length) return false;
    const box = element.getBoundingClientRect();
    if (box.width < 1 || box.height < 1) return false;
    let clip = { top: 0, bottom: innerHeight, left: 0, right: innerWidth };
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      const style = getComputedStyle(parent), bounds = parent.getBoundingClientRect();
      if (/(auto|scroll|hidden|clip)/.test(style.overflowY)) { clip.top = Math.max(clip.top, bounds.top); clip.bottom = Math.min(clip.bottom, bounds.bottom); }
      if (/(auto|scroll|hidden|clip)/.test(style.overflowX)) { clip.left = Math.max(clip.left, bounds.left); clip.right = Math.min(clip.right, bounds.right); }
    }
    return box.top >= clip.top - 2 && box.bottom <= clip.bottom + 2 && box.left >= clip.left - 2 && box.right <= clip.right + 2;
  };
  const outerState = () => outerElements().filter(Boolean).map((element) => ({
    element: element.id || element.className || element.tagName,
    clientHeight: element.clientHeight, scrollHeight: element.scrollHeight, clientWidth: element.clientWidth, scrollWidth: element.scrollWidth,
    scrollTop: rounded(element.scrollTop), scrollLeft: rounded(element.scrollLeft), rect: rect(element),
  }));
  const hasOuterOverflow = () => outerState().some((value) => value.scrollHeight > value.clientHeight + 2 || value.scrollWidth > value.clientWidth + 2 || Math.abs(value.scrollTop) > 2 || Math.abs(value.scrollLeft) > 2);
  const buttonWithText = (root, label) => [...root.querySelectorAll('button')].find((element) => element.textContent.trim() === label);
  const reachable = (element) => {
    if (!element) return { found: false, visible: false, outerScrolled: false };
    const before = outerState();
    element.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    const after = outerState();
    return { found: true, visible: fullyVisible(element), rect: rect(element), outerScrolled: after.some((value, index) => Math.abs(value.scrollTop - before[index].scrollTop) > 2 || Math.abs(value.scrollLeft - before[index].scrollLeft) > 2) };
  };
  for (const fixture of fixtures) {
    mount.innerHTML = fixture.markup;
    window.scrollTo(0, 0);
    const root = mount.querySelector('.dsh-anki');
    const main = root.querySelector('.dsh-anki-main');
    const checks = [];
    const check = (name, passed, detail) => checks.push({ name, passed: !!passed, ...(detail === undefined ? {} : { detail }) });
    check('entire native Workspace rendered', !!root.querySelector('.dsh-anki-head') && !!root.querySelector('.dsh-anki-stats') && !!root.querySelector('.dsh-anki-aside') && !!root.querySelector('[role=tabpanel]') && !!root.querySelector('.dsh-anki-foot'));
    const initialOuter = outerState();
    check('no document, host or whole-Workspace overflow', !hasOuterOverflow(), initialOuter);
    check('engine footer remains visible', fullyVisible(root.querySelector('.dsh-anki-foot')));
    check('tab navigation is visible', fullyVisible(root.querySelector('.dsh-anki-tabs')));
    if (fixture.scenario === 'browse') {
      const list = root.querySelector('.dsh-anki-list');
      const rows = [...list.querySelectorAll('.dsh-anki-note')];
      const pager = root.querySelector('.dsh-anki-pagination');
      check('50 real markup note rows', rows.length === 50);
      check('results list has nontrivial viewport and internal overflow', list.clientHeight >= 40 && list.scrollHeight > list.clientHeight + 2, { clientHeight: list.clientHeight, scrollHeight: list.scrollHeight, rect: rect(list) });
      check('pager visible before scrolling', fullyVisible(pager), rect(pager));
      const previousOuter = outerState();
      list.scrollTop = list.scrollHeight;
      check('50th result entirely visible after list-only scroll', fullyVisible(rows.at(-1)), { list: rect(list), lastRow: rect(rows.at(-1)) });
      check('pager visible after list-only scroll', fullyVisible(pager), rect(pager));
      check('list-only scroll never moves whole page', outerState().every((value, index) => Math.abs(value.scrollTop - previousOuter[index].scrollTop) <= 2));
      const editor = root.querySelector('.dsh-anki-editor');
      check('full editor has six actual field textareas', editor.querySelectorAll('textarea').length === 6);
      for (const label of editor.querySelectorAll('.dsh-anki-field > span')) {
        const reached = reachable(label);
        check(`editor field ${label.textContent} reachable internally`, reached.visible && !reached.outerScrolled, reached);
      }
      for (const [name, element] of [['editor save', editor.querySelector('button[type=submit]')], ['editor suspend/footer', buttonWithText(editor, 'Suspend cards')]]) {
        const reached = reachable(element);
        check(`${name} reachable by internal scroll`, reached.found && reached.visible && !reached.outerScrolled, reached);
      }
    } else {
      const panel = root.querySelector('[role=tabpanel] > div:not([hidden])');
      if (fixture.scenario === 'sync-full') check('full-sync warning, consent and disabled confirmation are rendered', !!panel.querySelector('.dsh-anki-full-sync [role=alert]') && !!panel.querySelector('.dsh-anki-full-sync input[type=checkbox]') && !!panel.querySelector('.dsh-anki-full-sync button.dsh-anki-primary[disabled]'));
      const targets = fixture.scenario === 'add' ? [panel.querySelector('button[type=submit]')]
        : fixture.scenario === 'review' ? [root.querySelector('.dsh-anki-review-footer'), ...root.querySelectorAll('.dsh-anki-rating')]
          : fixture.scenario === 'transfer' ? [...panel.querySelectorAll('button[type=submit]'), panel.querySelector('.dsh-anki-code')]
            : fixture.scenario === 'sync-full' ? [buttonWithText(panel, 'Not now'), ...panel.querySelectorAll('.dsh-anki-full-sync button')]
              : [panel.querySelector('button[type=submit]'), panel.querySelector('.dsh-anki-check')];
      check('non-browse terminal controls found', targets.length > 0 && targets.every(Boolean));
      for (const [index, element] of targets.entries()) {
        const reached = reachable(element);
        check(`tab terminal control ${index + 1} reachable by internal scroll`, reached.found && reached.visible && !reached.outerScrolled, reached);
      }
    }
    const aside = root.querySelector('.dsh-anki-aside');
    const decks = aside.querySelector('.dsh-anki-decks');
    check('60 decks plus all-decks control present', decks.querySelectorAll('button').length === 61);
    const lastDeck = reachable(decks.querySelector('button:last-child'));
    check('last deck reachable by internal scroll', lastDeck.found && lastDeck.visible && !lastDeck.outerScrolled, lastDeck);
    for (const [index, element] of [...aside.querySelectorAll('form input, form button[type=submit]'), buttonWithText(aside, 'Delete deck…')].entries()) {
      const reached = reachable(element);
      check(`deck management control ${index + 1} reachable internally`, reached.found && reached.visible && !reached.outerScrolled, reached);
    }
    for (const element of root.querySelectorAll('[role=tab]')) {
      const reached = reachable(element);
      check(`tab ${element.textContent} accessible internally`, reached.visible && !reached.outerScrolled, reached);
    }
    check('no outer page overflow or movement after interactions', !hasOuterOverflow(), outerState());
    const failures = checks.filter((value) => !value.passed);
    output.scenarios.push({ scenario: fixture.scenario, passed: failures.length === 0, checks, failures });
  }
  // Screenshot the measured browse state, at the final row and editor/deck controls.
  mount.innerHTML = fixtures.find((fixture) => fixture.scenario === 'browse').markup;
  const root = mount.querySelector('.dsh-anki');
  const list = root.querySelector('.dsh-anki-list');
  list.scrollTop = list.scrollHeight;
  for (const element of root.querySelectorAll('.dsh-anki-editor,.dsh-anki-aside,.dsh-anki-decks')) element.scrollTop = element.scrollHeight;
  output.capture = { outer: outerState(), list: rect(list), lastRow: rect(list.querySelector('.dsh-anki-note:last-child')), pager: rect(root.querySelector('.dsh-anki-pagination')) };
  document.getElementById('results').textContent = JSON.stringify(output);
}

async function runChromium(html, image, profile, viewport, stderrPath) {
  const args = ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-extensions', '--disable-features=msEdgeSidebarV2', '--remote-debugging-address=127.0.0.1', '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'];
  const child = spawn(browser, args, { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true });
  const exited = new Promise((resolve) => child.once('exit', resolve));
  let stderr = '', socket;
  const timeout = (promise, label, milliseconds = 30000) => {
    let timer;
    return Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label} timed out`)), milliseconds); timer.unref(); })]).finally(() => clearTimeout(timer));
  };
  try {
    const address = await timeout(new Promise((resolve, reject) => {
      child.once('error', reject);
      child.once('exit', (code) => reject(new Error(`Owned Chromium exited during startup: ${code}`)));
      child.stderr.on('data', (data) => { stderr += data; const match = stderr.match(/DevTools listening on (ws:\/\/127\.0\.0\.1:\d+\/devtools\/browser\/[^\s]+)/); if (match) resolve(match[1]); });
    }), 'Chromium debugging address');
    socket = new WebSocket(address);
    await timeout(new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); }), 'Chromium WebSocket');
    let id = 0;
    const pending = new Map(), events = [];
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id && pending.has(message.id)) {
        const callback = pending.get(message.id); pending.delete(message.id);
        if (message.error) callback.reject(new Error(`${callback.method}: ${JSON.stringify(message.error)}`)); else callback.resolve(message.result);
      } else {
        for (const event of events) if (message.method === event.method && message.sessionId === event.sessionId) event.resolve(message.params);
      }
    });
    socket.addEventListener('close', () => { for (const callback of pending.values()) callback.reject(new Error('Owned Chromium debugging connection closed')); pending.clear(); });
    const command = (method, params = {}, sessionId) => timeout(new Promise((resolve, reject) => {
      const messageId = ++id; pending.set(messageId, { resolve, reject, method });
      socket.send(JSON.stringify({ id: messageId, method, params, ...(sessionId ? { sessionId } : {}) }));
    }), method);
    const { targetId } = await command('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await command('Target.attachToTarget', { targetId, flatten: true });
    await command('Page.enable', {}, sessionId);
    const width = Math.round(viewport.width / viewport.zoom), height = Math.round(viewport.height / viewport.zoom);
    // Browser zoom semantics: shrink CSS viewport and increase DPR, keeping physical capture dimensions fixed.
    await command('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: viewport.zoom, mobile: false }, sessionId);
    const loaded = new Promise((resolve) => events.push({ method: 'Page.loadEventFired', sessionId, resolve }));
    await command('Page.navigate', { url: pathToFileURL(html).href }, sessionId);
    await timeout(loaded, 'fixture load');
    const evaluation = await command('Runtime.evaluate', { expression: 'document.getElementById("results").textContent', returnByValue: true }, sessionId);
    assert.ok(!evaluation.exceptionDetails, 'fixture evaluation succeeds');
    const measured = JSON.parse(evaluation.result.value);
    assert.equal(measured.viewport?.width, width, 'CDP forces the requested CSS viewport width (no minimum-window fallback)');
    assert.equal(measured.viewport?.height, height, 'CDP forces the requested CSS viewport height');
    assert.equal(measured.viewport?.dpr, viewport.zoom, '150% emulation uses exact device pixel ratio');
    const capture = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }, sessionId);
    fs.writeFileSync(image, Buffer.from(capture.data, 'base64'));
    return measured;
  } finally {
    fs.writeFileSync(stderrPath, stderr);
    // This process belongs solely to the unique fixture profile; never enumerate or terminate other browsers.
    if (socket?.readyState === WebSocket.OPEN) socket.close();
    if (child.exitCode === null && child.signalCode === null) child.kill();
    await timeout(exited, 'owned browser shutdown', 10000);
  }
}

const reports = [];
for (const viewport of matrix) {
  for (const kind of baselineOnly ? ['old'] : ['old', 'fixed']) {
    const source = kind === 'old' ? baseline : current;
    const fixtures = scenarios.map((scenario) => ({ scenario, ...workspaceMarkup(source, scenario) }));
    const stem = `${viewport.name}-${kind}`;
    const html = path.join(scope, `${stem}.html`);
    // Only the synthetic host shell is sized/styled here. No plugin selector or CSS override is appended.
    // CDP emulates 150% browser zoom via smaller CSS viewport and matching DPR; no plugin CSS is changed.
    const document = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; frame-src 'self'"><title>Isolated full Workspace viewport regression</title><style>html,body{margin:0;width:100%;height:100%;font-family:Arial,sans-serif;background:#fff;color:#222}#host-shell{display:flex;flex-direction:column;width:100vw;height:100vh;--dsw-alias-label-primary:#222;--dsw-alias-label-secondary:#555;--dsw-alias-label-tertiary:#666;--dsw-alias-background-primary:#fff;--dsw-alias-state-error-primary:#b22}#host-toolbar{box-sizing:border-box;flex:0 0 40px;padding:10px 16px;border-bottom:1px solid #ddd;font-size:13px}#host-main{display:flex;flex:1;min-height:0;min-width:0}#host-slot{position:relative;flex:1;min-height:0;min-width:0;overflow:auto}</style></head><body><div id="host-shell"><div id="host-toolbar">Synthetic DSH host · ${stem}</div><main id="host-main"><div id="host-slot"></div></main></div><pre id="results" hidden></pre><script>const fixtures=${JSON.stringify(fixtures).replaceAll('<', '\\u003c')};try{(${browserMeasurements.toString()})();}catch(error){document.getElementById('results').textContent=JSON.stringify({scriptError:String(error),stack:error.stack});}</script></body></html>`;
    fs.writeFileSync(html, document);
    const profile = fs.mkdtempSync(path.join(scope, 'isolated-profile-'));
    const image = path.join(scope, `${stem}.png`);
    let measured;
    try { measured = await runChromium(html, image, profile, viewport, path.join(scope, `${stem}-stderr.txt`)); }
    finally {
      assert.equal(path.dirname(fs.realpathSync(profile)), fs.realpathSync(scope));
      assert.ok(path.basename(profile).startsWith('isolated-profile-'));
      try { fs.rmSync(profile, { recursive: true, force: true }); }
      catch (error) { console.warn('Unique fixture profile retained:', profile, error.message); }
    }
    fs.writeFileSync(path.join(scope, `${stem}.json`), JSON.stringify(measured, null, 2));
    assert.ok(!measured.scriptError, `${stem}: ${measured.scriptError || ''}\n${measured.stack || ''}`);
    reports.push({ viewport, kind, image, cssSHA256: fixtures[0].cssSHA256, measured });
    console.log(JSON.stringify({ viewport: viewport.name, kind, scenarios: measured.scenarios.map(({ scenario, passed, failures }) => ({ scenario, passed, failures: failures.map((failure) => failure.name) })) }));
  }
}
if (!baselineOnly) assert.equal(digest(fs.readFileSync(sourcePath, 'utf8')), digest(current), 'client.js did not change during the regression; rerun after concurrent edits');
const report = { baselineCommit, sourceSHA256: digest(current), browser, mode: baselineOnly ? 'baseline-only (no fix claim)' : 'immutable baseline and actual current source', fixture: 'complete registered Workspace and child component DOM via VM React state stubs; exact CSS without corrective overrides', zoom: '150% browser zoom emulation: CDP reduces CSS viewport and increases DPR while holding physical capture size fixed; not browser toolbar interaction', reports };
fs.writeFileSync(path.join(scope, 'results.json'), JSON.stringify(report, null, 2));
for (const viewport of matrix) {
  const old = reports.find((value) => value.kind === 'old' && value.viewport.name === viewport.name);
  const browse = old.measured.scenarios.find((value) => value.scenario === 'browse');
  assert.ok(browse.failures.some((value) => /whole-Workspace overflow|pager visible|50th result entirely visible/.test(value.name)), `${viewport.name}: immutable baseline reproduces actual off-viewport list/page failure`);
}
if (!baselineOnly) {
  const failures = reports.filter((value) => value.kind === 'fixed').flatMap((value) => value.measured.scenarios.flatMap((scenario) => scenario.failures.map((failure) => ({ viewport: value.viewport.name, scenario: scenario.scenario, ...failure }))));
  assert.deepEqual(failures, [], 'current full Workspace must confine outer scrolling and keep every tested control reachable internally');
}
console.log(`PASS: ${baselineOnly ? 'old baseline reproduction only' : 'old fails / fixed passes'}, ${matrix.length} viewports, ${scenarios.length} full-Workspace tab states; report: ${path.join(scope, 'results.json')}`);
