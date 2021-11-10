import { Tree } from '@nrwl/devkit';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { updateDepConstraint } from '../../../../../shared/utils';
import { DepConstraint } from '@nrwl/workspace/src/utils/runtime-lint-utils';

export const addEslintLayerConstraints = (tree: Tree) => {
  updateDepConstraint(tree, (depConstraints: DepConstraint[]) => {
    depConstraints.push({
      sourceTag: 'type:shell',
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
      onlyDependOnLibsWithTags: [
        'type:application',
        'type:domain',
        'type:feature',
        'type:directive',
        'type:ui',
        'type:util',
      ],
    });
    depConstraints.push({
      sourceTag: 'type:ui',
      onlyDependOnLibsWithTags: [
        'type:feature',
        'type:domain',
        'type:directive',
        'type:ui',
        'type:util',
      ],
    });
    depConstraints.push({
      sourceTag: 'type:directive',
      onlyDependOnLibsWithTags: [
        'type:application',
        'type:domain',
        'type:directive',
        'type:util',
      ],
    });
    depConstraints.push({
      sourceTag: 'type:application',
      onlyDependOnLibsWithTags: [
        'type:application',
        'type:data-access',
        'type:domain',
        'type:util',
      ],
    });
    depConstraints.push({
      sourceTag: 'type:domain',
      onlyDependOnLibsWithTags: ['type:domain'],
    });
    depConstraints.push({
      sourceTag: 'type:data-access',
      onlyDependOnLibsWithTags: [
        'type:data-access',
        'type:domain',
        'type:util',
      ],
    });
    depConstraints.push({
      sourceTag: 'type:util',
      onlyDependOnLibsWithTags: ['type:domain', 'type:util'],
    });
  });
};
