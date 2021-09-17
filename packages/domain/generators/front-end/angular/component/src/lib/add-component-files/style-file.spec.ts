import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { getFilesContents } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';
import { createComponentGenerator } from '../../generator';
import { defaultOptions, LIB_PATH } from '../../default-options.constant';
import { dasherize } from '@nrwl/workspace/src/utils/strings';

describe('style file', () => {
  let tree: Tree;
  const testFilePath = `${LIB_PATH}/${dasherize(
  defaultOptions.name
  )}.component.${defaultOptions.style}`;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });
  it('should be empty when displayBlock is false', async () => {
    await createComponentGenerator(tree, defaultOptions);
    const componentFile = tree.read(testFilePath).toString();
    expect(componentFile).toBe('');
  });

  it('should add display block style when displayBlock is true', async () => {
    await createComponentGenerator(tree, {
      ...defaultOptions,
      displayBlock: true,
    });
    const filesContents = getFilesContents(
      tree,
      testFilePath,
      join(__dirname, './expected-files/display-block-style.txt')
    );
    expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
  });
});
