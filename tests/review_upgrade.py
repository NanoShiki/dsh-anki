"""Read-only comparison with the installed 1.0.0 release; no extraction."""
from pathlib import Path
import difflib
import tarfile

root = Path(__file__).resolve().parents[1]
with tarfile.open(root.parent / 'dsh-anki-workspace-1.0.0.tgz', 'r:gz') as release:
    old = {m.name.removeprefix('package/'): release.extractfile(m).read()
           for m in release.getmembers() if m.isfile()}
    changes = []
    for name, before in old.items():
        path = root / name
        if not path.exists() or path.read_bytes() != before:
            changes.append(name)
    print('MODIFIED:', ', '.join(changes))
    for name in ['index.js', 'worker-client.js', 'backend/worker.py']:
        print('\n'.join(difflib.unified_diff(old[name].decode('utf-8').splitlines(),
              (root / name).read_text(encoding='utf-8').splitlines(),
              fromfile='1.0.0/' + name, tofile='1.1.0/' + name, lineterm='')))
