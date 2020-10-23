import { updateWorkspaceInTree } from '@nrwl/workspace';
import { Rule, Tree, SchematicsException } from '@angular-devkit/schematics';
import { checkCypressProjectExists } from '../../shared/validation/check-cypress-project-exists';
import { getCypressProjectName } from '../../../utils/cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';

export const updateAngularJson = (
  application: string,
  domain: string,
  projectType: CypressProject
): Rule =>
  updateWorkspaceInTree((json) => {
    checkCypressProjectExists(application, domain, projectType, json);
    const projectName = getCypressProjectName(application, domain, projectType);
    json.projects[
      projectName
    ].architect.lint.options.exclude[1] = `!libs/${application}/${domain}/.*/**`;
    const basePath = `libs/${application}/${domain}/.cypress`;
    json.projects[projectName].root = basePath;
    json.projects[projectName].sourceRoot = `${basePath}/src`;
    json.projects[
      projectName
    ].architect.lint.options.tsConfig[0] = `${basePath}/tsconfig.e2e.json`;
    if (projectType === CypressProject.E2E) {
      const e2eConfig = json.projects[projectName].architect.e2e;
      delete e2eConfig.options.devServerTarget;
      delete e2eConfig.configurations;
      json.projects[
        projectName
      ].architect.e2e.options.cypressConfig = `${basePath}/cypress.json`;
      json.projects[
        projectName
      ].architect.e2e.options.tsConfig = `${basePath}/tsconfig.e2e.json`;
    }
    return json;
  });
