import { updateJson, Tree } from '@nrwl/devkit';
import { LintDepContraint } from '../../shared/model/lint-dep-constraint';
import { getParsedDomain } from '../../shared/utils/domain';
import { existsInTree } from '../../shared/utils/tree';

export const removeDomainInEslintrc = (
  tree: Tree,
  application: string,
  domain: string
): void => {
  const parsedDomain = getParsedDomain(domain);
  if (existsInTree(tree, 'tslint.json')) {
    updateJson(tree, 'tslint.json', (json) => {
      if (json.rules['nx-enforce-module-boundaries']) {
        json.rules[
          'nx-enforce-module-boundaries'
        ][1].depConstraints = json.rules[
          'nx-enforce-module-boundaries'
        ][1].depConstraints
          .filter(
            (depConstraint: LintDepContraint) =>
              !depConstraint.sourceTag.startsWith(
                `scope:${application}-${parsedDomain}`
              )
          )
          .map((depConstraint: LintDepContraint) =>
            getUpdatedDepcontraint(depConstraint, application, parsedDomain)
          )
          .filter(
            (depConstraint: LintDepContraint) =>
              depConstraint.onlyDependOnLibsWithTags.length > 0
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
      ][1].depConstraints
        .filter(
          (depConstraint) =>
            !depConstraint.sourceTag.startsWith(
              `scope:${application}-${parsedDomain}`
            )
        )
        .map((depConstraint) =>
          getUpdatedDepcontraint(depConstraint, application, parsedDomain)
        )
        .filter(
          (depConstraint: LintDepContraint) =>
            depConstraint.onlyDependOnLibsWithTags.length > 0
        );
      return json;
    });
  }
};

const getUpdatedDepcontraint = (
  depConstraint: LintDepContraint,
  application: string,
  parsedDomain: string
): LintDepContraint => {
  return {
    ...depConstraint,
    onlyDependOnLibsWithTags: depConstraint.onlyDependOnLibsWithTags.filter(
      (tag) => tag !== `scope:${application}-${parsedDomain}`
    ),
  };
};
