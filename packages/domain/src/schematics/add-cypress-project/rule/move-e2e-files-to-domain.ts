import { CypressProject } from '../../shared/model/cypress-project.enum';
import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { getCypressJsonPath } from '../../../utils/cypress-project';
import { Linter, updateJsonInTree } from '@nrwl/workspace';
import { deleteInTree, getDirInTree, renameInTree } from '../../../utils/tree';
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
    `libs/${application}/${domain}/.cypress/cypress.${CypressProject.E2E}.json`
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
    if (!tree.exists(`${newPath}/${file}`)) {
      tree.create(newPath, tree.read(file));
    }
  });
  renameInTree(
    tree,
    `libs/${application}/${domain}/.cypress/src/integration/app.spec.ts`,
    `libs/${application}/${domain}/.cypress/src/integration/${CypressProject.E2E}/app.spec.ts`
  );
  return tree;
};
