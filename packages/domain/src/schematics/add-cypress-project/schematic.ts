import {
  chain,
  Rule,
  Tree,
  SchematicContext,
} from '@angular-devkit/schematics';
import { AddCypressProjectSchematicSchema } from './schema';
import { addE2EProjectRules } from './rule/add-e2e-project-rules';
import { getLibraryTypes, getProjects } from '../../utils/domain';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { checkDomainExists } from '../shared/validation/check-domain-exists';
import { CypressProject } from '../shared/model/cypress-project.enum';
import { addStorybookProjectRules } from './rule/add-storybook-project-rules';

export default function (options: AddCypressProjectSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext): Rule => {
    const { application, domain, lint, projectType, uiFramework } = options;
    checkDomainExists(application, domain, tree);
    const existingProjectLibraryTypes = getLibraryTypes(
      application,
      domain,
      tree
    );
    const rules =
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
              existingProjectLibraryTypes,
              uiFramework
            ),
          ];
    return chain(rules);
  };
}
