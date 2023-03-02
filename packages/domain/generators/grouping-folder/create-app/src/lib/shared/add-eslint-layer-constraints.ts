import { Tree } from '@nrwl/devkit';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { updateDepConstraint } from '../../../../../shared/utils';
import { DepConstraint } from '@nrwl/workspace/src/utils/runtime-lint-utils';

export const addEslintLayerConstraints = (tree: Tree) => {
  updateDepConstraint(tree, (depConstraints: DepConstraint[]) => {
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
    depConstraints.push({
      sourceTag: 'type:application',
      notDependOnLibsWithTags: [],
      onlyDependOnLibsWithTags: [
        'type:application',
        'type:data-access',
        'type:domain',
        'type:util',
      ],
    });
    depConstraints.push({
      sourceTag: 'type:domain',
      notDependOnLibsWithTags: [],
      onlyDependOnLibsWithTags: ['type:domain'],
    });
    depConstraints.push({
      sourceTag: 'type:data-access',
      notDependOnLibsWithTags: [],
      onlyDependOnLibsWithTags: [
        'type:data-access',
        'type:domain',
        'type:util',
      ],
    });
    depConstraints.push({
      sourceTag: 'type:util',
      notDependOnLibsWithTags: [],
      onlyDependOnLibsWithTags: ['type:domain', 'type:util'],
    });
  });
};
