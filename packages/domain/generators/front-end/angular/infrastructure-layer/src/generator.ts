import { Tree, convertNxGenerator, formatFiles } from '@nx/devkit';
import { CreateInfrastructureLayerGeneratorSchema } from './schema';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { addDomainLibrary } from '../../../shared';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  ApplicationType,
  getGroupingFolders,
  getProcessedGroupingFolder,
  validateGroupingFolder,
} from '../../../../shared/utils';

export async function createInfrastructureLayerGenerator(
  tree: Tree,
  options: CreateInfrastructureLayerGeneratorSchema,
): Promise<void> {
  let { groupingFolder } = options;
  groupingFolder = getProcessedGroupingFolder(groupingFolder);
  validateGroupingFolder(tree, groupingFolder);
  const groupingFolders = getGroupingFolders(tree, groupingFolder);
  await addDomainLibrary(
    tree,
    '',
    'infrastructure',
    groupingFolder,
    groupingFolders.app,
    ApplicationType.Angular,
    true,
    options,
  );
  await formatFiles(tree);
}

export default createInfrastructureLayerGenerator;

export const createInfrastructureLayeSchematic = convertNxGenerator(
  createInfrastructureLayerGenerator,
);
