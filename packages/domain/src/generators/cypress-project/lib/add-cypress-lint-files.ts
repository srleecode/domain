import { Tree, updateJson } from '@nrwl/devkit';

export const addCypressLintFiles = (
  tree: Tree,
  application: string,
  domain: string
): void =>
  updateJson(
    tree,
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
