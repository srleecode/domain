import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { getFilesContents } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';
import { createDirectiveGenerator } from '../../generator';
import { defaultOptions, LIB_PATH } from '../../default-options.constant';
import { dasherize } from '@nrwl/workspace/src/utils/strings';

describe('stories file', () => {
  let tree: Tree;
  const testFilePath = `${LIB_PATH}/${dasherize(
    defaultOptions.name
  )}.stories.ts`;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should create stories file ', async () => {
    await createDirectiveGenerator(tree, defaultOptions);
    const filesContents = getFilesContents(
      tree,
      testFilePath,
      join(__dirname, './expected-files/story.txt')
    );
    expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
  });
});
