import { Rule } from '@angular-devkit/schematics';
import { updateJsonInTree } from '@nrwl/workspace';
import { getParsedDomain } from '../../../utils/domain';

export const moveDomainConfigProject = (
  application: string,
  oldDomain: string,
  newDomain: string
): Rule =>
  updateJsonInTree('domain.config.json', (json) => {
    const oldDomainName = `${application}-${getParsedDomain(oldDomain)}`;
    const newDomainName = `${application}-${getParsedDomain(newDomain)}`;
    json[newDomainName] = json[oldDomainName];
    delete json[oldDomainName];
    return json;
  });
