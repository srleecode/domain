import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { getParsedDomain, isTwoLevelDomain } from './domain';
import { getNxJson } from './nx-json';
import { NxJson } from '@nrwl/workspace/src/core/shared-interfaces';
import { DomainLibraryName } from '../schematics/shared/model/domain-library-name.enum';
import { CypressProject } from '../schematics/shared/model/cypress-project.enum';
import { existsInTree, readWorkspaceInTree } from './tree';
import { Linter } from '@nrwl/workspace';

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
  return `libs/${application}/${domain}/.cypress/storybook-cypress.json`;
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
    !lintBuilder.includes('@nrwl/linter')
  ) {
    throw new SchematicsException(
      `Invalid lint builder ${lintBuilder} for ${projectName} ${JSON.stringify(
        workspaceJson.projects[projectName]
      )}`
    );
  }
  if (lintBuilder === '@angular-devkit/build-angular:tslint') {
    return Linter.TsLint;
  } else if (lintBuilder.includes('@nrwl/linter')) {
    return workspaceJson.projects[projectName]?.architect?.lint.options.linter;
  }
  return Linter.None;
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

export const isHavingComponentCommand = (
  application: string,
  domain: string,
  tree: Tree
): boolean =>
  existsInTree(
    tree,
    `libs/${application}/${getParsedDomain(
      domain
    )}/.cypress/src/support/component-command.ts`
  );

export const isHavingEsLintRcJson = (
  application: string,
  domain: string,
  tree: Tree
): boolean =>
  existsInTree(tree, `libs/${application}/${domain}/.cypress/.eslintrc.json`);
