import { Tree } from '@nrwl/devkit';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  updateDepConstraint,
  DepConstraint,
} from '../../../../../shared/utils';

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
        'type:infrastructure',
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
      sourceTag: 'type:infrastructure',
      notDependOnLibsWithTags: [],
      onlyDependOnLibsWithTags: [
        'type:infrastructure',
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
