import { updateWorkspaceInTree } from '@nrwl/workspace';
import { Rule, Tree } from '@angular-devkit/schematics';
import { getUnprocessedCypressProjectName } from '../../../utils/cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';

export const renameCypressProjectInWorkspaceJson = (
  application: string,
  domain: string,
  projectType: CypressProject
): Rule =>
  updateWorkspaceInTree((json) => {
    const projectName = getUnprocessedCypressProjectName(
      application,
      domain,
      projectType
    );
    const parsedProjectName = projectName.replace(/\//g, '-');
    json.projects[parsedProjectName] = { ...json.projects[projectName] };
    delete json.projects[projectName];
    return json;
  });
