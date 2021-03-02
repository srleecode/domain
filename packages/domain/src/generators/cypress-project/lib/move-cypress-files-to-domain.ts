import { CypressProject } from '../../shared/model/cypress-project.enum';
import { Tree } from '@nrwl/devkit';
import {
  deleteInTree,
  moveDirectory,
  renameInTree,
} from '../../shared/utils/tree';

export const moveCypressFilesToDomain = (
  tree: Tree,
  application: string,
  domain: string
): void => {
  const storybookFilesToDelete = [
    'support/app.po.ts',
    'fixtures/example.json',
    'plugins/index.js',
  ];
  renameInTree(
    tree,
    `apps/${CypressProject.Storybook}/${application}/${domain}/cypress.json`,
    `libs/${application}/${domain}/.cypress/storybook-cypress.json`
  );
  storybookFilesToDelete.forEach((filePath) =>
    deleteInTree(
      tree,
      `apps/${CypressProject.Storybook}/${application}/${domain}/src/${filePath}`
    )
  );
  const cypressFolder = `apps/${CypressProject.Storybook}/${application}/${domain}`;
  moveDirectory(tree, cypressFolder, `libs/${application}/${domain}/.cypress`);
  renameInTree(
    tree,
    `libs/${application}/${domain}/.cypress/src/integration/app.spec.ts`,
    `libs/${application}/${domain}/.cypress/src/integration/${CypressProject.Storybook}/app.spec.ts`
  );
};
