import { Tree, updateJson } from '@nrwl/devkit';
import { getTsConfigPath } from '../../shared/utils/tsconfig';

export const updateCypressTsConfigPath = (
  tree: Tree,
  application: string,
  domain: string,
  newDomain: string
): void =>
  updateJson(tree, getTsConfigPath(tree), (json) => {
    if (json.compilerOptions.paths[`@cypress/${application}/${domain}`]) {
      let tsConfigPaths = [
        ...json.compilerOptions.paths[`@cypress/${application}/${domain}`],
      ];
      tsConfigPaths = tsConfigPaths.map((path) =>
        path.replace(domain, newDomain)
      );
      json.compilerOptions.paths[
        `@cypress/${application}/${newDomain}`
      ] = tsConfigPaths;
      delete json.compilerOptions.paths[`@cypress/${application}/${domain}`];
    }
    return json;
  });
