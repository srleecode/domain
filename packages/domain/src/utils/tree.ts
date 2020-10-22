import { Tree } from '@angular-devkit/schematics';
import { readWorkspace } from '@nrwl/workspace';

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

export const overwriteInTree = (
  tree: Tree,
  path: string,
  content: string
): void => tree.overwrite(path, content);

export const readWorkspaceInTree = (tree: Tree) => readWorkspace(tree);
