"""Deploy the matching CPython runtime, never touching any Anki profile.

Run with any Python 3.12+:
  python scripts/setup_runtime.py --source ../dsh-anki-research/runtime
Only copies absent files into this bundle's runtime directory. Existing files
must match byte-for-byte; upgrades require a separate reviewed deployment.
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', required=True, type=Path)
    args = parser.parse_args()
    source = args.source.resolve(strict=True)
    destination = ROOT / 'runtime'
    if source == destination.resolve():
        raise SystemExit('Source and destination must differ.')
    required = ['python.exe', 'python313.dll', 'python313.zip', 'python313._pth', 'LICENSE.txt']
    if any(not (source / name).is_file() for name in required):
        raise SystemExit('Expected the official CPython 3.13 embeddable Windows x64 runtime.')
    version = subprocess.check_output([str(source / 'python.exe'), '-c', 'import sys; print(sys.version.split()[0])'], text=True).strip()
    if version != '3.13.5':
        raise SystemExit(f'Refusing unverified runtime {version}; this bundle is tested with 3.13.5.')
    records = {}
    for item in sorted(source.iterdir()):
        if item.is_symlink() or not item.is_file():
            raise SystemExit(f'Unexpected non-file runtime entry: {item.name}')
        digest = hashlib.sha256(item.read_bytes()).hexdigest()
        target = destination / item.name
        if target.exists():
            if target.is_symlink() or hashlib.sha256(target.read_bytes()).hexdigest() != digest:
                raise SystemExit(f'Existing runtime differs; not overwriting {target}')
        else:
            destination.mkdir(parents=True, exist_ok=True)
            shutil.copy2(item, target)
        records[item.name] = digest
    manifest = ROOT / 'runtime-sha256.json'
    encoded = json.dumps({'version': version, 'files': records}, indent=2) + '\n'
    if manifest.exists() and manifest.read_text(encoding='utf-8') != encoded:
        raise SystemExit('Existing runtime manifest differs; not overwriting it.')
    if not manifest.exists():
        manifest.write_text(encoded, encoding='utf-8')
    print(json.dumps({'runtime': str(destination), 'version': version, 'files': len(records)}))


if __name__ == '__main__':
    main()
