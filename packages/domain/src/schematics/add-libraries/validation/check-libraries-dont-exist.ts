import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { isParentDomain } from '../../../utils/domain';
import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { isLibraryExisting } from '../../../utils/libraries';

export const checkLibrariesDontExist = (
  application: string,
  domain: string,
  libraryTypes: DomainLibraryName[],
  tree: Tree
): void => {
  const existingLibraries = libraryTypes.filter((libraryType) =>
    isLibraryExisting(application, domain, libraryType, tree)
  );
  if (existingLibraries.length > 0) {
    throw new SchematicsException(
      `Libraries already exist: ${existingLibraries.join(',')}`
    );
  }
};
