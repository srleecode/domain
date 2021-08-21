import { getProjects, Tree } from '@nrwl/devkit';

export const isProjectExisting = (tree: Tree, projectName: string): boolean =>
  getProjects(tree).has(projectName);
