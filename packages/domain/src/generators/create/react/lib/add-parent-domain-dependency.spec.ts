import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readJson } from '@nrwl/devkit';
import { addParentDomainDependency } from './add-parent-domain-dependency';

describe('addParentDomainDependency', () => {
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
                    { sourceTag: '*', onlyDependOnLibsWithTags: ['*'] },
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

    it('should add parent domain dependency to new child domain', () => {
      addParentDomainDependency(appTree, application, domain);
      const eslint = readJson(appTree, '.eslintrc.json');
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

    it('should add parent domain dependency to new child domain', () => {
      addParentDomainDependency(appTree, application, domain);
      const tslint = readJson(appTree, 'tslint.json');
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
