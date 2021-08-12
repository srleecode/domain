import {
  Tree,
  convertNxGenerator,
  addDependenciesToPackageJson,
} from '@nrwl/devkit';

export async function reactAddGenerator(tree: Tree) {
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      '@nrwl/react': 'latest',
      '@nrwl/cypress': 'latest',
    }
  );
}

export default reactAddGenerator;

export const reactAddSchematic = convertNxGenerator(reactAddGenerator);
