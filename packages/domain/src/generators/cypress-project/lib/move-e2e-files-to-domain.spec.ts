import * as treeUtils from '../../shared/utils/tree';
import { moveE2EFilesToDomain } from './move-e2e-files-to-domain';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';

describe('moveE2EFilesToDomain', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'leaf-domain';
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    jest.spyOn(treeUtils, 'createInTree').mockImplementation(() => undefined);
    jest.spyOn(treeUtils, 'renameInTree').mockImplementation(() => undefined);
    jest.spyOn(treeUtils, 'deleteInTree').mockImplementation(() => undefined);
    const cypressFolder = `apps/${CypressProject.E2E}/${application}/${domain}`;
    appTree.write(`${cypressFolder}/.eslintrc.json`, '');
    appTree.write(`${cypressFolder}/cypress.json`, '');
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should move files in tree', () => {
    moveE2EFilesToDomain(appTree, application, domain);
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
