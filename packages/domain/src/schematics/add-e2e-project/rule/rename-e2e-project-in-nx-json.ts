import { updateJsonInTree, NxJson } from '@nrwl/workspace';
import { Rule, SchematicsException } from '@angular-devkit/schematics';
import { getUnprocessedE2ECypressProjectName } from '../../../utils/e2e-project';

export const renameE2EProjectInNxJson = (
  application: string,
  domain: string
): Rule =>
  updateJsonInTree<NxJson>('nx.json', (json) => {
    const projectName = getUnprocessedE2ECypressProjectName(
      application,
      domain
    );
    const parsedProjectName = projectName.replace(/\//g, '-');
    json.projects[parsedProjectName] = { ...json.projects[projectName] };
    delete json.projects[projectName];
    return json;
  });
