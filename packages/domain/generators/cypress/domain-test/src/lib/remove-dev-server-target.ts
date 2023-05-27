import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';

export const removeDevServerTarget = (
  tree: Tree,
  projectName: string
): void => {
  const projectConfig = readProjectConfiguration(tree, projectName);
  const e2eTarget = projectConfig.targets['e2e'];
  delete e2eTarget.options.devServerTarget;
  delete e2eTarget.configurations;
  updateProjectConfiguration(tree, projectName, projectConfig);
};
