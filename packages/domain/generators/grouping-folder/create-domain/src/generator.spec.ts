import { readJson, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { createDomainGroupingFolderGenerator } from './generator';
import { CreateDomainGroupingFolderGeneratorSchema } from './schema';

describe('createAppGroupingFolderGenerator', () => {
  let tree: Tree;
  const options: CreateDomainGroupingFolderGeneratorSchema = {
    groupingFolder: 'libs/ng-test-app',
    name: 'test-domain',
  };
  const domainScope = 'scope:ng-test-app-test-domain';

  const expectDepConstraint = (dependencyTag: string): void => {
    const eslint = readJson(tree, '.eslintrc.json');
    expect(
      eslint.overrides[0].rules['@nx/enforce-module-boundaries'][1]
        .depConstraints[0].onlyDependOnLibsWithTags
    ).toContainEqual(dependencyTag);
  };

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
            '@nx/enforce-module-boundaries': [
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

  it('should allow imports in same domain', async () => {
    await createDomainGroupingFolderGenerator(tree, options);
    expectDepConstraint(domainScope);
  });

  it('should allow imports from inside shared app grouping folder', async () => {
    await createDomainGroupingFolderGenerator(tree, options);
    expectDepConstraint('app:ng-shared');
  });

  it('should allow imports from inside shared domain in app grouping folder', async () => {
    await createDomainGroupingFolderGenerator(tree, options);
    expectDepConstraint('scope:ng-test-app-shared');
  });

  it('should allow imports from parent domains shared grouping folder when child domain', async () => {
    await createDomainGroupingFolderGenerator(tree, {
      groupingFolder: 'libs/ng-test-app/parent-domain',
      name: 'child-domain',
    });
    expectDepConstraint('scope:ng-test-app-parent-domain-shared');
  });
  it('should not add scope to eslint when adding domain in app:shared', async () => {
    await createDomainGroupingFolderGenerator(tree, {
      groupingFolder: 'libs/ng-shared',
      name: 'child-domain',
    });
    const eslint = readJson(tree, '.eslintrc.json');
    expect(
      eslint.overrides[0].rules['@nx/enforce-module-boundaries'][1]
        .depConstraints
    ).toEqual([]);
  });
});
