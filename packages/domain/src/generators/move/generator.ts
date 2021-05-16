import { MoveGeneratorSchema } from './schema';
import { Tree, logger, convertNxGenerator } from '@nrwl/devkit';
import { checkDomainExists } from '../shared/validation/check-domain-exists';
import { getParsedDomain } from '../shared/utils/domain';
import { getMoveLibrarySchemas } from './lib/get-move-library-schemas';
import { CypressProject } from '../shared/model/cypress-project.enum';
import { isHavingCypressProject } from '../shared/utils/cypress-project';
import { moveCypressProject } from './lib/move-cypress-project';
import { updateCypressTsConfigPath } from './lib/update-cypress-ts-config-path';
import { updateMockFileResolutionPath } from './lib/update-mock-file-resolution-path';
import { renameDomainInNxJson } from './lib/rename-domain-in-nx-json';
import { deleteDomainFolder } from '../shared/lib/delete-domain-folder';
import { moveDomainInEslintrc } from './lib/move-domain-in-eslintrc';
import { checkDomainDoesNotExist } from '../shared/validation/check-domain-does-not-exist';
import { copyCypressFiles } from './lib/move-cypress-files';
import { copyStorybookFiles } from './lib/move-storybook-files';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';
import { renameDomainInJestConfig } from './lib/rename-domain-in-jest-config';
import { updateDomainInAngularJson } from './lib/update-domain-in-angular-json';

export async function moveGenerator(
  tree: Tree,
  options: MoveGeneratorSchema
): Promise<void> {
  const { application, domain, newDomain } = options;
  checkDomainExists(application, domain, tree);
  checkDomainDoesNotExist(application, newDomain, tree);
  logger.info(
    `Moving ${application}-${getParsedDomain(
      domain
    )} to ${application}-${getParsedDomain(newDomain)}`
  );
  updateMockFileResolutionPath(tree, application, domain, newDomain);
  if (
    isHavingCypressProject(application, domain, CypressProject.E2E, tree) ||
    isHavingCypressProject(application, domain, CypressProject.Storybook, tree)
  ) {
    copyCypressFiles(tree, application, domain, newDomain);
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
    copyStorybookFiles(tree, application, domain, newDomain);
    moveCypressProject(
      tree,
      application,
      domain,
      newDomain,
      CypressProject.Storybook
    );
  }
  const moveLibrarySchemas = getMoveLibrarySchemas(
    tree,
    application,
    domain,
    newDomain
  );
  const moveLibraryGenerator = wrapAngularDevkitSchematic(
    '@nrwl/angular',
    'move'
  );
  for (const schema of moveLibrarySchemas) {
    await moveLibraryGenerator(tree, schema).catch((e) => {
      logger.error(e.message);
      throw e;
    });
  }
  renameDomainInNxJson(tree, application, domain, newDomain);
  updateCypressTsConfigPath(tree, application, domain, newDomain);
  deleteDomainFolder(tree, application, domain);
  moveDomainInEslintrc(tree, application, domain, newDomain);
  renameDomainInJestConfig(tree, application, domain, newDomain);
  updateDomainInAngularJson(tree, application, domain, newDomain);
}

export default moveGenerator;

export const moveSchematic = convertNxGenerator(moveGenerator);
