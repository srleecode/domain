import { CypressProject } from '../../shared/model/cypress-project.enum';
import { Tree } from '@nrwl/devkit';
import {
  deleteInTree,
  moveDirectory,
  renameInTree,
} from '../../shared/utils/tree';

export const moveE2EFilesToDomain = (
  tree: Tree,
  application: string,
  domain: string
): void => {
  deleteInTree(
    tree,
    `apps/${CypressProject.E2E}/${application}/${domain}/src/support/app.po.ts`
  );
  renameInTree(
    tree,
    `apps/${CypressProject.E2E}/${application}/${domain}/cypress.json`,
    `libs/${application}/${domain}/.cypress/cypress.json`
  );
  const cypressFolder = `apps/${CypressProject.E2E}/${application}/${domain}`;
  moveDirectory(tree, cypressFolder, `libs/${application}/${domain}/.cypress`);
  renameInTree(
    tree,
    `libs/${application}/${domain}/.cypress/src/integration/app.spec.ts`,
    `libs/${application}/${domain}/.cypress/src/integration/${CypressProject.E2E}/app.spec.ts`
  );
};
