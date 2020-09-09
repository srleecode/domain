import { updateJsonInTree, NxJson } from '@nrwl/workspace';
import { Rule, Tree } from '@angular-devkit/schematics';
import { getUnprocessedE2ECypressProjectName } from '../../../utils/e2e-project';

export const renameE2EProjectInWorkspaceJson = (
  application: string,
  domain: string,
  tree: Tree
): Rule => {
  const configFile = tree.exists('angular.json')
    ? 'angular.json'
    : 'workspace.json';
  return updateJsonInTree(configFile, (json) => {
    const projectName = getUnprocessedE2ECypressProjectName(
      application,
      domain
    );
    const parsedProjectName = projectName.replace(/\//g, '-');
    json.projects[parsedProjectName] = { ...json.projects[projectName] };
    delete json.projects[projectName];
    return json;
  });
};
