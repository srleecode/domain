import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readJson } from '@nrwl/devkit';
import { removeDepConstraint } from './remove-dep-contraint';

describe('removeDepConstraint', () => {
  let appTree: Tree;

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
                    {
                      sourceTag: 'type:domain',
                      onlyDependOnLibsWithTags: ['type:util'],
                    },
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
      removeDepConstraint(appTree, 'type:domain');
      const eslint = readJson(appTree, '.eslintrc.json');
      expect(
        eslint.overrides[0].rules['@nrwl/nx/enforce-module-boundaries'][1]
          .depConstraints
      ).not.toContainEqual({
        onlyDependOnLibsWithTags: ['type:util'],
        sourceTag: 'type:domain',
      });
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
                {
                  sourceTag: 'type:domain',
                  onlyDependOnLibsWithTags: ['type:util'],
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
      removeDepConstraint(appTree, 'type:domain');
      const tslint = readJson(appTree, 'tslint.json');
      expect(
        tslint.rules['nx-enforce-module-boundaries'][1].depConstraints
      ).not.toContainEqual({
        onlyDependOnLibsWithTags: ['type:util'],
        sourceTag: 'type:domain',
      });
    });
  });
});
