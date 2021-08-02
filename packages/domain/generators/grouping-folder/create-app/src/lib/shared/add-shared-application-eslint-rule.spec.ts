import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Language } from '../model/language.enum';
import { addSharedApplicationEslintRule } from './add-shared-application-eslint-rule';

describe('addSharedApplicationEslintRule', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
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

  it('should add shared application eslint rule when shared app group folder is being created', () => {
    addSharedApplicationEslintRule(tree);
    const eslint = readJson(tree, '.eslintrc.json');
    expect(
      eslint.overrides[0].rules['@nrwl/nx/enforce-module-boundaries'][1]
        .depConstraints
    ).toEqual([{ onlyDependOnLibsWithTags: ['scope:shared'], sourceTag: '*' }]);
  });
  it('should add shared application eslint rule prefixed with lanauge when shared app group folder is being created and language is given', () => {
    addSharedApplicationEslintRule(tree, Language.Angular);
    const eslint = readJson(tree, '.eslintrc.json');
    expect(
      eslint.overrides[0].rules['@nrwl/nx/enforce-module-boundaries'][1]
        .depConstraints
    ).toEqual([
      {
        onlyDependOnLibsWithTags: [`scope:${Language.Angular}-shared`],
        sourceTag: '*',
      },
    ]);
  });
});
