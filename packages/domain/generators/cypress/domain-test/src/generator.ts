import { Tree, convertNxGenerator, logger } from '@nrwl/devkit';
import { cypressProjectGenerator } from '@nrwl/cypress';
import { removeUneededCypressProjectFiles } from './lib/remove-uneeded-cypress-project-files';
import { removeDevServerTarget } from './lib/remove-dev-server-target';
import { setProjectToLibraryType } from './lib/set-project-to-library-type';
import { renameCypressProject } from './lib/rename-cypress-project';
import { addImplicitDependencies } from './lib/add-implicit-dependencies';
import { SetupDomainTestGeneratorSchema } from './schema';
import { moveProjectToDomain } from './lib/move-project-to-domain';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  getDomainPath,
  getWorkspaceLayout,
  getDasherizedFolderPath,
} from '../../../shared/utils';
import { addDomainTestEslintTags } from './lib/add-domain-test-eslint-tags';
import { convertE2ETargetToCt } from './lib/convert-e2e-target-to-ct';

export async function setupDomainTestGenerator(
  tree: Tree,
  options: SetupDomainTestGeneratorSchema
): Promise<void> {
  const { groupingFolder, type } = options;
  const dasherisedFolderPath = getDasherizedFolderPath(tree, groupingFolder);
  const { libsDir, standaloneAsDefault, npmScope } = getWorkspaceLayout(tree);
  const domainPath = getDomainPath(tree, groupingFolder);
  await cypressProjectGenerator(tree, {
    baseUrl: './',
    name: `${type}-${dasherisedFolderPath}`,
    directory: domainPath,
    standaloneConfig: standaloneAsDefault,
  }).catch((e: Error) => {
    logger.error(e.message);
    logger.error(e.stack);
    throw e;
  });
  const originalProjectName = `${dasherisedFolderPath}-${type}-${dasherisedFolderPath}`;
  removeDevServerTarget(tree, originalProjectName);
  setProjectToLibraryType(tree, originalProjectName);
  addImplicitDependencies(
    tree,
    originalProjectName,
    groupingFolder,
    dasherisedFolderPath
  );
  addDomainTestEslintTags(tree, originalProjectName, groupingFolder, type);
  await moveProjectToDomain(
    tree,
    originalProjectName,
    domainPath,
    dasherisedFolderPath,
    npmScope,
    type
  ).catch((e) => {
    logger.error(e.message);
    logger.error(e.stack);
    throw e;
  });
  renameCypressProject(tree, dasherisedFolderPath, standaloneAsDefault, type);
  removeUneededCypressProjectFiles(tree, `${libsDir}/${domainPath}/.${type}`);
  if (type === 'ct') {
    convertE2ETargetToCt(tree, dasherisedFolderPath);
  }
}

export default setupDomainTestGenerator;

export const setupDomainTestSchematic = convertNxGenerator(
  setupDomainTestGenerator
);
