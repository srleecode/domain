import { Tree } from '@nrwl/devkit';
import { updateDepConstraint } from '@srleecode/domain/shared';

export const addSharedDomainEslintRule = (
  tree: Tree,
  baseFolder: string
): void => {
  updateDepConstraint(tree, (depConstraints) => {
    const base = baseFolder.replace('libs/', '').replace(/\//g, '-');
    const constraintScopes = [];
    tree.children(baseFolder).forEach((folder) => {
      if (!folder.startsWith('.')) {
        constraintScopes.push(`${base}-${folder}`);
      }
    });
    constraintScopes.forEach((scope) => {
      depConstraints.push({
        sourceTag: `scope:${scope}`,
        onlyDependOnLibsWithTags: [`scope:${base}-shared`],
      });
    });
  });
};
