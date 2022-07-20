const fs = require('fs');
const { execSync } = require('child_process');
const rimraf = require('rimraf');

const getNormalisedPath = (path) =>
  path.replace(/\\/g, '/').replace(/\/\//g, '/');

const e2eProjects = [
  'e2e-domain-cypress-domain-test',
  'e2e-domain-front-end-angular',
  'e2e-domain-grouping-folder',
  'e2e-domain-mock-file',
];

const cleanUp = () =>
  new Promise((resolve, reject) =>
    rimraf(getNormalisedPath(`${process.cwd()}/tmp/nx-e2e/proj/*`), (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    })
  );

(async function main() {
  for (const project of e2eProjects) {
    console.log('Cleaning temp project');
    await cleanUp();
    execSync(`npx nx e2e ${project}`, {
      stdio: 'inherit',
    });
  }
  console.log('Cleaning temp project');
  await cleanUp();
})();
