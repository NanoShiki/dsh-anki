"""Maintainer-only: assemble pinned Windows x64 headless wheels (no pip/install hooks).

Run --resolve-lock once to resolve reviewed version pins through PyPI, then commit
core-lock.json. Normal runs use ONLY locked URLs and SHA-256. --sources additionally
fetches dependency sdists into the download cache for the source release.
End users get the assembled core in the tgz and never run this script.
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[1]
PINS = {'anki': '26.5', 'decorator': '5.3.1', 'markdown': '3.10.2',
        'orjson': '3.11.9', 'protobuf': '7.35.1', 'requests': '2.34.2',
        'typing_extensions': '4.15.0', 'charset_normalizer': '3.4.7',
        'idna': '3.18', 'urllib3': '2.7.0', 'certifi': '2026.5.20', 'PySocks': '1.7.1'}
TAGS = ('-py3-none-any.whl', '-py2.py3-none-any.whl',
        '-cp313-cp313-win_amd64.whl', '-cp310-abi3-win_amd64.whl')


def digest(data):
    return hashlib.sha256(data).hexdigest()


def fetch(url, destination):
    if not url.startswith(('https://pypi.org/', 'https://files.pythonhosted.org/')):
        raise ValueError('Unexpected artifact host: ' + url)
    destination.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(['curl', '--fail', '--silent', '--show-error', '--location',
                    '--retry', '4', '--retry-all-errors', '--connect-timeout', '30',
                    '--max-time', '300', '--output', str(destination), url], check=True)


def artifact(record):
    return {'filename': record['filename'], 'url': record['url'],
            'sha256': record['digests']['sha256'], 'size': record['size']}


def resolve_lock(cache):
    packages = []
    for name, version in PINS.items():
        metadata = cache / f'{name}-{version}.json'
        if not metadata.exists():
            fetch(f'https://pypi.org/pypi/{name}/{version}/json', metadata)
        data = json.loads(metadata.read_text(encoding='utf-8'))
        wheels = [item for item in data['urls'] if item['filename'].endswith(TAGS)]
        # Prefer the compiled CPython-specific wheel over a universal fallback.
        native = [item for item in wheels if 'win_amd64' in item['filename']]
        wheels = native or wheels
        if len(wheels) != 1:
            raise ValueError(f'Expected exactly one compatible wheel for {name}: {wheels}')
        sources = [artifact(item) for item in data['urls'] if item['packagetype'] == 'sdist']
        packages.append({'name': name, 'version': version, 'wheel': artifact(wheels[0]),
                         'sources': sources, 'requiresDist': data['info'].get('requires_dist') or [],
                         'licenseExpression': data['info'].get('license_expression'),
                         'license': data['info'].get('license')})
        print('Resolved', name, version, flush=True)
    return {'platform': 'win_amd64', 'python': '3.13.5',
            'ankiSourceCommit': 'e64c6b1aee3e8d668fb8bbe084beada8e070d985',
            'packages': packages}


def checked_download(item, cache):
    path = cache / item['filename']
    if not path.exists():
        fetch(item['url'], path)
    data = path.read_bytes()
    if len(data) != item['size'] or digest(data) != item['sha256']:
        raise ValueError(f'Artifact hash/size mismatch: {path}; inspect and remove bad download manually')
    return path


def assemble(lock, cache, destination, sources):
    records = {}
    for package in lock['packages']:
        wheel = checked_download(package['wheel'], cache)
        if sources:
            for source in package['sources']:
                checked_download(source, cache)
        with zipfile.ZipFile(wheel) as archive:
            for info in archive.infolist():
                if info.is_dir():
                    continue
                path = PurePosixPath(info.filename)
                if path.is_absolute() or '..' in path.parts or '\\' in info.filename or ':' in info.filename:
                    raise ValueError('Unsafe wheel path: ' + info.filename)
                if any(part.endswith('.data') for part in path.parts):
                    raise ValueError('Wheel requires installation remapping: ' + info.filename)
                if path.suffix == '.pyc' or '__pycache__' in path.parts:
                    raise ValueError('Unexpected bytecode in wheel')
                if ((info.external_attr >> 16) & 0o170000) == 0o120000:
                    raise ValueError('Wheel symlink not supported')
                data = archive.read(info)
                if info.filename in records:
                    raise ValueError('Duplicate wheel path: ' + info.filename)
                records[info.filename] = digest(data)
                target = destination.joinpath(*path.parts)
                if target.exists():
                    if target.is_symlink() or digest(target.read_bytes()) != records[info.filename]:
                        raise ValueError('Existing core file differs: ' + str(target))
                else:
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_bytes(data)
        print('Assembled', package['name'], flush=True)
    manifest = {'platform': lock['platform'], 'ankiVersion': '26.5', 'files': records}
    target = ROOT / 'core-sha256.json'
    encoded = json.dumps(manifest, indent=2, sort_keys=True) + '\n'
    if target.exists() and target.read_text(encoding='utf-8') != encoded:
        raise ValueError('Existing core manifest differs; review upgrade before replacing')
    target.write_text(encoded, encoding='utf-8')
    print(json.dumps({'files': len(records), 'core': str(destination)}))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cache', type=Path, default=ROOT.parent / 'anki-core-downloads')
    parser.add_argument('--resolve-lock', action='store_true')
    parser.add_argument('--sources', action='store_true')
    args = parser.parse_args()
    lock_path = ROOT / 'core-lock.json'
    if args.resolve_lock:
        if lock_path.exists():
            raise ValueError('Lock exists; do not silently resolve a new dependency set')
        lock = resolve_lock(args.cache)
        lock_path.write_text(json.dumps(lock, indent=2) + '\n', encoding='utf-8')
    else:
        lock = json.loads(lock_path.read_text(encoding='utf-8'))
    assemble(lock, args.cache, ROOT / 'core', args.sources)


if __name__ == '__main__':
    main()
