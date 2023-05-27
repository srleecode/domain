import { Tree, convertNxGenerator, installPackagesTask } from '@nx/devkit';

export async function ngAddGenerator(tree: Tree) {
  return () => {
    installPackagesTask(tree);
  };
}

export default ngAddGenerator;

export const ngAddSchematic = convertNxGenerator(ngAddGenerator);
