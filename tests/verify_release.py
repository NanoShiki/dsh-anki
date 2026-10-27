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
        assert member.size < 64 * 1024 * 1024, member.name
        forbidden = ('.anki2', '.anki2-wal', '.anki2-shm', '.apkg', '.colpkg', '.dpapi', '.tmp', '.pyc', '.pyd')
        if member.name.startswith(('package/runtime/', 'package/core/')):
            assert not member.name.endswith(forbidden[:-1]), f'private/bytecode artifact: {member.name}'
        else:
            assert not member.name.endswith(forbidden), f'collection/core artifact: {member.name}'
        assert 'host-fixture' not in member.name and '__pycache__' not in member.name, member.name
        files[member.name] = release.extractfile(member).read()
    assert sum(map(len, files.values())) < 128 * 1024 * 1024
    required = ['index.js', 'worker-client.js', 'auto-sync.js', 'client.js', 'backend/worker.py', 'backend/sync_service.py', 'package.json', 'cordis.patch.yml',
                'locale/en.json', 'locale/zh.json', 'icon.svg', 'README.md', 'LICENSE', 'ANKI-LICENSE.txt',
                'THIRD-PARTY-NOTICES.md', 'VERIFICATION.md', 'ACCEPTANCE.md', 'runtime-sha256.json', 'runtime/LICENSE.txt']
    for name in required:
        assert f'package/{name}' in files, f'missing: {name}'
    assert len(files['package/LICENSE']) > 30000
    manifest = json.loads(files['package/package.json'])
    assert manifest['name'] == '@nanoshiki/dsh-anki' and manifest['version'] == '2.0.1'
    assert manifest['repository']['url'] == 'git+https://github.com/NanoShiki/dsh-anki.git'
    assert b"id: '@nanoshiki/dsh-anki'," in files['package/client.js']
    assert b"name: '@nanoshiki/dsh-anki'" in files['package/cordis.patch.yml']
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
    core = json.loads(files['package/core-sha256.json'])
    lock = json.loads(files['package/core-lock.json'])
    assert core['ankiVersion'] == '26.5' and core['platform'] == 'win_amd64'
    expected_core = {f'package/core/{name}' for name in core['files']}
    assert {name for name in files if name.startswith('package/core/')} == expected_core
    for name, checksum in core['files'].items():
        assert hashlib.sha256(files[f'package/core/{name}']).hexdigest() == checksum, name
    assert len(lock['packages']) == 12
    assert {item['name'] for item in lock['packages']} >= {'anki', 'protobuf', 'orjson', 'requests'}
    assert not any('/aqt/' in name or '/PyQt6/' in name for name in files)
    assert b"default('D:/Anki/app_packages')" not in files['package/index.js']
    assert b"join(ROOT, 'core')" in files['package/worker-client.js']
    for notice in ['third-party-licenses/README.md', 'third-party-licenses/ANKI-NATIVE-NOTICES.txt',
                   'third-party-licenses/PYTHON-NATIVE-NOTICES.txt', 'third-party-licenses/protobuf-utf8-range-LICENSE.txt']:
        assert f'package/{notice}' in files, f'missing notice: {notice}'
    assert len(files['package/third-party-licenses/ANKI-NATIVE-NOTICES.txt']) > 1_000_000
    assert len(files['package/third-party-licenses/PYTHON-NATIVE-NOTICES.txt']) > 100_000
    assert b'Yibo Cai' in files['package/third-party-licenses/protobuf-utf8-range-LICENSE.txt']
    assert not any(name.startswith('package/tests/') for name in files)
print(json.dumps({'passed': True, 'archive': str(archive), 'files': len(files), 'runtimeFiles': len(expected), 'coreFiles': len(expected_core),
                  'bytes': archive.stat().st_size, 'sha256': hashlib.sha256(archive.read_bytes()).hexdigest()}))
