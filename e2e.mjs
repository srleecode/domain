import { execSync } from 'child_process';
import { rimrafSync } from 'rimraf';

const getNormalisedPath = (path) =>
  path.replace(/\\/g, '/').replace(/\/\//g, '/');

const e2eProjects = [
  'e2e-domain-cypress-domain-test',
  'e2e-domain-front-end-angular',
  'e2e-domain-grouping-folder',
  'e2e-domain-mock-file',
];

const cleanUp = () =>
  rimrafSync(getNormalisedPath(`${process.cwd()}/tmp/nx-e2e/proj`));

for (const project of e2eProjects) {
  console.log('Cleaning temp project');
  cleanUp();
  execSync(`npx nx e2e ${project} --skip-nx-cache`, {
    stdio: 'inherit',
  });
}
console.log('Cleaning temp project');
cleanUp();
