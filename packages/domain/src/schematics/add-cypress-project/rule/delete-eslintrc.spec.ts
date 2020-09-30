import * as treeUtils from '../../../utils/tree';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { Tree } from '@angular-devkit/schematics';
import { deleteEslintrc } from './delete-eslintrc';
import { CypressProject } from '../../shared/model/cypress-project.enum';

describe('deleteEslintrc', () => {
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

  it('should delete eslintrc in cypress project folder', () => {
    deleteEslintrc(
      application,
      parentDomain,
      CypressProject.E2E
    )(tree, undefined);
    expect(treeUtils.deleteInTree).toHaveBeenCalledWith(
      tree,
      `apps/${CypressProject.E2E}/${application}/${parentDomain}/.eslintrc`
    );
  });
});
