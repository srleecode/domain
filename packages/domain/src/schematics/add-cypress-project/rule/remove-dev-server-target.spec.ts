import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { testRunner } from '../../../utils/testing';
import { removeDevServerTargets } from './remove-dev-server-target';
import { readJsonInTree } from '@nrwl/workspace';
import { getCypressProjectName } from '../../../utils/cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';

describe('removeDevServerTargets', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'leaf-domain';
  const projectName = getCypressProjectName(
    application,
    domain,
    CypressProject.E2E
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    const workspaceJson = {
      version: 1,
      projects: {
        [projectName]: {
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
        removeDevServerTargets(application, domain, CypressProject.E2E),
        appTree
      )
      .toPromise()) as UnitTestTree;

    const workspaceJson = readJsonInTree(appTree, 'workspace.json');
    expect(
      workspaceJson.projects[projectName].architect.e2e.options.devServerTarget
    ).toBeUndefined();
    expect(
      workspaceJson.projects[projectName].architect.e2e.configurations
    ).toBeUndefined();
  });
});
