import { Tree } from '@nx/devkit';

export const getComponentFilePath = (tree: Tree, basePath: string): string => {
  let filePath = '';
  tree.children(basePath).forEach((fileName) => {
    const fullFilePath = `${basePath}/${fileName}`;
    if (fileName.endsWith('component.ts') && tree.isFile(fullFilePath)) {
      filePath = fullFilePath;
    }
  });
  return filePath;
};
