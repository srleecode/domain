import {
  Tree,
  convertNxGenerator,
  getWorkspaceLayout,
  logger,
} from '@nrwl/devkit';
import { cypressProjectGenerator } from '@nrwl/cypress';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { getDasherizedFolderPath, getDomainPath } from '../../../shared/utils';
import { CreateE2EGeneratorSchema } from './schema';
import { removeUneededCypressProjectFiles } from './lib/remove-uneeded-cypress-project-files';
import { removeDevServerTarget } from './lib/remove-dev-server-target';
import { setProjectToLibraryType } from './lib/set-project-to-library-type';
import { moveProjectToDomain } from './lib/move-project-to-domain';
import { renameCypressProject } from './lib/rename-cypress-project';
import { addImplicitDependencies } from './lib/add-implicit-dependencies';

export async function cypressE2EGenerator(
  tree: Tree,
  options: CreateE2EGeneratorSchema
) {
  const { groupingFolder } = options;
  const dasherisedFolderPath = getDasherizedFolderPath(tree, groupingFolder);
  const { appsDir, standaloneAsDefault, npmScope } = getWorkspaceLayout(tree);
  const domainPath = getDomainPath(tree, groupingFolder);
  await cypressProjectGenerator(tree, {
    name: `e2e-${dasherisedFolderPath}`,
    directory: domainPath,
    standaloneConfig: standaloneAsDefault,
  }).catch((e) => {
    logger.error(e.message);
    throw e;
  });
  const originalProjectName = `${dasherisedFolderPath}-e2e-${dasherisedFolderPath}`;
  const originalProjectPath = `${appsDir}/${domainPath}/e2e-${dasherisedFolderPath}`;
  removeUneededCypressProjectFiles(tree, originalProjectPath);
  removeDevServerTarget(tree, originalProjectName);
  setProjectToLibraryType(tree, originalProjectName);
  addImplicitDependencies(
    tree,
    originalProjectName,
    groupingFolder,
    dasherisedFolderPath
  );
  await moveProjectToDomain(
    tree,
    originalProjectName,
    domainPath,
    dasherisedFolderPath,
    npmScope
  ).catch((e) => {
    logger.error(e.message);
    throw e;
  });
  renameCypressProject(tree, dasherisedFolderPath, standaloneAsDefault);
}

export default cypressProjectGenerator;

export const cypressProjectSchematic = convertNxGenerator(
  cypressProjectGenerator
);
