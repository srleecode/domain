import { Tree, convertNxGenerator, logger } from '@nrwl/devkit';
import { CreateApplicationLayerGeneratorSchema } from './schema';
import { libraryGenerator } from '@nrwl/angular/src/generators/library/library';
import { getLibraryCommonOptions } from '@srleecode/domain/angular/shared';

export async function createApplicationLayerGenerator(
  tree: Tree,
  options: CreateApplicationLayerGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
  const libraryCommonOptions = getLibraryCommonOptions(
    tree,
    '',
    'application-layer',
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

export default createApplicationLayerGenerator;

export const createDomainLayerSchematic = convertNxGenerator(
  createApplicationLayerGenerator
);
