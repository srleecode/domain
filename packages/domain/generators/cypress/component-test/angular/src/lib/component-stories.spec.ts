import { logger, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { getFilesContents } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';
import {
  defaultDirectiveOptions,
  defaultOptions,
  DIRECTIVES_LIB_PATH,
  LIB_PATH,
} from '../default-options.constant';
import { MountType } from '@srleecode/domain/shared/utils';
import { setupComponentTestGenerator } from '../generator';
import { libraryGenerator } from '@nrwl/angular/src/generators/library/library';

describe('stories file', () => {
  let tree: Tree;
  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });
  describe('components', () => {
    const testFilePath = `${LIB_PATH}/test-example.stories.ts`;
    beforeEach(async () => {
      await libraryGenerator(tree, {
        name: 'feature-test-example',
        directory: 'test-app/test-domain',
      }).catch((e) => {
        logger.error(e.message);
        throw e;
      });
    });

    it('should not create stories file when mount type is component', async () => {
      await setupComponentTestGenerator(tree, defaultOptions);
      expect(tree.exists(testFilePath)).toBe(false);
    });

    it('should create stories file when mount type is story', async () => {
      await setupComponentTestGenerator(tree, {
        ...defaultOptions,
        mountType: MountType.Story,
      });
      const filesContents = getFilesContents(
        tree,
        testFilePath,
        join(__dirname, './expected-files/component/story.txt')
      );
      expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
    });
  });

  describe('directives', () => {
    const testFilePath = `${DIRECTIVES_LIB_PATH}/test-example.stories.ts`;
    beforeEach(async () => {
      await libraryGenerator(tree, {
        name: 'directive-test-example',
        directory: 'test-app/test-domain',
      }).catch((e) => {
        logger.error(e.message);
        throw e;
      });
    });

    it('should use directives test component when element type is directive', async () => {
      await setupComponentTestGenerator(tree, {
        ...defaultDirectiveOptions,
        mountType: MountType.Story,
      });
      const filesContents = getFilesContents(
        tree,
        testFilePath,
        join(__dirname, './expected-files/directive/story.txt')
      );
      expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
    });
  });
});
