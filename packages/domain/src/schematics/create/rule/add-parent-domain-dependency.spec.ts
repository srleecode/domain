import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { testRunner } from '../../../utils/testing';
import { addParentDomainDependencyRule } from './add-parent-domain-dependency';
import { readJsonInTree } from '@nrwl/workspace';

describe('checkParentDomain', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const parentDomain = 'parent-domain';
  const parsedDomain = `${parentDomain}-child-domain`;

  describe('eslint', () => {
    beforeEach(() => {
      appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
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
      appTree.delete('tslint.json');
      appTree.create('.eslintrc.json', JSON.stringify(json));
    });

    it('should add parent domain dependency to new child domain', async () => {
      appTree = (await testRunner
        .callRule(
          addParentDomainDependencyRule(
            application,
            parentDomain,
            parsedDomain
          ),
          appTree
        )
        .toPromise()) as UnitTestTree;

      const eslint = readJsonInTree(appTree, '.eslintrc.json');
      expect(
        eslint.overrides[0].rules['@nrwl/nx/enforce-module-boundaries'][1]
          .depConstraints[1]
      ).toEqual({
        onlyDependOnLibsWithTags: [
          'scope:test-application-parent-domain-shared',
        ],
        sourceTag: 'scope:test-application-parent-domain-child-domain',
      });
    });
  });
  describe('tslint', () => {
    beforeEach(() => {
      appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
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
      appTree.overwrite('tslint.json', JSON.stringify(json));
    });

    it('should add parent domain dependency to new child domain', async () => {
      appTree = (await testRunner
        .callRule(
          addParentDomainDependencyRule(
            application,
            parentDomain,
            parsedDomain
          ),
          appTree
        )
        .toPromise()) as UnitTestTree;

      const tslint = readJsonInTree(appTree, 'tslint.json');
      expect(
        tslint.rules['nx-enforce-module-boundaries'][1].depConstraints[2]
      ).toEqual({
        onlyDependOnLibsWithTags: [
          'scope:test-application-parent-domain-shared',
        ],
        sourceTag: 'scope:test-application-parent-domain-child-domain',
      });
    });
  });
});
