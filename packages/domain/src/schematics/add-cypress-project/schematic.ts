import {
  chain,
  Rule,
  Tree,
  SchematicContext,
} from '@angular-devkit/schematics';
import { AddCypressProjectSchematicSchema } from './schema';
import { addE2EProjectRules } from './rule/add-e2e-project-rules';
import { getLibraryTypes, getParsedDomain } from '../../utils/domain';
import { checkDomainExists } from '../shared/validation/check-domain-exists';
import { CypressProject } from '../shared/model/cypress-project.enum';
import { addStorybookProjectRules } from './rule/add-storybook-project-rules';
import { Linter } from '@nrwl/workspace';
import { sortProjects } from '../shared/rule/sort-projects';
import { createComponentCommand } from './rule/create-command-component';
import {
  isHavingComponentCommand,
  isHavingEsLintRcJson,
} from '../../utils/cypress-project';
import { addCypressLintFiles } from './rule/add-cypress-lint-files';

export default function (options: AddCypressProjectSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext): Rule => {
    const { application, domain, projectType, addComponentCommand } = options;
    const lint = Linter.EsLint;
    checkDomainExists(application, domain, tree);
    _context.logger.info(
      `Adding ${projectType} project to ${application}-${getParsedDomain(
        domain
      )}`
    );
    const existingProjectLibraryTypes = getLibraryTypes(
      application,
      domain,
      tree
    );
    let rules =
      projectType === CypressProject.E2E
        ? [
            ...addE2EProjectRules(
              application,
              domain,
              lint,
              existingProjectLibraryTypes
            ),
          ]
        : [
            ...addStorybookProjectRules(
              application,
              domain,
              lint,
              existingProjectLibraryTypes
            ),
          ];

    rules = rules.concat(sortProjects());
    if (
      addComponentCommand &&
      !isHavingComponentCommand(application, domain, tree)
    ) {
      rules = rules.concat(
        createComponentCommand(application, domain, './files')
      );
    }
    if (isHavingEsLintRcJson(application, domain, tree)) {
      rules.push(addCypressLintFiles(application, domain));
    }
    return chain(rules);
  };
}
