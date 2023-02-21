import { Tree, updateJson } from '@nrwl/devkit';

export const addPrefixToEslint = (
  tree: Tree,
  groupingFolder: string,
  libraryName: string,
  prefix: string
): void => {
  updateJson(
    tree,
    `${groupingFolder}/${libraryName}/.eslintrc.json`,
    (json) => {
      json.overrides[0].rules['@angular-eslint/component-selector'][1].prefix =
        prefix;
      json.overrides[0].rules['@angular-eslint/directive-selector'][1].prefix =
        prefix;
      return json;
    }
  );
};
