import { Rule } from '@angular-devkit/schematics';
import { updateJsonInTree } from '@nrwl/workspace';
import { getParsedDomain } from '../../../utils/domain';

export const deleteDomainConfigProject = (
  application: string,
  domain: string
): Rule =>
  updateJsonInTree('domain.config.json', (json) => {
    delete json[`${application}-${getParsedDomain(domain)}`];
    return json;
  });
