import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createDataAccessLayerGenerator } from './generator';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as frontEndSharedMock from '../../../shared';
import { CreateDataAccessLayerGeneratorSchema } from './schema';
import { ApplicationType } from '@srleecode/domain/shared/utils';
describe('createDataAccessLayerGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(frontEndSharedMock, 'addDomainLibrary');
  });

  it('should pass correct parameters to @nrwl/angular generator', async () => {
    const schema: CreateDataAccessLayerGeneratorSchema = {
      groupingFolder: 'libs/test-app/test-domain',
      buildable: true,
      strict: false,
      enableIvy: true,
      publishable: false,
    };
    await createDataAccessLayerGenerator(tree, schema);
    expect(frontEndSharedMock.addDomainLibrary).toHaveBeenCalledWith(
      expect.anything(),
      '',
      'data-access-layer',
      schema.groupingFolder,
      ApplicationType.Angular,
      schema
    );
  });
});
