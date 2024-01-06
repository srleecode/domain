import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { createUtilGenerator } from './generator';
import { CreateUtilGeneratorSchema } from './schema';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { getGroupingFolders, ApplicationType } from '../../../../shared/utils';
// eslint-disable-next-line @nx/enforce-module-boundaries
import * as mock from '../../../shared';
import { createDummyGroupingFolder } from '@srleecode/domain/shared/test-utils';

describe('createUtilGenerator', () => {
  let tree: Tree;
  const schema: CreateUtilGeneratorSchema = {
    groupingFolder: 'libs/test-app/test-domain/',
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

  it('should pass correct parameters to @nx/angular generator', async () => {
    const groupingFolders = getGroupingFolders(tree, schema.groupingFolder);
    await createUtilGenerator(tree, schema);
    expect(mock.addDomainLibrary).toHaveBeenCalledWith(
      expect.anything(),
      '',
      'util',
      'libs/test-app/test-domain',
      groupingFolders.app,
      ApplicationType.Angular,
      true,
      schema,
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
    expect(jestConfig).toMatch('jest-junit');
  });
});
