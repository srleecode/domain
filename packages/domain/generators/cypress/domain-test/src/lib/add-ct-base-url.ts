import { Tree, updateJson } from '@nx/devkit';

export const addCtBaseUrl = (tree: Tree, projectPath: string): void =>
  updateJson(tree, `${projectPath}/cypress.json`, (json) => ({
    ...json,
    baseUrl: 'http://localhost:4400',
  }));
