import { Rule, SchematicsException } from '@angular-devkit/schematics';
import { updateWorkspaceInTree } from '@nrwl/workspace';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { getCypressProjectName } from '../../../utils/cypress-project';

export const updateStorybookTargets = (
  application: string,
  domain: string,
  originalStorybookLibraryName: string
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
        cypressConfig: `apps/${CypressProject.Storybook}/${application}/${domain}/cypress.json`,
        tsConfig: `apps/${CypressProject.Storybook}/${application}/${domain}/tsconfig.e2e.json`,
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
        port: 4400,
        config: {
          configFolder: `libs/${application}/${domain}/.${CypressProject.Storybook}`,
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
        outputPath: `dist/${CypressProject.Storybook}/${projectName}`,
        config: {
          configFolder: `libs/${application}/${domain}/.${CypressProject.Storybook}`,
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
