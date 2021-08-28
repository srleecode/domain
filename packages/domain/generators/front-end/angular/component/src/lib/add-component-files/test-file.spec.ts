import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { UnitTestType } from '@srleecode/domain/shared/utils';
import { createComponentGenerator } from '../../generator';
import { defaultOptions, LIB_PATH } from '../../default-options.constant';
import { getFilesContents } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';
import { getLibraryName } from '@srleecode/domain/front-end/shared';

describe('test file', () => {
  let tree: Tree;
  const testFilePath = `${LIB_PATH}/${getLibraryName(
    { name: defaultOptions.name,
      type: defaultOptions.type}
  )}.component.spec.ts`;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });
  it('should create test bed file when unitTestType is TestBed', async () => {
    await createComponentGenerator(tree, {
      ...defaultOptions,
      unitTestType: UnitTestType.TestBed,
    });
    const filesContents = getFilesContents(
      tree,
      testFilePath,
      join(__dirname, './expected-files/test-bed-test.txt')
    );
    expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
  });
  it('should create test file with no test bed when unitTestType is NoTestBed', async () => {
    await createComponentGenerator(tree, {
      ...defaultOptions,
      unitTestType: UnitTestType.NoTestBed,
    });
    const filesContents = getFilesContents(
      tree,
      testFilePath,
      join(__dirname, './expected-files/no-test-bed-test.txt')
    );
    expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
  });

  it('should not create test file when unitTestType is NoTests', async () => {
    await createComponentGenerator(tree, {
      ...defaultOptions,
      unitTestType: UnitTestType.NoTests,
    });
    expect(tree.exists(testFilePath)).toBe(false);
  });
});
