import {
  chain,
  Rule,
  Tree,
  SchematicContext,
} from '@angular-devkit/schematics';
import { AddCypressProjectSchematicSchema } from './schema';
import { addE2EProjectRules } from './rule/add-e2e-project-rules';
import { getProjects } from '../../utils/domain';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { checkDomainExists } from '../shared/validation/check-domain-exists';

export default function (options: AddCypressProjectSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext): Rule => {
    const { application, domain, linter } = options;
    checkDomainExists(application, domain, tree);
    return chain([
      ...addE2EProjectRules(
        application,
        domain,
        getExistingProjectsLibraryTypes(application, domain, tree),
        linter,
        tree
      ),
    ]);
  };
}

const getExistingProjectsLibraryTypes = (
  application: string,
  domain: string,
  tree: Tree
): DomainLibraryName[] =>
  getProjects(application, domain, tree).map((project) => project.type);
