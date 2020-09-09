import { Tree, SchematicsException } from '@angular-devkit/schematics';
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
    tree.overwrite(
      filePath,
      prettier.format(tree.read(filePath).toString(), options)
    );
  } catch (e) {
    throw new SchematicsException(
      `Could not format ${filePath} because ${e.message}`
    );
  }
};
