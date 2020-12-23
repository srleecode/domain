import { CypressProject } from '../../shared/model/cypress-project.enum';
import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { getCypressJsonPath } from '../../../utils/cypress-project';
import { ProjectType, updateJsonInTree } from '@nrwl/workspace';
import {
  createInTree,
  deleteInTree,
  existsInTree,
  getDirInTree,
  readInTree,
  renameInTree,
} from '../../../utils/tree';
import { isTwoLevelDomain } from '../../../utils/domain';

export const moveStorybookFilesToDomain = (
  application: string,
  domain: string
) => (tree: Tree, context: SchematicContext) => {
  const storybookFilesToDelete = [
    'support/app.po.ts',
    'fixtures/example.json',
    'plugins/index.js',
  ];
  renameInTree(
    tree,
    `apps/${CypressProject.Storybook}/${application}/${domain}/cypress.json`,
    `libs/${application}/${domain}/.${CypressProject.Storybook}/cypress.json`
  );
  storybookFilesToDelete.forEach((filePath) =>
    deleteInTree(
      tree,
      `apps/${CypressProject.Storybook}/${application}/${domain}/src/${filePath}`
    )
  );

  const cypressFolder = getDirInTree(
    tree,
    `apps/${CypressProject.Storybook}/${application}/${domain}`
  );
  cypressFolder.visit((file) => {
    const newPath = file.replace(
      cypressFolder.path,
      `libs/${application}/${domain}/.cypress`
    );

    if (!existsInTree(tree, newPath)) {
      createInTree(tree, newPath, readInTree(tree, file));
    }
  });
  renameInTree(
    tree,
    `libs/${application}/${domain}/.cypress/src/integration/app.spec.ts`,
    `libs/${application}/${domain}/.cypress/src/integration/${CypressProject.Storybook}/app.spec.ts`
  );
  return tree;
};
