import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createDirectiveGenerator } from './generator';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as frontEndSharedMock from '../../../shared';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as setupComponentTestSpy from '../../../../cypress/component-test/angular/src/generator';
import { defaultOptions } from './default-options.constant';
import {
  ApplicationType,
  ElementType,
  getDasherizedFolderPath,
  getGroupingFolders,
  MountType,
} from '@srleecode/domain/shared/utils';
import { dasherize } from '@nrwl/workspace/src/utils/strings';

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
    const groupingFolders = getGroupingFolders(
      tree,
      defaultOptions.groupingFolder
    );
    expect(frontEndSharedMock.addDomainLibrary).toHaveBeenCalledWith(
      expect.anything(),
      defaultOptions.name,
      'directive',
      defaultOptions.groupingFolder,
      groupingFolders.app,
      ApplicationType.Angular,
      false,
      defaultOptions
    );
  });

  it('should remove module created by angular library generator', async () => {
    await createDirectiveGenerator(tree, defaultOptions);
    const libraryName = dasherize(defaultOptions.name);
    const fileName = `${getDasherizedFolderPath(
      tree,
      defaultOptions.groupingFolder
    )}-${libraryName}.module.ts`;
    const filePath = `${defaultOptions.groupingFolder}/src/lib/${fileName}`;
    expect(tree.exists(filePath)).toBe(false);
  });

  it('should pass correct parameters to setupComponentTestGenerator', async () => {
    await createDirectiveGenerator(tree, {
      ...defaultOptions,
      mountType: MountType.Component,
    });
    const groupingFolders = getGroupingFolders(
      tree,
      defaultOptions.groupingFolder
    );
    expect(
      setupComponentTestSpy.setupComponentTestGenerator
    ).toHaveBeenCalledWith(expect.anything(), {
      name: 'TestExample',
      mountType: MountType.Component,
      prefix: groupingFolders.app,
      projectName: 'test-app-test-domain-directive-test-example',
      selector: 'testAppTestDomainDirectiveTestExample',
      type: ElementType.Directive,
    });
  });

  it('should set index to directive file', async () => {
    await createDirectiveGenerator(tree, defaultOptions);
    const index = tree
      .read(
        `${defaultOptions.groupingFolder}/directive-test-example/src/index.ts`
      )
      .toString();
    expect(index).toBe(`export * from './lib/test-example.directive';`);
  });
});
