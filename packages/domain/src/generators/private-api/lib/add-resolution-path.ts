import { Tree, updateJson } from '@nrwl/devkit';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { getNpmScope } from '../../shared/utils/nx-json';
import { getTsConfigPath } from '../../shared/utils/tsconfig';

export const addResolutionPath = (
  application: string,
  domain: string,
  library: DomainLibraryName,
  tree: Tree
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
      `@${getNpmScope(tree)}-${application}/${domain}/private/${library}`
    ] = [`libs/${application}/${domain}/${library}/src/private-api.ts`];
    return json;
  });
