import { Rule } from '@angular-devkit/schematics';
import { updateAngularJson } from './update-angular-json';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { addImplicitDependenciesToCypressProject } from '../../shared/rule/add-implicit-dependencies-to-cypress-project';
import { renameCypressProjectInNxJson } from './rename-cypress-project-in-nx-json';
import { renameCypressProjectInWorkspaceJson } from './rename-cypress-project-in-workspace-json';
import { createCypressProject } from './create-cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { moveE2EFilesToDomain } from './move-e2e-files-to-domain';
import { updateJsonInTree } from '@nrwl/workspace';
import { deleteCypressProjectFolder } from '../../shared/rule/delete-cypress-project-folder';
import { addSourceMapFalse } from './add-source-map-false';
import { Linter } from '../../shared/model/linter.enum';
import { addProjectToJestConfig } from '../../shared/rule/add-project-to-jest-config';

export const addE2EProjectRules = (
  application: string,
  domain: string,
  lint: Linter,
  libraries: DomainLibraryName[]
): Rule[] => {
  const projectType = CypressProject.E2E;
  return [
    createCypressProject(application, domain, lint, projectType),
    renameCypressProjectInNxJson(application, domain, projectType),
    renameCypressProjectInWorkspaceJson(application, domain, projectType),
    addImplicitDependenciesToCypressProject(
      application,
      domain,
      libraries,
      projectType
    ),
    updateAngularJson(application, domain, projectType),
    moveE2EFilesToDomain(application, domain),
    deleteCypressProjectFolder(application, domain, projectType),
    addSourceMapFalse(application, domain),
    changeIntegrationFolder(application, domain),
    addProjectToJestConfig(application, domain, '.cypress'),
  ];
};

const changeIntegrationFolder = (application: string, domain: string): Rule =>
  updateJsonInTree(
    `libs/${application}/${domain}/.cypress/cypress.json`,
    (json) => {
      json['integrationFolder'] = json['integrationFolder'].replace(
        '/integration',
        '/integration/e2e'
      );
      return json;
    }
  );
