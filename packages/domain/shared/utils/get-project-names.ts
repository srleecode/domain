import { getProjects, Tree } from '@nrwl/devkit';
import { getNormalisedPath } from './get-normalised-path';

export const getProjectNames = (tree: Tree, folder: string): string[] => {
  const projects = getProjects(tree);
  const projectNames = [...projects.keys()];
  return projectNames.filter((projectName) => {
    const project = projects.get(projectName);
    const normalisedFolderPath = getNormalisedPath(folder);
    const normalisedProjectRoot = getNormalisedPath(project.root);
    return normalisedProjectRoot.startsWith(normalisedFolderPath);
  });
};
