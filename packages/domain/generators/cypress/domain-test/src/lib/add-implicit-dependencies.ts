import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';

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
        !tree.isFile(`${groupingFolder}/${folder}`) && folder !== '.e2e'
    )
    .map((folder) => `${dasherisedFolderPath}-${folder}`);
  projectConfig.implicitDependencies = implicitDependencies;
  updateProjectConfiguration(tree, projectName, projectConfig);
};
