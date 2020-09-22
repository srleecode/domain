import {
  Linter,
  deleteFile,
  updateJsonInTree,
  updateWorkspaceInTree,
} from '@nrwl/workspace';
import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { removeDevServerTargets } from './remove-dev-server-target';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { addImplicitDependenciesToCypressProject } from '../../shared/rule/add-implicit-dependencies-to-cypress-project';
import { renameCypressProjectInNxJson } from './rename-cypress-project-in-nx-json';
import { renameCypressProjectInWorkspaceJson } from './rename-cypress-project-in-workspace-json';
import { createCypressProject } from './create-cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import {
  getCypressProjectName,
  getCypressJsonPath,
} from '../../../utils/cypress-project';
import { deleteInTree } from '../../../utils/tree';
import { getParsedDomain } from 'packages/domain/src/utils/domain';

export const addE2EProjectRules = (
  application: string,
  domain: string,
  libraries: DomainLibraryName[],
  projectType: CypressProject,
  linter: Linter,
  tree: Tree
): Rule[] => {
  const cypressProjectName = getCypressProjectName(
    application,
    domain,
    projectType
  );

  return [
    createCypressProject(application, domain, projectType, linter),
    removeUnneededFiles(application, domain, projectType),
    addBaseUrlToCypressConfig(application, domain, projectType),
    // updateAngularJsonBuilder(cypressProjectName, schema.name),
  ];
};

const removeUnneededFiles = (
  application: string,
  domain: string,
  projectType: CypressProject
): Rule => (tree: Tree, context: SchematicContext): Tree => {
  const directory = `apps/${projectType}/${application}/${getParsedDomain(
    domain
  )}`;
  deleteInTree(tree, `${directory}/integration`);
  deleteInTree(tree, `${directory}/support/app.po.ts`);
  return tree;
};

const addBaseUrlToCypressConfig = (
  application: string,
  domain: string,
  projectType: CypressProject
): Rule =>
  updateJsonInTree(
    getCypressJsonPath(application, domain, projectType),
    (json) => {
      json.baseUrl = 'http://localhost:4400';
      return json;
    }
  );

/*function updateAngularJsonBuilder(
  application: string,
  domain: string,
  projectType: CypressProject,
  targetProjectName
): Rule {
  return updateWorkspaceInTree((workspace) => {
    const project = workspace.projects[e2eProjectName];
    const e2eTarget = project.architect['e2e'];
    project.architect['e2e'] = {
      ...e2eTarget,
      options: <any>{
        ...e2eTarget.options,
        devServerTarget: `${targetProjectName}:storybook`,
      },
      configurations: {
        ci: {
          devServerTarget: `${targetProjectName}:storybook:ci`,
        },
      },
    };
    return workspace;
  });
}
*/
