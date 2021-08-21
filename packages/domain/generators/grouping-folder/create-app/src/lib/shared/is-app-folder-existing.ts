import { Tree } from '@nrwl/devkit';
import { ApplicationType } from '@srleecode/domain/shared/utils';

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
