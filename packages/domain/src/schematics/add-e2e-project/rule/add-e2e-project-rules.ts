import { Linter } from '@nrwl/workspace';
import { Rule, Tree } from '@angular-devkit/schematics';
import { removeDevServerTargets } from './remove-dev-server-target';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { addE2EImplicitDependencies } from '../../shared/rule/add-e2e-implicit-dependencies';
import { renameE2EProjectInNxJson } from './rename-e2e-project-in-nx-json';
import { renameE2EProjectInWorkspaceJson } from './rename-e2e-project-in-workspace-json';
import { createCypressProject } from './create-cypress-project';

export const addE2EProjectRules = (
  application: string,
  domain: string,
  libraries: DomainLibraryName[],
  linter: Linter,
  tree: Tree
): Rule[] => [
  createCypressProject(application, domain, linter),
  renameE2EProjectInNxJson(application, domain),
  renameE2EProjectInWorkspaceJson(application, domain, tree),
  addE2EImplicitDependencies(application, domain, libraries),
  removeDevServerTargets(application, domain, tree),
];
