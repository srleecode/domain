import { updateJsonInTree } from '@nrwl/workspace';
import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { existsInTree } from '../../../utils/tree';

export const addParentDomainDependencyRule = (
  application: string,
  parentDomain: string,
  parsedDomain: string
): Rule => (tree: Tree, context: SchematicContext) => {
  const parentScope = `scope:${application}-${parentDomain}-shared`;
  const childScope = `scope:${application}-${parsedDomain}`;
  if (existsInTree(tree, 'tslint.json')) {
    return updateJsonInTree('tslint.json', (json) => {
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
  }
  return updateJsonInTree('.eslintrc.json', (json) => {
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
};
