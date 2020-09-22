import {
  Rule,
  Tree,
  SchematicContext,
  SchematicsException,
} from '@angular-devkit/schematics';
import { deleteInTree } from '../../../utils/tree';
import { getParsedDomain } from '../../../utils/domain';
import { CypressProject } from '../model/cypress-project.enum';

export const deleteCypressProjectFolder = (
  application: string,
  domain: string,
  projectType: CypressProject
): Rule => (tree: Tree, context: SchematicContext) => {
  const cypressProjectFolder = `apps/${projectType}/${application}/${domain}`;
  deleteInTree(tree, cypressProjectFolder);
  return tree;
};
