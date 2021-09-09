import { Tree, convertNxGenerator, logger } from '@nrwl/devkit';
import { RemoveGeneratorSchema } from './schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { getProjectNames } from '../../../shared/utils';
import { removeGenerator as nrwlRemoveGenerator } from '@nrwl/workspace';

export async function removeGenerator(
  tree: Tree,
  options: RemoveGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
  const projectNames = getProjectNames(tree, groupingFolder);
  for (const projectName of projectNames) {
    await nrwlRemoveGenerator(tree, {
      projectName,
      skipFormat: false,
      forceRemove: true,
    }).catch((e: Error) => {
      logger.error(e.message);
      logger.error(e.stack);
      throw e;
    });
  }
  tree.delete(groupingFolder);
}

export default removeGenerator;

export const removeSchematic = convertNxGenerator(removeGenerator);
