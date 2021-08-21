import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';

export const removeTestTarget = (tree: Tree, projectName: string): void => {
  const projectConfig = readProjectConfiguration(tree, projectName);
  delete projectConfig.targets['test'];
  updateProjectConfiguration(tree, projectName, projectConfig);
};
