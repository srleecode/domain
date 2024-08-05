import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { defaultOptions, LIB_PATH } from '../../default-options.constant';
import {
  createDummyGroupingFolder,
  getFilesContents,
} from '@srleecode/domain/shared/test-utils';
import { join } from 'path';
import { createDirectiveGenerator } from '../../generator';
jest.mock('prettier', () => null);

describe('directive file', () => {
  let tree: Tree;
  const testFilePath = `${LIB_PATH}/${dasherize(
    defaultOptions.name,
  )}/${dasherize(defaultOptions.name)}.directive.ts`;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    createDummyGroupingFolder(tree, defaultOptions.groupingFolder);
  });

  it('should create directive file', async () => {
    await createDirectiveGenerator(tree, defaultOptions);
    const filesContents = getFilesContents(
      tree,
      testFilePath,
      join(__dirname, './expected-files/directive-file.txt'),
    );
    expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
  });

  it('should include only prefix and directive name when passing in prefix', async () => {
    await createDirectiveGenerator(tree, {
      ...defaultOptions,
      prefix: 'prefix',
    });
    const filesContents = getFilesContents(
      tree,
      testFilePath,
      join(__dirname, './expected-files/directive-file.txt'),
    );
    expect(filesContents.treeFile).toMatch(`selector:'[prefixTestExample]'`);
  });
});
