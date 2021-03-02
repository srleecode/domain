import { CypressProject } from '../model/cypress-project.enum';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { getParsedDomain, isTwoLevelDomain } from './domain';
import {
  Tree,
  ProjectConfiguration,
  NxJsonProjectConfiguration,
} from '@nrwl/devkit';
import { Linter } from '../model/linter.enum';
import { existsInTree } from './tree';
import { readProjectConfiguration } from './project-configuration';

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
  tree: Tree,
  application: string,
  domain: string,
  removedLibraryTypes: DomainLibraryName[],
  projectType: CypressProject
): boolean => {
  return (
    getDependenciesWithLibrariesRemoved(
      tree,
      application,
      domain,
      removedLibraryTypes,
      projectType
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
  try {
    readProjectConfiguration(tree, projectName);
    return true;
  } catch (e) {
    return false;
  }
};

export const getCypressProjectLinter = (
  application: string,
  domain: string,
  projectType: CypressProject,
  tree: Tree
): Linter => {
  const projectName = getCypressProjectName(application, domain, projectType);
  const projectConfig = readProjectConfiguration(tree, projectName);
  const lintBuilder: string = projectConfig.targets?.lint.executor;
  if (
    lintBuilder !== '@angular-devkit/build-angular:tslint' &&
    !lintBuilder.includes('@nrwl/linter')
  ) {
    throw new Error(`Invalid lint builder ${lintBuilder} for ${projectName}`);
  }
  if (lintBuilder === '@angular-devkit/build-angular:tslint') {
    return Linter.TsLint;
  } else if (lintBuilder.includes('@nrwl/linter')) {
    return projectConfig.targets?.lint.options.linter;
  }
  return Linter.None;
};

export const getDependenciesWithLibrariesRemoved = (
  tree: Tree,
  application: string,
  domain: string,
  libraryTypes: DomainLibraryName[],
  projectType: CypressProject
): string[] => {
  const projectName = getCypressProjectName(application, domain, projectType);
  let projectConfig: ProjectConfiguration & NxJsonProjectConfiguration;
  try {
    projectConfig = readProjectConfiguration(tree, projectName);
  } catch (e) {
    return [];
  }
  const implicitDependencies = libraryTypes.map(
    (type) => `${application}-${getParsedDomain(domain)}-${type}`
  );
  const removedDependenciesSet = new Set(implicitDependencies);
  let existingDependencies = [];
  existingDependencies = projectConfig.implicitDependencies || [];
  return existingDependencies.filter(
    (dependency) => !removedDependenciesSet.has(dependency)
  );
};

export const isHavingComponentCommand = (
  tree: Tree,
  application: string,
  domain: string
): boolean =>
  existsInTree(
    tree,
    `libs/${application}/${domain}/.cypress/src/support/component-command.ts`
  );

export const isHavingEsLintRcJson = (
  tree: Tree,
  application: string,
  domain: string
): boolean =>
  existsInTree(tree, `libs/${application}/${domain}/.cypress/.eslintrc.json`);
