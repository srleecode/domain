import { Tree, convertNxGenerator, logger } from '@nrwl/devkit';
import { CreateDomainLayerGeneratorSchema } from './schema';
import { libraryGenerator } from '@nrwl/angular/src/generators/library/library';
import { getLibraryCommonOptions } from '@srleecode/domain/angular/shared';
import { removeTestTarget } from '@srleecode/domain/front-end/shared';
import { getDasherizedFolderPath } from '@srleecode/domain/shared/utils';

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
  const domain = getDasherizedFolderPath(tree, groupingFolder);
  removeTestTarget(tree, `${domain}-${libraryCommonOptions.name}`);
}

export default createDomainLayerGenerator;

export const createDomainLayerSchematic = convertNxGenerator(
  createDomainLayerGenerator
);
