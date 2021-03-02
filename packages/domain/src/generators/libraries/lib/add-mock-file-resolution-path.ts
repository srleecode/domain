import { Tree, updateJson } from '@nrwl/devkit';
import { getNpmScope } from '../../shared/utils/nx-json';
import { getTsConfigPath } from '../../shared/utils/tsconfig';

export const addMockFileResolutionPath = (
  tree: Tree,
  application: string,
  domain: string
): void =>
  updateJson(tree, getTsConfigPath(tree), (json) => {
    if (!json.compilerOptions) {
      json.compilerOptions = {};
      if (!json.compilerOptions.paths) {
        json.compilerOptions.paths = {};
      }
    }
    // Due to https://github.com/nrwl/nx/issues/2817, dash needs to be used instead of / in the path for the application
    json.compilerOptions.paths[
      `@${getNpmScope(tree)}-${application}/${domain}/testing`
    ] = [`libs/${application}/${domain}/util/src/testing.ts`];
    return json;
  });
