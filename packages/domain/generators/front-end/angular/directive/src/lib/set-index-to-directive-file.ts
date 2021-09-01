import { Tree } from '@nrwl/devkit';
import { dasherize } from '@nrwl/workspace/src/utils/strings';

export const setIndexToDirectiveFile = (
  tree: Tree,
  groupingFolder: string,
  name: string
): void => {
  const dasherisedName = dasherize(name);
  tree.write(
    `${groupingFolder}/directive-${dasherisedName}/src/index.ts`,
    `export * from './lib/${dasherisedName}.directive';`
  );
};
