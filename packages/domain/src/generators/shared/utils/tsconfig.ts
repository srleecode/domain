import { Tree, readJson } from '@nrwl/devkit';

export const getTsConfigPath = (tree: Tree): string => {
  return tree
    .children('/')
    .find((file) => file.startsWith('tsconfig'))
    .toString();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTsConfig = (tree: Tree): any =>
  readJson(tree, getTsConfigPath(tree));
