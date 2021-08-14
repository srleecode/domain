import { Tree, convertNxGenerator, getWorkspaceLayout } from '@nrwl/devkit';
import { cypressProjectGenerator } from '@nrwl/cypress';
import {
  getDasherizedFolderPath,
  getDomainPath,
} from '@srleecode/domain/shared/utils';
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
  const { baseFolder } = options;
  const dasherisedFolderPath = getDasherizedFolderPath(tree, baseFolder);
  const { appsDir, standaloneAsDefault, npmScope } = getWorkspaceLayout(tree);
  const domainPath = getDomainPath(tree, baseFolder);
  await cypressProjectGenerator(tree, {
    name: `e2e-${dasherisedFolderPath}`,
    directory: domainPath,
    standaloneConfig: standaloneAsDefault,
  });
  const originalProjectName = `${dasherisedFolderPath}-e2e-${dasherisedFolderPath}`;
  const originalProjectPath = `${appsDir}/${domainPath}/e2e-${dasherisedFolderPath}`;
  removeUneededCypressProjectFiles(tree, originalProjectPath);
  removeDevServerTarget(tree, originalProjectName);
  setProjectToLibraryType(tree, originalProjectName);
  addImplicitDependencies(
    tree,
    originalProjectName,
    baseFolder,
    dasherisedFolderPath
  );
  await moveProjectToDomain(
    tree,
    originalProjectName,
    domainPath,
    dasherisedFolderPath,
    npmScope
  );
  renameCypressProject(tree, dasherisedFolderPath, standaloneAsDefault);
}

export default cypressProjectGenerator;

export const cypressProjectSchematic = convertNxGenerator(
  cypressProjectGenerator
);
