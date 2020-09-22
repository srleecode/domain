import { getExternalSchematic } from '../../../utils/testing';
import { getCypressProjectName } from '../../../utils/cypress-project';
import { Rule } from '@angular-devkit/schematics';
import { deleteCypressProjectFolder } from './delete-cypress-project-folder';
import { CypressProject } from '../model/cypress-project.enum';
import { deleteLibraryCypressFolders } from './delete-library-cypress-folders';

export const removeCypressProject = (
  application: string,
  domain: string,
  projectType: CypressProject
): Rule[] => [
  getExternalSchematic('@nrwl/workspace', 'remove', {
    projectName: getCypressProjectName(application, domain, projectType),
  }),
  deleteCypressProjectFolder(application, domain, projectType),
  deleteLibraryCypressFolders(application, domain, projectType),
];
