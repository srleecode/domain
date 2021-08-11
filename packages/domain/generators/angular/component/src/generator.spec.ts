import { readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import * as libraryGeneratorMock from '@nrwl/angular/src/generators/library/library';
import * as setupCtGeneratorMock from '@jscutlery/cypress-angular/src/generators/setup-ct/setup-ct';
import { defaultOptions } from './default-options.constant';
import { createComponentGenerator } from './generator';

describe('createComponentGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(libraryGeneratorMock, 'libraryGenerator');
    jest.spyOn(setupCtGeneratorMock, 'setupCtGenerator');
  });

  it('should throw an error if the project already exists', async () => {
    await createComponentGenerator(tree, defaultOptions);
    await expect(
      createComponentGenerator(tree, defaultOptions)
    ).rejects.toThrowError();
  });

  it('should pass correct parameters to @nrwl/angular generator', async () => {
    await createComponentGenerator(tree, defaultOptions);
    expect(libraryGeneratorMock.libraryGenerator).toHaveBeenCalledWith(
      expect.anything(),
      {
        buildable: defaultOptions.buildable,
        directory: 'test-app/test-domain',
        enableIvy: defaultOptions.enableIvy,
        importPath: '@proj/test-app/test-domain/feature-test-example',
        name: 'feature-test-example',
        prefix: defaultOptions.prefix,
        publishable: defaultOptions.publishable,
        standaloneConfig: false,
        strict: defaultOptions.strict,
        tags: 'app:test-app,scope:test-app-test-domain,type:feature',
      }
    );
  });

  it('should pass correct parameters to @jscutlery/cypress-angular generator', async () => {
    await createComponentGenerator(tree, defaultOptions);
    expect(setupCtGeneratorMock.setupCtGenerator).toHaveBeenCalledWith(
      expect.anything(),
      {
        project: 'test-app-test-domain-feature-test-example',
      }
    );
  });

  it('should add component testing target to project', async () => {
    await createComponentGenerator(tree, defaultOptions);
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
});
