import { NxJson } from '@nrwl/workspace';
import { SchematicsException } from '@angular-devkit/schematics';
import { getCypressProjectName } from '../../../utils/cypress-project';
import { CypressProject } from '../model/cypress-project.enum';

export const checkCypressProjectExists = (
  application: string,
  domain: string,
  projectType: CypressProject,
  nxJson: NxJson
): void => {
  const projectName = getCypressProjectName(application, domain, projectType);
  if (!nxJson.projects[projectName]) {
    throw new SchematicsException(`Project does not exist ${projectName}`);
  }
};
