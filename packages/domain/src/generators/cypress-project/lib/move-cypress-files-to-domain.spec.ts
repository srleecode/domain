import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import * as treeUtils from '../../shared/utils/tree';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { moveCypressFilesToDomain } from './move-cypress-files-to-domain';

jest.mock('@nrwl/workspace', () => ({
  updateJsonInTree: jest.fn(),
}));
describe('moveCypressFilesToDomain', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'leaf-domain';
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    jest.spyOn(treeUtils, 'renameInTree').mockImplementation(() => undefined);
    jest.spyOn(treeUtils, 'deleteInTree').mockImplementation(() => undefined);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should move files in tree', () => {
    moveCypressFilesToDomain(appTree, application, domain);
    expect(treeUtils.renameInTree).toHaveBeenNthCalledWith(
      1,
      appTree,
      `apps/${CypressProject.Storybook}/${application}/${domain}/cypress.json`,
      `libs/${application}/${domain}/.cypress/storybook-cypress.json`
    );
    expect(treeUtils.renameInTree).toHaveBeenNthCalledWith(
      2,
      appTree,
      `libs/${application}/${domain}/.cypress/src/integration/app.spec.ts`,
      `libs/${application}/${domain}/.cypress/src/integration/${CypressProject.Storybook}/app.spec.ts`
    );
  });
  it('should delete files that are not required', () => {
    moveCypressFilesToDomain(appTree, application, domain);
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
