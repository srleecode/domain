import {
  Tree,
  getWorkspaceLayout as devKitGetWorkspaceLayout,
} from '@nrwl/devkit';

export const getWorkspaceLayout = (tree: Tree) => {
  const workspaceLayout = devKitGetWorkspaceLayout(tree);
  if (!workspaceLayout.npmScope.startsWith('@')) {
    workspaceLayout.npmScope = `@${workspaceLayout.npmScope}`;
  }
  return workspaceLayout;
};
