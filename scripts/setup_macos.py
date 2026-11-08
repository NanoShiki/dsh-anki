"""Rebuild offline Mac assets from locked runtime archives and wheels (Python 3.12+)."""
import argparse
import gzip
import hashlib
import json
from pathlib import Path, PurePosixPath
import shutil
import subprocess
import tarfile
import zipfile

from setup_core import ROOT, checked_download


def build(cache):
    dest = ROOT / "macos"
    sources = json.loads((dest / "sources.json").read_bytes())
    packages = json.loads((ROOT / "core-lock.json").read_bytes())["packages"]
    cache.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for arch, source in sources.items():
        runtime = source["runtime"]
        archive = cache / runtime["filename"]
        if not archive.exists():
            subprocess.run(["curl", "-fsSL", "--retry", "3", "-o", str(archive), runtime["url"]], check=True)
        if hashlib.sha256(archive.read_bytes()).hexdigest() != runtime["sha256"]:
            raise ValueError("Runtime digest mismatch: " + str(archive))
        shutil.copyfile(archive, dest / f"python-{arch}.tar.gz")
        core = dest / f"core-{arch}.tar.gz"
        names = set()
        with core.open("wb") as out, gzip.GzipFile(filename="", fileobj=out, mode="wb", mtime=0) as compressed:
            with tarfile.open(fileobj=compressed, mode="w|") as bundle:
                for pkg in packages:
                    wheel = source["wheels"].get(pkg["name"], pkg["wheel"])
                    if "win_amd64" in wheel["filename"]:
                        raise ValueError("Missing Mac wheel for " + pkg["name"])
                    with zipfile.ZipFile(checked_download(wheel, cache)) as z:
                        for info in sorted(z.infolist(), key=lambda i: i.filename):
                            if info.is_dir():
                                continue
                            path = PurePosixPath(info.filename)
                            if path.is_absolute() or ".." in path.parts or info.filename in names or any(p.endswith(".data") for p in path.parts):
                                raise ValueError("Unexpected wheel member: " + info.filename)
                            names.add(info.filename)
                            entry = tarfile.TarInfo("core/" + info.filename)
                            entry.size = info.file_size
                            with z.open(info) as data:
                                bundle.addfile(entry, data)
        manifest[arch] = {"python": runtime["sha256"], "core": hashlib.sha256(core.read_bytes()).hexdigest()}
    (dest / "sha256.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cache", type=Path, default=ROOT.parent / "anki-core-downloads")
    build(parser.parse_args().cache)
