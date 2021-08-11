import { Tree, generateFiles, updateJson } from '@nrwl/devkit';
import { join, normalize } from 'path';

export const addGlobalComponentTestingOptions = (tree: Tree): void => {
  const target = normalize('.component-testing');
  generateFiles(tree, join(__dirname, './files'), target, { tmpl: '' });
  updateJson(tree, 'tsconfig.base.json', (json) => {
    if (!json.compilerOptions) {
      json.compilerOptions = {};
      if (!json.compilerOptions.paths) {
        json.compilerOptions.paths = {};
      }
    }
    json.compilerOptions.paths[`@cypress/component-testing`] = [
      `.component-testing/global-mount-options.constant.ts`,
    ];
    return json;
  });
};
