import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../client.js', import.meta.url), 'utf8');
const flatten = (node) => !node || typeof node !== 'object' ? [] : [node, ...(node.children || []).flat(Infinity).flatMap(flatten)];
const flush = async () => { for (let i = 0; i < 16; i++) await Promise.resolve(); };
const event = { preventDefault() {} };
const stock = (id, name, extra = {}) => ({ id, name, fields: ['Front', 'Back'], type: 0, ...extra });
const defaultDecks = [{ id: 1, name: 'Default' }, { id: 2, name: 'Languages::Japanese' }, { id: 3, name: 'Other' }];
function preview(extra = {}) { return { token: 'delete-token', deckId: 2, name: 'Languages::Japanese', deckCount: 3, cardCount: 7, noteCount: 4, returnedCardCount: 0, filtered: false, expiresAt: Date.now() + 120000, ...extra }; }
function fixture({ models = [stock(10, 'Basic')], decks = defaultDecks, handler, selected = '2' } = {}) {
  let bundle, dictionaries, main, props, stateIndex = 0, refIndex = 0, effectIndex = 0, queued = [];
  const values = [], refs = [], effects = [], calls = [];
  values[3] = selected;
  const React = {
    Fragment: 'fragment', createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
    useState(initial) { const i = stateIndex++; if (!(i in values)) values[i] = initial; return [values[i], (value) => { values[i] = typeof value === 'function' ? value(values[i]) : value; }]; },
    useRef(initial) { const i = refIndex++; return refs[i] ||= { current: initial }; },
    useEffect(callback, dependencies) {
      const i = effectIndex++, before = effects[i];
      if (!before || dependencies.some((value, position) => !Object.is(value, before.dependencies[position]))) queued.push(() => { before?.cleanup?.(); effects[i] = { dependencies, cleanup: callback() }; });
    },
    useId: () => 'deck-test', useSyncExternalStore() {},
  };
  vm.runInNewContext(source, { window: { __ModuleLoader__: { load: (value) => { bundle = value; } } } });
  const ctx = {
    effect: (fn) => fn(),
    locale: { register: (_ns, dictionary) => { dictionaries = dictionary; }, bind: () => (key) => dictionaries.en[key], subscribe: () => () => {}, getSnapshot: () => ({ revision: 1 }) },
    slots: { inject: (_slot, fn) => fn(), register: (meta, component) => { if (meta.name === 'main') main = { meta, component }; } },
    connection: { rpc: { call: async (path, route, envelope) => {
      const call = { path, route, ...envelope.args }; calls.push(call);
      const custom = handler?.(call); if (custom !== undefined) return await custom;
      if (call.action === 'status') return { ok: true, value: { noteCount: 10, cardCount: 20 } };
      if (call.action === 'decks.list') return { ok: true, value: decks };
      if (call.action === 'models.list') return { ok: true, value: models };
      if (call.action === 'notes.search') return { ok: true, value: { items: [], total: 0 } };
      if (call.action === 'previewDelete') return { ok: true, value: preview() };
      if (call.action === 'delete') { decks = decks.filter((deck) => deck.id !== 2); return { ok: true, value: { deleted: true, ...preview(), token: undefined } }; }
      return { ok: true, value: {} };
    } } },
  };
  bundle.factory(() => React).apply(ctx); props = main.meta.inject();
  const f = {
    values, calls, props,
    render() { stateIndex = 0; refIndex = 0; effectIndex = 0; queued = []; return main.component(props); },
    commit() { const next = queued.splice(0); for (const callback of next) callback(); },
    async mount() { f.render(); f.commit(); await flush(); f.render(); f.commit(); await flush(); return f.render(); },
    button(label, tree = f.render()) { return flatten(tree).find((node) => node.type === 'button' && node.children.includes(label)); },
    panel(tree = f.render()) { return flatten(tree).find((node) => node.props.className?.split(' ').includes('dsh-anki-delete')); },
    async open() { f.button('Delete deck…').props.onClick(); await flush(); return f.panel(); },
    name(value) { const input = flatten(f.panel()).find((node) => node.type === 'input'); input.props.onChange({ target: { value } }); },
    form() { return flatten(f.panel()).find((node) => node.type === 'form'); },
    sync(snapshot) { const panel = flatten(f.render()).find((node) => node.type?.name === 'SyncPanel'); panel.props.onStatus(snapshot); },
    ownerCalls() { return calls.filter((call) => call.route === 'ankiWorkspace/deckAction'); },
    setModels(value) { models = value; },
    dispose() { for (const effect of effects) effect?.cleanup?.(); },
  };
  return f;
}

