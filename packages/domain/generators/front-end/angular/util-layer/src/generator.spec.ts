import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createUtilGenerator } from './generator';
import { CreateUtilGeneratorSchema } from './schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { getGroupingFolders, ApplicationType } from '../../../../shared/utils';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as mock from '../../../shared';

describe('createUtilGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(mock, 'addDomainLibrary');
  });

  it('should pass correct parameters to @nrwl/angular generator', async () => {
    const schema: CreateUtilGeneratorSchema = {
      groupingFolder: 'libs/test-app/test-domain',
      buildable: true,
      strict: false,
      enableIvy: true,
      publishable: false,
    };
    const groupingFolders = getGroupingFolders(tree, schema.groupingFolder);
    await createUtilGenerator(tree, schema);
    expect(mock.addDomainLibrary).toHaveBeenCalledWith(
      expect.anything(),
      '',
      'util',
      schema.groupingFolder,
      groupingFolders.app,
      ApplicationType.Angular,
      true,
      schema
    );
  });
});
