import { getWorkspaceLayout, Tree } from '@nrwl/devkit';
import { getDomainPath } from './get-domain-path';

export const getMockFileResolutionPath = (
  tree: Tree,
  libraryPath: string
): string => {
  const { npmScope } = getWorkspaceLayout(tree);
  return `@${npmScope}/${getDomainPath(tree, libraryPath)}/testing`;
};
