import { SchematicsException } from '@angular-devkit/schematics';
import { Tree } from '@angular-devkit/schematics';
import { getDirInTree } from '../../../utils/tree';

export const checkDomainFolderIsEmpty = (
  application: string,
  domain: string,
  tree: Tree
): void => {
  const dir = getDirInTree(tree, `libs/${application}/${domain}`);
  if (dir.subfiles.length > 0 || dir.subdirs.length > 0)
    throw new SchematicsException(
      `libs/${application}/${domain} already exists and it has content in it`
    );
};
