import { Tree } from '@nrwl/devkit';
import { moveDirectory } from '../../shared/utils/tree';

export const moveCypressFiles = (
  tree: Tree,
  application: string,
  domain: string,
  newDomain: string
): void =>
  moveDirectory(
    tree,
    `libs/${application}/${domain}/.cypress`,
    `libs/${application}/${newDomain}/.cypress`
  );
