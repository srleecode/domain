import { Tree } from '@nrwl/devkit';

export const checkDomainFolderIsEmpty = (
  tree: Tree,
  application: string,
  domain: string
): void => {
  const files = tree.children(`libs/${application}/${domain}`);
  if (files.length > 0) {
    throw new Error(
      `libs/${application}/${domain} already exists and it has content in it`
    );
  }
};
