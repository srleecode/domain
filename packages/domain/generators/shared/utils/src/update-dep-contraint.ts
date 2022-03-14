import { logger, Tree, updateJson } from '@nrwl/devkit';
import { DepConstraint } from '@nrwl/workspace/src/utils/runtime-lint-utils';
import { getBoundariesRule } from './get-boundaries-rule';
import { getLintFilePath } from './get-lint-file-path';

export function updateDepConstraint(
  tree: Tree,
  update: (depConstraints: DepConstraint[]) => void
) {
  const filePath = getLintFilePath(tree);
  const boundariesRule = getBoundariesRule(tree);

  if (!filePath && !boundariesRule) {
    logger.info('Cannot add linting rules: linting config file does not exist');
    return;
  }

  if (filePath === 'tslint.json') {
    updateJson(tree, filePath, (json) => {
      let depConstraints = [];
      if (json.rules[boundariesRule]) {
        depConstraints = json.rules[boundariesRule][1].depConstraints;
      }
      update(depConstraints);
      json.rules[boundariesRule][1].depConstraints =
        getDedupedDepConstraints(depConstraints);
      return json;
    });
  } else {
    updateJson(tree, filePath, (json) => {
      if (json['overrides']) {
        const boundariesRuleIndex = json.overrides.findIndex(
          (override) => !!override.rules[boundariesRule]
        );
        const depConstraints =
          json.overrides[boundariesRuleIndex].rules[boundariesRule][1]
            .depConstraints;
        update(depConstraints);
        json.overrides[boundariesRuleIndex].rules[
          boundariesRule
        ][1].depConstraints = getDedupedDepConstraints(depConstraints);
      }
      return json;
    });
  }
}

const getDedupedDepConstraints = (
  depConstraints: DepConstraint[]
): DepConstraint[] => {
  const depConstraintsMap = new Map<string, string[]>();
  depConstraints.forEach((depConstraint) => {
    let onlyDependOnLibsWithTags = depConstraint.onlyDependOnLibsWithTags;
    const foundOnlyDependOnLibsWithTags = depConstraintsMap.get(
      depConstraint.sourceTag
    );
    if (foundOnlyDependOnLibsWithTags) {
      onlyDependOnLibsWithTags = [
        ...new Set([
          ...foundOnlyDependOnLibsWithTags,
          ...onlyDependOnLibsWithTags,
        ]),
      ];
    }
    depConstraintsMap.set(depConstraint.sourceTag, onlyDependOnLibsWithTags);
  });
  return [...depConstraintsMap.entries()].map(
    ([key, value]: [string, string[]]): DepConstraint => ({
      sourceTag: key,
      onlyDependOnLibsWithTags: value,
      notDependOnLibsWithTags: [],
    })
  );
};
