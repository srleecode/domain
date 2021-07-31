import { Tree, convertNxGenerator, logger } from '@nrwl/devkit';
import { RemoveGeneratorSchema } from './schema';
import { getProjectNames } from '@srleecode/domain/shared';
import { removeGenerator as nrwlRemoveGenerator } from '@nrwl/workspace';

export async function removeGenerator(
  tree: Tree,
  options: RemoveGeneratorSchema
): Promise<void> {
  const { folder } = options;
  const projectNames = getProjectNames(tree, folder);
  for (const projectName of projectNames) {
    await nrwlRemoveGenerator(tree, {
      projectName,
      skipFormat: false,
      forceRemove: true,
    }).catch((e) => {
      logger.error(e.message);
      throw e;
    });
  }
}

export default removeGenerator;

export const removeSchematic = convertNxGenerator(removeGenerator);
