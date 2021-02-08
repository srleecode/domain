import { DomainLibraryName } from '../model/domain-library-name.enum';
import { Tree } from '@nrwl/devkit';
import { isLibraryExisting } from '../utils/libraries';

export const checkLibraryExists = (
  application: string,
  domain: string,
  domainLibraryName: DomainLibraryName,
  tree: Tree
): void => {
  if (!isLibraryExisting(application, domain, domainLibraryName, tree)) {
    throw new Error(
      `${application}/${domain}/${domainLibraryName} does not exist`
    );
  }
};
