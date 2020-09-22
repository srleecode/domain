import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { RemoveSchematicSchema } from './schema';
import { removeDomain } from './rule/remove-domain';
import { isDomainHavingLibraryType } from '../../utils/domain';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { removeMockFileResolutionPath } from '../shared/rule/remove-mock-file-resolution-path';
import { isHavingCypressProject } from '../../utils/cypress-project';
import { removeCypressProject } from '../shared/rule/remove-cypress-project';
import { checkDomainExists } from '../shared/validation/check-domain-exists';
import { CypressProject } from '../shared/model/cypress-project.enum';

export default function (options: RemoveSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext): Rule => {
    const { application, domain } = options;
    checkDomainExists(application, domain, tree);
    let rules: Rule[] = [];
    if (isHavingCypressProject(application, domain, CypressProject.E2E, tree)) {
      rules = rules.concat(
        removeCypressProject(application, domain, CypressProject.E2E)
      );
    }
    if (
      isHavingCypressProject(
        application,
        domain,
        CypressProject.Storybook,
        tree
      )
    ) {
      rules = rules.concat(
        removeCypressProject(application, domain, CypressProject.Storybook)
      );
    }
    rules = rules.concat(removeDomain(application, domain, tree));
    if (
      isDomainHavingLibraryType(
        application,
        domain,
        tree,
        DomainLibraryName.Util
      )
    ) {
      rules.push(removeMockFileResolutionPath(application, domain));
    }

    return chain(rules);
  };
}
