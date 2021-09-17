import { Tree, updateJson } from '@nrwl/devkit';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  getDomainPath,
  getMockFileResolutionPath,
} from '../../../../shared/utils';

export const moveMockFileResolutionPath = (
  tree: Tree,
  libraryFolder: string,
  newLibraryFolder: string
): void => {
  const tsConfigPath = 'tsconfig.base.json';
  const libraryPath = getDomainPath(tree, libraryFolder);
  const newLibraryPath = getDomainPath(tree, newLibraryFolder);
  if (tree.exists(tsConfigPath)) {
    updateJson(tree, tsConfigPath, (json) => {
      if (!!json.compilerOptions && !!json.compilerOptions.paths) {
        const mockFileResolutionPath = getMockFileResolutionPath(
          tree,
          libraryPath
        );
        const fileReference =
          json.compilerOptions.paths[mockFileResolutionPath];
        delete json.compilerOptions.paths[mockFileResolutionPath];
        json.compilerOptions.paths[
          getMockFileResolutionPath(tree, newLibraryPath)
        ] = [fileReference[0].replace(libraryPath, newLibraryPath)];
      }
      return json;
    });
  }
};
