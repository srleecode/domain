import {
  Rule,
  Tree,
  SchematicContext,
  SchematicsException,
} from '@angular-devkit/schematics';
import { createInTree, getDirInTree, readInTree } from '../../../utils/tree';

export const moveCypressFiles = (
  application: string,
  domain: string,
  newDomain: string
): Rule => (tree: Tree, context: SchematicContext): Tree => {
  const cypressFolder = getDirInTree(
    tree,
    `libs/${application}/${domain}/.cypress`
  );
  cypressFolder.visit((file) => {
    const newPath = file.replace(
      cypressFolder.path,
      `libs/${application}/${newDomain}/.cypress`
    );
    createInTree(tree, newPath, readInTree(tree, file));
  });

  return tree;
};
