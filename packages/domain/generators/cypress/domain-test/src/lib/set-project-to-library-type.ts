import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';

export const setProjectToLibraryType = (
  tree: Tree,
  projectName: string
): void => {
  const projectConfig = readProjectConfiguration(tree, projectName);
  projectConfig.projectType = 'library';
  updateProjectConfiguration(tree, projectName, projectConfig);
};
