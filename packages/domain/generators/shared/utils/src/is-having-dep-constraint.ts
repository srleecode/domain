import { logger, readJson, Tree } from '@nrwl/devkit';
import { getBoundariesRule } from './get-boundaries-rule';
import { getLintFilePath } from './get-lint-file-path';
import { DepConstraint } from './model/dep-constraint.model';

export const isHavingDepContraint = (
  tree: Tree,
  sourceTag: string
): boolean => {
  const filePath = getLintFilePath(tree);
  const boundariesRule = getBoundariesRule(tree);

  if (!filePath && !boundariesRule) {
    logger.info(
      'Cannot find linting rules: linting config file does not exist'
    );
    return;
  }
  let depConstraints: DepConstraint[] = [];
  const json = readJson(tree, filePath);
  if (filePath === 'tslint.json') {
    if (json.rules[boundariesRule]) {
      depConstraints = json.rules[boundariesRule][1].depConstraints;
    }
  } else {
    if (json['overrides']) {
      const boundariesRuleIndex = json.overrides.findIndex(
        (override) => !!override.rules[boundariesRule]
      );
      depConstraints =
        json.overrides[boundariesRuleIndex].rules[boundariesRule][1]
          .depConstraints;
    }
  }
  return !!depConstraints.find(
    (depContraint) => (depContraint.sourceTag = sourceTag)
  );
};
