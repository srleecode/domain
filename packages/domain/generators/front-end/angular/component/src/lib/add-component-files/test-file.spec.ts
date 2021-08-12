import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { UnitTestType } from '../../model/unit-test-type.enum';
import { addComponentFiles } from './add-component-files';
import { defaultOptions } from '../../default-options.constant';
import { checkFileContentIsSame } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';

describe('addComponentFiles - test file', () => {
  let tree: Tree;
  const testFilePath = `${defaultOptions.groupingFolder}/${dasherize(
    defaultOptions.name
  )}.component.spec.ts`;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });
  it('should create test bed file when unitTestType is TestBed', () => {
    addComponentFiles(tree, {
      ...defaultOptions,
      unitTestType: UnitTestType.TestBed,
    });
    checkFileContentIsSame(
      tree,
      testFilePath,
      join(__dirname, './expected-files/test-bed-test.txt')
    );
  });
  it('should create test file with no test bed when unitTestType is NoTestBed', () => {
    addComponentFiles(tree, {
      ...defaultOptions,
      unitTestType: UnitTestType.NoTestBed,
    });
    checkFileContentIsSame(
      tree,
      testFilePath,
      join(__dirname, './expected-files/no-test-bed-test.txt')
    );
  });
});
