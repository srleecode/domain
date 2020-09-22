import * as treeUtils from '../../../utils/tree';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { Tree } from '@angular-devkit/schematics';
import { deleteCypressProjectFolder } from './delete-cypress-project-folder';
import { getTopLevelDomain, getParsedDomain } from '../../../utils/domain';
import { CypressProject } from '../model/cypress-project.enum';
import { deleteLibraryCypressFolders } from './delete-library-cypress-folders';

describe('deleteLibraryCypressFolders', () => {
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

  it('should delete library cypress folders', () => {
    jest.spyOn(treeUtils, 'getDirInTree').mockImplementation(() => ({
      subdirs: [`.${CypressProject.E2E}`, '.cypress'],
    }));
    deleteLibraryCypressFolders(
      application,
      parentDomain,
      CypressProject.E2E
    )(tree, undefined);
    expect(treeUtils.deleteInTree).toHaveBeenNthCalledWith(
      1,
      tree,
      `libs/${application}/${parentDomain}/.${CypressProject.E2E}`
    );
    expect(treeUtils.deleteInTree).toHaveBeenNthCalledWith(
      2,
      tree,
      `libs/${application}/${parentDomain}/.cypress`
    );
  });
  it('should not delete library .cypress folder when both .e2e and .storybook folders exist', () => {
    jest.spyOn(treeUtils, 'getDirInTree').mockImplementation(() => ({
      subdirs: [
        `.${CypressProject.E2E}`,
        '.cypress',
        `.${CypressProject.Storybook}`,
      ],
    }));
    deleteLibraryCypressFolders(
      application,
      parentDomain,
      CypressProject.E2E
    )(tree, undefined);
    expect(treeUtils.deleteInTree).toHaveBeenNthCalledWith(
      1,
      tree,
      `libs/${application}/${parentDomain}/.${CypressProject.E2E}`
    );
  });
});
