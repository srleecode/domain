import { getExternalSchematic } from '../../../utils/testing';
import {
  getCypressProjectName,
  isHavingCypressProject,
} from '../../../utils/cypress-project';
import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { CypressProject } from '../model/cypress-project.enum';
import {
  NxJson,
  updateWorkspaceInTree,
  getWorkspacePath,
  updateJsonInTree,
} from '@nrwl/workspace';
import { getDirInTree } from '../../../utils/tree';

export const removeCypressProject = (
  application: string,
  domain: string,
  projectType: CypressProject,
  tree: Tree
): Rule[] => {
  const projectName = getCypressProjectName(application, domain, projectType);
  const isHavingStorybookProject = isHavingCypressProject(
    application,
    domain,
    CypressProject.Storybook,
    tree
  );
  let rules: Rule[] = [];
  if (
    isHavingCypressProject(application, domain, CypressProject.E2E, tree) &&
    isHavingStorybookProject
  ) {
    // if having both cypress project types update config files but dont remove the folder as the other cypress project uses it
    rules = rules.concat([
      updateNxJson(projectName),
      updateWorkspace(projectName),
    ]);
  } else {
    rules = rules.concat([
      getExternalSchematic('@nrwl/workspace', 'remove', {
        projectName: projectName,
      }),
    ]);
  }
  if (isHavingStorybookProject) {
    rules.push(deleteStorybookFolder(application, domain));
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

const deleteStorybookFolder = (application: string, domain: string): Rule => (
  tree: Tree,
  context: SchematicContext
) => {
  const cypressProjectFolder = `libs/${application}/${domain}/.storybook`;
  const cypressFolder = getDirInTree(tree, cypressProjectFolder);
  if (cypressFolder.subfiles.length > 0 || cypressFolder.subdirs.length > 0)
    cypressFolder.visit((file) => tree.delete(file));
  tree.delete(cypressProjectFolder);
  return tree;
};
