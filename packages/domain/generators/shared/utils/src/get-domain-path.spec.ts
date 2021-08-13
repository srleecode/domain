import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
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
