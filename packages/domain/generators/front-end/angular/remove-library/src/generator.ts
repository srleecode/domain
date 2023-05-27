import { Tree, convertNxGenerator, logger } from '@nx/devkit';
import { RemoveLibraryGeneratorSchema } from './schema';
import { removeGenerator } from '@nx/workspace';
// eslint-disable-next-line @nx/enforce-module-boundaries
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
  }).catch((e: Error) => {
    logger.error(e.message);
    logger.error(e.stack);
    throw e;
  });
}

export default removeLibraryGenerator;

export const removeLibrarySchematic = convertNxGenerator(
  removeLibraryGenerator
);
