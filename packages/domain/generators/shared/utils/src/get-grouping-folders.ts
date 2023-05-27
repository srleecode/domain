import { Tree } from '@nx/devkit';
import { getDomainPath } from './get-domain-path';
import { GroupingFolders } from './model/grouping-folders.model';

export const getGroupingFolders = (
  tree: Tree,
  groupingFolderPath: string
): GroupingFolders => {
  const groupingFolders = getDomainPath(tree, groupingFolderPath).split('/');
  return {
    app: groupingFolders?.[0],
    domain: groupingFolders.slice(1),
  };
};
