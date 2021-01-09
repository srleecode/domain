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
    if (json.projects[projectName].architect.lint.options.exclude) {
      json.projects[
        projectName
      ].architect.lint.options.exclude[1] = `!libs/${application}/${domain}/.*/**`;
    }
    const basePath = `libs/${application}/${domain}/.cypress`;
    json.projects[projectName].root = basePath;
    json.projects[projectName].sourceRoot = `${basePath}/src`;
    if (json.projects[projectName].architect.lint.options.tsConfig) {
      json.projects[
        projectName
      ].architect.lint.options.tsConfig[0] = `${basePath}/tsconfig.e2e.json`;
    }
    if (json.projects[projectName].architect.lint.options.config) {
      json.projects[
        projectName
      ].architect.lint.options.config = `${basePath}/.eslintrc`;
    }
    if (json.projects[projectName].architect.lint.options.lintFilePatterns) {
      const cypressFolder =
        projectType === CypressProject.E2E ? 'cypress' : 'storybook';
      const lintFilePatterns = [
        `libs/${application}/${domain}/.cypress/integration/${cypressFolder}/**/*.{js,ts}`,
        `libs/${application}/${domain}/${projectType}/**/*.{js,ts}`,
      ];
      if (projectType === CypressProject.E2E) {
        lintFilePatterns.push(
          `!libs/${application}/${domain}/.cypress/integration/.storybook/**/*.{js,ts}`
        );
      }
      json.projects[
        projectName
      ].architect.lint.options.lintFilePatterns = lintFilePatterns;
    }
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
