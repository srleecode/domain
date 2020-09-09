import { getParsedDomain, isParentDomain } from './domain';
import { DOMAIN_LIBRARY_TYPES } from '../schematics/shared/model/domain-library-types.constant';
import { LibraryDefinition } from '../schematics/shared/model/library-definition.model';
import { DomainLibraryName } from '../schematics/shared/model/domain-library-name.enum';
import { StyleType } from '../schematics/shared/model/style-type.enum';
import { Tree } from '@angular-devkit/schematics';

export const getDomainLibraryDefinitions = (
  application: string,
  domain: string,
  prefix: string,
  includedLibraryTypes: DomainLibraryName[],
  style: StyleType
): LibraryDefinition[] => {
  const parsedDomain = getParsedDomain(domain);
  let directory = `${application}/${domain}`;
  let scope = `${application}-${parsedDomain}`;
  return DOMAIN_LIBRARY_TYPES.filter((type) =>
    includedLibraryTypes.includes(type)
  ).map((type) => ({
    projectName: `${type}`,
    tags: [`app:${application}`, `scope:${scope}`, `type:${type}`],
    prefix,
    style,
    directory,
  }));
};

export const isLibraryExisting = (
  application: string,
  domain: string,
  libraryType: DomainLibraryName,
  tree: Tree
): boolean =>
  tree.getDir(`/libs/${application}/${domain}/${libraryType.toString()}`)
    .subdirs.length > 0;

export const getProjectNames = (
  application: string,
  domain: string,
  includedLibraryTypes: DomainLibraryName[]
): string[] =>
  includedLibraryTypes.map(
    (type) => `${application}-${getParsedDomain(domain)}-${type}`
  );
