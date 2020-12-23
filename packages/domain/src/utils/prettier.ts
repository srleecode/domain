import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { overwriteInTree, readInTree } from './tree';
let prettier;
try {
  prettier = require('prettier');
} catch (e) {}

export const formatFile = (tree: Tree, filePath: string) => {
  let options: any = {
    filepath: filePath,
  };
  const resolvedOptions = prettier.resolveConfig.sync('/.prettierrc');
  if (resolvedOptions) {
    options = {
      ...options,
      ...resolvedOptions,
    };
  }
  try {
    overwriteInTree(
      tree,
      filePath,
      prettier.format(readInTree(tree, filePath).toString(), options)
    );
  } catch (e) {
    throw new SchematicsException(
      `Could not format ${filePath} because ${e.message}`
    );
  }
};
