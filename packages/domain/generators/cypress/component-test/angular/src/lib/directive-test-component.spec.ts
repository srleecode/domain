import { logger, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import {
  defaultDirectiveOptions,
  defaultOptions,
  DIRECTIVES_LIB_PATH,
  LIB_PATH,
} from '../default-options.constant';
import { libraryGenerator } from '@nrwl/angular/generators';
import { setupComponentTestGenerator } from '../generator';
import { getFilesContents } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';

describe('directive test component file', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  describe('component', () => {
    const testFilePath = `${LIB_PATH}/test.component.ts`;
    it('should not create directive test component file when type is component', async () => {
      await libraryGenerator(tree, {
        name: 'feature-test-example',
        directory: 'test-app/test-domain',
      }).catch((e: Error) => {
        logger.error(e.message);
        logger.error(e.stack);
        throw e;
      });
      await setupComponentTestGenerator(tree, defaultOptions);
      expect(tree.exists(testFilePath)).toBe(false);
    });
  });

  describe('directive', () => {
    const testFilePath = `${DIRECTIVES_LIB_PATH}/test.component.ts`;

    it('should create directive test component file when type is directive', async () => {
      await libraryGenerator(tree, {
        name: 'directive-test-example',
        directory: 'test-app/test-domain',
      }).catch((e: Error) => {
        logger.error(e.message);
        logger.error(e.stack);
        throw e;
      });
      await setupComponentTestGenerator(tree, defaultDirectiveOptions);
      const filesContents = getFilesContents(
        tree,
        testFilePath,
        join(__dirname, './expected-files/directive/test-component.txt')
      );
      expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
    });
  });
});
