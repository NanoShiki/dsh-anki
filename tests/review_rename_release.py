"""Read-only 1.2.0 -> 1.2.1 comparison; never opens a collection."""
import json
from pathlib import Path
import re
import sys
import tarfile


def contents(path):
    with tarfile.open(Path(path).resolve(strict=True), 'r:gz') as archive:
        files = {}
        for entry in archive.getmembers():
            assert entry.isfile() and entry.name.startswith('package/')
            assert entry.name not in files
            files[entry.name] = archive.extractfile(entry).read()
        return files


def normalized(name, content):
    return content if name.startswith('package/runtime/') else content.replace(b'\r\n', b'\n')


before, after = map(contents, sys.argv[1:3])
assert set(before) == set(after), 'Packaged file scope changed'
changed = {name for name in before if normalized(name, before[name]) != normalized(name, after[name])}
allowed = {'package/' + name for name in (
    'package.json', 'client.js', 'cordis.patch.yml', 'README.md', 'VERIFICATION.md', 'ACCEPTANCE.md',
)}
assert changed == allowed, f'Unexpected changed scope: {sorted(changed)}'
client = 'package/client.js'
assert normalized(client, after[client]) == normalized(client, before[client]).replace(
    b"id: '@local/dsh-anki-workspace',", b"id: '@local/dsh-anki',", 1), 'Client changed beyond bundle identity'
patch = 'package/cordis.patch.yml'
assert normalized(patch, after[patch]) == normalized(patch, before[patch]).replace(
    b'id: local-anki-workspace', b'id: local-anki', 1).replace(
    b"name: '@local/dsh-anki-workspace'", b"name: '@local/dsh-anki'", 1)
old = json.loads(before['package/package.json'])
new = json.loads(after['package/package.json'])
assert old.pop('name') == '@local/dsh-anki-workspace'
assert old.pop('version') == '1.2.0'
assert new.pop('name') == '@local/dsh-anki'
assert new.pop('version') == '1.2.1'
assert new.pop('repository') == {'type': 'git', 'url': 'git+https://github.com/NanoShiki/dsh-anki.git'}
assert old == new, 'Unrelated package metadata changed'
for name in ('README.md', 'ACCEPTANCE.md', 'VERIFICATION.md'):
    assert not re.search(rb'\d+\s+notes/cards|Current DSH profile:|user screenshot|production AI|desktop DSH profile|user installed',
                         after['package/' + name], re.IGNORECASE), f'Private acceptance metadata in {name}'
print(json.dumps({'passed': True, 'files': len(after), 'changedFiles': sorted(changed),
                  'runtimeFilesUnchanged': sum(name.startswith('package/runtime/') for name in before)}))
