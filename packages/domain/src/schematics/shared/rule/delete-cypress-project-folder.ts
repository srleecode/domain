import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { getTopLevelDomain, isTwoLevelDomain } from '../../../utils/domain';
import { deleteInTree, getDirInTree } from '../../../utils/tree';
import { CypressProject } from '../model/cypress-project.enum';

export const deleteCypressProjectFolder = (
  application: string,
  domain: string,
  projectType: CypressProject
): Rule => (tree: Tree, context: SchematicContext) => {
  const cypressProjectFolder = `apps/${projectType}/${application}/${domain}`;
  const cypressFolder = getDirInTree(tree, cypressProjectFolder);
  if (cypressFolder.subfiles.length > 0 || cypressFolder.subdirs.length > 0)
    cypressFolder.visit((file) => {
      tree.delete(file);
    });

  return tree;
};
