import {
  Tree,
  convertNxGenerator,
  addDependenciesToPackageJson,
} from '@nrwl/devkit';
import { cypressInitGenerator } from '@nrwl/cypress';

export async function ngAddGenerator(tree: Tree) {
  await cypressInitGenerator(tree);
  // This was raised to get access to the @nrwl/angular initGenerator https://github.com/nrwl/nx/issues/6713
  // Ideally we would just call that generator
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      '@nrwl/angular': 'latest',
    }
  );
}

export default ngAddGenerator;

export const ngAddSchematic = convertNxGenerator(ngAddGenerator);
