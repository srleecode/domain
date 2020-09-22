import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { MoveSchematicSchema } from './schema';
import { moveDomain } from './rule/move-domain';
import { isDomainHavingLibraryType } from '../../utils/domain';
import { checkDomainDoesntExist } from '../shared/validation/check-domain-doesnt-exist';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { addMockFileResolutionPath } from '../shared/rule/add-mock-file-resolution-path';
import { removeMockFileResolutionPath } from '../shared/rule/remove-mock-file-resolution-path';
import { isHavingCypressProject } from '../../utils/cypress-project';
import { moveCypressProject } from './rule/move-cypress-project';
import { checkDomainExists } from '../shared/validation/check-domain-exists';
import { CypressProject } from '../shared/model/cypress-project.enum';

export default function (options: MoveSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext): Rule => {
    const { application, domain, newDomain } = options;
    checkDomainExists(application, domain, tree);
    checkDomainDoesntExist(application, newDomain, tree);

    let rules = moveDomain(application, domain, newDomain, tree);

    if (
      isDomainHavingLibraryType(
        application,
        domain,
        tree,
        DomainLibraryName.Util
      )
    ) {
      rules.push(addMockFileResolutionPath(application, newDomain));
      rules.push(removeMockFileResolutionPath(application, domain));
    }
    if (isHavingCypressProject(application, domain, CypressProject.E2E, tree)) {
      rules = rules.concat(
        moveCypressProject(application, domain, newDomain, CypressProject.E2E)
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
        moveCypressProject(
          application,
          domain,
          newDomain,
          CypressProject.Storybook
        )
      );
    }
    return chain(rules);
  };
}
