import {
  Tree,
  addProjectConfiguration as devkitAddProjectConfiguration,
  removeProjectConfiguration as devkitRemoveProjectConfiguration,
  readProjectConfiguration as devkitReadProjectConfiguration,
  updateProjectConfiguration as devkitUpdateProjectConfiguration,
  ProjectConfiguration,
  NxJsonProjectConfiguration,
  WorkspaceJsonConfiguration,
  readJson,
} from '@nrwl/devkit';
import { getWorkspacePath } from './workspace';

export const addProjectConfiguration = (
  tree: Tree,
  projectName: string,
  projectConfiguration: ProjectConfiguration & NxJsonProjectConfiguration
): void => {
  devkitAddProjectConfiguration(tree, projectName, projectConfiguration);
  // for some reason the workspace json doesn't seem to updated with devkitAddProjectConfiguration
  const workspaceJson = readJson<WorkspaceJsonConfiguration>(
    tree,
    getWorkspacePath(tree)
  );
  if (!workspaceJson.projects[projectName]) {
    workspaceJson.projects[projectName] = projectConfiguration;
    tree.write(getWorkspacePath(tree), JSON.stringify(workspaceJson));
  }
};

export const updateProjectConfiguration = (
  tree: Tree,
  projectName: string,
  projectConfiguration: ProjectConfiguration & NxJsonProjectConfiguration
): void => {
  devkitUpdateProjectConfiguration(tree, projectName, projectConfiguration);
};

export const removeProjectConfiguration = (
  tree: Tree,
  projectName: string
): void => {
  devkitRemoveProjectConfiguration(tree, projectName);
};

export const readProjectConfiguration = (
  tree: Tree,
  projectName: string
): ProjectConfiguration & NxJsonProjectConfiguration =>
  devkitReadProjectConfiguration(tree, projectName);
