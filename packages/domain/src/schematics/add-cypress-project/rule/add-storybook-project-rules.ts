import { Rule } from '@angular-devkit/schematics';
import { updateAngularJson } from './update-angular-json';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { addImplicitDependenciesToCypressProject } from '../../shared/rule/add-implicit-dependencies-to-cypress-project';
import { renameCypressProjectInNxJson } from './rename-cypress-project-in-nx-json';
import { renameCypressProjectInWorkspaceJson } from './rename-cypress-project-in-workspace-json';
import { createCypressProject } from './create-cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { moveStorybookFilesToDomain } from './move-storybook-files-to-domain';
import { addStorybookConfig } from './add-storybook-config';
import { Linter } from '@nrwl/workspace';
import { UiFrameworkType } from '../../shared/model/ui-framework.type';
import { deleteCypressProjectFolder } from '../../shared/rule/delete-cypress-project-folder';
import { addSourceMapFalse } from './add-source-map-false';

export const addStorybookProjectRules = (
  application: string,
  domain: string,
  lint: Linter,
  libraries: DomainLibraryName[]
): Rule[] => {
  const projectType = CypressProject.Storybook;
  const uiFramework: UiFrameworkType = '@storybook/angular';
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
    moveStorybookFilesToDomain(application, domain),
    ...addStorybookConfig(application, domain, lint, libraries, uiFramework),
    updateAngularJson(application, domain, projectType),
    deleteCypressProjectFolder(application, domain, projectType),
    addSourceMapFalse(application, domain),
  ];
};
