import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { Tree } from '@angular-devkit/schematics';
import { removeLibraryStorybookLintReference } from './remove-library-storybook-lint-reference';
import { readJsonInTree } from '@nrwl/workspace';
import { testRunner } from '../../../utils/testing';

describe('removeLibraryStorybookLintReference', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'leaf-domain';
  const library = DomainLibraryName.DataAccess;
  const filePath = `libs/${application}/${domain}/${library}/.eslintrc.json`;

  const json = {
    extends: ['../../../../.eslintrc.json'],
    ignorePatterns: ['!**/*'],
    overrides: [
      {
        files: ['*.ts'],
        extends: [
          'plugin:@nrwl/nx/angular',
          'plugin:@angular-eslint/template/process-inline-templates',
        ],
        parserOptions: {
          project: [
            'libs/test-application/storybook-domain/data-access/tsconfig.*?.json',
            'libs/test-application/storybook-domain/data-access/.storybook/tsconfig.json',
          ],
        },
        rules: {
          '@angular-eslint/directive-selector': [
            'error',
            {
              type: 'attribute',
              prefix: 'srlee',
              style: 'camelCase',
            },
          ],
          '@angular-eslint/component-selector': [
            'error',
            {
              type: 'element',
              prefix: 'srlee',
              style: 'kebab-case',
            },
          ],
        },
      },
      {
        files: ['*.html'],
        extends: ['plugin:@nrwl/nx/angular-template'],
        rules: {},
      },
    ],
  };

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    appTree.create(filePath, JSON.stringify(json));
  });

  it('should remove storybook reference', async () => {
    appTree = (await testRunner
      .callRule(
        removeLibraryStorybookLintReference(application, domain, library),
        appTree
      )
      .toPromise()) as UnitTestTree;

    const eslint = readJsonInTree(appTree, filePath);
    expect(eslint.overrides[0].parserOptions.project.length).toBe(1);
  });
});
