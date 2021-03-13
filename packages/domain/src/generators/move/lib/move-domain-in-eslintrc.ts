import { updateJson, Tree } from '@nrwl/devkit';
import { getParsedDomain } from '../../shared/utils/domain';
import { existsInTree } from '../../shared/utils/tree';
import { LintDepContraint } from '../../shared/model/lint-dep-constraint';

export const moveDomainInEslintrc = (
  tree: Tree,
  application: string,
  domain: string,
  newDomain: string
): void => {
  const parsedDomain = getParsedDomain(domain);
  if (existsInTree(tree, 'tslint.json')) {
    updateJson(tree, 'tslint.json', (json) => {
      if (json.rules['nx-enforce-module-boundaries']) {
        json.rules[
          'nx-enforce-module-boundaries'
        ][1].depConstraints = json.rules[
          'nx-enforce-module-boundaries'
        ][1].depConstraints.map((depConstraint) =>
          getUpdatedDepcontraint(
            depConstraint,
            application,
            parsedDomain,
            newDomain
          )
        );
      }
      return json;
    });
  } else {
    updateJson(tree, '.eslintrc.json', (json) => {
      const nxModuleRulesIndex = json.overrides.findIndex(
        (override) => !!override.rules['@nrwl/nx/enforce-module-boundaries']
      );
      json.overrides[nxModuleRulesIndex].rules[
        '@nrwl/nx/enforce-module-boundaries'
      ][1].depConstraints = json.overrides[nxModuleRulesIndex].rules[
        '@nrwl/nx/enforce-module-boundaries'
      ][1].depConstraints.map((depConstraint) =>
        getUpdatedDepcontraint(
          depConstraint,
          application,
          parsedDomain,
          newDomain
        )
      );
      return json;
    });
  }
};

const getUpdatedDepcontraint = (
  depConstraint: LintDepContraint,
  application: string,
  parsedDomain: string,
  newDomain: string
): LintDepContraint => {
  if (
    depConstraint.sourceTag.startsWith(`scope:${application}-${parsedDomain}`)
  ) {
    return {
      ...depConstraint,
      sourceTag: `scope:${application}-${getParsedDomain(newDomain)}`,
    };
  }
  return {
    ...depConstraint,
    onlyDependOnLibsWithTags: depConstraint.onlyDependOnLibsWithTags.map(
      (tag) => {
        const regex = new RegExp(`^scope:${application}-${parsedDomain}$`);
        return tag.replace(
          regex,
          `scope:${application}-${getParsedDomain(newDomain)}`
        );
      }
    ),
  };
};
