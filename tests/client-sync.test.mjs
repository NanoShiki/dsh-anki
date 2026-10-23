import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../client.js', import.meta.url), 'utf8');
const idle = (extra = {}) => ({ loggedIn: false, account: null, settings: { autoSync: true }, phase: 'idle', active: false, jobId: null, lastSyncAt: null, error: null, progress: null, pendingFull: null, lastBackupPath: null, ...extra });
const flatten = (node) => !node || typeof node !== 'object' ? [] : [node, ...(node.children || []).flat(Infinity).flatMap(flatten)];
const text = (node) => JSON.stringify(node);
const flush = async () => { for (let index = 0; index < 12; index++) await Promise.resolve(); };
function scope(values = []) { return { values, refs: [], effects: [], states: 0, references: 0, effectIndex: 0, queued: [] }; }
function fixture({ snapshot = idle(), handler, visible = true, rootValues = [] } = {}) {
  let bundle, dictionaries, current;
  const root = scope(rootValues), panel = scope(), calls = [], timers = new Map();
  let timerId = 0, tree, panelProps;
  const React = {
    Fragment: 'fragment',
    createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
    useState(initial) {
      const target = current, index = target.states++;
      if (!(index in target.values)) target.values[index] = initial;
      return [target.values[index], (value) => { target.values[index] = typeof value === 'function' ? value(target.values[index]) : value; }];
    },
    useRef(initial) { const index = current.references++; return current.refs[index] ||= { current: initial }; },
    useEffect(callback, dependencies) {
      const target = current, index = target.effectIndex++, previous = target.effects[index];
      if (!previous || dependencies.some((value, position) => !Object.is(value, previous.dependencies[position]))) {
        target.queued.push(() => { previous?.cleanup?.(); target.effects[index] = { dependencies, cleanup: callback() }; });
      }
    },
    useId: () => 'sync-test', useSyncExternalStore() {},
  };
  vm.runInNewContext(source, { window: { __ModuleLoader__: { load: (value) => { bundle = value; } } }, setTimeout: (callback, delay) => { const id = ++timerId; timers.set(id, { callback, delay }); return id; }, clearTimeout: (id) => timers.delete(id) });
  const registered = [];
  const definition = bundle.factory(() => React);
  const ctx = {
    effect: (fn) => fn(), locale: { register: (_ns, values) => { dictionaries = values; }, bind: () => (key) => dictionaries.en[key], subscribe: () => () => {}, getSnapshot: () => ({ revision: 1 }) },
    slots: { inject: (_name, fn) => fn(), register: (meta, component) => registered.push({ meta, component }) },
    connection: { rpc: { call: async (path, route, args) => {
      const request = { path, route, ...args.args }; calls.push(request);
      const custom = handler?.(request);
      if (custom !== undefined) return await custom;
      if (request.action === 'status') return { ok: true, value: { noteCount: 1, cardCount: 1, version: '26.05' } };
      if (request.action === 'decks.list') return { ok: true, value: [{ id: 1, name: 'Default', total: 1 }] };
      if (request.action === 'models.list') return { ok: true, value: [{ id: 1, name: 'Basic', fields: ['Front', 'Back'] }] };
      if (request.action === 'notes.search') return { ok: true, value: { items: [], total: 0 } };
      return { ok: true, value: snapshot };
    } } },
  };
  definition.apply(ctx);
  const main = registered.find((entry) => entry.meta.name === 'main');
  const props = main.meta.inject();
  function render(target, callback) { current = target; target.states = 0; target.references = 0; target.effectIndex = 0; target.queued = []; return callback(); }
  function renderRoot() {
    tree = render(root, () => main.component(props));
    panelProps = flatten(tree).find((node) => node.type?.name === 'SyncPanel');
    return tree;
  }
  root.values[4] ??= visible ? 'sync' : 'browse';
  root.values[6] ??= false;
  renderRoot();
  return {
    props, calls, root, panel, timers, dictionaries,
    renderRoot,
    renderPanel() { return render(panel, () => panelProps.type({ ...panelProps.props, visible })); },
    effects(target = panel) { const queued = target.queued.splice(0); for (const callback of queued) callback(); },
    setVisible(value) { visible = value; },
    setSnapshot(value) { snapshot = value; },
    dispose(target = panel) { for (const effect of target.effects) effect?.cleanup?.(); },
    async tick() { const [id, timer] = timers.entries().next().value; timers.delete(id); timer.callback(); await flush(); },
  };
}
function button(tree, label) { return flatten(tree).find((node) => node.type === 'button' && node.children.includes(label)); }

