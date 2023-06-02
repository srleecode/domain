import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createUtilGenerator } from './generator';
import { CreateUtilGeneratorSchema } from './schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { getGroupingFolders, ApplicationType } from '../../../../shared/utils';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as mock from '../../../shared';
import { createDummyGroupingFolder } from '@srleecode/domain/shared/test-utils';

describe('createUtilGenerator', () => {
  let tree: Tree;
  const schema: CreateUtilGeneratorSchema = {
    groupingFolder: 'libs/test-app/test-domain',
    buildable: true,
    strict: false,
    enableIvy: true,
    publishable: false,
  };
  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    createDummyGroupingFolder(tree, schema.groupingFolder);
    jest.spyOn(mock, 'addDomainLibrary');
  });

  it('should pass correct parameters to @nrwl/angular generator', async () => {
    const groupingFolders = getGroupingFolders(tree, schema.groupingFolder);
    await createUtilGenerator(tree, schema);
    expect(mock.addDomainLibrary).toHaveBeenCalledWith(
      expect.anything(),
      '',
      'util',
      schema.groupingFolder,
      groupingFolders.app,
      ApplicationType.Angular,
      true,
      schema
    );
  });
  it('should add jest junit reporter config when addJestJunitReporter is true', async () => {
    await createUtilGenerator(tree, {
      ...schema,
      addJestJunitReporter: true,
    });
    const jestConfig = tree
      .read(`${schema.groupingFolder}/util/jest.config.ts`)
      .toString();
    expect(jestConfig).toMatch(
      `reporters: ['default', [ 'jest-junit', { outputDirectory: './test-reports', outputName: "test-app-test-domain-util.xml" } ] ]`
    );
  });
});
