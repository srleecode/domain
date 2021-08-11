import { Tree, convertNxGenerator, logger } from '@nrwl/devkit';
import { CreateDataAccessGeneratorSchema } from './schema';
import { libraryGenerator } from '@nrwl/angular/src/generators/library/library';
import { getLibraryCommonOptions } from '@srleecode/domain/angular/shared';

export async function createDataAccessGenerator(
  tree: Tree,
  options: CreateDataAccessGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
  const libraryCommonOptions = getLibraryCommonOptions(
    tree,
    '',
    'data-access',
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

export default createDataAccessGenerator;

export const removeSchematic = convertNxGenerator(createDataAccessGenerator);
