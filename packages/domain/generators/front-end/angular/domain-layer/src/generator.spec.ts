import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createDomainLayerGenerator } from './generator';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AngularCreateLibrarySchema } from '../../../shared';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as frontEndSharedMock from '../../../shared';
import { CreateDomainLayerGeneratorSchema } from './schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ApplicationType, getGroupingFolders } from '../../../../shared/utils';

describe('createDomainLayerGenerator', () => {
  let tree: Tree;
  const commonLibraryOptions: AngularCreateLibrarySchema = {
    buildable: true,
    strict: false,
    enableIvy: true,
    publishable: false,
  };
  const groupingFolder = 'libs/test-app/test-domain';
  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(frontEndSharedMock, 'addDomainLibrary');
  });

  it('should pass correct parameters to @nrwl/angular generator', async () => {
    const schema: CreateDomainLayerGeneratorSchema = {
      groupingFolder,
      buildable: true,
      strict: false,
      enableIvy: true,
      publishable: false,
    };
    const groupingFolders = getGroupingFolders(tree, schema.groupingFolder);
    await createDomainLayerGenerator(tree, schema);
    expect(frontEndSharedMock.addDomainLibrary).toHaveBeenCalledWith(
      expect.anything(),
      '',
      'domain',
      schema.groupingFolder,
      groupingFolders.app,
      ApplicationType.Angular,
      true,
      schema
    );
  });
  it('should add jest junit reporter config when addJestJunitReporter is true', async () => {
    await createDomainLayerGenerator(tree, {
      ...commonLibraryOptions,
      groupingFolder,
      addJestJunitReporter: true,
    });
    const jestConfig = tree
      .read(`${groupingFolder}/domain/jest.config.js`)
      .toString();
    expect(jestConfig).toMatch(
      `reporters: ['default', [ 'jest-junit', { outputDirectory: './test-reports', outputName: "libs/test-app/test-domain/domain.xml" } ] ]`
    );
  });
});
