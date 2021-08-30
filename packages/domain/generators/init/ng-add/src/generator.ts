import {
  Tree,
  convertNxGenerator,
  addDependenciesToPackageJson,
  installPackagesTask,
} from '@nrwl/devkit';

const nrwlVersion = '2.8.0';
const jscutleryVersion = '0.5.1'

export async function ngAddGenerator(tree: Tree) {
  addDependenciesToPackageJson(
    tree,
    {},
    {
      '@nrwl/angular': nrwlVersion,
      '@nrwl/cypress': nrwlVersion,
      '@jscutlery/cypress-angular': jscutleryVersion
    }
  );
  return installPackagesTask(tree);
}

export default ngAddGenerator;

export const ngAddSchematic = convertNxGenerator(ngAddGenerator);
