import { Tree, convertNxGenerator, logger } from '@nrwl/devkit';
import { CreateUtilGeneratorSchema } from './schema';
import { libraryGenerator } from '@nrwl/angular/src/generators/library/library';
import { getLibraryCommonOptions } from '@srleecode/domain/angular/shared';

export async function createUtilGenerator(
  tree: Tree,
  options: CreateUtilGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
  const libraryCommonOptions = getLibraryCommonOptions(
    tree,
    '',
    'util',
    groupingFolder,
    options
  );
  await libraryGenerator(tree, {
    ...libraryCommonOptions,
  }).catch((e) => {
    logger.error(e.message);
    throw e;
  });
}

export default createUtilGenerator;

export const removeSchematic = convertNxGenerator(createUtilGenerator);
