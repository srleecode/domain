import { Rule } from '@angular-devkit/schematics';
import { updateJsonInTree } from '@nrwl/workspace';
import { isTwoLevelDomain } from '../../../utils/domain';
import { CypressProject } from '../../shared/model/cypress-project.enum';

export const updateEslintrc = (
  application: string,
  domain: string,
  projectType: CypressProject
): Rule =>
  updateJsonInTree(
    `apps/${projectType}/${application}/${domain}/.eslintrc`,
    (json) => {
      const baseRelativePath = isTwoLevelDomain(domain)
        ? '../../../../../'
        : '../../../../';
      return {
        extends: [`${baseRelativePath}.eslintrc`],
      };
    }
  );
