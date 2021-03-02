import { Tree } from '@nrwl/devkit';
import {
  getSecondLevelDomain,
  getTopLevelDomain,
  isChildDomain,
  isParentDomain,
} from '../utils/domain';
import { deleteInTree } from '../utils/tree';

export const deleteDomainFolder = (
  tree: Tree,
  application: string,
  domain: string
): void => {
  deleteInTree(tree, `libs/${application}/${domain}`);
  const topLevelDomain = getTopLevelDomain(domain);
  if (isChildDomain(domain) || isParentDomain(domain)) {
    const files = tree
      .children(`libs/${application}/${topLevelDomain}`)
      .filter((path) => path !== getSecondLevelDomain(domain));
    if (files.length === 0) {
      deleteInTree(tree, `libs/${application}/${topLevelDomain}`);
    }
  }
};
