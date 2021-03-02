import { Tree } from '@nrwl/devkit';
import { removeCypressTsConfigPath } from './remove-cypress-ts-config-path';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import {
  getCypressProjectName,
  isHavingCypressProject,
} from '../../shared/utils/cypress-project';
import { deleteInTree } from '../../shared/utils/tree';
import { removeProjectConfiguration } from '../../shared/utils/project-configuration';

export const removeCypressProject = (
  tree: Tree,
  application: string,
  domain: string,
  projectType: CypressProject
): void => {
  const projectName = getCypressProjectName(application, domain, projectType);
  const otherCypressProjectType =
    projectType === CypressProject.E2E
      ? CypressProject.Storybook
      : CypressProject.E2E;
  removeProjectConfiguration(tree, projectName);
  deleteInTree(
    tree,
    `libs/${application}/${domain}/.cypress/src/integration/${projectType}`
  );
  if (projectType === CypressProject.Storybook) {
    deleteStorybookFolder(tree, application, domain);
    deleteInTree(
      tree,
      `libs/${application}/${domain}/.cypress/storybook-cypress.json`
    );
  } else {
    deleteInTree(tree, `libs/${application}/${domain}/.cypress/cypress.json`);
  }
  if (
    !isHavingCypressProject(application, domain, otherCypressProjectType, tree)
  ) {
    removeCypressTsConfigPath(tree, application, domain);
    deleteE2EFolder(tree, application, domain);
  }
};

const deleteStorybookFolder = (
  tree: Tree,
  application: string,
  domain: string
) => {
  const cypressProjectFolder = `libs/${application}/${domain}/.storybook`;
  deleteInTree(tree, cypressProjectFolder);
};

const deleteE2EFolder = (tree: Tree, application: string, domain: string) => {
  const cypressProjectFolder = `libs/${application}/${domain}/.cypress`;
  deleteInTree(tree, cypressProjectFolder);
};
