import { Tree } from '@nrwl/devkit';
import { isDomainExisting } from '../utils/domain';

export const checkDomainExists = (
  application: string,
  domain: string,
  tree: Tree
): void => {
  if (!isDomainExisting(application, domain, tree)) {
    throw new Error(`${application}/${domain} does not exist`);
  }
};
