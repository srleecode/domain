import { SchematicContext, Tree, Rule } from '@angular-devkit/schematics';
import { updateJsonInTree } from '@nrwl/workspace';
import { getTsConfigPath } from '../../..//utils/tsconfig';
import { getNpmScope } from '../../../utils/nx-json';

export const removeMockFileResolutionPath = (
  application: string,
  domain: string
): Rule => (tree: Tree, _context: SchematicContext): Rule =>
  updateJsonInTree(getTsConfigPath(tree), (json) => {
    if (!!json.compilerOptions && !!json.compilerOptions.paths) {
      delete json.compilerOptions.paths[
        `@${getNpmScope(tree)}-${application}/${domain}/testing`
      ];
    }
    return json;
  });
