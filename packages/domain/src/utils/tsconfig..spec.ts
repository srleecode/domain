import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { getTsConfigPath } from './tsconfig';

describe('addMockFileResolutionPath', () => {
  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
  });

  describe('getTsConfigPath', () => {
    it('should return tsconfig path', () => {
      expect(getTsConfigPath(appTree)).toBe('tsconfig.base.json');
    });
  });
});
