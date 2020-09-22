import { updateJsonInTree, NxJson } from '@nrwl/workspace';
import { Rule, SchematicsException } from '@angular-devkit/schematics';
import { getUnprocessedCypressProjectName } from '../../../utils/cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';

export const renameCypressProjectInNxJson = (
  application: string,
  domain: string,
  projectType: CypressProject
): Rule =>
  updateJsonInTree<NxJson>('nx.json', (json) => {
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
