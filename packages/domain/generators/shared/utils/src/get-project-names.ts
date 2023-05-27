import { getProjects, Tree } from '@nx/devkit';
import { getNormalisedPath } from './get-normalised-path';

export const getProjectNames = (tree: Tree, baseFolder: string): string[] => {
  const projects = getProjects(tree);
  const projectNames = [...projects.keys()];
  return projectNames.filter((projectName) => {
    const project = projects.get(projectName);
    const normalisedFolderPath = getNormalisedPath(baseFolder);
    const normalisedProjectRoot = getNormalisedPath(project.root);
    return normalisedProjectRoot.startsWith(normalisedFolderPath);
  });
};
