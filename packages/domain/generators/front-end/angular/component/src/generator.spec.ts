import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import * as libraryGeneratorSpy from '@nrwl/angular/src/generators/library/library';
import * as setupComponentTestSpy from '@srleecode/domain/cypress/component-test/angular';
import { defaultOptions } from './default-options.constant';
import { createComponentGenerator } from './generator';
import { MountType, ElementType } from '@srleecode/domain/shared/utils';

describe('createComponentGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(libraryGeneratorSpy, 'libraryGenerator');
    jest.spyOn(setupComponentTestSpy, 'setupComponentTestGenerator');
  });

  it('should throw an error if the project already exists', async () => {
    await createComponentGenerator(tree, defaultOptions);
    await expect(
      createComponentGenerator(tree, defaultOptions)
    ).rejects.toThrowError();
  });

  it('should pass correct parameters to @nrwl/angular generator', async () => {
    await createComponentGenerator(tree, defaultOptions);
    expect(libraryGeneratorSpy.libraryGenerator).toHaveBeenCalledWith(
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

  it('should pass correct parameters to setupComponentTestGenerator', async () => {
    await createComponentGenerator(tree, defaultOptions);
    expect(
      setupComponentTestSpy.setupComponentTestGenerator
    ).toHaveBeenCalledWith(expect.anything(), {
      name: 'TestExample',
      mountType: MountType.Component,
      projectName: 'test-app-test-domain-feature-test-example',
      selector: 'srlee-test-app-test-domain-feature-test-example',
      type: ElementType.Component,
    });
  });
});
