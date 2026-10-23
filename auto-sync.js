const MUTATIONS = new Set(['decks.create', 'decks.rename', 'decks.delete', 'notes.add', 'notes.update', 'cards.suspend', 'review.answer', 'review.undo', 'import.apkg']);

/** Host-owned scheduling. Never confirms a full-sync direction or handles credentials. */
export class AnkiAutoSync {
  constructor({ call, now = Date.now, periodMs = 300_000, idleMs = 15_000, pollMs = 10_000 }) {
    this.call = call;
    this.now = now;
    this.periodMs = periodMs;
    this.idleMs = idleMs;
    this.pollMs = pollMs;
    this.dueAt = 0;
    this.lastActivity = 0;
    this.reviewHeld = false;
    this.checking = false;
    this.epoch = 0;
    this.accountBusy = 0;
    this.operationBusy = 0;
    this.closed = false;
    this.timer = null;
  }

  start() {
    if (this.closed || this.timer) return;
    this.timer = setInterval(() => { void this.tick(); }, this.pollMs);
    this.timer.unref?.();
  }

  close() { this.closed = true; clearInterval(this.timer); this.timer = null; }

  beginOperation(action) {
    if (action !== 'review.next' && action !== 'decks.delete.preview' && !MUTATIONS.has(action) && action !== 'sync.run' && action !== 'sync.cancel') return () => {};
    this.operationBusy++; this.epoch++;
    return () => { this.operationBusy--; };
  }

  beginAccount() { this.accountBusy++; this.epoch++; }
  endAccount() { this.accountBusy--; }

  accountChanged(action) {
    this.epoch++;
    if (action === 'releaseReview') {
      this.reviewHeld = false;
      this.lastActivity = this.now();
      this.dueAt = Math.min(this.dueAt || Infinity, this.now() + this.idleMs);
    } else if (action === 'login' || action === 'settings') {
      this.dueAt = this.now() + 1000;
    } else {
      this.dueAt = this.now() + this.periodMs;
      if (action === 'confirmFull' || action === 'logout') this.reviewHeld = false;
    }
  }

  completed(action, result) {
    if (action === 'review.next' || MUTATIONS.has(action) || action === 'sync.run' || action === 'sync.cancel') this.epoch++;
    if (action === 'review.next') {
      this.reviewHeld = Boolean(result?.token);
      this.lastActivity = this.now();
    } else if (MUTATIONS.has(action)) {
      this.reviewHeld = false;
      this.lastActivity = this.now();
      this.dueAt = this.now() + this.idleMs;
    } else if (action === 'sync.run' || action === 'sync.cancel') {
      // An idle cancel does not discard the backend's outstanding review token.
      if (action === 'sync.run') this.reviewHeld = false;
      this.dueAt = this.now() + this.periodMs;
    }
  }

  async tick() {
    if (this.closed || this.checking || this.accountBusy || this.operationBusy || this.reviewHeld || this.now() < this.dueAt) return;
    this.checking = true;
    const epoch = this.epoch;
    try {
      const status = await this.call('sync.status', {});
      if (this.closed || this.reviewHeld || this.accountBusy || this.operationBusy || epoch !== this.epoch) return;
      const now = this.now();
      if (status.active) { this.dueAt = now + this.pollMs; return; }
      if (!status.loggedIn || !status.settings?.autoSync || status.pendingFull) {
        this.dueAt = now + 30_000;
        return;
      }
      if (now - this.lastActivity < this.idleMs) {
        this.dueAt = this.lastActivity + this.idleMs;
        return;
      }
      // Set the backoff BEFORE dispatch, including native BUSY/network errors.
      this.dueAt = now + this.periodMs;
      await this.call('sync.run', {}, {
        // Recheck at the serial worker queue HEAD, not merely before enqueue.
        canDispatch: () => !this.closed && !this.reviewHeld && !this.accountBusy && !this.operationBusy
          && epoch === this.epoch && this.now() - this.lastActivity >= this.idleMs,
      });
    } catch (error) {
      // A dispatch-time activity deferral preserves the newer idle/login dueAt.
      // No request, native exception, auth detail or secret enters a log.
      if (error?.code !== 'auto-deferred') this.dueAt = this.now() + this.periodMs;
    } finally { this.checking = false; }
  }
}
