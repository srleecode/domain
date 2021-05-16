import { Tree } from '@nrwl/devkit';
import { copyDirectory } from '../../shared/utils/tree';

export const copyCypressFiles = (
  tree: Tree,
  application: string,
  domain: string,
  newDomain: string
): void =>
  copyDirectory(
    tree,
    `libs/${application}/${domain}/.cypress`,
    `libs/${application}/${newDomain}/.cypress`
  );
