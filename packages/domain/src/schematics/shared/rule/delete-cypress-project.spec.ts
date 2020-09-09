import * as treeUtils from '../../../utils/tree';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { Tree } from '@angular-devkit/schematics';
import { deleteCypressProjectFolder } from './delete-cypress-project-folder';
import { getTopLevelDomain } from '../../../utils/domain';

describe('deleteCypressProjectFolder', () => {
  let tree: UnitTestTree;
  const application = 'test-application';
  const parentDomain = 'parent-domain/shared';
  beforeEach(() => {
    tree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    jest.spyOn(treeUtils, 'deleteInTree').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete cypress project folder', () => {
    deleteCypressProjectFolder(application, parentDomain)(tree, undefined);
    expect(treeUtils.deleteInTree).toHaveBeenCalledWith(
      tree,
      `apps/e2e/${application}/${getTopLevelDomain(parentDomain)}`
    );
  });
});
