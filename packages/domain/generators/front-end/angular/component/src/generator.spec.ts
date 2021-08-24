import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as frontEndSharedMock from '../../../shared';
import * as setupComponentTestSpy from '@srleecode/domain/cypress/component-test/angular';
import { defaultOptions } from './default-options.constant';
import { createComponentGenerator } from './generator';
import {
  MountType,
  ElementType,
  ApplicationType,
} from '@srleecode/domain/shared/utils';

describe('createComponentGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(frontEndSharedMock, 'addDomainLibrary');
    jest.spyOn(setupComponentTestSpy, 'setupComponentTestGenerator');
  });

  it('should throw an error if the project already exists', async () => {
    await createComponentGenerator(tree, defaultOptions);
    await expect(
      createComponentGenerator(tree, defaultOptions)
    ).rejects.toThrowError();
  });

  it('should pass correct parameters to addDomainLibrary', async () => {
    await createComponentGenerator(tree, defaultOptions);
    expect(frontEndSharedMock.addDomainLibrary).toHaveBeenCalledWith(
      expect.anything(),
      defaultOptions.name,
      defaultOptions.type,
      defaultOptions.groupingFolder,
      ApplicationType.Angular,
      defaultOptions
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
