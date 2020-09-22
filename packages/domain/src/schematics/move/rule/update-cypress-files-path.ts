import { updateJsonInTree } from '@nrwl/workspace';
import { getCypressJsonPath } from '../../../utils/cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { Rule } from '@angular-devkit/schematics';

export const updateCypressFilesPath = (
  application: string,
  domain: string,
  newDomain: string,
  projectType: CypressProject
): Rule =>
  updateJsonInTree(
    getCypressJsonPath(application, newDomain, projectType),
    (json) => {
      json.fixturesFolder = json.fixturesFolder.replace(
        `${application}/${domain}`,
        `${application}/${newDomain}`
      );
      json.integrationFolder = json.integrationFolder.replace(
        `${application}/${domain}`,
        `${application}/${newDomain}`
      );
      json.pluginsFile = json.pluginsFile.replace(
        `${application}/${domain}`,
        `${application}/${newDomain}`
      );
      json.supportFile = json.supportFile.replace(
        `${application}/${domain}`,
        `${application}/${newDomain}`
      );
      return json;
    }
  );
