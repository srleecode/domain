import {
  chain,
  Rule,
  Tree,
  SchematicContext,
} from '@angular-devkit/schematics';
import { RemoveCypressProjectSchematicSchema } from './schema';
import { removeE2EProject } from '../shared/rule/remove-e2e-project';
import { checkE2EProjectExists } from '../shared/validation/check-e2e-project-exists';
import { readJsonInTree, NxJson } from '@nrwl/workspace';

export default function (options: RemoveCypressProjectSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext): Rule => {
    const nxJson: NxJson = readJsonInTree(tree, 'nx.json');
    checkE2EProjectExists(options.application, options.domain, nxJson);
    return chain(removeE2EProject(options.application, options.domain));
  };
}
