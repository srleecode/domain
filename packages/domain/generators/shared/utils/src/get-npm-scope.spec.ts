import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { getNpmScope } from './get-npm-scope';

describe('getNpmScope', () => {
  let tree: Tree;
  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
  });
  const createPackageJson = (name: string): void =>
    tree.write('package.json', `{"name": "${name}"}`);
  it('should return when it has prefixed @', () => {
    createPackageJson('@test');
    expect(getNpmScope(tree)).toBe('@test');
  });
  it('should return when it does not have prefixed @', () => {
    createPackageJson('test');
    expect(getNpmScope(tree)).toBe('@test');
  });
});
