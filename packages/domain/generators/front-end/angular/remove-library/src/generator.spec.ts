import { logger, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import * as nrwlWorkspaceMock from '@nx/workspace';
import { removeLibraryGenerator } from './generator';
import { libraryGenerator } from '@nx/angular/generators';
jest.mock('prettier', () => null);

describe('removeLibraryGenerator', () => {
  let tree: Tree;

  beforeEach(async () => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    await libraryGenerator(tree, {
      name: 'feature-test-example',
      directory: 'test-app/test-domain',
    }).catch((e: Error) => {
      logger.error(e.message);
      logger.error(e.stack);
      throw e;
    });
    jest.spyOn(nrwlWorkspaceMock, 'removeGenerator');
  });

  it('should pass correct parameters to @nx/workspace:remove generator', async () => {
    await removeLibraryGenerator(tree, {
      libraryFolder: 'libs/test-app/test-domain/feature-test-example/',
    });
    expect(nrwlWorkspaceMock.removeGenerator).toHaveBeenCalledWith(
      expect.anything(),
      {
        forceRemove: true,
        projectName: 'test-app-test-domain-feature-test-example',
        skipFormat: false,
      },
    );
  });
});
