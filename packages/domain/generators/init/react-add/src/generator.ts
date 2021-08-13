import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { reactInitGenerator } from '@nrwl/react';

export async function reactAddGenerator(tree: Tree) {
  return reactInitGenerator(tree, {
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  });
}

export default reactAddGenerator;

export const reactAddSchematic = convertNxGenerator(reactAddGenerator);
