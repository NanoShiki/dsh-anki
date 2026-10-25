// Run using the installed Electron Node runtime, so its public ASAR packages
// are available. This creates only a fresh temporary independent collection.
import { createRequire, registerHooks } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const hostRequire = createRequire('D:/deepseekharness/resources/app.asar/dsh/package.json');
registerHooks({
  resolve(specifier, context, nextResolve) {
    try { return nextResolve(specifier, context); }
    catch (error) {
      if (!specifier.startsWith('@deepseek-ai/')) throw error;
      return nextResolve(pathToFileURL(hostRequire.resolve(specifier)).href, context);
    }
  },
});
const { Context, Service } = await import('@deepseek-ai/cordis');
const { default: Registry } = await import('@deepseek-ai/dsh-typert-registry');
const { default: Gateway } = await import('@deepseek-ai/dsh-api-gateway');
const { default: Workspace } = await import('../index.js');
const dataDir = await mkdtemp(fileURLToPath(new URL('./host-fixture-', import.meta.url)));
const tools = new Map();
let permissionMode = 'danger-full-access';
class Profile extends Service { constructor(ctx) { super(ctx, 'profileContext'); this.dir = dataDir; } }
class Tools extends Service { constructor(ctx) { super(ctx, 'tools'); } register(tool) { tools.set(tool.name, tool); return () => tools.delete(tool.name); } }
class Policy extends Service { constructor(ctx) { super(ctx, 'sandboxPolicy'); } resolve() { return { mode: permissionMode }; } }
class Access extends Service { constructor(ctx) { super(ctx, 'remoteAccess'); } decide() { return { kind: 'allow' }; } }
const root = new Context();
try {
  await root.plugin(Profile);
  await root.plugin(Tools);
  await root.plugin(Access);
  await root.plugin(Policy);
  await root.plugin(Registry);
  await root.plugin(Gateway, {});
  await root.plugin(Workspace, {});
  assert.ok(root.get('ankiWorkspace'), 'workspace service active');
  assert.equal(root.ankiWorkspace.worker.ankiPackages, fileURLToPath(new URL('../core', import.meta.url)), 'empty config uses module-relative bundled core');
  assert.equal(root.ankiWorkspace.worker.bundledPython, true);
  assert.equal(root.ankiWorkspace.worker.bundledCore, true);
  const peer = { id: 'test-owner', ctx: root, signal: new AbortController().signal, principal: { kind: 'owner' } };
  const invoke = (action, params = {}, currentPeer = peer) => root.typertGateway.invoke({
    namespace: 'ankiWorkspace', method: 'execute', args: { action, params }, peer: currentPeer,
  });
  assert.equal(root.typertGateway.claimsEndpoint('ankiWorkspace/execute'), true);
  const status = await invoke('status');
  const envelope = await root.typertGateway.invokeRpc('ankiWorkspace/execute', { args: { action: 'status', params: {} } }, undefined, peer);
  assert.equal(envelope.ok, true, 'raw Connection RPC returns expected success envelope');
  assert.equal(envelope.value.collectionPath, status.collectionPath);
  assert.equal(status.noteCount, 0);
  assert.ok(status.collectionPath.startsWith(dataDir));
  assert.equal(tools.size, 1);
  const tool = tools.get('anki');
  let forwardedSignal;
  const worker = root.ankiWorkspace.worker;
  const originalCall = worker.call;
  worker.call = function (action, params, options) { forwardedSignal = options?.signal; return originalCall.call(this, action, params, options); };
  const toolSignal = new AbortController().signal;
  const toolStatus = await tool.execute({ action: 'status', params: {} }, { signal: toolSignal });
  assert.equal(forwardedSignal, toolSignal, 'agent cancellation reaches queued worker requests');
  assert.equal(toolStatus.collectionPath, status.collectionPath, 'AI and UI use exact same collection');
  permissionMode = 'read-only';
  assert.equal((await tool.execute({ action: 'status', params: {} }, { signal: new AbortController().signal })).noteCount, 0);
  await assert.rejects(tool.execute({ action: 'decks.create', params: { name: 'Must not exist' } }, { signal: new AbortController().signal }), /full-access/);
  permissionMode = 'workspace-write';
  await assert.rejects(tool.execute({ action: 'decks.create', params: { name: 'Must not exist' } }, { signal: new AbortController().signal }), /full-access/);
  permissionMode = 'danger-full-access';
  const deck = await invoke('decks.create', { name: 'Host RPC 测试' });
  assert.ok((await invoke('decks.list')).some((item) => item.name === 'Host RPC 测试'));
  const models = await invoke('models.list');
  const model = models.find((item) => item.fields.length === 2 && item.type === 0);
  assert.ok(model);
  const fields = Object.fromEntries(model.fields.map((name, i) => [name, i ? 'headless integration' : 'native workspace']));
  const created = await tool.execute({ action: 'notes.add', params: { deckId: deck.id, modelId: model.id, fields, tags: ['integration'] } }, { signal: new AbortController().signal });
  const found = await invoke('notes.search', { query: 'tag:integration', limit: 10 });
  assert.equal(found.total, 1);
  assert.equal(found.items[0].id, created.id);
  await assert.rejects(invoke('notes.update', { noteId: created.id, fields, expectedModified: 1 }), /changed|modified|conflict/i);
  const conflict = await root.typertGateway.invokeRpc('ankiWorkspace/execute', { args: { action: 'notes.update', params: { noteId: created.id, fields, expectedModified: 1 } } }, undefined, peer);
  assert.equal(conflict.ok, false);
  assert.equal(conflict.error.code, 'anki/CONFLICT', 'typed backend failures survive RPC');
  await assert.rejects(invoke('notes.delete'), /Unknown/);
  await assert.rejects(invoke('status', {}, { ...peer, principal: { kind: 'guest', id: 'test-guest' } }), /Only the DSH owner/);
  await assert.rejects(root.typertGateway.invoke({ namespace: 'ankiWorkspace', method: 'execute', args: { action: 'status', params: {}, unexpected: true }, peer }), /unexpected/);
  const invokeAccount = (action, params = {}, currentPeer = peer) => root.typertGateway.invoke({ namespace: 'ankiWorkspace', method: 'account', args: { action, params }, peer: currentPeer });
  assert.equal(root.typertGateway.claimsEndpoint('ankiWorkspace/account'), true);
  const syncState = await invoke('sync.status');
  assert.equal(syncState.loggedIn, false);
  assert.equal(syncState.active, false);
  assert.equal(syncState.pendingFull, null);
  assert.equal(JSON.stringify(syncState).includes('hkey'), false);
  assert.equal((await invokeAccount('settings', { autoSync: false })).settings.autoSync, false);
  assert.equal((await invoke('sync.status')).settings.autoSync, false);
  await assert.rejects(invokeAccount('settings', { autoSync: true }, { ...peer, principal: { kind: 'guest', id: 'test-guest' } }), /Only the DSH owner/);
  await assert.rejects(root.ankiWorkspace.account('settings', { autoSync: true }), /Only the DSH owner/);
  await assert.rejects(invokeAccount('login', { username: '', password: 'DO-NOT-ECHO' }), (error) => !error.message.includes('DO-NOT-ECHO'));
  await assert.rejects(invoke('account.login', { username: 'u', password: 'DO-NOT-SEND' }), /Unknown/);
  await assert.rejects(invoke('sync.confirm', { token: 't', direction: 'upload' }), /Unknown/);
  const names = tool.parameters.properties.action.enum;
  assert.ok(names.includes('sync.status') && names.includes('sync.run') && names.includes('sync.cancel'));
  assert.ok(!names.some((name) => /login|logout|configure|confirm|dismiss/.test(name)));
  for (const mode of ['read-only', 'workspace-write']) {
    permissionMode = mode;
    assert.equal((await tool.execute({ action: 'sync.status', params: {} }, { signal: new AbortController().signal })).loggedIn, false);
    for (const action of ['sync.run', 'sync.cancel']) await assert.rejects(tool.execute({ action, params: {} }, { signal: new AbortController().signal }), /full-access/);
  }
  permissionMode = 'danger-full-access';
  assert.equal((await invokeAccount('releaseReview')).discarded, true);
  assert.equal((await invokeAccount('logout')).loggedIn, false);
  const manageDeck = (action, params = {}, currentPeer = peer) => root.typertGateway.invoke({ namespace: 'ankiWorkspace', method: 'deckAction', args: { action, params }, peer: currentPeer });
  assert.equal(root.typertGateway.claimsEndpoint('ankiWorkspace/deckAction'), true);
  assert.ok(!names.some((name) => name.includes('delete')), 'destructive deck actions have no AI alias');
  await assert.rejects(invoke('decks.delete.preview', { deckId: deck.id }), /Unknown/);
  await assert.rejects(invoke('decks.delete', { token: 'never' }), /Unknown/);
  await assert.rejects(tool.execute({ action: 'decks.delete', params: { token: 'never' } }, { signal: toolSignal }), { code: 'INVALID_ARGS' });
  await assert.rejects(manageDeck('previewDelete', { deckId: deck.id }, { ...peer, principal: { kind: 'guest', id: 'guest' } }), /Only the DSH owner/);
  await assert.rejects(root.ankiWorkspace.deckAction('previewDelete', { deckId: deck.id }), /Only the DSH owner/);
  await assert.rejects(manageDeck('constructor'), /Unknown/);
  await assert.rejects(manageDeck('previewDelete', []), /Invalid/);
  await assert.rejects(manageDeck('previewDelete', { deckId: deck.id, extra: 'x'.repeat(33000) }), /Invalid/);
  const previewEnvelope = await root.typertGateway.invokeRpc('ankiWorkspace/deckAction', { args: { action: 'previewDelete', params: { deckId: deck.id } } }, undefined, peer);
  assert.equal(previewEnvelope.ok, true);
  const preview = previewEnvelope.value;
  assert.equal(preview.deckId, deck.id);
  assert.equal(preview.name, deck.name);
  assert.equal(preview.deckCount, 1);
  assert.equal(preview.cardCount, created.cards.length);
  assert.equal(preview.noteCount, 1);
  assert.equal((await invoke('status')).noteCount, 1, 'preview has no collection mutation');
  await assert.rejects(manageDeck('delete', { token: preview.token, confirmName: 'wrong name' }));
  assert.equal((await invoke('status')).noteCount, 1, 'failed confirmation is nondestructive');
  const confirmed = await manageDeck('previewDelete', { deckId: deck.id });
  await manageDeck('delete', { token: confirmed.token, confirmName: confirmed.name });
  assert.equal((await invoke('status')).noteCount, 0);
  assert.ok(!(await invoke('decks.list')).some((item) => item.id === deck.id));
  await assert.rejects(manageDeck('delete', { token: confirmed.token, confirmName: confirmed.name }));
  assert.equal(root.ankiWorkspace.autoSync.operationBusy, 0, 'RPC failure/success both release scheduler barrier');
  assert.equal((await invokeAccount('settings', { autoSync: true })).settings.autoSync, true);
  console.log(JSON.stringify({ passed: true, nativeGateway: true, sharedToolCollection: true, ownerOnly: true, accountRpc: true, deckDeletionRpc: true, noNetworkLogin: true, version: status.version, dataDir, checks: 48 }));
} finally {
  await root.fiber.dispose();
}
