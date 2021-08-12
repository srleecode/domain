import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { checkFileContentIsSame } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';
import { defaultOptions } from '../../default-options.constant';
import { MountType } from '../../model/mount-type.enum';
import { addComponentFiles } from './add-component-files';

describe('addFiles - cypress test', () => {
  let tree: Tree;
  const testFilePath = `${defaultOptions.groupingFolder}/${dasherize(
    defaultOptions.name
  )}.cy-spec.ts`;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should create cy-spec file with component mount type when mount type is component', () => {
    addComponentFiles(tree, defaultOptions);
    checkFileContentIsSame(
      tree,
      testFilePath,
      join(__dirname, './expected-files/component-test.txt')
    );
  });

  it('should create cy-spec file with story mount type when mount type is story', () => {
    addComponentFiles(tree, { ...defaultOptions, mountType: MountType.Story });
    checkFileContentIsSame(
      tree,
      testFilePath,
      join(__dirname, './expected-files/component-story-test.txt')
    );
  });
});
