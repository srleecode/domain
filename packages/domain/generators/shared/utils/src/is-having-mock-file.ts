import { readJson, Tree } from '@nx/devkit';
import { getMockFileResolutionPath } from './get-mock-file-resolution-path';

export const isHavingMockFile = (
  tree: Tree,
  libraryFolder: string
): boolean => {
  const tsConfig = readJson(tree, 'tsconfig.base.json');
  const mockFilePath = getMockFileResolutionPath(tree, libraryFolder);
  return !!tsConfig?.compilerOptions?.paths[mockFilePath];
};
