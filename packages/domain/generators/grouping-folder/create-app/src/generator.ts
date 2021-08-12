import { Tree, convertNxGenerator, getWorkspaceLayout } from '@nrwl/devkit';
import { CreateAppGroupingFolderGeneratorSchema } from './schema';
import { isAppFolderExisting } from './lib/shared/is-app-folder-existing';
import { initialiseWorkspace } from './lib/shared/initialise-workspace';

export async function createAppGroupingFolderGenerator(
  tree: Tree,
  options: CreateAppGroupingFolderGeneratorSchema
): Promise<void> {
  const { applicationType, name } = options;
  if (!isAppFolderExisting(tree, applicationType)) {
    await initialiseWorkspace(tree, applicationType);
  }
  const workspaceLayout = getWorkspaceLayout(tree);
  const baseFolder = workspaceLayout.libsDir;
  const directory = applicationType
    ? `${baseFolder}/${applicationType}-${name}`
    : `${baseFolder}/${name}`;
  tree.write(directory, '');
}

export default createAppGroupingFolderGenerator;

export const removeSchematic = convertNxGenerator(
  createAppGroupingFolderGenerator
);
