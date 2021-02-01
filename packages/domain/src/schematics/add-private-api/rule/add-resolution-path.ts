import { updateJsonInTree } from '@nrwl/workspace';
import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { getNpmScope } from '../../../utils/nx-json';
import { getTsConfigPath } from '../../../utils/tsconfig';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';

export const addResolutionPath = (
  application: string,
  domain: string,
  library: DomainLibraryName
): Rule => (tree: Tree, _context: SchematicContext): Rule =>
  updateJsonInTree(getTsConfigPath(tree), (json) => {
    if (!json.compilerOptions) {
      json.compilerOptions = {};
      if (!json.compilerOptions.paths) {
        json.compilerOptions.paths = {};
      }
    }
    // Due to https://github.com/nrwl/nx/issues/2817, dash needs to be used instead of / in the path for the application
    json.compilerOptions.paths[
      `@${getNpmScope(tree)}/${application}/${domain}/private/${library}`
    ] = [`libs/${application}/${domain}/${library}/src/private-api.ts`];
    return json;
  });
