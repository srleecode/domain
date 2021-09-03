import { logger, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import * as setupCtGeneratorMock from '@jscutlery/cypress-angular/src/generators/setup-ct/setup-ct';
import { defaultOptions } from './default-options.constant';
import { setupComponentTestGenerator } from './generator';
import libraryGenerator from '@nrwl/angular/src/generators/library/library';

describe('setupComponentTestGenerator', () => {
  let tree: Tree;

  beforeEach(async () => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    await libraryGenerator(tree, {
      name: 'feature-test-example',
      directory: 'test-app/test-domain',
    }).catch((e) => {
      logger.error(e.message);
      throw e;
    });
    jest.spyOn(setupCtGeneratorMock, 'setupCtGenerator');
  });

  it('should pass correct parameters to @jscutlery/cypress-angular generator', async () => {
    await setupComponentTestGenerator(tree, defaultOptions);
    expect(setupCtGeneratorMock.setupCtGenerator).toHaveBeenCalledWith(
      expect.anything(),
      {
        project: 'test-app-test-domain-feature-test-example',
      }
    );
  });

  it('should add component testing target to project', async () => {
    await setupComponentTestGenerator(tree, defaultOptions);
    const projectConfig = readProjectConfiguration(
      tree,
      'test-app-test-domain-feature-test-example'
    );
    expect(projectConfig.targets['ct']).toEqual({
      executor: '@nrwl/cypress:cypress',
      options: {
        cypressConfig:
          'libs/test-app/test-domain/feature-test-example/cypress.json',
        devServerTarget: '',
        testingType: 'component',
        tsConfig:
          'libs/test-app/test-domain/feature-test-example/tsconfig.cypress.json',
      },
    });
  });

  it('should remove generated cypress test file', async () => {
    jest.spyOn(tree, 'delete');
    await setupComponentTestGenerator(tree, defaultOptions);
    expect(tree.delete).toHaveBeenCalledWith(
      'libs/test-app/test-domain/feature-test-example/src/sample.cy-spec.ts'
    );
  });

  it('should add required cypress support file content', async () => {
    await setupComponentTestGenerator(tree, defaultOptions);
    const projectConfig = readProjectConfiguration(
      tree,
      'test-app-test-domain-feature-test-example'
    );
    const supportFilePath = `${projectConfig.root}/cypress/support/index.ts`;
    const supportFile = tree.read(supportFilePath).toString();
    expect(supportFile).toMatch(`import '@jscutlery/cypress-harness/support';`);
    expect(supportFile).toMatch(`(window as any)['global'] = window;`);
  });
});
