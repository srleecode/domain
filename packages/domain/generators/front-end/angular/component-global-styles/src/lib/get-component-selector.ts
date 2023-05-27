import { Tree } from '@nx/devkit';

export const getComponentSelector = (tree: Tree, path: string): string => {
  const file = tree.read(path).toString();
  const regExp = /selector:.*["|'|`](.*?)["|'|`]/;
  return regExp.exec(file)?.[1];
};
