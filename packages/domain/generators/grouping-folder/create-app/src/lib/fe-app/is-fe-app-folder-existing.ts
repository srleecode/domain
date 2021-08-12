import { Tree } from '@nrwl/devkit';
import { FrontendFramework } from '../model/framework.enum';

export const isFeAppFolderExisting = (
  framework: FrontendFramework,
  tree: Tree
): boolean => {
  return tree
    .children('libs')
    .some((appGroupingFolder) => appGroupingFolder.startsWith(framework));
};
