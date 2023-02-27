import { Tree } from '@nrwl/devkit';
import { DepConstraint } from '@nrwl/workspace/src/utils/runtime-lint-utils';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { updateDepConstraint } from '../../../../../shared/utils';

export const addPresentationLayerEslintConstraint = (tree: Tree): void => {
  updateDepConstraint(tree, (depConstraints: DepConstraint[]) => {
    const existingDepConstraint = depConstraints.find(
      (c) => c.sourceTag === 'type:presentation'
    );
    if (!existingDepConstraint) {
      depConstraints.push({
        sourceTag: 'type:presentation',
        notDependOnLibsWithTags: [],
        onlyDependOnLibsWithTags: [
          'type:application',
          'type:domain',
          'type:presentation',
          'type:util',
        ],
      });
    }
  });
};
