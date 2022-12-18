import { Tree } from '@nrwl/devkit';
import { getDomainPath } from './get-domain-path';
import { GroupingFolders } from './model/grouping-folders.model';

export const getGroupingFolders = (
  tree: Tree,
  groupingFolderPath: string
): GroupingFolders => {
  let groupingFolders = getDomainPath(tree, groupingFolderPath).split('/');
  groupingFolders = groupingFolders.filter(folder => folder !== 'libs');
  return {
    app: groupingFolders?.[0],
    domain: groupingFolders.slice(1),
  };
};
