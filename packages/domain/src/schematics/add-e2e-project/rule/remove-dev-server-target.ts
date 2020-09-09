import { updateJsonInTree } from '@nrwl/workspace';
import { Rule, Tree, SchematicsException } from '@angular-devkit/schematics';
import { checkE2EProjectExists } from '../../shared/validation/check-e2e-project-exists';
import { getE2ECypressProjectName } from '../../../utils/e2e-project';

export const removeDevServerTargets = (
  application: string,
  domain: string,
  tree: Tree
): Rule => {
  const configFile = tree.exists('angular.json')
    ? 'angular.json'
    : 'workspace.json';
  return updateJsonInTree<any>(configFile, (json) => {
    checkE2EProjectExists(application, domain, json);
    const projectName = getE2ECypressProjectName(application, domain);
    const e2eConfig = json.projects[projectName].architect.e2e;
    delete e2eConfig.options.devServerTarget;
    delete e2eConfig.configurations;
    return json;
  });
};
