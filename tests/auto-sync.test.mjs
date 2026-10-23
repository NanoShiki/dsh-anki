import test from 'node:test';
import assert from 'node:assert/strict';
import { AnkiAutoSync } from '../auto-sync.js';
import { AnkiWorkerClient } from '../worker-client.js';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { fileURLToPath } from 'node:url';

function fixture(overrides = {}) {
  let now = 1_000_000;
  const calls = [];
  const status = { loggedIn: true, active: false, settings: { autoSync: true }, pendingFull: null, ...overrides };
  const auto = new AnkiAutoSync({ now: () => now, call: async (action, params) => { calls.push({ action, params }); return status; } });
  return { auto, calls, status, advance(ms) { now += ms; } };
}
const actions = (f) => f.calls.map((x) => x.action);

test('startup starts incremental sync only, with five-minute backoff', async () => {
  const f = fixture();
  await f.auto.tick(); await f.auto.tick();
  assert.deepEqual(actions(f), ['sync.status', 'sync.run']);
  assert.deepEqual(f.calls[1].params, {});
  f.advance(300_000); await f.auto.tick();
  assert.deepEqual(actions(f), ['sync.status', 'sync.run', 'sync.status', 'sync.run']);
});

test('signed-out, disabled, active, and full-decision states never auto-confirm or run', async () => {
  for (const state of [{ loggedIn: false }, { settings: { autoSync: false } }, { active: true }, { pendingFull: { token: 'NEVER-CONSUME' } }]) {
    const f = fixture(state);
    await f.auto.tick(); f.advance(30_000); await f.auto.tick();
    assert.ok(f.calls.every((x) => x.action === 'sync.status'));
  }
});

test('edits debounce for fifteen seconds, and an outstanding review holds auto sync', async () => {
  const f = fixture();
  f.auto.completed('notes.add', {});
  await f.auto.tick(); assert.deepEqual(actions(f), []);
  f.advance(10_000); f.auto.completed('notes.update', {}); f.advance(10_000);
  await f.auto.tick(); assert.deepEqual(actions(f), []);
  f.auto.completed('review.next', { token: 'current' }); f.advance(60_000);
  await f.auto.tick(); assert.deepEqual(actions(f), []);
  f.auto.completed('review.answer', {}); f.advance(15_000); await f.auto.tick();
  assert.deepEqual(actions(f), ['sync.status', 'sync.run']);
});

test('leaving review releases its hold but still waits for idle', async () => {
  const f = fixture();
  f.auto.completed('review.next', { token: 'current' });
  f.auto.accountChanged('releaseReview'); await f.auto.tick();
  assert.deepEqual(actions(f), []);
  f.advance(15_000); await f.auto.tick();
  assert.deepEqual(actions(f), ['sync.status', 'sync.run']);
});

test('no overlapping checks, and an account request invalidates an awaited snapshot', async () => {
  const f = fixture();
  let release;
  f.auto.call = (action) => { f.calls.push({ action }); return new Promise((resolve) => { release = resolve; }); };
  const pending = f.auto.tick(); await f.auto.tick();
  assert.deepEqual(actions(f), ['sync.status']);
  f.auto.beginAccount(); f.auto.accountChanged('settings'); f.auto.endAccount();
  release(f.status); await pending;
  assert.deepEqual(actions(f), ['sync.status']);
});

test('disposal during status retrieval prevents starting a job', async () => {
  const f = fixture();
  let release;
  f.auto.call = () => new Promise((resolve) => { release = resolve; });
  const pending = f.auto.tick(); f.auto.close(); release(f.status); await pending;
  assert.equal(f.auto.closed, true);
  assert.equal(f.auto.checking, false);
});

test('errors and explicit cancellation back off instead of restarting sync immediately', async () => {
  const f = fixture();
  f.auto.call = async (action) => { f.calls.push({ action }); throw new Error('sensitive native error'); };
  await f.auto.tick(); await f.auto.tick();
  assert.deepEqual(actions(f), ['sync.status']);
  f.advance(300_000); f.auto.completed('sync.cancel', {}); await f.auto.tick();
  assert.deepEqual(actions(f), ['sync.status']);
  assert.equal(f.auto.checking, false);
});

test('inactive cancellation preserves a still-current review hold', async () => {
  const f = fixture();
  f.auto.completed('review.next', { token: 'still-current' });
  f.auto.completed('sync.cancel', { active: false }); f.advance(300_000);
  await f.auto.tick();
  assert.equal(f.auto.reviewHeld, true);
  assert.deepEqual(actions(f), []);
});

