import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { RemoveSchematicSchema } from './schema';
import { removeDomain } from './rule/remove-domain';
import { getParsedDomain, isDomainHavingLibraryType } from '../../utils/domain';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { removeMockFileResolutionPath } from '../shared/rule/remove-mock-file-resolution-path';
import { isHavingCypressProject } from '../../utils/cypress-project';
import { removeCypressProject } from '../remove-cypress-project/rule/remove-cypress-project';
import { checkDomainExists } from '../shared/validation/check-domain-exists';
import { CypressProject } from '../shared/model/cypress-project.enum';
import { deleteDomainFolder } from '../shared/rule/delete-domain-folder';
import { deleteDomainConfigProject } from '../shared/rule/delete-domain-config-project';

export default function (options: RemoveSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext): Rule => {
    const { application, domain } = options;
    checkDomainExists(application, domain, tree);
    _context.logger.info(`Removing ${application}-${getParsedDomain(domain)}`);
    let rules: Rule[] = [];
    if (isHavingCypressProject(application, domain, CypressProject.E2E, tree)) {
      rules = rules.concat(
        removeCypressProject(application, domain, CypressProject.E2E, tree)
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
        removeCypressProject(
          application,
          domain,
          CypressProject.Storybook,
          tree
        )
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
    rules.push(deleteDomainFolder(application, domain));
    rules.push(deleteDomainConfigProject(application, domain));
    return chain(rules);
  };
}
