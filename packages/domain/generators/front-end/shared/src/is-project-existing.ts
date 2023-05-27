import { getProjects, Tree } from '@nx/devkit';

export const isProjectExisting = (tree: Tree, projectName: string): boolean =>
  getProjects(tree).has(projectName);
