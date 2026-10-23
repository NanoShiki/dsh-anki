"""Read-only 1.2.1 -> 1.2.2 layout-only archive comparison; never extracts."""
import json
from pathlib import Path, PurePosixPath
import re
import sys
import tarfile


def read_archive(filename):
    files = {}
    with tarfile.open(Path(filename).resolve(strict=True), 'r:gz') as archive:
        for member in archive.getmembers():
            path = PurePosixPath(member.name)
            assert member.isfile() and path.parts[0] == 'package' and '..' not in path.parts
            assert not path.is_absolute() and member.name not in files
            assert member.size < 32 * 1024 * 1024
            files[member.name] = archive.extractfile(member).read()
    assert sum(map(len, files.values())) < 64 * 1024 * 1024
    return files


def text(value):
    return value.decode('utf-8').replace('\r\n', '\n')


old, new = map(read_archive, sys.argv[1:3])
assert old.keys() == new.keys(), 'packaged file set changed'
changed = {name for name in old if old[name] != new[name]}
# Runtime, worker, sync, transport, locales, patch and licenses must be exact.
allowed = {'package/' + name for name in (
    'client.js', 'package.json', 'README.md', 'VERIFICATION.md', 'ACCEPTANCE.md')}
assert changed == allowed, changed
old_manifest, new_manifest = [json.loads(files['package/package.json']) for files in (old, new)]
assert old_manifest.pop('version') == '1.2.1'
assert new_manifest.pop('version') == '1.2.2'
assert old_manifest == new_manifest
before, after = [text(files['package/client.js']) for files in (old, new)]
css = re.compile(r'const CSS = `[\s\S]*?`;')
assert len(css.findall(before)) == len(css.findall(after)) == 1
before, after = css.sub('const CSS = `<layout>`;', before), css.sub('const CSS = `<layout>`;', after)
replacements = [
    ("const browse = h('section', null,", "const browse = h('section', { className: 'dsh-anki-browse' },"),
    ("h('div', { className: 'dsh-anki-browser' }, h('div', { 'aria-busy': notesLoading },",
     "h('div', { className: 'dsh-anki-browser' }, h('div', { className: 'dsh-anki-results', 'aria-busy': notesLoading },"),
    ("h('header', { className: 'dsh-anki-head' }, h('div', null, h('div', { className: 'dsh-anki-kicker' }, t('localOnly'))",
     "h('div', { className: 'dsh-anki-overview' }, h('header', { className: 'dsh-anki-head' }, h('div', null, h('div', { className: 'dsh-anki-kicker' }, t('localOnly'))"),
    ("stat(t('due'), selectedDeck.reviewCount)] : [])),", "stat(t('due'), selectedDeck.reviewCount)] : []))),"),
    ("h('div', { id: prefix + '-panel', role: 'tabpanel', 'aria-labelledby': prefix + '-tab-' + tab },",
     "h('div', { className: 'dsh-anki-panel' + (tab === 'browse' && status && !initializing ? ' dsh-anki-panel-browse' : ''), id: prefix + '-panel', role: 'tabpanel', 'aria-labelledby': prefix + '-tab-' + tab },"),
]
for previous, replacement in replacements:
    assert before.count(previous) == 1, previous
    before = before.replace(previous, replacement)
assert before == after, 'client behavior changed outside CSS and the five layout wrappers/classes'
for name in ('README.md', 'VERIFICATION.md', 'ACCEPTANCE.md'):
    assert not re.search(rb'\d+\s+notes/cards|Current DSH profile:|user screenshot|production AI|desktop DSH profile|user installed', new['package/' + name]), name
print(json.dumps({'passed': True, 'changed': sorted(changed), 'unchangedFiles': len(new) - len(changed),
                  'scope': 'CSS and layout-only client wrappers, release version/docs; native code/data identities unchanged'}))
