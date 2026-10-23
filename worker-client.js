import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
export class AnkiWorkerError extends Error {
  constructor(code, message) { super(message); this.name = 'AnkiWorkerError'; this.code = code; }
}

/** One private, serial Anki process per installed Host plugin; no listening port. */
export class AnkiWorkerClient {
  constructor({ pythonPath, ankiPackages, dataDir, timeoutMs = 30_000, log = () => {}, spawnProcess = spawn }) {
    this.pythonPath = pythonPath || join(ROOT, 'runtime', process.platform === 'win32' ? 'python.exe' : 'bin/python3');
    this.ankiPackages = ankiPackages;
    this.dataDir = dataDir;
    this.timeoutMs = timeoutMs;
    this.log = log;
    this.spawnProcess = spawnProcess;
    this.pending = new Map();
    this.sequence = 0;
    this.child = null;
    this.stopping = null;
    this.queue = Promise.resolve();
    this.disposed = false;
  }

  start() {
    if (this.disposed) throw new AnkiWorkerError('disposed', 'Anki workspace has been stopped.');
    if (this.stopping) throw new AnkiWorkerError('worker-stopping', 'The previous Anki process is still closing. Refresh in a moment; do not retry a mutation automatically.');
    if (this.child) return;
    if (!existsSync(this.pythonPath)) throw new AnkiWorkerError('runtime-missing', 'Anki Python runtime is missing. Run the workspace setup script first.');
    if (!this.ankiPackages || !existsSync(join(this.ankiPackages, 'anki'))) {
      throw new AnkiWorkerError('core-missing', 'Anki core is missing. Set ankiPackages to the installed Anki app_packages directory.');
    }
    const child = this.spawnProcess(this.pythonPath, ['-u', join(ROOT, 'backend', 'worker.py'), '--data-dir', this.dataDir, '--anki-packages', this.ankiPackages], {
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' },
    });
    this.child = child;
    let diagnosticNotice = false;
    let lineBytes = 0;
    child.stdout.on('data', (chunk) => {
      for (const byte of chunk) {
        lineBytes = byte === 10 ? 0 : lineBytes + 1;
        if (lineBytes <= 16 * 1024 * 1024) continue;
        this.failGeneration(child, new AnkiWorkerError('response-limit', 'Anki response exceeds 16 MiB. Use a smaller search page; operation outcome may be unknown.'));
        return;
      }
    });
    const lines = createInterface({ input: child.stdout, crlfDelay: Infinity });
    lines.on('line', (line) => {
      if (this.stopping === child) return;
      let response;
      try {
        response = JSON.parse(line);
        if (!response || typeof response !== 'object' || !Number.isSafeInteger(response.id) || typeof response.ok !== 'boolean') throw new Error('Invalid envelope');
      } catch {
        this.failGeneration(child, new AnkiWorkerError('protocol', 'Invalid response from the Anki core; operation outcome may be unknown.'));
        return;
      }
      const waiting = this.pending.get(response.id);
      if (!waiting || waiting.child !== child) return;
      this.pending.delete(response.id);
      clearTimeout(waiting.timer);
      if (response.ok === true) waiting.resolve(response.result);
      else waiting.reject(new AnkiWorkerError(response.error?.code || 'backend-error', response.error?.message || 'Anki operation failed.'));
    });
    child.stderr.on('data', () => {
      // Native HTTP diagnostics may contain account material. Do not retain or
      // forward them into DSH logs, AI errors, or UI error envelopes.
      if (!diagnosticNotice) {
        diagnosticNotice = true;
        try { this.log('Anki native diagnostic output suppressed to protect account credentials.'); } catch { /* logging must not break the protocol */ }
      }
    });
    child.stdin.on('error', (error) => this.failGeneration(child, new AnkiWorkerError('worker-io', error.message)));
    child.once('error', (error) => {
      lines.close();
      this.failGeneration(child, new AnkiWorkerError('worker-start', error.message), { exited: true });
    });
    child.once('exit', (code, signal) => {
      lines.close();
      this.failGeneration(child, new AnkiWorkerError('worker-exit', `Anki core exited (${signal || code}). Native diagnostic details are withheld to protect account credentials.`), { exited: true });
    });
  }

  failGeneration(child, error, { exited = false } = {}) {
    if (this.child === child && exited) this.child = null;
    if (this.stopping === child && exited) this.stopping = null;
    if (!exited && this.stopping !== child) { this.stopping = child; child.kill(); }
    for (const [id, item] of this.pending) {
      if (item.child !== child) continue;
      clearTimeout(item.timer);
      this.pending.delete(id);
      item.reject(error);
    }
  }

  call(action, params = {}, options = {}) {
    // Timeout begins at dispatch, not while waiting behind a long import.
    const operation = this.queue.then(() => this.dispatch(action, params, options));
    this.queue = operation.catch(() => {});
    return operation;
  }

  async dispatch(action, params, { signal, timeoutMs, canDispatch } = {}) {
    if (signal?.aborted) throw new AnkiWorkerError('cancelled', 'Operation was cancelled before dispatch.');
    if (canDispatch && !canDispatch()) throw new AnkiWorkerError('auto-deferred', 'Automatic synchronization deferred because collection activity changed.');
    const id = ++this.sequence;
    let wire;
    try { wire = JSON.stringify({ id, action, params }) + '\n'; }
    catch { throw new AnkiWorkerError('request-invalid', 'Anki request must be JSON-serializable.'); }
    if (Buffer.byteLength(wire, 'utf8') > 2 * 1024 * 1024 + 1024) throw new AnkiWorkerError('request-limit', 'Anki request exceeds its size limit.');
    this.start();
    const child = this.child;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.failGeneration(child, new AnkiWorkerError('timeout', 'Anki operation timed out; its result may already have been saved. Refresh the workspace before retrying.'));
      }, timeoutMs ?? (/^(import|export)\./.test(action) ? 180_000 : this.timeoutMs));
      timer.unref?.();
      this.pending.set(id, { resolve, reject, timer, child });
      child.stdin.write(wire, 'utf8', (error) => {
        if (error) this.failGeneration(child, new AnkiWorkerError('worker-io', error.message));
      });
    });
  }

  async close() {
    if (this.disposed) return;
    this.disposed = true;
    const child = this.child;
    if (!child) return;
    let didExit = false;
    const stopped = new AnkiWorkerError('disposed', 'Anki workspace stopped.');
    await new Promise((resolve) => {
      // EOF asks the worker to cancel sync and join before closing its DB.
      const timer = setTimeout(() => { this.failGeneration(child, stopped); resolve(); }, 30_000);
      timer.unref?.();
      child.once('exit', () => { didExit = true; clearTimeout(timer); resolve(); });
      child.stdin.end();
    });
    this.failGeneration(child, stopped, { exited: didExit });
  }
}
