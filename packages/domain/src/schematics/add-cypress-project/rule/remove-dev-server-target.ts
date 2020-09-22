import { updateWorkspaceInTree } from '@nrwl/workspace';
import { Rule, Tree } from '@angular-devkit/schematics';
import { checkCypressProjectExists } from '../../shared/validation/check-cypress-project-exists';
import { getCypressProjectName } from '../../../utils/cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';

export const removeDevServerTargets = (
  application: string,
  domain: string,
  projectType: CypressProject
): Rule =>
  updateWorkspaceInTree((json) => {
    checkCypressProjectExists(application, domain, projectType, json);
    const projectName = getCypressProjectName(application, domain, projectType);
    const e2eConfig = json.projects[projectName].architect.e2e;
    delete e2eConfig.options.devServerTarget;
    delete e2eConfig.configurations;
    return json;
  });
