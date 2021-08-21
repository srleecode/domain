import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createAppGroupingFolderGenerator } from './generator';
import { ApplicationType } from '@srleecode/domain/shared/utils';
import * as initialiseAngularWorkspaceMock from './lib/angular/initialise-angular-workspace';

describe('createAppGroupingFolderGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    jest
      .spyOn(initialiseAngularWorkspaceMock, 'initialiseAngularWorkspace')
      .mockImplementation();
  });

  it('should create directory with language prefixed to name', async () => {
    await createAppGroupingFolderGenerator(tree, {
      name: 'test',
      applicationType: ApplicationType.Angular,
    });
    const fileChanges = tree.listChanges();
    expect(fileChanges[fileChanges.length - 1].path).toBe('libs/ng-test');
  });
  it('should create directory with just name when no language provided', async () => {
    await createAppGroupingFolderGenerator(tree, {
      name: 'test',
    });
    const fileChanges = tree.listChanges();
    expect(fileChanges[fileChanges.length - 1].path).toBe('libs/test');
  });

  describe('initialiseAngularWorkspace', () => {
    it('should initialise angular workspace when language is angular and there is no existing angular app', async () => {
      await createAppGroupingFolderGenerator(tree, {
        name: 'test',
        applicationType: ApplicationType.Angular,
      });
      expect(
        initialiseAngularWorkspaceMock.initialiseAngularWorkspace
      ).toHaveBeenCalled();
    });
    it('should not initialise angular workspace when language is angular and there is an existing angular app', async () => {
      tree.write(`libs/${ApplicationType.Angular}-app`, '');
      await createAppGroupingFolderGenerator(tree, {
        name: 'test',
        applicationType: ApplicationType.Angular,
      });
      expect(
        initialiseAngularWorkspaceMock.initialiseAngularWorkspace
      ).not.toHaveBeenCalled();
    });
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
      await createAppGroupingFolderGenerator(tree, {
        name: 'test',
        applicationType: ApplicationType.Angular,
      });
      const eslint = readJson(tree, '.eslintrc.json');
      expect(
        eslint.overrides[0].rules['@nrwl/nx/enforce-module-boundaries'][1]
          .depConstraints
      ).toEqual([
        {
          onlyDependOnLibsWithTags: [
            'type:application-layer',
            'type:shell',
            'type:feature',
            'type:ui',
            'type:util',
          ],
          sourceTag: 'type:shell',
        },
        {
          onlyDependOnLibsWithTags: [
            'type:application-layer',
            'type:feature',
            'type:ui',
            'type:util',
          ],
          sourceTag: 'type:feature',
        },
        {
          onlyDependOnLibsWithTags: ['type:feature', 'type:ui', 'type:util'],
          sourceTag: 'type:ui',
        },
        {
          onlyDependOnLibsWithTags: [
            'type:application-layer',
            'type:data-access-layer',
            'type:domain-layer',
            'type:util',
          ],
          sourceTag: 'type:application-layer',
        },
        {
          onlyDependOnLibsWithTags: ['type:domain-layer', 'type:util'],
          sourceTag: 'type:domain-layer',
        },
        {
          onlyDependOnLibsWithTags: ['type:data-access-layer', 'type:util'],
          sourceTag: 'type:data-access-layer',
        },
        {
          onlyDependOnLibsWithTags: ['type:util'],
          sourceTag: 'type:util',
        },
      ]);
    });
  });
});
