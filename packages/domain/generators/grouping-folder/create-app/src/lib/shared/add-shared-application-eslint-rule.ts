import { Tree } from '@nrwl/devkit';
import { updateDepConstraint } from '@srleecode/domain/shared';
import { FrontendFramework } from '../model/framework.enum';

export const addSharedApplicationEslintRule = (
  tree: Tree,
  language?: FrontendFramework
): void => {
  updateDepConstraint(tree, (depConstraints) => {
    const scope = language ? `${language}-shared` : 'shared';
    depConstraints.push({
      sourceTag: '*',
      onlyDependOnLibsWithTags: [`scope:${scope}`],
    });
  });
};
