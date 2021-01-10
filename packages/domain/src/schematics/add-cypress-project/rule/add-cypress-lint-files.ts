import { updateJsonInTree } from '@nrwl/workspace';
import { Rule } from '@angular-devkit/schematics';

export const addCypressLintFiles = (
  application: string,
  domain: string
): Rule =>
  updateJsonInTree(
    `libs/${application}/${domain}/.cypress/.eslintrc.json`,
    (json) => {
      json.overrides.push({
        files: ['*.ts', '*.tsx'],
        extends: ['plugin:@nrwl/nx/typescript'],
        parserOptions: {
          project: `libs/${application}/${domain}/.cypress/tsconfig.e2e.json`,
        },
        rules: {},
      });
      return json;
    }
  );
