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
  supportFilesToMove.forEach((filePath) =>
    renameInTree(
      tree,
      `libs/${application}/${domain}/.${projectType}/${filePath}`,
      `libs/${application}/${domain}/.cypress/${filePath}`
    )
  );
  tree.create(
    `libs/${application}/${domain}/.${projectType}/support/index.ts`,
    `// tslint:disable-next-line:no-import-side-effect
import '../.cypress/support';`
  );

  return tree;
};
