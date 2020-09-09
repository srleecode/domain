import { Tree } from '@angular-devkit/schematics';
import { DomainLibraryName } from '../schematics/shared/model/domain-library-name.enum';
import { getNxJson } from './nx-json';
import { Project } from '../schematics/shared/model/project.model';

export const isChildDomain = (domain: string): boolean =>
  domain.includes('/') && !domain.endsWith('shared');

export const getTopLevelDomain = (domain: string): string =>
  domain.split('/')[0];

export const getSecondLevelDomain = (domain: string): string =>
  domain.split('/')[1];

export const getParsedDomain = (domain: string): string =>
  (domain || '').replace(/\//g, '-');

// parent domains are parent level domains that have their libraries in a shared folder
export const isParentDomain = (parentDomain: string): boolean =>
  parentDomain.endsWith('shared');

export const isDomainExisting = (
  application: string,
  domain: string,
  tree: Tree
): boolean =>
  Object.keys(DomainLibraryName).some((key) =>
    tree.exists(
      `/libs/${application}/${domain}/${DomainLibraryName[key]}/src/index.ts`
    )
  );

export const isDomainHavingLibraryType = (
  application: string,
  domain: string,
  tree: Tree,
  libraryType: DomainLibraryName
): boolean => {
  const nxJson = getNxJson(tree);
  const parsedDomainName = getParsedDomain(domain);
  const applicationDomainName = `${application}-${parsedDomainName}`;
  return Object.keys(nxJson.projects).some(
    (projectName) =>
      projectName.replace(`-${libraryType}`, '') === applicationDomainName
  );
};

export const isDomainEmptyAfterLibraryRemoval = (
  application: string,
  domain: string,
  removedLibraryTypes: DomainLibraryName[],
  tree: Tree
): boolean => {
  const nxJson = getNxJson(tree);
  const parsedDomainName = getParsedDomain(domain);
  const applicationDomainName = `${application}-${parsedDomainName}`;

  const isDomainHavingLibrary = Object.keys(nxJson.projects).some(
    (projectName) => {
      const libraryType = getLibraryType(projectName.split('-'));
      if (removedLibraryTypes.includes(libraryType)) {
        return false;
      }
      return (
        projectName.replace(`-${libraryType}`, '') === applicationDomainName
      );
    }
  );

  return !isDomainHavingLibrary;
};

export const getProjects = (
  application: string,
  domain: string,
  tree: Tree
): Project[] => {
  const nxJson = getNxJson(tree);
  const parsedDomainName = getParsedDomain(domain).replace('-shared', '');
  const applicationDomain = `${application}-${parsedDomainName}`;
  return Object.keys(nxJson.projects)
    .map(
      (projectName): Project => {
        const splitProjectName = projectName.split('-');
        const libraryType = getLibraryType(splitProjectName);
        const secondLevelDomain = getProjectsSecondLevelDomain(
          projectName,
          applicationDomain,
          libraryType
        );
        return {
          name: projectName,
          secondLevelDomain,
          type: libraryType,
        };
      }
    )
    .filter(
      (project) =>
        project.name.startsWith(applicationDomain) &&
        (project.secondLevelDomain === '' ||
          getSecondLevelDomain(domain) === project.secondLevelDomain)
    );
};

const getLibraryType = (splitProjectName: string[]): DomainLibraryName => {
  if (
    `${splitProjectName[splitProjectName.length - 2]}-${
      splitProjectName[splitProjectName.length - 1]
    }` === DomainLibraryName.DataAccess.toString()
  ) {
    return DomainLibraryName.DataAccess;
  }
  return splitProjectName[splitProjectName.length - 1] as DomainLibraryName;
};

const getProjectsSecondLevelDomain = (
  projectName: string,
  parentDomainPrefix: string,
  libraryType: DomainLibraryName
): string =>
  projectName
    .replace(`${parentDomainPrefix}`, '')
    .replace(`${libraryType.toString()}`, '')
    .slice(1, -1); // remove "-" from ends of string

export const isTwoLevelDomain = (domain: string): boolean =>
  domain.includes('/');
