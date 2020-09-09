import { Tree } from '@angular-devkit/schematics';
import { readJsonInTree } from '@nrwl/workspace';

export const getTsConfigPath = (tree: Tree): string =>
  tree.root.subfiles.find((file) => file.startsWith('tsconfig')).toString();

export const getTsConfig = (tree: Tree) =>
  readJsonInTree(tree, getTsConfigPath(tree));
