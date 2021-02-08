import { Tree } from '@nrwl/devkit';
import { isDomainExisting } from '../utils/domain';

export const checkDomainDoesntExist = (
  application: string,
  domain: string,
  tree: Tree
): void => {
  if (isDomainExisting(application, domain, tree)) {
    throw new Error(`${application}/${domain} already exists`);
  }
};
