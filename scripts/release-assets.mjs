import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import pkg from '../packages/radix-ui-themes/package.json' with { type: 'json' };

const directory = process.argv[2];
assert(directory, 'Pass the directory containing the built package tarball');
const notesUrl = new URL('../packages/radix-ui-themes/CHANGELOG.md', import.meta.url);
const changelog = (await readFile(notesUrl, 'utf8')).replaceAll('\r\n', '\n');
const notes = changelog.split(/^## /m).find((section) => section.startsWith(pkg.version + '\n'));
assert(notes, 'Add matching package version notes to the changelog');

const name = 'radix-ui-themes-' + pkg.version + '.tgz';
const archive = await readFile(join(directory, name));
const sha256 = createHash('sha256').update(archive).digest('hex');
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const metadata = {
  schemaVersion: 1,
  package: pkg.name,
  version: pkg.version,
  channel: 'stable',
  tag: process.env.GITHUB_REF_NAME ?? null,
  commit,
  peerDependencies: pkg.peerDependencies,
  assets: [{ name, bytes: archive.length, sha256 }],
};

await Promise.all([
  writeFile(join(directory, 'SHA256SUMS'), sha256 + '  ' + name + '\n'),
  writeFile(join(directory, 'release.json'), JSON.stringify(metadata, null, 2) + '\n'),
  writeFile(
    join(directory, 'notes.md'),
    '## Summary\n\n' + notes.split('\n').slice(1).join('\n').trim() + '\n',
  ),
]);
