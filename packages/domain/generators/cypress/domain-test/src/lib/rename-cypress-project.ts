import {
  addProjectConfiguration,
  readProjectConfiguration,
  removeProjectConfiguration,
  Tree,
} from '@nrwl/devkit';

// By default, the project name is set to the directory path, e.g. `test-app-test-domain-.e2e`
// This updates the format to `e2e-test-app-test-domain`
export const renameCypressProject = (
  tree: Tree,
  dasherisedFolderPath: string,
  standaloneAsDefault: boolean
): void => {
  const projectName = `${dasherisedFolderPath}-.e2e`;
  const movedProjectConfig = readProjectConfiguration(tree, projectName);
  removeProjectConfiguration(tree, projectName);
  addProjectConfiguration(
    tree,
    `e2e-${dasherisedFolderPath}`,
    movedProjectConfig,
    standaloneAsDefault
  );
};
