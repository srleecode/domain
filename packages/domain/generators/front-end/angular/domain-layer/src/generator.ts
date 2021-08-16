import { Tree, convertNxGenerator, logger } from '@nrwl/devkit';
import { CreateDomainLayerGeneratorSchema } from './schema';
import { libraryGenerator } from '@nrwl/angular/src/generators/library/library';
import { getLibraryCommonOptions } from '@srleecode/domain/angular/shared';

export async function createDomainLayerGenerator(
  tree: Tree,
  options: CreateDomainLayerGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
  const libraryCommonOptions = getLibraryCommonOptions(
    tree,
    '',
    'domain-layer',
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

export default createDomainLayerGenerator;

export const createDomainLayerSchematic = convertNxGenerator(
  createDomainLayerGenerator
);
