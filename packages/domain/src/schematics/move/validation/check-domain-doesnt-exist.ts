import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { isDomainExisting } from '../../../utils/domain';

export const checkDomainDoesntExist = (
  application: string,
  domain: string,
  tree: Tree
): void => {
  if (isDomainExisting(application, domain, tree)) {
    throw new SchematicsException(`${application}/${domain} already exists`);
  }
};
