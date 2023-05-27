import { Tree } from '@nx/devkit';
import * as getNpmScopeMock from '@nx/js/src/utils/package-json/get-npm-scope';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { getNpmScope } from './get-npm-scope';

describe('getNpmScope', () => {
  let tree: Tree;
  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(getNpmScopeMock, 'getNpmScope').mockReturnValue('test');
  });
  it('should return with prefixed @', async () => {
    expect(getNpmScope(tree)).toBe('@test');
  });
});
