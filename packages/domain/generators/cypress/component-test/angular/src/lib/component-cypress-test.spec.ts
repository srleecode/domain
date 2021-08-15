import { logger, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { checkFileContentIsSame } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';
import { defaultOptions, LIB_PATH } from '../default-options.constant';
import { MountType } from '@srleecode/domain/shared/utils';
import { setupComponentTestGenerator } from '../generator';
import { libraryGenerator } from '@nrwl/angular/src/generators/library/library';

describe('cypress test file', () => {
  let tree: Tree;
  const testFilePath = `${LIB_PATH}/test-example.cy-spec.ts`;

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

  it('should create cy-spec file with component mount type when mount type is component', async () => {
    await setupComponentTestGenerator(tree, defaultOptions);
    checkFileContentIsSame(
      tree,
      testFilePath,
      join(__dirname, './expected-files/component-test.txt')
    );
  });

  it('should create cy-spec file with story mount type when mount type is story', async () => {
    await setupComponentTestGenerator(tree, {
      ...defaultOptions,
      mountType: MountType.Story,
    });
    checkFileContentIsSame(
      tree,
      testFilePath,
      join(__dirname, './expected-files/component-story-test.txt')
    );
  });
});
