import { readProjectConfiguration, Tree, updateJson } from '@nrwl/devkit';

export const addCypressVideoScreenshotsDefaults = (
  tree: Tree,
  projectName: string
): void => {
  const projectConfig = readProjectConfiguration(tree, projectName);
  updateJson(tree, `${projectConfig.root}/cypress.json`, (json) => {
    json.videosFolder = 'cypress/videos';
    json.screenshotsFolder = 'cypress/screenshots';
    return json;
  });
};
