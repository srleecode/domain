import { Tree } from '@nrwl/devkit';
import { sep } from 'path';

export const createInTree = (
  tree: Tree,
  path: string,
  content: Buffer | string
): void => tree.write(path.replace(/\//g, sep), content);

export const deleteInTree = (tree: Tree, path: string): void => {
  const updatedPath = path.replace(/\//g, sep);
  tree.delete(updatedPath);
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

export const getFolderChildren = (tree: Tree, path: string): string[] =>
  tree.isFile(path) ? [] : tree.children(path);

export const overwriteInTree = (
  tree: Tree,
  path: string,
  content: string
): void => tree.write(path.replace(/\//g, sep), content);
