import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { getParsedDomain, isTwoLevelDomain } from './domain';
import { getNxJson } from './nx-json';
import { NxJson } from '@nrwl/workspace/src/core/shared-interfaces';
import { DomainLibraryName } from '../schematics/shared/model/domain-library-name.enum';
import { CypressProject } from '../schematics/shared/model/cypress-project.enum';
import { readWorkspaceInTree } from './tree';
import { Linter } from '@nrwl/workspace';
import { UiFrameworkType } from '../schematics/shared/model/ui-framework.type';

export const getCypressProjectName = (
  application: string,
  domain: string,
  projectType: CypressProject
): string => `${projectType}-${application}-${getParsedDomain(domain)}`;

export const getCypressJsonPath = (
  application: string,
  domain: string,
  projectType: CypressProject
): string => {
  if (projectType === CypressProject.E2E) {
    return `libs/${application}/${domain}/.cypress/cypress.json`;
  }
  return `libs/${application}/${domain}/.${CypressProject.Storybook}/cypress.json`;
};

export const getUnprocessedCypressProjectName = (
  application: string,
  domain: string,
  projectType: CypressProject
): string => {
  if (isTwoLevelDomain(domain)) {
    return `${projectType}/${application}/${getParsedDomain(domain)}`;
  }
  return `${projectType}/${application}-${domain}`;
};
export const isHavingImplicitDependenciesAfterRemoval = (
  application: string,
  domain: string,
  removedLibraryTypes: DomainLibraryName[],
  projectType: CypressProject,
  tree: Tree
): boolean => {
  const nxJson = getNxJson(tree);
  return (
    getDependenciesWithLibrariesRemoved(
      application,
      domain,
      removedLibraryTypes,
      projectType,
      nxJson
    ).length > 0
  );
};

export const isHavingCypressProject = (
  application: string,
  domain: string,
  projectType: CypressProject,
  tree: Tree
): boolean => {
  const projectName = getCypressProjectName(application, domain, projectType);

  const nxJson = getNxJson(tree);
  return !!nxJson.projects[projectName];
};

export const getCypressProjectLinter = (
  application: string,
  domain: string,
  projectType: CypressProject,
  tree: Tree
): Linter => {
  const projectName = getCypressProjectName(application, domain, projectType);
  const workspaceJson = readWorkspaceInTree(tree);
  const lintBuilder: string =
    workspaceJson.projects[projectName]?.architect?.lint.builder;
  if (
    lintBuilder !== '@angular-devkit/build-angular:tslint' &&
    lintBuilder !== '@nrwl/linter:lint'
  ) {
    throw new SchematicsException(
      projectName + JSON.stringify(workspaceJson.projects[projectName])
    );
  }
  if (lintBuilder === '@angular-devkit/build-angular:tslint') {
    return Linter.TsLint;
  } else if (lintBuilder === '@nrwl/linter:lint') {
    return workspaceJson.projects[projectName]?.architect?.lint.options.linter;
  }
  return Linter.None;
};

export const getStorybookProjectUiFramework = (
  application: string,
  domain: string,
  tree: Tree
): UiFrameworkType => {
  const projectName = getCypressProjectName(
    application,
    domain,
    CypressProject.Storybook
  );
  const workspaceJson = readWorkspaceInTree(tree);
  return workspaceJson.projects[projectName]?.architect.storybook?.options
    .uiFramework;
};

export const getDependenciesWithLibrariesRemoved = (
  application: string,
  domain: string,
  libraryTypes: DomainLibraryName[],
  projectType: CypressProject,
  json: NxJson
): string[] => {
  const projectName = getCypressProjectName(application, domain, projectType);
  const implicitDependencies = libraryTypes.map(
    (type) => `${application}-${getParsedDomain(domain)}-${type}`
  );
  const removedDependenciesSet = new Set(implicitDependencies);
  const existingDependencies =
    json.projects[projectName].implicitDependencies || [];
  return existingDependencies.filter(
    (dependency) => !removedDependenciesSet.has(dependency)
  );
};
