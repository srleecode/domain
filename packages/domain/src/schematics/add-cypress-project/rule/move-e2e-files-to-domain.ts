import { CypressProject } from '../../shared/model/cypress-project.enum';
import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { getCypressJsonPath } from '../../../utils/cypress-project';
import { Linter, updateJsonInTree } from '@nrwl/workspace';
import {
  createInTree,
  deleteInTree,
  existsInTree,
  getDirInTree,
  readInTree,
  renameInTree,
} from '../../../utils/tree';
import { isTwoLevelDomain } from '../../../utils/domain';

export const moveE2EFilesToDomain = (
  application: string,
  domain: string,
  lint: Linter
) => (tree: Tree, context: SchematicContext) => {
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
    if (!existsInTree(tree, `${newPath}/${file}`)) {
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
