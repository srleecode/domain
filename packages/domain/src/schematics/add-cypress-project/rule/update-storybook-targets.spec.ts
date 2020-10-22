import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { testRunner } from '../../../utils/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { getCypressProjectName } from '../../../utils/cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { getParsedDomain } from '../../../utils/domain';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { updateStorybookTargets } from './update-storybook-targets';

describe('updateStorybookTargets', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'leaf-domain';
  const originalStorybookLibraryName = `${application}-${getParsedDomain(
    domain
  )}-${DomainLibraryName.Ui}`;
  const storybookProjectName = getCypressProjectName(
    application,
    domain,
    CypressProject.Storybook
  );
  const uiFramework = '@storybook/angular';
  let processedWorkspaceJson;

  beforeAll(async () => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    const workspaceJson = {
      version: 1,
      projects: {
        [originalStorybookLibraryName]: {
          architect: {
            storybook: {},
            ['build-storybook']: {},
          },
        },
        [storybookProjectName]: {
          architect: {
            e2e: {},
            ['build-storybook']: {},
          },
        },
      },
    };
    appTree.overwrite('workspace.json', JSON.stringify(workspaceJson));
    appTree = (await testRunner
      .callRule(
        updateStorybookTargets(
          application,
          domain,
          originalStorybookLibraryName,
          uiFramework
        ),
        appTree
      )
      .toPromise()) as UnitTestTree;
    processedWorkspaceJson = readJsonInTree(appTree, 'workspace.json');
  });
  it('should remove e2e target from cypress project', async () => {
    expect(
      processedWorkspaceJson.projects[storybookProjectName].architect.e2e
    ).toBeUndefined();
  });
  it('should remove storybook target from library originally configured for storybook', async () => {
    expect(
      processedWorkspaceJson.projects[originalStorybookLibraryName].architect
        .storybook
    ).toBeUndefined();
  });
  it('should remove build-storybook target from library originally configured for storybook', async () => {
    expect(
      processedWorkspaceJson.projects[originalStorybookLibraryName].architect[
        'build-storybook'
      ]
    ).toBeUndefined();
  });
  it('should add storybook-e2e target to cypress project', async () => {
    expect(
      processedWorkspaceJson.projects[storybookProjectName].architect[
        'storybook-e2e'
      ]
    ).toEqual({
      builder: '@nrwl/cypress:cypress',
      configurations: {
        ci: {
          devServerTarget: `storybook-${application}-${getParsedDomain(
            domain
          )}:storybook:ci`,
        },
      },
      options: {
        cypressConfig: `libs/${application}/${domain}/.storybook/cypress.json`,
        devServerTarget: `storybook-${application}-${getParsedDomain(
          domain
        )}:storybook`,
        tsConfig: `libs/${application}/${domain}/.cypress/tsconfig.e2e.json`,
      },
    });
  });
  it('should add storybook target to cypress project', async () => {
    expect(
      processedWorkspaceJson.projects[storybookProjectName].architect.storybook
    ).toEqual({
      builder: '@nrwl/storybook:storybook',
      configurations: {
        ci: {
          quiet: true,
        },
      },
      options: {
        config: {
          configFolder: `libs/${application}/${domain}/.storybook`,
        },
        uiFramework,
        port: 4400,
      },
    });
  });
  it('should add build-storybook target to cypress project', async () => {
    expect(
      processedWorkspaceJson.projects[storybookProjectName].architect[
        'build-storybook'
      ]
    ).toEqual({
      builder: '@nrwl/storybook:build',
      configurations: {
        ci: {
          quiet: true,
        },
      },
      options: {
        config: {
          configFolder: `libs/${application}/${domain}/.storybook`,
        },
        outputPath: `dist/storybook/storybook-${application}-${getParsedDomain(
          domain
        )}`,
      },
    });
  });
});
