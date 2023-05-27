import { logger, Tree, updateJson } from '@nx/devkit';
import { DepConstraint } from './model/dep-constraint';
import { getBoundariesRule } from './get-boundaries-rule';
import { getLintFilePath } from './get-lint-file-path';

export function removeDepConstraint(tree: Tree, sourceTag: string) {
  const filePath = getLintFilePath(tree);
  const boundariesRule = getBoundariesRule(tree);

  if (!filePath && !boundariesRule) {
    logger.info(
      'Cannot find linting rules: linting config file does not exist'
    );
    return;
  }

  if (filePath === 'tslint.json') {
    updateJson(tree, filePath, (json) => {
      let depConstraints: DepConstraint[] = [];
      if (json.rules[boundariesRule]) {
        depConstraints = json.rules[boundariesRule][1].depConstraints;
      }
      json.rules[boundariesRule][1].depConstraints = depConstraints.filter(
        (constraint) => constraint.sourceTag !== sourceTag
      );
      return json;
    });
  } else {
    updateJson(tree, filePath, (json) => {
      if (json['overrides']) {
        const boundariesRuleIndex = json.overrides.findIndex(
          (override) => !!override.rules[boundariesRule]
        );
        const depConstraints: DepConstraint[] =
          json.overrides[boundariesRuleIndex].rules[boundariesRule][1]
            .depConstraints;
        json.overrides[boundariesRuleIndex].rules[
          boundariesRule
        ][1].depConstraints = depConstraints.filter(
          (constraint) => constraint.sourceTag !== sourceTag
        );
      }
      return json;
    });
  }
}
