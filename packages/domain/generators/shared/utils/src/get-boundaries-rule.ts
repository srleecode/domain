import { Tree } from '@nrwl/devkit';

export const getBoundariesRule = (tree: Tree): string => {
  if (tree.exists('tslint.json')) {
    return 'nx-enforce-module-boundaries';
  } else if (tree.exists('.eslintrc.json')) {
    return '@nrwl/nx/enforce-module-boundaries';
  } else if (tree.exists('.eslintrc')) {
    return '@nrwl/nx/enforce-module-boundaries';
  }
  return '';
};
