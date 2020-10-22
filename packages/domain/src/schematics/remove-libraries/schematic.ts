import {
  chain,
  Rule,
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
import { removeCypressProject } from '../shared/rule/remove-cypress-project';
import { removeCypressProjectImplicitDependencies } from '../shared/rule/remove-cypress-project-implicit-dependencies';
import { isDomainEmptyAfterLibraryRemoval } from '../../utils/domain';
import { deleteDomainFolder } from '../shared/rule/delete-domain-folder';
import { CypressProject } from '../shared/model/cypress-project.enum';
import { ProjectType } from '@nrwl/workspace';
import { updatePathInStorybookConfig } from '../shared/rule/update-path-in-storybook-config';

export default function (options: RemoveLibrariesSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext): Rule => {
    const { application, domain, libraries } = options;
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
