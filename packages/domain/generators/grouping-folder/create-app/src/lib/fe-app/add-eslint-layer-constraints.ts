import { Tree } from '@nrwl/devkit';
import { updateDepConstraint } from '@srleecode/domain/shared';
import { DepConstraint } from '@nrwl/workspace/src/utils/runtime-lint-utils';

export const addEslintLayerConstraints = (tree: Tree) => {
  updateDepConstraint(tree, (depConstraints: DepConstraint[]) => {
    depConstraints.push({
      sourceTag: 'type:domain',
      onlyDependOnLibsWithTags: ['type:util'],
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
      sourceTag: 'type:shell',
      onlyDependOnLibsWithTags: [
        'type:data-access',
        'type:feature',
        'type:ui',
        'type:util',
      ],
    });
    depConstraints.push({
      sourceTag: 'type:feature',
      onlyDependOnLibsWithTags: [
        'type:data-access',
        'type:feature',
        'type:ui',
        'type:util',
      ],
    });
    depConstraints.push({
      sourceTag: 'type:api',
      onlyDependOnLibsWithTags: ['type:data-access', 'type:util'],
    });
    depConstraints.push({
      sourceTag: 'type:util',
      onlyDependOnLibsWithTags: ['type:util'],
    });
  });
};
