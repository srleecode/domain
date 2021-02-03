import { CypressProject } from '../../shared/model/cypress-project.enum';
import { Tree, SchematicContext } from '@angular-devkit/schematics';

import {
  createInTree,
  deleteInTree,
  existsInTree,
  getDirInTree,
  readInTree,
  renameInTree,
} from '../../../utils/tree';
import { parse } from 'path';
import { isHavingCypressProject } from '../../../utils/cypress-project';

export const moveE2EFilesToDomain = (application: string, domain: string) => (
  tree: Tree,
  context: SchematicContext
) => {
  deleteInTree(
    tree,
    `apps/${CypressProject.E2E}/${application}/${domain}/src/support/app.po.ts`
  );
  renameInTree(
    tree,
    `apps/${CypressProject.E2E}/${application}/${domain}/cypress.json`,
    `libs/${application}/${domain}/.cypress/cypress.json`
  );
  const cypressFolder = getDirInTree(
    tree,
    `apps/${CypressProject.E2E}/${application}/${domain}`
  );
  cypressFolder.visit((file) => {
    const newPath = file.replace(
      cypressFolder.path,
      `libs/${application}/${domain}/.cypress`
    );
    const fileName = parse(file).base;
    // hidden files like .eslintrc.json don't return true for existsInTree, so excluding it manually if storybook project exists
    const isExistingHiddenFile =
      fileName.startsWith('.') &&
      isHavingCypressProject(
        application,
        domain,
        CypressProject.Storybook,
        tree
      );
    if (!isExistingHiddenFile && !existsInTree(tree, `${newPath}/${file}`)) {
      createInTree(tree, newPath, readInTree(tree, file));
    }
  });
  renameInTree(
    tree,
    `libs/${application}/${domain}/.cypress/src/integration/app.spec.ts`,
    `libs/${application}/${domain}/.cypress/src/integration/${CypressProject.E2E}/app.spec.ts`
  );
  return tree;
};
