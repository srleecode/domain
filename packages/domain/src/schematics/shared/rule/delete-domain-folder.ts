import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { deleteInTree } from '../../../utils/tree';
import {
  isParentDomain,
  isChildDomain,
  getTopLevelDomain,
  getSecondLevelDomain,
} from '../../../utils/domain';

export const deleteDomainFolder = (
  application: string,
  domain: string
): Rule => (tree: Tree, context: SchematicContext): Tree => {
  deleteInTree(tree, `libs/${application}/${domain}`);
  const topLevelDomain = getTopLevelDomain(domain);
  if (isChildDomain(domain) || isParentDomain(domain)) {
    if (
      tree
        .getDir(`libs/${application}/${topLevelDomain}`)
        .subdirs.filter((path) => path !== getSecondLevelDomain(domain))
        .length === 0
    ) {
      deleteInTree(tree, `libs/${application}/${topLevelDomain}`);
    }
  }
  return tree;
};