for (const [label, models, expected] of [
  ['Chinese exact name', [stock(1, 'Image Occlusion'), stock(2, 'Basic'), stock(3, 'Basic (type in the answer)'), stock(4, '问答题（输入答案）')], '4'],
  ['English exact name', [stock(1, 'Image Occlusion'), stock(2, 'Basic'), stock(3, 'Basic (type in the answer)')], '3'],
  ['renamed type template flag', [stock(1, 'Image Occlusion'), stock(2, 'Basic'), stock(5, 'My renamed model', { isTypeInAnswer: true })], '5'],
  ['Basic fallback', [stock(1, 'Image Occlusion'), stock(6, 'Custom'), stock(2, 'Basic')], '2'],
  ['Chinese Basic fallback', [stock(1, '图片遮罩'), stock(6, 'Custom'), stock(2, '问答题')], '2'],
  ['first non-image fallback', [stock(1, '图像遮罩'), stock(7, 'Cloze'), stock(8, 'Custom')], '7'],
]) {
  test(`new-note model defaults prefer ${label}`, async () => {
    const f = fixture({ models }); await f.mount(); assert.equal(f.values[20], expected);
  });
}

test('explicit manual model choice survives refresh and missing choices fall back safely', async () => {
  const f = fixture({ models: [stock(10, 'Basic'), stock(20, 'Basic (type in the answer)')] });
  await f.mount(); assert.equal(f.values[20], '20');
  f.values[4] = 'add';
  const modelField = flatten(f.render()).find((node) => node.type?.name === 'Field' && node.props.label === 'Note type');
  flatten(modelField).find((node) => node.type === 'select').props.onChange({ target: { value: '10' } });
  f.button('Refresh').props.onClick(); await flush(); assert.equal(f.values[20], '10');
  f.setModels([stock(30, '问答题（输入答案）')]);
  f.button('Refresh').props.onClick(); await flush(); assert.equal(f.values[20], '30');
});

test('Default ID 1 cannot request deletion and its protection is explained', async () => {
  const f = fixture({ selected: '1' }); await f.mount();
  const button = f.button('Delete deck…'); assert.equal(button.props.disabled, true);
  assert.ok(JSON.stringify(f.render()).includes('Default deck (ID 1)'));
  button.props.onClick(); await flush(); assert.equal(f.ownerCalls().length, 0);
});

test('preview shows exact scope and warnings; only exact full name authorizes owner deletion', async () => {
  const f = fixture(); await f.mount();
  const panel = await f.open(), content = JSON.stringify(panel);
  assert.ok(content.includes('Affected decks (selected deck and subdecks)'));
  assert.ok(content.includes('Orphaned notes to delete'));
  assert.ok(content.includes('Export an APKG backup'));
  assert.ok(content.includes('Review Undo cannot undo'));
  assert.ok(content.includes('AnkiWeb and other devices'));
  assert.equal(content.includes('delete-token'), false);
  assert.equal(f.ownerCalls()[0].action, 'previewDelete');
  assert.equal(f.ownerCalls()[0].params.deckId, 2);
  assert.equal(f.button('Permanently delete').props.disabled, true);
  f.name('Languages::Japanese '); f.form().props.onSubmit(event); await flush();
  assert.equal(f.ownerCalls().length, 1);
  f.name('Languages::Japanese');
  const staleForm = f.form(); assert.equal(f.button('Permanently delete').props.disabled, false);
  f.values[17] = { id: 100, fields: { Front: 'draft' }, cards: [] }; f.values[18] = { Front: 'draft' }; f.values[19] = 'draft-tag';
  staleForm.props.onSubmit(event); staleForm.props.onSubmit(event); await flush();
  const deletions = f.ownerCalls().filter((call) => call.action === 'delete');
  assert.equal(deletions.length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(deletions[0].params)), { token: 'delete-token', confirmName: 'Languages::Japanese' });
  assert.equal(f.panel(), undefined); assert.equal(f.values[17], null); assert.equal(f.values[19], '');
  assert.equal(f.values[3], ''); assert.equal(f.values[13], 0); assert.equal(f.values[21], '1');
  assert.equal(f.values[1].some((deck) => deck.id === 2), false);
});

test('filtered preview clearly separates returned cards from actual deletions', async () => {
  const f = fixture({ handler: ({ action }) => action === 'previewDelete' ? { ok: true, value: preview({ filtered: true, cardCount: 0, noteCount: 0, returnedCardCount: 8 }) } : undefined });
  await f.mount(); const panel = await f.open();
  assert.ok(JSON.stringify(panel).includes('returned to their original decks, not deleted'));
  const counts = flatten(panel).filter((node) => node.type === 'dd').map((node) => node.children[0]);
  assert.deepEqual(counts, ['3', '0', '0', '8']);
});

