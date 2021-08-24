import { readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createDomainLayerGenerator } from './generator';
import { AngularCreateLibrarySchema } from '@srleecode/domain/front-end/shared';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as frontEndSharedMock from '../../../shared';
import { CreateDomainLayerGeneratorSchema } from './schema';
import { ApplicationType } from '@srleecode/domain/shared/utils';

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
    await createDomainLayerGenerator(tree, schema);
    expect(frontEndSharedMock.addDomainLibrary).toHaveBeenCalledWith(
      expect.anything(),
      '',
      'domain-layer',
      schema.groupingFolder,
      ApplicationType.Angular,
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
      'test-app-test-domain-domain-layer'
    );
    expect(projectConfig.targets['test']).toBeUndefined();
  });
});
