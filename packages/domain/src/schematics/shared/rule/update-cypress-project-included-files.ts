import { updateJsonInTree } from '@nrwl/workspace';
import { CypressProject } from '../model/cypress-project.enum';
import { Rule } from '@angular-devkit/schematics';
import { isTwoLevelDomain } from '../../../utils/domain';

export const updateCypressProjectIncludedFiles = (
  application: string,
  domain: string,
  projectType: CypressProject
): Rule[] => [
  updateJsonInTree(
    `apps/${projectType}/${application}/${domain}/tsconfig.json`,
    (json) => {
      const libsRelativePath = isTwoLevelDomain(domain)
        ? '../../../../../libs'
        : '../../../../libs';
      json.include = [
        `${libsRelativePath}/${application}/${domain}/.${projectType}/**/*.ts`,
        `${libsRelativePath}/${application}/${domain}/.${projectType}/**/*.js`,
        `${libsRelativePath}/${application}/${domain}/.cypress/**/*.ts`,
        `${libsRelativePath}/${application}/${domain}/.cypress/**/*.js`,
      ];
      return json;
    }
  ),
  updateJsonInTree(
    `apps/${projectType}/${application}/${domain}/tsconfig.e2e.json`,
    (json) => {
      delete json.include;
      return json;
    }
  ),
];
