import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as frontEndSharedMock from '../../../shared';
import { defaultOptions } from './default-options.constant';
import { createComponentGenerator } from './generator';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  ApplicationType,
  getDasherizedFolderPath,
  getGroupingFolders,
} from '../../../../shared/utils';
import { dasherize } from '@nrwl/workspace/src/utils/strings';

describe('createComponentGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(frontEndSharedMock, 'addDomainLibrary');
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
    const groupingFolders = getGroupingFolders(
      tree,
      defaultOptions.groupingFolder
    );
    expect(frontEndSharedMock.addDomainLibrary).toHaveBeenCalledWith(
      expect.anything(),
      defaultOptions.name,
      defaultOptions.type,
      defaultOptions.groupingFolder,
      groupingFolders.app,
      ApplicationType.Angular,
      false,
      defaultOptions
    );
  });

  it('should set index to component file', async () => {
    await createComponentGenerator(tree, defaultOptions);
    const index = tree
      .read(
        `${defaultOptions.groupingFolder}/feature-test-example/src/index.ts`
      )
      .toString();
    expect(index).toBe(`export * from './lib/test-example.component';`);
  });
  it('should set index to component file when name is empty', async () => {
    await createComponentGenerator(tree, {
      ...defaultOptions,
      name: '',
    });
    const index = tree
      .read(`${defaultOptions.groupingFolder}/feature/src/index.ts`)
      .toString();
    expect(index).toBe(`export * from './lib/feature.component';`);
  });
  it('should add jest junit reporter config when addJestJunitReporter is true', async () => {
    await createComponentGenerator(tree, {
      ...defaultOptions,
      addJestJunitReporter: true,
    });
    const jestConfig = tree
      .read(
        `${defaultOptions.groupingFolder}/feature-test-example/jest.config.js`
      )
      .toString();
    expect(jestConfig).toMatch(
      `reporters: ['default', [ 'jest-junit', { outputDirectory: './test-reports', outputName: "libs/test-app/test-domain/feature-test-example.xml" } ] ]`
    );
  });
});
