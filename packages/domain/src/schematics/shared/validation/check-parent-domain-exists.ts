import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { isDomainExisting } from '../../../utils/domain';

export const checkParentDomainExists = (
  application: string,
  parentDomain: string,
  tree: Tree
): void => {
  if (!isDomainExisting(application, `${parentDomain}/shared`, tree)) {
    throw new SchematicsException(
      `Configure domain (${parentDomain}) as parent before adding child domains to it`
    );
  }
};
