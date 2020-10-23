import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { testRunner } from '../../../utils/testing';
import { updateAngularJson } from './update-angular-json';
import { readJsonInTree } from '@nrwl/workspace';
import { getCypressProjectName } from '../../../utils/cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';

describe('updateAngularJson', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'leaf-domain';
  const e2eProjectName = getCypressProjectName(
    application,
    domain,
    CypressProject.E2E
  );
  const storybookProjectName = getCypressProjectName(
    application,
    domain,
    CypressProject.Storybook
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    const workspaceJson = {
      version: 1,
      projects: {
        [e2eProjectName]: {
          root: 'apps/cypress/test-application/leaf-domain',
          sourceRoot: 'apps/cypress/test-application/leaf-domain/src',
          projectType: 'application',
          architect: {
            e2e: {
              builder: '@nrwl/cypress:cypress',
              options: {
                cypressConfig:
                  'apps/cypress/test-application/leaf-domain/cypress.json',
                tsConfig:
                  'apps/cypress/test-application/leaf-domain/tsconfig.e2e.json',
                devServerTarget: ':serve',
              },
              configurations: {
                production: {
                  devServerTarget: ':serve:production',
                },
              },
            },
            lint: {
              builder: '@angular-devkit/build-angular:tslint',
              options: {
                tsConfig: [
                  'apps/cypress/test-application/leaf-domain/tsconfig.e2e.json',
                ],
                exclude: [
                  '**/node_modules/**',
                  '!apps/cypress/test-application/leaf-domain/**/*',
                ],
              },
            },
          },
        },
        [storybookProjectName]: {
          root: 'apps/storybook/test-application/storybook-domain',
          sourceRoot: 'apps/storybook/test-application/storybook-domain/src',
          projectType: 'application',
          architect: {
            lint: {
              builder: '@nrwl/linter:lint',
              options: {
                linter: 'eslint',
                tsConfig: [
                  'apps/storybook/test-application/storybook-domain/tsconfig.e2e.json',
                ],
                exclude: [
                  '**/node_modules/**',
                  '!libs/test-application/storybook-domain/.*/**',
                ],
              },
            },
            'storybook-e2e': {
              builder: '@nrwl/cypress:cypress',
              options: {
                cypressConfig:
                  'apps/storybook/test-application/storybook-domain/cypress.json',
                tsConfig:
                  'apps/storybook/test-application/storybook-domain/tsconfig.e2e.json',
                devServerTarget:
                  'storybook-test-application-storybook-domain:storybook',
              },
              configurations: {
                ci: {
                  devServerTarget:
                    'storybook-test-application-storybook-domain:storybook:ci',
                },
              },
            },
            storybook: {
              builder: '@nrwl/storybook:storybook',
              options: {
                uiFramework: '@storybook/angular',
                port: 4400,
                config: {
                  configFolder:
                    'libs/test-application/storybook-domain/.storybook',
                },
              },
              configurations: {
                ci: {
                  quiet: true,
                },
              },
            },
            'build-storybook': {
              builder: '@nrwl/storybook:build',
              options: {
                outputPath:
                  'dist/storybook/storybook-test-application-storybook-domain',
                config: {
                  configFolder:
                    'libs/test-application/storybook-domain/.storybook',
                },
              },
              configurations: {
                ci: {
                  quiet: true,
                },
              },
            },
          },
        },
      },
      cli: {
        defaultCollection: '@nrwl/workspace',
      },
    };
    appTree.overwrite('workspace.json', JSON.stringify(workspaceJson));
  });

  it('should add domain libraries as implicit dependencies', async () => {
    appTree = (await testRunner
      .callRule(
        updateAngularJson(application, domain, CypressProject.E2E),
        appTree
      )
      .toPromise()) as UnitTestTree;

    const workspaceJson = readJsonInTree(appTree, 'workspace.json');
    const projectJson = workspaceJson.projects[e2eProjectName];
    expect(projectJson.architect.e2e.options.devServerTarget).toBeUndefined();
    expect(projectJson.architect.e2e.configurations).toBeUndefined();
    expect(projectJson.architect.lint.options.exclude[1]).toBe(
      '!libs/test-application/leaf-domain/.*/**'
    );
  });
  it('should uppdate root path for e2e project', async () => {
    appTree = (await testRunner
      .callRule(
        updateAngularJson(application, domain, CypressProject.E2E),
        appTree
      )
      .toPromise()) as UnitTestTree;

    const workspaceJson = readJsonInTree(appTree, 'workspace.json');
    const projectJson = workspaceJson.projects[e2eProjectName];
    expect(projectJson.root).toBe('libs/test-application/leaf-domain/.cypress');
    expect(projectJson.sourceRoot).toBe(
      'libs/test-application/leaf-domain/.cypress/src'
    );
    expect(projectJson.architect.lint.options.tsConfig[0]).toBe(
      `libs/test-application/leaf-domain/.cypress/tsconfig.e2e.json`
    );
    expect(projectJson.architect.e2e.options.cypressConfig).toBe(
      `libs/test-application/leaf-domain/.cypress/cypress.json`
    );
    expect(projectJson.architect.e2e.options.tsConfig).toBe(
      `libs/test-application/leaf-domain/.cypress/tsconfig.e2e.json`
    );
  });
  it('should uppdate root path for storybook project', async () => {
    appTree = (await testRunner
      .callRule(
        updateAngularJson(application, domain, CypressProject.Storybook),
        appTree
      )
      .toPromise()) as UnitTestTree;

    const workspaceJson = readJsonInTree(appTree, 'workspace.json');
    const projectJson = workspaceJson.projects[storybookProjectName];
    expect(projectJson.root).toBe('libs/test-application/leaf-domain/.cypress');
    expect(projectJson.sourceRoot).toBe(
      'libs/test-application/leaf-domain/.cypress/src'
    );
    expect(projectJson.architect.lint.options.tsConfig[0]).toBe(
      `libs/test-application/leaf-domain/.cypress/tsconfig.e2e.json`
    );
  });
});
