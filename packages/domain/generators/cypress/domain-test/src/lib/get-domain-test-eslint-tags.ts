import { Tree } from '@nx/devkit';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  getDasherizedFolderPath,
  getDomainPath,
} from '../../../../shared/utils';

export const getTags = (
  tree: Tree,
  groupingFolder: string,
  type: 'e2e' | 'ct'
): string[] => {
  const domain = `${getDasherizedFolderPath(tree, groupingFolder)}`;
  const domainPath = getDomainPath(tree, groupingFolder);
  return [
    `app:${domainPath.split('/')?.[0]}`,
    `scope:${domain}`,
    `type:${type}`,
  ];
};
