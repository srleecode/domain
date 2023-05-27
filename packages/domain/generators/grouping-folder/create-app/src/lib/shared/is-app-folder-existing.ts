import { Tree } from '@nx/devkit';
// eslint-disable-next-line @nx/enforce-module-boundaries
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
