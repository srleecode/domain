import { Rule } from '@angular-devkit/schematics';
import { updateAngularJson } from './update-angular-json';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { addImplicitDependenciesToCypressProject } from '../../shared/rule/add-implicit-dependencies-to-cypress-project';
import { renameCypressProjectInNxJson } from './rename-cypress-project-in-nx-json';
import { renameCypressProjectInWorkspaceJson } from './rename-cypress-project-in-workspace-json';
import { createCypressProject } from './create-cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { updateCypressProjectIncludedFiles } from '../../shared/rule/update-cypress-project-included-files';
import { addCypressSupportFiles } from './add-cypress-support-file';
import { moveStorybookFilesToDomain } from './move-storybook-files-to-domain';
import { updateEslintrc } from './update-eslintrc';
import { addStorybookConfig } from './add-storybook-config';

export const addStorybookProjectRules = (
  application: string,
  domain: string,
  libraries: DomainLibraryName[],
  projectType: CypressProject
): Rule[] => {
  return [
    createCypressProject(application, domain, projectType),
    renameCypressProjectInNxJson(application, domain, projectType),
    renameCypressProjectInWorkspaceJson(application, domain, projectType),
    addImplicitDependenciesToCypressProject(
      application,
      domain,
      libraries,
      projectType
    ),
    updateAngularJson(application, domain, projectType),
    moveStorybookFilesToDomain(application, domain),
    addCypressSupportFiles(application, domain, projectType),
    ...updateCypressProjectIncludedFiles(application, domain, projectType),
    updateEslintrc(application, domain, projectType),
    ...addStorybookConfig(application, domain, libraries),
  ];
};
