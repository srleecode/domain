import { Tree } from '@nrwl/devkit';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { ComponentType } from '../model/component-type.enum';

export const setIndexToComponentFile = (
  tree: Tree,
  groupingFolder: string,
  libraryName: string,
  name: string,
  type: ComponentType
): void => {
  tree.write(
    `${groupingFolder}/${libraryName}/src/index.ts`,
    `export * from './lib/${dasherize(name) || type}.component';`
  );
};
