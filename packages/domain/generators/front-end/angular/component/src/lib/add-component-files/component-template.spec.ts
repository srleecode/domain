import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { createComponentGenerator } from '../../generator';
import { defaultOptions, LIB_PATH } from '../../default-options.constant';
import { checkFileContentIsSame } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';

describe('component template file', () => {
  let tree: Tree;
  const testFilePath = `${LIB_PATH}/${dasherize(
    defaultOptions.name
  )}.component.html`;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });
  it('should create component template file', async () => {
    await createComponentGenerator(tree, defaultOptions);
    checkFileContentIsSame(
      tree,
      testFilePath,
      join(__dirname, './expected-files/component-template.txt')
    );
  });
});
