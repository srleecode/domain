import { Tree } from '@nrwl/devkit';
import { dasherize } from '@nrwl/workspace/src/utils/strings';

export const setIndexToComponentFile = (
  tree: Tree,
  groupingFolder: string,
  libraryName: string,
  name: string
): void => {
  tree.write(
    `${groupingFolder}/${libraryName}/src/index.ts`,
    `export * from './lib/${dasherize(name)}.component.ts';`
  );
};
