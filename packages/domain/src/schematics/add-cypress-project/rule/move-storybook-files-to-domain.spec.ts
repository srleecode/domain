import * as workspaceUtils from '@nrwl/workspace';
import * as treeUtils from '../../../utils/tree';
import { emptyRule } from '../../../utils/testing';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { Tree } from '@angular-devkit/schematics';
import { moveStorybookFilesToDomain } from './move-storybook-files-to-domain';

jest.mock('@nrwl/workspace', () => ({
  updateJsonInTree: jest.fn(),
}));
describe('moveStorybookFilesToDomain', () => {
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
    moveStorybookFilesToDomain(application, domain)(appTree, undefined);
    expect(treeUtils.renameInTree).toHaveBeenNthCalledWith(
      1,
      appTree,
      `apps/${CypressProject.Storybook}/${application}/${domain}/cypress.json`,
      `libs/${application}/${domain}/.${CypressProject.Storybook}/cypress.json`
    );
    expect(treeUtils.renameInTree).toHaveBeenNthCalledWith(
      2,
      appTree,
      `libs/${application}/${domain}/.cypress/src/integration/app.spec.ts`,
      `libs/${application}/${domain}/.cypress/src/integration/${CypressProject.Storybook}/app.spec.ts`
    );
  });
  it('should delete files that are not required', () => {
    moveStorybookFilesToDomain(application, domain)(appTree, undefined);
    const basePath = `apps/${CypressProject.Storybook}/${application}/${domain}/src`;
    expect(treeUtils.deleteInTree).toHaveBeenNthCalledWith(
      1,
      appTree,
      `${basePath}/support/app.po.ts`
    );
    expect(treeUtils.deleteInTree).toHaveBeenNthCalledWith(
      2,
      appTree,
      `${basePath}/fixtures/example.json`
    );
    expect(treeUtils.deleteInTree).toHaveBeenNthCalledWith(
      3,
      appTree,
      `${basePath}/plugins/index.js`
    );
  });
});
