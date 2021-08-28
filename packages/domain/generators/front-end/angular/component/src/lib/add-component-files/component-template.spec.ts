import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createComponentGenerator } from '../../generator';
import { defaultOptions, LIB_PATH } from '../../default-options.constant';
import { getFilesContents } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';
import { getLibraryName } from '@srleecode/domain/front-end/shared';

describe('component template file', () => {
  let tree: Tree;
  const testFilePath = `${LIB_PATH}/${getLibraryName(
    { name: defaultOptions.name,
      type: defaultOptions.type}
  )}.component.html`;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });
  it('should create component template file', async () => {
    await createComponentGenerator(tree, defaultOptions);
    const filesContents = getFilesContents(
      tree,
      testFilePath,
      join(__dirname, './expected-files/component-template.txt')
    );
    expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
  });
});
