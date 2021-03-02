import { Tree } from '@nrwl/devkit';
import { moveDirectory } from '../../shared/utils/tree';

export const moveStorybookFiles = (
  tree: Tree,
  application: string,
  domain: string,
  newDomain: string
): void =>
  moveDirectory(
    tree,
    `libs/${application}/${domain}/.storybook`,
    `libs/${application}/${newDomain}/.storybook`
  );
