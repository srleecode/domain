import { readProjectConfiguration, Tree, updateJson } from '@nrwl/devkit';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { getMockFileResolutionPath } from '../../../shared/utils';

export const addMockFileResolutionPath = (
  tree: Tree,
  projectName: string
): void => {
  const projectConfig = readProjectConfiguration(tree, projectName);
  const tsConfigPath = 'tsconfig.base.json';
  if (tree.exists(tsConfigPath)) {
    updateJson(tree, tsConfigPath, (json) => {
      if (!json.compilerOptions) {
        json.compilerOptions = {};
        if (!json.compilerOptions.paths) {
          json.compilerOptions.paths = {};
        }
      }
      json.compilerOptions.paths[
        getMockFileResolutionPath(tree, projectConfig.root)
      ] = [`${projectConfig.sourceRoot}/testing.ts`];
      return json;
    });
  }
};
