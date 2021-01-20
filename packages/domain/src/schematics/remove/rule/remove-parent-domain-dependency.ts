import { updateJsonInTree } from '@nrwl/workspace';
import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { getParsedDomain } from '../../..//utils/domain';
import { existsInTree } from '../../../utils/tree';

export const removeParentDomainDependencyRule = (
  application: string,
  domain: string
): Rule => (tree: Tree, context: SchematicContext) => {
  const childScope = `scope:${application}-${getParsedDomain(domain)}`;
  if (existsInTree(tree, 'tslint.json')) {
    return updateJsonInTree('tslint.json', (json) => {
      let depConstraints = [];
      if (json.rules['nx-enforce-module-boundaries']) {
        depConstraints =
          json.rules['nx-enforce-module-boundaries'][1].depConstraints;
      }
      const depedencyRuleIndex = depConstraints.findIndex(
        (rule) => rule.sourceTag === childScope
      );
      json.rules['nx-enforce-module-boundaries'][1].depConstraints.splice(
        depedencyRuleIndex,
        1
      );
      return json;
    });
  }
  return updateJsonInTree('.eslintrc.json', (json) => {
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
};
