import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';

export const setProjectToLibraryType = (
  tree: Tree,
  projectName: string
): void => {
  const projectConfig = readProjectConfiguration(tree, projectName);
  projectConfig.projectType = 'library';
  updateProjectConfiguration(tree, projectName, projectConfig);
};
