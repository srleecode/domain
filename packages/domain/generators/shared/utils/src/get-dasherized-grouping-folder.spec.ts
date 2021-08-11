import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { getDasherizedGroupingFolder } from './get-dasherized-grouping-folder';

describe('getDasherizedGroupingFolder', () => {
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });
  it('should return dasherized version of grouping folder path', () => {
    expect(
      getDasherizedGroupingFolder(appTree, 'libs/test-app/test-domain')
    ).toBe('test-app-test-domain');
  });
});
