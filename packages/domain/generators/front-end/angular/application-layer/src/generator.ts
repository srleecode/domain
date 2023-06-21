import { Tree, convertNxGenerator, formatFiles } from '@nx/devkit';
import { CreateApplicationLayerGeneratorSchema } from './schema';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { addDomainLibrary } from '../../../shared';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  ApplicationType,
  getGroupingFolders,
  validateGroupingFolder,
} from '../../../../shared/utils';

export async function createApplicationLayerGenerator(
  tree: Tree,
  options: CreateApplicationLayerGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
  validateGroupingFolder(tree, groupingFolder);
  const groupingFolders = getGroupingFolders(tree, groupingFolder);
  await addDomainLibrary(
    tree,
    '',
    'application',
    groupingFolder,
    groupingFolders.app,
    ApplicationType.Angular,
    true,
    options
  );
  await formatFiles(tree);
}

export default createApplicationLayerGenerator;

export const createApplicationLayerSchematic = convertNxGenerator(
  createApplicationLayerGenerator
);
