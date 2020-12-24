import { Tree } from '@angular-devkit/schematics';
import { readWorkspace } from '@nrwl/workspace';
import { sep } from 'path';

export const createInTree = (
  tree: Tree,
  path: string,
  content: Buffer | string
): void => tree.create(path.replace(/\//g, sep), content);

export const deleteInTree = (tree: Tree, path: string): void => {
  const updatedPath = path.replace(/\//g, sep);
  if (existsInTree(tree, updatedPath)) {
    tree.delete(updatedPath);
  }
};

export const readInTree = (tree: Tree, path: string): Buffer =>
  tree.read(path.replace(/\//g, sep));

export const existsInTree = (tree: Tree, path: string): boolean =>
  tree.exists(path.replace(/\//g, sep));

export const renameInTree = (
  tree: Tree,
  fromPath: string,
  toPath: string
): void => {
  tree.rename(fromPath.replace(/\//g, sep), toPath.replace(/\//g, sep));
};

export const getDirInTree = (tree: Tree, path: string): any =>
  tree.getDir(path.replace(/\//g, sep));

export const overwriteInTree = (
  tree: Tree,
  path: string,
  content: string
): void => tree.overwrite(path.replace(/\//g, sep), content);

export const readWorkspaceInTree = (tree: Tree) => readWorkspace(tree);
