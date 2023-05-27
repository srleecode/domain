import { Tree, convertNxGenerator } from '@nx/devkit';
import { CreateInfrastructureLayerGeneratorSchema } from './schema';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { addDomainLibrary } from '../../../shared';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ApplicationType, getGroupingFolders } from '../../../../shared/utils';

export async function createInfrastructureLayerGenerator(
  tree: Tree,
  options: CreateInfrastructureLayerGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
  const groupingFolders = getGroupingFolders(tree, groupingFolder);
  await addDomainLibrary(
    tree,
    '',
    'infrastructure',
    groupingFolder,
    groupingFolders.app,
    ApplicationType.Angular,
    true,
    options
  );
}

export default createInfrastructureLayerGenerator;

export const createInfrastructureLayeSchematic = convertNxGenerator(
  createInfrastructureLayerGenerator
);
