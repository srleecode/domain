import { Rule } from '@angular-devkit/schematics';
import { updateAngularJson } from './update-angular-json';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { addImplicitDependenciesToCypressProject } from '../../shared/rule/add-implicit-dependencies-to-cypress-project';
import { renameCypressProjectInNxJson } from './rename-cypress-project-in-nx-json';
import { renameCypressProjectInWorkspaceJson } from './rename-cypress-project-in-workspace-json';
import { createCypressProject } from './create-cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { moveE2EFilesToDomain } from './move-e2e-files-to-domain';
import { updateCypressProjectIncludedFiles } from '../../shared/rule/update-cypress-project-included-files';
import { addCypressSupportFiles } from './add-cypress-support-file';
import { deleteEslintrc } from './delete-eslintrc';

export const addE2EProjectRules = (
  application: string,
  domain: string,
  libraries: DomainLibraryName[],
  projectType: CypressProject
): Rule[] => [
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
  moveE2EFilesToDomain(application, domain),
  addCypressSupportFiles(application, domain, projectType),
  ...updateCypressProjectIncludedFiles(application, domain, projectType),
  deleteEslintrc(application, domain, projectType),
];
