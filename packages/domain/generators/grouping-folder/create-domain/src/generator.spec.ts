import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { createDomainGroupingFolderGenerator } from './generator';
import { CreateDomainGroupingFolderGeneratorSchema } from './schema';

describe('createAppGroupingFolderGenerator', () => {
  let tree: Tree;
  const options: CreateDomainGroupingFolderGeneratorSchema = {
    baseFolder: 'libs/test-app',
    name: 'test-domain',
  };
  const domainScope = 'scope:test-app-test-domain';

  const expectDepConstraint = (dependencyTag: string): void => {
    const eslint = readJson(tree, '.eslintrc.json');
    expect(
      eslint.overrides[0].rules['@nrwl/nx/enforce-module-boundaries'][1]
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
    await createDomainGroupingFolderGenerator(tree, options);
    const folders = tree.children(options.baseFolder);
    expect(folders).toContainEqual(options.name);
  });

  it('should allow imports in same domain', async () => {
    await createDomainGroupingFolderGenerator(tree, options);
    expectDepConstraint(domainScope);
  });

  it('should allow imports from inside shared app grouping folder', async () => {
    await createDomainGroupingFolderGenerator(tree, options);
    expectDepConstraint('app:shared');
  });

  it('should allow imports from inside shared domain in app grouping folder', async () => {
    await createDomainGroupingFolderGenerator(tree, options);
    expectDepConstraint('scope:test-app-shared');
  });

  it('should allow imports from parent domains shared grouping folder when child domain', async () => {
    await createDomainGroupingFolderGenerator(tree, {
      baseFolder: 'libs/test-app/parent-domain',
      name: 'child-domain',
    });
    expectDepConstraint('scope:test-app-parent-domain-shared');
  });
});
