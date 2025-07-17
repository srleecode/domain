import { readProjectConfiguration, Tree, updateJson } from '@nx/devkit';

export const removeLintOverrideRules = (tree: Tree, projectName: string) => {
  const projectConfig = readProjectConfiguration(tree, projectName);
  if (tree.exists(`${projectConfig.root}/.eslintrc.json`)) {
    updateJson(tree, `${projectConfig.root}/.eslintrc.json`, (json) => {
      json.overrides = [];
      return json;
    });
  }
};
