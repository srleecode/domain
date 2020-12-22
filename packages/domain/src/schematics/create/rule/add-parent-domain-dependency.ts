import { updateJsonInTree } from '@nrwl/workspace';
import { Rule } from '@angular-devkit/schematics';

export const addParentDomainDependencyRule = (
  application: string,
  parentDomain: string,
  parsedDomain: string
): Rule =>
  updateJsonInTree('tslint.json', (json) => {
    const depConstraints = [];
    if (json.rules['nx-enforce-module-boundaries']) {
      json.rules['nx-enforce-module-boundaries'][1].depConstraints;
    }
    const parentScope = `scope:${application}-${parentDomain}-shared`;
    const childScope = `scope:${application}-${parsedDomain}`;
    depConstraints.push({
      sourceTag: childScope,
      onlyDependOnLibsWithTags: [parentScope],
    });
    json.rules[
      'nx-enforce-module-boundaries'
    ][1].depConstraints = depConstraints;
    return json;
  });
