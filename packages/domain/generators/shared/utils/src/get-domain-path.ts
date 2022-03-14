import { Tree } from '@nrwl/devkit';
import { getNormalisedPath } from './get-normalised-path';
import { getWorkspaceLayout } from './get-workspace-layout';

export const getDomainPath = (
  tree: Tree,
  groupingFolderPath: string
): string => {
  const workspaceLayout = getWorkspaceLayout(tree);
  return (getNormalisedPath(groupingFolderPath) || '').replace(
    `${workspaceLayout.libsDir}/`,
    ''
  );
};
