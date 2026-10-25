import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { AnkiWorkerClient } from '../worker-client.js';

const runtime = fileURLToPath(new URL(process.platform === 'win32' ? '../runtime/python.exe' : '../runtime/bin/python3', import.meta.url));
const core = fileURLToPath(new URL('../core', import.meta.url));
const dataDir = fileURLToPath(new URL('./private-fixture', import.meta.url));
function harness(handler, options = {}) {
  const generations = [];
  const worker = new AnkiWorkerClient({
    dataDir,
    pathExists: () => true, // Fake spawn never opens a runtime or collection.
    ...options,
    spawnProcess(executable, args, opts) {
      const child = new EventEmitter();
      child.stdin = new PassThrough(); child.stdout = new PassThrough(); child.stderr = new PassThrough();
      child.kill = () => { child.killed = true; setImmediate(() => child.emit('exit', null, 'SIGTERM')); return true; };
      child.stdin.once('finish', () => setImmediate(() => child.emit('exit', 0, null)));
      child.stdin.on('data', (data) => handler(child, JSON.parse(data.toString('utf8'))));
      generations.push({ child, executable, args, opts });
      return child;
    },
  });
  return { worker, generations };
}
const reply = (child, id, result) => child.stdout.write(JSON.stringify({ id, ok: true, result }) + '\n');

for (const options of [{}, { pythonPath: '', ankiPackages: '' }]) test(`module-relative bundled defaults with ${JSON.stringify(options)}`, async () => {
  const checked = [];
  const h = harness((child, request) => reply(child, request.id, {}), { ...options, pathExists: (path) => { checked.push(path); return true; } });
  try {
    assert.equal(h.worker.pythonPath, runtime);
    assert.equal(h.worker.ankiPackages, core);
    await h.worker.call('status');
    assert.equal(h.generations[0].executable, runtime);
    const args = h.generations[0].args;
    assert.equal(args[args.indexOf('--anki-packages') + 1], core);
    assert.deepEqual(checked, [runtime, fileURLToPath(new URL('../core/anki', import.meta.url))]);
  } finally { await h.worker.close(); }
});

for (const name of ['pythonPath', 'ankiPackages', 'dataDir']) test(`${name} rejects invalid explicit paths before spawning`, () => {
  for (const value of ['relative/path', 'C:relative', ' ', null, 123]) {
    assert.throws(() => harness(() => assert.fail('must not spawn'), { [name]: value }), (error) => error.code === 'path-invalid' && error.message.includes(name));
  }
});

test('explicit absolute overrides are retained', async () => {
  const pythonPath = fileURLToPath(new URL('./override/python.exe', import.meta.url));
  const ankiPackages = fileURLToPath(new URL('./override/packages', import.meta.url));
  const h = harness((child, request) => reply(child, request.id, {}), { pythonPath, ankiPackages });
  try {
    await h.worker.call('status');
    assert.equal(h.worker.bundledPython, false);
    assert.equal(h.worker.bundledCore, false);
    assert.equal(h.generations[0].executable, pythonPath);
    const args = h.generations[0].args;
    assert.equal(args[args.indexOf('--anki-packages') + 1], ankiPackages);
  } finally { await h.worker.close(); }
});

for (const bundled of [true, false]) for (const missing of ['runtime', 'core']) test(`missing ${bundled ? 'bundled' : 'override'} ${missing} fails without fallback`, async () => {
  const options = bundled ? {} : {
    pythonPath: fileURLToPath(new URL('./missing/python.exe', import.meta.url)),
    ankiPackages: fileURLToPath(new URL('./missing/packages', import.meta.url)),
  };
  const checked = [];
  const h = harness(() => assert.fail('must not spawn'), { ...options, pathExists: (path) => { checked.push(path); return missing === 'core' && checked.length === 1; } });
  try {
    await assert.rejects(h.worker.call('status'), (error) => error.code === `${missing}-missing` && error.message.includes(bundled ? 'Bundled' : 'Configured'));
    assert.equal(h.generations.length, 0);
    assert.equal(checked.length, missing === 'runtime' ? 1 : 2, 'no external fallback probes');
  } finally { await h.worker.close(); }
});

test('one serialized worker serves simultaneous callers and owns stdio only', async () => {
  const h = harness((child, request) => setImmediate(() => reply(child, request.id, request.params)));
  try {
    const values = await Promise.all([h.worker.call('status', { i: 1 }), h.worker.call('status', { i: 2 })]);
    assert.deepEqual(values, [{ i: 1 }, { i: 2 }]);
    assert.equal(h.generations.length, 1);
    assert.equal(h.generations[0].opts.windowsHide, true);
    assert.deepEqual(h.generations[0].opts.stdio, ['pipe', 'pipe', 'pipe']);
    assert.equal(h.generations[0].args.includes('--data-dir'), true);
  } finally { await h.worker.close(); }
  await assert.rejects(h.worker.call('status'), { code: 'disposed' });
});

test('backend structured errors survive without restarting the collection', async () => {
  const h = harness((child, request) => child.stdout.write(JSON.stringify({ id: request.id, ok: false, error: { code: 'conflict', message: 'Changed elsewhere' } }) + '\n'));
  try {
    await assert.rejects(h.worker.call('notes.update'), { code: 'conflict', message: 'Changed elsewhere' });
    await assert.rejects(h.worker.call('notes.update'), { code: 'conflict' });
    assert.equal(h.generations.length, 1);
  } finally { await h.worker.close(); }
});

