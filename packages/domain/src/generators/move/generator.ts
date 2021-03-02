import { MoveGeneratorSchema } from './schema';
import { Tree, logger, convertNxGenerator } from '@nrwl/devkit';
import { checkDomainExists } from '../shared/validation/check-domain-exists';
import { checkDomainDoesntExist } from '../shared/validation/check-domain-doesnt-exist';
import {
  getParsedDomain,
  isDomainHavingLibraryType,
} from '../shared/utils/domain';
import { moveLibraries } from './lib/move-libraries';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { addMockFileResolutionPath } from '../libraries/lib/add-mock-file-resolution-path';
import { removeMockFileResolutionPath } from '../shared/lib/remove-mock-file-resolution-path';
import { CypressProject } from '../shared/model/cypress-project.enum';
import { isHavingCypressProject } from '../shared/utils/cypress-project';
import { moveCypressFiles } from './lib/move-cypress-files';
import { moveStorybookFiles } from './lib/move-storybook-files';
import { moveCypressProject } from './lib/move-cypress-project';
import { updateCypressTsConfigPath } from './lib/update-cypress-ts-config-path';

export async function moveGenerator(
  tree: Tree,
  options: MoveGeneratorSchema
): Promise<void> {
  const { application, domain, newDomain } = options;
  checkDomainExists(application, domain, tree);
  checkDomainDoesntExist(application, newDomain, tree);
  logger.info(
    `Moving ${application}-${getParsedDomain(
      domain
    )} to ${application}-${getParsedDomain(newDomain)}`
  );
  await moveLibraries(tree, application, domain, newDomain);
  if (
    isDomainHavingLibraryType(application, domain, tree, DomainLibraryName.Util)
  ) {
    addMockFileResolutionPath(tree, application, newDomain);
    removeMockFileResolutionPath(tree, application, domain);
  }
  if (
    isHavingCypressProject(application, domain, CypressProject.E2E, tree) ||
    isHavingCypressProject(application, domain, CypressProject.Storybook, tree)
  ) {
    moveCypressFiles(tree, application, domain, newDomain);
  }
  if (isHavingCypressProject(application, domain, CypressProject.E2E, tree)) {
    moveCypressProject(
      tree,
      application,
      domain,
      newDomain,
      CypressProject.E2E
    );
  }
  if (
    isHavingCypressProject(application, domain, CypressProject.Storybook, tree)
  ) {
    moveStorybookFiles(tree, application, domain, newDomain);
    moveCypressProject(
      tree,
      application,
      domain,
      newDomain,
      CypressProject.Storybook
    );
  }
  updateCypressTsConfigPath(tree, application, domain, newDomain);
}

export default moveGenerator;

export const moveSchematic = convertNxGenerator(moveGenerator);
