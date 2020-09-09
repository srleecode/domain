import { Tree } from '@angular-devkit/schematics';

export const deleteInTree = (tree: Tree, path: string): void => {
  tree.delete(path);
};
