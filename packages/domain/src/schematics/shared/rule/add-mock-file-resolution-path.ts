import { updateJsonInTree } from '@nrwl/workspace';
import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { getNpmScope } from '../../../utils/nx-json';
import { getTsConfigPath } from '../../../utils/tsconfig';

export const addMockFileResolutionPath = (
  application: string,
  domain: string
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
      `@${getNpmScope(tree)}-${application}/${domain}/testing`
    ] = [`libs/${application}/${domain}/util/src/testing.ts`];
    return json;
  });
