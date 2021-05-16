import { Tree } from '@nrwl/devkit';
import { copyDirectory } from '../../shared/utils/tree';

export const copyStorybookFiles = (
  tree: Tree,
  application: string,
  domain: string,
  newDomain: string
): void =>
  copyDirectory(
    tree,
    `libs/${application}/${domain}/.storybook`,
    `libs/${application}/${newDomain}/.storybook`
  );
