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
            'type:application',
            'type:shell',
            'type:directive',
            'type:feature',
            'type:ui',
            'type:util',
          ],
          sourceTag: 'type:shell',
        },
        {
          onlyDependOnLibsWithTags: [
            'type:application',
            'type:feature',
            'type:directive',
            'type:ui',
            'type:util',
          ],
          sourceTag: 'type:feature',
        },
        {
          onlyDependOnLibsWithTags: [
            'type:feature',
            'type:directive',
            'type:ui',
            'type:util',
          ],
          sourceTag: 'type:ui',
        },
        {
          onlyDependOnLibsWithTags: [
            'type:application',
            'type:directive',
            'type:util',
          ],
          sourceTag: 'type:directive',
        },
        {
          onlyDependOnLibsWithTags: [
            'type:application',
            'type:data-access',
            'type:domain',
            'type:util',
          ],
          sourceTag: 'type:application',
        },
        {
          onlyDependOnLibsWithTags: ['type:domain', 'type:util'],
          sourceTag: 'type:domain',
        },
        {
          onlyDependOnLibsWithTags: [
            'type:data-access',
            'type:domain',
            'type:util',
          ],
          sourceTag: 'type:data-access',
        },
        {
          onlyDependOnLibsWithTags: ['type:util'],
          sourceTag: 'type:util',
        },
      ]);
    });
  });
});
