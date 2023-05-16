import {
  Tree,
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nrwl/devkit';

export const convertE2ETargetToCt = (tree: Tree, projectName: string) => {
  const projectConfig = readProjectConfiguration(tree, projectName);
  projectConfig.targets['ct'] = projectConfig.targets['e2e'];
  delete projectConfig.targets['ct'].options.baseUrl;
  delete projectConfig.targets['e2e'];
  updateProjectConfiguration(tree, projectName, projectConfig);
};
