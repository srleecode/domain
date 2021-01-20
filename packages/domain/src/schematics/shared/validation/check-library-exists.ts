import { DomainLibraryName } from '../model/domain-library-name.enum';
import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { isLibraryExisting } from '../../../utils/libraries';

export const checkLibraryExists = (
  application: string,
  domain: string,
  domainLibraryName: DomainLibraryName,
  tree: Tree
): void => {
  if (!isLibraryExisting(application, domain, domainLibraryName, tree)) {
    throw new SchematicsException(
      `${application}/${domain}/${domainLibraryName} does not exist`
    );
  }
};
