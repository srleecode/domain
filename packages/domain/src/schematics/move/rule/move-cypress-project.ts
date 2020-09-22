import { Rule, Tree } from '@angular-devkit/schematics';
import { getParsedDomain } from '../../../utils/domain';
import { getExternalSchematic } from '../../../utils/testing';
import { deleteCypressProjectFolder } from '../../shared/rule/delete-cypress-project-folder';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { updateCypressFilesPath } from './update-cypress-files-path';

export const moveCypressProject = (
  application: string,
  domain: string,
  newDomain: string,
  projectType: CypressProject
): Rule[] => [
  getExternalSchematic('@nrwl/workspace', 'move', {
    projectName: `${projectType}-${application}-${getParsedDomain(domain)}`,
    destination: `${projectType}/${application}/${newDomain}`,
  }),
  updateCypressFilesPath(application, domain, newDomain, projectType),
  deleteCypressProjectFolder(application, domain, projectType),
];