test('in-flight collection requests block scheduler eligibility before enqueue', async () => {
  const f = fixture();
  const release = f.auto.beginOperation('notes.add');
  await f.auto.tick(); assert.deepEqual(actions(f), []);
  release(); f.auto.completed('notes.add', {}); f.advance(15_000);
  await f.auto.tick(); assert.deepEqual(actions(f), ['sync.status', 'sync.run']);
});

for (const activity of ['review.next', 'notes.add', 'decks.delete']) test(`real worker queue rechecks auto eligibility after queued ${activity}`, async () => {
  const sent = [];
  let releaseStatus, releaseActivity;
  const state = { loggedIn: true, active: false, settings: { autoSync: true }, pendingFull: null };
  const worker = new AnkiWorkerClient({
    pythonPath: fileURLToPath(new URL('../runtime/python.exe', import.meta.url)),
    ankiPackages: 'D:/Anki/app_packages', dataDir: 'unused-fake-only',
    spawnProcess() {
      const child = new EventEmitter();
      child.stdin = new PassThrough(); child.stdout = new PassThrough(); child.stderr = new PassThrough();
      child.kill = () => { setImmediate(() => child.emit('exit', 0, null)); return true; };
      child.stdin.once('finish', () => setImmediate(() => child.emit('exit', 0, null)));
      child.stdin.on('data', (data) => {
        const request = JSON.parse(data.toString()); sent.push(request.action);
        const reply = (result) => child.stdout.write(JSON.stringify({ id: request.id, ok: true, result }) + '\n');
        if (request.action === 'sync.status') releaseStatus = () => reply(state);
        else if (request.action === activity) releaseActivity = () => reply(activity === 'review.next' ? { token: 'live' } : {});
        else reply(state);
      });
      return child;
    },
  });
  const auto = new AnkiAutoSync({ now: () => 1_000_000, call: (...args) => worker.call(...args) });
  try {
    const pendingTick = auto.tick();
    await new Promise(setImmediate);
    // Deliberately omit beginOperation to independently exercise queue-head guard.
    const pendingActivity = worker.call(activity).then((value) => { auto.completed(activity, value); return value; });
    releaseStatus(); await new Promise(setImmediate);
    assert.deepEqual(sent, ['sync.status', activity]);
    releaseActivity(); await pendingActivity; await pendingTick;
    assert.deepEqual(sent, ['sync.status', activity], 'auto sync must never reach stdin after new activity');
    if (activity === 'review.next') assert.equal(auto.reviewHeld, true);
    else assert.equal(auto.dueAt, 1_015_000, 'activity deferral preserves fifteen-second idle deadline');
  } finally { auto.close(); await worker.close(); }
});

for (const action of ['decks.delete.preview', 'decks.delete']) test(`${action} blocks an awaited sync snapshot`, async () => {
  const f = fixture();
  let resolveStatus;
  f.auto.call = (name) => { f.calls.push({ action: name }); return new Promise((resolve) => { resolveStatus = resolve; }); };
  const pending = f.auto.tick();
  const release = f.auto.beginOperation(action);
  assert.equal(f.auto.operationBusy, 1);
  resolveStatus(f.status); await pending;
  assert.deepEqual(actions(f), ['sync.status']);
  release(); assert.equal(f.auto.operationBusy, 0);
});

test('only confirmed deletion releases review hold and schedules idle sync', async () => {
  const f = fixture();
  f.auto.completed('review.next', { token: 'held' });
  f.auto.completed('decks.delete.preview', { token: 'confirmation-only' });
  assert.equal(f.auto.reviewHeld, true);
  f.auto.completed('decks.delete', {});
  assert.equal(f.auto.reviewHeld, false);
  await f.auto.tick(); assert.deepEqual(actions(f), []);
  f.advance(15_000); await f.auto.tick();
  assert.deepEqual(actions(f), ['sync.status', 'sync.run']);
});

test('login/settings wake a future check without performing a full sync', async () => {
  const f = fixture();
  f.auto.accountChanged('logout'); await f.auto.tick();
  assert.deepEqual(actions(f), []);
  f.auto.accountChanged('login'); f.advance(1000); await f.auto.tick();
  assert.deepEqual(actions(f), ['sync.status', 'sync.run']);
});
