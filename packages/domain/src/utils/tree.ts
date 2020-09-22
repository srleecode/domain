import { Tree } from '@angular-devkit/schematics';

export const deleteInTree = (tree: Tree, path: string): void => {
  tree.delete(path);
};

export const renameInTree = (
  tree: Tree,
  fromPath: string,
  toPath: string
): void => {
  tree.rename(fromPath, toPath);
};

export const getDirInTree = (tree: Tree, path: string): any =>
  tree.getDir(path);
