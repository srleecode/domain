import { SchematicContext, Tree, Rule } from '@angular-devkit/schematics';
import { updateJsonInTree } from '@nrwl/workspace';
import { getTsConfigPath } from '../../../utils/tsconfig';

export const removeCypressTsConfigPath = (
  application: string,
  domain: string
): Rule => (tree: Tree, _context: SchematicContext): Rule =>
  updateJsonInTree(getTsConfigPath(tree), (json) => {
    if (!!json.compilerOptions && !!json.compilerOptions.paths) {
      delete json.compilerOptions.paths[`@cypress/${application}/${domain}`];
    }
    return json;
  });
