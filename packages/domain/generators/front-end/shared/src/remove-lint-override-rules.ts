import { readProjectConfiguration, Tree, updateJson } from '@nx/devkit';

export const removeLintOverrideRules = (tree: Tree, projectName: string) => {
  const projectConfig = readProjectConfiguration(tree, projectName);
  updateJson(tree, `${projectConfig.root}/.eslintrc.json`, (json) => {
    json.overrides = [];
    return json;
  });
};
