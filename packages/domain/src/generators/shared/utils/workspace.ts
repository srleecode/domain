import { Tree } from '@nrwl/devkit';

export const getWorkspacePath = (host: Tree): string => {
  const possibleFiles = ['/workspace.json', '/angular.json'];
  return possibleFiles.find((path) => host.exists(path));
};