// Artificial credential/token sentinels only. No real credentials or network are used.
test('owner account RPC is distinct and discards raw credential-bearing errors', async () => {
  const f = fixture({ handler: ({ route }) => route.endsWith('/account') ? { ok: false, error: { code: 'AUTH_FAILED', message: 'RAW_CREDENTIAL_SENTINEL' } } : undefined });
  await assert.rejects(f.props.account('login', { username: 'test@example.invalid', password: 'test-password' }), (failure) => !failure.message.includes('RAW_CREDENTIAL') && /sign in/.test(failure.message));
  assert.equal(f.calls[0].route, 'ankiWorkspace/account');
  assert.equal(f.calls[0].action, 'login');
  assert.equal(f.calls.some((call) => call.route === 'ankiWorkspace/execute' && call.action === 'login'), false);
});

test('sync/login remains reachable without a loaded core collection', async () => {
  const f = fixture();
  const tree = f.renderRoot();
  assert.equal(flatten(tree).filter((node) => node.props.role === 'tab').length, 5);
  assert.ok(button(tree, 'Sync'));
  f.renderPanel(); f.effects(); await flush();
  assert.ok(button(f.renderPanel(), 'Sign in'));
});

test('password clears before asynchronous owner login finishes', async () => {
  let resolveLogin;
  const f = fixture({ handler: ({ action }) => action === 'login' ? new Promise((resolve) => { resolveLogin = resolve; }) : undefined });
  f.renderPanel(); f.effects(); await flush();
  let tree = f.renderPanel();
  const fields = flatten(tree).filter((node) => node.type === 'input' && node.props.type !== 'checkbox');
  fields[0].props.onChange({ target: { value: 'test@example.invalid' } });
  fields[1].props.onChange({ target: { value: 'transient-test-password' } });
  tree = f.renderPanel();
  flatten(tree).find((node) => node.type === 'form').props.onSubmit({ preventDefault() {} });
  const cleared = flatten(f.renderPanel()).find((node) => node.props.type === 'password');
  assert.equal(cleared.props.value, '');
  assert.equal(f.calls.at(-1).route, 'ankiWorkspace/account');
  resolveLogin({ ok: true, value: idle({ phase: 'logging-in', active: true }) }); await flush();
  assert.equal(text(f.renderPanel()).includes('transient-test-password'), false);
});

test('status-only polling uses 1s visible/active and 10s hidden idle, with cleanup', async () => {
  const f = fixture({ visible: false });
  f.renderPanel(); f.effects(); await flush();
  assert.equal([...f.timers.values()][0].delay, 10000);
  f.setSnapshot(idle({ loggedIn: true, active: true, phase: 'media' })); await f.tick();
  assert.equal([...f.timers.values()][0].delay, 1000);
  f.setSnapshot(idle({ loggedIn: true, phase: 'success', lastSyncAt: 10 })); await f.tick();
  assert.equal([...f.timers.values()][0].delay, 10000);
  f.setVisible(true); f.renderPanel(); f.effects(); await flush();
  assert.equal([...f.timers.values()][0].delay, 1000);
  assert.equal(f.calls.some((call) => call.action === 'sync.run'), false);
  f.dispose(); assert.equal(f.timers.size, 0);
});

test('automatic preference uses owner settings and manual sync alone starts a job', async () => {
  const f = fixture({ snapshot: idle({ loggedIn: true, account: 'test@example.invalid' }) });
  f.renderPanel(); f.effects(); await flush();
  let tree = f.renderPanel();
  const checkbox = flatten(tree).find((node) => node.props.type === 'checkbox');
  assert.equal(checkbox.props.checked, true);
  checkbox.props.onChange({ target: { checked: false } }); await flush();
  const settings = f.calls.find((call) => call.action === 'settings');
  assert.equal(settings.route, 'ankiWorkspace/account');
  assert.equal(settings.params.autoSync, false);
  assert.equal(f.calls.some((call) => call.action === 'sync.run'), false);
  tree = f.renderPanel(); button(tree, 'Sync now').props.onClick(); await flush();
  const run = f.calls.find((call) => call.action === 'sync.run');
  assert.equal(run.route, 'ankiWorkspace/execute');
});

