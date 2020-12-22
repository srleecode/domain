import {
  chain,
  Rule,
  Tree,
  SchematicContext,
} from '@angular-devkit/schematics';
import { RemoveCypressProjectSchematicSchema } from './schema';
import { removeCypressProject } from './rule/remove-cypress-project';
import { checkCypressProjectExists } from '../shared/validation/check-cypress-project-exists';
import { readJsonInTree, NxJson } from '@nrwl/workspace';
import { getParsedDomain } from '../../utils/domain';

export default function (options: RemoveCypressProjectSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext): Rule => {
    const { application, domain, projectType } = options;
    const nxJson: NxJson = readJsonInTree(tree, 'nx.json');
    checkCypressProjectExists(application, domain, projectType, nxJson);
    _context.logger.info(
      `Remove ${projectType} project from ${application}-${getParsedDomain(
        domain
      )}`
    );
    return chain(removeCypressProject(application, domain, projectType, tree));
  };
}
