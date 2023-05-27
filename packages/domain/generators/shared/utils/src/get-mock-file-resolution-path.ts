import { Tree } from '@nx/devkit';
import { getDomainPath } from './get-domain-path';
import { getNpmScope } from './get-npm-scope';

export const getMockFileResolutionPath = (
  tree: Tree,
  libraryPath: string
): string => {
  const npmScope = getNpmScope(tree);
  return `${npmScope}/${getDomainPath(tree, libraryPath)}/testing`;
};
