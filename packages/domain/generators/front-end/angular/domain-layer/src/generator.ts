import { Tree, convertNxGenerator, formatFiles } from '@nx/devkit';
import { CreateDomainLayerGeneratorSchema } from './schema';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { addDomainLibrary } from '../../../shared';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  ApplicationType,
  getGroupingFolders,
  getProcessedGroupingFolder,
  validateGroupingFolder,
} from '../../../../shared/utils';

export async function createDomainLayerGenerator(
  tree: Tree,
  options: CreateDomainLayerGeneratorSchema,
): Promise<void> {
  let { groupingFolder } = options;
  groupingFolder = getProcessedGroupingFolder(groupingFolder);
  validateGroupingFolder(tree, groupingFolder);
  const libraryName = 'domain';
  const groupingFolders = getGroupingFolders(tree, groupingFolder);
  await addDomainLibrary(
    tree,
    '',
    libraryName,
    groupingFolder,
    groupingFolders.app,
    ApplicationType.Angular,
    true,
    options,
  );
  await formatFiles(tree);
}

export default createDomainLayerGenerator;

export const createDomainLayerSchematic = convertNxGenerator(
  createDomainLayerGenerator,
);
