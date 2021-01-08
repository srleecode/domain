import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { MoveSchematicSchema } from './schema';
import { moveDomain } from './rule/move-domain';
import {
  getLibraryTypes,
  getParsedDomain,
  isDomainHavingLibraryType,
} from '../../utils/domain';
import { checkDomainDoesntExist } from '../shared/validation/check-domain-doesnt-exist';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { addMockFileResolutionPath } from '../shared/rule/add-mock-file-resolution-path';
import { removeMockFileResolutionPath } from '../shared/rule/remove-mock-file-resolution-path';
import {
  getCypressProjectLinter,
  getStorybookProjectUiFramework,
  isHavingCypressProject,
} from '../../utils/cypress-project';
import { checkDomainExists } from '../shared/validation/check-domain-exists';
import { CypressProject } from '../shared/model/cypress-project.enum';
import { deleteDomainFolder } from '../shared/rule/delete-domain-folder';
import { removeCypressProject } from '../remove-cypress-project/rule/remove-cypress-project';
import { addE2EProjectRules } from '../add-cypress-project/rule/add-e2e-project-rules';
import { addStorybookProjectRules } from '../add-cypress-project/rule/add-storybook-project-rules';
import { UiFrameworkType } from '../shared/model/ui-framework.type';
import { sortProjects } from '../shared/rule/sort-projects';

export default function (options: MoveSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext): Rule => {
    const { application, domain, newDomain } = options;
    checkDomainExists(application, domain, tree);
    checkDomainDoesntExist(application, newDomain, tree);
    _context.logger.info(
      `Moving ${application}-${getParsedDomain(
        domain
      )} to ${application}-${getParsedDomain(newDomain)}`
    );
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
      const linter = getCypressProjectLinter(
        application,
        domain,
        CypressProject.E2E,
        tree
      );
      rules = rules.concat(
        removeCypressProject(application, domain, CypressProject.E2E, tree)
      );
      const existingProjectLibraryTypes = getLibraryTypes(
        application,
        domain,
        tree
      );
      rules = rules.concat(
        addE2EProjectRules(
          application,
          newDomain,
          linter,
          existingProjectLibraryTypes
        )
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
      const existingProjectLibraryTypes = getLibraryTypes(
        application,
        domain,
        tree
      );
      const linter = getCypressProjectLinter(
        application,
        domain,
        CypressProject.Storybook,
        tree
      );
      const uiFramework: UiFrameworkType = getStorybookProjectUiFramework(
        application,
        domain,
        tree
      );
      rules = rules.concat(
        removeCypressProject(
          application,
          domain,
          CypressProject.Storybook,
          tree
        )
      );
      rules = rules.concat(
        addStorybookProjectRules(
          application,
          newDomain,
          linter,
          existingProjectLibraryTypes,
          uiFramework
        )
      );
    }
    rules = rules.concat([
      deleteDomainFolder(application, domain),
      ...sortProjects(),
    ]);
    return chain(rules);
  };
}
