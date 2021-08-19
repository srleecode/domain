import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createDirectiveGenerator } from './generator';
import { CreateLibrarySchema } from '@srleecode/domain/angular/shared';
import * as libraryGeneratorMock from '@nrwl/angular/src/generators/library/library';
import * as setupComponentTestSpy from '@srleecode/domain/cypress/component-test/angular';
import { defaultOptions } from './default-options.constant';
import { ElementType, MountType } from '@srleecode/domain/shared/utils';

describe('createDirectiveGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(libraryGeneratorMock, 'libraryGenerator');
    jest.spyOn(setupComponentTestSpy, 'setupComponentTestGenerator');
  });

  it('should pass correct parameters to @nrwl/angular generator', async () => {
    const commonLibraryOptions: CreateLibrarySchema = {
      buildable: true,
      strict: false,
      enableIvy: true,
      publishable: false,
    };
    await createDirectiveGenerator(tree, {
      ...defaultOptions,
    });
    expect(libraryGeneratorMock.libraryGenerator).toHaveBeenCalledWith(
      expect.anything(),
      {
        directory: 'test-app/test-domain',
        importPath: '@proj/test-app/test-domain/directive-test-example',
        name: 'directive-test-example',
        tags: 'app:test-app,scope:test-app-test-domain,type:directive',
        buildable: defaultOptions.buildable,
        enableIvy: defaultOptions.enableIvy,
        prefix: defaultOptions.prefix,
        publishable: defaultOptions.publishable,
        standaloneConfig: false,
        strict: defaultOptions.strict,
        ...commonLibraryOptions,
      }
    );
  });

  it('should pass correct parameters to setupComponentTestGenerator', async () => {
    await createDirectiveGenerator(tree, {
      ...defaultOptions,
    });
    expect(
      setupComponentTestSpy.setupComponentTestGenerator
    ).toHaveBeenCalledWith(expect.anything(), {
      name: 'TestExample',
      mountType: MountType.Component,
      projectName: 'test-app-test-domain-directive-test-example',
      selector: 'srleeTestAppTestDomainDirectiveTestExample',
      type: ElementType.Component,
    });
  });
});
