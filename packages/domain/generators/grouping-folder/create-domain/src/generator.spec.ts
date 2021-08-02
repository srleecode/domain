import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createDomainGroupingFolderGenerator } from './generator';

describe('createAppGroupingFolderGenerator', () => {
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

  it('should create directory', async () => {
    await createDomainGroupingFolderGenerator(tree, {
      baseFolder: 'libs/test-app',
      name: 'test',
    });
    const fileChanges = tree.listChanges();
    expect(fileChanges[fileChanges.length - 1].path).toBe('libs/test-app/test');
  });

  it('should add shared domain eslint rule to all domains in grouping folder', async () => {
    await createDomainGroupingFolderGenerator(tree, {
      baseFolder: 'libs/test-app',
      name: 'test-domain',
    });
    await createDomainGroupingFolderGenerator(tree, {
      baseFolder: 'libs/test-app',
      name: 'shared',
    });
    const eslint = readJson(tree, '.eslintrc.json');
    expect(
      eslint.overrides[0].rules['@nrwl/nx/enforce-module-boundaries'][1]
        .depConstraints
    ).toEqual([
      {
        onlyDependOnLibsWithTags: ['scope:test-app-shared'],
        sourceTag: 'scope:test-app-test-domain',
      },
    ]);
  });

  it('should add shared domain eslint rule to all child domains in parent domain grouping folder', async () => {
    await createDomainGroupingFolderGenerator(tree, {
      baseFolder: 'libs/test-app/parent-domain',
      name: 'child-domain',
    });
    await createDomainGroupingFolderGenerator(tree, {
      baseFolder: 'libs/test-app/parent-domain',
      name: 'shared',
    });
    const eslint = readJson(tree, '.eslintrc.json');
    expect(
      eslint.overrides[0].rules['@nrwl/nx/enforce-module-boundaries'][1]
        .depConstraints
    ).toEqual([
      {
        onlyDependOnLibsWithTags: ['scope:test-app-parent-domain-shared'],
        sourceTag: 'scope:test-app-parent-domain-child-domain',
      },
    ]);
  });
});
