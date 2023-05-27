import { Tree } from '@nx/devkit';

export const getLintFilePath = (tree: Tree): string => {
  if (tree.exists('tslint.json')) {
    return 'tslint.json';
  } else if (tree.exists('.eslintrc.json')) {
    return '.eslintrc.json';
  } else if (tree.exists('.eslintrc')) {
    return '.eslintrc';
  }
  return '';
};
