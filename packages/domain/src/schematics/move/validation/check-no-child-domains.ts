import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { sep } from 'path';
import { isParentDomain, getTopLevelDomain } from '../../../utils/domain';

export const checkNoChildDomains = (
  application: string,
  domain: string,
  tree: Tree
): void => {
  if (
    isParentDomain(domain) &&
    isHavingChildDomains(application, getTopLevelDomain(domain), tree)
  ) {
    throw new SchematicsException(`${application}/${domain} has child domains`);
  }
};

const isHavingChildDomains = (
  application: string,
  domain: string,
  tree: Tree
): boolean =>
  tree
    .getDir(`libs/${application}/${domain}`.replace('/', sep))
    .subdirs.filter((path) => path !== 'shared').length > 0;
