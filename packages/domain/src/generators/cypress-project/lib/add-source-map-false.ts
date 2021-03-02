import { Tree, updateJson } from '@nrwl/devkit';

export const addSourceMapFalse = (
  tree: Tree,
  application: string,
  domain: string
): void =>
  updateJson(
    tree,
    `libs/${application}/${domain}/.cypress/tsconfig.json`,
    (json) => {
      if (json.compilerOptions) {
        json.compilerOptions.sourceMap = false;
      }
      return json;
    }
  );
