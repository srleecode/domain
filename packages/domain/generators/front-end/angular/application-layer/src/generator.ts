import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { CreateApplicationLayerGeneratorSchema } from './schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { addDomainLibrary } from '../../../shared';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ApplicationType, getGroupingFolders } from '../../../../shared/utils';

export async function createApplicationLayerGenerator(
  tree: Tree,
  options: CreateApplicationLayerGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
  const groupingFolders = getGroupingFolders(tree, groupingFolder);
  await addDomainLibrary(
    tree,
    '',
    'application-layer',
    groupingFolder,
    groupingFolders.app,
    ApplicationType.Angular,
    options
  );
}

export default createApplicationLayerGenerator;

export const createApplicationLayerSchematic = convertNxGenerator(
  createApplicationLayerGenerator
);
