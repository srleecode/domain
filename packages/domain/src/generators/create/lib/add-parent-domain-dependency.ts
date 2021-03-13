import { updateJson, Tree } from '@nrwl/devkit';
import { getParsedDomain, getTopLevelDomain } from '../../shared/utils/domain';
import { existsInTree } from '../../shared/utils/tree';

export const addParentDomainDependency = (
  tree: Tree,
  application: string,
  domain: string
): void => {
  const parentDomain = getTopLevelDomain(domain);
  const parsedDomain = getParsedDomain(domain).replace('-shared', '');
  const parentScope = `scope:${application}-${parentDomain}-shared`;
  const childScope = `scope:${application}-${parsedDomain}`;
  if (existsInTree(tree, 'tslint.json')) {
    updateJson(tree, 'tslint.json', (json) => {
      let depConstraints = [];
      if (json.rules['nx-enforce-module-boundaries']) {
        depConstraints =
          json.rules['nx-enforce-module-boundaries'][1].depConstraints;
      }

      depConstraints.push({
        sourceTag: childScope,
        onlyDependOnLibsWithTags: [parentScope],
      });
      json.rules[
        'nx-enforce-module-boundaries'
      ][1].depConstraints = depConstraints;
      return json;
    });
  } else {
    updateJson(tree, '.eslintrc.json', (json) => {
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
  }
};
