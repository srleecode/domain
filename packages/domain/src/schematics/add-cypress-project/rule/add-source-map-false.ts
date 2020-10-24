import { updateJsonInTree } from '@nrwl/workspace';
import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';

export const addSourceMapFalse = (application: string, domain: string): Rule =>
  updateJsonInTree(
    `libs/${application}/${domain}/.cypress/tsconfig.json`,
    (json) => {
      if (json.compilerOptions) {
        json.compilerOptions.sourceMap = false;
      }
      return json;
    }
  );
