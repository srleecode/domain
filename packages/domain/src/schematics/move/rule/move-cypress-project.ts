import { Rule, Tree } from '@angular-devkit/schematics';
import { getParsedDomain } from '../../../utils/domain';
import { getExternalSchematic } from '../../../utils/testing';
import { deleteCypressProjectFolder } from '../../shared/rule/delete-cypress-project-folder';

export const moveCypressProject = (
  application: string,
  domain: string,
  newDomain: string
): Rule[] => [
  getExternalSchematic('@nrwl/workspace', 'move', {
    projectName: `e2e-${application}-${getParsedDomain(domain)}`,
    destination: `e2e/${application}/${newDomain}`,
  }),
  deleteCypressProjectFolder(application, domain),
];
