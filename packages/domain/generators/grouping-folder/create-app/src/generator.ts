import { Tree, convertNxGenerator, formatFiles } from '@nx/devkit';
import { CreateAppGroupingFolderGeneratorSchema } from './schema';
import { isAppFolderExisting } from './lib/shared/is-app-folder-existing';
import { initialiseWorkspace } from './lib/shared/initialise-workspace';
import { mkdirSync } from 'fs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { getWorkspaceLayout } from '../../../shared/utils/src/get-workspace-layout';

export async function createAppGroupingFolderGenerator(
  tree: Tree,
  options: CreateAppGroupingFolderGeneratorSchema
) {
  const { applicationType, name } = options;
  if (!isAppFolderExisting(tree, applicationType)) {
    await initialiseWorkspace(tree, applicationType);
  }
  const workspaceLayout = getWorkspaceLayout(tree);
  const libsDir = workspaceLayout.libsDir;
  const directory = applicationType
    ? `${libsDir}/${applicationType}-${name}`
    : `${libsDir}/${name}`;
  await formatFiles(tree);
  return () => {
    mkdirSync(directory);
  };
}

export default createAppGroupingFolderGenerator;

export const createAppGroupingFolderSchematic = convertNxGenerator(
  createAppGroupingFolderGenerator
);
