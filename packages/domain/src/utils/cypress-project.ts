import { Tree } from '@angular-devkit/schematics';
import { getParsedDomain, isTwoLevelDomain } from './domain';
import { getNxJson } from './nx-json';
import { NxJson } from '@nrwl/workspace/src/core/shared-interfaces';
import { DomainLibraryName } from '../schematics/shared/model/domain-library-name.enum';
import { CypressProject } from '../schematics/shared/model/cypress-project.enum';

export const getCypressProjectName = (
  application: string,
  domain: string,
  projectType: CypressProject
): string => `${projectType}-${application}-${getParsedDomain(domain)}`;

export const getCypressJsonPath = (
  application: string,
  domain: string,
  projectType: CypressProject
): string => `apps/${projectType}/${application}/${domain}/cypress.json`;

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
