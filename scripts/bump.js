#!/usr/bin/env node
/* eslint-disable no-console */

// import * as fs from 'fs';
// const path = require('path');
const standardVersion = require('standard-version');
const ver = require('./resolve-version');
// const { execSync } = require('child_process');
// const { version } = require('os');

async function main() {
  const releaseAs = process.argv[2] || 'minor';
  if (
    releaseAs !== 'major' &&
    releaseAs !== 'minor' &&
    releaseAs !== 'patch' &&
    releaseAs !== 'prerelease'
  ) {
    throw new Error(
      `invalid bump type "${releaseAs}". Only "minor" (the default), "major", "patch" and "prerelease" are allowed.`
    );
  }

  console.error(`Starting ${releaseAs} version bump`);
  console.error(
    'Current version information:',
    JSON.stringify(ver, undefined, 2)
  );

  // const repoRoot = path.join(__dirname, '..');

  const opts = {
    releaseAs,
    skip: { tag: true },
    packageFiles: [{ filename: ver.versionFile, type: 'json' }],
    bumpFiles: [{ filename: ver.versionFile, type: 'json' }],
    infile: ver.changelogFile,
    prerelease: ver.prerelease,
  };

  await standardVersion(opts);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  process.exit(1);
});
