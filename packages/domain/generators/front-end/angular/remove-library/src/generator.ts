import { Tree, convertNxGenerator, logger } from '@nrwl/devkit';
import { RemoveLibraryGeneratorSchema } from './schema';
import { removeGenerator } from '@nrwl/workspace';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { getDasherizedFolderPath } from '../../../../shared/utils';

export async function removeLibraryGenerator(
  tree: Tree,
  options: RemoveLibraryGeneratorSchema
): Promise<void> {
  const projectName = getDasherizedFolderPath(tree, options.libraryFolder);
  await removeGenerator(tree, {
    projectName,
    skipFormat: false,
    forceRemove: true,
  }).catch((e) => {
    logger.error(e.message);
    throw e;
  });
}

export default removeLibraryGenerator;

export const removeLibrarySchematic = convertNxGenerator(
  removeLibraryGenerator
);
