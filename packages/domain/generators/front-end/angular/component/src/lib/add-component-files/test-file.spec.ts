import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { UnitTestType } from '@srleecode/domain/shared/utils';
import { createComponentGenerator } from '../../generator';
import { defaultOptions, LIB_PATH } from '../../default-options.constant';
import { checkFileContentIsSame } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';

describe('test file', () => {
  let tree: Tree;
  const testFilePath = `${LIB_PATH}/${dasherize(
    defaultOptions.name
  )}.component.spec.ts`;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });
  it('should create test bed file when unitTestType is TestBed', async () => {
    await createComponentGenerator(tree, {
      ...defaultOptions,
      unitTestType: UnitTestType.TestBed,
    });
    checkFileContentIsSame(
      tree,
      testFilePath,
      join(__dirname, './expected-files/test-bed-test.txt')
    );
  });
  it('should create test file with no test bed when unitTestType is NoTestBed', async () => {
    await createComponentGenerator(tree, {
      ...defaultOptions,
      unitTestType: UnitTestType.NoTestBed,
    });
    checkFileContentIsSame(
      tree,
      testFilePath,
      join(__dirname, './expected-files/no-test-bed-test.txt')
    );
  });

  it('should not create test file when unitTestType is NoTests', async () => {
    await createComponentGenerator(tree, {
      ...defaultOptions,
      unitTestType: UnitTestType.NoTests,
    });
    expect(tree.exists(testFilePath)).toBe(false);
  });
});
