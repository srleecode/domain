import { getExternalSchematic } from '../../../utils/testing';
import { getE2ECypressProjectName } from '../../../utils/e2e-project';
import { Rule } from '@angular-devkit/schematics';
import { deleteCypressProjectFolder } from './delete-cypress-project-folder';

export const removeE2EProject = (
  application: string,
  domain: string
): Rule[] => [
  getExternalSchematic('@nrwl/workspace', 'remove', {
    projectName: getE2ECypressProjectName(application, domain),
  }),
  deleteCypressProjectFolder(application, domain),
];
