import { getExternalSchematic } from '../../../utils/testing';
import {
  getCypressProjectName,
  isHavingCypressProject,
} from '../../../utils/cypress-project';
import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import {
  NxJson,
  updateWorkspaceInTree,
  getWorkspacePath,
  updateJsonInTree,
} from '@nrwl/workspace';
import { deleteInTree, getDirInTree } from '../../../utils/tree';
import { removeCypressTsConfigPath } from './remove-cypress-ts-config-path';
import { SchematicsException } from '@angular-devkit/schematics';
export const removeCypressProject = (
  application: string,
  domain: string,
  projectType: CypressProject,
  tree: Tree
): Rule[] => {
  const projectName = getCypressProjectName(application, domain, projectType);
  const otherCypressProjectType =
    projectType === CypressProject.E2E
      ? CypressProject.Storybook
      : CypressProject.E2E;
  let rules: Rule[] = [];
  if (projectType === CypressProject.Storybook) {
    rules.push(deleteStorybookFiles(application, domain));
    rules.push(deleteStorybookFolder(application, domain));
  }
  if (
    isHavingCypressProject(application, domain, CypressProject.E2E, tree) &&
    isHavingCypressProject(application, domain, CypressProject.Storybook, tree)
  ) {
    // if having both cypress project types update config files but dont remove the folder as the other cypress project uses it
    rules = rules.concat([
      updateNxJson(projectName),
      updateWorkspace(projectName),
    ]);
    if (projectType === CypressProject.E2E) {
      rules.push(deleteE2EFiles(application, domain));
    }
  } else {
    rules = rules.concat([
      getExternalSchematic('@nrwl/workspace', 'remove', {
        projectName: projectName,
      }),
    ]);
  }

  if (
    !isHavingCypressProject(application, domain, otherCypressProjectType, tree)
  ) {
    rules.push(removeCypressTsConfigPath(application, domain));
  }
  return rules;
};

const updateNxJson = (projectName: string) => {
  return updateJsonInTree<NxJson>('nx.json', (json) => {
    delete json.projects[projectName];

    Object.values(json.projects).forEach((project) => {
      if (project.implicitDependencies) {
        project.implicitDependencies = project.implicitDependencies.filter(
          (dep) => dep !== projectName
        );
      }
    });

    return json;
  });
};

const updateWorkspace = (projectName: string) => {
  return updateWorkspaceInTree(
    (workspace, context: SchematicContext, host: Tree) => {
      delete workspace.projects[projectName];
      if (
        workspace.defaultProject &&
        workspace.defaultProject === projectName
      ) {
        delete workspace.defaultProject;
        const workspacePath = getWorkspacePath(host);
        context.logger.warn(
          `Default project was removed in ${workspacePath} because it was "${projectName}". If you want a default project you should define a new one.`
        );
      }
      return workspace;
    }
  );
};

const deleteStorybookFiles = (application: string, domain: string): Rule => (
  tree: Tree,
  context: SchematicContext
) => {
  const cypressProjectFolder = `libs/${application}/${domain}/.storybook`;
  const cypressFolder = getDirInTree(tree, cypressProjectFolder);
  if (cypressFolder.subfiles.length > 0 || cypressFolder.subdirs.length > 0)
    cypressFolder.visit((file) => deleteInTree(tree, file));
  deleteInTree(
    tree,
    `libs/${application}/${domain}/.cypress/storybook-cypress.json`
  );
  return tree;
};

const deleteStorybookFolder = (application: string, domain: string): Rule => (
  tree: Tree,
  context: SchematicContext
) => {
  const cypressProjectFolder = `libs/${application}/${domain}/.storybook`;
  deleteInTree(tree, cypressProjectFolder);
  return tree;
};

const deleteE2EFiles = (application: string, domain: string): Rule => (
  tree: Tree,
  context: SchematicContext
) => {
  const cypressProjectFolder = `libs/${application}/${domain}/.cypress`;
  const cypressFolders = ['plugins', 'fixtures'];
  cypressFolders.forEach((folder) => {
    const folderPath = `${cypressProjectFolder}/src/${folder}`;
    const cypressFolder = getDirInTree(tree, folderPath);
    if (cypressFolder.subfiles.length > 0 || cypressFolder.subdirs.length > 0)
      cypressFolder.visit((file) => deleteInTree(tree, file));
    deleteInTree(tree, folderPath);
  });
  deleteInTree(tree, `${cypressProjectFolder}/cypress.json`);
  return tree;
};
