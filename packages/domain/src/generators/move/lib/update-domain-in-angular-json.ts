import { Tree } from '@nrwl/devkit';
import { getParsedDomain } from '../../shared/utils/domain';
import { getWorkspacePath } from '../../shared/utils/workspace';

// Not sure why this is needed, but move when there is a cypress project leads to the angular json not being updated for all the libraries, so this is being manually updated after the move
export const updateDomainInAngularJson = (
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
  const updatedWorkspaceConfigString = tree
    .read(getWorkspacePath(tree))
    .toString()
    .replace(new RegExp(escapedScope, 'g'), `${application}/${newDomain}`)
    .replace(
      new RegExp(`${application}-${getParsedDomain(domain)}`, 'g'),
      `${application}-${getParsedDomain(newDomain)}`
    );
  tree.write(getWorkspacePath(tree), updatedWorkspaceConfigString);
};
