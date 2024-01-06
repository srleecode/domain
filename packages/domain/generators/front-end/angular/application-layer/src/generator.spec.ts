import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { createApplicationLayerGenerator } from './generator';
// eslint-disable-next-line @nx/enforce-module-boundaries
import * as frontEndSharedMock from '../../../shared';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ApplicationType, getGroupingFolders } from '../../../../shared/utils';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { createDummyGroupingFolder } from '../../../../shared/test-utils';
import { CreateApplicationLayerGeneratorSchema } from './schema';

describe('createApplicationLayerGenerator', () => {
  let tree: Tree;
  const schema: CreateApplicationLayerGeneratorSchema = {
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
    jest.spyOn(frontEndSharedMock, 'addDomainLibrary');
  });

  it('should pass correct parameters to addDomainLibrary', async () => {
    await createApplicationLayerGenerator(tree, schema);
    const groupingFolders = getGroupingFolders(tree, schema.groupingFolder);
    expect(frontEndSharedMock.addDomainLibrary).toHaveBeenCalledWith(
      expect.anything(),
      '',
      'application',
      'libs/test-app/test-domain',
      groupingFolders.app,
      ApplicationType.Angular,
      true,
      schema,
    );
  });
  it('should add jest junit reporter config when addJestJunitReporter is true', async () => {
    await createApplicationLayerGenerator(tree, {
      ...schema,
      addJestJunitReporter: true,
    });
    const jestConfig = tree
      .read(`${schema.groupingFolder}/application/jest.config.ts`)
      .toString();
    expect(jestConfig).toMatch('jest-junit');
  });
});
