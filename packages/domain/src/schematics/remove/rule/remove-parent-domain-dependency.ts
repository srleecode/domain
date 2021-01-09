import { updateJsonInTree } from '@nrwl/workspace';
import { Rule } from '@angular-devkit/schematics';
import { getParsedDomain } from '../../..//utils/domain';

export const removeParentDomainDependencyRule = (
  application: string,
  domain: string
): Rule =>
  updateJsonInTree('.eslintrc.json', (json) => {
    const childScope = `scope:${application}-${getParsedDomain(domain)}`;
    const nxModuleRulesIndex = json.overrides.findIndex(
      (override) => !!override.rules['@nrwl/nx/enforce-module-boundaries']
    );

    const rules =
      json.overrides[nxModuleRulesIndex].rules[
        '@nrwl/nx/enforce-module-boundaries'
      ];
    const depedencyRuleIndex = rules.findIndex(
      (rule) => rule.sourceTag === childScope
    );
    json.overrides[nxModuleRulesIndex].rules[
      '@nrwl/nx/enforce-module-boundaries'
    ][1].depConstraints.splice(depedencyRuleIndex, 1);
    return json;
  });
