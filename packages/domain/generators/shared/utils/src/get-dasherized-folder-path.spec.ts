import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { getDasherizedFolderPath } from './get-dasherized-folder-path';

describe('getDasherizedFolderPath', () => {
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });
  it('should return dasherized version of grouping folder path', () => {
    expect(getDasherizedFolderPath(appTree, 'libs/test-app/test-domain')).toBe(
      'test-app-test-domain'
    );
  });
});
