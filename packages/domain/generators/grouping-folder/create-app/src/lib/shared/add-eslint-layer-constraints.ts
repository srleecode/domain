import { Tree } from '@nrwl/devkit';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { updateDepConstraint } from '../../../../../shared/utils';
import { DepConstraint } from '@nrwl/workspace/src/utils/runtime-lint-utils';

export const addEslintLayerConstraints = (tree: Tree) => {
  updateDepConstraint(tree, (depConstraints: DepConstraint[]) => {
    depConstraints.push({
      sourceTag: 'type:shell',
      onlyDependOnLibsWithTags: [
        'type:application-layer',
        'type:shell',
        'type:feature',
        'type:ui',
        'type:util',
      ],
    });
    depConstraints.push({
      sourceTag: 'type:feature',
      onlyDependOnLibsWithTags: [
        'type:application-layer',
        'type:feature',
        'type:ui',
        'type:util',
      ],
    });
    depConstraints.push({
      sourceTag: 'type:ui',
      onlyDependOnLibsWithTags: ['type:feature', 'type:ui', 'type:util'],
    });
    depConstraints.push({
      sourceTag: 'type:application-layer',
      onlyDependOnLibsWithTags: [
        'type:application-layer',
        'type:data-access-layer',
        'type:domain-layer',
        'type:util',
      ],
    });
    depConstraints.push({
      sourceTag: 'type:domain-layer',
      onlyDependOnLibsWithTags: ['type:domain-layer', 'type:util'],
    });
    depConstraints.push({
      sourceTag: 'type:data-access-layer',
      onlyDependOnLibsWithTags: ['type:data-access-layer', 'type:util'],
    });
    depConstraints.push({
      sourceTag: 'type:util',
      onlyDependOnLibsWithTags: ['type:util'],
    });
  });
};
