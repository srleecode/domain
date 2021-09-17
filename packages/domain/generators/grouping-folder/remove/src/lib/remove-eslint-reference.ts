import { Tree } from '@nrwl/devkit';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  getDasherizedFolderPath,
  removeDepConstraint,
} from '../../../../shared/utils';

export const moveEslintReference = (
  tree: Tree,
  groupingFolder: string
): void => {
  const scope = `scope:${getDasherizedFolderPath(tree, groupingFolder)}`;
  removeDepConstraint(tree, scope);
};
