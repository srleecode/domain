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
  const cypressFolders = ['.e2e', '.storybook', '.cypress'];
  const domainFolder = getDirInTree(tree, `libs/${application}/${domain}`);
  cypressFolders.forEach((folder) => {
    if (domainFolder.subdirs.some((subDir) => subDir.toString() === folder)) {
      const cypressFolder = getDirInTree(
        tree,
        `libs/${application}/${domain}/${folder}`
      );
      cypressFolder.visit((file) => {
        const newPath = file.replace(
          cypressFolder.path,
          `libs/${application}/${newDomain}/${folder}`
        );
        tree.create(newPath, tree.read(file));
      });
    }
  });
  return tree;
};
