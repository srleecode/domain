import { Tree } from '@nx/devkit';

export const getImplicitDependencies = (
  tree: Tree,
  groupingFolder: string,
  dasherisedFolderPath: string,
): string[] =>
  tree
    .children(groupingFolder)
    .filter(
      (folder) =>
        !tree.isFile(`${groupingFolder}/${folder}`) &&
        folder !== '.e2e' &&
        folder !== '.ct',
    )
    .map((folder) => `${dasherisedFolderPath}-${folder}`);
