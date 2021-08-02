import { Tree } from '@nrwl/devkit';
import { Language } from '../model/language.enum';

export const isAngularAppFolderExisting = (tree: Tree): boolean => {
  return tree
    .children('libs')
    .some((appGroupingFolder) =>
      appGroupingFolder.startsWith(Language.Angular.toString())
    );
};
