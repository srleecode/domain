import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createApplicationLayerGenerator } from './generator';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as frontEndSharedMock from '../../../shared';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ApplicationType, getGroupingFolders } from '../../../../shared/utils';
import { CreateApplicationLayerGeneratorSchema } from './schema';

describe('createDomainLayerGenerator', () => {
  let tree: Tree;
  const schema: CreateApplicationLayerGeneratorSchema = {
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

  it('should pass correct parameters to addDomainLibrary', async () => {
    await createApplicationLayerGenerator(tree, schema);
    const groupingFolders = getGroupingFolders(tree, schema.groupingFolder);
    expect(frontEndSharedMock.addDomainLibrary).toHaveBeenCalledWith(
      expect.anything(),
      '',
      'application',
      schema.groupingFolder,
      groupingFolders.app,
      ApplicationType.Angular,
      true,
      schema
    );
  });
  it('should add jest junit reporter config when addJestJunitReporter is true', async () => {
    await createApplicationLayerGenerator(tree, {
      ...schema,
      addJestJunitReporter: true,
    });
    const jestConfig = tree
      .read(`${schema.groupingFolder}/application/jest.config.js`)
      .toString();
    expect(jestConfig).toMatch(
      `reporters: ['default', [ 'jest-junit', { outputDirectory: './test-reports', outputName: "test-app/test-domain/application.xml" } ] ]`
    );
  });
});
