import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readJson } from '@nrwl/devkit';
import { removeParentDomainDependencyRule } from './remove-parent-domain-dependency';
import { getParsedDomain } from '../../shared/utils/domain';

describe('removeParentDomainDependencyRule', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'parent-domain/child-domain';

  describe('eslint', () => {
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
      appTree.write('.eslintrc.json', JSON.stringify(json));
    });

    it('should remove parent domain dependency', () => {
      removeParentDomainDependencyRule(appTree, application, domain);
      const eslint = readJson(appTree, '.eslintrc.json');
      expect(
        eslint.overrides[0].rules['@nrwl/nx/enforce-module-boundaries'][1]
          .depConstraints[1]
      ).toBeUndefined();
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
      appTree.write('tslint.json', JSON.stringify(json));
    });

    it('should add parent domain dependency to new child domain', () => {
      removeParentDomainDependencyRule(appTree, application, domain);
      const tslint = readJson(appTree, 'tslint.json');
      expect(
        tslint.rules['nx-enforce-module-boundaries'][1].depConstraints[1]
      ).toBeUndefined();
    });
  });
});
