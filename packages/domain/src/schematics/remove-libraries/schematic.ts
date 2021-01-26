import {
  chain,
  Rule,
  SchematicsException,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { RemoveLibrariesSchematicSchema } from './schema';
import { checkLibrariesExist } from './validation/check-libraries-exist';
import { removeLibrariesRules } from './rule/remove-libraries';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { removeMockFileResolutionPath } from '../shared/rule/remove-mock-file-resolution-path';
import {
  isHavingImplicitDependenciesAfterRemoval,
  isHavingCypressProject,
} from '../../utils/cypress-project';
import { removeCypressProject } from '../remove-cypress-project/rule/remove-cypress-project';
import { removeCypressProjectImplicitDependencies } from '../shared/rule/remove-cypress-project-implicit-dependencies';
import {
  getParsedDomain,
  isDomainEmptyAfterLibraryRemoval,
} from '../../utils/domain';
import { deleteDomainFolder } from '../shared/rule/delete-domain-folder';
import { CypressProject } from '../shared/model/cypress-project.enum';
import { updatePathInStorybookConfig } from '../shared/rule/update-path-in-storybook-config';
import { getParsedLibraries } from '../../utils/libraries';
import { deleteDomainConfigProject } from '../shared/rule/delete-domain-config-project';

export default function (options: RemoveLibrariesSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext): Rule => {
    const { application, domain } = options;
    const libraries = getParsedLibraries(options.libraries);
    if (libraries.length === 0) {
      throw new SchematicsException('At least one library should be provided');
    }
    _context.logger.info(
      `Removing ${libraries} from ${application}-${getParsedDomain(domain)}`
    );
    checkLibrariesExist(application, domain, libraries, tree);
    let rules: Rule[] = [
      ...getCypressProjectsUpdateRules(application, domain, libraries, tree),
    ];

    rules = rules.concat(removeLibrariesRules(application, domain, libraries));
    if (libraries.includes(DomainLibraryName.Util)) {
      rules.push(removeMockFileResolutionPath(application, domain));
    }
    if (
      isDomainEmptyAfterLibraryRemoval(application, domain, libraries, tree)
    ) {
      rules.push(deleteDomainFolder(application, domain));
      rules.push(deleteDomainConfigProject(application, domain));
    }

    return chain(rules);
  };
}

const getCypressProjectsUpdateRules = (
  application: string,
  domain: string,
  libraries: DomainLibraryName[],
  tree: Tree
): Rule[] => {
  let rules: Rule[] = [];
  [CypressProject.E2E, CypressProject.Storybook].forEach((projectType) => {
    if (isHavingCypressProject(application, domain, projectType, tree)) {
      rules.push(
        removeCypressProjectImplicitDependencies(
          application,
          domain,
          libraries,
          projectType
        )
      );
      if (
        !isHavingImplicitDependenciesAfterRemoval(
          application,
          domain,
          libraries,
          projectType,
          tree
        )
      ) {
        rules = rules.concat(
          removeCypressProject(application, domain, projectType, tree)
        );
      }
    }
  });
  if (
    isHavingCypressProject(application, domain, CypressProject.Storybook, tree)
  ) {
    rules.push(updatePathInStorybookConfig(application, domain));
  }
  return rules;
};
