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
    appTree.create('.eslintrc.json', JSON.stringify(json));
  });

  it('should remove parent domain dependency', async () => {
    appTree = (await testRunner
      .callRule(removeParentDomainDependencyRule(application, domain), appTree)
      .toPromise()) as UnitTestTree;

    const eslint = readJsonInTree(appTree, '.eslintrc.json');
    expect(
      eslint.overrides[0].rules['@nrwl/nx/enforce-module-boundaries'][1]
        .depConstraints[1]
    ).toBeUndefined();
  });
});
