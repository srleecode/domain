import { Tree } from '@nx/devkit';

export const getBoundariesRule = (tree: Tree): string => {
  if (tree.exists('tslint.json')) {
    return 'nx-enforce-module-boundaries';
  } else if (tree.exists('.eslintrc.json')) {
    return '@nx/enforce-module-boundaries';
  } else if (tree.exists('.eslintrc')) {
    return '@nx/enforce-module-boundaries';
  }
  return '';
};
