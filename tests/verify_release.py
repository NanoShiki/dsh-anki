"""Read-only release integrity check; never extracts the archive."""
import hashlib
import json
from pathlib import Path, PurePosixPath
import sys
import tarfile

archive = Path(sys.argv[1]).resolve(strict=True)
with tarfile.open(archive, 'r:gz') as release:
    files = {}
    for member in release.getmembers():
        path = PurePosixPath(member.name)
        assert path.parts[0] == 'package' and '..' not in path.parts and not path.is_absolute(), member.name
        assert member.isfile(), f'non-file entry: {member.name}'
        assert member.name not in files, f'duplicate entry: {member.name}'
        assert member.size < 32 * 1024 * 1024, member.name
        forbidden = ('.anki2', '.anki2-wal', '.anki2-shm', '.apkg', '.colpkg', '.dpapi', '.tmp', '.pyc', '.pyd')
        if not member.name.startswith('package/runtime/'):
            assert not member.name.endswith(forbidden), f'collection/core artifact: {member.name}'
        assert 'host-fixture' not in member.name and '__pycache__' not in member.name, member.name
        files[member.name] = release.extractfile(member).read()
    assert sum(map(len, files.values())) < 64 * 1024 * 1024
    required = ['index.js', 'worker-client.js', 'auto-sync.js', 'client.js', 'backend/worker.py', 'backend/sync_service.py', 'package.json', 'cordis.patch.yml',
                'locale/en.json', 'locale/zh.json', 'icon.svg', 'README.md', 'LICENSE', 'ANKI-LICENSE.txt',
                'THIRD-PARTY-NOTICES.md', 'VERIFICATION.md', 'ACCEPTANCE.md', 'runtime-sha256.json', 'runtime/LICENSE.txt']
    for name in required:
        assert f'package/{name}' in files, f'missing: {name}'
    assert len(files['package/LICENSE']) > 30000
    manifest = json.loads(files['package/package.json'])
    assert manifest['name'] == '@local/dsh-anki' and manifest['version'] == '1.3.0'
    assert manifest['repository']['url'] == 'git+https://github.com/NanoShiki/dsh-anki.git'
    assert b"id: '@local/dsh-anki'," in files['package/client.js']
    assert b"name: '@local/dsh-anki'" in files['package/cordis.patch.yml']
    assert b'id: local-anki\n' in files['package/cordis.patch.yml']
    assert b'dsh-anki-workspace' not in files['package/cordis.patch.yml']
    assert set(manifest['scripts']) == {'test:client', 'test:backend'}, 'unexpected lifecycle scripts'
    assert manifest['dsh']['bundle']['patch'] == './cordis.patch.yml'
    runtime = json.loads(files['package/runtime-sha256.json'])
    assert runtime['version'] == '3.13.5'
    expected = {f'package/runtime/{name}' for name in runtime['files']}
    assert {name for name in files if name.startswith('package/runtime/')} == expected
    for name, checksum in runtime['files'].items():
        assert hashlib.sha256(files[f'package/runtime/{name}']).hexdigest() == checksum, name
    assert not any(name.startswith('package/tests/') for name in files)
print(json.dumps({'passed': True, 'archive': str(archive), 'files': len(files), 'runtimeFiles': len(expected),
                  'bytes': archive.stat().st_size, 'sha256': hashlib.sha256(archive.read_bytes()).hexdigest()}))
