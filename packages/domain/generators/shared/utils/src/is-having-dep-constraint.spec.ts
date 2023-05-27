import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import { isHavingDepContraint } from './is-having-dep-constraint';

describe('isHavingDepContraint', () => {
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
              '@nx/enforce-module-boundaries': [
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
      expect(isHavingDepContraint(appTree, 'type:domain')).toBe(true);
    });
  });
  describe('tslint', () => {
    beforeEach(() => {
      appTree = createTreeWithEmptyWorkspace();
      const json = {
        rulesDirectory: [
          'node_modules/@nx/workspace/src/tslint',
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
      expect(isHavingDepContraint(appTree, 'type:domain')).toBe(true);
    });
  });
});
