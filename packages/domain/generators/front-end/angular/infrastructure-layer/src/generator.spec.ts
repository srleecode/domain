import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { createInfrastructureLayerGenerator } from './generator';
// eslint-disable-next-line @nx/enforce-module-boundaries
import * as frontEndSharedMock from '../../../shared';
import { CreateInfrastructureLayerGeneratorSchema } from './schema';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ApplicationType, getGroupingFolders } from '../../../../shared/utils';
import { createDummyGroupingFolder } from '@srleecode/domain/shared/test-utils';
describe('createInfrastructureLayerGenerator', () => {
  let tree: Tree;
  const schema: CreateInfrastructureLayerGeneratorSchema = {
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
    jest.spyOn(frontEndSharedMock, 'addDomainLibrary');
  });

  it('should pass correct parameters to @nx/angular generator', async () => {
    const groupingFolders = getGroupingFolders(tree, schema.groupingFolder);
    await createInfrastructureLayerGenerator(tree, schema);
    expect(frontEndSharedMock.addDomainLibrary).toHaveBeenCalledWith(
      expect.anything(),
      '',
      'infrastructure',
      schema.groupingFolder,
      groupingFolders.app,
      ApplicationType.Angular,
      true,
      schema
    );
  });
  it('should add jest junit reporter config when addJestJunitReporter is true', async () => {
    await createInfrastructureLayerGenerator(tree, {
      ...schema,
      addJestJunitReporter: true,
    });
    const jestConfig = tree
      .read(`${schema.groupingFolder}/infrastructure/jest.config.ts`)
      .toString();
    expect(jestConfig).toMatch('jest-junit');
  });
});
