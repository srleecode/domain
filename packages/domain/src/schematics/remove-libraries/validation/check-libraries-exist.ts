import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { isLibraryExisting } from '../../../utils/libraries';

export const checkLibrariesExist = (
  application: string,
  domain: string,
  libraryTypes: DomainLibraryName[],
  tree: Tree
): void => {
  const notExistingLibraries = libraryTypes.filter(
    (libraryType) => !isLibraryExisting(application, domain, libraryType, tree)
  );
  if (notExistingLibraries.length > 0) {
    throw new SchematicsException(
      `Trying to perform an operation on libraries that don't exist: ${notExistingLibraries.join(
        ','
      )}`
    );
  }
};