test('cancel invalidates both ready confirmation and a late pending preview', async () => {
  let resolve;
  const f = fixture({ handler: ({ action }) => action === 'previewDelete' ? new Promise((done) => { resolve = done; }) : undefined });
  await f.mount(); f.button('Delete deck…').props.onClick();
  assert.ok(f.panel()); f.button('Cancel').props.onClick();
  resolve({ ok: true, value: preview() }); await flush();
  assert.equal(f.panel(), undefined); assert.equal(f.ownerCalls().length, 1);
  const ready = fixture(); await ready.mount(); await ready.open(); ready.name('Languages::Japanese');
  const staleForm = ready.form(); ready.button('Cancel').props.onClick(); staleForm.props.onSubmit(event); await flush();
  assert.equal(ready.ownerCalls().length, 1);
});

test('a queued deck-selection event invalidates a late preview for the old selection', async () => {
  let resolve;
  const f = fixture({ handler: ({ action }) => action === 'previewDelete' ? new Promise((done) => { resolve = done; }) : undefined });
  await f.mount(); const before = f.render();
  const other = flatten(before).find((node) => node.props.className === 'dsh-anki-deck' && node.props.title?.startsWith('Other ·'));
  f.button('Delete deck…', before).props.onClick(); other.props.onClick();
  assert.equal(f.values[3], '3');
  resolve({ ok: true, value: preview() }); await flush(); assert.equal(f.panel(), undefined);
});

test('refresh consumes ready authorization and prevents stale form resubmission', async () => {
  const f = fixture(); await f.mount(); await f.open(); f.name('Languages::Japanese');
  const staleForm = f.form(); f.button('Refresh').props.onClick(); await flush();
  assert.equal(f.panel(), undefined); staleForm.props.onSubmit(event); await flush();
  assert.equal(f.ownerCalls().length, 1);
});

for (const sync of [{ active: true }, { active: false, pendingFull: { token: 'full-decision' } }]) {
  test(`sync ${sync.active ? 'active' : 'pending full'} clears and blocks deletion even for stale handlers`, async () => {
    const f = fixture(); await f.mount(); const staleButton = f.button('Delete deck…'); await f.open(); f.name('Languages::Japanese');
    const staleForm = f.form(); f.sync(sync);
    assert.equal(f.panel(), undefined); assert.equal(f.button('Delete deck…').props.disabled, true);
    staleForm.props.onSubmit(event); staleButton.props.onClick(); await flush();
    assert.equal(f.ownerCalls().length, 1);
  });
}

test('sync invalidates in-flight preview before its response arrives', async () => {
  let resolve;
  const f = fixture({ handler: ({ action }) => action === 'previewDelete' ? new Promise((done) => { resolve = done; }) : undefined });
  await f.mount(); f.button('Delete deck…').props.onClick(); f.sync({ active: true });
  resolve({ ok: true, value: preview() }); await flush(); assert.equal(f.panel(), undefined);
});

test('failed deletion consumes local token and requires a new preview', async () => {
  let previews = 0;
  const f = fixture({ handler: ({ action }) => action === 'previewDelete' ? { ok: true, value: preview({ token: `token-${++previews}` }) } : action === 'delete' ? { ok: false, error: { code: 'DELETE_SCOPE_CHANGED', message: 'raw backend detail' } } : undefined });
  await f.mount(); await f.open(); f.name('Languages::Japanese'); const staleForm = f.form();
  staleForm.props.onSubmit(event); await flush(); assert.equal(f.panel(), undefined);
  assert.ok(JSON.stringify(f.render()).includes('deck contents or confirmation changed'));
  staleForm.props.onSubmit(event); await flush(); assert.equal(f.ownerCalls().filter((call) => call.action === 'delete').length, 1);
  await f.open(); assert.equal(previews, 2);
});

test('parent containing protected Default deck surfaces localized rejection and drops preview', async () => {
  const f = fixture({ handler: ({ action }) => action === 'previewDelete' ? { ok: false, error: { code: 'DEFAULT_DECK_PROTECTED', message: 'protected' } } : undefined });
  await f.mount(); await f.open(); assert.equal(f.panel(), undefined);
  assert.ok(JSON.stringify(f.render()).includes('any deck containing it, cannot be deleted'));
});
