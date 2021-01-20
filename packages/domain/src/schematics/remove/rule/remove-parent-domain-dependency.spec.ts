import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { testRunner } from '../../../utils/testing';
import { removeParentDomainDependencyRule } from './remove-parent-domain-dependency';
import { readJsonInTree } from '@nrwl/workspace';
import { getParsedDomain } from '../../../utils/domain';

describe('removeParentDomainDependencyRule', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'parent-domain/child-domain';

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
                    {
                      sourceTag: '*',
                      onlyDependOnLibsWithTags: ['*'],
                    },
                    {
                      sourceTag: `scope:${application}-${getParsedDomain(
                        domain
                      )}`,
                      onlyDependOnLibsWithTags: [
                        'scope:test-application-parent-domain-with-child-shared',
                      ],
                    },
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

    it('should remove parent domain dependency', async () => {
      appTree = (await testRunner
        .callRule(
          removeParentDomainDependencyRule(application, domain),
          appTree
        )
        .toPromise()) as UnitTestTree;

      const eslint = readJsonInTree(appTree, '.eslintrc.json');
      expect(
        eslint.overrides[0].rules['@nrwl/nx/enforce-module-boundaries'][1]
          .depConstraints[1]
      ).toBeUndefined();
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
                  sourceTag: `scope:${application}-${getParsedDomain(domain)}`,
                  onlyDependOnLibsWithTags: [
                    'scope:test-application-parent-domain-with-child-shared',
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
          removeParentDomainDependencyRule(application, domain),
          appTree
        )
        .toPromise()) as UnitTestTree;

      const tslint = readJsonInTree(appTree, 'tslint.json');
      expect(
        tslint.rules['nx-enforce-module-boundaries'][1].depConstraints[1]
      ).toBeUndefined();
    });
  });
});
