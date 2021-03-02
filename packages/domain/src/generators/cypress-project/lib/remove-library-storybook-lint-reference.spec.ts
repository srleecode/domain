import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readJson } from '@nrwl/devkit';
import { removeLibraryStorybookLintReference } from './remove-library-storybook-lint-reference';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';

describe('removeLibraryStorybookLintReference', () => {
  let appTree: Tree;
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
    appTree = createTreeWithEmptyWorkspace();
    appTree.write(filePath, JSON.stringify(json));
  });

  it('should remove storybook reference', () => {
    removeLibraryStorybookLintReference(appTree, application, domain, library);
    const eslint = readJson(appTree, filePath);
    expect(eslint.overrides[0].parserOptions.project.length).toBe(1);
  });
});
