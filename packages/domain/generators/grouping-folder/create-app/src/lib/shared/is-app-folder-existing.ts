import { Tree } from '@nrwl/devkit';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ApplicationType } from '../../../../../shared/utils';

export const isAppFolderExisting = (
  tree: Tree,
  applicationType: ApplicationType
): boolean => {
  return tree
    .children('libs')
    .some((appGroupingFolder) =>
      appGroupingFolder.startsWith(applicationType.toString())
    );
};
