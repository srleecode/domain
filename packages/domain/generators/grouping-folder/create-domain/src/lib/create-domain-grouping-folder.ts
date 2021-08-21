import { Tree } from '@nrwl/devkit';

export const createDomainGroupingFolder = (
  tree: Tree,
  folderPath: string
): void => {
  // Tree doesn't have any way to directly create folder, so it is creating a dummy file and then deleting it this will leave a residual folder
  const dummyFile = `${folderPath}/dummy-file`;
  tree.write(dummyFile, '');
  tree.delete(dummyFile);
};
