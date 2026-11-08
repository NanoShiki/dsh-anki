import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rename, rm } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const extract = promisify(execFile);

// npm installs can be read-only and may discard executable modes and symlinks.
// Keep the upstream runtime tar intact and expand it in a private user cache.
export function macBundle(root, arch = process.arch, cache = join(homedir(), 'Library', 'Caches', 'dsh-anki')) {
  const assets = join(root, 'macos');
  const hashes = JSON.parse(readFileSync(join(assets, 'sha256.json'), 'utf8'))[arch];
  if (!hashes) throw new Error('DSH Anki requires an arm64 or x64 macOS host.');
  const directory = join(cache, arch + '-' + hashes.python + '-' + hashes.core);
  return {
    python: join(directory, 'python', 'bin', 'python3.13'),
    core: join(directory, 'core'),
    async prepare() {
      if (existsSync(directory)) return;
      await mkdir(cache, { recursive: true, mode: 0o700 });
      const stage = await mkdtemp(join(cache, '.install-'));
      try {
        for (const [part, expected] of Object.entries(hashes)) {
          const archive = join(assets, part + '-' + arch + '.tar.gz');
          if (createHash('sha256').update(await readFile(archive)).digest('hex') !== expected)
            throw new Error('Bundled macOS archive failed integrity verification: ' + part);
          await extract('/usr/bin/tar', ['-xzf', archive, '-C', stage]);
        }
        try { await rename(stage, directory); }
        catch (error) {
          // A second host may have completed the exact same installation first.
          if (!['EEXIST', 'ENOTEMPTY'].includes(error.code) || !existsSync(directory)) throw error;
        }
      } finally { await rm(stage, { recursive: true, force: true }); }
    },
  };
}
