import { Tree, getWorkspaceLayout } from '@nrwl/devkit';

export const getNpmScope = (tree: Tree): string => {
  const { npmScope } = getWorkspaceLayout(tree);
  return npmScope;
};
