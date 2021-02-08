import { Tree, readJson } from '@nrwl/devkit';

export const getTsConfigPath = (tree: Tree): string => {
  return tree
    .children('/')
    .find((file) => file.startsWith('tsconfig'))
    .toString();
};

export const getTsConfig = (tree: Tree) =>
  readJson(tree, getTsConfigPath(tree));
