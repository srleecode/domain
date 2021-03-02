import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import {
  Tree,
  ProjectConfiguration,
  NxJsonProjectConfiguration,
} from '@nrwl/devkit';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import {
  getCypressProjectName,
  getUnprocessedCypressProjectName,
} from '../../shared/utils/cypress-project';
import { renameCypressProjectInJson } from './rename-cypress-project-in-json';
import {
  addProjectConfiguration,
  readProjectConfiguration,
} from '../../shared/utils/project-configuration';

describe('renameCypressProjectInJson', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'leaf-domain';
  const unprocessedE2eProjectName = getUnprocessedCypressProjectName(
    application,
    domain,
    CypressProject.E2E
  );
  const unprocessedStorybookProjectName = getUnprocessedCypressProjectName(
    application,
    domain,
    CypressProject.Storybook
  );
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
    appTree = createTreeWithEmptyWorkspace();
    const e2eProjectConfig: ProjectConfiguration &
      NxJsonProjectConfiguration = {
      root: 'apps/cypress/test-application/leaf-domain',
      sourceRoot: 'apps/cypress/test-application/leaf-domain/src',
      projectType: 'application',
      targets: {
        e2e: {
          executor: '@nrwl/cypress:cypress',
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
          executor: '@nrwl/linter:lint',
          options: {
            linter: 'eslint',
            lintFilePatterns: [
              'apps/storybook/test-application/storybook-domain/tsconfig.e2e.json',
            ],
          },
        },
      },
    };
    const storybookProjectConfig: ProjectConfiguration &
      NxJsonProjectConfiguration = {
      root: 'apps/storybook/test-application/storybook-domain',
      sourceRoot: 'apps/storybook/test-application/storybook-domain/src',
      projectType: 'application',
      targets: {
        lint: {
          executor: '@nrwl/linter:lint',
          options: {
            linter: 'eslint',
            lintFilePatterns: [
              'apps/storybook/test-application/storybook-domain/tsconfig.e2e.json',
            ],
          },
        },
        'storybook-e2e': {
          executor: '@nrwl/cypress:cypress',
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
          executor: '@nrwl/storybook:storybook',
          options: {
            uiFramework: '@storybook/angular',
            port: 4400,
            config: {
              configFolder: 'libs/test-application/storybook-domain/.storybook',
            },
          },
          configurations: {
            ci: {
              quiet: true,
            },
          },
        },
        'build-storybook': {
          executor: '@nrwl/storybook:build',
          options: {
            outputPath:
              'dist/storybook/storybook-test-application-storybook-domain',
            config: {
              configFolder: 'libs/test-application/storybook-domain/.storybook',
            },
          },
          configurations: {
            ci: {
              quiet: true,
            },
          },
        },
      },
    };

    addProjectConfiguration(
      appTree,
      unprocessedE2eProjectName,
      e2eProjectConfig
    );
    addProjectConfiguration(
      appTree,
      unprocessedStorybookProjectName,
      storybookProjectConfig
    );
  });

  it('should add domain libraries as implicit dependencies', () => {
    renameCypressProjectInJson(
      appTree,
      application,
      domain,
      CypressProject.E2E
    );
    const projectJson = readProjectConfiguration(appTree, e2eProjectName);
    expect(projectJson.targets.e2e.options.devServerTarget).toBeUndefined();
    expect(projectJson.targets.e2e.configurations).toBeUndefined();
    expect(projectJson.targets.lint.options.lintFilePatterns).toEqual([
      'libs/test-application/leaf-domain/.cypress/**/*.{js,ts}',
    ]);
  });
  it('should uppdate root path for e2e project', () => {
    renameCypressProjectInJson(
      appTree,
      application,
      domain,
      CypressProject.E2E
    );
    const projectJson = readProjectConfiguration(appTree, e2eProjectName);
    expect(projectJson.root).toBe('libs/test-application/leaf-domain/.cypress');
    expect(projectJson.sourceRoot).toBe(
      'libs/test-application/leaf-domain/.cypress/src'
    );
    expect(projectJson.targets.e2e.options.cypressConfig).toBe(
      `libs/test-application/leaf-domain/.cypress/cypress.json`
    );
    expect(projectJson.targets.e2e.options.tsConfig).toBe(
      `libs/test-application/leaf-domain/.cypress/tsconfig.e2e.json`
    );
  });
  it('should uppdate root path for storybook project', () => {
    renameCypressProjectInJson(
      appTree,
      application,
      domain,
      CypressProject.Storybook
    );
    const projectJson = readProjectConfiguration(appTree, storybookProjectName);
    expect(projectJson.root).toBe('libs/test-application/leaf-domain/.cypress');
    expect(projectJson.sourceRoot).toBe(
      'libs/test-application/leaf-domain/.cypress/src'
    );
  });
});
