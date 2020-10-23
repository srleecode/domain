import * as workspaceUtils from '@nrwl/workspace';
import * as treeUtils from '../../../utils/tree';
import { emptyRule } from '../../../utils/testing';
import { moveE2EFilesToDomain } from './move-e2e-files-to-domain';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { Tree } from '@angular-devkit/schematics';
import { Linter } from '@nrwl/workspace';
jest.mock('@nrwl/workspace', () => ({
  updateJsonInTree: jest.fn(),
}));
describe('moveE2EFilesToDomain', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'leaf-domain';
  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    jest.spyOn(workspaceUtils, 'updateJsonInTree').mockReturnValue(emptyRule);
    jest.spyOn(treeUtils, 'renameInTree').mockImplementation(() => {});
    jest.spyOn(treeUtils, 'deleteInTree').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should move files in tree', () => {
    moveE2EFilesToDomain(
      application,
      domain,
      Linter.TsLint
    )(appTree, undefined);
    expect(treeUtils.renameInTree).toHaveBeenNthCalledWith(
      1,
      appTree,
      `apps/${CypressProject.E2E}/${application}/${domain}/cypress.json`,
      `libs/${application}/${domain}/.cypress/cypress.json`
    );
    expect(treeUtils.renameInTree).toHaveBeenNthCalledWith(
      2,
      appTree,
      `libs/${application}/${domain}/.cypress/src/integration/app.spec.ts`,
      `libs/${application}/${domain}/.cypress/src/integration/${CypressProject.E2E}/app.spec.ts`
    );
  });
});
