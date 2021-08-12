import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createDataAccessGenerator } from './generator';
import { CreateLibrarySchema } from '@srleecode/domain/angular/shared';
import * as libraryGeneratorMock from '@nrwl/angular/src/generators/library/library';

describe('createDataAccessGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(libraryGeneratorMock, 'libraryGenerator');
  });

  it('should pass correct parameters to @nrwl/angular generator', async () => {
    const commonLibraryOptions: CreateLibrarySchema = {
      buildable: true,
      strict: false,
      enableIvy: true,
      publishable: false,
    };
    await createDataAccessGenerator(tree, {
      groupingFolder: 'libs/test-app/test-domain',
      ...commonLibraryOptions,
    });
    expect(libraryGeneratorMock.libraryGenerator).toHaveBeenCalledWith(
      expect.anything(),
      {
        directory: 'test-app/test-domain',
        importPath: '@proj/test-app/test-domain/data-access',
        name: 'data-access',
        standaloneConfig: false,
        tags: 'app:test-app,scope:test-app-test-domain,type:data-access',
        ...commonLibraryOptions,
      }
    );
  });
});
