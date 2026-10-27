import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../client.js', import.meta.url), 'utf8');
function fixture(response = { ok: true, value: { noteCount: 0 } }) {
  let bundle, dictionaries, currentValues = [], index = 0;
  const React = {
    createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
    Fragment: 'fragment',
    useState(initial) { const position = index++; return [position in currentValues ? currentValues[position] : initial, () => {}]; },
    useRef: (value) => ({ current: value }), useEffect() {}, useId: () => 'test', useSyncExternalStore() {},
  };
  // Layout-only text stub, deliberately rejects markup; it is NOT a sanitizer test.
  const DOMParser = class {
    parseFromString() {
      return { createElement(name) {
        assert.equal(name, 'template');
        const content = { textContent: '' };
        return { content, set innerHTML(value) { assert.doesNotMatch(value, /[<>]/); content.textContent = value; } };
      } };
    }
  };
  vm.runInNewContext(source, { DOMParser, window: { __ModuleLoader__: { load: (value) => { bundle = value; } } } });
  const required = [];
  const definition = bundle.factory((name) => { required.push(name); assert.equal(name, 'react'); return React; });
  const registered = [], calls = [];
  const ctx = {
    effect: (fn) => fn(),
    locale: {
      register(ns, values) { assert.equal(ns, 'ankiWorkspace'); dictionaries = values; return () => {}; },
      bind: () => (key) => dictionaries.en[key], subscribe: () => () => {}, getSnapshot: () => ({ revision: 1 }),
    },
    slots: { inject: (_slot, fn) => fn(), register: (meta, component) => registered.push({ meta, component }) },
    connection: { rpc: { call: async (...args) => { calls.push(args); return response; } } },
    layout: {},
  };
  definition.apply(ctx);
  const main = registered.find((entry) => entry.meta.name === 'main');
  return { bundle, definition, dictionaries, registered, required, calls, props: main.meta.inject(),
    render(values) { index = 0; currentValues = values; return main.component(main.meta.inject()); } };
}
function flatten(tree) {
  if (!tree || typeof tree !== 'object') return [];
  return [tree, ...tree.children.flat(Infinity).flatMap(flatten)];
}
test('native main/sidebar registration, baseline React only, locale file parity', async () => {
  const f = fixture();
  assert.equal(f.bundle.id, '@nanoshiki/dsh-anki');
  assert.deepEqual(f.required, ['react']);
  assert.equal(f.registered[0].meta.key, 'anki-workspace');
  assert.equal(f.registered[1].meta.id, 'anki-workspace');
  for (const language of ['en', 'zh']) {
    // `meta` is host-facing plugin-manager display metadata (read from the packaged
    // locale file), not a client UI string, so the inlined dictionaries omit it.
    const { meta, ...expected } = JSON.parse(await readFile(new URL(`../locale/${language}.json`, import.meta.url), 'utf8'));
    assert.deepEqual(meta.title, 'Anki');
    assert.deepEqual(JSON.parse(JSON.stringify(f.dictionaries[language])), expected);
  }
});
test('renamed package, native bundle and installer identity remain aligned', async () => {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  const patch = await readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8');
  assert.equal(manifest.name, '@nanoshiki/dsh-anki');
  assert.equal(manifest.version, '2.0.0');
  assert.equal(manifest.repository.url, 'git+https://github.com/NanoShiki/dsh-anki.git');
  assert.equal(fixture().bundle.id, manifest.name);
  assert.match(patch, /^\s+- id: local-anki$/m);
  assert.match(patch, /^\s+name: '@nanoshiki\/dsh-anki'$/m);
  assert.doesNotMatch(patch, /dsh-anki-workspace|local-anki-workspace/);
});
test('raw Connection RPC endpoint and exact success envelope', async () => {
  const f = fixture();
  assert.equal((await f.props.api('status')).noteCount, 0);
  assert.deepEqual(JSON.parse(JSON.stringify(f.calls)), [['/api', 'ankiWorkspace/execute', { args: { action: 'status', params: {} } }]]);
});
test('backend failure and malformed RPC envelope are surfaced without retries', async () => {
  const failure = fixture({ ok: false, error: { code: 'anki/CONFLICT', message: 'Note changed; reload before saving' } });
  await assert.rejects(failure.props.api('notes.update'), /Note changed/);
  assert.equal(failure.calls.length, 1);
  const malformed = fixture({ noteCount: 0 });
  await assert.rejects(malformed.props.api('status'), /invalid response/);
});
test('owner deck deletion uses a distinct envelope and never the execute action route', async () => {
  const f = fixture({ ok: true, value: { token: 'preview-token' } });
  assert.equal((await f.props.deckAction('previewDelete', { deckId: 2 })).token, 'preview-token');
  assert.deepEqual(JSON.parse(JSON.stringify(f.calls)), [['/api', 'ankiWorkspace/deckAction', { args: { action: 'previewDelete', params: { deckId: 2 } } }]]);
  const failure = fixture({ ok: false, error: { code: 'DELETE_SCOPE_CHANGED', message: 'raw backend detail' } });
  await assert.rejects(failure.props.deckAction('delete', { token: 'consumed-token', confirmName: 'Languages' }), (error) => error.code === 'DELETE_SCOPE_CHANGED' && !error.message.includes('raw backend detail'));
  const malformed = fixture({ token: 'not-an-envelope' });
  await assert.rejects(malformed.props.deckAction('previewDelete', { deckId: 2 }), /invalid response/);
});

