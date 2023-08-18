import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';

export const addImplicitDependencies = (
  tree: Tree,
  projectName: string,
  groupingFolder: string,
  dasherisedFolderPath: string
): void => {
  const projectConfig = readProjectConfiguration(tree, projectName);
  const implicitDependencies = tree
    .children(groupingFolder)
    .filter(
      (folder) =>
        !tree.isFile(`${groupingFolder}/${folder}`) &&
        folder !== '_e2e' &&
        folder !== '_ct'
    )
    .map((folder) => `${dasherisedFolderPath}-${folder}`);
  projectConfig.implicitDependencies = implicitDependencies;
  updateProjectConfiguration(tree, projectName, projectConfig);
};
