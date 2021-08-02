import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { initialiseAngularWorkspace } from './initialise-angular-workspace';

describe('initialiseAngularWorkspace', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add relevant dependencies into `package.json` file', async () => {
    await initialiseAngularWorkspace(tree);
    const packageJson = readJson(tree, 'package.json');
    expect(
      packageJson.devDependencies['@jscutlery/cypress-angular']
    ).toBeDefined();
    expect(
      packageJson.devDependencies['@jscutlery/cypress-harness']
    ).toBeDefined();
    expect(packageJson.devDependencies['@angular/cdk']).toBeDefined();
    expect(packageJson.devDependencies['cypress-pipe']).toBeDefined();
  });

  describe('eslint layer rules', () => {
    beforeEach(() => {
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

    it('should update dependency constraints in eslintrc.json', async () => {
      await initialiseAngularWorkspace(tree);
      const eslint = readJson(tree, '.eslintrc.json');
      expect(
        eslint.overrides[0].rules['@nrwl/nx/enforce-module-boundaries'][1]
          .depConstraints
      ).toEqual([
        { onlyDependOnLibsWithTags: ['type:util'], sourceTag: 'type:domain' },
        {
          onlyDependOnLibsWithTags: [
            'type:data-access',
            'type:domain',
            'type:util',
          ],
          sourceTag: 'type:data-access',
        },
        {
          onlyDependOnLibsWithTags: [
            'type:data-access',
            'type:feature',
            'type:ui',
            'type:util',
          ],
          sourceTag: 'type:shell',
        },
        {
          onlyDependOnLibsWithTags: [
            'type:data-access',
            'type:feature',
            'type:ui',
            'type:util',
          ],
          sourceTag: 'type:feature',
        },
        {
          onlyDependOnLibsWithTags: ['type:data-access', 'type:util'],
          sourceTag: 'type:api',
        },
        { onlyDependOnLibsWithTags: ['type:util'], sourceTag: 'type:util' },
      ]);
    });
  });
});
