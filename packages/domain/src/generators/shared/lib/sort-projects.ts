import { Tree, updateJson } from '@nrwl/devkit';
import { getWorkspacePath } from '../utils/workspace';

export const sortProjects = (tree: Tree): void => {
  sortWorkspaceJsonProjects(tree);
  sortNxJsonProjects(tree);
};

const sortWorkspaceJsonProjects = (tree: Tree) =>
  updateJson(tree, getWorkspacePath(tree), (json) => ({
    ...json,
    projects: getSortedProjects(json.projects),
  }));

const sortNxJsonProjects = (tree: Tree) =>
  updateJson(tree, 'nx.json', (json) => ({
    ...json,
    projects: getSortedProjects(json.projects),
  }));

const getSortedProjects = (projects: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): { [key: string]: any } => {
  const sortedProjects = {};
  Object.keys(projects)
    .sort()
    .forEach((key) => (sortedProjects[key] = projects[key]));
  return sortedProjects;
};
