import { Tree } from '@angular-devkit/schematics';
import { getParsedDomain, isTwoLevelDomain } from './domain';
import { getNxJson } from './nx-json';
import { NxJson } from '@nrwl/workspace/src/core/shared-interfaces';
import { DomainLibraryName } from '../schematics/shared/model/domain-library-name.enum';

export const getE2ECypressProjectName = (
  application: string,
  domain: string
): string => `e2e-${application}-${getParsedDomain(domain)}`;

export const getUnprocessedE2ECypressProjectName = (
  application: string,
  domain: string
): string => {
  if (isTwoLevelDomain(domain)) {
    return `e2e/${application}/${getParsedDomain(domain)}`;
  }
  return `e2e/${application}-${domain}`;
};
export const isHavingImplicitDependenciesAfterRemoval = (
  application: string,
  domain: string,
  removedLibraryTypes: DomainLibraryName[],
  tree: Tree
): boolean => {
  const nxJson = getNxJson(tree);
  return (
    getDependenciesWithLibrariesRemoved(
      application,
      domain,
      removedLibraryTypes,
      nxJson
    ).length > 0
  );
};

export const isHavingE2ECypressProject = (
  application: string,
  domain: string,
  tree: Tree
): boolean => {
  const projectName = getE2ECypressProjectName(application, domain);
  const nxJson = getNxJson(tree);
  return !!nxJson.projects[projectName];
};

export const getDependenciesWithLibrariesRemoved = (
  application: string,
  domain: string,
  libraryTypes: DomainLibraryName[],
  json: NxJson
): string[] => {
  const projectName = getE2ECypressProjectName(application, domain);
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
