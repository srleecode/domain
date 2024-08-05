import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { createComponentGenerator } from '../../generator';
import { defaultOptions, LIB_PATH } from '../../default-options.constant';
import {
  createDummyGroupingFolder,
  getFilesContents,
} from '@srleecode/domain/shared/test-utils';
import { join } from 'path';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
jest.mock('prettier', () => null);

describe('component template file', () => {
  let tree: Tree;
  const testFilePath = `${LIB_PATH}/${dasherize(
    defaultOptions.name,
  )}/${dasherize(defaultOptions.name)}.component.html`;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    createDummyGroupingFolder(tree, defaultOptions.groupingFolder);
  });
  it('should create component template file', async () => {
    await createComponentGenerator(tree, defaultOptions);
    const filesContents = getFilesContents(
      tree,
      testFilePath,
      join(__dirname, './expected-files/component-template.txt'),
    );
    expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
  });
});
