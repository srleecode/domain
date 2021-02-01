import {
  SchematicContext,
  Rule,
  Tree,
  chain,
} from '@angular-devkit/schematics';
import { addIndexFile } from './rule/add-index-file';
import { addResolutionPath } from './rule/add-resolution-path';
import { AddPrivateApiSchematicSchema } from './schema';

export default function (options: AddPrivateApiSchematicSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const { application, domain, library } = options;
    return chain([
      addIndexFile(application, domain, library),
      addResolutionPath(application, domain, library),
    ]);
  };
}
