import { Tree } from '@nx/devkit';

// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  updateDepConstraint,
  DepConstraint,
} from '../../../../../shared/utils';

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
