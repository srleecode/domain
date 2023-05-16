import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createPresentationLayerGenerator } from './generator';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AngularCreateLibrarySchema } from '../../../shared';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as frontEndSharedMock from '../../../shared';
import { CreatePresentationLayerGeneratorSchema } from './schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  ApplicationType,
  getDasherizedFolderPath,
  getGroupingFolders,
} from '../../../../shared/utils';
import { readJson, Tree } from '@nrwl/devkit';

describe('createPresentationLayerGenerator', () => {
  let tree: Tree;
  const commonLibraryOptions: AngularCreateLibrarySchema = {
    buildable: true,
    strict: false,
    enableIvy: true,
    publishable: false,
  };
  const groupingFolder = 'libs/test-app/test-domain';
  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(frontEndSharedMock, 'addDomainLibrary');
  });

  it('should convert module to shell module', async () => {
    await createPresentationLayerGenerator(tree, {
      ...commonLibraryOptions,
      groupingFolder,
      addJestJunitReporter: true,
    });
    const fileName = `${getDasherizedFolderPath(
      tree,
      groupingFolder
    )}-shell.module.ts`;
    const filePath = `${groupingFolder}/presentation/src/lib/${fileName}`;
    expect(tree.read(filePath).toString()).toMatch(
      'TestAppTestDomainShellModule'
    );
  });

  it('should pass correct parameters to @nrwl/angular generator', async () => {
    const schema: CreatePresentationLayerGeneratorSchema = {
      groupingFolder,
      buildable: true,
      strict: false,
      enableIvy: true,
      publishable: false,
    };
    const groupingFolders = getGroupingFolders(tree, schema.groupingFolder);
    await createPresentationLayerGenerator(tree, schema);
    expect(frontEndSharedMock.addDomainLibrary).toHaveBeenCalledWith(
      expect.anything(),
      '',
      'presentation',
      schema.groupingFolder,
      groupingFolders.app,
      ApplicationType.Angular,
      false,
      schema
    );
  });
  it('should add jest junit reporter config when addJestJunitReporter is true', async () => {
    await createPresentationLayerGenerator(tree, {
      ...commonLibraryOptions,
      groupingFolder,
      addJestJunitReporter: true,
    });
    const jestConfig = tree
      .read(`${groupingFolder}/presentation/jest.config.ts`)
      .toString();
    expect(jestConfig).toMatch(
      `reporters: ['default', [ 'jest-junit', { outputDirectory: './test-reports', outputName: "test-app-test-domain-presentation.xml" } ] ]`
    );
  });
  it('should add prefix to eslint selector rules', async () => {
    const prefix = 'test';
    await createPresentationLayerGenerator(tree, {
      ...commonLibraryOptions,
      groupingFolder,
      prefix,
    });
    const eslint = JSON.parse(
      tree.read(`${groupingFolder}/presentation/.eslintrc.json`).toString()
    );
    expect(
      eslint.overrides[0].rules['@angular-eslint/component-selector'][1].prefix
    ).toBe(prefix);
    expect(
      eslint.overrides[0].rules['@angular-eslint/directive-selector'][1].prefix
    ).toBe(prefix);
  });

  describe('eslint layer rules', () => {
    beforeEach(() => {
      const json = {
        root: true,
        ignorePatterns: ['**/*'],
        plugins: ['@nrwl/nx'],
        overrides: [
          {
            files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
            rules: {
              '@nrwl/nx/enforce-module-boundaries': [
                'error',
                {
                  enforceBuildableLibDependency: true,
                  allow: [],
                  depConstraints: [],
                },
              ],
            },
          },
        ],
      };
      tree.write('.eslintrc.json', JSON.stringify(json));
    });

    it('should add layer dependency constraints in eslintrc.json', async () => {
      await createPresentationLayerGenerator(tree, {
        ...commonLibraryOptions,
        groupingFolder,
      });
      const eslint = readJson(tree, '.eslintrc.json');
      expect(
        eslint.overrides[0].rules[
          '@nrwl/nx/enforce-module-boundaries'
        ][1].depConstraints.find((c) => c.sourceTag === 'type:presentation')
      ).toEqual({
        notDependOnLibsWithTags: [],
        onlyDependOnLibsWithTags: [
          'type:application',
          'type:domain',
          'type:presentation',
          'type:util',
        ],
        sourceTag: 'type:presentation',
      });
    });
  });
});
