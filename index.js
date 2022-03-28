const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require("@octokit/rest");
const fs = require("fs");

try {
  const org = core.getInput('org')
  const octokit = new Octokit({
    auth: core.getInput('githubtoken'),
    previews: ['jean-grey', 'symmetra'],
    log: {
      debug: () => {},
      info: () => {},
      warn: console.warn,
      error: console.error
    }
  })

  async function getAlerts() {
      const codeScanResponse = await octokit.paginate('GET /orgs/{org}/code-scanning/alerts', {
          org: org
        });
      let codeScanningData = JSON.stringify(codeScanResponse, null, 2);
      fs.writeFileSync('data/code-scan.json', codeScanningData);

      const secretScanResponse = await octokit.paginate('GET /orgs/{org}/secret-scanning/alerts', {
          org: org
        });
      let secretScanningData = JSON.stringify(secretScanResponse, null, 2);
      fs.writeFileSync('data/secret-scan.json', secretScanningData);
  }

  getAlerts()
} catch {
  core.setFailed(error.message);
}
