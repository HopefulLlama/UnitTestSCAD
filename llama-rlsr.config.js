const child_process = require('child_process');
const fs = require('fs')
const path = require('path');

const LlamaRlsrKeepAChangelog = require('llama-rlsr-keep-a-changelog');
const LlamaRlsrNpm = require('llama-rlsr-npm');
const simpleGit = require('simple-git')(process.cwd());
const GitHubApi = require('github-api');
const rimraf = require('rimraf');

const gitHubCredentials = require('./credentials/github.json');

const username = 'HopefulLlama';
const repoName = 'UnitTestSCAD';

if(!gitHubCredentials) {
  throw new Error('GitHub credentials not found.');
}

module.exports = {
  preRelease: [
    LlamaRlsrNpm.updateVersion(),
    (_, done) => {
      const packageLock = path.join(__dirname, 'package-lock.json');

      rimraf.sync(path.join(__dirname, 'node_modules'));

      if(fs.existsSync(packageLock)) {
        fs.unlinkSync(packageLock);
      }

      child_process.execSync('npm i');

      done();
    },
    LlamaRlsrKeepAChangelog.updateChangelog({
      placeholder: '- Nothing yet'
    }),
    LlamaRlsrKeepAChangelog.updateDiff({
      urlGenerator: (oldVersion, newVersion) => `https://github.com/${username}/${repoName}/compare/${oldVersion}...${newVersion}`,
      latest: 'HEAD',
      tag: {
        prefix: 'v'
      }
    })
  ],
  release: [
    (versionMetadata, done) => {
      simpleGit.add(['package.json', 'package-lock.json', 'CHANGELOG.md', 'llama-rlsr.metadata.json'], () => {
        simpleGit.commit(`Update to version ${versionMetadata.newVersion}`, () => {
          simpleGit.addTag(`v${versionMetadata.newVersion}`, () => {
            simpleGit.push('origin', 'master', () => {
              simpleGit.pushTags('origin', () => done());
            });
          });
        });
      });
    },
    (versionMetadata, done) => {
      const gitHub = new GitHubApi(gitHubCredentials);
      gitHub
        .getRepo(username, repoName)
        .createRelease({"tag_name": `v${versionMetadata.newVersion}`}, () => done());
    }
  ]
};