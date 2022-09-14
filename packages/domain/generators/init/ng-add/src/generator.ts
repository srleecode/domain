import { Tree, convertNxGenerator, installPackagesTask } from '@nrwl/devkit';

export async function ngAddGenerator(tree: Tree) {
  return () => {
    installPackagesTask(tree);
  };
}

export default ngAddGenerator;

export const ngAddSchematic = convertNxGenerator(ngAddGenerator);
