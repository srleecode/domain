import { Tree, updateJson } from '@nrwl/devkit';
import { getNpmScope } from '../../shared/utils/nx-json';
import { getTsConfigPath } from '../../shared/utils/tsconfig';

export const removeMockFileResolutionPath = (
  tree: Tree,
  application: string,
  domain: string
): void =>
  updateJson(tree, getTsConfigPath(tree), (json) => {
    if (!!json.compilerOptions && !!json.compilerOptions.paths) {
      delete json.compilerOptions.paths[
        `@${getNpmScope(tree)}-${application}/${domain}/testing`
      ];
    }
    return json;
  });
