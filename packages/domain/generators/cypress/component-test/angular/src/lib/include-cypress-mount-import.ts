import { readProjectConfiguration, Tree } from '@nrwl/devkit';

export const includeCypressMountSupport = (tree: Tree, projectName: string) => {
  const projectConfig = readProjectConfiguration(tree, projectName);
  const supportFilePath = `${projectConfig.root}/cypress/support/index.ts`;
  const supportFile = tree.read(supportFilePath).toString();
  const updatedFile = `${supportFile}import '@jscutlery/cypress-harness/support';
  (window as any)['global'] = window;`;
  tree.write(supportFilePath, updatedFile);
};
