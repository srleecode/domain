import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as frontEndSharedMock from '../../../shared';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as setupComponentTestSpy from '../../../../cypress/component-test/angular/src/generator';
import { defaultOptions } from './default-options.constant';
import { createComponentGenerator } from './generator';
import {
  MountType,
  ElementType,
  ApplicationType,
  getDasherizedFolderPath,
} from '@srleecode/domain/shared/utils';
import { dasherize } from '@nrwl/workspace/src/utils/strings';

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

  it('should remove module created by angular library generator', async () => {
    await createComponentGenerator(tree, defaultOptions);
    const libraryName = dasherize(defaultOptions.name);
    const fileName = `${getDasherizedFolderPath(
      tree,
      defaultOptions.groupingFolder
    )}-${libraryName}.module.ts`;
    const filePath = `${defaultOptions.groupingFolder}/src/lib/${fileName}`;
    expect(tree.exists(filePath)).toBe(false);
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

  it('should set index to component file', async () => {
    await createComponentGenerator(tree, defaultOptions);
    const index = tree
      .read(
        `${defaultOptions.groupingFolder}/feature-test-example/src/index.ts`
      )
      .toString();
    expect(index).toBe(`export * from './lib/test-example.component.ts';`);
  });
});
