import { Tree } from '@nrwl/devkit';
import { getTsConfigPath } from './tsconfig';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

describe('addMockFileResolutionPath', () => {
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  describe('getTsConfigPath', () => {
    it('should return tsconfig path', () => {
      expect(getTsConfigPath(appTree)).toBe('tsconfig.base.json');
    });
  });
});