test('full download requires explicit allowed direction and separate checked consent', async () => {
  const f = fixture({ snapshot: idle({ loggedIn: true, phase: 'awaiting-full', pendingFull: { token: 'FULL_TOKEN_SENTINEL', allowedDirections: ['download'], recommendedDirection: 'download', localNoteCount: 0 } }) });
  f.renderPanel(); f.effects(); await flush();
  let tree = f.renderPanel();
  assert.equal(text(tree).includes('FULL_TOKEN_SENTINEL'), false);
  assert.equal(button(tree, 'Confirm full download'), undefined);
  assert.equal(button(tree, 'Upload local → AnkiWeb'), undefined);
  assert.ok(text(tree).includes('local collection is empty'));
  button(tree, 'Download AnkiWeb → local · Recommended').props.onClick();
  tree = f.renderPanel();
  const confirm = button(tree, 'Confirm full download');
  assert.equal(confirm.props.disabled, true);
  confirm.props.onClick(); await flush();
  assert.equal(f.calls.some((call) => call.action === 'confirmFull'), false);
  flatten(tree).find((node) => node.props.type === 'checkbox' && node.props.checked === false).props.onChange({ target: { checked: true } });
  tree = f.renderPanel();
  assert.equal(button(tree, 'Confirm full download').props.disabled, false);
  button(tree, 'Confirm full download').props.onClick(); await flush();
  const request = f.calls.find((call) => call.action === 'confirmFull');
  assert.equal(request.route, 'ankiWorkspace/account');
  assert.deepEqual(JSON.parse(JSON.stringify(request.params)), { token: 'FULL_TOKEN_SENTINEL', direction: 'download' });
});

test('changing direction or confirmation token resets full-sync consent', async () => {
  const full = { token: 'token1', allowedDirections: ['upload', 'download'], recommendedDirection: null, localNoteCount: 2 };
  const f = fixture({ snapshot: idle({ loggedIn: true, phase: 'awaiting-full', pendingFull: full }) });
  f.renderPanel(); f.effects(); await flush();
  button(f.renderPanel(), 'Upload local → AnkiWeb').props.onClick();
  let tree = f.renderPanel();
  assert.ok(text(tree).includes('NOT the cloud collection'));
  flatten(tree).find((node) => node.props.type === 'checkbox' && node.props.checked === false).props.onChange({ target: { checked: true } });
  button(f.renderPanel(), 'Download AnkiWeb → local').props.onClick();
  assert.equal(button(f.renderPanel(), 'Confirm full download').props.disabled, true);
  f.setSnapshot(idle({ loggedIn: true, phase: 'awaiting-full', pendingFull: { ...full, token: 'token2' } }));
  await f.tick();
  assert.equal(button(f.renderPanel(), 'Confirm full download'), undefined);
});

test('raw server error message never renders, media progress and cancel do', async () => {
  const f = fixture({ snapshot: idle({ loggedIn: true, active: true, phase: 'media', error: { code: 'UNKNOWN', message: 'RAW_SECRET_SENTINEL' }, progress: { stage: 'media', transferred: 4, total: 9, checked: 12, added: 2, removed: 1 } }) });
  f.renderPanel(); f.effects(); await flush();
  const tree = f.renderPanel();
  assert.equal(text(tree).includes('RAW_SECRET_SENTINEL'), false);
  assert.equal(flatten(tree).find((node) => node.type === 'progress').props.value, 4);
  assert.equal(button(tree, 'Sync now').props.disabled, true);
  assert.equal(button(tree, 'Cancel sync').props.disabled, false);
  button(tree, 'Cancel sync').props.onClick(); await flush();
  assert.equal(f.calls.at(-1).action, 'sync.cancel');
  assert.equal(f.calls.at(-1).route, 'ankiWorkspace/execute');
});

test('native formatted media counters render bounded text without weakening numeric progress', async () => {
  const f = fixture({ snapshot: idle({ loggedIn: true, active: true, phase: 'media', progress: { stage: 'media', added: '1 added', removed: '0 removed', checked: 'Checked 3 files', transferred: '4 transferred', total: '9 total' } }) });
  f.renderPanel(); f.effects(); await flush();
  let tree = f.renderPanel();
  assert.ok(text(tree).includes('1 added'));
  assert.ok(text(tree).includes('0 removed'));
  assert.ok(text(tree).includes('Checked 3 files'));
  assert.equal(text(tree).includes('4 transferred'), false);
  assert.equal(flatten(tree).some((node) => node.type === 'progress'), false);
  f.setSnapshot(idle({ loggedIn: true, active: true, phase: 'media', progress: { added: '<img src=x>' + 'x'.repeat(500), removed: { unsafe: 'object' }, checked: Infinity, transferred: 4, total: 9 } }));
  await f.tick(); tree = f.renderPanel();
  const added = flatten(tree).find((node) => node.props.key === 'added');
  assert.equal(added.children[0].length, f.dictionaries.en.syncAdded.length + 2 + 160);
  assert.ok(added.children[0].includes('<img src=x>'));
  assert.equal(flatten(tree).some((node) => node.type === 'img' || node.props.dangerouslySetInnerHTML), false);
  assert.equal(text(tree).includes('unsafe'), false);
  assert.equal(flatten(tree).find((node) => node.type === 'progress').props.value, 4);
});

