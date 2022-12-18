import { Tree } from '@nrwl/devkit';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { DepConstraint, updateDepConstraint } from '../../../../../shared/utils';

export const addEslintLayerConstraints = (tree: Tree) => {
  updateDepConstraint(tree, (depConstraints: DepConstraint[]) => {
    depConstraints.push({
      sourceTag: 'type:shell',
      notDependOnLibsWithTags: [],
      onlyDependOnLibsWithTags: [
        'type:application',
        'type:domain',
        'type:shell',
        'type:directive',
        'type:feature',
        'type:ui',
        'type:util',
      ],
    });
    depConstraints.push({
      sourceTag: 'type:feature',
      notDependOnLibsWithTags: [],
      onlyDependOnLibsWithTags: [
        'type:application',
        'type:shell',
        'type:domain',
        'type:feature',
        'type:directive',
        'type:ui',
        'type:util',
      ],
    });
    depConstraints.push({
      sourceTag: 'type:ui',
      notDependOnLibsWithTags: [],
      onlyDependOnLibsWithTags: [
        'type:application',
        'type:shell',
        'type:feature',
        'type:domain',
        'type:directive',
        'type:ui',
        'type:util',
      ],
    });
    depConstraints.push({
      sourceTag: 'type:directive',
      notDependOnLibsWithTags: [],
      onlyDependOnLibsWithTags: [
        'type:application',
        'type:domain',
        'type:directive',
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
