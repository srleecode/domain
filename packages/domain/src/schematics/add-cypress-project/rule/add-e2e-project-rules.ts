import { Linter } from '@nrwl/workspace';
import { Rule } from '@angular-devkit/schematics';
import { removeDevServerTargets } from './remove-dev-server-target';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { addImplicitDependenciesToCypressProject } from '../../shared/rule/add-implicit-dependencies-to-cypress-project';
import { renameCypressProjectInNxJson } from './rename-cypress-project-in-nx-json';
import { renameCypressProjectInWorkspaceJson } from './rename-cypress-project-in-workspace-json';
import { createCypressProject } from './create-cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { moveCypressFilesToDomain } from './move-cypress-files-to-domain';
import { updateCypressProjectIncludedFiles } from '../../shared/rule/update-cypress-project-included-files';
import { addCypressSupportFiles } from './add-cypress-support-file';

export const addE2EProjectRules = (
  application: string,
  domain: string,
  libraries: DomainLibraryName[],
  projectType: CypressProject,
  linter: Linter
): Rule[] => [
  createCypressProject(application, domain, projectType, linter),
  renameCypressProjectInNxJson(application, domain, projectType),
  renameCypressProjectInWorkspaceJson(application, domain, projectType),
  addImplicitDependenciesToCypressProject(
    application,
    domain,
    libraries,
    projectType
  ),
  removeDevServerTargets(application, domain, projectType),
  moveCypressFilesToDomain(application, domain, projectType),
  addCypressSupportFiles(application, domain, projectType),
  updateCypressProjectIncludedFiles(application, domain, projectType),
];
