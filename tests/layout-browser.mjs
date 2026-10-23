// Isolated real-Chromium regression: node tests/layout-browser.mjs
// No servers, production profile, collection, network, or external libraries.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

const here = path.dirname(fileURLToPath(import.meta.url));
const scope = path.join(here, 'layout-fixture');
fs.mkdirSync(scope, { recursive: true });
const source = fs.readFileSync(path.join(here, '..', 'client.js'), 'utf8');
const extracted = source.match(/const CSS = `([\s\S]*?)`;/)?.[1];
assert.ok(extracted, 'client.js CSS template found');
// Reconstruct the pre-fix list/row rules while retaining all other real CSS.
const oldCSS = extracted
  .replace(/\.dsh-anki-list\s*>\s*button\s*\{[^}]*\}/g, '')
  .replace(/\.dsh-anki \.dsh-anki-note\{[^}]*\}/, '.dsh-anki .dsh-anki-note{display:block;text-align:left;border-color:transparent;width:100%;padding:11px 10px}');
assert.match(extracted, /\.dsh-anki \.dsh-anki-note\{[^}]*flex:0 0 auto/, 'nonshrinking rows must be present in actual source');
const newCSS = extracted;
const width = Number(process.env.LAYOUT_WIDTH || 470);
const zoom = Number(process.env.LAYOUT_ZOOM || 1);
assert.ok(width >= 180 && width <= 600 && zoom >= 1 && zoom <= 2);
const rows = Array.from({ length: 50 }, (_, i) => `<button class="dsh-anki-note" aria-pressed="${i === 0}"><span class="dsh-anki-preview">${i + 1}. 【布局测试】中文与 English synthetic note preview with long wrapping text and an unmistakable second line for browser measurement.</span><span class="dsh-anki-note-meta"><span>${i % 3 ? '问答题' : 'UnbrokenModelName'.repeat(10)}</span><span>\u00b7 ${i % 3 ? '面试' : 'UnbrokenDeckName'.repeat(10)}</span><span>\u00b7 Suspended</span></span></button>`).join('');
const panes = ['old', 'new'].map(kind => `<section><h1>${kind === 'old' ? 'OLD: shrinking rows' : 'NEW: nonshrinking rows'}</h1><div class="dsh-anki ${kind}"><div class="dsh-anki-list">${rows}</div></div></section>`).join('');
// Prefix every selector, including those within container queries, via separate shadow roots.
const doc = `<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:"><title>Isolated Anki list layout regression</title><style>body{margin:16px;background:#fff;color:#222;font-family:Arial,sans-serif;display:flex;gap:24px}section{width:${width}px;flex:none}#results{position:absolute;top:760px;left:16px;max-width:1000px;white-space:pre-wrap;font-size:10px}h1{font-size:16px} .dsh-anki{--dsw-alias-label-primary:#222;--dsw-alias-label-secondary:#555;--dsw-alias-label-tertiary:#666;padding:0;height:auto;zoom:${zoom}} </style>${panes}<pre id="results"></pre><script>
const css = ${JSON.stringify({ old: oldCSS, new: newCSS })};
for (const kind of ['old','new']) {
 const host = document.querySelector('.dsh-anki.' + kind);
 const contents = host.innerHTML;
 const root = host.attachShadow({mode:'open'});
 root.innerHTML = '<style>' + css[kind] + ':host{display:block}.dsh-anki{padding:0;height:auto;container-type:normal}' + '</style><div class="dsh-anki">' + contents + '</div>';
}
const output={userAgent:navigator.userAgent};
for(const kind of ['old','new']){
 const list=document.querySelector('.'+kind).shadowRoot.querySelector('.dsh-anki-list');
 const buttons=[...list.children];
 const overlaps=[]; const overflow=[]; const horizontal=[];
 for(let i=0;i<buttons.length;i++){
  const b=buttons[i], box=b.getBoundingClientRect(), meta=b.querySelector('.dsh-anki-note-meta').getBoundingClientRect();
  if(meta.bottom>box.bottom+0.5) overflow.push(i);
  if([...b.querySelectorAll('span')].some(s=>s.getBoundingClientRect().right>box.right+0.5)) horizontal.push(i);
  if(i+1<buttons.length && meta.bottom>buttons[i+1].getBoundingClientRect().top+0.5) overlaps.push(i);
 }
 const first=buttons[0];
 output[kind]={count:buttons.length,clientHeight:list.clientHeight,scrollHeight:list.scrollHeight,rowHeight:first.getBoundingClientRect().height,flexShrink:getComputedStyle(first).flexShrink,overlapCount:overlaps.length,overflowCount:overflow.length,horizontalOverflowCount:horizontal.length};
 list.scrollTop=list.scrollHeight;
 output[kind].lastRowReachable=buttons.at(-1).getBoundingClientRect().bottom<=list.getBoundingClientRect().bottom+1;
 list.scrollTop=0;
}
document.getElementById('results').textContent=JSON.stringify(output);
</script>`;
const html = path.join(scope, 'comparison.html');
fs.writeFileSync(html, doc);
const browser = process.env.LAYOUT_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
assert.ok(fs.existsSync(browser), 'existing Chromium executable found');
const profile = fs.mkdtempSync(path.join(scope, 'isolated-profile-'));
const args = ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-extensions', '--disable-features=msEdgeSidebarV2', '--user-data-dir=' + profile, '--window-size=1100,900', '--screenshot=' + path.join(scope, 'comparison.png'), '--dump-dom', pathToFileURL(html).href];
const run = spawnSync(browser, args, { encoding: 'utf8', timeout: 45000, maxBuffer: 4 * 1024 * 1024, windowsHide: true });
fs.writeFileSync(path.join(scope, 'browser-stderr.txt'), run.stderr || '');
// Delete only the unique test profile this invocation created, never a host profile.
assert.equal(path.dirname(profile), scope);
assert.ok(path.basename(profile).startsWith('isolated-profile-'));
try { fs.rmSync(profile, { recursive: true, force: true }); } catch (error) { console.warn('Test profile retained:', profile, error.message); }
assert.ifError(run.error);
assert.equal(run.status, 0, 'headless Chromium exit');
const match = run.stdout.match(/<pre id="results">([^<]+)<\/pre>/);
assert.ok(match, 'browser produced measured DOM results');
const results = JSON.parse(match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
const report = { browser, browserVersion: results.userAgent, width, zoom, cssMode: 'final CSS extracted from client.js (no appended fixes)', results };
fs.writeFileSync(path.join(scope, 'results.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
assert.equal(results.old.count, 50);
assert.ok(results.old.overlapCount > 0, 'old CSS reproduces actual text overlap');
assert.equal(results.new.overlapCount, 0, 'new CSS has no text overlap');
assert.equal(results.new.overflowCount, 0, 'new CSS contains row text');
assert.equal(results.new.horizontalOverflowCount, 0, 'long metadata cannot overflow horizontally');
assert.equal(results.new.flexShrink, '0', 'new rows cannot shrink');
assert.ok(results.new.scrollHeight > results.new.clientHeight, 'new list scrolls');
assert.ok(results.new.lastRowReachable, '50th result reachable');
console.log('PASS: real Chromium old/new list regression, 50 synthetic results.');
