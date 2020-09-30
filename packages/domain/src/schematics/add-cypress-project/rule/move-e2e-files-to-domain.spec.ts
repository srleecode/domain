import * as workspaceUtils from '@nrwl/workspace';
import * as treeUtils from '../../../utils/tree';
import { emptyRule } from '../../../utils/testing';
import { moveE2EFilesToDomain } from './move-e2e-files-to-domain';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { Tree } from '@angular-devkit/schematics';
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
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should move files in tree', () => {
    moveE2EFilesToDomain(application, domain)(appTree, undefined);
    expect(treeUtils.renameInTree).toHaveBeenNthCalledWith(
      1,
      appTree,
      `apps/${CypressProject.E2E}/${application}/${domain}/src/fixtures/example.json`,
      `libs/${application}/${domain}/.${CypressProject.E2E}/fixtures/example.json`
    );
    expect(treeUtils.renameInTree).toHaveBeenNthCalledWith(
      2,
      appTree,
      `apps/${CypressProject.E2E}/${application}/${domain}/src/integration/app.spec.ts`,
      `libs/${application}/${domain}/.${CypressProject.E2E}/integration/app.spec.ts`
    );
    expect(treeUtils.renameInTree).toHaveBeenNthCalledWith(
      3,
      appTree,
      `apps/${CypressProject.E2E}/${application}/${domain}/src/plugins/index.js`,
      `libs/${application}/${domain}/.${CypressProject.E2E}/plugins/index.js`
    );
    expect(treeUtils.renameInTree).toHaveBeenNthCalledWith(
      4,
      appTree,
      `apps/${CypressProject.E2E}/${application}/${domain}/src/support/app.po.ts`,
      `libs/${application}/${domain}/.${CypressProject.E2E}/support/app.po.ts`
    );
    expect(treeUtils.renameInTree).toHaveBeenNthCalledWith(
      5,
      appTree,
      `apps/${CypressProject.E2E}/${application}/${domain}/src/support/commands.ts`,
      `libs/${application}/${domain}/.${CypressProject.E2E}/support/commands.ts`
    );
    expect(treeUtils.renameInTree).toHaveBeenNthCalledWith(
      6,
      appTree,
      `apps/${CypressProject.E2E}/${application}/${domain}/src/support/index.ts`,
      `libs/${application}/${domain}/.${CypressProject.E2E}/support/index.ts`
    );
  });
});
