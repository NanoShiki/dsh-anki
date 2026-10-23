"""Read-only 1.2.2 -> 1.3.0 UI-redesign archive comparison; never extracts."""
import json
from pathlib import Path, PurePosixPath
import re
import sys
import tarfile


def read_archive(filename):
    files = {}
    with tarfile.open(Path(filename).resolve(strict=True), 'r:gz') as archive:
        for member in archive.getmembers():
            path = PurePosixPath(member.name)
            assert member.isfile() and path.parts[0] == 'package' and '..' not in path.parts
            assert not path.is_absolute() and member.name not in files
            assert member.size < 32 * 1024 * 1024
            files[member.name] = archive.extractfile(member).read()
    assert sum(map(len, files.values())) < 64 * 1024 * 1024
    return files


old, new = map(read_archive, sys.argv[1:3])
assert old.keys() == new.keys(), 'packaged file set changed'
changed = {name for name in old if old[name] != new[name]}
allowed = {'package/' + name for name in (
    'client.js', 'locale/en.json', 'locale/zh.json', 'package.json',
    'README.md', 'VERIFICATION.md', 'ACCEPTANCE.md')}
assert changed == allowed, changed
old_manifest, new_manifest = [json.loads(files['package/package.json']) for files in (old, new)]
assert old_manifest.pop('version') == '1.2.2'
assert new_manifest.pop('version') == '1.3.0'
assert old_manifest == new_manifest, 'identity, dependencies, installation and runtime contract unchanged'
# Every file outside the UI/locales/release docs must remain byte-identical,
# including all 34 pinned runtime files, backend, owner routes and AI tool.
# This check is deliberately archive-to-archive: it stays valid for the fixed
# 1.2.2 -> 1.3.0 pair after later releases change the working tree.
for name in new:
    assert not name.startswith('package/tests/'), name
for language in ('en', 'zh'):
    before = json.loads(old[f'package/locale/{language}.json'])
    after = json.loads(new[f'package/locale/{language}.json'])
    assert before.keys() <= after.keys(), 'existing locale keys must remain supported'
    assert all(isinstance(value, str) for value in after.values())
assert json.loads(new['package/locale/en.json']).keys() == json.loads(new['package/locale/zh.json']).keys()
for name in ('README.md', 'VERIFICATION.md', 'ACCEPTANCE.md'):
    assert not re.search(rb'\d+\s+notes/cards|Current DSH profile:|user screenshot|production AI|desktop DSH profile|user installed', new['package/' + name]), name
print(json.dumps({'passed': True, 'changed': sorted(changed), 'unchangedFiles': len(new) - len(changed),
                  'scope': 'native client UI/locales and release version/docs; worker, sync, AI/owner routes, runtime and data identities byte-identical'}))
