import { Tree } from '@nrwl/devkit';
import { updateDepConstraint } from '@srleecode/domain/shared';
import { Language } from '../model/language.enum';

export const addSharedApplicationEslintRule = (
  tree: Tree,
  language?: Language
): void => {
  updateDepConstraint(tree, (depConstraints) => {
    const scope = language ? `${language}-shared` : 'shared';
    depConstraints.push({
      sourceTag: '*',
      onlyDependOnLibsWithTags: [`scope:${scope}`],
    });
  });
};
