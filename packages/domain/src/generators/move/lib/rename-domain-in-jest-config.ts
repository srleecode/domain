import { Tree } from '@nrwl/devkit';

export const renameDomainInJestConfig = (
  tree: Tree,
  application: string,
  domain: string,
  newDomain: string
): void => {
  const escapeSlashRegExp = /\//g;
  const escapedScope = `${application}/${domain}`.replace(
    escapeSlashRegExp,
    '\\/'
  );
  const updatedJestConfigString = tree
    .read('jest.config.js')
    .toString()
    .replace(new RegExp(escapedScope, 'g'), `${application}/${newDomain}`);
  tree.write('jest.config.js', updatedJestConfigString);
};
