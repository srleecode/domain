import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import {
  createDummyGroupingFolder,
  getFilesContents,
} from '@srleecode/domain/shared/test-utils';
import { join } from 'path';
import createComponentGenerator from '../../generator';
import { defaultOptions, LIB_PATH } from '../../default-options.constant';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
jest.mock('prettier', () => null);

describe('stories file', () => {
  let tree: Tree;
  const testFilePath = `${LIB_PATH}/${dasherize(
    defaultOptions.name,
  )}/${dasherize(defaultOptions.name)}.stories.ts`;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    createDummyGroupingFolder(tree, defaultOptions.groupingFolder);
  });

  it('should create stories file ', async () => {
    await createComponentGenerator(tree, defaultOptions);
    const filesContents = getFilesContents(
      tree,
      testFilePath,
      join(__dirname, './expected-files/story.txt'),
    );
    expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
  });
  it('should not create stories file when addStory is false', async () => {
    await createComponentGenerator(tree, {
      ...defaultOptions,
      addStory: false,
    });
    expect(tree.exists(testFilePath)).toBe(false);
  });
});
