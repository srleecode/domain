import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createDataAccessLayerGenerator } from './generator';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as frontEndSharedMock from '../../../shared';
import { CreateDataAccessLayerGeneratorSchema } from './schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ApplicationType, getGroupingFolders } from '../../../../shared/utils';
describe('createDataAccessLayerGenerator', () => {
  let tree: Tree;
  const schema: CreateDataAccessLayerGeneratorSchema = {
    groupingFolder: 'libs/test-app/test-domain',
    buildable: true,
    strict: false,
    enableIvy: true,
    publishable: false,
  };
  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(frontEndSharedMock, 'addDomainLibrary');
  });

  it('should pass correct parameters to @nrwl/angular generator', async () => {
    const groupingFolders = getGroupingFolders(tree, schema.groupingFolder);
    await createDataAccessLayerGenerator(tree, schema);
    expect(frontEndSharedMock.addDomainLibrary).toHaveBeenCalledWith(
      expect.anything(),
      '',
      'data-access',
      schema.groupingFolder,
      groupingFolders.app,
      ApplicationType.Angular,
      true,
      schema
    );
  });
  it('should add jest junit reporter config when addJestJunitReporter is true', async () => {
    await createDataAccessLayerGenerator(tree, {
      ...schema,
      addJestJunitReporter: true,
    });
    const jestConfig = tree
      .read(`${schema.groupingFolder}/data-access/jest.config.ts`)
      .toString();
    expect(jestConfig).toMatch(
      `reporters: ['default', [ 'jest-junit', { outputDirectory: './test-reports', outputName: "test-app/test-domain/data-access.xml" } ] ]`
    );
  });
});
