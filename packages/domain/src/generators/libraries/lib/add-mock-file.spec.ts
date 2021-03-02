import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import { addMockFile } from './add-mock-file';
import * as treeUtils from '../../shared/utils/tree';

describe('create schematic', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'test-domain';

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    jest.spyOn(treeUtils, 'createInTree').mockImplementation(() => undefined);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add index and mock file', () => {
    addMockFile(appTree, application, domain);
    expect(treeUtils.createInTree).toHaveBeenNthCalledWith(
      1,
      appTree,
      `libs/${application}/${domain}/util/src/testing.ts`,
      `export * from './lib/model/${domain}.mock';`
    );
    expect(treeUtils.createInTree).toHaveBeenNthCalledWith(
      2,
      appTree,
      `libs/${application}/${domain}/util/src/lib/model/${domain}.mock.ts`,
      'export const mock = {};'
    );
  });
});
