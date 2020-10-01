import {
  Rule,
  Tree,
  SchematicContext,
  SchematicsException,
} from '@angular-devkit/schematics';
import { getDirInTree, renameInTree } from '../../../utils/tree';
import { CypressProject } from '../../shared/model/cypress-project.enum';

export const addCypressSupportFiles = (
  application: string,
  domain: string,
  projectType: CypressProject
): Rule => (tree: Tree, context: SchematicContext): Tree => {
  const supportFilesToMove = [
    'support/app.po.ts',
    'support/commands.ts',
    'support/index.ts',
  ];

  supportFilesToMove.forEach((filePath) => {
    const cypressProjectSupportFile = `libs/${application}/${domain}/.${projectType}/${filePath}`;
    const cypressCommonSupportFile = `libs/${application}/${domain}/.cypress/${filePath}`;
    if (!tree.exists(cypressCommonSupportFile)) {
      renameInTree(tree, cypressProjectSupportFile, cypressCommonSupportFile);
    } else {
      tree.delete(cypressProjectSupportFile);
    }
  });

  tree.create(
    `libs/${application}/${domain}/.${projectType}/support/index.ts`,
    `import '../../.cypress/support';`
  );

  return tree;
};
