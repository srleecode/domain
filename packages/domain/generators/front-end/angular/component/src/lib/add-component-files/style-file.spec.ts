import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { createComponentGenerator } from '../../generator';
import { defaultOptions, LIB_PATH } from '../../default-options.constant';
import { dasherize } from '@nx/workspace/src/utils/strings';
import { createDummyGroupingFolder } from '@srleecode/domain/shared/test-utils';

describe('style file', () => {
  let tree: Tree;
  const testFilePath = `${LIB_PATH}/${dasherize(
    defaultOptions.name
  )}/${dasherize(defaultOptions.name)}.component.${defaultOptions.style}`;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    createDummyGroupingFolder(tree, defaultOptions.groupingFolder);
  });
  it('should be empty', async () => {
    await createComponentGenerator(tree, defaultOptions);
    const componentFile = tree.read(testFilePath).toString();
    expect(componentFile).toBe('');
  });
});
