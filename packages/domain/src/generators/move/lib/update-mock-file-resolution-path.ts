import { isDomainHavingLibraryType } from '../../shared/utils/domain';
import { Tree } from '@nrwl/devkit';
import { addMockFileResolutionPath } from '../../libraries/lib/add-mock-file-resolution-path';
import { removeMockFileResolutionPath } from '../../shared/lib/remove-mock-file-resolution-path';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';

export const updateMockFileResolutionPath = (
  tree: Tree,
  application: string,
  domain: string,
  newDomain: string
): void => {
  if (
    isDomainHavingLibraryType(
      application,
      newDomain,
      tree,
      DomainLibraryName.Util
    )
  ) {
    addMockFileResolutionPath(tree, application, newDomain);
    removeMockFileResolutionPath(tree, application, domain);
  }
};
