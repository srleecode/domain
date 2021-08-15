import { readProjectConfiguration, Tree } from '@nrwl/devkit';

export const removeSampleTest = (tree: Tree, projectName: string): void => {
  const projectConfig = readProjectConfiguration(tree, projectName);
  tree.delete(`${projectConfig.sourceRoot}/sample.cy-spec.ts`);
};
