import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  getDasherizedFolderPath,
  getDomainPath,
} from '../../../../shared/utils';

export const addDomainTestEslintTags = (
  tree: Tree,
  projectName: string,
  groupingFolder: string,
  type: 'e2e' | 'ct'
): void => {
  const projectConfig = readProjectConfiguration(tree, projectName);
  const domain = `${getDasherizedFolderPath(tree, groupingFolder)}`;
  const domainPath = getDomainPath(tree, groupingFolder);
  projectConfig.tags = [
    `app:${domainPath.split('/')?.[0]}`,
    `scope:${domain}`,
    `type:${type}`,
  ];
  updateProjectConfiguration(tree, projectName, projectConfig);
};
