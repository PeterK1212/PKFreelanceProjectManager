#!/usr/bin/env node
/*
 * Generates a comprehensive test-case table from the automated test runs.
 *
 * Sources:
 *   - Backend (Mocha):  backend/mochawesome-report/mochawesome.json
 *   - Frontend (Jest):  frontend/jest-results.json
 *
 * Outputs:
 *   - docs/TEST-CASES.md  (committed, human-readable table)
 *   - $GITHUB_STEP_SUMMARY (when run in CI, the same table appears in the run summary)
 *
 * Usage:
 *   node scripts/generate-test-report.js          # parse existing JSON only
 *   node scripts/generate-test-report.js --run    # run both suites first, then parse
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const backendDir = path.join(repoRoot, 'backend');
const frontendDir = path.join(repoRoot, 'frontend');
const backendJson = path.join(backendDir, 'mochawesome-report', 'mochawesome.json');
const frontendJson = path.join(frontendDir, 'jest-results.json');
const outFile = path.join(repoRoot, 'docs', 'TEST-CASES.md');

const pad = (n) => String(n).padStart(3, '0');

// Collapse a multi-line error/message into a single, table-safe cell.
const cell = (text) =>
  String(text || '')
    .replace(/\r?\n/g, ' ')
    .replace(/\|/g, '\\|')
    .trim();

// --- Optionally run the suites to (re)generate the JSON reports -------------
if (process.argv.includes('--run')) {
  const run = (label, cmd, cwd, env) => {
    process.stdout.write(`\n> ${label}: ${cmd}\n`);
    try {
      execSync(cmd, { cwd, env: { ...process.env, ...env }, stdio: 'inherit' });
    } catch (e) {
      // A failing suite still writes its JSON report; keep going so the table
      // captures the failures rather than aborting.
      process.stdout.write(`  (${label} reported failures)\n`);
    }
  };
  run('backend', 'npm run test:ci', backendDir);
  run('frontend', 'npm run test:ci', frontendDir, { CI: 'true' });
}

// --- Parse the Mocha (mochawesome) report ----------------------------------
function readBackend() {
  if (!fs.existsSync(backendJson)) return null;
  const data = JSON.parse(fs.readFileSync(backendJson, 'utf8'));
  const rows = [];

  const walk = (suite, trail) => {
    const name = suite.title ? [...trail, suite.title] : trail;
    (suite.tests || []).forEach((t) => {
      rows.push({
        module: name.join(' › ') || '(root)',
        expected: t.title,
        passed: t.pass === true,
        skipped: t.pending === true,
        actual: t.pass ? 'As expected' : cell(t.err && t.err.message) || 'Failed',
      });
    });
    (suite.suites || []).forEach((s) => walk(s, name));
  };

  (data.results || []).forEach((r) => walk(r, []));
  return { rows, stats: data.stats || {} };
}

// --- Parse the Jest report -------------------------------------------------
function readFrontend() {
  if (!fs.existsSync(frontendJson)) return null;
  const data = JSON.parse(fs.readFileSync(frontendJson, 'utf8'));
  const rows = [];

  // Jest runs test files in a non-deterministic order (timing/size heuristic),
  // so sort by file path to keep the report stable across runs. Within a file,
  // assertion order is the source declaration order, which is already stable.
  const files = (data.testResults || [])
    .slice()
    .sort((a, b) =>
      String(a.name).replace(/\\/g, '/').localeCompare(String(b.name).replace(/\\/g, '/'))
    );

  files.forEach((file) => {
    (file.assertionResults || []).forEach((a) => {
      rows.push({
        module: (a.ancestorTitles || []).join(' › ') || '(root)',
        expected: a.title,
        passed: a.status === 'passed',
        skipped: a.status === 'pending' || a.status === 'skipped',
        actual:
          a.status === 'passed'
            ? 'As expected'
            : cell((a.failureMessages || []).join(' ')) || a.status,
      });
    });
  });

  return {
    rows,
    stats: {
      tests: data.numTotalTests,
      passes: data.numPassedTests,
      failures: data.numFailedTests,
    },
  };
}

// --- Build a Markdown section for one suite ---------------------------------
function section(title, prefix, result) {
  if (!result) {
    return `## ${title}\n\n_No report found — run the suite to generate it._\n`;
  }
  const { rows } = result;
  const passed = rows.filter((r) => r.passed).length;
  const failed = rows.filter((r) => !r.passed && !r.skipped).length;
  const skipped = rows.filter((r) => r.skipped).length;

  const lines = [];
  lines.push(`## ${title}`);
  lines.push('');
  lines.push(`**${rows.length} test cases** — ✅ ${passed} passed, ❌ ${failed} failed, ⏭️ ${skipped} skipped`);
  lines.push('');
  lines.push('| Test Case ID | Module | Expected Output | Actual Output | Status |');
  lines.push('| --- | --- | --- | --- | --- |');
  rows.forEach((r, i) => {
    const status = r.skipped ? '⏭️ Skipped' : r.passed ? '✅ Passed' : '❌ Failed';
    lines.push(
      `| ${prefix}-${pad(i + 1)} | ${cell(r.module)} | ${cell(r.expected)} | ${r.actual} | ${status} |`
    );
  });
  lines.push('');
  return lines.join('\n');
}

const backend = readBackend();
const frontend = readFrontend();

const totalCases = (backend ? backend.rows.length : 0) + (frontend ? frontend.rows.length : 0);
const totalFailed =
  (backend ? backend.rows.filter((r) => !r.passed && !r.skipped).length : 0) +
  (frontend ? frontend.rows.filter((r) => !r.passed && !r.skipped).length : 0);

const md = [
  '# Comprehensive Test Cases',
  '',
  '> Auto-generated by `scripts/generate-test-report.js`. Do not edit by hand —',
  '> regenerate with `npm run report:tests` from the repository root.',
  '',
  `**Summary:** ${totalCases} test cases across backend and frontend — ` +
    (totalFailed === 0 ? 'all passing. ✅' : `${totalFailed} failing. ❌`),
  '',
  section('Backend (Mocha)', 'TC-BE', backend),
  section('Frontend (Jest)', 'TC-FE', frontend),
].join('\n');

// --- Write the committed Markdown file -------------------------------------
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, md, 'utf8');
process.stdout.write(`\nWrote ${path.relative(repoRoot, outFile)} (${totalCases} test cases).\n`);

// --- Append to the GitHub Actions run summary when in CI -------------------
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n');
  process.stdout.write('Appended table to GitHub Actions run summary.\n');
}
