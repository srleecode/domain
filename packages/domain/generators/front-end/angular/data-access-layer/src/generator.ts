import { Tree, convertNxGenerator, logger } from '@nrwl/devkit';
import { CreateDataAccessLayerGeneratorSchema } from './schema';
import { libraryGenerator } from '@nrwl/angular/src/generators/library/library';
import { getLibraryCommonOptions } from '@srleecode/domain/angular/shared';

export async function createDataAccessLayerGenerator(
  tree: Tree,
  options: CreateDataAccessLayerGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
  const libraryCommonOptions = getLibraryCommonOptions(
    tree,
    '',
    'data-access-layer',
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

export default createDataAccessLayerGenerator;

export const createDataAccessLayeSchematic = convertNxGenerator(
  createDataAccessLayerGenerator
);
