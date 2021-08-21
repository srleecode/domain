import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createDirectiveGenerator } from './generator';
import * as frontEndSharedMock from '@srleecode/domain/front-end/shared';
import * as setupComponentTestSpy from '@srleecode/domain/cypress/component-test/angular';
import { defaultOptions } from './default-options.constant';
import {
  ApplicationType,
  ElementType,
  MountType,
} from '@srleecode/domain/shared/utils';

describe('createDirectiveGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(frontEndSharedMock, 'addDomainLibrary');
    jest.spyOn(setupComponentTestSpy, 'setupComponentTestGenerator');
  });

  it('should pass correct parameters to addDomainLibrary', async () => {
    await createDirectiveGenerator(tree, defaultOptions);
    expect(frontEndSharedMock.addDomainLibrary).toHaveBeenCalledWith(
      expect.anything(),
      defaultOptions.name,
      'directive',
      defaultOptions.groupingFolder,
      ApplicationType.Angular,
      defaultOptions
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
