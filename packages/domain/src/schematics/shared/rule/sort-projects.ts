import { SchematicContext, Tree, Rule } from '@angular-devkit/schematics';
import { updateJsonInTree, updateWorkspaceInTree } from '@nrwl/workspace';

export const sortProjects = (): Rule[] => [
  sortWorkspaceJsonProjects(),
  sortNxJsonProjects(),
];

const sortWorkspaceJsonProjects = (): Rule =>
  updateWorkspaceInTree((workspace, context: SchematicContext, host: Tree) => ({
    ...workspace,
    projects: getSortedProjects(workspace.projects),
  }));

const sortNxJsonProjects = (): Rule =>
  updateJsonInTree('nx.json', (json) => ({
    ...json,
    projects: getSortedProjects(json.projects),
  }));

const getSortedProjects = (projects: {
  [key: string]: any;
}): { [key: string]: any } => {
  const sortedProjects = {};
  Object.keys(projects)
    .sort()
    .forEach((key) => (sortedProjects[key] = projects[key]));
  return sortedProjects;
};
