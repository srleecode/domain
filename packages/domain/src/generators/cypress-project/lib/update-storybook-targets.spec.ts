import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import {
  Tree,
  ProjectConfiguration,
  NxJsonProjectConfiguration,
  TargetConfiguration,
} from '@nrwl/devkit';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { updateStorybookTargets } from './update-storybook-targets';
import { getParsedDomain } from '../../shared/utils/domain';
import { getCypressProjectName } from '../../shared/utils/cypress-project';
import {
  addProjectConfiguration,
  readProjectConfiguration,
} from '../../shared/utils/project-configuration';

describe('updateStorybookTargets', () => {
  let appTree: Tree;
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
  let libraryProjectConfig: ProjectConfiguration & NxJsonProjectConfiguration;
  let storybookProjectConfig: ProjectConfiguration & NxJsonProjectConfiguration;

  beforeAll(() => {
    appTree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(appTree, originalStorybookLibraryName, {
      targets: {
        storybook: { executor: '' },
        ['build-storybook']: { executor: '' },
      },
      root: '',
    });
    addProjectConfiguration(appTree, storybookProjectName, {
      targets: {
        e2e: { executor: '' },
        ['build-storybook']: { executor: '' },
      },
      root: '',
    });
    updateStorybookTargets(
      appTree,
      application,
      domain,
      originalStorybookLibraryName,
      uiFramework
    );
    libraryProjectConfig = readProjectConfiguration(
      appTree,
      originalStorybookLibraryName
    );
    storybookProjectConfig = readProjectConfiguration(
      appTree,
      storybookProjectName
    );
  });
  it('should remove e2e target from cypress project', () => {
    expect(storybookProjectConfig.targets.e2e).toBeUndefined();
  });
  it('should remove storybook target from library originally configured for storybook', () => {
    expect(libraryProjectConfig.targets.storybook).toBeUndefined();
  });
  it('should remove build-storybook target from library originally configured for storybook', () => {
    expect(libraryProjectConfig.targets['build-storybook']).toBeUndefined();
  });
  it('should add storybook-e2e target to cypress project', () => {
    expect(storybookProjectConfig.targets['storybook-e2e']).toEqual({
      executor: '@nrwl/cypress:cypress',
      configurations: {
        ci: {
          devServerTarget: `storybook-${application}-${getParsedDomain(
            domain
          )}:storybook:ci`,
        },
      },
      options: {
        cypressConfig: `libs/${application}/${domain}/.cypress/storybook-cypress.json`,
        devServerTarget: `storybook-${application}-${getParsedDomain(
          domain
        )}:storybook`,
        tsConfig: `libs/${application}/${domain}/.cypress/tsconfig.e2e.json`,
      },
    });
  });
  it('should add storybook target to cypress project', () => {
    const expected: TargetConfiguration = {
      executor: '@nrwl/storybook:storybook',
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
    };
    expect(storybookProjectConfig.targets.storybook).toEqual(expected);
  });
  it('should add build-storybook target to cypress project', () => {
    const expected: TargetConfiguration = {
      executor: '@nrwl/storybook:build',
      configurations: {
        ci: {
          quiet: true,
        },
      },
      options: {
        uiFramework,
        config: {
          configFolder: `libs/${application}/${domain}/.storybook`,
        },
        outputPath: `dist/storybook/storybook-${application}-${getParsedDomain(
          domain
        )}`,
      },
    };
    expect(storybookProjectConfig.targets['build-storybook']).toEqual(expected);
  });
});
