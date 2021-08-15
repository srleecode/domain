import { logger, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { defaultOptions, LIB_PATH } from '../default-options.constant';
import { checkFileContentIsSame } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';
import { libraryGenerator } from '@nrwl/angular/src/generators/library/library';
import { setupComponentTestGenerator } from '../generator';

describe('test harness file', () => {
  let tree: Tree;
  const testFilePath = `${LIB_PATH}/test-example.harness.ts`;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    await libraryGenerator(tree, {
      name: 'feature-test-example',
      directory: 'test-app/test-domain',
    }).catch((e) => {
      logger.error(e.message);
      throw e;
    });
  });

  it('should create component test harness', async () => {
    await setupComponentTestGenerator(tree, defaultOptions);
    checkFileContentIsSame(
      tree,
      testFilePath,
      join(__dirname, './expected-files/harness.txt')
    );
  });
});
