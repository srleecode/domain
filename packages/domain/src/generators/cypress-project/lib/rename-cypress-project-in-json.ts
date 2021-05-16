import {
  Tree,
  ProjectConfiguration,
  NxJsonProjectConfiguration,
} from '@nrwl/devkit';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { getUnprocessedCypressProjectName } from '../../shared/utils/cypress-project';
import {
  addProjectConfiguration,
  readProjectConfiguration,
  removeProjectConfiguration,
} from '../../shared/utils/project-configuration';

export const renameCypressProjectInJson = (
  tree: Tree,
  application: string,
  domain: string,
  projectType: CypressProject
): void => {
  const projectName = getUnprocessedCypressProjectName(
    application,
    domain,
    projectType
  );
  const projectConfig = readProjectConfiguration(tree, projectName);

  const parsedProjectName = projectName.replace(/\//g, '-');
  removeProjectConfiguration(tree, projectName);
  addProjectConfiguration(
    tree,
    parsedProjectName,
    getConfigWithProjectInDomain(
      projectConfig,
      application,
      domain,
      projectType
    )
  );
};

const getConfigWithProjectInDomain = (
  projectConfig: ProjectConfiguration & NxJsonProjectConfiguration,
  application: string,
  domain: string,
  projectType: CypressProject
): ProjectConfiguration & NxJsonProjectConfiguration => {
  if (projectConfig.targets.lint.options.exclude) {
    projectConfig.targets.lint.options.exclude[1] = `!libs/${application}/${domain}/.*/**`;
  }
  const basePath = `libs/${application}/${domain}/.cypress`;
  projectConfig.root = basePath;
  projectConfig.sourceRoot = `${basePath}/src`;
  if (projectConfig.targets.lint.options.tsConfig) {
    projectConfig.targets.lint.options.tsConfig[0] = `${basePath}/tsconfig.e2e.json`;
  }
  if (projectConfig.targets.lint.options.config) {
    projectConfig.targets.lint.options.config = `${basePath}/.eslintrc`;
  }
  if (projectConfig.targets.lint.options.lintFilePatterns) {
    projectConfig.targets.lint.options.lintFilePatterns = [
      `libs/${application}/${domain}/.cypress/**/*.{js,ts}`,
    ];
  }
  if (projectType === CypressProject.E2E) {
    const e2eConfig = projectConfig.targets.e2e;
    delete e2eConfig.options.devServerTarget;
    delete e2eConfig.configurations;
    projectConfig.targets.e2e.options.cypressConfig = `${basePath}/cypress.json`;
    projectConfig.targets.e2e.options.tsConfig = `${basePath}/tsconfig.e2e.json`;
  } else if (projectType === CypressProject.Storybook) {
    delete projectConfig.targets.lint;
  }
  return projectConfig;
};
