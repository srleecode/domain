import { Tree } from '@nrwl/devkit';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { createInTree } from '../../shared/utils/tree';

export const addIndexFile = (
  application: string,
  domain: string,
  library: DomainLibraryName,
  tree: Tree
): void =>
  createInTree(
    tree,
    `libs/${application}/${domain}/${library}/src/private-api.ts`,
    ''
  );
