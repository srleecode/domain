import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { defaultOptions, LIB_PATH } from '../../default-options.constant';
import { checkFileContentIsSame } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';
import { createDirectiveGenerator } from '../../generator';

describe('directive file', () => {
  let tree: Tree;
  const testFilePath = `${LIB_PATH}/${dasherize(
    defaultOptions.name
  )}.directive.ts`;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should create directive file', async () => {
    await createDirectiveGenerator(tree, defaultOptions);
    checkFileContentIsSame(
      tree,
      testFilePath,
      join(__dirname, './expected-files/directive-file.txt')
    );
  });
});
