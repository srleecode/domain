import { Tree } from '@nx/devkit';
import { getDomainPath } from './get-domain-path';

export const getDasherizedFolderPath = (
  tree: Tree,
  groupingFolderPath: string,
): string => {
  const domainPath = getDomainPath(tree, groupingFolderPath).replace(
    /\//g,
    '-',
  );
  if (domainPath.endsWith('-')) {
    return domainPath.slice(0, -1);
  }
  return domainPath;
};
