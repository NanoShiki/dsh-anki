"""Read-only 1.1.0 -> 1.1.1 release comparison; never extracts either archive."""
from pathlib import Path
import difflib
import json
import tarfile

root = Path(__file__).resolve().parents[1]

def contents(version):
    archive = root.parent / f'dsh-anki-workspace-{version}.tgz'
    with tarfile.open(archive, 'r:gz') as release:
        return {m.name.removeprefix('package/'): release.extractfile(m).read()
                for m in release.getmembers() if m.isfile()}

old, new = contents('1.1.0'), contents('1.1.1')
assert old.keys() == new.keys(), 'patch must not add/remove packaged files'
changes = {name for name in old if old[name] != new[name]}
expected = {'client.js', 'package.json', 'README.md', 'VERIFICATION.md', 'ACCEPTANCE.md'}
assert changes == expected, changes
assert json.loads(old['package.json'])['version'] == '1.1.0'
assert json.loads(new['package.json'])['version'] == '1.1.1'
print('PASS: only layout CSS, version and documentation changed; worker/sync/runtime/permissions unchanged.')
print('MODIFIED:', ', '.join(sorted(changes)))
print('\n'.join(difflib.unified_diff(old['client.js'].decode('utf-8').splitlines(),
      new['client.js'].decode('utf-8').splitlines(),
      fromfile='1.1.0/client.js', tofile='1.1.1/client.js', lineterm='')))
