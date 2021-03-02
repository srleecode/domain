import { getParsedDomain } from './domain';
import { Tree } from '@nrwl/devkit';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { LibraryDefinition } from '../model/library-definition.model';
import { DOMAIN_LIBRARY_TYPES } from '../model/domain-library-types.constant';
import { readProjectConfiguration } from './project-configuration';

export const getDomainLibraryDefinitions = (
  application: string,
  domain: string,
  libraries: DomainLibraryName[]
): LibraryDefinition[] => {
  const parsedDomain = getParsedDomain(domain);
  const directory = `${application}/${domain}`;
  const scope = `${application}-${parsedDomain}`;
  return DOMAIN_LIBRARY_TYPES.filter((type) => libraries.includes(type)).map(
    (type): LibraryDefinition => ({
      projectName: `${type}`,
      tags: [`app:${application}`, `scope:${scope}`, `type:${type}`],
      directory,
      type,
    })
  );
};

export const isLibraryExisting = (
  application: string,
  domain: string,
  libraryType: DomainLibraryName,
  tree: Tree
): boolean => {
  const projectName = `${application}-${getParsedDomain(
    domain
  )}-${libraryType.toString()}`;
  try {
    readProjectConfiguration(tree, projectName);
    return true;
  } catch (e) {
    return false;
  }
};

export const getProjectNames = (
  application: string,
  domain: string,
  libraries: DomainLibraryName[]
): string[] =>
  libraries.map((type) => `${application}-${getParsedDomain(domain)}-${type}`);

export const getParsedLibraries = (
  libraries: DomainLibraryName[] | string
): DomainLibraryName[] => {
  if (typeof libraries === 'string') {
    const splitLibrariesString = (libraries as string).split(',');
    return splitLibrariesString.map(
      (library): DomainLibraryName => library.trim() as DomainLibraryName
    );
  }
  return libraries;
};
