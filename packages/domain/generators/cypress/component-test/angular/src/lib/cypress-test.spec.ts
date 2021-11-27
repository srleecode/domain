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
import { libraryGenerator } from '@nrwl/angular/generators';

describe('cypress test file', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  describe('component', () => {
    const testFilePath = `${LIB_PATH}/test-example.cy-spec.ts`;
    beforeEach(async () => {
      await libraryGenerator(tree, {
        name: 'feature-test-example',
        directory: 'test-app/test-domain',
      }).catch((e: Error) => {
        logger.error(e.message);
        logger.error(e.stack);
        throw e;
      });
    });

    it('should create cy-spec file with component mount type when mount type is component', async () => {
      await setupComponentTestGenerator(tree, defaultOptions);
      const filesContents = getFilesContents(
        tree,
        testFilePath,
        join(__dirname, './expected-files/component/component-test.txt')
      );
      expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
    });

    it('should create cy-spec file with story mount type when mount type is story', async () => {
      await setupComponentTestGenerator(tree, {
        ...defaultOptions,
        mountType: MountType.Story,
      });
      const filesContents = getFilesContents(
        tree,
        testFilePath,
        join(__dirname, './expected-files/component/story-test.txt')
      );
      expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
    });
  });

  describe('directive', () => {
    const testFilePath = `${DIRECTIVES_LIB_PATH}/test-example.cy-spec.ts`;
    beforeEach(async () => {
      await libraryGenerator(tree, {
        name: 'directive-test-example',
        directory: 'test-app/test-domain',
      }).catch((e: Error) => {
        logger.error(e.message);
        logger.error(e.stack);
        throw e;
      });
    });

    it('should use directives test component when element type is directive and mountType is component', async () => {
      await setupComponentTestGenerator(tree, defaultDirectiveOptions);
      const filesContents = getFilesContents(
        tree,
        testFilePath,
        join(__dirname, './expected-files/directive/component-test.txt')
      );
      expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
    });

    it('should use story when elementType is directive and mountType is story', async () => {
      await setupComponentTestGenerator(tree, {
        ...defaultDirectiveOptions,
        mountType: MountType.Story,
      });
      const filesContents = getFilesContents(
        tree,
        testFilePath,
        join(__dirname, './expected-files/directive/story-test.txt')
      );
      expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
    });
  });
});
