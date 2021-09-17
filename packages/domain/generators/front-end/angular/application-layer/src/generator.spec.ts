import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createApplicationLayerGenerator } from './generator';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as frontEndSharedMock from '../../../shared';
import {
  ApplicationType,
  getGroupingFolders,
} from '@srleecode/domain/shared/utils';
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
});
