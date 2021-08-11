import { getWorkspaceLayout, Tree } from '@nrwl/devkit';

export const getDasherizedGroupingFolder = (
  tree: Tree,
  groupingFolderPath: string
): string => {
  const workspaceLayout = getWorkspaceLayout(tree);
  return (groupingFolderPath || '')
    .replace(`${workspaceLayout.libsDir}/`, '')
    .replace(/\//g, '-');
};
