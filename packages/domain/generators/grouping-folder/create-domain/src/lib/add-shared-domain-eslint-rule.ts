import { Tree } from '@nrwl/devkit';
import {
  getDasherizedGroupingFolder,
  updateDepConstraint,
} from '@srleecode/domain/shared/utils';

export const addSharedDomainEslintRule = (
  tree: Tree,
  baseFolder: string
): void => {
  updateDepConstraint(tree, (depConstraints) => {
    const base = getDasherizedGroupingFolder(tree, baseFolder);
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
