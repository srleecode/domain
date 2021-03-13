import { logger, Tree, convertNxGenerator } from '@nrwl/devkit';
import { removeCypressProjectGenerator } from '../remove-cypress-project/generator';
import { deleteDomainFolder } from '../shared/lib/delete-domain-folder';
import { removeCypressProjectImplicitDependencies } from '../shared/lib/remove-cypress-project-implicit-dependencies';
import { removeMockFileResolutionPath } from '../shared/lib/remove-mock-file-resolution-path';
import { CypressProject } from '../shared/model/cypress-project.enum';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import {
  isHavingCypressProject,
  isHavingImplicitDependenciesAfterRemoval,
} from '../shared/utils/cypress-project';
import {
  getParsedDomain,
  isDomainEmptyAfterLibraryRemoval,
} from '../shared/utils/domain';
import { getParsedLibraries } from '../shared/utils/libraries';
import { removeDomainInEslintrc } from './lib/remove-domain-in-eslintrc';
import { removeLibraries } from './lib/remove-libraries';
import { RemoveLibrariesGeneratorSchema } from './schema';

export async function removeLibrariesGenerator(
  tree: Tree,
  options: RemoveLibrariesGeneratorSchema
): Promise<void> {
  const { application, domain } = options;
  const libraries = getParsedLibraries(options.libraries);
  if (libraries.length === 0) {
    throw new Error('At least one library should be provided');
  }
  logger.info(
    `Removing ${libraries} from ${application}-${getParsedDomain(domain)}`
  );
  // checkLibrariesExist(tree, application, domain, libraries);
  const cypressProjects = [CypressProject.E2E, CypressProject.Storybook];
  for (const projectType of cypressProjects) {
    if (isHavingCypressProject(application, domain, projectType, tree)) {
      removeCypressProjectImplicitDependencies(
        tree,
        application,
        domain,
        libraries,
        projectType
      );

      if (
        !isHavingImplicitDependenciesAfterRemoval(
          tree,
          application,
          domain,
          libraries,
          projectType
        )
      ) {
        removeCypressProjectGenerator(tree, {
          application,
          domain,
          projectType,
        });
      }
    }
  }

  await removeLibraries(tree, application, domain, libraries).catch((e) => {
    logger.error(e.message);
    throw e;
  });
  if (libraries.includes(DomainLibraryName.Util)) {
    removeMockFileResolutionPath(tree, application, domain);
  }
  if (isDomainEmptyAfterLibraryRemoval(application, domain, libraries, tree)) {
    deleteDomainFolder(tree, application, domain);
    removeDomainInEslintrc(tree, application, domain);
  }
}

export default removeLibrariesGenerator;

export const removeLibrariesSchematic = convertNxGenerator(
  removeLibrariesGenerator
);
