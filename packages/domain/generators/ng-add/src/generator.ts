import {
  Tree,
  convertNxGenerator,
  addDependenciesToPackageJson,
} from '@nrwl/devkit';

export async function ngAddGenerator(tree: Tree) {
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      '@nrwl/angular': 'latest',
      '@nrwl/cypress': 'latest',
    }
  );
}

export default ngAddGenerator;

export const ngAddSchematic = convertNxGenerator(ngAddGenerator);
