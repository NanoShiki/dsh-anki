"""Fast repository/package integrity check used by CI and before a release.

Checks the manifest, the plugin-manager locale metadata, the pinned bundled
runtime/core hashes, required notices, and that no private collection or
credential artifacts are tracked. Read-only; never opens a collection.
"""
import hashlib
import json
import re
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
FORBIDDEN_SUFFIXES = ('.anki2', '.anki2-wal', '.anki2-shm', '.apkg', '.colpkg',
                      '.dpkg', '.backup', '.pyc', '.log')
FORBIDDEN_PARTS = ('__pycache__', 'backups', 'credentials', 'sessions')


def fail(message):
    raise SystemExit(f'FAIL: {message}')


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def check_manifest():
    manifest = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))
    if manifest['name'] != '@local/dsh-anki':
        fail(f"package name changed: {manifest['name']}")
    if not re.fullmatch(r'\d+\.\d+\.\d+', manifest['version']):
        fail(f"version is not semver: {manifest['version']}")
    if manifest['dsh']['bundle']['patch'] != './cordis.patch.yml':
        fail('dsh.bundle.patch must stay ./cordis.patch.yml')
    if manifest['dsh']['client']['platform'] != 'web':
        fail('dsh.client.platform must stay web')
    files = set(manifest.get('files', []))
    for required in ('core/**', 'third-party-licenses/**', 'core-lock.json', 'core-sha256.json'):
        if required not in files:
            fail(f'package files must include {required}')
    if manifest.get('private') is not True:
        fail('package must stay private to avoid an unintended npm publish')
    return manifest


def check_locale():
    for language in ('en', 'zh'):
        data = json.loads((ROOT / 'locale' / f'{language}.json').read_text(encoding='utf-8'))
        title = data.get('meta', {}).get('title')
        if not isinstance(title, str) or not title.strip():
            fail(f'locale/{language}.json needs a non-empty meta.title for the plugin manager')
        if title != 'Anki':
            fail(f'locale/{language}.json meta.title should be Anki, got {title!r}')
    return 'Anki'


def check_hashes(manifest_name, folder_name):
    data = json.loads((ROOT / manifest_name).read_text(encoding='utf-8'))
    names = set(data['files'])
    folder = ROOT / folder_name
    actual = {path.relative_to(folder).as_posix() for path in folder.rglob('*')
              if path.is_file() and '__pycache__' not in path.parts and path.suffix != '.pyc'}
    if names != actual:
        missing = sorted(names - actual)[:5]
        extra = sorted(actual - names)[:5]
        fail(f'{manifest_name} does not match {folder_name}/: missing={missing} extra={extra}')
    for name, digest in data['files'].items():
        if sha256(folder / name) != digest:
            fail(f'hash mismatch: {folder_name}/{name}')
    return len(names)


def check_compatibility_declarations(manifest):
    """Exact host pins turn a routine DSH patch release into a risk banner.

    dshmarket evaluates every declared @deepseek-ai/dsh* peer against the
    installed host version, so a pinned 0.2.1-rc.2 flags the plugin as soon as
    the host moves to 0.2.1-rc.3. Keep these as ranges.
    """
    exact = re.compile(r'\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?')
    declared = (manifest.get('engines') or {}).get('dsh')
    if not isinstance(declared, str) or not declared.strip():
        fail('engines.dsh must declare the supported DSH range')
    if exact.fullmatch(declared.strip()):
        fail('engines.dsh must be a range, not an exact version')
    peers = manifest.get('peerDependencies') or {}
    for name, spec in peers.items():
        if not name.startswith('@deepseek-ai/dsh'):
            continue
        if not isinstance(spec, str) or exact.fullmatch(spec.strip()):
            fail(f'peerDependencies.{name} pins an exact host version; use a range')
    return declared, len(peers)


def check_notices():
    notices = ROOT / 'third-party-licenses'
    for name in ('README.md', 'ANKI-NATIVE-NOTICES.txt', 'PYTHON-NATIVE-NOTICES.txt',
                 'protobuf-utf8-range-LICENSE.txt'):
        if not (notices / name).is_file():
            fail(f'missing third-party notice: {name}')
    if (ROOT / 'ANKI-LICENSE.txt').stat().st_size < 1000:
        fail('ANKI-LICENSE.txt looks incomplete')
    if (ROOT / 'LICENSE').stat().st_size < 30000:
        fail('LICENSE looks incomplete')


def check_tracked_files():
    try:
        out = subprocess.run(['git', 'ls-files', '-z'], cwd=ROOT, capture_output=True,
                             check=True).stdout.decode('utf-8')
    except (OSError, subprocess.CalledProcessError):
        return 'skipped (not a git checkout)'
    for name in out.split('\0'):
        if not name:
            continue
        path = Path(name)
        if path.suffix.lower() in FORBIDDEN_SUFFIXES:
            fail(f'forbidden tracked artifact: {name}')
        lowered = {part.lower() for part in path.parts}
        if lowered & set(FORBIDDEN_PARTS):
            fail(f'forbidden tracked path: {name}')
        if name.startswith('tests/') and ('.self-contained-' in name or 'host-fixture-' in name):
            fail(f'test scratch directory is tracked: {name}')
    return 'clean'


def main():
    manifest = check_manifest()
    title = check_locale()
    engine_range, peer_count = check_compatibility_declarations(manifest)
    runtime_count = check_hashes('runtime-sha256.json', 'runtime')
    core_count = check_hashes('core-sha256.json', 'core')
    check_notices()
    tracked = check_tracked_files()
    print(json.dumps({'ok': True, 'package': manifest['name'], 'version': manifest['version'],
                      'displayTitle': title, 'enginesDsh': engine_range, 'peers': peer_count,
                      'runtimeFiles': runtime_count,
                      'coreFiles': core_count, 'tracked': tracked}, ensure_ascii=False))


if __name__ == '__main__':
    main()
