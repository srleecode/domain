import { Tree, updateJson } from '@nrwl/devkit';
import { getTsConfigPath } from '../../shared/utils/tsconfig';

export const removeCypressTsConfigPath = (
  tree: Tree,
  application: string,
  domain: string
): void =>
  updateJson(tree, getTsConfigPath(tree), (json) => {
    if (!!json.compilerOptions && !!json.compilerOptions.paths) {
      delete json.compilerOptions.paths[`@cypress/${application}/${domain}`];
    }
    return json;
  });
