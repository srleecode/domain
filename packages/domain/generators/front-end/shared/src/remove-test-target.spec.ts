import { logger, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { removeTestTarget } from './remove-test-target';
import libraryGenerator from '@nrwl/angular/src/generators/library/library';

describe('removeTestTarget', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    await libraryGenerator(tree, {
      name: 'feature-test-example',
      directory: 'test-app/test-domain',
    }).catch((e: Error) => {
      logger.error(e.message);
      logger.error(e.stack);
      throw e;
    });
  });

  it('should remove test target from generated library', async () => {
    const projectName = 'test-app-test-domain-feature-test-example';
    removeTestTarget(tree, projectName);
    const projectConfig = readProjectConfiguration(tree, projectName);
    expect(projectConfig.targets['test']).toBeUndefined();
  });
});
