import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { getGroupingFolders } from './get-grouping-folders';

describe('getGroupingFolders', () => {
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });
  it('should return grouping folders for the given grouping folder path', () => {
    expect(getGroupingFolders(appTree, 'libs/test-app/test-domain')).toEqual({
      app: 'test-app',
      domain: ['test-domain'],
    });
  });
  it('should return grouping folders for the given child domain grouping folder path', () => {
    expect(
      getGroupingFolders(appTree, 'libs/test-app/test-domain/child-domain')
    ).toEqual({
      app: 'test-app',
      domain: ['test-domain', 'child-domain'],
    });
  });
});
