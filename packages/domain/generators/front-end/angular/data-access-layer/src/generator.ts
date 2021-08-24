import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { CreateDataAccessLayerGeneratorSchema } from './schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { addDomainLibrary } from '../../../shared';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ApplicationType } from '../../../../shared/utils';

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
