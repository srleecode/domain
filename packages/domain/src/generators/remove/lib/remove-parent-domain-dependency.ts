import { Tree, updateJson } from '@nrwl/devkit';
import { getParsedDomain } from '../../shared/utils/domain';
import { existsInTree } from '../../shared/utils/tree';

export const removeParentDomainDependencyRule = (
  tree: Tree,
  application: string,
  domain: string
): void => {
  const childScope = `scope:${application}-${getParsedDomain(domain)}`;
  if (existsInTree(tree, 'tslint.json')) {
    return updateJson(tree, 'tslint.json', (json) => {
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
  return updateJson(tree, '.eslintrc.json', (json) => {
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
