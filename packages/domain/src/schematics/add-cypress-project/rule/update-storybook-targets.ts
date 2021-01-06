import { Rule, SchematicsException } from '@angular-devkit/schematics';
import { updateWorkspaceInTree } from '@nrwl/workspace';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { getCypressProjectName } from '../../../utils/cypress-project';
import { UiFrameworkType } from '../../shared/model/ui-framework.type';

export const updateStorybookTargets = (
  application: string,
  domain: string,
  originalStorybookLibraryName: string,
  uiFramework: UiFrameworkType
): Rule =>
  updateWorkspaceInTree((json) => {
    const projectName = getCypressProjectName(
      application,
      domain,
      CypressProject.Storybook
    );
    delete json.projects[projectName].architect.e2e;
    delete json.projects[originalStorybookLibraryName].architect.storybook;
    delete json.projects[originalStorybookLibraryName].architect[
      'build-storybook'
    ];
    json.projects[projectName].architect['storybook-e2e'] = {
      builder: '@nrwl/cypress:cypress',
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
    json.projects[projectName].architect.storybook = {
      builder: '@nrwl/storybook:storybook',
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
    json.projects[projectName].architect['build-storybook'] = {
      builder: '@nrwl/storybook:build',
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
    return json;
  });
