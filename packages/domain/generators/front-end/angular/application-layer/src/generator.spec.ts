import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createApplicationLayerGenerator } from './generator';
import * as frontEndSharedMock from '@srleecode/domain/front-end/shared';
import { ApplicationType } from '@srleecode/domain/shared/utils';
import { CreateApplicationLayerGeneratorSchema } from './schema';

describe('createDomainLayerGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(frontEndSharedMock, 'addDomainLibrary');
  });

  it('should pass correct parameters to addDomainLibrary', async () => {
    const schema: CreateApplicationLayerGeneratorSchema = {
      groupingFolder: 'libs/test-app/test-domain',
      buildable: true,
      strict: false,
      enableIvy: true,
      publishable: false,
    };
    await createApplicationLayerGenerator(tree, schema);
    expect(frontEndSharedMock.addDomainLibrary).toHaveBeenCalledWith(
      expect.anything(),
      '',
      'application-layer',
      schema.groupingFolder,
      ApplicationType.Angular,
      schema
    );
  });
});
