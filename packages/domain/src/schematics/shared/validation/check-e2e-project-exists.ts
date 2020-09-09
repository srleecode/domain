import { NxJson } from '@nrwl/workspace';
import { SchematicsException } from '@angular-devkit/schematics';
import { getE2ECypressProjectName } from '../../../utils/e2e-project';

export const checkE2EProjectExists = (
  application: string,
  domain: string,
  nxJson: NxJson
): void => {
  const projectName = getE2ECypressProjectName(application, domain);
  if (!nxJson.projects[projectName]) {
    throw new SchematicsException(`Project does not exist ${projectName}`);
  }
};
