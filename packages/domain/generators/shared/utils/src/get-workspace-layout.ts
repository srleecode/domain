import {
  Tree,
  getWorkspaceLayout as devKitGetWorkspaceLayout,
} from '@nx/devkit';

export const getWorkspaceLayout = (tree: Tree) => {
  const workspaceLayout = devKitGetWorkspaceLayout(tree);
  if (workspaceLayout.appsDir === '.') {
    workspaceLayout.appsDir = 'apps';
  }
  if (workspaceLayout.libsDir === '.') {
    workspaceLayout.libsDir = 'libs';
  }
  return workspaceLayout;
};
