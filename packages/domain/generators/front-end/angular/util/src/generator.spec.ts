import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createUtilGenerator } from './generator';
import * as frontEndSharedMock from '@srleecode/domain/front-end/shared';
import { CreateUtilGeneratorSchema } from './schema';
import { ApplicationType } from '@srleecode/domain/shared/utils';

describe('createUtilGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(frontEndSharedMock, 'addDomainLibrary');
  });

  it('should pass correct parameters to @nrwl/angular generator', async () => {
    const schema: CreateUtilGeneratorSchema = {
      groupingFolder: 'libs/test-app/test-domain',
      buildable: true,
      strict: false,
      enableIvy: true,
      publishable: false,
    };
    await createUtilGenerator(tree, schema);
    expect(frontEndSharedMock.addDomainLibrary).toHaveBeenCalledWith(
      expect.anything(),
      '',
      'util',
      schema.groupingFolder,
      ApplicationType.Angular,
      schema
    );
  });
});
