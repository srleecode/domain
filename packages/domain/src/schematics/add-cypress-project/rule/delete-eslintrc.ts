import {
  Rule,
  Tree,
  SchematicContext,
  SchematicsException,
} from '@angular-devkit/schematics';
import { deleteInTree, getDirInTree, renameInTree } from '../../../utils/tree';
import { CypressProject } from '../../shared/model/cypress-project.enum';

export const deleteEslintrc = (
  application: string,
  domain: string,
  projectType: CypressProject
): Rule => (tree: Tree, context: SchematicContext): Tree => {
  deleteInTree(tree, `apps/${projectType}/${application}/${domain}/.eslintrc`);
  return tree;
};
