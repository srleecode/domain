import { getExternalSchematic } from '../../../utils/testing';
import {
  getCypressProjectName,
  isHavingCypressProject,
} from '../../../utils/cypress-project';
import {
  Rule,
  Tree,
  SchematicContext,
  chain,
} from '@angular-devkit/schematics';
import { CypressProject } from '../model/cypress-project.enum';
import {
  getWorkspace,
  readJsonInTree,
  NxJson,
  serializeJson,
  updateWorkspaceInTree,
  getWorkspacePath,
  updateJsonInTree,
} from '@nrwl/workspace';

export const removeCypressProject = (
  application: string,
  domain: string,
  projectType: CypressProject,
  tree: Tree
): Rule[] => {
  const projectName = getCypressProjectName(application, domain, projectType);
  let rules: Rule[] = [];
  if (
    isHavingCypressProject(application, domain, CypressProject.E2E, tree) &&
    isHavingCypressProject(application, domain, CypressProject.Storybook, tree)
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
  return rules;
};

/**
 * Updates the nx.json file to remove the project
 *
 * @param schema The options provided to the schematic
 */
function updateNxJson(projectName: string) {
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
}

/**
 * Deletes the project from the workspace file
 *
 * @param schema The options provided to the schematic
 */
function updateWorkspace(projectName: string) {
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
}
