// Real, relocated-package smoke test. Never opens an existing collection.
// Pass an extracted package directory as argv[2] (defaults to this checkout).
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = resolve(process.argv[2] || fileURLToPath(new URL('..', import.meta.url)));
const scratch = await mkdtemp(join(fileURLToPath(new URL('.', import.meta.url)), '.self-contained-'));
// Deliberately poison external Python/package settings; embedded Python must
// resolve only its own stdlib and our explicit bundled core, not these values.
process.env.PYTHONPATH = join(scratch, 'nonexistent-external-python');
process.env.PYTHONHOME = join(scratch, 'nonexistent-external-home');
process.env.ANKI_PACKAGES = join(scratch, 'nonexistent-external-anki');
const probe = `import sys, pathlib, json
root = pathlib.Path(sys.argv[1]).resolve()
core = root / 'core'
sys.path.insert(0, str(core))
import anki, anki._rsbridge, decorator, markdown, orjson, google.protobuf, requests, typing_extensions, charset_normalizer, idna, urllib3, certifi, socks
modules = [anki, anki._rsbridge, decorator, markdown, orjson, google.protobuf, requests, typing_extensions, charset_normalizer, idna, urllib3, certifi, socks]
for module in modules:
    locations = [module.__file__] if module.__file__ else list(module.__path__)
    assert locations and all(pathlib.Path(location).resolve().is_relative_to(core) for location in locations), (module.__name__, locations)
for entry in sys.path:
    assert pathlib.Path(entry).resolve().is_relative_to(root), sys.path
assert not any(name == 'aqt' or name.startswith('PyQt') for name in sys.modules)
print(json.dumps({'bundledImports': len(modules), 'paths': sys.path}))
`;
const result = spawnSync(join(root, 'runtime/python.exe'), ['-B', '-c', probe, root], { encoding: 'utf8', env: process.env, cwd: scratch });
assert.equal(result.status, 0, result.stderr || String(result.error));
const imports = JSON.parse(result.stdout);
const { AnkiWorkerClient } = await import(pathToFileURL(join(root, 'worker-client.js')).href);
const worker = new AnkiWorkerClient({ dataDir: join(scratch, 'collection') });
assert.equal(worker.ankiPackages, join(root, 'core'));
assert.equal(worker.bundledPython, true);
try {
  const status = await worker.call('status');
  assert.match(status.version, /^26\.05/);
  assert.equal(status.noteCount, 0);
  const deck = await worker.call('decks.create', { name: 'Self contained smoke' });
  const models = await worker.call('models.list');
  const model = models.find(item => item.type === 0 && item.fields.length === 2);
  assert.ok(model);
  const note = await worker.call('notes.add', { deckId: deck.id, modelId: model.id,
    fields: { [model.fields[0]]: 'Bundled question', [model.fields[1]]: 'Bundled answer' }, tags: ['bundled-test'] });
  assert.ok(note.id);
  assert.equal((await worker.call('notes.search', { query: 'tag:bundled-test' })).total, 1);
  const next = await worker.call('review.next', { deckId: deck.id });
  assert.ok(next.token);
  await worker.call('review.reveal', { token: next.token });
  await worker.call('review.answer', { token: next.token, rating: 3 });
  const exported = await worker.call('export.apkg', { deckId: deck.id, filename: 'bundled-smoke.apkg' });
  assert.ok(exported);
  console.log(JSON.stringify({ passed: true, root, scratch, imports, version: status.version,
    operations: ['status', 'decks.create', 'models.list', 'notes.add', 'notes.search', 'review.next', 'review.reveal', 'review.answer', 'export.apkg'] }));
} finally {
  await worker.close();
}
// Every bundled source/native file must still match its release hash.
const manifest = JSON.parse(await readFile(join(root, 'core-sha256.json'), 'utf8'));
const { createHash } = await import('node:crypto');
for (const [name, hash] of Object.entries(manifest.files)) {
  assert.equal(createHash('sha256').update(await readFile(join(root, 'core', name))).digest('hex'), hash, name);
}
