import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readJson } from '@nrwl/devkit';
import { updateDepConstraint } from './update-dep-contraint';
import { DepConstraint } from '@nrwl/workspace/src/utils/runtime-lint-utils';

describe('updateDepConstraint', () => {
  let appTree: Tree;

  const addDependency = () => {
    updateDepConstraint(appTree, (depConstraints) => {
      depConstraints.push({
        sourceTag: 'type:domain',
        notDependOnLibsWithTags: [],
        onlyDependOnLibsWithTags: ['type:util'],
      });
    });
  };

  describe('eslintrc.json', () => {
    beforeEach(() => {
      appTree = createTreeWithEmptyWorkspace();
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
                  depConstraints: [
                    { sourceTag: '*', onlyDependOnLibsWithTags: ['*'] },
                  ],
                },
              ],
            },
          },
        ],
      };
      appTree.write('.eslintrc.json', JSON.stringify(json));
    });

    it('should add dependency constraints if it doesnt exist in eslintrc.json', () => {
      addDependency();
      const eslint = readJson(appTree, '.eslintrc.json');
      const expected: DepConstraint = {
        notDependOnLibsWithTags: [],
        onlyDependOnLibsWithTags: ['type:util'],
        sourceTag: 'type:domain',
      };
      expect(
        eslint.overrides[0].rules['@nrwl/nx/enforce-module-boundaries'][1]
          .depConstraints[1]
      ).toEqual(expected);
    });

    it('should not add dependency constraint if it already exists in eslintrc.json', () => {
      addDependency();
      addDependency();
      const eslint = readJson(appTree, '.eslintrc.json');
      const expected: DepConstraint[] = [
        {
          notDependOnLibsWithTags: [],
          onlyDependOnLibsWithTags: ['*'],
          sourceTag: '*',
        },
        {
          notDependOnLibsWithTags: [],
          onlyDependOnLibsWithTags: ['type:util'],
          sourceTag: 'type:domain',
        },
      ];
      expect(
        eslint.overrides[0].rules['@nrwl/nx/enforce-module-boundaries'][1]
          .depConstraints
      ).toEqual(expected);
    });

    it('should add to existing source tag when depConstraint already exists in eslintrc.json', () => {
      addDependency();
      updateDepConstraint(appTree, (depConstraints) => {
        depConstraints.push({
          sourceTag: 'type:domain',
          notDependOnLibsWithTags: [],
          onlyDependOnLibsWithTags: ['type:domain'],
        });
      });
      const eslint = readJson(appTree, '.eslintrc.json');
      const expected: DepConstraint[] = [
        {
          notDependOnLibsWithTags: [],
          onlyDependOnLibsWithTags: ['*'],
          sourceTag: '*',
        },
        {
          notDependOnLibsWithTags: [],
          onlyDependOnLibsWithTags: ['type:util', 'type:domain'],
          sourceTag: 'type:domain',
        },
      ];
      expect(
        eslint.overrides[0].rules['@nrwl/nx/enforce-module-boundaries'][1]
          .depConstraints
      ).toEqual(expected);
    });
  });
  describe('tslint', () => {
    beforeEach(() => {
      appTree = createTreeWithEmptyWorkspace();
      const json = {
        rulesDirectory: [
          'node_modules/@nrwl/workspace/src/tslint',
          'node_modules/codelyzer',
        ],
        rules: {
          'variable-name': false,
          'ordered-imports': true,
          'nx-enforce-module-boundaries': [
            true,
            {
              allow: ['@nx-example/shared/product/data/testing'],
              depConstraints: [
                {
                  sourceTag: 'type:types',
                  onlyDependOnLibsWithTags: ['type:types'],
                },
                {
                  sourceTag: 'type:state',
                  onlyDependOnLibsWithTags: [
                    'type:state',
                    'type:types',
                    'type:data',
                  ],
                },
              ],
              enforceBuildableLibDependency: true,
            },
          ],
          'directive-selector': [true, 'attribute', 'app', 'camelCase'],
        },
      };
      appTree.write('tslint.json', JSON.stringify(json));
    });

    it('should update dependency constraints in tslint.json', () => {
      addDependency();
      const tslint = readJson(appTree, 'tslint.json');
      const expected: DepConstraint = {
        notDependOnLibsWithTags: [],
        onlyDependOnLibsWithTags: ['type:util'],
        sourceTag: 'type:domain',
      };
      expect(
        tslint.rules['nx-enforce-module-boundaries'][1].depConstraints[2]
      ).toEqual(expected);
    });

    it('should replace dependency constraint if it already exists in tslint.json', () => {
      addDependency();
      addDependency();
      const tslint = readJson(appTree, 'tslint.json');
      expect(
        tslint.rules['nx-enforce-module-boundaries'][1].depConstraints[3]
      ).toBeUndefined();
    });
  });
});
