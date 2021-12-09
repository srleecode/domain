import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
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
  it('should be empty', async () => {
    await createComponentGenerator(tree, defaultOptions);
    const componentFile = tree.read(testFilePath).toString();
    expect(componentFile).toBe('');
  });
});
