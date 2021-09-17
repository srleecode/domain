import { readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createDomainLayerGenerator } from './generator';
import { AngularCreateLibrarySchema } from '@srleecode/domain/front-end/shared';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as frontEndSharedMock from '../../../shared';
import { CreateDomainLayerGeneratorSchema } from './schema';
import {
  ApplicationType,
  getGroupingFolders,
} from '@srleecode/domain/shared/utils';

describe('createDomainLayerGenerator', () => {
  let tree: Tree;
  const commonLibraryOptions: AngularCreateLibrarySchema = {
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
    const schema: CreateDomainLayerGeneratorSchema = {
      groupingFolder: 'libs/test-app/test-domain',
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
  it('should remove test target from generated library', async () => {
    await createDomainLayerGenerator(tree, {
      groupingFolder: 'libs/test-app/test-domain',
      ...commonLibraryOptions,
    });
    const projectConfig = readProjectConfiguration(
      tree,
      'test-app-test-domain-domain'
    );
    expect(projectConfig.targets['test']).toBeUndefined();
  });
});
