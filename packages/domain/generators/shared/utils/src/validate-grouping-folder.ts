import { SchematicsException } from '@angular-devkit/schematics';
import { Tree } from '@nx/devkit';

export const validateGroupingFolder = (tree: Tree, groupingFolder: string) => {
  if (!tree.exists(groupingFolder)) {
    throw new SchematicsException(
      `The grouping folder directory does not exist "${groupingFolder}"`,
    );
  }
};
