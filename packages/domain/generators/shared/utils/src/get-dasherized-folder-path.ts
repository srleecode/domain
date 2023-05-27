import { Tree } from '@nx/devkit';
import { getDomainPath } from './get-domain-path';

export const getDasherizedFolderPath = (
  tree: Tree,
  groupingFolderPath: string
): string => getDomainPath(tree, groupingFolderPath).replace(/\//g, '-');
