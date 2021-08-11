import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { checkFileContentIsSame } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';
import { defaultOptions } from '../../default-options.constant';
import { MountType } from '../../model/mount-type.enum';
import { addComponentFiles } from './add-component-files';

describe('addFiles - stories file', () => {
  let tree: Tree;
  const testFilePath = `${defaultOptions.groupingFolder}/${dasherize(
    defaultOptions.name
  )}.stories.ts`;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should create stories file when mount type is story', () => {
    addComponentFiles(tree, { ...defaultOptions, mountType: MountType.Story });
    checkFileContentIsSame(
      tree,
      testFilePath,
      join(__dirname, './expected-files/component-story.txt')
    );
  });

  it('should not create stories file when mount type is component', () => {
    addComponentFiles(tree, defaultOptions);
    expect(tree.exists(testFilePath)).toBe(false);
  });
});
