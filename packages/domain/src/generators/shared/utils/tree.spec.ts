import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import { moveDirectory } from './tree';

describe('tree', () => {
  let appTree: Tree;
  const originalDirectory = 'original-directory';
  const newDirectory = 'new-directory';
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    appTree.write(`${originalDirectory}/src/index.ts`, '');
    appTree.write(`${originalDirectory}/tsconfig.json`, '');
  });

  describe('moveDirectory', () => {
    it('should move all files in directory', () => {
      moveDirectory(appTree, originalDirectory, newDirectory);
      expect(appTree.exists(`${newDirectory}/src/index.ts`)).toBe(true);
      expect(appTree.exists(`${newDirectory}/tsconfig.json`)).toBe(true);
    });
  });
});
