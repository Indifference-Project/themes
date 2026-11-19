#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const outputIndex = args.indexOf('--output');
const output = outputIndex >= 0 ? args[outputIndex + 1] : null;

function git(...command) {
  return execFileSync('git', command, { encoding: 'utf8' }).trim();
}

function safeGit(...command) {
  try {
    return git(...command);
  } catch {
    return '';
  }
}

function isAncestor(ancestor, descendant) {
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', ancestor, descendant]);
    return true;
  } catch {
    return false;
  }
}

function hasConflict(base, branch) {
  try {
    execFileSync('git', ['merge-tree', '--write-tree', base, branch], { stdio: 'ignore' });
    return false;
  } catch {
    return true;
  }
}

function parseArgs(value) {
  const [behind = '0', ahead = '0'] = value.split(/\s+/);
  return { ahead: Number(ahead), behind: Number(behind) };
}

function formatDate(value) {
  return value ? value.replace('T', ' ').replace(/([+-]\d\d:\d\d|Z)$/, '') : 'unknown';
}

const baseBranch =
  process.env.GOVERNANCE_BASE_REF ||
  safeGit('symbolic-ref', '--short', 'refs/remotes/origin/HEAD').replace(/^origin\//, '') ||
  'main';
const baseRef = `origin/${baseBranch}`;
const repository = process.env.GITHUB_REPOSITORY || '';
const token = process.env.GITHUB_TOKEN;

let openPullRequests = [];
if (repository && token) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${repository}/pulls?state=open&per_page=100`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
    if (response.ok) openPullRequests = await response.json();
  } catch {
    // The local audit remains useful without GitHub API access.
  }
}

const openPrByBranch = new Map(
  openPullRequests.map((pullRequest) => [pullRequest.head?.ref, pullRequest.number]),
);
const refs = safeGit('for-each-ref', '--format=%(refname:short)', 'refs/remotes/origin')
  .split(/\r?\n/)
  .filter((ref) => ref && ref !== 'origin' && ref !== 'origin/HEAD' && ref !== baseRef);

const branches = refs.map((ref) => {
  const name = ref.replace(/^origin\//, '');
  const latest = safeGit('show', '-s', '--format=%H%x09%ad%x09%an%x09%s', '--date=iso-strict', ref);
  const [sha = '', date = '', author = '', subject = ''] = latest.split('\t');
  const counts = parseArgs(safeGit('rev-list', '--left-right', '--count', `${baseRef}...${ref}`));
  const includedInBase = isAncestor(ref, baseRef);
  const conflict = !includedInBase && hasConflict(baseRef, ref);
  const changedFiles = safeGit('diff', '--name-status', `${baseRef}...${ref}`)
    .split(/\r?\n/)
    .filter(Boolean);
  const pullRequest = openPrByBranch.get(name) ?? null;

  let category = 'C';
  let reason = 'Active or unverified branch; preserve until an owner confirms its disposition.';
  if (includedInBase && !pullRequest) {
    category = 'D';
    reason = 'Fully contained in the base branch and has no open pull request.';
  } else if (conflict) {
    category = 'C';
    reason = 'Merge conflict detected; do not automate merge or deletion.';
  } else if (name.startsWith('dependabot/')) {
    category = 'B';
    reason =
      'Dependency-only update; keep the pull request open until required CI and review complete.';
  } else if (pullRequest) {
    category = 'C';
    reason = `Open pull request #${pullRequest}; wait for human review and required checks.`;
  }

  return {
    name,
    ref,
    sha: sha.slice(0, 12),
    date: formatDate(date),
    author,
    subject,
    ahead: counts.ahead,
    behind: counts.behind,
    includedInBase,
    conflict,
    pullRequest,
    changedFiles,
    category,
    reason,
  };
});

const counts = branches.reduce(
  (result, branch) => {
    result[branch.category] += 1;
    return result;
  },
  { A: 0, B: 0, C: 0, D: 0 },
);

const lines = [
  '# Branch governance report',
  '',
  `- Generated: ${new Date().toISOString()}`,
  `- Base branch: \`${baseBranch}\``,
  `- Scanned remote branches: ${branches.length}`,
  `- Categories: A=${counts.A}, B=${counts.B}, C=${counts.C}, D=${counts.D}`,
  '',
  '> This report is advisory. It never merges, force-pushes, or deletes branches automatically.',
  '',
  '| Branch | Last commit | Ahead/behind | PR | Conflict | Category | Reason |',
  '| --- | --- | ---: | --- | --- | --- | --- |',
];

for (const branch of branches) {
  const pr = branch.pullRequest
    ? `[#${branch.pullRequest}](https://github.com/${repository}/pull/${branch.pullRequest})`
    : '—';
  lines.push(
    `| \`${branch.name}\` | ${branch.date} (${branch.sha}) | +${branch.ahead}/-${branch.behind} | ${pr} | ${branch.conflict ? 'yes' : 'no'} | **${branch.category}** | ${branch.reason} |`,
  );
}

lines.push('', '## Changed files by branch', '');
for (const branch of branches) {
  lines.push(`### \`${branch.name}\``);
  if (branch.changedFiles.length === 0) {
    lines.push('- No file differences from the base branch.', '');
  } else {
    lines.push(...branch.changedFiles.map((file) => `- \`${file}\``), '');
  }
}

const report = lines.join('\n') + '\n';
if (output) writeFileSync(output, report, 'utf8');
process.stdout.write(report);