test('pre-dispatch cancellation never spawns or mutates', async () => {
  const h = harness(() => assert.fail('must not dispatch'));
  await assert.rejects(h.worker.call('notes.add', {}, { signal: AbortSignal.abort() }), { code: 'cancelled' });
  assert.equal(h.generations.length, 0);
  await h.worker.close();
});

test('malformed worker output rejects generation and kills unsafe process', async () => {
  const h = harness((child) => setImmediate(() => child.stdout.write('NOT JSON\n')));
  await assert.rejects(h.worker.call('status'), { code: 'protocol' });
  assert.equal(h.generations[0].child.killed, true);
  await h.worker.close();
});

test('unexpected child exit rejects all pending calls', async () => {
  const h = harness((child) => setImmediate(() => { child.stderr.write('collection is locked'); child.emit('exit', 2, null); }));
  const calls = [h.worker.call('status'), h.worker.call('models.list')];
  const outcomes = await Promise.allSettled(calls);
  for (const outcome of outcomes) {
    assert.equal(outcome.status, 'rejected');
    assert.equal(outcome.reason.code, 'worker-exit');
    assert.doesNotMatch(outcome.reason.message, /collection is locked/);
    assert.match(outcome.reason.message, /withheld/);
  }
  await h.worker.close();
});

test('queued read timeout starts only after the long import finishes', async () => {
  let busy = false;
  const h = harness((child, request) => {
    assert.equal(busy, false, 'never dispatch concurrently');
    busy = true;
    const finish = () => { busy = false; reply(child, request.id, request.action); };
    if (request.action === 'import.apkg') setTimeout(finish, 35);
    else setImmediate(finish);
  }, { timeoutMs: 15 });
  try {
    assert.deepEqual(await Promise.all([h.worker.call('import.apkg'), h.worker.call('status')]), ['import.apkg', 'status']);
  } finally { await h.worker.close(); }
});

test('cancelling a queued mutation prevents dispatch after the active call', async () => {
  const actions = [];
  const h = harness((child, request) => { actions.push(request.action); setTimeout(() => reply(child, request.id, {}), 20); });
  const controller = new AbortController();
  try {
    const first = h.worker.call('status');
    const second = h.worker.call('notes.add', {}, { signal: controller.signal });
    controller.abort();
    await first;
    await assert.rejects(second, { code: 'cancelled' });
    assert.deepEqual(actions, ['status']);
  } finally { await h.worker.close(); }
});

test('a terminating worker cannot overlap a replacement collection process', async () => {
  const h = harness((child) => {
    child.kill = () => { child.killed = true; return true; };
    setImmediate(() => child.stdout.write('not json\n'));
  });
  await assert.rejects(h.worker.call('status'), { code: 'protocol' });
  await assert.rejects(h.worker.call('notes.add'), { code: 'worker-stopping' });
  assert.equal(h.generations.length, 1);
  h.generations[0].child.emit('exit', 1, null);
  await h.worker.close();
});

test('native diagnostics cannot leak credentials through logs or errors', async () => {
  const logs = [];
  const h = harness((child) => setImmediate(() => {
    child.stderr.write('PASSWORD=secret hkey=auth-token');
    child.stderr.write('password again');
    child.emit('exit', 2, null);
  }), { log: (message) => logs.push(message) });
  try {
    await assert.rejects(h.worker.call('account.login', { username: 'u', password: 'secret' }), (error) => error.code === 'worker-exit' && !/secret|auth-token/.test(error.message));
    assert.equal(logs.length, 1);
    assert.doesNotMatch(logs.join(''), /secret|auth-token/);
  } finally { await h.worker.close(); }
});

test('queue-head automatic eligibility guard prevents any stdin or spawn effect', async () => {
  const h = harness(() => assert.fail('must not dispatch'));
  await assert.rejects(h.worker.call('sync.run', {}, { canDispatch: () => false }), { code: 'auto-deferred' });
  assert.equal(h.generations.length, 0);
  await h.worker.close();
});

test('invalid JSON requests fail before spawning or allocating a pending timer', async () => {
  const h = harness(() => assert.fail('must not dispatch'));
  const params = {}; params.circular = params;
  await assert.rejects(h.worker.call('notes.add', params), { code: 'request-invalid' });
  assert.equal(h.generations.length, 0);
  assert.equal(h.worker.pending.size, 0);
  await h.worker.close();
});

test('throwing diagnostic logger cannot disrupt worker responses', async () => {
  const h = harness((child, request) => setImmediate(() => { child.stderr.write('suppressed'); reply(child, request.id, {}); }), { log() { throw new Error('logger offline'); } });
  try { assert.deepEqual(await h.worker.call('status'), {}); }
  finally { await h.worker.close(); }
});

test('timeout never silently retries a possibly committed mutation', async () => {
  const h = harness(() => {}, { timeoutMs: 15 });
  const keepAlive = setTimeout(() => {}, 250);
  try {
    await assert.rejects(h.worker.call('notes.add'), (error) => error.code === 'timeout' && /already have been saved/.test(error.message));
    assert.equal(h.generations.length, 1);
    assert.equal(h.generations[0].child.killed, true);
  } finally { clearTimeout(keepAlive); await h.worker.close(); }
});
