import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { addComponentFiles } from './add-component-files';
import { defaultOptions } from '../../default-options.constant';
import { checkFileContentIsSame } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';

describe('addComponentFiles - harness', () => {
  let tree: Tree;
  const testFilePath = `${defaultOptions.groupingFolder}/${dasherize(
    defaultOptions.name
  )}.harness.ts`;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });
  it('should create component test harness', () => {
    addComponentFiles(tree, defaultOptions);
    checkFileContentIsSame(
      tree,
      testFilePath,
      join(__dirname, './expected-files/harness.txt')
    );
  });
});
