import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { CreateApplicationLayerGeneratorSchema } from './schema';
import { addDomainLibrary } from '@srleecode/domain/front-end/shared';
import { ApplicationType } from '@srleecode/domain/shared/utils';

export async function createApplicationLayerGenerator(
  tree: Tree,
  options: CreateApplicationLayerGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
  await addDomainLibrary(
    tree,
    '',
    'application-layer',
    groupingFolder,
    ApplicationType.Angular,
    options
  );
}

export default createApplicationLayerGenerator;

export const createApplicationLayerSchematic = convertNxGenerator(
  createApplicationLayerGenerator
);