test('empty upload-only full decision does not recommend an unavailable download', async () => {
  const f = fixture({ snapshot: idle({ loggedIn: true, phase: 'awaiting-full', pendingFull: { token: 'upload-only', allowedDirections: ['upload'], recommendedDirection: 'upload', localNoteCount: 0 } }) });
  f.renderPanel(); f.effects(); await flush();
  const tree = f.renderPanel();
  assert.equal(text(tree).includes(f.dictionaries.en.syncEmptyHint), false);
  assert.ok(button(tree, 'Upload local → AnkiWeb · Recommended'));
  assert.equal(button(tree, 'Download AnkiWeb → local'), undefined);
});

test('successful sync preserves editor draft but blocks its stale save and suspension', async () => {
  const values = [];
  values[0] = { noteCount: 1, cardCount: 1 };
  values[17] = { id: 123, fields: { Front: 'old' }, tags: [], cards: [{ id: 456, suspended: false }], modified: 111 };
  values[18] = { Front: 'unsaved draft' };
  values[19] = 'unsaved-tag';
  const f = fixture({ rootValues: values, snapshot: idle({ loggedIn: true, lastSyncAt: 1 }) });
  f.renderPanel(); f.effects(); await flush();
  f.setSnapshot(idle({ loggedIn: true, phase: 'success', lastSyncAt: 2 })); await f.tick();
  assert.equal(f.root.values[18].Front, 'unsaved draft');
  assert.equal(f.root.values[19], 'unsaved-tag');
  f.root.values[4] = 'browse';
  const tree = f.renderRoot();
  assert.equal(button(tree, 'Save changes').props.disabled, true);
  assert.equal(button(tree, 'Suspend cards').props.disabled, true);
  assert.ok(text(tree).includes('editor draft is preserved'));
});

for (const phase of ['error', 'cancelled', 'awaiting-full']) {
  test(`hidden polling detects ${phase} job changes, preserves drafts, and invalidates only once`, async () => {
    const values = [];
    values[0] = { noteCount: 1, cardCount: 1 };
    values[17] = { id: 123, fields: { Front: 'original' }, tags: [], cards: [{ id: 456 }], modified: 111 };
    values[18] = { Front: 'draft survives a partial sync' }; values[19] = 'draft-tag';
    const f = fixture({ visible: false, rootValues: values, snapshot: idle({ loggedIn: true, jobId: 'old-job' }) });
    f.renderPanel(); f.effects(); await flush();
    f.setSnapshot(idle({ loggedIn: true, phase, jobId: 'new-job', pendingFull: phase === 'awaiting-full' ? { token: 'decision', allowedDirections: ['download'], localNoteCount: 1 } : null }));
    await f.tick();
    assert.equal(f.root.values[18].Front, 'draft survives a partial sync');
    assert.equal(f.root.values[19], 'draft-tag');
    assert.equal(f.root.values[30], true);
    const reloads = f.calls.filter((call) => call.action === 'models.list').length;
    assert.equal(reloads, 1);
    await f.tick();
    assert.equal(f.calls.filter((call) => call.action === 'models.list').length, reloads);
    assert.ok(text(f.renderRoot()).includes('may have changed the collection'));
  });
}

test('leaving review releases only the transient token through owner RPC', async () => {
  const values = []; values[4] = 'review';
  const f = fixture({ rootValues: values });
  f.renderRoot(); f.effects(f.root); await flush();
  f.root.values[4] = 'browse'; f.renderRoot(); f.effects(f.root); await flush();
  const releases = f.calls.filter((call) => call.action === 'releaseReview');
  assert.equal(releases.length, 1);
  assert.equal(releases[0].route, 'ankiWorkspace/account');
  assert.deepEqual(JSON.parse(JSON.stringify(releases[0].params)), {});
  assert.equal(f.calls.some((call) => call.action === 'review.answer'), false);
});
