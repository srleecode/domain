import { Tree } from '@nrwl/devkit';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { isLibraryExisting } from '../../shared/utils/libraries';

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
    throw new Error(`Libraries already exist: ${existingLibraries.join(',')}`);
  }
};
