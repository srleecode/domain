import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { deleteInTree } from '../../../utils/tree';
import { getTopLevelDomain } from '../../../utils/domain';

export const deleteCypressProjectFolder = (
  application: string,
  domain: string
): Rule => (tree: Tree, context: SchematicContext) => {
  const cypressProjectFolder = `apps/e2e/${application}/${getTopLevelDomain(
    domain
  )}`;
  deleteInTree(tree, cypressProjectFolder);
  return tree;
};
