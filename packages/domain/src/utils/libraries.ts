import { getParsedDomain, isParentDomain } from './domain';
import { DOMAIN_LIBRARY_TYPES } from '../schematics/shared/model/domain-library-types.constant';
import { LibraryDefinition } from '../schematics/shared/model/library-definition.model';
import { DomainLibraryName } from '../schematics/shared/model/domain-library-name.enum';
import { StyleType } from '../schematics/shared/model/style-type.enum';
import { Tree } from '@angular-devkit/schematics';
import { sep } from 'path';
import { getDirInTree } from './tree';

export const getDomainLibraryDefinitions = (
  application: string,
  domain: string,
  prefix: string,
  libraries: DomainLibraryName[],
  style: StyleType
): LibraryDefinition[] => {
  const parsedDomain = getParsedDomain(domain);
  const directory = `${application}/${domain}`;
  const scope = `${application}-${parsedDomain}`;
  return DOMAIN_LIBRARY_TYPES.filter((type) => libraries.includes(type)).map(
    (type) => ({
      projectName: `${type}`,
      tags: [`app:${application}`, `scope:${scope}`, `type:${type}`],
      prefix,
      style,
      directory,
    })
  );
};

export const isLibraryExisting = (
  application: string,
  domain: string,
  libraryType: DomainLibraryName,
  tree: Tree
): boolean =>
  getDirInTree(tree, `libs/${application}/${domain}/${libraryType.toString()}`)
    .subdirs.length > 0;

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
