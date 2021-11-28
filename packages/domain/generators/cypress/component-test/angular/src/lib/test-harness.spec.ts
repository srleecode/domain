import { logger, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import {
  defaultDirectiveOptions,
  defaultOptions,
  DIRECTIVES_LIB_PATH,
  LIB_PATH,
} from '../default-options.constant';
import { getFilesContents } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';
import { libraryGenerator } from '@nrwl/angular/generators';
import { setupComponentTestGenerator } from '../generator';

describe('test harness file', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should create component test harness', async () => {
    await libraryGenerator(tree, {
      name: 'feature-test-example',
      directory: 'test-app/test-domain',
    }).catch((e: Error) => {
      logger.error(e.message);
      logger.error(e.stack);
      throw e;
    });
    const testFilePath = `${LIB_PATH}/test-example.harness.ts`;
    await setupComponentTestGenerator(tree, defaultOptions);
    const filesContents = getFilesContents(
      tree,
      testFilePath,
      join(__dirname, './expected-files/component/harness.txt')
    );
    expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
  });

  it('should create directive test harness', async () => {
    await libraryGenerator(tree, {
      name: 'directive-test-example',
      directory: 'test-app/test-domain',
    }).catch((e: Error) => {
      logger.error(e.message);
      logger.error(e.stack);
      throw e;
    });
    const testFilePath = `${DIRECTIVES_LIB_PATH}/test-example.harness.ts`;
    await setupComponentTestGenerator(tree, defaultDirectiveOptions);
    const filesContents = getFilesContents(
      tree,
      testFilePath,
      join(__dirname, './expected-files/directive/harness.txt')
    );
    expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
  });
});
