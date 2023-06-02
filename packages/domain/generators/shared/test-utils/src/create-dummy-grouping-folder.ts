import { Tree } from '@nrwl/devkit';

// Creating a file is the only to create a directory in Tree
// This adds a dummy file to create the grouping folder directories
export const createDummyGroupingFolder = (
  tree: Tree,
  goroupingFolder: string
) => {
  tree.write(`${goroupingFolder}/dummyFile`, '');
};
