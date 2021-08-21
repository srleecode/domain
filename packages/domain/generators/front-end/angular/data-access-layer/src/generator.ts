import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { CreateDataAccessLayerGeneratorSchema } from './schema';
import { addDomainLibrary } from '@srleecode/domain/front-end/shared';
import { ApplicationType } from '@srleecode/domain/shared/utils';

export async function createDataAccessLayerGenerator(
  tree: Tree,
  options: CreateDataAccessLayerGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
  await addDomainLibrary(
    tree,
    '',
    'data-access-layer',
    groupingFolder,
    ApplicationType.Angular,
    options
  );
}

export default createDataAccessLayerGenerator;

export const createDataAccessLayeSchematic = convertNxGenerator(
  createDataAccessLayerGenerator
);
