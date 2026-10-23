"""Read-only review of the 1.2.0 feature release against 1.1.1; no extraction."""
from pathlib import Path
import json
import tarfile

root = Path(__file__).resolve().parents[1]

def contents(version):
    with tarfile.open(root.parent / f'dsh-anki-workspace-{version}.tgz', 'r:gz') as release:
        return {m.name.removeprefix('package/'): release.extractfile(m).read()
                for m in release.getmembers() if m.isfile()}

old, new = contents('1.1.1'), contents('1.2.0')
assert old.keys() == new.keys(), 'feature release must not add packaged executables/artifacts'
changes = {name for name in old if old[name] != new[name]}
expected = {'index.js', 'auto-sync.js', 'client.js', 'backend/worker.py',
            'locale/en.json', 'locale/zh.json', 'package.json',
            'README.md', 'VERIFICATION.md', 'ACCEPTANCE.md'}
assert changes == expected, changes
assert json.loads(new['package.json'])['version'] == '1.2.0'
assert all(old[name] == new[name] for name in old if name.startswith('runtime/'))
assert old['backend/sync_service.py'] == new['backend/sync_service.py']
assert old['worker-client.js'] == new['worker-client.js']
assert old['cordis.patch.yml'] == new['cordis.patch.yml']
assert old['runtime-sha256.json'] == new['runtime-sha256.json']
print('PASS: expected feature-only scope; packaged files, runtime, sync/DPAPI, transport, patch and licenses unchanged.')
print('MODIFIED:', ', '.join(sorted(changes)))
