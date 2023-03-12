import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createAppGroupingFolderGenerator } from './generator';
import * as initialiseAngularWorkspaceMock from './lib/angular/initialise-angular-workspace';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ApplicationType, DepConstraint } from '../../../shared/utils';

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
      const expected: DepConstraint[] = [
        {
          notDependOnLibsWithTags: [],
          onlyDependOnLibsWithTags: [
            'type:application',
            'type:domain',
            'type:presentation',
            'type:util',
          ],
          sourceTag: 'type:presentation',
        },
        {
          notDependOnLibsWithTags: [],
          onlyDependOnLibsWithTags: [
            'type:application',
            'type:data-access',
            'type:domain',
            'type:util',
          ],
          sourceTag: 'type:application',
        },
        {
          notDependOnLibsWithTags: [],
          onlyDependOnLibsWithTags: ['type:domain'],
          sourceTag: 'type:domain',
        },
        {
          notDependOnLibsWithTags: [],
          onlyDependOnLibsWithTags: [
            'type:data-access',
            'type:domain',
            'type:util',
          ],
          sourceTag: 'type:data-access',
        },
        {
          notDependOnLibsWithTags: [],
          onlyDependOnLibsWithTags: ['type:domain', 'type:util'],
          sourceTag: 'type:util',
        },
      ];
      expect(
        eslint.overrides[0].rules['@nrwl/nx/enforce-module-boundaries'][1]
          .depConstraints
      ).toEqual(expected);
    });
  });
});
