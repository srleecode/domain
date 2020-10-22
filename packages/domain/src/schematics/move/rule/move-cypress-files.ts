import {
  Rule,
  Tree,
  SchematicContext,
  SchematicsException,
} from '@angular-devkit/schematics';
import { getDirInTree } from '../../../utils/tree';

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
    tree.create(newPath, tree.read(file));
  });

  return tree;
};
