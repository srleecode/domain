import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { createInTree } from '../../../utils/tree';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';

export const addIndexFile = (
  application: string,
  domain: string,
  library: DomainLibraryName
): Rule => (tree: Tree, _context: SchematicContext) =>
  createInTree(
    tree,
    `libs/${application}/${domain}/${library}/src/private-api.ts`,
    ''
  );
