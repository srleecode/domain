import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { getDomainPath } from './get-domain-path';

describe('getDomainPath', () => {
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });
  it('should return domain path from given grouping folder path', () => {
    expect(getDomainPath(appTree, 'libs/test-app/test-domain')).toBe(
      'test-app/test-domain'
    );
  });
});
