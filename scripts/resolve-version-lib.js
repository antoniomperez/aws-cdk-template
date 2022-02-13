#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

function resolveVersion(rootdir) {
  const ALLOWED_RELEASE_TYPES = ['stable', 'rc', 'beta', 'alpha'];

  const releaseFile = path.join(rootdir, 'release.json');

  const releaseConfig = require(releaseFile);
  const { releaseType } = releaseConfig;

  if (!releaseType) {
    throw new Error(`"releaseType" must be defined in ${releaseFile}`);
  }
  if (!ALLOWED_RELEASE_TYPES.includes(releaseType)) {
    throw new Error(
      `releaseType=${releaseType} is not allowed. Allowed values: ${ALLOWED_RELEASE_TYPES.join(
        ','
      )}`
    );
  }

  //
  // resolve and check that we have a version file
  //

  const versionFile = 'package.json';
  const versionFilePath = path.join(rootdir, versionFile);
  if (!fs.existsSync(versionFilePath)) {
    throw new Error(`unable to find version file ${versionFile}`);
  }

  //
  // validate that current version matches the requirements
  //
  const versions = require(versionFilePath);
  const currentVersion = versions.version;

  // if this is a pre-release, make sure current version includes the
  // pre-release tag (e.g. "1.0.0-alpha.0"). we allow stable branches to bump to
  // a pre-release for testing purposes when BUMP_CANDIDATE=true (see bump.js)
  /*  if (releaseType !== 'stable') {
    if (!currentVersion.includes(`-${releaseType}`)) {
      throw new Error(
        `could not find pre-release tag "${releaseType}" in current version "${currentVersion}"`
      );
    }
  } */

  return {
    version: currentVersion,
    versionFile,
    changelogFile: 'CHANGELOG.md',
    prerelease: releaseType !== 'stable' ? releaseType : undefined,
  };
}

module.exports = resolveVersion;
