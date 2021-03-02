import { Tree } from '@nrwl/devkit';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { isLibraryExisting } from '../../shared/utils/libraries';

export const checkLibrariesExist = (
  tree: Tree,
  application: string,
  domain: string,
  libraryTypes: DomainLibraryName[]
): void => {
  const notExistingLibraries = libraryTypes.filter(
    (libraryType) => !isLibraryExisting(application, domain, libraryType, tree)
  );
  if (notExistingLibraries.length > 0) {
    throw new Error(
      `Trying to perform an operation on libraries that don't exist: ${notExistingLibraries.join(
        ','
      )}`
    );
  }
};
