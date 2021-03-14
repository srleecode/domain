import { readJson, Tree, WorkspaceJsonConfiguration } from '@nrwl/devkit';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { UiFrameworkType } from '../../shared/model/ui-framework.type';
import { getCypressProjectName } from '../../shared/utils/cypress-project';
import {
  readProjectConfiguration,
  updateProjectConfiguration,
} from '../../shared/utils/project-configuration';
import { getWorkspacePath } from '../../shared/utils/workspace';

export const updateStorybookTargets = (
  tree: Tree,
  application: string,
  domain: string,
  originalStorybookLibraryName: string,
  uiFramework: UiFrameworkType
): void => {
  removeAddedStorybookTargets(tree, originalStorybookLibraryName);
  const projectName = getCypressProjectName(
    application,
    domain,
    CypressProject.Storybook
  );
  const projectConfig = readProjectConfiguration(tree, projectName);
  delete projectConfig.targets.e2e;
  projectConfig.targets['storybook-e2e'] = {
    executor: '@nrwl/cypress:cypress',
    options: {
      cypressConfig: `libs/${application}/${domain}/.cypress/storybook-cypress.json`,
      tsConfig: `libs/${application}/${domain}/.cypress/tsconfig.e2e.json`,
      devServerTarget: `${projectName}:storybook`,
    },
    configurations: {
      ci: {
        devServerTarget: `${projectName}:${CypressProject.Storybook}:ci`,
      },
    },
  };
  projectConfig.targets.storybook = {
    executor: '@nrwl/storybook:storybook',
    options: {
      uiFramework,
      port: 4400,
      config: {
        configFolder: `libs/${application}/${domain}/.storybook`,
      },
    },
    configurations: {
      ci: {
        quiet: true,
      },
    },
  };
  projectConfig.targets['build-storybook'] = {
    executor: '@nrwl/storybook:build',
    options: {
      uiFramework,
      outputPath: `dist/${CypressProject.Storybook}/${projectName}`,
      config: {
        configFolder: `libs/${application}/${domain}/.storybook`,
      },
    },
    configurations: {
      ci: {
        quiet: true,
      },
    },
  };

  // for some reason the workspace json doesn't seem to updated with devkitUpdateProjectConfiguration
  const workspaceJson = readJson<WorkspaceJsonConfiguration>(
    tree,
    getWorkspacePath(tree)
  );

  workspaceJson.projects[projectName] = projectConfig;
  tree.write(getWorkspacePath(tree), JSON.stringify(workspaceJson));
};

const removeAddedStorybookTargets = (
  tree: Tree,
  libraryProjectName: string
): void => {
  const projectConfig = readProjectConfiguration(tree, libraryProjectName);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const targets = projectConfig.targets || (projectConfig as any).architect;
  delete targets.storybook;
  delete targets['build-storybook'];
  updateProjectConfiguration(tree, libraryProjectName, projectConfig);
};