test('all five native tabs render and review requires an explicit deck', () => {
  const f = fixture();
  for (const tab of ['browse', 'add', 'review', 'transfer', 'sync']) {
    const values = [];
    values[0] = { noteCount: 0, cardCount: 0, version: '26.05', undo: { available: false } };
    values[1] = [{ id: 1, name: 'Default', total: 0 }];
    values[4] = tab;
    values[6] = false;
    const tree = flatten(f.render(values));
    assert.equal(tree.filter((node) => node.props.role === 'tab').length, 5);
    assert.equal(tree.filter((node) => node.props.role === 'tabpanel').length, 1);
    if (tab === 'review') {
      const start = tree.find((node) => node.type === 'button' && node.children.includes('Start reviewing'));
      assert.equal(start.props.disabled, true);
    }
  }
});

function layoutFixture() {
  const f = fixture(), values = [];
  values[0] = { noteCount: 462, cardCount: 462, undo: { available: false } };
  values[1] = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, name: `Deck ${i}`, total: 462 }));
  values[6] = false;
  values[14] = { total: 462, items: Array.from({ length: 50 }, (_, i) => ({
    id: i + 1, preview: '【游戏服务器】中文和 English NetDriver / NetConnection '.repeat(8),
    model: 'QuestionAndAnswer'.repeat(12), deck: '面试'.repeat(40), cards: [],
  })) };
  const tree = flatten(f.render(values));
  const css = tree.find((node) => node.type === 'style').children.join('');
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = css.match(new RegExp('(?:^|[}\\s])' + escaped + '\\{([^}]*)\\}'));
    assert.ok(match, `missing rule ${selector}`);
    return Object.fromEntries(match[1].split(';')
      .filter(Boolean).map((declaration) => {
        const colon = declaration.indexOf(':');
        return [declaration.slice(0, colon).trim(), declaration.slice(colon + 1).trim()];
      }));
  };
  return { tree, rule };
}

test('fifty long result rows retain intrinsic height rather than shrinking into overlapping text', () => {
  const { tree, rule } = layoutFixture();
  const rows = tree.filter((node) => node.props.className === 'dsh-anki-note');
  assert.equal(rows.length, 50);
  assert.ok(rows.every((row) => flatten(row).some((node) => node.props.className === 'dsh-anki-note-meta')));
  const row = rule('.dsh-anki .dsh-anki-note');
  assert.equal(row.flex, '0 0 auto');
  assert.equal(row.height, 'auto');
  assert.equal(row['white-space'], 'normal');
  assert.equal(rule('.dsh-anki-list')['overflow'], 'auto');
  assert.equal(rule('.dsh-anki-preview')['-webkit-line-clamp'], '2');
  assert.equal(rule('.dsh-anki-note-meta')['overflow-wrap'], 'anywhere');
});

test('workspace bounds its remaining-height scroll chain instead of scrolling the whole page', () => {
  const { tree, rule } = layoutFixture();
  assert.equal(rule('.dsh-anki').overflow, 'hidden');
  for (const selector of ['.dsh-anki', '.dsh-anki-wrap', '.dsh-anki-layout', '.dsh-anki-main', '.dsh-anki-panel', '.dsh-anki-browse', '.dsh-anki-browser', '.dsh-anki-results', '.dsh-anki-list', '.dsh-anki-editor']) {
    assert.equal(rule(selector)['min-height'], '0', `${selector} can shrink to its available height`);
  }
  assert.equal(rule('.dsh-anki-panel-browse').overflow, 'hidden');
  assert.equal(rule('.dsh-anki-panel').overflow, 'auto');
  assert.equal(rule('.dsh-anki-editor').overflow, 'auto');
  assert.ok(tree.some((node) => node.props.className === 'dsh-anki-overview'));
  assert.ok(tree.some((node) => node.props.className === 'dsh-anki-results'));
  assert.ok(tree.find((node) => node.props.role === 'tabpanel').props.className.includes('dsh-anki-panel-browse'));
});

test('deletion confirmation wraps long full deck names without horizontal overflow', () => {
  const { rule } = layoutFixture();
  assert.equal(rule('.dsh-anki-delete')['min-width'], '0');
  assert.equal(rule('.dsh-anki-delete')['overflow-wrap'], 'anywhere');
});

test('long deck lists scroll without squeezing their button rows', () => {
  const { tree, rule } = layoutFixture();
  assert.equal(tree.filter((node) => node.props.className === 'dsh-anki-deck').length, 31);
  assert.equal(rule('.dsh-anki .dsh-anki-deck').flex, '0 0 auto');
  assert.equal(rule('.dsh-anki-decks').overflow, 'auto');
});
