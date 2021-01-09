import { updateJsonInTree } from '@nrwl/workspace';
import { Rule } from '@angular-devkit/schematics';

export const addParentDomainDependencyRule = (
  application: string,
  parentDomain: string,
  parsedDomain: string
): Rule =>
  updateJsonInTree('.eslintrc.json', (json) => {
    const parentScope = `scope:${application}-${parentDomain}-shared`;
    const childScope = `scope:${application}-${parsedDomain}`;
    const nxModuleRulesIndex = json.overrides.findIndex(
      (override) => !!override.rules['@nrwl/nx/enforce-module-boundaries']
    );

    json.overrides[nxModuleRulesIndex].rules[
      '@nrwl/nx/enforce-module-boundaries'
    ][1].depConstraints.push({
      sourceTag: childScope,
      onlyDependOnLibsWithTags: [parentScope],
    });
    return json;
  });
