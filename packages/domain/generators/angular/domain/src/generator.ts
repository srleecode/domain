import { Tree, convertNxGenerator, logger } from '@nrwl/devkit';
import { CreateDomainGeneratorSchema } from './schema';
import { libraryGenerator } from '@nrwl/angular/src/generators/library/library';
import { getLibraryCommonOptions } from '@srleecode/domain/angular/shared';

export async function createDomainGenerator(
  tree: Tree,
  options: CreateDomainGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
  const libraryCommonOptions = getLibraryCommonOptions(
    tree,
    '',
    'domain',
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

export default createDomainGenerator;

export const removeSchematic = convertNxGenerator(createDomainGenerator);
